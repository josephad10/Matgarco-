import { useState, useEffect } from 'react';
import { Palette, Plus, Loader2, AlertCircle, Zap, Store, Tag, Eye, Trash2, Clock, X, Save, Package, Settings2, History, Users as UsersIcon, Globe, Shirt, Monitor, UtensilsCrossed, Smartphone, Wrench } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import api from '../lib/api';

const CATEGORY_LABELS: Record<string, string> = {
  general: 'عام',
  fashion: 'ملابس وموضة',
  electronics: 'إلكترونيات',
  food: 'طعام ومشروبات',
  digital: 'منتجات رقمية',
  services: 'خدمات'
};

const CATEGORY_ICONS: Record<string, any> = {
  general: Globe,
  fashion: Shirt,
  electronics: Monitor,
  food: UtensilsCrossed,
  digital: Smartphone,
  services: Wrench
};

const PLAN_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  free_trial: { label: 'تجربة مجانية', color: 'text-slate-700', bg: 'bg-slate-100' },
  starter: { label: 'Starter', color: 'text-blue-700', bg: 'bg-blue-50' },
  professional: { label: 'Professional', color: 'text-purple-700', bg: 'bg-purple-50' },
  business: { label: 'Business', color: 'text-amber-700', bg: 'bg-amber-50' }
};

const INVALID_THUMBNAIL_HOSTS = ['via.placeholder.com'];

const isThemeThumbnailUsable = (thumbnail?: string) => {
  if (!thumbnail) return false;
  return !INVALID_THUMBNAIL_HOSTS.some((host) => thumbnail.includes(host));
};

