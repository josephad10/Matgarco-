import type { SectionSchema } from '../../types';

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
    {
      id: 'height',
      type: 'select',
      label: 'ارتفاع القسم',
      options: [
        { value: 'small', label: 'صغير' },
        { value: 'medium', label: 'متوسط' },
        { value: 'fullscreen', label: 'ملء الشاشة' },
      ],
      default: 'medium',
    },
  ],
  blocks: [],
  allowedBlockTypes: ['heading', 'subtext', 'button'],
  maxBlocks: 5,
  blockLimits: {
    heading: 1,
    button: 2,
  },
  presets: [
    {
      name: 'البداية السريعة (الافتراضي)',
      variant: 'centered',
      settings: { overlayOpacity: 40, height: 'medium' },
      blocks: [
        { type: 'heading', settings: { text: 'مرحباً بك في متجرنا', size: 'h1' } },
        { type: 'subtext', settings: { text: 'تسوق الأفضل بأرخص الأسعار' } },
        { type: 'button', settings: { label: 'تصفح المنتجات', link: '/products', style: 'solid' } },
      ],
    },
  ],
};
