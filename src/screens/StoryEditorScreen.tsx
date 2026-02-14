import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEditorController } from '../features/story-editor/core/useEditorController';
import { StoryStage } from '../features/story-editor/react/StoryStage';
import { useElementSize } from '../features/story-editor/react/useElementSize';
import type { Layer } from '../features/story-editor/core/types';

export function StoryEditorScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialBaseSrc = query.get('src');

  const { controller, state } = useEditorController(initialBaseSrc ? { baseSrc: initialBaseSrc } : undefined);

  const stageHostRef = useRef<HTMLDivElement | null>(null);
  const { width, height } = useElementSize(stageHostRef);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastObjectUrlRef = useRef<string | null>(null);

  const [textEditorOpen, setTextEditorOpen] = useState(false);
  const [textDraft, setTextDraft] = useState('');

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
      const blob = await controller.requestExport({ mime: 'image/png', pixelRatio: 2 });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `story_${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. See console for details.');
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
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, letterSpacing: '0.2px' }}>Story Editor</div>
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
          <button onClick={() => controller.addText({ text: 'Text' })} style={pillStyle} type="button">
            Text
          </button>
          <button onClick={() => controller.addSticker({ src: '/react.svg', at: { x: 540, y: 960 } })} style={pillStyle} type="button">
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
          <button onClick={runExport} style={primaryPillStyle} disabled={exporting} type="button">
            {exporting ? 'Exporting…' : 'Export'}
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
