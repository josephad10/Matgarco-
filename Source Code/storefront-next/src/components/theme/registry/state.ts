export {
  generateId,
  normalizeThemeData,
  denormalizeThemeData,
  addSection,
  updateSection,
  removeSection,
  addBlock,
} from '../../../../../packages/theme-engine/src/state';

export type { UpdaterFn } from '../../../../../packages/theme-engine/src/state';
export type { ThemeState } from '../../../../../packages/theme-engine/src/types';

export interface EditorState {
  editingState: import('../../../../../packages/theme-engine/src').ThemeState;
  previewState: import('../../../../../packages/theme-engine/src').ThemeState;
  lastSavedState?: import('../../../../../packages/theme-engine/src').ThemeState;
}
