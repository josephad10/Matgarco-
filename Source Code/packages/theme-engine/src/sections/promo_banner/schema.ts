import type { SectionSchema } from '../../types';

export const PromoBannerSchema: SectionSchema = {
  type: 'promo_banner',
  name: 'بانر ترويجي',
  version: 1,
  variants: [
    { id: 'fullwidth', label: 'Full width' },
    { id: 'boxed', label: 'Boxed' },
  ],
  defaultVariant: 'fullwidth',
  settings: [
    { id: 'bgColor', type: 'color', label: 'لون الخلفية', default: '#3B82F6' },
    { id: 'textColor', type: 'color', label: 'لون النص', default: '#ffffff' },
    { id: 'overlayOpacity', type: 'range', label: 'شفافية طبقة الخلفية', default: 20, min: 0, max: 80, step: 5 },
  ],
  blocks: [],
  allowedBlockTypes: ['heading', 'paragraph', 'button', 'image', 'divider', 'spacer'],
  presets: [
    {
      name: 'Promo fullwidth',
      variant: 'fullwidth',
      settings: { bgColor: '#3B82F6', textColor: '#ffffff', overlayOpacity: 20 },
      blocks: [
        { type: 'heading', settings: { text: '🔥 عروض الموسم', size: 'h1', align: 'center' } },
        { type: 'paragraph', settings: { text: 'خصم 30% على تشكيلة مختارة لفترة محدودة.', size: 'lg', align: 'center' } },
        { type: 'button', settings: { label: 'تسوق الآن', link: '/products', style: 'outline', size: 'md' } },
      ],
    },
  ],
};
