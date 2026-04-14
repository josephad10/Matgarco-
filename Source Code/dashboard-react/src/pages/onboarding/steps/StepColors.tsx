import type { OnboardingData } from '../OnboardingWizard';

// Template color presets
const PRESETS: Record<string, { primary: string; secondary: string; background: string; text: string; label: string }[]> = {
  spark:  [
    { primary: '#6366F1', secondary: '#8B5CF6', background: '#FFFFFF', text: '#111827', label: 'إنديجو' },
    { primary: '#0EA5E9', secondary: '#38BDF8', background: '#FFFFFF', text: '#0F172A', label: 'سماوي' },
    { primary: '#10B981', secondary: '#34D399', background: '#FFFFFF', text: '#111827', label: 'أخضر' },
  ],
  volt:   [
    { primary: '#F59E0B', secondary: '#FBBF24', background: '#0A0A0A', text: '#F5F5F5', label: 'ذهبي داكن' },
    { primary: '#EF4444', secondary: '#F87171', background: '#0A0A0A', text: '#F5F5F5', label: 'أحمر داكن' },
  ],
  epure:  [
    { primary: '#92400E', secondary: '#B45309', background: '#FAFAF8', text: '#1C1917', label: 'بني دافئ' },
    { primary: '#374151', secondary: '#6B7280', background: '#FFFFFF', text: '#111827', label: 'رمادي رسمي' },
  ],
  bloom:  [
    { primary: '#EC4899', secondary: '#F472B6', background: '#FFF0F6', text: '#1F2937', label: 'وردي ناعم' },
    { primary: '#A855F7', secondary: '#C084FC', background: '#FAF5FF', text: '#1F2937', label: 'بنفسجي' },
  ],
  noir:   [
    { primary: '#B8973B', secondary: '#D4AF58', background: '#080808', text: '#F5F5F0', label: 'ذهبي فاخر' },
    { primary: '#E5E7EB', secondary: '#9CA3AF', background: '#0A0A0A', text: '#FFFFFF', label: 'فضي' },
  ],
  mosaic: [
    { primary: '#7C3AED', secondary: '#A78BFA', background: '#FFFFFF', text: '#111827', label: 'بنفسجي' },
    { primary: '#0EA5E9', secondary: '#38BDF8', background: '#F0F9FF', text: '#0F172A', label: 'أزرق' },
  ],
};

interface Props {
  colors: OnboardingData['colors'];
  templateId: string;
  onChange: (colors: OnboardingData['colors']) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepColors({ colors, templateId, onChange, onNext, onBack }: Props) {
  const presets = PRESETS[templateId] || PRESETS.spark;
  const set = (key: keyof typeof colors, val: string) => onChange({ ...colors, [key]: val });

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">✏️</div>
        <h1 className="text-2xl font-black text-gray-900">اختر ألوان متجرك</h1>
        <p className="text-gray-500 mt-2 text-sm">اختر من الأنماط الجاهزة أو خصص لوحة الألوان بنفسك</p>
      </div>

      {/* Preset choices */}
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">أنماط جاهزة</p>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => {
            const isActive = preset.primary === colors.primary;
            return (
              <button
                key={preset.label}
                onClick={() => onChange({ primary: preset.primary, secondary: preset.secondary, background: preset.background, text: preset.text })}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-right transition-all ${isActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-gray-300'}`}
              >
                <div className="flex gap-1 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: preset.primary }} />
                  <div className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: preset.background }} />
                </div>
                <span className="text-xs font-semibold text-gray-700">{preset.label}</span>
                {isActive && <span className="mr-auto text-indigo-600 text-xs font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom color pickers */}
      <div>
        <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">تخصيص يدوي</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'primary'    as const, label: 'اللون الأساسي' },
            { key: 'secondary'  as const, label: 'اللون الثانوي' },
            { key: 'background' as const, label: 'لون الخلفية' },
            { key: 'text'       as const, label: 'لون النص' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
              <input
                type="color"
                value={colors[key]}
                onChange={(e) => set(key, e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 outline-none bg-transparent"
              />
              <div>
                <p className="text-xs font-semibold text-gray-700">{label}</p>
                <p className="text-[10px] text-gray-400 font-mono">{colors[key]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200">← رجوع</button>
        <button onClick={onNext} className="flex-[2] py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95">التالي: التواصل الاجتماعي →</button>
      </div>
    </div>
  );
}
