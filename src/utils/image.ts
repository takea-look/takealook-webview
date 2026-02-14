export type DownsampleOptions = {
  maxWidth: number;
  maxHeight: number;
  quality?: number; // 0..1
  mimeType?: 'image/webp' | 'image/jpeg';
};

export async function downsampleImageFile(
  file: File,
  {
    maxWidth,
    maxHeight,
    quality = 0.82,
    mimeType = 'image/webp',
  }: DownsampleOptions
): Promise<{ file: File; didConvert: boolean }> {
  // Non-images: return as-is
  if (!file.type.startsWith('image/')) {
    return { file, didConvert: false };
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
  const targetW = Math.max(1, Math.round(bitmap.width * scale));
  const targetH = Math.max(1, Math.round(bitmap.height * scale));

  // If no resize needed and requested mime matches current, keep original.
  if (scale === 1 && (mimeType === file.type || mimeType === 'image/webp')) {
    return { file, didConvert: false };
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { file, didConvert: false };
  }

  ctx.drawImage(bitmap, 0, 0, targetW, targetH);

  const blob: Blob | null = await new Promise(resolve => {
    canvas.toBlob(
      b => resolve(b),
      mimeType,
      quality
    );
  });

  if (!blob) {
    // Fallback: try jpeg
    const jpegBlob: Blob | null = await new Promise(resolve => {
      canvas.toBlob(b => resolve(b), 'image/jpeg', quality);
    });
    if (!jpegBlob) return { file, didConvert: false };

    const name = file.name.replace(/\.[^.]+$/, '.jpg');
    return {
      file: new File([jpegBlob], name, { type: 'image/jpeg' }),
      didConvert: true,
    };
  }

  const ext = mimeType === 'image/webp' ? '.webp' : '.jpg';
  const name = file.name.replace(/\.[^.]+$/, ext);
  return {
    file: new File([blob], name, { type: mimeType }),
    didConvert: true,
  };
}
