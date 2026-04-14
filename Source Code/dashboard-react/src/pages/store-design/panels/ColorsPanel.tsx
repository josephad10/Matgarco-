import { useRef, useCallback } from 'react';

interface Props {
  draft: any;
  onChange: (update: Record<string, any>) => void;
}

const COLOR_FIELDS = [
  { key: 'primary',    label: 'اللون الأساسي',  hint: 'أزرار، روابط، تمييز' },
  { key: 'secondary',  label: 'اللون الثانوي',  hint: 'تمييزات ثانوية' },
  { key: 'accent',     label: 'لون التمييز',     hint: 'عناصر بارزة ومميزة' },
  { key: 'background', label: 'الخلفية',         hint: 'خلفية الصفحة الرئيسية' },
  { key: 'surface',    label: 'سطح البطاقات',   hint: 'خلفية البطاقات والعناصر' },
  { key: 'text',       label: 'النص الرئيسي',   hint: 'لون النص الأساسي' },
  { key: 'textMuted',  label: 'النص الثانوي',   hint: 'نصوص توضيحية خافتة' },
  { key: 'border',     label: 'الحدود',          hint: 'لون الإطارات والفواصل' },
];

export default function ColorsPanel({ draft, onChange }: Props) {
  const colors = draft?.colors || {};
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced save: update UI immediately via local state, save to backend after 400ms idle
  const debouncedSet = useCallback((key: string, val: string) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange({ colors: { ...colors, [key]: val } });
    }, 400);
  }, [onChange, colors]);

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-sm text-gray-800">الألوان</h3>
      <div className="space-y-3">
        {COLOR_FIELDS.map(({ key, label, hint }) => (
          <div key={key} className="flex items-center gap-3">
            <input
              type="color"
              value={colors[key] || '#6366F1'}
              onChange={(e) => debouncedSet(key, e.target.value)}
              className="w-9 h-9 rounded-lg cursor-pointer border-0 outline-none bg-transparent flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700">{label}</p>
              <p className="text-[10px] text-gray-400">{hint}</p>
            </div>
            <code className="text-[10px] bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 font-mono text-gray-500">
              {colors[key] || '---'}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
