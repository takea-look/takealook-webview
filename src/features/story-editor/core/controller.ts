import type {
  EditorState,
  ExportRequest,
  Layer,
  LayerId,
  StickerLayer,
  TextLayer,
  TextStyle,
  Vec2,
} from './types';
import { createId, defaultTransform } from './utils';

type Listener = () => void;

type ExportDeferred = {
  request: ExportRequest;
  resolve: (blob: Blob) => void;
  reject: (err: unknown) => void;
};

export interface EditorController {
  getState(): EditorState;
  subscribe(listener: Listener): () => void;

  select(id: LayerId | null): void;
  bringToFront(id: LayerId): void;
  deleteSelected(): void;

  setBaseImage(src: string | null): void;

  addText(initial?: Partial<Pick<TextLayer, 'text' | 'style'>> & { at?: Vec2 }): LayerId;
  setText(id: LayerId, text: string): void;
  setTextStyle(id: LayerId, patch: Partial<TextStyle>): void;

  addSticker(initial: { src: string; at: Vec2; size?: Vec2 }): LayerId;

  setTransform(id: LayerId, patch: Partial<Layer['transform']>): void;

  undo(): void;
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;

  requestExport(req: ExportRequest): Promise<Blob>;
  /** Called by renderer */
  __fulfillExport(blob: Blob): void;
  /** Called by renderer */
  __rejectExport(err: unknown): void;
}

const HISTORY_LIMIT = 50;

function cloneState(state: EditorState): EditorState {
  // State is simple enough for structuredClone; but keep compatibility.
  return JSON.parse(JSON.stringify(state)) as EditorState;
}

export function createEditorController(initial?: { baseSrc?: string | null }): EditorController {
  let state: EditorState = {
    base: { src: initial?.baseSrc ?? null },
    layers: [],
    selectedId: null,
    mode: 'idle',
    exportRequestedAt: null,
    exportRequest: null,
  };

  const listeners = new Set<Listener>();
  const past: EditorState[] = [];
  const future: EditorState[] = [];

  let exportDeferred: ExportDeferred | null = null;

  const emit = () => {
    listeners.forEach((l) => l());
  };

  const pushHistory = () => {
    past.push(cloneState({ ...state, exportRequest: null, exportRequestedAt: null }));
    if (past.length > HISTORY_LIMIT) past.shift();
    future.length = 0;
  };

  const setState = (next: EditorState, opts?: { history?: boolean }) => {
    if (opts?.history !== false) {
      pushHistory();
    }
    state = next;
    emit();
  };

  const updateLayer = (id: LayerId, updater: (layer: Layer) => Layer) => {
    const idx = state.layers.findIndex((l) => l.id === id);
    if (idx < 0) return;
    const layers = state.layers.slice();
    layers[idx] = updater(layers[idx]);
    setState({ ...state, layers });
  };

  return {
    getState() {
      return state;
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    select(id) {
      setState({ ...state, selectedId: id }, { history: false });
    },

    bringToFront(id) {
      const idx = state.layers.findIndex((l) => l.id === id);
      if (idx < 0) return;
      const layers = state.layers.slice();
      const [layer] = layers.splice(idx, 1);
      layers.push(layer);
      setState({ ...state, layers, selectedId: id });
    },

    deleteSelected() {
      const id = state.selectedId;
      if (!id) return;
      const layers = state.layers.filter((l) => l.id !== id);
      setState({ ...state, layers, selectedId: null, mode: 'idle' });
    },

    setBaseImage(src) {
      setState({ ...state, base: { src } });
    },

    addText(initial) {
      const id = createId('text');
      const at = initial?.at ?? { x: 540, y: 960 };
      const layer: TextLayer = {
        id,
        kind: 'text',
        transform: defaultTransform(at),
        text: initial?.text ?? '텍스트',
        style: {
          fontFamily: initial?.style?.fontFamily ?? 'system-ui',
          fontSize: initial?.style?.fontSize ?? 48,
          fill: initial?.style?.fill ?? '#FFFFFF',
          align: initial?.style?.align ?? 'center',
        },
      };
      setState({ ...state, layers: [...state.layers, layer], selectedId: id });
      return id;
    },

    setText(id, text) {
      updateLayer(id, (layer) => {
        if (layer.kind !== 'text') return layer;
        return { ...layer, text };
      });
    },

    setTextStyle(id, patch) {
      updateLayer(id, (layer) => {
        if (layer.kind !== 'text') return layer;
        return { ...layer, style: { ...layer.style, ...patch } };
      });
    },

    addSticker(initial) {
      const id = createId('sticker');
      const size = initial.size ?? { x: 240, y: 240 };
      const layer: StickerLayer = {
        id,
        kind: 'sticker',
        transform: defaultTransform(initial.at),
        src: initial.src,
        size,
      };
      setState({ ...state, layers: [...state.layers, layer], selectedId: id });
      return id;
    },

    setTransform(id, patch) {
      updateLayer(id, (layer) => {
        return { ...layer, transform: { ...layer.transform, ...patch } };
      });
    },

    undo() {
      const prev = past.pop();
      if (!prev) return;
      future.push(cloneState({ ...state, exportRequest: null, exportRequestedAt: null }));
      state = { ...prev, exportRequest: null, exportRequestedAt: null };
      emit();
    },

    redo() {
      const next = future.pop();
      if (!next) return;
      past.push(cloneState({ ...state, exportRequest: null, exportRequestedAt: null }));
      state = { ...next, exportRequest: null, exportRequestedAt: null };
      emit();
    },

    canUndo() {
      return past.length > 0;
    },

    canRedo() {
      return future.length > 0;
    },

    requestExport(req) {
      if (exportDeferred) {
        exportDeferred.reject(new Error('Export already in progress'));
        exportDeferred = null;
      }

      return new Promise<Blob>((resolve, reject) => {
        exportDeferred = { request: req, resolve, reject };
        state = { ...state, exportRequest: req, exportRequestedAt: Date.now() };
        emit();
      });
    },

    __fulfillExport(blob) {
      if (!exportDeferred) return;
      const d = exportDeferred;
      exportDeferred = null;
      state = { ...state, exportRequest: null, exportRequestedAt: null };
      emit();
      d.resolve(blob);
    },

    __rejectExport(err) {
      if (!exportDeferred) return;
      const d = exportDeferred;
      exportDeferred = null;
      state = { ...state, exportRequest: null, exportRequestedAt: null };
      emit();
      d.reject(err);
    },
  };
}
