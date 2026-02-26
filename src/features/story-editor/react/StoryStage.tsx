import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import { Image as KonvaImage, Layer as KonvaLayer, Rect, Stage, Text as KonvaText, Transformer } from 'react-konva';
import type Konva from 'konva';
import type { Box } from 'konva/lib/shapes/Transformer';
import type { EditorController } from '../core/controller';
import type { EditorState, StickerLayer, TextLayer } from '../core/types';
import { exportStageToBlob } from './exportStage';
import { useImage } from './useImage';

interface Props {
  state: EditorState;
  controller: EditorController;
  viewportWidth: number;
  viewportHeight: number;
}

const STORY_W = 1080;
const STORY_H = 1920;
const TEXT_BOX_W = 900;


export function StoryStage({ state, controller, viewportWidth, viewportHeight }: Props) {
  const stageRef = useRef<Konva.Stage | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);

  const baseImage = useImage(state.base.src);

  const scale = useMemo(() => {
    if (viewportWidth <= 0 || viewportHeight <= 0) return 0;
    return Math.min(viewportWidth / STORY_W, viewportHeight / STORY_H);
  }, [viewportWidth, viewportHeight]);

  const wrapperStyle: CSSProperties = useMemo(() => {
    return {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: STORY_W,
      height: STORY_H,
      transform: `translate(-50%, -50%) scale(${scale})`,
      transformOrigin: 'top left',
      zIndex: 1,
    };
  }, [scale]);

  const baseRect = useMemo(() => {
    if (!baseImage) return null;
    const iw = baseImage.naturalWidth || baseImage.width;
    const ih = baseImage.naturalHeight || baseImage.height;
    if (!iw || !ih) return null;

    // Cover fit within story frame, center-cropped.
    const s = Math.max(STORY_W / iw, STORY_H / ih);
    const w = iw * s;
    const h = ih * s;
    return { x: (STORY_W - w) / 2, y: (STORY_H - h) / 2, width: w, height: h };
  }, [baseImage]);

  useEffect(() => {
    const stage = stageRef.current;
    const tr = transformerRef.current;
    if (!stage || !tr) return;

    const selectedId = state.selectedId;
    if (!selectedId) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }

    const node = stage.findOne(`#${cssEscape(selectedId)}`);
    if (!node) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }

    tr.nodes([node as unknown as Konva.Node]);
    tr.getLayer()?.batchDraw();
  }, [state.selectedId, state.layers]);

  useEffect(() => {
    if (!state.exportRequestedAt || !state.exportRequest) return;
    const stage = stageRef.current;
    if (!stage) return;
    const req = state.exportRequest;

  // export 직전에 강제 렌더링
  stage.batchDraw();

    (async () => {
      try {
        const blob = await exportStageToBlob(stage, req);
        controller.__fulfillExport(blob);
      } catch (err) {
        controller.__rejectExport(err);
      }
    })();
  }, [state.exportRequestedAt, state.exportRequest, controller]);

  if (scale <= 0) return null;

  return (
    <div style={wrapperStyle}>
      <Stage
        ref={(node: Konva.Stage | null) => {
          stageRef.current = node;
        }}
        width={STORY_W}
        height={STORY_H}
        onMouseDown={(e: Konva.KonvaEventObject<MouseEvent>) => {
          if (e.target === e.target.getStage()) controller.select(null);
        }}
        onTouchStart={(e: Konva.KonvaEventObject<TouchEvent>) => {
          if (e.target === e.target.getStage()) controller.select(null);
        }}
        style={{ background: '#000' }}
      >
        <KonvaLayer>
          <Rect x={0} y={0} width={STORY_W} height={STORY_H} fill="#0b0e14" />
          {baseImage && baseRect ? (
            <KonvaImage image={baseImage} x={baseRect.x} y={baseRect.y} width={baseRect.width} height={baseRect.height} />
          ) : (
            <>
              <KonvaText
                text={state.base.src ? '이미지 로드 실패 (src 전달됨)' : 'Load an image to start'}
                x={40}
                y={60}
                width={STORY_W - 80}
                fontSize={28}
                align="center"
                fill="#b0b8c1"
              />
              {state.base.src && (
                <KonvaText
                  text={`src: ${state.base.src.slice(0, 120)}`}
                  x={40}
                  y={120}
                  width={STORY_W - 80}
                  fontSize={18}
                  align="center"
                  fill="#8B95A1"
                />
              )}
            </>
          )}

          {state.layers.map((layer) => {
            if (layer.kind === 'text') {
              return <TextNode key={layer.id} layer={layer} controller={controller} />;
            }
            return <StickerNode key={layer.id} layer={layer} controller={controller} />;
          })}

          <Transformer
            ref={(node: Konva.Transformer | null) => {
              transformerRef.current = node;
            }}
            rotateEnabled={true}
            keepRatio={true}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            boundBoxFunc={(oldBox: Box, nextBox: Box) => {
              if (nextBox.width < 40 || nextBox.height < 40) return oldBox;
              return nextBox;
            }}
          />
        </KonvaLayer>
      </Stage>
    </div>
  );
}

