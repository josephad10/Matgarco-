import type { OnboardingData } from '../OnboardingWizard';

interface Props {
  social: OnboardingData['social'];
  onChange: (social: OnboardingData['social']) => void;
  onFinish: () => void;
  onBack: () => void;
  loading: boolean;
}

const PLATFORMS = [
  { key: 'instagram' as const, label: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/yourstore' },
  { key: 'twitter'   as const, label: 'X / Twitter', icon: '𝕏', placeholder: 'https://x.com/yourstore' },
  { key: 'facebook'  as const, label: 'Facebook', icon: '👥', placeholder: 'https://facebook.com/yourstore' },
  { key: 'tiktok'    as const, label: 'TikTok', icon: '🎵', placeholder: 'https://tiktok.com/@yourstore' },
];

export default function StepSocial({ social, onChange, onFinish, onBack, loading }: Props) {
  const set = (key: keyof typeof social, val: string) => onChange({ ...social, [key]: val });

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">📱</div>
        <h1 className="text-2xl font-black text-gray-900">روابط التواصل الاجتماعي</h1>
        <p className="text-gray-500 mt-2 text-sm">اختياري — يمكن تعديلها لاحقاً من الإعدادات</p>
      </div>

      <div className="space-y-3">
        {PLATFORMS.map(({ key, label, icon, placeholder }) => (
          <div key={key} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <span className="text-2xl w-8 text-center flex-shrink-0">{icon}</span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-600 mb-0.5">{label}</p>
              <input
                value={social[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full outline-none text-xs text-gray-800 bg-transparent"
                dir="ltr"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={onBack} disabled={loading} className="flex-1 py-3 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
          ← رجوع
        </button>
        <button
          onClick={onFinish}
          disabled={loading}
          className="flex-[2] py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              جاري الحفظ...
            </>
          ) : '🚀 إنشاء متجري'}
        </button>
      </div>
    </div>
  );
}
