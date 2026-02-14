export type LayerId = string;

export type Vec2 = { x: number; y: number };

export type Transform = {
  position: Vec2;
  scale: number;
  rotation: number; // radians
};

export type BaseImage = {
  src: string | null;
};

export type TextStyle = {
  fontFamily: string;
  fontSize: number;
  fill: string;
  align?: 'left' | 'center' | 'right';
};

export type TextLayer = {
  id: LayerId;
  kind: 'text';
  transform: Transform;
  text: string;
  style: TextStyle;
};

export type StickerLayer = {
  id: LayerId;
  kind: 'sticker';
  transform: Transform;
  src: string;
  size: Vec2;
};

export type Layer = TextLayer | StickerLayer;

export type EditorMode = 'idle' | 'editingText';

export type ExportRequest = {
  mime: 'image/png' | 'image/jpeg';
  quality?: number; // jpeg only
  pixelRatio?: number;
  background?: string; // used for jpeg export to fill behind
};

export type EditorState = {
  base: BaseImage;
  layers: Layer[];
  selectedId: LayerId | null;
  mode: EditorMode;
  exportRequestedAt: number | null;
  exportRequest: ExportRequest | null;
};
