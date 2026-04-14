import type { SectionSchema } from '../../types';

export const TrustBadgesSchema: SectionSchema = {
  type: 'trust_badges',
  name: 'شارات الثقة',
  version: 1,
  variants: [
    { id: 'icons_row', label: 'Icons row' },
    { id: 'cards', label: 'Cards' },
  ],
  defaultVariant: 'icons_row',
  settings: [
    { id: 'backgroundColor', type: 'color', label: 'لون الخلفية', default: '#ffffff' },
    { id: 'borderColor', type: 'color', label: 'لون الحدود', default: '#E5E7EB' },
    { id: 'title', type: 'text', label: 'العنوان', default: 'لماذا نحن؟' },
  ],
  blocks: [
    {
      type: 'badge_item',
      name: 'عنصر شارة ثقة',
      settings: [
        { id: 'icon', type: 'text', label: 'الأيقونة (Emoji)', default: '✅' },
        { id: 'title', type: 'text', label: 'العنوان', default: 'شحن سريع' },
        { id: 'description', type: 'text', label: 'الوصف', default: 'توصيل داخل 2-5 أيام عمل' },
      ],
    },
  ],
  allowedBlockTypes: ['heading', 'paragraph', 'divider', 'spacer'],
  maxBlocks: 10,
  blockLimits: {
    badge_item: 6,
    heading: 1,
    paragraph: 1,
  },
  presets: [
    {
      name: 'Trust badges',
      variant: 'icons_row',
      settings: { title: 'لماذا نحن؟', backgroundColor: '#ffffff', borderColor: '#E5E7EB' },
      blocks: [
        { type: 'heading', settings: { text: 'لماذا نحن؟', size: 'h3', align: 'center' } },
        { type: 'badge_item', settings: { icon: '🚀', title: 'شحن سريع', description: 'توصيل داخل 2-5 أيام عمل' } },
        { type: 'badge_item', settings: { icon: '↩️', title: 'ضمان الإرجاع', description: 'إرجاع مجاني خلال 14 يوماً' } },
        { type: 'badge_item', settings: { icon: '🔒', title: 'دفع آمن 100%', description: 'جميع بياناتك محمية ومشفرة' } },
        { type: 'badge_item', settings: { icon: '💬', title: 'دعم فني 24/7', description: 'فريقنا دائماً في خدمتك' } },
      ],
    },
  ],
};
