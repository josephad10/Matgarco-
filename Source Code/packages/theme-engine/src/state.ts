import { SectionRegistry } from './registry';
import type { SectionSchema, ThemeState } from './types';
import { buildBlockDefaultSettings, resolveBlockSchema } from './blockRegistry';
import { validateSection } from './validation';

export const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 9)}`;

export function normalizeThemeData(rawSections: any[] = []): ThemeState {
  const state: ThemeState = { sectionIds: [], sectionsById: {}, isDirty: false };
  for (const s of rawSections) {
    const id = s.id || generateId('sec');
    state.sectionIds.push(id);
    state.sectionsById[id] = { ...s, id };
  }
  return state;
}

export function denormalizeThemeData(state: ThemeState): any[] {
  return state.sectionIds.map((id) => state.sectionsById[id]);
}

export function addSection(state: ThemeState, type: string): ThemeState {
  const schema: SectionSchema | undefined = SectionRegistry[type];
  if (!schema) return state;

  const preset = schema.presets?.[0];
  const newSection = {
    id: generateId('sec'),
    type,
    schemaVersion: schema.version,
    variant: preset?.variant || schema.defaultVariant,
    settings: preset?.settings || {},
    blocks:
      preset?.blocks?.map((b) => ({
        ...b,
        id: generateId('blk'),
      })) || [],
  };

  return {
    sectionIds: [...state.sectionIds, newSection.id],
    sectionsById: { ...state.sectionsById, [newSection.id]: newSection },
    isDirty: true,
  };
}

export type UpdaterFn<T> = (prev: T) => T;

export function updateSection(state: ThemeState, sectionId: string, updates: any | UpdaterFn<any>): ThemeState {
  const section = state.sectionsById[sectionId];
  if (!section) return state;

  const nextSection = typeof updates === 'function' ? updates(section) : { ...section, ...updates };

  const { isValid } = validateSection(nextSection);
  if (!isValid) {
    return state;
  }

  return {
    ...state,
    sectionsById: {
      ...state.sectionsById,
      [sectionId]: nextSection,
    },
    isDirty: true,
  };
}

export function removeSection(state: ThemeState, sectionId: string): ThemeState {
  const nextSectionsById = { ...state.sectionsById };
  delete nextSectionsById[sectionId];

  return {
    sectionIds: state.sectionIds.filter((id) => id !== sectionId),
    sectionsById: nextSectionsById,
    isDirty: true,
  };
}

export function addBlock(state: ThemeState, sectionId: string, blockType: string): ThemeState {
  const section = state.sectionsById[sectionId];
  if (!section) return state;

  const schema = SectionRegistry[section.type];
  const blockSchema = resolveBlockSchema(schema, blockType);
  if (!blockSchema) return state;

  const defaultBlockSettings = buildBlockDefaultSettings(blockSchema);

  const newBlock = {
    id: generateId('blk'),
    type: blockType,
    settings: defaultBlockSettings,
  };

  const nextSection = {
    ...section,
    blocks: [...(section.blocks || []), newBlock],
  };

  const { isValid } = validateSection(nextSection);
  if (!isValid) {
    return state;
  }

  return {
    ...state,
    sectionsById: {
      ...state.sectionsById,
      [sectionId]: nextSection,
    },
    isDirty: true,
  };
}

export function moveBlock(
  state: ThemeState,
  sectionId: string,
  blockId: string,
  direction: 'up' | 'down'
): ThemeState {
  const section = state.sectionsById[sectionId];
  if (!section || !Array.isArray(section.blocks) || section.blocks.length < 2) return state;

  const currentIndex = section.blocks.findIndex((block: any) => block.id === blockId);
  if (currentIndex === -1) return state;

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= section.blocks.length) return state;

  const reorderedBlocks = [...section.blocks];
  [reorderedBlocks[currentIndex], reorderedBlocks[targetIndex]] = [reorderedBlocks[targetIndex], reorderedBlocks[currentIndex]];

  const nextSection = {
    ...section,
    blocks: reorderedBlocks,
  };

  const { isValid } = validateSection(nextSection);
  if (!isValid) return state;

  return {
    ...state,
    sectionsById: {
      ...state.sectionsById,
      [sectionId]: nextSection,
    },
    isDirty: true,
  };
}
