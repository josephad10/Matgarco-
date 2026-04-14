import { useState, useRef, useCallback, useEffect } from 'react';
import {
  ChevronUp, ChevronDown, Eye, EyeOff, ChevronRight,
  Megaphone, Image as ImageIcon, Star, LayoutGrid, Target,
  Sparkles, ShieldCheck, Mail, GripVertical, Plus, Trash2,
} from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────────────
   Section metadata: icon + label + editable config fields
   ──────────────────────────────────────────────────────────────────────────── */

type FieldDef =
  | { type: 'text';     key: string; label: string; placeholder?: string }
  | { type: 'textarea'; key: string; label: string; placeholder?: string }
  | { type: 'color';    key: string; label: string }
  | { type: 'number';   key: string; label: string; min?: number; max?: number }
  | { type: 'select';   key: string; label: string; options: { value: string; label: string }[] }
  | { type: 'toggle';   key: string; label: string };

interface SectionMeta {
  type: string;
  label: string;
  description: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string;
  fields: FieldDef[];
}

const SECTION_META: Record<string, Omit<SectionMeta, 'type'>> = {
  announcement_bar: {
    label: 'شريط الإعلانات',
    description: 'شريط ملوّن أعلى الصفحة لعروض أو رسائل سريعة',
    Icon: Megaphone,
    iconColor: '#F59E0B',
    fields: [
      { type: 'text',  key: 'text',      label: 'نص الإعلان',    placeholder: '🎉 شحن مجاني على الطلبات فوق 200 جنيه' },
      { type: 'color', key: 'bgColor',   label: 'لون الخلفية' },
      { type: 'color', key: 'textColor', label: 'لون النص' },
    ],
  },
  hero: {
    label: 'القسم الرئيسي (Hero)',
    description: 'البانر الكبير أعلى الصفحة',
    Icon: ImageIcon,
    iconColor: '#6366F1',
    fields: [
      { type: 'select', key: 'style', label: 'نمط العرض', options: [
        { value: 'fullscreen', label: 'ملء الشاشة' },
        { value: 'split',      label: 'مقسّم (نص + صورة)' },
        { value: 'centered',   label: 'وسطي' },
      ]},
      { type: 'text',     key: 'title',    label: 'العنوان الرئيسي',     placeholder: 'مرحباً بك في متجرنا' },
      { type: 'textarea', key: 'subtitle', label: 'العنوان الفرعي',      placeholder: 'اكتشف أحدث المنتجات بأفضل الأسعار' },
      { type: 'text',     key: 'ctaText',  label: 'نص الزر',             placeholder: 'تسوق الآن' },
      { type: 'text',     key: 'ctaLink',  label: 'رابط الزر',           placeholder: '/products' },
      { type: 'text',     key: 'image',    label: 'رابط الصورة (URL)',   placeholder: 'https://...' },
    ],
  },
  featured_products: {
    label: 'منتجات مميزة',
    description: 'شبكة مختارة من أفضل المنتجات',
    Icon: Star,
    iconColor: '#EAB308',
    fields: [
      { type: 'text',   key: 'title', label: 'عنوان القسم',      placeholder: 'منتجات مميزة' },
      { type: 'select', key: 'style', label: 'نمط العرض', options: [
        { value: 'grid',     label: 'شبكة' },
        { value: 'carousel', label: 'سلايدر' },
      ]},
      { type: 'number', key: 'limit', label: 'عدد المنتجات المعروضة', min: 2, max: 24 },
    ],
  },
  categories_grid: {
    label: 'شبكة الفئات',
    description: 'عرض فئات المنتجات كبطاقات جذّابة',
    Icon: LayoutGrid,
    iconColor: '#8B5CF6',
    fields: [
      { type: 'text',   key: 'title', label: 'عنوان القسم', placeholder: 'تسوق حسب الفئة' },
      { type: 'select', key: 'style', label: 'عدد الأعمدة', options: [
        { value: '2col',       label: 'عمودين' },
        { value: '3col',       label: '3 أعمدة' },
        { value: 'horizontal', label: 'أفقي' },
      ]},
    ],
  },
  promo_banner: {
    label: 'بانر ترويجي',
    description: 'بانر لعرض خاص أو حملة تسويقية',
    Icon: Target,
    iconColor: '#EF4444',
    fields: [
      { type: 'text',     key: 'title',    label: 'العنوان',              placeholder: '🔥 عرض خاص' },
      { type: 'textarea', key: 'subtitle', label: 'الوصف',               placeholder: 'خصم 30% على جميع المنتجات' },
      { type: 'text',     key: 'ctaText',  label: 'نص الزر',             placeholder: 'اطلب الآن' },
      { type: 'text',     key: 'ctaLink',  label: 'رابط الزر',           placeholder: '/products' },
      { type: 'text',     key: 'image',    label: 'رابط الصورة (URL)',   placeholder: 'https://...' },
      { type: 'color',    key: 'bgColor',  label: 'لون الخلفية' },
    ],
  },
  new_arrivals: {
    label: 'وصل حديثاً',
    description: 'أحدث المنتجات المضافة',
    Icon: Sparkles,
    iconColor: '#10B981',
    fields: [
      { type: 'text',   key: 'title', label: 'عنوان القسم', placeholder: 'وصل حديثاً' },
      { type: 'number', key: 'limit', label: 'عدد المنتجات', min: 2, max: 24 },
    ],
  },
  trust_badges: {
    label: 'شارات الثقة',
    description: 'أيقونات تعزز ثقة العملاء (شحن، ضمان، أمان...)',
    Icon: ShieldCheck,
    iconColor: '#0EA5E9',
    fields: [],
  },
  newsletter: {
    label: 'النشرة البريدية',
    description: 'نموذج اشتراك بالبريد الإلكتروني',
    Icon: Mail,
    iconColor: '#EC4899',
    fields: [
      { type: 'text', key: 'title',       label: 'العنوان',            placeholder: 'اشترك في نشرتنا البريدية' },
      { type: 'text', key: 'subtitle',    label: 'الوصف',             placeholder: 'احصل على أحدث العروض والتخفيضات' },
      { type: 'text', key: 'placeholder', label: 'Placeholder الحقل', placeholder: 'بريدك الإلكتروني' },
      { type: 'text', key: 'buttonText',  label: 'نص الزر',           placeholder: 'اشترك' },
    ],
  },
};

