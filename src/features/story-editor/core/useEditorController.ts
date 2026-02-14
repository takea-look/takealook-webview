import { useRef } from 'react';
import type { EditorController } from './controller';
import { createEditorController } from './controller';
import { useEditorState } from '../react/useEditorState';

export function useEditorController(initial?: { baseSrc?: string | null }) {
  const controllerRef = useRef<EditorController | null>(null);
  if (!controllerRef.current) {
    controllerRef.current = createEditorController({ baseSrc: initial?.baseSrc ?? null });
  }

  const controller = controllerRef.current!;
  const state = useEditorState(controller);
  return { controller, state };
}
