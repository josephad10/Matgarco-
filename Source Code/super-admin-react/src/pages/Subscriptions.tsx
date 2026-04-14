import { useEffect, useState } from 'react';
import { CreditCard, TrendingUp, DollarSign, Activity, FileText, Loader2, AlertCircle, BarChart3, Users } from 'lucide-react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../lib/api';
import clsx from 'clsx';

const PLAN_COLORS: Record<string, string> = {
  free_trial: '#94a3b8',
  starter: '#3b82f6',
  professional: '#8b5cf6',
  business: '#f59e0b'
};

const PLAN_NAMES: Record<string, string> = {
  free_trial: 'تجربة مجانية',
  starter: 'Starter',
  professional: 'Professional',
  business: 'Business'
};

export default function Subscriptions() {
  const [data, setData] = useState<any>(null);
  const [financeData, setFinanceData] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [kpiRes, financeRes, chartRes, subsRes] = await Promise.all([
          api.get('/super-admin/kpis'),
          api.get('/super-admin/finance/advanced'),
          api.get('/super-admin/dashboard/charts'),
          api.get('/super-admin/subscriptions/all').catch(() => ({ data: { data: { invoices: [] } } })),
        ]);
        setData(kpiRes.data.data);
        setFinanceData(financeRes.data.data);
        setCharts(chartRes.data.data);
        setInvoices(subsRes.data.data?.invoices || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load finances');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-matgarco-500" size={40} /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"><AlertCircle /> {error}</div>;

  const planNames: Record<string, string> = {
    free_trial: 'تجربة مجانية', starter: 'باقة Starter', professional: 'باقة Professional', business: 'باقة Business'
  };
  const pricingMap: Record<string, number> = { free_trial: 0, starter: 250, professional: 450, business: 699 };

  const plansStats = ['business', 'professional', 'starter', 'free_trial'].map(planId => {
    const count = data?.merchantsDistribution?.find((d: any) => d._id === planId)?.count || 0;
    const revenue = count * pricingMap[planId];
    return { id: planId, title: planNames[planId], count, revenue };
  });

  const pieData = (charts?.planDistribution || []).map((d: any) => ({ name: PLAN_NAMES[d.plan] || d.plan, value: d.count }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CreditCard size={24} /></div>
          الماليات والاشتراكات
        </h1>
        <p className="text-slate-500">متابعة إيرادات المنصة، توزيع الباقات، والعمولات المحصلة.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard icon={<DollarSign size={20}/>} label="MRR" value={`${(data?.mrr || 0).toLocaleString()} ج.م`} sub="إيرادات شهرية" color="emerald" />
        <KpiCard icon={<TrendingUp size={20}/>} label="GMV" value={`${(data?.totalGMV || 0).toLocaleString()} ج.م`} sub="مبيعات المتاجر" color="blue" />
        <KpiCard icon={<Activity size={20}/>} label="نشطة" value={data?.activeMerchants || 0} sub="متاجر تعمل الآن" color="purple" />
        <KpiCard icon={<BarChart3 size={20}/>} label="Churn Rate" value={`${financeData?.churnRate || 0}%`} sub="معدل التسرب" color="rose" />
        <KpiCard icon={<Users size={20}/>} label="LTV" value={`${(financeData?.avgLTV || 0).toLocaleString()} ج.م`} sub="القيمة الدائمة" color="amber" />
        <KpiCard icon={<CreditCard size={20}/>} label="عمولات" value={`${(financeData?.commissionRevenue || 0).toLocaleString()} ج.م`} sub="إيرادات العمولات" color="indigo" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">نمو الإيرادات (آخر 12 شهر)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={charts?.revenueTrend || []}>
              <defs>
                <linearGradient id="colorRev2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip formatter={(value) => `${Number(value ?? 0).toLocaleString()} ج.م`} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#colorRev2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">توزيع الباقات</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" nameKey="name" paddingAngle={4}>
                {pieData.map((_: any, i: number) => <Cell key={i} fill={Object.values(PLAN_COLORS)[i % 4]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plan Cards */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">توزيع الباقات والإيرادات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plansStats.map(stat => (
            <div key={stat.id} className={`rounded-2xl border p-5 ${stat.id === 'business' ? 'border-matgarco-200 bg-matgarco-50' : stat.id === 'professional' ? 'border-purple-200 bg-purple-50' : stat.id === 'starter' ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
              <h3 className={`font-bold mb-4 ${stat.id === 'business' ? 'text-matgarco-700' : stat.id === 'professional' ? 'text-purple-700' : stat.id === 'starter' ? 'text-blue-700' : 'text-slate-700'}`}>{stat.title}</h3>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-slate-500 text-xs font-bold mb-1">المتاجر</div>
                  <div className="text-2xl font-black text-slate-900">{stat.count}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-500 text-xs font-bold mb-1">الإيراد الشهري</div>
                  <div className="text-lg font-bold text-slate-700 font-mono">{stat.revenue.toLocaleString()} ج.م</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real Invoices Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText size={18} className="text-slate-400" />
            سجل مدفوعات الاشتراكات
            {invoices.length > 0 && (
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full ms-2">
                {invoices.length}
              </span>
            )}
          </h2>
        </div>
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-bold">رقم الفاتورة</th>
              <th className="px-6 py-4 font-bold">المتجر</th>
              <th className="px-6 py-4 font-bold">الباقة</th>
              <th className="px-6 py-4 font-bold">المبلغ</th>
              <th className="px-6 py-4 font-bold">الحالة</th>
              <th className="px-6 py-4 font-bold">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  لا توجد فواتير بعد — ستظهر هنا فور اشتراك أول تاجر
                </td>
              </tr>
            ) : invoices.map((inv: any) => (
              <tr key={inv._id || inv.invoiceNumber} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-500">{inv.invoiceNumber}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 text-sm">{inv.merchantName || '—'}</div>
                  <div className="text-xs text-slate-400">{inv.merchantEmail}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={clsx('px-2 py-0.5 rounded-full text-xs font-bold',
                    inv.plan === 'business' ? 'bg-amber-100 text-amber-800' :
                    inv.plan === 'professional' ? 'bg-purple-100 text-purple-800' :
                    inv.plan === 'starter' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                  )}>{PLAN_NAMES[inv.plan] || inv.plan}</span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 font-mono">{(inv.amount || 0).toLocaleString()} ج.م</td>
                <td className="px-6 py-4">
                  <span className={clsx('px-2.5 py-1 rounded-full text-xs font-bold',
                    inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                    inv.status === 'failed' ? 'bg-red-50 text-red-700' :
                    inv.status === 'refunded' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'
                  )}>
                    {inv.status === 'paid' ? 'مدفوعة' : inv.status === 'failed' ? 'فشل' : inv.status === 'refunded' ? 'مسترجعة' : 'معلقة'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs font-mono">{new Date(inv.createdAt).toLocaleDateString('ar')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: any; sub: string; color: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div className={`w-9 h-9 rounded-lg bg-${color}-100 flex items-center justify-center text-${color}-600 mb-3`}>{icon}</div>
      <div className="text-xs font-bold text-slate-500 mb-1">{label}</div>
      <div className="text-xl font-black text-slate-900">{value}</div>
      <div className="text-xs text-slate-400 mt-1">{sub}</div>
    </div>
  );
}
