import type { BlockSchema, SectionSchema } from './types';

const HeroHeadingBlock: BlockSchema = {
  type: 'heading',
  name: 'العنوان الرئيسي',
  settings: [
    { id: 'text', type: 'text', label: 'النص', default: 'مرحباً بك في متجرنا' },
    {
      id: 'size',
      type: 'select',
      label: 'حجم الخط',
      default: 'h1',
      options: [
        { value: 'h1', label: 'كبير جداً' },
        { value: 'h2', label: 'كبير' },
        { value: 'h3', label: 'متوسط' },
      ],
    },
    {
      id: 'align',
      type: 'select',
      label: 'المحاذاة',
      default: 'center',
      options: [
        { value: 'right', label: 'يمين' },
        { value: 'center', label: 'وسط' },
        { value: 'left', label: 'يسار' },
      ],
    },
    { id: 'color', type: 'color', label: 'لون النص', default: '' },
  ],
};

const HeroSubtextBlock: BlockSchema = {
  type: 'subtext',
  name: 'نص فرعي',
  settings: [
    { id: 'text', type: 'textarea', label: 'الوصف', default: 'اكتشف أفضل المنتجات' },
    {
      id: 'size',
      type: 'select',
      label: 'حجم النص',
      default: 'md',
      options: [
        { value: 'sm', label: 'صغير' },
        { value: 'md', label: 'متوسط' },
        { value: 'lg', label: 'كبير' },
      ],
    },
    {
      id: 'align',
      type: 'select',
      label: 'المحاذاة',
      default: 'center',
      options: [
        { value: 'right', label: 'يمين' },
        { value: 'center', label: 'وسط' },
        { value: 'left', label: 'يسار' },
      ],
    },
    { id: 'color', type: 'color', label: 'لون النص', default: '' },
  ],
};

const ParagraphBlock: BlockSchema = {
  type: 'paragraph',
  name: 'فقرة',
  settings: [
    { id: 'text', type: 'textarea', label: 'النص', default: 'اكتب وصفًا مختصرًا هنا' },
    {
      id: 'size',
      type: 'select',
      label: 'حجم النص',
      default: 'md',
      options: [
        { value: 'sm', label: 'صغير' },
        { value: 'md', label: 'متوسط' },
        { value: 'lg', label: 'كبير' },
        { value: 'xl', label: 'كبير جدًا' },
      ],
    },
    {
      id: 'align',
      type: 'select',
      label: 'المحاذاة',
      default: 'left',
      options: [
        { value: 'right', label: 'يمين' },
        { value: 'center', label: 'وسط' },
        { value: 'left', label: 'يسار' },
      ],
    },
    { id: 'color', type: 'color', label: 'لون النص', default: '' },
  ],
};

const HeroButtonBlock: BlockSchema = {
  type: 'button',
  name: 'زر (Call to Action)',
  settings: [
    { id: 'label', type: 'text', label: 'عنوان الزر', default: 'تسوق الآن' },
    { id: 'link', type: 'url', label: 'رابط الزر', default: '/products' },
    {
      id: 'style',
      type: 'select',
      label: 'شكل الزر',
      default: 'solid',
      options: [
        { value: 'solid', label: 'ممتلئ' },
        { value: 'outline', label: 'مفرغ' },
      ],
    },
    {
      id: 'size',
      type: 'select',
      label: 'حجم الزر',
      default: 'md',
      options: [
        { value: 'sm', label: 'صغير' },
        { value: 'md', label: 'متوسط' },
        { value: 'lg', label: 'كبير' },
      ],
    },
  ],
};

const ImageBlock: BlockSchema = {
  type: 'image',
  name: 'صورة',
  settings: [
    { id: 'src', type: 'url', label: 'رابط الصورة', default: '' },
    { id: 'alt', type: 'text', label: 'النص البديل', default: 'صورة' },
    {
      id: 'fit',
      type: 'select',
      label: 'طريقة الملاءمة',
      default: 'cover',
      options: [
        { value: 'cover', label: 'تغطية كاملة' },
        { value: 'contain', label: 'احتواء كامل' },
      ],
    },
    {
      id: 'radius',
      type: 'select',
      label: 'استدارة الحواف',
      default: 'lg',
      options: [
        { value: 'none', label: 'بدون' },
        { value: 'sm', label: 'خفيف' },
        { value: 'md', label: 'متوسط' },
        { value: 'lg', label: 'كبير' },
        { value: 'full', label: 'دائري جدًا' },
      ],
    },
    { id: 'maxWidth', type: 'range', label: 'أقصى عرض (%)', default: 100, min: 20, max: 100, step: 5 },
  ],
};

const DividerBlock: BlockSchema = {
  type: 'divider',
  name: 'فاصل',
  settings: [
    { id: 'color', type: 'color', label: 'لون الفاصل', default: '#E5E7EB' },
    { id: 'thickness', type: 'range', label: 'السُمك', default: 1, min: 1, max: 8, step: 1 },
    {
      id: 'style',
      type: 'select',
      label: 'النمط',
      default: 'solid',
      options: [
        { value: 'solid', label: 'متصل' },
        { value: 'dashed', label: 'متقطع' },
        { value: 'dotted', label: 'منقّط' },
      ],
    },
    { id: 'width', type: 'range', label: 'العرض (%)', default: 100, min: 20, max: 100, step: 5 },
  ],
};

const SpacerBlock: BlockSchema = {
  type: 'spacer',
  name: 'مسافة فارغة',
  settings: [
    {
      id: 'size',
      type: 'select',
      label: 'الحجم',
      default: 'md',
      options: [
        { value: 'sm', label: 'صغير' },
        { value: 'md', label: 'متوسط' },
        { value: 'lg', label: 'كبير' },
        { value: 'xl', label: 'كبير جدًا' },
      ],
    },
    { id: 'height', type: 'range', label: 'ارتفاع مخصص (px)', default: 24, min: 8, max: 160, step: 4 },
  ],
};

export const BlockRegistry: Record<string, BlockSchema> = {
  [HeroHeadingBlock.type]: HeroHeadingBlock,
  [HeroSubtextBlock.type]: HeroSubtextBlock,
  [ParagraphBlock.type]: ParagraphBlock,
  [HeroButtonBlock.type]: HeroButtonBlock,
  [ImageBlock.type]: ImageBlock,
  [DividerBlock.type]: DividerBlock,
  [SpacerBlock.type]: SpacerBlock,
};

export function resolveSectionBlocks(schema?: SectionSchema): BlockSchema[] {
  if (!schema) {
    return [];
  }

  const resolved = new Map<string, BlockSchema>();

  for (const blockType of schema.allowedBlockTypes || []) {
    const blockSchema = BlockRegistry[blockType];
    if (blockSchema) {
      resolved.set(blockSchema.type, blockSchema);
    }
  }

  for (const blockSchema of schema.blocks || []) {
    resolved.set(blockSchema.type, blockSchema);
  }

  return Array.from(resolved.values());
}

export function resolveBlockSchema(schema: SectionSchema | undefined, blockType: string): BlockSchema | undefined {
  return resolveSectionBlocks(schema).find((block) => block.type === blockType);
}

export function buildBlockDefaultSettings(blockSchema: BlockSchema | undefined): Record<string, any> {
  if (!blockSchema) {
    return {};
  }

  return blockSchema.settings.reduce((acc, input) => {
    acc[input.id] = input.default;
    return acc;
  }, {} as Record<string, any>);
}
