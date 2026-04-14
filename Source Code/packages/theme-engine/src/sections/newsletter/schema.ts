import type { SectionSchema } from '../../types';

export const NewsletterSchema: SectionSchema = {
  type: 'newsletter',
  name: 'النشرة البريدية',
  version: 1,
  variants: [
    { id: 'simple', label: 'Simple' },
    { id: 'split', label: 'Split' },
  ],
  defaultVariant: 'simple',
  settings: [
    { id: 'backgroundColor', type: 'color', label: 'لون الخلفية', default: '#3B82F6' },
    { id: 'textColor', type: 'color', label: 'لون النص', default: '#ffffff' },
    { id: 'placeholder', type: 'text', label: 'Placeholder', default: 'بريدك الإلكتروني' },
  ],
  blocks: [],
  allowedBlockTypes: ['heading', 'paragraph', 'button', 'divider', 'spacer'],
  presets: [
    {
      name: 'Newsletter simple',
      variant: 'simple',
      settings: { backgroundColor: '#3B82F6', textColor: '#ffffff', placeholder: 'بريدك الإلكتروني' },
      blocks: [
        { type: 'heading', settings: { text: 'اشترك في نشرتنا البريدية', size: 'h2', align: 'center' } },
        { type: 'paragraph', settings: { text: 'احصل على أحدث العروض والتخفيضات في بريدك مباشرة', size: 'md', align: 'center' } },
        { type: 'button', settings: { label: 'اشترك مجاناً', link: '#', style: 'outline', size: 'md' } },
      ],
    },
  ],
};
