import type { SectionSchema } from './types';
import { SectionRegistry } from './registry';
import { resolveSectionBlocks } from './blockRegistry';

export interface ValidationError {
  type: 'max_blocks_exceeded' | 'block_limit_exceeded' | 'invalid_variant' | 'invalid_block_type';
  message: string;
}

export function validateSection(
  sectionData: any,
  schema: SectionSchema | undefined = SectionRegistry[sectionData.type]
): { isValid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!schema) {
    return { isValid: true, errors: [] };
  }

  if (sectionData.variant) {
    const isValidVariant = schema.variants.some((v) => v.id === sectionData.variant);
    if (!isValidVariant) {
      errors.push({ type: 'invalid_variant', message: `الـ Variant '${sectionData.variant}' غير صالح لهذا القسم.` });
    }
  }

  const allowedBlocks = resolveSectionBlocks(schema);
  if (allowedBlocks.length > 0 && sectionData.blocks) {
    const allowedTypes = new Set(allowedBlocks.map((block) => block.type));
    for (const block of sectionData.blocks) {
      if (!allowedTypes.has(block.type)) {
        errors.push({
          type: 'invalid_block_type',
          message: `البلوك '${block.type}' غير مسموح داخل القسم '${schema.type}'.`,
        });
      }
    }
  }

  const totalBlocks = sectionData.blocks?.length || 0;
  if (schema.maxBlocks !== undefined && totalBlocks > schema.maxBlocks) {
    errors.push({
      type: 'max_blocks_exceeded',
      message: `القسم يتخطى الحد الأقصى للبلوكات (${schema.maxBlocks}).`,
    });
  }

  if (schema.blockLimits && sectionData.blocks) {
    const counts: Record<string, number> = {};
    for (const block of sectionData.blocks) {
      counts[block.type] = (counts[block.type] || 0) + 1;
    }

    Object.entries(schema.blockLimits).forEach(([type, limit]) => {
      if ((counts[type] || 0) > limit) {
        errors.push({
          type: 'block_limit_exceeded',
          message: `تجاوزت الحد المسموح لعنصر '${type}' وهو ${limit}.`,
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
