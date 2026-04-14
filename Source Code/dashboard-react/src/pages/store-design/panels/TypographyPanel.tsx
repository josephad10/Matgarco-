const ARABIC_FONTS = [
  { value: 'Cairo',           label: 'Cairo',             style: { fontFamily: 'Cairo, sans-serif' } },
  { value: 'Tajawal',         label: 'Tajawal',           style: { fontFamily: 'Tajawal, sans-serif' } },
  { value: 'Almarai',         label: 'Almarai',           style: { fontFamily: 'Almarai, sans-serif' } },
  { value: 'IBM Plex Arabic', label: 'IBM Plex Arabic',   style: { fontFamily: '"IBM Plex Arabic", sans-serif' } },
  { value: 'Noto Kufi Arabic',label: 'Noto Kufi Arabic',  style: { fontFamily: '"Noto Kufi Arabic", sans-serif' } },
];

interface Props {
  draft: any;
  onChange: (update: Record<string, any>) => void;
}

export default function TypographyPanel({ draft, onChange }: Props) {
  const fonts = draft?.fonts || {};
  const set = (key: string, val: string) => onChange({ fonts: { ...fonts, [key]: val } });

  return (
    <div className="space-y-5">
      <h3 className="font-bold text-sm text-gray-800">الطباعة والخطوط</h3>

      {[
        { key: 'body',    label: 'خط المحتوى',   hint: 'النصوص والفقرات' },
        { key: 'heading', label: 'خط العناوين',  hint: 'العناوين الكبيرة' },
      ].map(({ key, label, hint }) => (
        <div key={key}>
          <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
          <p className="text-[10px] text-gray-400 mb-2">{hint}</p>
          <div className="grid grid-cols-1 gap-1.5">
            {ARABIC_FONTS.map((font) => {
              const isActive = (fonts[key] || 'Cairo') === font.value;
              return (
                <button
                  key={font.value}
                  onClick={() => set(key, font.value)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm transition-all ${
                    isActive ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                  style={font.style}
                >
                  <span>{font.label}</span>
                  <span className="text-xs text-gray-300">{isActive ? '✓' : ''}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">حجم النص الأساسي</label>
        <select
          value={fonts.size || 'md'}
          onChange={(e) => set('size', e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-indigo-400 text-xs"
        >
          <option value="sm">صغير (15px)</option>
          <option value="md">متوسط (16px) — افتراضي</option>
          <option value="lg">كبير (17px)</option>
        </select>
      </div>
    </div>
  );
}
