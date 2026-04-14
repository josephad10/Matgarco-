import type { SectionSchema } from '../../types';

export const TestimonialsSchema: SectionSchema = {
  type: 'testimonials',
  name: 'آراء العملاء',
  version: 1,
  variants: [
    { id: 'grid', label: 'Grid' },
    { id: 'slider', label: 'Slider' },
  ],
  defaultVariant: 'grid',
  settings: [
    { id: 'title', type: 'text', label: 'العنوان', default: 'آراء عملائنا' },
    { id: 'subtitle', type: 'text', label: 'النص الفرعي', default: 'تجارب حقيقية من عملاء حقيقيين' },
    { id: 'backgroundColor', type: 'color', label: 'لون الخلفية', default: '#F8FAFC' },
  ],
  blocks: [
    {
      type: 'testimonial_item',
      name: 'عنصر رأي عميل',
      settings: [
        { id: 'author', type: 'text', label: 'اسم العميل', default: 'أحمد محمود' },
        { id: 'content', type: 'textarea', label: 'نص المراجعة', default: 'منتجات رائعة وجودة ممتازة، أنصح بالتعامل معهم!' },
        { id: 'rating', type: 'number', label: 'التقييم (1-5)', default: 5, min: 1, max: 5 },
        { id: 'image', type: 'url', label: 'صورة العميل', default: '' },
        { id: 'role', type: 'text', label: 'الوظيفة/الوصف', default: '' },
      ],
    },
  ],
  allowedBlockTypes: ['heading', 'paragraph', 'divider', 'spacer'],
  maxBlocks: 10,
  blockLimits: {
    testimonial_item: 8,
    heading: 1,
    paragraph: 1,
  },
  presets: [
    {
      name: 'Testimonials',
      variant: 'grid',
      settings: { title: 'آراء عملائنا', subtitle: 'تجارب حقيقية من عملاء حقيقيين', backgroundColor: '#F8FAFC' },
      blocks: [
        { type: 'heading', settings: { text: 'آراء عملائنا', size: 'h2', align: 'center' } },
        { type: 'paragraph', settings: { text: 'تجارب حقيقية من عملاء حقيقيين', size: 'md', align: 'center' } },
        { type: 'testimonial_item', settings: { author: 'أحمد محمود', content: 'منتجات رائعة وجودة ممتازة، أنصح بالتعامل معهم!', rating: 5, role: 'عميل دائم' } },
        { type: 'testimonial_item', settings: { author: 'منى كريم', content: 'خدمة عملاء راقية وتوصيل سريع جداً.', rating: 5, role: 'رائدة أعمال' } },
        { type: 'testimonial_item', settings: { author: 'علي حسن', content: 'تجربة تسوق مميزة، سأقوم بالشراء مرة أخرى بالتأكيد.', rating: 4, role: 'مسوق رقمي' } },
      ],
    },
  ],
};
