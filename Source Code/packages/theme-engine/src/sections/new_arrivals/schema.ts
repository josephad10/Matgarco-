import type { SectionSchema } from '../../types';

export const NewArrivalsSchema: SectionSchema = {
  type: 'new_arrivals',
  name: 'وصل حديثا',
  version: 1,
  variants: [
    { id: 'grid', label: 'Grid' },
    { id: 'slider', label: 'Slider' },
  ],
  defaultVariant: 'grid',
  settings: [
    { id: 'title', type: 'text', label: 'العنوان', default: 'وصل حديثا' },
    { id: 'limit', type: 'number', label: 'عدد المنتجات', default: 6, min: 1, max: 40 },
    { id: 'showViewAll', type: 'toggle', label: 'إظهار زر عرض الكل', default: true },
  ],
  blocks: [],
  presets: [
    {
      name: 'New arrivals grid',
      variant: 'grid',
      settings: { title: 'وصل حديثا', limit: 6, showViewAll: true },
      blocks: [],
    },
  ],
};
