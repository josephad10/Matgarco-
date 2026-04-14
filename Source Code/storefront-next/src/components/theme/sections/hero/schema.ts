import type { SectionSchema } from '../../registry/types';

export const HeroSchema: SectionSchema = {
  type: 'hero',
  name: 'القسم الترحيبي (Hero)',
  version: 1,

  variants: [
    { id: 'centered', label: 'صورة في المنتصف' },
    { id: 'split', label: 'مقسم (نص وصورة)' },
  ],
  defaultVariant: 'centered',

  settings: [
    { id: 'backgroundImage', type: 'image', label: 'صورة الخلفية', default: '' },
    { id: 'overlayOpacity', type: 'range', label: 'تعتيم الشفافية', min: 0, max: 100, step: 10, default: 40 },
    { id: 'height', type: 'select', label: 'ارتفاع القسم', options: [
        { value: 'small', label: 'صغير' },
        { value: 'medium', label: 'متوسط' },
        { value: 'fullscreen', label: 'ملء الشاشة' }
    ], default: 'medium' },
  ],

  blocks: [
    {
      type: 'heading',
      name: 'العنوان الرئيسي',
      settings: [
        { id: 'text', type: 'text', label: 'النص', default: 'مرحباً بك في متجرنا' },
        { id: 'size', type: 'select', label: 'حجم الخط', default: 'h1', options: [
          { value: 'h1', label: 'كبير جداً' },
          { value: 'h2', label: 'كبير' },
          { value: 'h3', label: 'متوسط' }
        ]}
      ]
    },
    {
      type: 'subtext',
      name: 'نص فرعي',
      settings: [
        { id: 'text', type: 'textarea', label: 'الوصف', default: 'اكتشف أفضل المنتجات' },
      ]
    },
    {
      type: 'button',
      name: 'زر (Call to Action)',
      settings: [
        { id: 'label', type: 'text', label: 'عنوان الزر', default: 'تسوق الآن' },
        { id: 'link', type: 'url', label: 'رابط الزر', default: '/products' },
        { id: 'style', type: 'select', label: 'شكل الزر', default: 'solid', options: [
          { value: 'solid', label: 'ممتلئ' },
          { value: 'outline', label: 'مفرغ' }
        ]}
      ]
    }
  ],

  maxBlocks: 5,
  blockLimits: {
    heading: 1, // Only 1 heading allowed
    button: 2   // Max 2 CTA buttons
  },

  presets: [
    {
      name: 'البداية السريعة (الافتراضي)',
      variant: 'centered',
      settings: { overlayOpacity: 40, height: 'medium' },
      blocks: [
        { type: 'heading', settings: { text: 'مرحباً بك في متجرنا', size: 'h1' } },
        { type: 'subtext', settings: { text: 'تسوق الأفضل بأرخص الأسعار' } },
        { type: 'button', settings: { label: 'تصفح المنتجات', link: '/products', style: 'solid' } }
      ]
    }
  ]
};
