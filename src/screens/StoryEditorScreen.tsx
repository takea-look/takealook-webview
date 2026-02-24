import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEditorController } from '../features/story-editor/core/useEditorController';
import { StoryStage } from '../features/story-editor/react/StoryStage';
import { useElementSize } from '../features/story-editor/react/useElementSize';
import type { Layer } from '../features/story-editor/core/types';
import { useWebSocket } from '../hooks/useWebSocket';
import { getMyProfile } from '../api/user';
import { getPublicImageUrl, getUploadUrl, uploadToR2 } from '../api/storage';
import { getStickerCategories, type StickerCategory } from '../api/stickerCategories';
import { getStickers, type Sticker } from '../api/stickers';
import { StickerPickerSheet } from '../features/story-editor/react/StickerPickerSheet';

export function StoryEditorScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialBaseSrc = query.get('src');
  const roomIdParam = query.get('roomId');
  const replyToIdParam = query.get('replyToId');

  const replyRoomId = roomIdParam ? Number(roomIdParam) : null;
  const replyToId = replyToIdParam ? Number(replyToIdParam) : null;
  const isReplyFlow = Number.isFinite(replyRoomId) && Number.isFinite(replyToId);

  const { controller, state } = useEditorController(initialBaseSrc ? { baseSrc: initialBaseSrc } : undefined);

  useEffect(() => {
    controller.setBaseImage(initialBaseSrc ?? null);
    setSrcProbeStatus(initialBaseSrc ? 'idle' : 'error');
  }, [controller, initialBaseSrc]);

  const {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
  } = useWebSocket();

  const [senderId, setSenderId] = useState<number | null>(null);
  const [sendError, setSendError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [srcProbeStatus, setSrcProbeStatus] = useState<'idle' | 'loaded' | 'error'>('idle');

  const stageHostRef = useRef<HTMLDivElement | null>(null);
  const { width, height } = useElementSize(stageHostRef);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastObjectUrlRef = useRef<string | null>(null);

  const [textEditorOpen, setTextEditorOpen] = useState(false);
  const [textDraft, setTextDraft] = useState('');

  const [stickerPickerOpen, setStickerPickerOpen] = useState(false);
  const [stickerCategories, setStickerCategories] = useState<StickerCategory[]>([]);
  const [selectedStickerCategoryId, setSelectedStickerCategoryId] = useState<number | null>(null);
  const [stickerItems, setStickerItems] = useState<Sticker[]>([]);
  const [loadingStickerCategories, setLoadingStickerCategories] = useState(false);
  const [loadingStickers, setLoadingStickers] = useState(false);
  const [stickerPickerError, setStickerPickerError] = useState('');

  const selectedLayer: Layer | null = useMemo(() => {
    if (!state.selectedId) return null;
    return state.layers.find(l => l.id === state.selectedId) ?? null;
  }, [state.layers, state.selectedId]);

  const exporting = state.exportRequest != null;

  useEffect(() => {
    return () => {
      if (lastObjectUrlRef.current) URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isReplyFlow || replyRoomId == null) return;

    const init = async () => {
      try {
        const profile = await getMyProfile();
        setSenderId(profile.id ?? null);
        await connect(replyRoomId);
      } catch (err) {
        console.error('Failed to init reply flow:', err);
        setSendError('전송 준비에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    };

    init();

    return () => {
      disconnect();
    };
  }, [isReplyFlow, replyRoomId, connect, disconnect]);

  const loadStickerCategories = async () => {
    setLoadingStickerCategories(true);
    setStickerPickerError('');
    try {
      const categories = await getStickerCategories();
      setStickerCategories(categories);
      setSelectedStickerCategoryId(prev => {
        if (prev != null && categories.some(category => category.id === prev)) return prev;
        return categories[0]?.id ?? null;
      });
      if (categories.length === 0) {
        setStickerItems([]);
      }
    } catch (err) {
      console.error('Failed to load sticker categories:', err);
      setStickerPickerError('스티커 카테고리를 불러오지 못했어요.');
    } finally {
      setLoadingStickerCategories(false);
    }
  };

  const loadStickersByCategory = async (categoryId: number) => {
    setLoadingStickers(true);
    setStickerPickerError('');
    try {
      const stickers = await getStickers({ categoryId });
      setStickerItems(stickers);
    } catch (err) {
      console.error('Failed to load stickers:', err);
      setStickerPickerError('스티커를 불러오지 못했어요.');
      setStickerItems([]);
    } finally {
      setLoadingStickers(false);
    }
  };

  useEffect(() => {
    if (!stickerPickerOpen) return;
    void loadStickerCategories();
  }, [stickerPickerOpen]);

  useEffect(() => {
    if (!stickerPickerOpen || selectedStickerCategoryId == null) return;
    void loadStickersByCategory(selectedStickerCategoryId);
  }, [stickerPickerOpen, selectedStickerCategoryId]);

  const openTextEditor = () => {
    if (!selectedLayer || selectedLayer.kind !== 'text') return;
    setTextDraft(selectedLayer.text);
    setTextEditorOpen(true);
  };

  const loadFromFile = (file: File) => {
    if (lastObjectUrlRef.current) URL.revokeObjectURL(lastObjectUrlRef.current);
    const url = URL.createObjectURL(file);
    lastObjectUrlRef.current = url;
    controller.setBaseImage(url);
  };

  const runExport = async () => {
    try {
      setSendError('');

      const blob = await controller.requestExport({ mime: 'image/png', pixelRatio: 2 });

      if (!isReplyFlow) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `story_${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      if (replyRoomId == null || replyToId == null || senderId == null) {
        setSendError('전송 정보가 부족합니다. 뒤로 갔다가 다시 시도해주세요.');
        return;
      }

      if (!isConnected) {
        setSendError(connectionStatus === 'reconnecting' ? '재연결 중입니다. 잠시만 기다려주세요.' : '채팅 연결이 끊겨있어요. 잠시 후 다시 시도해주세요.');
        return;
      }

      setIsSending(true);
      const file = new File([blob], `reply_${Date.now()}.png`, { type: 'image/png' });
      const { url: presignedUrl, key, canonicalUrl, headers } = await getUploadUrl(replyRoomId, file.type, blob.size);
      await uploadToR2(presignedUrl, file, undefined, headers);
      const imageUrl = canonicalUrl || getPublicImageUrl(key);

      sendMessage(replyRoomId, imageUrl, senderId, replyToId);
      navigate(`/chat/${replyRoomId}`);
    } catch (err) {
      console.error('Export/send failed:', err);
      setSendError('전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      <header
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          height: '56px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '12px',
          paddingRight: '12px',
          color: '#fff',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.92), rgba(0,0,0,0.65))',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={iconButtonStyle}
          aria-label="Back"
          type="button"
        >
          ←
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, letterSpacing: '0.2px' }}>{isReplyFlow ? '사진 답장' : 'Story Editor'}</div>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={textButtonStyle}
          type="button"
        >
          Image
        </button>
      </header>

      <div
        ref={stageHostRef}
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          touchAction: 'none',
        }}
      >
        <StoryStage state={state} controller={controller} viewportWidth={width} viewportHeight={height} />

        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 9999,
            maxWidth: '88vw',
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            padding: '8px 10px',
            fontSize: 11,
            lineHeight: 1.35,
          }}
        >
          <div><b>Story src probe</b></div>
          <div>query src: {initialBaseSrc ? initialBaseSrc.slice(0, 90) : '(none)'}</div>
          <div>state src: {state.base.src ? state.base.src.slice(0, 90) : '(none)'}</div>
          <div>img load: {srcProbeStatus}</div>
        </div>

        {initialBaseSrc ? (
          <img
            src={initialBaseSrc}
            alt="src-probe"
            style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
            onLoad={() => setSrcProbeStatus('loaded')}
            onError={() => setSrcProbeStatus('error')}
          />
        ) : null}
      </div>

      <footer
        style={{
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
          paddingTop: '12px',
          paddingLeft: '12px',
          paddingRight: '12px',
          boxSizing: 'border-box',
          borderTop: '1px solid rgba(255,255,255,0.10)',
          background: 'linear-gradient(to top, rgba(0,0,0,0.92), rgba(0,0,0,0.65))',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {sendError ? (
            <div style={{ width: '100%', textAlign: 'center', color: '#F04452', fontSize: 13, fontWeight: 700 }}>
              {sendError}
            </div>
          ) : null}
          <button onClick={() => controller.addText({ text: 'Text' })} style={pillStyle} type="button">
            Text
          </button>
          <button onClick={() => setStickerPickerOpen(true)} style={pillStyle} type="button">
            Sticker
          </button>
          <button onClick={() => controller.undo()} style={pillStyle} disabled={!controller.canUndo()} type="button">
            Undo
          </button>
          <button onClick={() => controller.redo()} style={pillStyle} disabled={!controller.canRedo()} type="button">
            Redo
          </button>
          <button onClick={() => controller.deleteSelected()} style={pillStyle} disabled={!state.selectedId} type="button">
            Delete
          </button>
          <button
            onClick={() => state.selectedId && controller.bringToFront(state.selectedId)}
            style={pillStyle}
            disabled={!state.selectedId}
            type="button"
          >
            Front
          </button>
          <button
            onClick={openTextEditor}
            style={pillStyle}
            disabled={!selectedLayer || selectedLayer.kind !== 'text'}
            type="button"
          >
            Edit
          </button>
          <button onClick={runExport} style={primaryPillStyle} disabled={exporting || isSending} type="button">
            {exporting || isSending ? (isReplyFlow ? '전송 중…' : 'Exporting…') : (isReplyFlow ? '전송' : 'Export')}
          </button>
        </div>
      </footer>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (!file) return;
          loadFromFile(file);
          e.currentTarget.value = '';
        }}
      />

      <StickerPickerSheet
        open={stickerPickerOpen}
        categories={stickerCategories}
        stickers={stickerItems}
        selectedCategoryId={selectedStickerCategoryId}
        loadingCategories={loadingStickerCategories}
        loadingStickers={loadingStickers}
        errorMessage={stickerPickerError}
        onClose={() => setStickerPickerOpen(false)}
        onRetry={() => {
          if (selectedStickerCategoryId != null) {
            void loadStickersByCategory(selectedStickerCategoryId);
            return;
          }
          void loadStickerCategories();
        }}
        onSelectCategory={categoryId => setSelectedStickerCategoryId(categoryId)}
        onPickSticker={sticker => {
          controller.addSticker({
            src: sticker.imageUrl,
            at: {
              x: Math.max(60, width / 2),
              y: Math.max(60, height / 2),
            },
          });
          setStickerPickerOpen(false);
        }}
      />

      {textEditorOpen && selectedLayer?.kind === 'text' ? (
        <div style={modalOverlayStyle} role="dialog" aria-modal="true">
          <div style={modalStyle}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Edit text</div>
            <textarea
              value={textDraft}
              onChange={e => setTextDraft(e.target.value)}
              rows={4}
              style={textareaStyle}
              autoFocus={true}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
              <button
                onClick={() => setTextEditorOpen(false)}
                style={pillStyle}
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  controller.setText(selectedLayer.id, textDraft);
                  setTextEditorOpen(false);
                }}
                style={primaryPillStyle}
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const iconButtonStyle: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  fontSize: 18,
  padding: 0,
  lineHeight: '40px',
};

const textButtonStyle: CSSProperties = {
  height: 40,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  fontSize: 14,
  padding: '0 12px',
};

const pillStyle: CSSProperties = {
  height: 38,
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  fontSize: 13,
  padding: '0 14px',
};

const primaryPillStyle: CSSProperties = {
  ...pillStyle,
  border: '1px solid rgba(255,255,255,0.25)',
  background: 'rgba(99, 102, 241, 0.90)',
};

const modalOverlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  zIndex: 10,
};

const modalStyle: CSSProperties = {
  width: 'min(520px, 100%)',
  borderRadius: 16,
  background: '#111',
  border: '1px solid rgba(255,255,255,0.12)',
  padding: 14,
  color: '#fff',
  boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
};

const textareaStyle: CSSProperties = {
  width: '100%',
  resize: 'none',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  padding: 10,
  boxSizing: 'border-box',
  outline: 'none',
  fontSize: 14,
  lineHeight: 1.4,
};
