import { useEffect, useState } from 'react';
import { Wallet, CreditCard, Clock, CheckCircle, AlertCircle, Building2, Eye, EyeOff, Loader2, Save } from 'lucide-react';
import api from '../../lib/axios';
import clsx from 'clsx';

interface PayoutData {
  pendingBalance: number;
  totalPaidOut: number;
  lastPayoutAt?: string;
  nextPayoutDate: string;
  commissionInfo: {
    plan: string;
    paymobRate: number;
    matgarcoRate: number;
    totalRate: number;
    description: string;
  };
  payoutHistory: any[];
  pendingOrders: any[];
}

export default function FinancePage() {
  const [data, setData] = useState<PayoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'balance' | 'history' | 'settings'>('balance');

  // Bank form
  const [bankForm, setBankForm] = useState({ bankName: '', accountNumber: '', accountName: '', iban: '' });
  const [bankSaving, setBankSaving] = useState(false);
  const [bankSuccess, setBankSuccess] = useState('');

  // Paymob form (Business plan only)
  const [paymobForm, setPaymobForm] = useState({ secretKey: '', publicKey: '', integrationId: '' });
  const [showSecret, setShowSecret] = useState(false);
  const [paymobSaving, setPaymobSaving] = useState(false);
  const [paymobSuccess, setPaymobSuccess] = useState('');

  useEffect(() => {
    api.get('/payouts/my').then((res) => {
      setData(res.data.data);
    }).catch((e) => {
      setError(e.response?.data?.message || 'فشل تحميل بيانات المالية');
    }).finally(() => setLoading(false));
  }, []);

  const saveBankInfo = async () => {
    setBankSaving(true);
    try {
      await api.put('/payouts/bank-info', bankForm);
      setBankSuccess('تم حفظ بيانات البنك بنجاح');
      setTimeout(() => setBankSuccess(''), 3000);
    } catch (e: any) {
      setError(e.response?.data?.message || 'فشل حفظ البيانات');
    } finally {
      setBankSaving(false);
    }
  };

  const savePaymobConfig = async () => {
    setPaymobSaving(true);
    try {
      await api.put('/payouts/paymob-config', paymobForm);
      setPaymobSuccess('تم ربط Paymob بنجاح');
      setTimeout(() => setPaymobSuccess(''), 3000);
    } catch (e: any) {
      setError(e.response?.data?.message || 'فشل ربط Paymob');
    } finally {
      setPaymobSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-matgarco-500" size={36} /></div>;
  if (error && !data) return <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"><AlertCircle size={16} /> {error}</div>;
  if (!data) return null;

  const plan = data.commissionInfo.plan;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Wallet size={22} />
          </div>
          الماليات والتسويات
        </h1>
        <p className="text-slate-500">أرصدتك المعلقة وتواريخ تحويل المستحقات</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-sm font-bold opacity-75 mb-1">الرصيد المعلق</div>
          <div className="text-4xl font-black">{data.pendingBalance.toLocaleString()} <span className="text-xl opacity-75">ج.م</span></div>
          <div className="text-xs opacity-70 mt-2">سيتم تحويله في التسوية القادمة</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-3"><CheckCircle size={18} /></div>
          <div className="text-xs font-bold text-slate-500 mb-1">إجمالي ما تم تحويله</div>
          <div className="text-2xl font-black text-slate-900">{data.totalPaidOut.toLocaleString()} <span className="text-base text-slate-400">ج.م</span></div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="w-9 h-9 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-3"><Clock size={18} /></div>
          <div className="text-xs font-bold text-slate-500 mb-1">التسوية القادمة</div>
          <div className="text-xl font-black text-slate-900">{new Date(data.nextPayoutDate).toLocaleDateString('ar', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <div className="text-xs text-slate-400 mt-1">كل أسبوع (الأحد)</div>
        </div>
      </div>

      {/* Commission Info */}
      <div className={clsx('rounded-2xl border p-5 flex items-start gap-4',
        plan === 'business' ? 'bg-amber-50 border-amber-200' :
        plan === 'professional' ? 'bg-purple-50 border-purple-200' :
        plan === 'starter' ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'
      )}>
        <CreditCard size={20} className={clsx(
          plan === 'business' ? 'text-amber-600' :
          plan === 'professional' ? 'text-purple-600' :
          plan === 'starter' ? 'text-blue-600' : 'text-slate-600'
        )} />
        <div>
          <div className="font-bold text-slate-900 text-sm mb-0.5">هيكل العمولات — باقة {data.commissionInfo.plan}</div>
          <div className="text-sm text-slate-600">{data.commissionInfo.description}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {[{ key: 'balance', label: 'الطلبات المعلقة' }, { key: 'history', label: 'سجل التسويات' }, { key: 'settings', label: 'الإعدادات' }].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={clsx('px-5 py-2 rounded-lg text-sm font-bold transition-all', tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {tab === 'balance' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">الطلبات المدفوعة (في انتظار التسوية)</h3>
          </div>
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-slate-500 font-bold">رقم الطلب</th>
                <th className="px-6 py-3 text-slate-500 font-bold">إجمالي الطلب</th>
                <th className="px-6 py-3 text-slate-500 font-bold">رسوم Paymob</th>
                <th className="px-6 py-3 text-slate-500 font-bold">عمولة المنصة</th>
                <th className="px-6 py-3 text-slate-500 font-bold text-blue-600">صافيك</th>
                <th className="px-6 py-3 text-slate-500 font-bold">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.pendingOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">لا توجد طلبات معلقة حالياً</td></tr>
              ) : data.pendingOrders.map((o: any) => (
                <tr key={o._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-slate-600">{o.orderNumber}</td>
                  <td className="px-6 py-3 font-mono text-slate-700">{o.total?.toLocaleString()} ج.م</td>
                  <td className="px-6 py-3 font-mono text-rose-500">−{o.paymobFee?.toLocaleString()} ج.م</td>
                  <td className="px-6 py-3 font-mono text-orange-500">−{o.matgarcoFee?.toLocaleString()} ج.م</td>
                  <td className="px-6 py-3 font-black text-blue-600 font-mono">{o.merchantNet?.toLocaleString()} ج.م</td>
                  <td className="px-6 py-3 text-xs text-slate-400 font-mono">{new Date(o.createdAt).toLocaleDateString('ar')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'history' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-slate-500 font-bold">الفترة</th>
                <th className="px-6 py-3 text-slate-500 font-bold">عدد الطلبات</th>
                <th className="px-6 py-3 text-slate-500 font-bold">المبلغ المحوّل</th>
                <th className="px-6 py-3 text-slate-500 font-bold">رقم الإيصال</th>
                <th className="px-6 py-3 text-slate-500 font-bold">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.payoutHistory.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">لا يوجد سجل تسويات بعد</td></tr>
              ) : data.payoutHistory.map((p: any) => (
                <tr key={p._id}>
                  <td className="px-6 py-3 text-xs text-slate-500 font-mono">{new Date(p.periodFrom).toLocaleDateString('ar')} → {new Date(p.periodTo).toLocaleDateString('ar')}</td>
                  <td className="px-6 py-3 font-mono">{p.ordersCount}</td>
                  <td className="px-6 py-3 font-black text-blue-600 font-mono">{p.netAmount?.toLocaleString()} ج.م</td>
                  <td className="px-6 py-3 text-xs font-mono text-slate-500">{p.transferReference || '—'}</td>
                  <td className="px-6 py-3 text-xs text-slate-400 font-mono">{new Date(p.paidAt || p.createdAt).toLocaleDateString('ar')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'settings' && (
        <div className="space-y-6">
          {/* Bank Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Building2 size={18} className="text-slate-400" /> بيانات الحساب البنكي</h3>
            <p className="text-sm text-slate-500">يستخدم فريق Matgarco هذه البيانات لتحويل مستحقاتك أسبوعياً.</p>
            {bankSuccess && <div className="p-3 bg-emerald-50 rounded-xl text-sm text-emerald-700 flex items-center gap-2"><CheckCircle size={14} /> {bankSuccess}</div>}
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'bankName', label: 'اسم البنك', placeholder: 'البنك الأهلي' },
                { key: 'accountName', label: 'اسم صاحب الحساب', placeholder: 'أحمد محمد' },
                { key: 'accountNumber', label: 'رقم الحساب', placeholder: '1234567890' },
                { key: 'iban', label: 'IBAN (اختياري)', placeholder: 'EG00...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{f.label}</label>
                  <input
                    value={(bankForm as any)[f.key]}
                    onChange={e => setBankForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
            <button onClick={saveBankInfo} disabled={bankSaving} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
              {bankSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} حفظ البيانات البنكية
            </button>
          </div>

          {/* Paymob Config — Business plan only */}
          {plan === 'business' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-amber-900 flex items-center gap-2"><CreditCard size={18} /> ربط بوابة Paymob الخاصة</h3>
              <p className="text-sm text-amber-700">باقة Business: مدفوعات عملائك تذهب مباشرة لحسابك في Paymob.</p>
              {paymobSuccess && <div className="p-3 bg-emerald-50 rounded-xl text-sm text-emerald-700 flex items-center gap-2"><CheckCircle size={14} /> {paymobSuccess}</div>}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-amber-800 mb-1.5">Public Key</label>
                  <input value={paymobForm.publicKey} onChange={e => setPaymobForm(p => ({ ...p, publicKey: e.target.value }))} placeholder="egy_pk_..." className="w-full px-4 py-2.5 border border-amber-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-800 mb-1.5">Secret Key</label>
                  <div className="relative">
                    <input type={showSecret ? 'text' : 'password'} value={paymobForm.secretKey} onChange={e => setPaymobForm(p => ({ ...p, secretKey: e.target.value }))} placeholder="egy_sk_..." className="w-full px-4 py-2.5 border border-amber-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10" />
                    <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
                      {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-800 mb-1.5">Integration ID (اختياري)</label>
                  <input value={paymobForm.integrationId} onChange={e => setPaymobForm(p => ({ ...p, integrationId: e.target.value }))} placeholder="123456" className="w-full px-4 py-2.5 border border-amber-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>
              <button onClick={savePaymobConfig} disabled={paymobSaving} className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
                {paymobSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} ربط Paymob
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
