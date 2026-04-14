import type { SectionSchema } from '../../types';

export const FeaturedProductsSchema: SectionSchema = {
  type: 'featured_products',
  name: 'منتجات مميزة',
  version: 1,
  variants: [
    { id: 'grid', label: 'Grid' },
    { id: 'carousel', label: 'Carousel' },
    { id: 'highlighted', label: 'Highlighted' },
  ],
  defaultVariant: 'grid',
  settings: [
    { id: 'title', type: 'text', label: 'العنوان', default: 'منتجات مميزة' },
    { id: 'limit', type: 'number', label: 'عدد المنتجات', default: 8, min: 1, max: 40 },
    { id: 'showViewAll', type: 'toggle', label: 'إظهار زر عرض الكل', default: true },
    { id: 'bgColor', type: 'color', label: 'لون الخلفية', default: '#ffffff' },
  ],
  blocks: [],
  presets: [
    {
      name: 'Featured grid',
      variant: 'grid',
      settings: { title: 'منتجات مميزة', limit: 8, showViewAll: true },
      blocks: [],
    },
  ],
};