export default function ThemesList() {
  const navigate = useNavigate();
  const [themes, setThemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [detailTab, setDetailTab] = useState<'info' | 'merchants' | 'versions'>('info');
  const [themeMerchants, setThemeMerchants] = useState<any[]>([]);
  const [loadingMerchants, setLoadingMerchants] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/super-admin/themes');
      setThemes(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch themes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchThemes(); }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/super-admin/themes/${id}/status`, { status: newStatus });
      setThemes(themes.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch { alert('فشل تحديث الحالة'); }
  };

  const handlePlansChange = async (id: string, plan: string, checked: boolean) => {
    const theme = themes.find(t => t._id === id);
    if (!theme) return;
    const newPlans = checked
      ? [...(theme.allowedPlans || []), plan]
      : (theme.allowedPlans || []).filter((p: string) => p !== plan);
    try {
      await api.patch(`/super-admin/themes/${id}/plans`, { allowedPlans: newPlans });
      setThemes(themes.map(t => t._id === id ? { ...t, allowedPlans: newPlans } : t));
    } catch { alert('فشل تحديث الباقات'); }
  };

  const handleCategoryChange = async (id: string, category: string) => {
    try {
      await api.patch(`/super-admin/themes/${id}`, { category });
      setThemes(themes.map(t => t._id === id ? { ...t, category } : t));
    } catch { alert('فشل تحديث التصنيف'); }
  };

  const handleDeleteTheme = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القالب؟')) return;
    try {
      await api.delete(`/super-admin/themes/${id}`);
      setThemes(themes.filter(t => t._id !== id));
      setSelectedTheme(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'فشل حذف القالب');
    }
  };

  const openDetail = async (theme: any) => {
    setSelectedTheme(theme);
    setDetailTab('info');
    setLoadingMerchants(true);
    try {
      const res = await api.get(`/super-admin/themes/${theme._id}/merchants`);
      setThemeMerchants(res.data.data || []);
      setThemes(ts => ts.map(t => t._id === theme._id ? { ...t, merchantCount: res.data.count } : t));
    } catch { setThemeMerchants([]); }
    finally { setLoadingMerchants(false); }
  };

  const filteredThemes = themes.filter(t => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: themes.length,
    active: themes.filter(t => t.status === 'active').length,
    premium: themes.filter(t => t.isPremium).length,
    totalMerchants: themes.reduce((s, t) => s + (t.merchantCount || 0), 0)
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-matgarco-500" size={40} /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"><AlertCircle /> {error}</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner shadow-purple-600/10">
              <Palette size={24} />
            </div>
            محرك القوالب (Theme Engine)
          </h1>
          <p className="text-slate-500">إدارة ومراقبة قوالب المنصة وتحديد الباقات المسموح لها باستخدام كل قالب.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-matgarco-600 hover:bg-matgarco-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-md shadow-matgarco-600/20">
          <Plus size={18} /> قالب جديد
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-black text-slate-900">{stats.total}</div>
          <div className="text-sm text-slate-500 font-medium">إجمالي القوالب</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-black text-emerald-600">{stats.active}</div>
          <div className="text-sm text-slate-500 font-medium">قوالب نشطة</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-black text-amber-600">{stats.premium}</div>
          <div className="text-sm text-slate-500 font-medium">قوالب Premium</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-black text-blue-600">{stats.totalMerchants}</div>
          <div className="text-sm text-slate-500 font-medium">متاجر تستخدم القوالب</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-matgarco-500">
          <option value="all">كل التصنيفات</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-matgarco-500">
          <option value="all">كل الحالات</option>
          <option value="active">● نشط</option>
          <option value="maintenance">● صيانة</option>
          <option value="draft">● مسودة</option>
        </select>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map(theme => (
          <ThemeCard
            key={theme._id}
            theme={theme}
            onStatusChange={s => handleStatusChange(theme._id, s)}
            onPlansChange={(p, c) => handlePlansChange(theme._id, p, c)}
            onCategoryChange={c => handleCategoryChange(theme._id, c)}
            onOpenDetail={() => openDetail(theme)}
            onDelete={() => handleDeleteTheme(theme._id)}
          />
        ))}
      </div>

      {/* Detail Modal */}
      {selectedTheme && (
        <ThemeDetailModal
          theme={selectedTheme}
          merchants={themeMerchants}
          loadingMerchants={loadingMerchants}
          tab={detailTab}
          setTab={setDetailTab}
          onClose={() => setSelectedTheme(null)}
          onRefresh={fetchThemes}
        />
      )}

      {/* Create Theme Modal */}
      {showCreateModal && (
        <CreateThemeModal
          onClose={() => setShowCreateModal(false)}
          onRefresh={fetchThemes}
          onCreated={(themeId) => navigate(`/themes/${themeId}/builder`)}
        />
      )}
    </div>
  );
}

/* ─── Theme Card ─────────────────────────────────────────────────────────────── */
function ThemeCard({ theme, onStatusChange, onPlansChange, onCategoryChange, onOpenDetail, onDelete }: {
  theme: any; onStatusChange: (s: string) => void; onPlansChange: (p: string, c: boolean) => void;
  onCategoryChange: (c: string) => void; onOpenDetail: () => void; onDelete: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowThumbnail = isThemeThumbnailUsable(theme.thumbnail) && !imageFailed;

  return (
    <div className={clsx(
      "bg-white rounded-3xl border transition-all duration-300 relative overflow-hidden group shadow-sm hover:shadow-xl",
      theme.status === 'active' ? 'border-slate-200 hover:border-matgarco-300' : 'border-slate-200 opacity-80'
    )}>
      {/* Premium Badge */}
      {theme.isPremium && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-tr from-amber-400 to-amber-300 text-amber-950 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-amber-400/20">
          <Zap size={14} fill="currentColor" /> Premium
        </div>
      )}

      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
        {shouldShowThumbnail ? (
          <img
            src={theme.thumbnail}
            alt={theme.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 font-bold">
            <Palette size={32} className="mb-2 opacity-40" />
            {theme.name}
          </div>
        )}
        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button onClick={onOpenDetail} className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-110 transition-transform" title="تفاصيل">
            <Eye size={20} />
          </button>
          {!theme.isBuiltIn && (
            <button onClick={onDelete} className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform" title="حذف">
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {theme.name}
              <span className="text-slate-400 font-medium text-sm ml-2 font-mono">v{theme.version || '1.0.0'}</span>
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-1">
                {(() => { const Icon = CATEGORY_ICONS[theme.category]; return Icon ? <Icon size={12} /> : null })()}
                {CATEGORY_LABELS[theme.category] || 'عام'}
              </span>
              {theme.merchantCount > 0 && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Store size={12} /> {theme.merchantCount} متجر
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{theme.description}</p>

        {/* Status Select */}
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-slate-700">الحالة</span>
          <select
            value={theme.status}
            onChange={e => onStatusChange(e.target.value)}
            className={clsx(
              "px-3 py-1.5 rounded-lg font-bold border outline-none text-xs",
              theme.status === 'active' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
              theme.status === 'maintenance' ? "bg-amber-50 text-amber-700 border-amber-200" :
              "bg-slate-100 text-slate-700 border-slate-200"
            )}
          >
            <option value="active">● متاح</option>
            <option value="maintenance">● صيانة</option>
            <option value="draft">● مسودة</option>
          </select>
        </div>

        {/* Category Select */}
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-slate-700 flex items-center gap-1"><Tag size={14} /> التصنيف</span>
          <select
            value={theme.category || 'general'}
            onChange={e => onCategoryChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg font-bold border border-slate-200 bg-slate-50 text-slate-700 outline-none text-xs"
          >
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        {/* Plans Checkboxes */}
        <div className="border-t border-slate-100 pt-3">
          <span className="text-sm font-bold text-slate-700 block mb-2">الباقات المسموحة</span>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(PLAN_LABELS).map(([planId, { label, color, bg }]) => (
              <label key={planId} className={clsx("flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-bold transition-colors", bg, color)}>
                <input
                  type="checkbox"
                  checked={(theme.allowedPlans || []).includes(planId)}
                  onChange={e => onPlansChange(planId, e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-current"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <button onClick={onOpenDetail} className="w-full py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <Settings2 size={14} /> الخصائص
          </button>
          
          <Link to={`/themes/${theme._id}/builder`} className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20">
            <Palette size={14} /> مصمم القالب
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Theme Detail Modal ─────────────────────────────────────────────────────── */
function ThemeDetailModal({ theme, merchants, loadingMerchants, tab, setTab, onClose, onRefresh }: {
  theme: any; merchants: any[]; loadingMerchants: boolean;
  tab: 'info' | 'merchants' | 'versions'; setTab: (t: any) => void;
  onClose: () => void; onRefresh: () => void;
}) {
  const [editName, setEditName] = useState(theme.name);
  const [editDesc, setEditDesc] = useState(theme.description);
  const [editPremium, setEditPremium] = useState(theme.isPremium);
  const [saving, setSaving] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [changelog, setChangelog] = useState('');
  const [versionSaving, setVersionSaving] = useState(false);

  const handleSaveInfo = async () => {
    setSaving(true);
    try {
      await api.patch(`/super-admin/themes/${theme._id}`, { name: editName, description: editDesc, isPremium: editPremium });
      onRefresh();
    } catch { alert('فشل الحفظ'); }
    finally { setSaving(false); }
  };

  const handleReleaseVersion = async () => {
    if (!newVersion) return alert('أدخل رقم الإصدار');
    setVersionSaving(true);
    try {
      await api.post(`/super-admin/themes/${theme._id}/version`, { version: newVersion, changelog });
      setNewVersion(''); setChangelog('');
      onRefresh();
    } catch { alert('فشل إصدار التحديث'); }
    finally { setVersionSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900">{theme.name}</h2>
            <p className="text-sm text-slate-500 mt-1">v{theme.version || '1.0.0'} — {CATEGORY_LABELS[theme.category] || 'عام'}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-6">
          {[
            { id: 'info', label: 'معلومات وتعديل', icon: Settings2 },
            { id: 'merchants', label: `المتاجر (${merchants.length})`, icon: UsersIcon },
            { id: 'versions', label: 'الإصدارات', icon: History }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={clsx(
                "flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-colors",
                tab === t.id ? 'border-matgarco-500 text-matgarco-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'info' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اسم القالب</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-matgarco-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الوصف</label>
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-matgarco-500 outline-none resize-none" />
              </div>
              <label className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer">
                <input type="checkbox" checked={editPremium} onChange={e => setEditPremium(e.target.checked)} className="w-5 h-5 accent-amber-600" />
                <span className="font-bold text-amber-900">👑 قالب Premium (يظهر بعلامة مميزة)</span>
              </label>
              <button onClick={handleSaveInfo} disabled={saving} className="flex items-center gap-2 bg-matgarco-600 hover:bg-matgarco-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors disabled:bg-slate-400">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} حفظ التعديلات
              </button>
            </div>
          )}

          {tab === 'merchants' && (
            <div>
              {loadingMerchants ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-matgarco-500" size={30} /></div>
              ) : merchants.length === 0 ? (
                <div className="text-center py-10 text-slate-400">لا توجد متاجر تستخدم هذا القالب حالياً</div>
              ) : (
                <div className="space-y-3">
                  {merchants.map((m: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Store size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{m.storeName}</div>
                          <div className="text-xs text-slate-500 font-mono">{m.subdomain}.matgarco.com</div>
                        </div>
                      </div>
                      <span className={clsx("text-xs font-bold px-2.5 py-1 rounded", m.isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                        {m.isActive ? 'نشط' : 'موقوف'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'versions' && (
            <div className="space-y-6">
              {/* Release new version */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-slate-900 flex items-center gap-2"><Package size={16} /> إصدار تحديث جديد</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">رقم الإصدار</label>
                    <input value={newVersion} onChange={e => setNewVersion(e.target.value)} placeholder="مثال: 1.1.0" dir="ltr" className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 text-sm font-mono outline-none focus:border-matgarco-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">وصف التحديث</label>
                    <input value={changelog} onChange={e => setChangelog(e.target.value)} placeholder="ما الجديد؟" className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 text-sm outline-none focus:border-matgarco-500" />
                  </div>
                </div>
                <button onClick={handleReleaseVersion} disabled={versionSaving} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-colors disabled:bg-slate-400">
                  {versionSaving ? <Loader2 size={16} className="animate-spin" /> : <Package size={16} />} نشر الإصدار
                </button>
              </div>

              {/* Version history */}
              <div>
                <h4 className="font-bold text-slate-900 mb-3">سجل الإصدارات</h4>
                <div className="text-sm font-bold px-4 py-2 bg-matgarco-50 text-matgarco-700 rounded-lg mb-3">
                  الإصدار الحالي: v{theme.version || '1.0.0'}
                </div>
                {(theme.previousVersions || []).length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-sm">لا توجد إصدارات سابقة</div>
                ) : (
                  <div className="space-y-2">
                    {[...(theme.previousVersions || [])].reverse().map((v: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg">
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                          <Clock size={14} />
                        </div>
                        <div className="flex-1">
                          <span className="font-bold text-slate-900 font-mono text-sm">v{v.version}</span>
                          <span className="text-slate-400 text-xs mr-2">{v.releasedAt ? new Date(v.releasedAt).toLocaleDateString() : ''}</span>
                          {v.changelog && <p className="text-xs text-slate-500 mt-0.5">{v.changelog}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Create Theme Modal ─────────────────────────────────────────────────────── */
function CreateThemeModal({ onClose, onRefresh, onCreated }: { onClose: () => void; onRefresh: () => void; onCreated: (themeId: string) => void }) {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'general',
    status: 'draft',
    isPremium: false,
    openBuilder: true,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      const autoSlug = form.name.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '') || `theme-${Date.now()}`;
      const payload = {
        name: form.name,
        slug: form.slug || autoSlug,
        description: form.description,
        category: form.category,
        status: form.status,
        isPremium: form.isPremium,
      };

      const res = await api.post('/super-admin/themes', payload);
      const createdId = res.data?.data?._id;
      onRefresh();
      onClose();

      if (form.openBuilder && createdId) {
        onCreated(createdId);
      }
    } catch {
      alert('فشل إنشاء القالب!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">إنشاء هيكل قالب جديد</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">اسم القالب بالإنجليزية (Unique)</label>
            <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: Dawn, Nova" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-matgarco-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Slug (اختياري)</label>
            <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="nova-theme" dir="ltr" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-matgarco-500 outline-none font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">وصف القالب</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-matgarco-500 outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">التصنيف</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-matgarco-500 outline-none">
              <option value="general">عام</option>
              <option value="fashion">ملابس وموضة</option>
              <option value="electronics">إلكترونيات</option>
              <option value="food">طعام ومشروبات</option>
              <option value="digital">منتجات رقمية</option>
              <option value="services">خدمات</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">حالة البداية</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-matgarco-500 outline-none">
              <option value="draft">مسودة</option>
              <option value="maintenance">صيانة</option>
              <option value="active">نشط</option>
            </select>
          </div>
          <label className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer">
            <input type="checkbox" checked={form.isPremium} onChange={e => setForm(p => ({ ...p, isPremium: e.target.checked }))} className="w-5 h-5 accent-amber-600" />
            <span className="font-bold text-amber-900">👑 قالب Premium مدفوع</span>
          </label>
          <label className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl cursor-pointer">
            <input type="checkbox" checked={form.openBuilder} onChange={e => setForm(p => ({ ...p, openBuilder: e.target.checked }))} className="w-5 h-5 accent-indigo-600" />
            <span className="font-bold text-indigo-900">فتح الـ Builder مباشرة بعد الإنشاء</span>
          </label>
          <button type="submit" disabled={saving} className="w-full py-3 bg-matgarco-600 hover:bg-matgarco-700 text-white font-bold rounded-xl transition-colors disabled:bg-slate-400 flex justify-center mt-2 items-center gap-2">
            {saving ? <Loader2 size={20} className="animate-spin" /> : 'إنشاء الهيكل'}
          </button>
        </form>
      </div>
    </div>
  );
}
