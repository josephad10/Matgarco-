interface TemplateInfo {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  emoji: string;
  bestFor: string;
  accentColor: string;
  isDark?: boolean;
}

const TEMPLATES: TemplateInfo[] = [
  { id: 'spark',  name: 'Spark',  nameAr: 'سبارك',  description: 'نظيف وعصري، مثالي للمتاجر العامة', emoji: '⚡', bestFor: 'متاجر عامة', accentColor: '#6366F1' },
  { id: 'volt',   name: 'Volt',   nameAr: 'فولت',   description: 'داكن وعصري للموضة والرياضة', emoji: '🔥', bestFor: 'رياضة · موضة', accentColor: '#F59E0B', isDark: true },
  { id: 'epure',  name: 'Épure',  nameAr: 'إيبور',  description: 'راقٍ ومنسق، مثالي للأزياء', emoji: '🪡', bestFor: 'أزياء · بوتيك', accentColor: '#92400E' },
  { id: 'bloom',  name: 'Bloom',  nameAr: 'بلوم',   description: 'ناعم وجميل للجمال والعناية', emoji: '🌸', bestFor: 'جمال · عناية', accentColor: '#EC4899' },
  { id: 'noir',   name: 'Noir',   nameAr: 'نوار',   description: 'فاخر وأنيق للعلامات التجارية الراقية', emoji: '◆', bestFor: 'فاخر · راقٍ', accentColor: '#B8973B', isDark: true },
  { id: 'mosaic', name: 'Mosaic', nameAr: 'موزاييك', description: 'ملوّن ومتنوع لأسواق المنتجات', emoji: '⬜', bestFor: 'مول · متعدد', accentColor: '#7C3AED' },
];

interface Props {
  value: string;
  onChange: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepTemplate({ value, onChange, onNext, onBack }: Props) {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎨</div>
        <h1 className="text-2xl font-black text-gray-900">اختر قالب متجرك</h1>
        <p className="text-gray-500 mt-2 text-sm">يمكنك تغيير القالب لاحقاً من إعدادات المتجر</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => onChange(tpl.id)}
            className={`relative text-right p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
              value === tpl.id ? 'ring-2 ring-offset-1 ring-indigo-600' : 'border-gray-100 hover:border-gray-300'
            }`}
            style={{
              backgroundColor: tpl.isDark ? '#111' : '#FAFAFA',
              borderColor: value === tpl.id ? tpl.accentColor : undefined,
            }}
          >
            {value === tpl.id && (
              <div className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center bg-indigo-600 text-white text-xs font-bold">
                ✓
              </div>
            )}
            <div className="text-3xl mb-2">{tpl.emoji}</div>
            <div className="font-black text-sm" style={{ color: tpl.isDark ? '#FFFFFF' : '#111827' }}>
              {tpl.nameAr}
            </div>
            <div className="text-[11px] mt-0.5 font-medium" style={{ color: tpl.accentColor }}>
              {tpl.bestFor}
            </div>
            <p className="text-[10px] mt-1.5 leading-relaxed" style={{ color: tpl.isDark ? '#9CA3AF' : '#6B7280' }}>
              {tpl.description}
            </p>
          </button>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
          ← رجوع
        </button>
        <button onClick={onNext} className="flex-[2] py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors active:scale-95">
          التالي: الألوان →
        </button>
      </div>
    </div>
  );
}
