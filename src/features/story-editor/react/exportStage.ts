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

  // JPEG: render to canvas, fill background, then toBlob
  const canvas = stage.toCanvas({ pixelRatio });
  const outCanvas = document.createElement('canvas');
  outCanvas.width = canvas.width;
  outCanvas.height = canvas.height;

  const ctx = outCanvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2d context');
  }

  ctx.fillStyle = req.background ?? '#000000';
  ctx.fillRect(0, 0, outCanvas.width, outCanvas.height);
  ctx.drawImage(canvas, 0, 0);

  const quality = req.quality ?? 0.92;
  const blob = await new Promise<Blob | null>((resolve) => outCanvas.toBlob(resolve, mimeType, quality));
  if (!blob) {
    throw new Error('Failed to export image');
  }
  return blob;
}