const SECTION_OPTIONS = Object.entries(SECTION_META).map(([type, meta]) => ({
  type,
  ...meta,
}));

/* ── Trust badges special options ────────────────── */
const BADGE_OPTIONS = [
  { key: 'shipping',  label: 'شحن سريع' },
  { key: 'guarantee', label: 'ضمان الإرجاع' },
  { key: 'secure',    label: 'دفع آمن' },
  { key: 'support',   label: 'دعم 24/7' },
];

/* ────────────────────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────────────────────── */

interface Props {
  draft: any;
  onChange: (update: Record<string, any>) => void;
}

export default function SectionsPanel({ draft, onChange }: Props) {
  const sections: any[] = draft?.sections || [];
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Keep a ref to always access the latest sections
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;

  const sorted = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  /* ── Add Section ─────────────────────────── */
  const addSection = (type: string) => {
    const newSection = {
      id: `${type}_${Date.now()}`,
      type,
      enabled: true,
      order: sections.length,
      settings: {},
    };
    
    // In our theme system, legacy uses "config" while new uses "settings", we will safely use settings and fallback config
    onChange({ sections: [...sectionsRef.current, newSection] });
    setShowAddMenu(false);
    setExpandedId(newSection.id);
  };

  /* ── Delete Section ──────────────────────── */
  const deleteSection = (id: string) => {
    const updated = sectionsRef.current.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i }));
    onChange({ sections: updated });
    if (expandedId === id) setExpandedId(null);
  };

  /* ── Reorder ─────────────────────────── */
  const reorder = (index: number, direction: 'up' | 'down') => {
    const items = [...sorted];
    const swap = direction === 'up' ? index - 1 : index + 1;
    if (swap < 0 || swap >= items.length) return;
    [items[index], items[swap]] = [items[swap], items[index]];
    const updated = items.map((s, i) => ({ ...s, order: i + 1 }));
    onChange({ sections: updated });
  };

  /* ── Toggle enabled ──────────────────── */
  const toggleEnabled = (sectionId: string) => {
    const updated = sectionsRef.current.map((s) =>
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    onChange({ sections: updated });
  };

  /* ── Update config field ─────────────── */
  const updateSettings = useCallback((sectionId: string, key: string, value: any) => {
    const updated = sectionsRef.current.map((s) =>
      s.id === sectionId ? { ...s, settings: { ...(s.settings || s.config), [key]: value } } : s
    );
    onChange({ sections: updated });
  }, [onChange]);

  /* ── Toggle a badge ──────────────────── */
  const toggleBadge = (sectionId: string, badgeKey: string) => {
    const section = sections.find((s) => s.id === sectionId);
    const setObj = section?.settings || section?.config || {};
    const current: string[] = setObj.badges || ['shipping', 'guarantee', 'secure', 'support'];
    const updated = current.includes(badgeKey)
      ? current.filter((b) => b !== badgeKey)
      : [...current, badgeKey];
    updateSettings(sectionId, 'badges', updated);
  };

  return (
    <div className="space-y-4 pb-20 relative">
      <div>
        <h3 className="font-bold text-sm text-[var(--text)]">أقسام الصفحة الرئيسية</h3>
        <p className="text-xs text-[var(--text-muted)] mt-1">رتّب الأقسام، أضف أقساماً جديدة، وعدّل المحتوى</p>
      </div>

      <div className="space-y-2">
        {sorted.map((section, index) => {
          const typeKey = section.type || section.id;
          const meta = SECTION_META[typeKey];
          if (!meta) return null;

          const isExpanded = expandedId === section.id;
          const { Icon } = meta;
          const settingsObj = section.settings || section.config || {};

          return (
            <div
              key={section.id}
              className={`rounded-xl border transition-all ${
                section.enabled
                  ? 'bg-white border-gray-200 shadow-sm'
                  : 'bg-gray-50/70 border-gray-100'
              }`}
            >
              {/* ── Row header ────────────────── */}
              <div className="flex items-center gap-1.5 p-2.5">
                {/* Grip icon */}
                <GripVertical className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 cursor-move" />

                {/* Section icon + name */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : section.id)}
                  className="flex items-center gap-3 flex-1 min-w-0 text-right group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-opacity group-hover:opacity-80"
                    style={{ backgroundColor: `${meta.iconColor}15` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: meta.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${section.enabled ? 'text-gray-800' : 'text-gray-400'}`}>
                      {meta.label}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">{typeKey}</p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0 border-r border-gray-100 pr-1">
                  <div className="flex flex-col gap-px">
                    <button
                      onClick={() => reorder(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:text-indigo-600 disabled:opacity-20 text-gray-400"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => reorder(index, 'down')}
                      disabled={index === sorted.length - 1}
                      className="p-1 hover:text-indigo-600 disabled:opacity-20 text-gray-400"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => toggleEnabled(section.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      section.enabled ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={section.enabled ? 'إخفاء' : 'إظهار'}
                  >
                    {section.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => deleteSection(section.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="حذف القسم"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── Expanded config ──────────── */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-4 bg-gray-50/50 rounded-b-xl">
                  <p className="text-[11px] text-gray-500 font-medium">{meta.description}</p>

                  {/* Standard fields */}
                  {meta.fields.map((field) => (
                    <FieldRenderer
                      key={field.key}
                      field={field}
                      value={settingsObj[field.key]}
                      onChangeValue={(val) => updateSettings(section.id, field.key, val)}
                    />
                  ))}

                  {/* Trust badges special UI */}
                  {typeKey === 'trust_badges' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700">الشارات المفعّلة</label>
                      <div className="grid grid-cols-2 gap-2">
                        {BADGE_OPTIONS.map((badge) => {
                          const isOn = (settingsObj.badges || ['shipping', 'guarantee', 'secure', 'support']).includes(badge.key);
                          return (
                            <button
                              key={badge.key}
                              onClick={() => toggleBadge(section.id, badge.key)}
                              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-xs font-bold transition-all ${
                                isOn
                                  ? 'border-indigo-300 bg-white text-indigo-700 shadow-sm'
                                  : 'border-gray-200 text-gray-500 bg-transparent hover:border-gray-300 hover:bg-white'
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded-[4px] border-[1.5px] flex items-center justify-center transition-colors
                                ${isOn ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 bg-white'}`}
                              >
                                {isOn && (
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              {badge.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Add Section Button ───────────────── */}
      <div className="pt-2">
        {!showAddMenu ? (
          <button
            onClick={() => setShowAddMenu(true)}
            className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة قسم جديد
          </button>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <h4 className="font-bold text-sm text-gray-800">اختر القسم</h4>
              <button
                onClick={() => setShowAddMenu(false)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800"
              >
                إلغاء
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2 grid grid-cols-1 gap-1">
              {SECTION_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => addSection(opt.type)}
                  className="flex flex-col items-start gap-1 p-3 rounded-lg hover:bg-gray-50 transition-colors text-right group"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${opt.iconColor}15` }}
                    >
                      <opt.Icon className="w-4 h-4" style={{ color: opt.iconColor }} />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-gray-800 block">{opt.label}</span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">{opt.description}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Generic field renderer
   ──────────────────────────────────────────────────────────────────────────── */

/* ── Debounced text input ── */
function DebouncedInput({ value: propValue, onDebouncedChange, delay = 700, as: Element = 'input', ...rest }: {
  value: string;
  onDebouncedChange: (val: string) => void;
  delay?: number;
  as?: 'input' | 'textarea';
  [k: string]: any;
}) {
  const [local, setLocal] = useState(propValue);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const latestCb = useRef(onDebouncedChange);
  latestCb.current = onDebouncedChange;

  const isFocused = useRef(false);
  useEffect(() => {
    if (!isFocused.current) setLocal(propValue);
  }, [propValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocal(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => latestCb.current(val), delay);
  };

  const handleBlur = () => {
    isFocused.current = false;
    clearTimeout(timerRef.current);
    if (local !== propValue) latestCb.current(local);
  };

  return (
    <Element
      {...rest}
      value={local}
      onChange={handleChange}
      onFocus={() => { isFocused.current = true; }}
      onBlur={handleBlur}
    />
  );
}

function FieldRenderer({ field, value, onChangeValue }: {
  field: FieldDef;
  value: any;
  onChangeValue: (val: any) => void;
}) {
  const labelClass = 'block text-xs font-bold text-gray-700 mb-1.5';
  const inputClass = 'w-full px-3 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium text-gray-800 placeholder:text-gray-400 bg-white transition-shadow';

  switch (field.type) {
    case 'text':
      return (
        <div>
          <label className={labelClass}>{field.label}</label>
          <DebouncedInput
            type="text"
            value={value ?? ''}
            onDebouncedChange={(v) => onChangeValue(v)}
            placeholder={field.placeholder}
            className={inputClass}
          />
        </div>
      );

    case 'textarea':
      return (
        <div>
          <label className={labelClass}>{field.label}</label>
          <DebouncedInput
            as="textarea"
            value={value ?? ''}
            onDebouncedChange={(v) => onChangeValue(v)}
            placeholder={field.placeholder}
            rows={3}
            className={`${inputClass} resize-y min-h-[80px]`}
          />
        </div>
      );

    case 'color':
      return (
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200">
          <div className="relative w-8 h-8 rounded-md overflow-hidden flex-shrink-0 shadow-sm border border-black/10">
            <input
              type="color"
              value={value || '#6366F1'}
              onChange={(e) => onChangeValue(e.target.value)}
              className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-0 outline-none p-0 m-0"
            />
          </div>
          <div className="flex-1 min-w-0 flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700 truncate">{field.label}</label>
            <code className="text-[11px] bg-gray-50 border border-gray-200 rounded px-2 py-1 font-mono text-gray-500">
              {(value || '#6366F1').toUpperCase()}
            </code>
          </div>
        </div>
      );

    case 'number':
      return (
        <div>
          <label className={labelClass}>{field.label}</label>
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChangeValue(Number(e.target.value))}
            min={field.min}
            max={field.max}
            className={`${inputClass} max-w-[120px]`}
          />
        </div>
      );

    case 'select':
      return (
        <div>
          <label className={labelClass}>{field.label}</label>
          <select
            value={value ?? ''}
            onChange={(e) => onChangeValue(e.target.value)}
            className={inputClass}
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );

    case 'toggle':
      return (
        <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-gray-300 transition-colors">
          <span className="text-xs font-bold text-gray-700">{field.label}</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChangeValue(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </div>
        </label>
      );

    default:
      return null;
  }
}