function TextNode({ layer, controller }: { layer: TextLayer; controller: EditorController }) {
  const rotationDeg = (layer.transform.rotation * 180) / Math.PI;
  const offsetY = (layer.style.fontSize ?? 48) / 2;
  return (
    <KonvaText
      id={layer.id}
      text={layer.text}
      x={layer.transform.position.x}
      y={layer.transform.position.y}
      offsetX={TEXT_BOX_W / 2}
      offsetY={offsetY}
      width={TEXT_BOX_W}
      rotation={rotationDeg}
      scaleX={layer.transform.scale}
      scaleY={layer.transform.scale}
      fontFamily={layer.style.fontFamily}
      fontSize={layer.style.fontSize}
      fill={layer.style.fill}
      align={layer.style.align ?? 'center'}
      draggable={true}
      onClick={() => controller.select(layer.id)}
      onTap={() => controller.select(layer.id)}
      onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
        controller.setTransform(layer.id, { position: { x: e.target.x(), y: e.target.y() } });
      }}
      onTransformEnd={(e: Konva.KonvaEventObject<Event>) => {
        const n = e.target;
        controller.setTransform(layer.id, {
          position: { x: n.x(), y: n.y() },
          scale: n.scaleX(),
          rotation: (n.rotation() * Math.PI) / 180,
        });
      }}
    />
  );
}

function StickerNode({ layer, controller }: { layer: StickerLayer; controller: EditorController }) {
  // For embedded runtimes, avoid CORS mode for sticker assets.
  const img = useImage(layer.src, null);
  const rotationDeg = (layer.transform.rotation * 180) / Math.PI;

  if (!img) {
    return (
      <>
        <Rect
          id={layer.id}
          x={layer.transform.position.x - layer.size.x / 2}
          y={layer.transform.position.y - layer.size.y / 2}
          width={layer.size.x}
          height={layer.size.y}
          stroke="#F04452"
          dash={[8, 6]}
          strokeWidth={3}
          cornerRadius={12}
          onClick={() => controller.select(layer.id)}
          onTap={() => controller.select(layer.id)}
          draggable={true}
          onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
            controller.setTransform(layer.id, { position: { x: e.target.x() + layer.size.x / 2, y: e.target.y() + layer.size.y / 2 } });
          }}
        />
        <KonvaText
          text="Sticker load fail"
          x={layer.transform.position.x - layer.size.x / 2 + 8}
          y={layer.transform.position.y - 10}
          width={layer.size.x - 16}
          fontSize={18}
          fill="#F04452"
          align="center"
        />
      </>
    );
  }

  return (
    <>
      <KonvaImage
        id={layer.id}
        image={img}
        x={layer.transform.position.x}
        y={layer.transform.position.y}
        offsetX={layer.size.x / 2}
        offsetY={layer.size.y / 2}
        width={layer.size.x}
        height={layer.size.y}
        rotation={rotationDeg}
        scaleX={layer.transform.scale}
        scaleY={layer.transform.scale}
        draggable={true}
        onClick={() => controller.select(layer.id)}
        onTap={() => controller.select(layer.id)}
        onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
          controller.setTransform(layer.id, { position: { x: e.target.x(), y: e.target.y() } });
        }}
        onTransformEnd={(e: Konva.KonvaEventObject<Event>) => {
          const n = e.target;
          controller.setTransform(layer.id, {
            position: { x: n.x(), y: n.y() },
            scale: n.scaleX(),
            rotation: (n.rotation() * Math.PI) / 180,
          });
        }}
      />
      <Rect
        x={layer.transform.position.x - (layer.size.x * layer.transform.scale) / 2}
        y={layer.transform.position.y - (layer.size.y * layer.transform.scale) / 2}
        width={layer.size.x * layer.transform.scale}
        height={layer.size.y * layer.transform.scale}
        rotation={rotationDeg}
        stroke="#FFD400"
        strokeWidth={3}
        dash={[10, 6]}
        listening={false}
      />
    </>
  );
}

function cssEscape(id: string): string {
  if (globalThis.CSS?.escape) return globalThis.CSS.escape(id);
  return id.replace(/[^a-zA-Z0-9_-]/g, (s) => `\\${s}`);
}
