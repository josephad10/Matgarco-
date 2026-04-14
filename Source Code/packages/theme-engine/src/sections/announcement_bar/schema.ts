import type { SectionSchema } from '../../types';

export const AnnouncementBarSchema: SectionSchema = {
  type: 'announcement_bar',
  name: 'شريط الإعلانات',
  version: 1,
  variants: [
    { id: 'simple', label: 'Simple' },
    { id: 'scrolling', label: 'Scrolling' },
  ],
  defaultVariant: 'simple',
  settings: [
    { id: 'text', type: 'text', label: 'نص الإعلان', default: '🎉 عرض خاص لفترة محدودة' },
    { id: 'bgColor', type: 'color', label: 'لون الخلفية', default: '#111827' },
    { id: 'textColor', type: 'color', label: 'لون النص', default: '#ffffff' },
    { id: 'isClosable', type: 'toggle', label: 'زر إغلاق', default: false },
  ],
  blocks: [],
  presets: [
    {
      name: 'Simple announcement',
      variant: 'simple',
      settings: { text: '🎉 شحن مجاني على الطلبات فوق 200 جنيه' },
      blocks: [],
    },
  ],
};
