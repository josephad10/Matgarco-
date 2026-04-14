import { useState, useEffect } from 'react';
import {
  CreditCard, CheckCircle2, XCircle, AlertCircle, Loader2,
  Zap, Star, Crown, Receipt, X, ChevronRight,
  CalendarDays, RefreshCw, TrendingUp
} from 'lucide-react';
import clsx from 'clsx';
import axios from '../lib/axios';

const PLAN_ICONS: Record<string, any> = {
  free_trial: Zap,
  starter: TrendingUp,
  professional: Star,
  business: Crown,
};

const PLAN_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  free_trial:   { bg: 'bg-slate-50',   border: 'border-slate-200',   text: 'text-slate-700',   badge: 'bg-slate-100 text-slate-700' },
  starter:      { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700',    badge: 'bg-blue-100 text-blue-800' },
  professional: { bg: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-700',  badge: 'bg-violet-100 text-violet-800' },
  business:     { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-800' },
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  trialing:  { label: 'تجربة مجانية', color: 'text-blue-700',    bg: 'bg-blue-50'    },
  active:    { label: 'نشط',          color: 'text-emerald-700', bg: 'bg-emerald-50' },
  past_due:  { label: 'متأخر الدفع',  color: 'text-amber-700',   bg: 'bg-amber-50'   },
  cancelled: { label: 'ملغي',         color: 'text-red-700',     bg: 'bg-red-50'     },
  expired:   { label: 'منتهي',        color: 'text-slate-700',   bg: 'bg-slate-100'  },
};

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [plansRes, subRes, invRes] = await Promise.allSettled([
        axios.get('/subscriptions/plans'),
        axios.get('/subscriptions/my'),
        axios.get('/subscriptions/invoices'),
      ]);
      if (plansRes.status === 'fulfilled') setPlans(plansRes.value.data.data || []);
      if (subRes.status === 'fulfilled') setSubscription(subRes.value.data.data?.subscription);
      if (invRes.status === 'fulfilled') setInvoices(invRes.value.data.data || []);
    } catch (err: any) {
      setError('فشل تحميل بيانات الاشتراك');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setActionLoading(planId);
    try {
      await axios.post('/subscriptions/subscribe', { planId, billingCycle });
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'فشل الاشتراك');
    } finally { setActionLoading(''); }
  };

  const handleUpgrade = async (planId: string) => {
    setActionLoading(planId);
    try {
      await axios.post('/subscriptions/upgrade', { planId, billingCycle });
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'فشل الترقية');
    } finally { setActionLoading(''); }
  };

  const handleDowngrade = async (planId: string) => {
    setActionLoading(planId);
    try {
      await axios.post('/subscriptions/downgrade', { planId });
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'فشل التخفيض');
    } finally { setActionLoading(''); }
  };

  const handleCancel = async () => {
    setActionLoading('cancel');
    try {
      await axios.post('/subscriptions/cancel', { reason: cancelReason });
      setShowCancel(false);
      await fetchAll();
    } catch (err: any) {
      alert(err.response?.data?.message || 'فشل الإلغاء');
    } finally { setActionLoading(''); }
  };

  const getPlanAction = (plan: any) => {
    if (!subscription) return { label: 'اشترك الآن', action: () => handleSubscribe(plan.id), type: 'subscribe' };
    const planOrder = ['free_trial', 'starter', 'professional', 'business'];
    const currentIdx = planOrder.indexOf(subscription.plan);
    const planIdx = planOrder.indexOf(plan.id);
    if (plan.id === subscription.plan) return { label: 'باقتك الحالية', disabled: true, type: 'current' };
    if (planIdx > currentIdx) return { label: 'ترقية', action: () => handleUpgrade(plan.id), type: 'upgrade' };
    if (plan.id !== 'free_trial') return { label: 'تخفيض', action: () => handleDowngrade(plan.id), type: 'downgrade' };
    return { label: 'غير متاح', disabled: true, type: 'disabled' };
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-matgarco-500" size={40} /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2"><AlertCircle size={18} /> {error}</div>;

  const currentPlanColors = subscription ? PLAN_COLORS[subscription.plan] : PLAN_COLORS.free_trial;
  const currentStatus = subscription ? STATUS_LABELS[subscription.status] : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-matgarco-50 text-matgarco-600 flex items-center justify-center"><CreditCard size={20} /></div>
          الاشتراك والفواتير
        </h1>
        <p className="text-slate-500 mt-1">إدارة باقتك، ترقية خطتك، ومراجعة الفواتير.</p>
      </div>

      {/* Current Subscription Card */}
      {subscription ? (
        <div className={clsx('rounded-2xl border p-6 shadow-sm', currentPlanColors.bg, currentPlanColors.border)}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {(() => { const Icon = PLAN_ICONS[subscription.plan] || Zap; return (
                <div className={clsx('w-14 h-14 rounded-2xl flex items-center justify-center', currentPlanColors.text, 'bg-white shadow-sm')}>
                  <Icon size={28} />
                </div>
              ); })()}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className={clsx('text-2xl font-extrabold', currentPlanColors.text)}>{subscription.plan?.replace('_', ' ')?.toUpperCase()}</h2>
                  {currentStatus && (
                    <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-bold', currentStatus.bg, currentStatus.color)}>
                      {currentStatus.label}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><CalendarDays size={14} /> تجديد: {new Date(subscription.currentPeriodEnd).toLocaleDateString('ar')}</span>
                  <span className="flex items-center gap-1"><RefreshCw size={14} /> {subscription.autoRenew ? 'تجديد تلقائي' : 'بدون تجديد'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className={clsx('text-3xl font-black', currentPlanColors.text)}>{subscription.amount} <span className="text-base font-bold">ج.م</span></div>
                <div className="text-xs text-slate-500">{subscription.billingCycle === 'yearly' ? 'سنوياً' : 'شهرياً'}</div>
              </div>
              {subscription.status !== 'cancelled' && (
                <button onClick={() => setShowCancel(true)} className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors">
                  إلغاء الاشتراك
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-3">
          <AlertCircle className="text-amber-600 shrink-0" />
          <div>
            <div className="font-bold text-amber-900">لا يوجد اشتراك نشط</div>
            <div className="text-sm text-amber-700">اختر باقة من القائمة أدناه للبدء.</div>
          </div>
        </div>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-900">اختر باقتك</h3>
        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
          <button onClick={() => setBillingCycle('monthly')} className={clsx('px-4 py-1.5 rounded-lg text-sm font-bold transition-colors', billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500')}>شهري</button>
          <button onClick={() => setBillingCycle('yearly')} className={clsx('px-4 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5', billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500')}>
            سنوي <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">وفر 17%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan) => {
          const colors = PLAN_COLORS[plan.id] || PLAN_COLORS.starter;
          const Icon = PLAN_ICONS[plan.id] || Zap;
          const { label, action, disabled, type } = getPlanAction(plan) as any;
          const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.price;
          const isCurrent = type === 'current';

          return (
            <div key={plan.id} className={clsx('rounded-2xl border-2 p-5 flex flex-col gap-4 transition-all', isCurrent ? `${colors.border} ${colors.bg}` : 'border-slate-200 bg-white hover:border-matgarco-300')}>
              <div>
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', colors.bg, colors.text)}><Icon size={20} /></div>
                <h4 className="text-lg font-extrabold text-slate-900">{plan.nameEn}</h4>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-slate-900">{price}</span>
                  <span className="text-sm text-slate-500">ج.م/{billingCycle === 'yearly' ? 'سنة' : 'شهر'}</span>
                </div>
              </div>

              <ul className="space-y-2 flex-1">
                {plan.features.map((f: string) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.commission > 0 && (
                  <li className="flex items-center gap-2 text-sm text-amber-700">
                    <AlertCircle size={14} className="shrink-0" />
                    عمولة منصة {plan.commission}%
                  </li>
                )}
              </ul>

              <button
                onClick={action}
                disabled={disabled || !!actionLoading}
                className={clsx(
                  'w-full py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2',
                  isCurrent
                    ? `${colors.bg} ${colors.text} border ${colors.border} cursor-default`
                    : type === 'upgrade'
                    ? 'bg-matgarco-600 text-white hover:bg-matgarco-700 disabled:bg-slate-300'
                    : type === 'subscribe'
                    ? 'bg-matgarco-600 text-white hover:bg-matgarco-700 disabled:bg-slate-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400'
                )}
              >
                {actionLoading === plan.id ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
                {label}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoices Table */}
      {invoices.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Receipt size={18} className="text-slate-400" />
            <h3 className="text-lg font-bold text-slate-900">سجل الفواتير</h3>
          </div>
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5 font-bold">رقم الفاتورة</th>
                <th className="px-6 py-3.5 font-bold">الوصف</th>
                <th className="px-6 py-3.5 font-bold">المبلغ</th>
                <th className="px-6 py-3.5 font-bold">الحالة</th>
                <th className="px-6 py-3.5 font-bold">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv: any) => (
                <tr key={inv._id || inv.invoiceNumber} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4 text-slate-700">{inv.description}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{inv.amount?.toLocaleString()} ج.م</td>
                  <td className="px-6 py-4">
                    <span className={clsx('px-2.5 py-1 rounded-full text-xs font-bold', inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : inv.status === 'failed' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700')}>
                      {inv.status === 'paid' ? 'مدفوعة' : inv.status === 'failed' ? 'فشل' : inv.status === 'refunded' ? 'مسترجعة' : 'معلقة'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">{new Date(inv.createdAt).toLocaleDateString('ar')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowCancel(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-red-700 flex items-center gap-2"><XCircle size={20} /> تأكيد الإلغاء</h3>
              <button onClick={() => setShowCancel(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><X size={16} /></button>
            </div>
            <p className="text-slate-600 text-sm mb-4">سيستمر وصولك للمتجر حتى نهاية فترة الاشتراك الحالية. هل أنت متأكد؟</p>
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">سبب الإلغاء (اختياري)</label>
              <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none resize-none text-sm" placeholder="أخبرنا لماذا تلغي اشتراكك..." />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-sm">تراجع</button>
              <button onClick={handleCancel} disabled={!!actionLoading} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 text-sm disabled:bg-slate-400 flex items-center justify-center gap-2">
                {actionLoading === 'cancel' ? <Loader2 size={16} className="animate-spin" /> : null} تأكيد الإلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
