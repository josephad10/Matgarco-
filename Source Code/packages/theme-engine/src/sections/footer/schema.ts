import type { SectionSchema } from '../../types';

export const FooterSchema: SectionSchema = {
  type: 'footer',
  name: 'التذييل',
  icon: '🔻',
  version: 1,
  maxBlocks: 0,
  variants: [
    { id: 'classic', label: 'Classic (أعمدة متعددة)' },
    { id: 'minimal', label: 'Minimal (سطر واحد)' },
  ],
  settings: [
    { id: 'backgroundColor', type: 'color', label: 'لون الخلفية', default: '#0f172a' },
    { id: 'textColor', type: 'color', label: 'لون النص', default: '#f8fafc' },
    { id: 'aboutText', type: 'textarea', label: 'نص "من نحن"', default: 'متجر يوفر لك أفضل المنتجات بأعلى جودة.' },
    { id: 'copyrightText', type: 'text', label: 'نص حقوق النشر', default: '© 2026 جميع الحقوق محفوظة' },
    { id: 'showNewsletter', type: 'toggle', label: 'إظهار نموذج النشرة', default: true },
    { id: 'showQuickLinks', type: 'toggle', label: 'إظهار الروابط السريعة', default: true },
    { id: 'showSupportLinks', type: 'toggle', label: 'إظهار روابط خدمة العملاء', default: true },
    { id: 'showSocialLinks', type: 'toggle', label: 'إظهار روابط التواصل', default: false },
    { id: 'facebookUrl', type: 'text', label: 'رابط فيسبوك', default: '' },
    { id: 'instagramUrl', type: 'text', label: 'رابط إنستجرام', default: '' },
  ],
  blocks: [],
  presets: [
    {
      name: 'تذييل كامل',
      variant: 'classic',
      settings: { showNewsletter: true, showQuickLinks: true, showSupportLinks: true },
      blocks: [],
    },
  ],
};
