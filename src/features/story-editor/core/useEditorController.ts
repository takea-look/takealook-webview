import { useMemo } from 'react';
import { createEditorController } from './controller';
import { useEditorState } from '../react/useEditorState';

export function useEditorController(initial?: { baseSrc?: string | null }) {
  // Initialize once. If baseSrc needs to be updated, provide an explicit controller API.
  const controller = useMemo(() => {
    return createEditorController({ baseSrc: initial?.baseSrc ?? null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const state = useEditorState(controller);
  return { controller, state };
}
