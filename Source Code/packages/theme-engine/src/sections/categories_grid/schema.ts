import type { SectionSchema } from '../../types';

export const CategoriesGridSchema: SectionSchema = {
  type: 'categories_grid',
  name: 'شبكة الفئات (Categories)',
  version: 1,
  variants: [
    { id: 'grid', label: 'شبكة كلاسيكية' },
    { id: 'slider', label: 'شريط سحب (Slider)' },
  ],
  defaultVariant: 'grid',
  settings: [
    { id: 'title', type: 'text', label: 'العنوان', default: 'تسوق حسب الفئة' },
    {
      id: 'style',
      type: 'select',
      label: 'شكل الأعمدة',
      default: '3col',
      options: [
        { value: '2col', label: 'عمودين' },
        { value: '3col', label: '3 أعمدة' },
        { value: 'horizontal', label: 'شريط أفقي' },
      ],
    },
    { id: 'bgColor', type: 'color', label: 'لون الخلفية', default: '#ffffff' },
  ],
  blocks: [],
  presets: [
    {
      name: 'شبكة الفئات الأساسية',
      variant: 'grid',
      settings: { title: 'تسوق حسب الفئة', style: '3col' },
      blocks: [],
    },
  ],
};
