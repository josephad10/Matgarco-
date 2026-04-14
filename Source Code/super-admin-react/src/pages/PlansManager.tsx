import { useState, useEffect } from 'react';
import { CreditCard, Save, Loader2, AlertCircle, ShieldCheck, Box, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import api from '../lib/api';

const PLAN_THEMES: Record<string, { ring: string; gradient: string; icon: string }> = {
  free_trial: { ring: 'focus:ring-slate-500', gradient: 'from-slate-100 to-slate-200 text-slate-800', icon: 'bg-slate-200 text-slate-700' },
  starter: { ring: 'focus:ring-blue-500', gradient: 'from-blue-50 to-blue-100 text-blue-900', icon: 'bg-blue-200 text-blue-700' },
  professional: { ring: 'focus:ring-purple-500', gradient: 'from-purple-50 to-purple-100 text-purple-900', icon: 'bg-purple-200 text-purple-700' },
  business: { ring: 'focus:ring-amber-500', gradient: 'from-amber-50 to-amber-100 text-amber-900', icon: 'bg-amber-200 text-amber-700' }
};

export default function PlansManager() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/super-admin/plans');
        setPlans(res.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleChange = (slug: string, field: string, value: any, nestedKey?: string) => {
    setPlans(prev => prev.map(p => {
      if (p.slug !== slug) return p;
      if (nestedKey) {
        return { ...p, [nestedKey]: { ...p[nestedKey], [field]: value } };
      }
      return { ...p, [field]: value };
    }));
  };

  const handleSave = async (plan: any) => {
    setSavingPlanId(plan.slug);
    setSavedPlanId(null);
    try {
      await api.patch(`/super-admin/plans/${plan.slug}`, {
        price: plan.price,
        yearlyPrice: plan.yearlyPrice,
        commissionRate: plan.commissionRate,
        limits: plan.limits,
        isActive: plan.isActive,
        features: plan.features
      });
      setSavedPlanId(plan.slug);
      setTimeout(() => setSavedPlanId(null), 3000);
    } catch {
      alert('فشل حفظ الباقة');
    } finally {
      setSavingPlanId(null);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-matgarco-500" size={40} /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"><AlertCircle /> {error}</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><CreditCard size={24} /></div>
          إدارة باقات الاشتراك (Plans Engine)
        </h1>
        <p className="text-slate-500">تحكم كامل في حدود وأسعار وعمولات الاشتراكات في المنصة.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const theme = PLAN_THEMES[plan.slug] || PLAN_THEMES.starter;
          const isSaving = savingPlanId === plan.slug;
          const isSaved = savedPlanId === plan.slug;

          return (
            <div key={plan._id} className={clsx("bg-white rounded-3xl border transition-all duration-300 shadow-sm overflow-hidden flex flex-col", (plan.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60'))}>
              {/* Header */}
              <div className={clsx("p-6 bg-gradient-to-br border-b border-slate-100", theme.gradient)}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xl">{plan.nameAr}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/50">{plan.name}</span>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={plan.isActive} onChange={e => handleChange(plan.slug, 'isActive', e.target.checked)} />
                      <div className={clsx("block w-10 h-6 rounded-full transition-colors", plan.isActive ? "bg-slate-800" : "bg-slate-300")}></div>
                      <div className={clsx("dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform", plan.isActive ? "transform translate-x-4" : "")}></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6 flex-1">
                {/* Pricing */}
                <div className="space-y-3">
                  <h4 className="font-black text-slate-800 text-sm flex items-center gap-2"><CreditCard size={14} /> التسعير والعمولات</h4>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">السعر الشهري (ج.م)</label>
                    <input type="number" value={plan.price} onChange={e => handleChange(plan.slug, 'price', Number(e.target.value))} className={clsx("w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono outline-none focus:ring-2 focus:border-transparent", theme.ring)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">السعر السنوي (ج.م)</label>
                    <input type="number" value={plan.yearlyPrice} onChange={e => handleChange(plan.slug, 'yearlyPrice', Number(e.target.value))} className={clsx("w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono outline-none focus:ring-2 focus:border-transparent", theme.ring)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">نسبة عمولة المنصة (مثال: 0.02 = 2%)</label>
                    <input type="number" step="0.01" value={plan.commissionRate} onChange={e => handleChange(plan.slug, 'commissionRate', Number(e.target.value))} className={clsx("w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono outline-none focus:ring-2 focus:border-transparent", theme.ring)} />
                  </div>
                </div>

                {/* Limits */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="font-black text-slate-800 text-sm flex items-center gap-2"><ShieldCheck size={14} /> حدود الاستخدام (-1 تعني لا نهائي)</h4>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Box size={12} /> الحد الأقصى للمنتجات</label>
                    <input type="number" value={plan.limits?.maxProducts} onChange={e => handleChange(plan.slug, 'maxProducts', Number(e.target.value), 'limits')} className={clsx("w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono outline-none focus:ring-2 focus:border-transparent", theme.ring)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Users size={12} /> حسابات فريق العمل</label>
                    <input type="number" value={plan.limits?.maxStaffUsers} onChange={e => handleChange(plan.slug, 'maxStaffUsers', Number(e.target.value), 'limits')} className={clsx("w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono outline-none focus:ring-2 focus:border-transparent", theme.ring)} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1"><Sparkles size={12} /> رصيد الذكاء الاصطناعي (شهرياً)</label>
                    <input type="number" value={plan.limits?.aiCreditsPerMonth} onChange={e => handleChange(plan.slug, 'aiCreditsPerMonth', Number(e.target.value), 'limits')} className={clsx("w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 font-mono outline-none focus:ring-2 focus:border-transparent", theme.ring)} />
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
                <button 
                  onClick={() => handleSave(plan)}
                  disabled={isSaving}
                  className={clsx(
                    "w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors",
                    isSaved ? "bg-emerald-500 text-white" : "bg-slate-900 hover:bg-slate-800 text-white disabled:bg-slate-400"
                  )}
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : isSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
                  {isSaved ? 'تم الحفظ' : 'حفظ التعديلات'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
