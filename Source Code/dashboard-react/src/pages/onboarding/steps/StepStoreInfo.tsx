import type { OnboardingData } from '../OnboardingWizard';

interface Props {
  data: OnboardingData['store'];
  onChange: (data: OnboardingData['store']) => void;
  onNext: () => void;
}

export default function StepStoreInfo({ data, onChange, onNext }: Props) {
  const set = (key: keyof typeof data, val: string) => onChange({ ...data, [key]: val });
  const isValid = data.name.trim().length >= 2;

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🏪</div>
        <h1 className="text-2xl font-black text-gray-900">معلومات متجرك</h1>
        <p className="text-gray-500 mt-2 text-sm">هذه المعلومات ستظهر لزوار متجرك</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">اسم المتجر <span className="text-red-500">*</span></label>
          <input
            value={data.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="مثال: متجر النور"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">وصف المتجر</label>
          <textarea
            value={data.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="وصف قصير لما تبيعه..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">رقم الهاتف</label>
            <input
              value={data.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+966 5X XXX XXXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">البريد الإلكتروني</label>
            <input
              value={data.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="store@example.com"
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all"
              dir="ltr"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">العملة</label>
            <select
              value={data.currency}
              onChange={(e) => set('currency', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 text-sm"
            >
              <option value="SAR">ريال سعودي (SAR)</option>
              <option value="AED">درهم إماراتي (AED)</option>
              <option value="EGP">جنيه مصري (EGP)</option>
              <option value="KWD">دينار كويتي (KWD)</option>
              <option value="USD">دولار أمريكي (USD)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">العنوان</label>
            <input
              value={data.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="الرياض، السعودية"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="w-full mt-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 active:scale-95"
      >
        التالي: اختر القالب →
      </button>
    </div>
  );
}
