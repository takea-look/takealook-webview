import { useEffect, useState } from 'react';

export function useImage(src: string | null | undefined, crossOrigin: string | null = 'anonymous') {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      return;
    }

    let cancelled = false;

    const load = (withCors: boolean) => {
      const img = new Image();
      if (withCors && crossOrigin) img.crossOrigin = crossOrigin;

      img.onload = () => {
        if (cancelled) return;
        setImage(img);
      };

      img.onerror = () => {
        if (cancelled) return;
        // Some runtimes block CORS-mode image requests for canvas base image.
        // Retry once without crossOrigin so rendering can still proceed.
        if (withCors) {
          load(false);
          return;
        }
        setImage(null);
      };

      img.src = src;
    };

    load(true);

    return () => {
      cancelled = true;
    };
  }, [src, crossOrigin]);

  return src ? image : null;
}

