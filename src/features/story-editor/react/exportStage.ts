import type Konva from 'konva';
import type { ExportRequest } from '../core/types';

function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  return fetch(dataUrl).then((r) => r.blob());
}

export async function exportStageToBlob(stage: Konva.Stage, req: ExportRequest): Promise<Blob> {
  const pixelRatio = req.pixelRatio ?? 2;

  // For JPEG, Konva's toDataURL supports 'mimeType'. Background fill is best done via a temp canvas.
  const mimeType = req.mime;

  if (mimeType === 'image/png') {
    const dataUrl = stage.toDataURL({ pixelRatio, mimeType });
    return dataUrlToBlob(dataUrl);
  }

  // 🔥 JPEG: toDataURL 직접 사용
  const dataUrl = stage.toDataURL({
    pixelRatio,
    mimeType,
    quality: req.quality ?? 0.92,
  });
  return dataUrlToBlob(dataUrl);
}
