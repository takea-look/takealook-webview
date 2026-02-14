import { useEffect, useState } from 'react';

export function useImage(src: string | null | undefined, crossOrigin: string | null = 'anonymous') {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }

    let cancelled = false;
    const img = new Image();
    if (crossOrigin) img.crossOrigin = crossOrigin;
    img.onload = () => {
      if (cancelled) return;
      setImage(img);
    };
    img.onerror = () => {
      if (cancelled) return;
      setImage(null);
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src, crossOrigin]);

  return image;
}

