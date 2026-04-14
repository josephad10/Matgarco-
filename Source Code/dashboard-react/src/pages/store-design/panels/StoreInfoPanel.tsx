interface Props {
  draft: any;
  onChange: (update: Record<string, any>) => void;
}

export default function StoreInfoPanel({ draft, onChange }: Props) {
  const store = draft?.store || {};
  const set = (key: string, val: string) => onChange({ store: { ...store, [key]: val } });

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-sm text-gray-800">معلومات المتجر</h3>

      {[
        { key: 'name',        label: 'اسم المتجر',          placeholder: 'متجر النور' },
        { key: 'description', label: 'وصف المتجر',          placeholder: 'وصف قصير...' },
        { key: 'phone',       label: 'رقم الهاتف',          placeholder: '+966 5X XXX XXXX' },
        { key: 'email',       label: 'البريد الإلكتروني',   placeholder: 'store@example.com' },
        { key: 'address',     label: 'العنوان',              placeholder: 'الرياض، السعودية' },
      ].map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
          {key === 'description' ? (
            <textarea
              value={store[key] || ''}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-indigo-400 text-xs resize-none"
            />
          ) : (
            <input
              value={store[key] || ''}
              onChange={(e) => set(key, e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-indigo-400 text-xs"
              dir={key === 'phone' || key === 'email' ? 'ltr' : 'rtl'}
            />
          )}
        </div>
      ))}

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">العملة</label>
        <select
          value={store.currency || 'SAR'}
          onChange={(e) => set('currency', e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-indigo-400 text-xs"
        >
          <option value="SAR">ريال سعودي (SAR)</option>
          <option value="AED">درهم إماراتي (AED)</option>
          <option value="EGP">جنيه مصري (EGP)</option>
          <option value="KWD">دينار كويتي (KWD)</option>
          <option value="USD">دولار أمريكي ($)</option>
        </select>
      </div>
    </div>
  );
}
