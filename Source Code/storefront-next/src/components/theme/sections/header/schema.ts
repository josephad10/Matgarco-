import type { SectionSchema } from '../../registry/types';

const HeaderSchema: SectionSchema = {
  type: 'header',
  name: 'الشريط العلوي',
  icon: '🔝',
  version: 1,
  maxBlocks: 0,
  variants: [
    { id: 'split',    label: 'Split (Logo يسار، قائمة يمين)' },
    { id: 'centered', label: 'Centered (Logo وسط)' },
    { id: 'minimal',  label: 'Minimal (شريط بسيط)' },
  ],
  settings: [
    { id: 'isSticky',           type: 'toggle',  label: 'تثبيت الهيدر عند التمرير',           default: true },
    { id: 'transparentOnHero',  type: 'toggle',  label: 'شفاف فوق الـ Hero',                  default: false },
    { id: 'backgroundColor',    type: 'color',   label: 'لون الخلفية',                        default: '#ffffff' },
    { id: 'textColor',          type: 'color',   label: 'لون النص',                           default: '#111827' },
    { id: 'logoWidth',          type: 'range',   label: 'عرض اللوجو (px)',                     default: 120, min: 60, max: 280 },
    { id: 'showSearch',         type: 'toggle',  label: 'إظهار أيقونة البحث',                 default: true },
    { id: 'showUser',           type: 'toggle',  label: 'إظهار أيقونة الحساب',                default: true },
    { id: 'showCart',           type: 'toggle',  label: 'إظهار أيقونة السلة',                 default: true },
    { id: 'borderBottom',       type: 'toggle',  label: 'خط فاصل سفلي',                       default: true },
    { id: 'showAnnouncement',   type: 'toggle',  label: 'إظهار شريط الإعلانات',               default: true },
    { id: 'announcementText',   type: 'text',    label: 'نص شريط الإعلانات',                  default: '🎉 شحن مجاني على الطلبات فوق 200 جنيه' },
  ],
  blocks: [], // Header doesn't use blocks
  presets: [
    {
      name: 'هيدر كلاسيكي',
      variant: 'split',
      settings: { isSticky: true, transparentOnHero: false, showSearch: true, showCart: true },
      blocks: [],
    },
    {
      name: 'هيدر متأنق',
      variant: 'centered',
      settings: { isSticky: true, transparentOnHero: true, backgroundColor: 'transparent', borderBottom: false },
      blocks: [],
    },
  ],
};

export default HeaderSchema;
