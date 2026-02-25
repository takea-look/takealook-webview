import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { useEditorController } from '../features/story-editor/core/useEditorController';
import { StoryStage } from '../features/story-editor/react/StoryStage';
import { useElementSize } from '../features/story-editor/react/useElementSize';
import type { Layer, StickerLayer, TextLayer } from '../features/story-editor/core/types';
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
  const [exportPreviewUrl, setExportPreviewUrl] = useState<string | null>(null);
  const [exportPreviewDataUrl, setExportPreviewDataUrl] = useState<string | null>(null);

  const stageHostRef = useRef<HTMLDivElement | null>(null);
  const { width, height } = useElementSize(stageHostRef);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastObjectUrlRef = useRef<string | null>(null);
  const exportPreviewUrlRef = useRef<string | null>(null);
  const stickerObjectUrlsRef = useRef<string[]>([]);

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

  const stickerLayers = useMemo(
    () => state.layers.filter((l): l is StickerLayer => l.kind === 'sticker'),
    [state.layers],
  );
  const textLayers = useMemo(
    () => state.layers.filter((l): l is TextLayer => l.kind === 'text'),
    [state.layers],
  );

  const storyScale = useMemo(() => {
    if (width <= 0 || height <= 0) return 0;
    return Math.min(width / 1080, height / 1920);
  }, [width, height]);

  const storyRenderW = 1080 * storyScale;
  const storyRenderH = 1920 * storyScale;
  const storyOffsetX = (width - storyRenderW) / 2;
  const storyOffsetY = (height - storyRenderH) / 2;

  const dragRef = useRef<{ id: string; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const stickerGestureLayerIdRef = useRef<string | null>(null);
  const stickerPointersRef = useRef<Record<number, { x: number; y: number }>>({});
  const stickerDragRef = useRef<{ id: string; pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const stickerPinchRef = useRef<{
    id: string;
    startDistance: number;
    startScale: number;
    startAngle: number;
    startRotation: number;
  } | null>(null);
  const [liveTransforms, setLiveTransforms] = useState<Record<string, Layer['transform']>>({});
  const liveTransformsRef = useRef<Record<string, Layer['transform']>>({});

  const beginLayerDrag = (layer: Layer, e: React.PointerEvent) => {
    if (storyScale <= 0) return;
    e.preventDefault();
    e.stopPropagation();
    const t = getEffectiveTransform(layer);
    dragRef.current = {
      id: layer.id,
      startX: e.clientX,
      startY: e.clientY,
      originX: t.position.x,
      originY: t.position.y,
    };
    setLiveTransform(layer.id, t);
    controller.select(layer.id);
  };

  const moveLayerDrag = (e: React.PointerEvent) => {
    if (!dragRef.current || storyScale <= 0) return;
    const dx = (e.clientX - dragRef.current.startX) / storyScale;
    const dy = (e.clientY - dragRef.current.startY) / storyScale;
    const prev = liveTransformsRef.current[dragRef.current.id] ?? {
      position: { x: dragRef.current.originX, y: dragRef.current.originY },
      scale: 1,
      rotation: 0,
    };
    setLiveTransform(dragRef.current.id, {
      ...prev,
      position: {
        x: dragRef.current.originX + dx,
        y: dragRef.current.originY + dy,
      },
    });
  };

  const endLayerDrag = () => {
    if (dragRef.current) {
      const id = dragRef.current.id;
      const live = liveTransformsRef.current[id];
      if (live) {
        controller.setTransform(id, live);
        clearLiveTransform(id);
      }
    }
    dragRef.current = null;
  };

  const setLiveTransform = (id: string, next: Layer['transform']) => {
    liveTransformsRef.current = { ...liveTransformsRef.current, [id]: next };
    setLiveTransforms(liveTransformsRef.current);
  };

  const clearLiveTransform = (id: string) => {
    const next = { ...liveTransformsRef.current };
    delete next[id];
    liveTransformsRef.current = next;
    setLiveTransforms(next);
  };

  const getEffectiveTransform = (layer: Layer) => liveTransforms[layer.id] ?? layer.transform;

  const resetStickerGesture = () => {
    stickerGestureLayerIdRef.current = null;
    stickerPointersRef.current = {};
    stickerDragRef.current = null;
    stickerPinchRef.current = null;
  };

  const handleStickerPointerDown = (layer: StickerLayer, e: React.PointerEvent) => {
    if (storyScale <= 0) return;
    e.preventDefault();
    e.stopPropagation();

    if (stickerGestureLayerIdRef.current && stickerGestureLayerIdRef.current !== layer.id) {
      resetStickerGesture();
    }

    stickerGestureLayerIdRef.current = layer.id;
    stickerPointersRef.current[e.pointerId] = { x: e.clientX, y: e.clientY };

    const pointerIds = Object.keys(stickerPointersRef.current).map(Number);
    const t = getEffectiveTransform(layer);
    setLiveTransform(layer.id, t);
    controller.select(layer.id);

    if (pointerIds.length >= 2) {
      const [a, b] = pointerIds;
      const p1 = stickerPointersRef.current[a];
      const p2 = stickerPointersRef.current[b];
      if (p1 && p2) {
        const startDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
        const startAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        const t2 = getEffectiveTransform(layer);
        stickerPinchRef.current = {
          id: layer.id,
          startDistance,
          startScale: t2.scale,
          startAngle,
          startRotation: t2.rotation,
        };
        stickerDragRef.current = null;
      }
      return;
    }

    const t3 = getEffectiveTransform(layer);
    stickerDragRef.current = {
      id: layer.id,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: t3.position.x,
      originY: t3.position.y,
    };
  };

  const handleStickerPointerMove = (layer: StickerLayer, e: React.PointerEvent) => {
    if (storyScale <= 0) return;
    if (stickerGestureLayerIdRef.current !== layer.id) return;
    if (!(e.pointerId in stickerPointersRef.current)) return;

    stickerPointersRef.current[e.pointerId] = { x: e.clientX, y: e.clientY };

    const pointerIds = Object.keys(stickerPointersRef.current).map(Number);
    if (pointerIds.length >= 2 && stickerPinchRef.current?.id === layer.id) {
      const [a, b] = pointerIds;
      const p1 = stickerPointersRef.current[a];
      const p2 = stickerPointersRef.current[b];
      if (!p1 || !p2) return;

      const currentDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
      const ratio = currentDistance / stickerPinchRef.current.startDistance;
      const nextScale = Math.min(5, Math.max(0.2, stickerPinchRef.current.startScale * ratio));

      const currentAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const angleDelta = currentAngle - stickerPinchRef.current.startAngle;
      const nextRotation = stickerPinchRef.current.startRotation + angleDelta;

      const prev = liveTransformsRef.current[layer.id] ?? getEffectiveTransform(layer);
      setLiveTransform(layer.id, {
        ...prev,
        scale: nextScale,
        rotation: nextRotation,
      });
      return;
    }

    if (stickerDragRef.current && stickerDragRef.current.id === layer.id && stickerDragRef.current.pointerId === e.pointerId) {
      const dx = (e.clientX - stickerDragRef.current.startX) / storyScale;
      const dy = (e.clientY - stickerDragRef.current.startY) / storyScale;
      const prev = liveTransformsRef.current[layer.id] ?? getEffectiveTransform(layer);
      setLiveTransform(layer.id, {
        ...prev,
        position: {
          x: stickerDragRef.current.originX + dx,
          y: stickerDragRef.current.originY + dy,
        },
      });
    }
  };

  const handleStickerPointerUp = (layer: StickerLayer, e: React.PointerEvent) => {
    if (stickerGestureLayerIdRef.current !== layer.id) return;

    delete stickerPointersRef.current[e.pointerId];

    if (stickerDragRef.current?.pointerId === e.pointerId) {
      stickerDragRef.current = null;
    }

    const remaining = Object.keys(stickerPointersRef.current).length;
    if (remaining < 2) {
      stickerPinchRef.current = null;
    }
    if (remaining === 0) {
      const live = liveTransformsRef.current[layer.id];
      if (live) {
        controller.setTransform(layer.id, live);
        clearLiveTransform(layer.id);
      }
      resetStickerGesture();
    }
  };

  const exporting = state.exportRequest != null;

  useEffect(() => {
    return () => {
      if (lastObjectUrlRef.current) URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
      if (exportPreviewUrlRef.current) URL.revokeObjectURL(exportPreviewUrlRef.current);
      exportPreviewUrlRef.current = null;
      for (const url of stickerObjectUrlsRef.current) {
        URL.revokeObjectURL(url);
      }
      stickerObjectUrlsRef.current = [];
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

  const resolveStickerRenderableSrc = async (url: string): Promise<string> => {
    try {
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) return url;
      const blob = await res.blob();
      if (!blob || blob.size === 0) return url;
      const objectUrl = URL.createObjectURL(blob);
      stickerObjectUrlsRef.current.push(objectUrl);
      return objectUrl;
    } catch {
      return url;
    }
  };

  const blobToDataUrl = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

  const runExport = async () => {
    try {
      setSendError('');

      let blob: Blob | null = null;

      // 1) Prefer DOM capture (includes fallback overlays)
      if (stageHostRef.current) {
        try {
          const canvas = await html2canvas(stageHostRef.current, {
            backgroundColor: '#000',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
          });
          blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
        } catch {
          blob = null;
        }
      }

      // 2) Fallback to Konva export if DOM capture failed
      if (!blob) {
        blob = await controller.requestExport({ mime: 'image/png', pixelRatio: 2 });
      }

      if (!blob) {
        throw new Error('Export blob unavailable');
      }

      if (!isReplyFlow) {
        if (exportPreviewUrlRef.current) {
          URL.revokeObjectURL(exportPreviewUrlRef.current);
        }
        const url = URL.createObjectURL(blob);
        exportPreviewUrlRef.current = url;
        setExportPreviewUrl(url);

        // In some in-app webviews, blob: preview rendering is blocked.
        // Fallback to data URL for reliable modal preview.
        try {
          const dataUrl = await blobToDataUrl(blob);
          setExportPreviewDataUrl(dataUrl);
        } catch {
          setExportPreviewDataUrl(null);
        }
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

  const closeExportPreview = () => {
    if (exportPreviewUrlRef.current) {
      URL.revokeObjectURL(exportPreviewUrlRef.current);
      exportPreviewUrlRef.current = null;
    }
    setExportPreviewUrl(null);
    setExportPreviewDataUrl(null);
  };

  const downloadExportPreview = () => {
    if (!exportPreviewUrl) return;
    const a = document.createElement('a');
    a.href = exportPreviewUrl;
    a.download = `story_${Date.now()}.png`;
    a.click();
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
        onPointerMove={moveLayerDrag}
        onPointerUp={endLayerDrag}
        onPointerCancel={endLayerDrag}
      >
        <StoryStage state={state} controller={controller} viewportWidth={width} viewportHeight={height} />

        {/* Runtime fallback renderer: force sticker/text visibility via DOM overlay */}
        {stickerLayers.map((layer) => {
          const t = getEffectiveTransform(layer);
          const size = layer.size.x * t.scale * storyScale;
          const left = storyOffsetX + (t.position.x * storyScale) - size / 2;
          const top = storyOffsetY + (t.position.y * storyScale) - size / 2;
          const deg = (t.rotation * 180) / Math.PI;

          return (
            <img
              key={`html-${layer.id}`}
              src={layer.src}
              alt="sticker-fallback"
              onPointerDown={(e) => handleStickerPointerDown(layer, e)}
              onPointerMove={(e) => handleStickerPointerMove(layer, e)}
              onPointerUp={(e) => handleStickerPointerUp(layer, e)}
              onPointerCancel={(e) => handleStickerPointerUp(layer, e)}
              style={{
                position: 'absolute',
                left,
                top,
                width: size,
                height: size,
                objectFit: 'contain',
                transform: `rotate(${deg}deg)`,
                transformOrigin: 'center center',
                zIndex: 6,
                pointerEvents: 'auto',
                touchAction: 'none',
                cursor: 'grab',
              }}
            />
          );
        })}

        {textLayers.map((layer) => {
          const t = getEffectiveTransform(layer);
          const left = storyOffsetX + (t.position.x * storyScale) - (420 * storyScale) / 2;
          const top = storyOffsetY + (t.position.y * storyScale) - (layer.style.fontSize * storyScale) / 2;
          const deg = (t.rotation * 180) / Math.PI;

          return (
            <div
              key={`html-text-${layer.id}`}
              onPointerDown={(e) => beginLayerDrag(layer, e)}
              style={{
                position: 'absolute',
                left,
                top,
                width: 420 * storyScale,
                transform: `rotate(${deg}deg) scale(${t.scale})`,
                transformOrigin: 'center center',
                zIndex: 7,
                pointerEvents: 'auto',
                touchAction: 'none',
                cursor: 'grab',
                color: layer.style.fill,
                fontSize: Math.max(14, layer.style.fontSize * storyScale),
                fontFamily: layer.style.fontFamily,
                fontWeight: 700,
                textAlign: 'center',
                textShadow: '0 1px 2px rgba(0,0,0,0.45)',
                userSelect: 'none',
              }}
            >
              {layer.text}
            </div>
          );
        })}

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
          <div>layers: {state.layers.length}</div>
          <div>stickers: {state.layers.filter(l => l.kind === 'sticker').length}</div>
        </div>

        {initialBaseSrc ? (
          <img
            src={initialBaseSrc}
            alt="src-probe"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              zIndex: 0,
              pointerEvents: 'none',
              opacity: srcProbeStatus === 'loaded' ? 1 : 0,
              background: '#000',
            }}
            onLoad={() => setSrcProbeStatus('loaded')}
            onError={() => setSrcProbeStatus('error')}
          />
        ) : null}
      </div>

      {exportPreviewUrl && !isReplyFlow && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 12000,
            background: 'rgba(0,0,0,0.82)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={closeExportPreview}
        >
          <div
            style={{
              width: 'min(92vw, 520px)',
              maxHeight: '86vh',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#111',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={exportPreviewDataUrl ?? exportPreviewUrl}
              alt="export-preview"
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block', background: '#000' }}
            />
            <div style={{ display: 'flex', gap: 8, padding: 12, background: '#16181d' }}>
              <button type="button" onClick={downloadExportPreview} style={{ ...primaryPillStyle, flex: 1 }}>
                저장
              </button>
              <button type="button" onClick={closeExportPreview} style={{ ...textButtonStyle, flex: 1, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999 }}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

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
        onPickSticker={async sticker => {
          // Prefer original sticker image URL. Fallback to thumbnail only if missing.
          const rawSrc = (sticker.imageUrl && sticker.imageUrl.length > 0)
            ? sticker.imageUrl
            : (sticker.thumbnailUrl ?? '');
          const stickerSrc = await resolveStickerRenderableSrc(rawSrc);

          const stickerId = controller.addSticker({
            src: stickerSrc,
            at: {
              // StoryStage logical center (1080x1920)
              x: 540,
              y: 960,
            },
            size: { x: 360, y: 360 },
          });
          controller.bringToFront(stickerId);

          setSendError('');
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
