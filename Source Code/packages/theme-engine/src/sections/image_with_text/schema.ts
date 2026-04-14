import type { SectionSchema } from '../../types';

export const ImageWithTextSchema: SectionSchema = {
  type: 'image_with_text',
  name: 'صورة مع نص',
  version: 1,
  variants: [
    { id: 'text_right', label: 'Text right' },
    { id: 'text_left', label: 'Text left' },
    { id: 'overlapping', label: 'Overlapping' },
  ],
  defaultVariant: 'text_right',
  settings: [
    { id: 'backgroundColor', type: 'color', label: 'لون الخلفية', default: '#ffffff' },
    { id: 'textColor', type: 'color', label: 'لون النص', default: '#111827' },
    { id: 'imagePosition', type: 'select', label: 'موضع الصورة', default: 'right', options: [
      { value: 'right', label: 'يمين' },
      { value: 'left', label: 'يسار' },
    ] },
  ],
  blocks: [],
  allowedBlockTypes: ['heading', 'paragraph', 'button', 'image', 'divider', 'spacer'],
  presets: [
    {
      name: 'Image with text',
      variant: 'text_right',
      settings: { backgroundColor: '#ffffff', imagePosition: 'right' },
      blocks: [
        { type: 'image', settings: { src: 'https://picsum.photos/seed/imagetext/900/900', alt: 'Image with text visual', fit: 'cover', radius: 'lg', maxWidth: 100 } },
        { type: 'heading', settings: { text: 'من نحن', size: 'h2', align: 'left' } },
        { type: 'paragraph', settings: { text: 'نحن نهتم بأدق التفاصيل لضمان حصولك على أفضل تجربة.', size: 'md', align: 'left' } },
        { type: 'button', settings: { label: 'اعرف المزيد', link: '/about', style: 'solid', size: 'md' } },
      ],
    },
  ],
};
