export type SchemaInputType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'range'
  | 'color'
  | 'select'
  | 'boolean'
  | 'toggle'
  | 'url'
  | 'image';

export interface SchemaInput {
  id: string;
  type: SchemaInputType;
  label: string;
  default?: any;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

export interface BlockSchema {
  type: string;
  name: string;
  settings: SchemaInput[];
  isRemovable?: boolean;
  isEditable?: boolean;
}

export interface SectionVariant {
  id: string;
  label: string;
}

export interface SectionSchema {
  type: string;
  name: string;
  icon?: string;
  version: number;
  isRemovable?: boolean;
  isEditable?: boolean;
  variants: SectionVariant[];
  defaultVariant?: string;
  settings: SchemaInput[];
  blocks: BlockSchema[];
  allowedBlockTypes?: string[];
  maxBlocks?: number;
  blockLimits?: Record<string, number>;
  presets?: {
    name: string;
    variant: string;
    settings: Record<string, any>;
    blocks: { type: string; settings: Record<string, any> }[];
  }[];
}

export interface ThemeState {
  sectionIds: string[];
  sectionsById: Record<string, any>;
  isDirty?: boolean;
}
