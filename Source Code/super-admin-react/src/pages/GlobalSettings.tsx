import { useState, useEffect } from 'react';
import { Settings, Save, Mail, CreditCard, LayoutTemplate, ShieldCheck, Loader2, Megaphone, Send, Trash2, AlertCircle, ToggleLeft, ToggleRight, CheckCircle2, Sparkles, Star, Rocket, Handshake, Info, AlertTriangle, Gift } from 'lucide-react';
import clsx from 'clsx';
import api from '../lib/api';

export default function GlobalSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    siteName: '', supportEmail: '', maintenanceMode: false,
    payment: { paymobApiKey: '', paymobIframeId: '', paymobHmac: '' },
    smtp: { host: '', port: 587, user: '', pass: '' },
    featureFlags: { aiEnabled: true, reviewsEnabled: true, newSignupsEnabled: true, affiliateEnabled: false }
  });

  // Announcements
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annType, setAnnType] = useState('info');
  const [annSending, setAnnSending] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [settingsRes, annRes] = await Promise.all([
          api.get('/super-admin/settings'),
          api.get('/super-admin/announcements')
        ]);
        const s = settingsRes.data.data;
        setFormData({
          siteName: s.siteName || 'Matgarco',
          supportEmail: s.supportEmail || 'support@matgarco.com',
          maintenanceMode: s.maintenanceMode || false,
          payment: s.payment || { paymobApiKey: '', paymobIframeId: '', paymobHmac: '' },
          smtp: s.smtp || { host: '', port: 587, user: '', pass: '' },
          featureFlags: s.featureFlags || { aiEnabled: true, reviewsEnabled: true, newSignupsEnabled: true, affiliateEnabled: false }
        });
        setAnnouncements(annRes.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleChange = (section: string, field: string, value: any) => {
    if (section === 'root') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({ ...prev, [section]: { ...(prev as any)[section], [field]: value } }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setSaved(false);
    try {
      await api.patch('/super-admin/settings', formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { alert('فشل حفظ الإعدادات'); }
    finally { setSaving(false); }
  };

  const handleSendAnnouncement = async () => {
    if (!annTitle || !annContent) return alert('أدخل العنوان والمحتوى');
    setAnnSending(true);
    try {
      const res = await api.post('/super-admin/announcements', { title: annTitle, content: annContent, type: annType, targetPlans: ['all'] });
      setAnnouncements(prev => [res.data.data, ...prev]);
      setAnnTitle(''); setAnnContent('');
    } catch { alert('فشل إرسال التعميم'); }
    finally { setAnnSending(false); }
  };

  const handleDeleteAnn = async (id: string) => {
    try {
      await api.delete(`/super-admin/announcements/${id}`);
      setAnnouncements(prev => prev.filter(a => a._id !== id));
    } catch { alert('فشل الحذف'); }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-matgarco-500" size={40} /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"><AlertCircle /> {error}</div>;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center"><Settings size={24} /></div>
          الإعدادات العامة للمنصة
        </h1>
        <p className="text-slate-500">تحكم كامل في إعدادات المنصة، بوابات الدفع، خوادم البريد، والصيانة.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><LayoutTemplate className="text-matgarco-500" /> إعدادات النظام الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">اسم المنصة</label>
              <input type="text" value={formData.siteName} onChange={e => handleChange('root', 'siteName', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-matgarco-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">بريد الدعم الفني الرئيسي</label>
              <input type="email" value={formData.supportEmail} onChange={e => handleChange('root', 'supportEmail', e.target.value)} dir="ltr" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-matgarco-500 outline-none text-left" />
            </div>
            <div className="md:col-span-2 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <input type="checkbox" id="maintenanceMode" checked={formData.maintenanceMode} onChange={e => handleChange('root', 'maintenanceMode', e.target.checked)} className="w-5 h-5 accent-amber-600 rounded" />
              <label htmlFor="maintenanceMode" className="font-bold text-amber-900 cursor-pointer select-none">
                تفعيل وضع الصيانة (Maintenance Mode)
                <p className="text-xs text-amber-700/80 font-normal mt-0.5">سيتم إيقاف التسجيل للمتاجر الجديدة وعرض صفحة "نعود قريباً" للعملاء.</p>
              </label>
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><CreditCard className="text-emerald-500" /> بوابات الدفع المركزية (Paymob)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Secret API Key</label>
              <input type="password" value={formData.payment.paymobApiKey} onChange={e => handleChange('payment', 'paymobApiKey', e.target.value)} dir="ltr" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-left font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Iframe ID</label>
                <input type="text" value={formData.payment.paymobIframeId} onChange={e => handleChange('payment', 'paymobIframeId', e.target.value)} dir="ltr" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-left font-mono" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">HMAC Secret</label>
                <input type="password" value={formData.payment.paymobHmac} onChange={e => handleChange('payment', 'paymobHmac', e.target.value)} dir="ltr" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none text-left font-mono" />
              </div>
            </div>
          </div>
        </div>

        {/* SMTP */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Mail className="text-blue-500" /> إعدادات خادم البريد (SMTP)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">SMTP Host</label>
                <input type="text" value={formData.smtp.host} onChange={e => handleChange('smtp', 'host', e.target.value)} dir="ltr" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 outline-none text-left font-mono" />
              </div>
              <div className="w-32">
                <label className="block text-sm font-bold text-slate-700 mb-2">Port</label>
                <input type="number" value={formData.smtp.port} onChange={e => handleChange('smtp', 'port', parseInt(e.target.value))} dir="ltr" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 outline-none text-left font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
              <input type="text" value={formData.smtp.user} onChange={e => handleChange('smtp', 'user', e.target.value)} dir="ltr" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 outline-none text-left font-mono" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input type="password" value={formData.smtp.pass} onChange={e => handleChange('smtp', 'pass', e.target.value)} dir="ltr" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 outline-none text-left font-mono" />
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><ShieldCheck className="text-indigo-500" /> Feature Flags (تحكم في الخصائص)</h2>
          <div className="space-y-3">
            {[
              { key: 'aiEnabled', icon: Sparkles, label: 'الذكاء الاصطناعي', desc: 'تفعيل/إيقاف خدمات الـ AI لكل التجار' },
              { key: 'reviewsEnabled', icon: Star, label: 'نظام المراجعات', desc: 'السماح للعملاء بكتابة مراجعات على المنتجات' },
              { key: 'newSignupsEnabled', icon: Rocket, label: 'التسجيلات الجديدة', desc: 'السماح بتسجيل متاجر جديدة في المنصة' },
              { key: 'affiliateEnabled', icon: Handshake, label: 'نظام الأفيلييت', desc: 'تفعيل نظام الشركاء والتسويق بالعمولة' }
            ].map(flag => (
              <label key={flag.key} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-200/60 flex items-center justify-center text-slate-600 shrink-0"><flag.icon size={18} /></div>
                  <div>
                    <div className="font-bold text-slate-900">{flag.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{flag.desc}</div>
                  </div>
                </div>
                <button type="button" onClick={() => handleChange('featureFlags', flag.key, !(formData.featureFlags as any)[flag.key])} className="text-2xl">
                  {(formData.featureFlags as any)[flag.key] ? <ToggleRight className="text-matgarco-600" size={32} /> : <ToggleLeft className="text-slate-400" size={32} />}
                </button>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 bg-matgarco-600 hover:bg-matgarco-700 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-md shadow-matgarco-600/20 disabled:bg-slate-400">
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} حفظ الإعدادات
          </button>
          {saved && <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-3.5 rounded-xl"><CheckCircle2 size={20} /> تم الحفظ بنجاح</div>}
        </div>
      </form>

      {/* Announcements Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Megaphone className="text-purple-500" /> التعميمات والإشعارات العالمية</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الإشعار</label>
              <input type="text" value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="مثال: تحديث هام في سياسة التسعير" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">النوع</label>
              <select value={annType} onChange={e => setAnnType(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none">
                <option value="info">معلومات</option>
                <option value="warning">تحذير</option>
                <option value="promo">عرض ترويجي</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">محتوى الرسالة</label>
            <textarea rows={3} value={annContent} onChange={e => setAnnContent(e.target.value)} placeholder="اكتب تفاصيل الإشعار ليظهر في لوحة تحكم جميع التجار..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 outline-none resize-none" />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={handleSendAnnouncement} disabled={annSending} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-md shadow-purple-600/20 disabled:bg-slate-400">
              {annSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} إرسال التعميم
            </button>
          </div>
        </div>

        {/* Previous Announcements */}
        {announcements.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-700 mb-3">التعميمات السابقة ({announcements.length})</h3>
            <div className="space-y-2">
              {announcements.map(ann => (
                <div key={ann._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', ann.type === 'warning' ? 'bg-amber-100 text-amber-600' : ann.type === 'promo' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600')}>
                      {ann.type === 'warning' ? <AlertTriangle size={16} /> : ann.type === 'promo' ? <Gift size={16} /> : <Info size={16} />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-sm truncate">{ann.title}</div>
                      <div className="text-xs text-slate-500 truncate">{ann.content}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400">{new Date(ann.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => handleDeleteAnn(ann._id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
