import { useSyncExternalStore } from 'react';
import type { EditorController } from '../core/controller';
import type { EditorState } from '../core/types';

export function useEditorState(controller: EditorController): EditorState {
  return useSyncExternalStore(controller.subscribe, controller.getState, controller.getState);
}
