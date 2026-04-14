interface Props {
  draft: any;
  onChange: (update: Record<string, any>) => void;
}

export default function SeoPanel({ draft, onChange }: Props) {
  const seo = draft?.seo || {};
  const set = (key: string, val: string) => onChange({ seo: { ...seo, [key]: val } });

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-sm text-gray-800">إعدادات SEO</h3>
      <p className="text-xs text-gray-400">تحسين ظهور متجرك في محركات البحث</p>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">عنوان الصفحة (Title)</label>
        <input
          value={seo.title || ''}
          onChange={(e) => set('title', e.target.value)}
          placeholder="متجر النور | اكتشف أحدث المنتجات"
          maxLength={60}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-indigo-400 text-xs"
        />
        <p className="text-[10px] text-gray-400 mt-1">{(seo.title || '').length}/60 حرف</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">الوصف (Meta Description)</label>
        <textarea
          value={seo.description || ''}
          onChange={(e) => set('description', e.target.value)}
          placeholder="اكتشف مجموعة واسعة من المنتجات..."
          maxLength={160}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-indigo-400 text-xs resize-none"
        />
        <p className="text-[10px] text-gray-400 mt-1">{(seo.description || '').length}/160 حرف</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">الكلمات المفتاحية (Keywords)</label>
        <input
          value={seo.keywords || ''}
          onChange={(e) => set('keywords', e.target.value)}
          placeholder="متجر, منتجات, تسوق, عروض"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-indigo-400 text-xs"
        />
        <p className="text-[10px] text-gray-400 mt-1">افصل بين الكلمات بفاصلة</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">صورة المشاركة (OG Image)</label>
        <input
          value={seo.ogImage || ''}
          onChange={(e) => set('ogImage', e.target.value)}
          placeholder="https://..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-indigo-400 text-xs"
          dir="ltr"
        />
        <p className="text-[10px] text-gray-400 mt-1">الحجم المناسب: 1200×628 بكسل</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">الأيقونة (Favicon)</label>
        <input
          value={seo.favicon || ''}
          onChange={(e) => set('favicon', e.target.value)}
          placeholder="https://... (.ico أو .png)"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-indigo-400 text-xs"
          dir="ltr"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Google Analytics ID</label>
        <input
          value={seo.googleAnalyticsId || ''}
          onChange={(e) => set('googleAnalyticsId', e.target.value)}
          placeholder="G-XXXXXXXXXX"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-indigo-400 text-xs"
          dir="ltr"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Facebook Pixel ID</label>
        <input
          value={seo.facebookPixelId || ''}
          onChange={(e) => set('facebookPixelId', e.target.value)}
          placeholder="XXXXXXXXXXXXXXXXX"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-indigo-400 text-xs"
          dir="ltr"
        />
      </div>
    </div>
  );
}
