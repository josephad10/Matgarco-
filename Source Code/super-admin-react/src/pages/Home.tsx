import { useEffect, useState } from 'react';
import { TrendingUp, Users, Store, DollarSign, Loader2, AlertCircle, ShoppingCart, Zap, Clock } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../lib/api';

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

export default function Home() {
  const [kpis, setKpis] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [kpiRes, chartRes] = await Promise.all([
          api.get('/super-admin/kpis'),
          api.get('/super-admin/dashboard/charts')
        ]);
        setKpis(kpiRes.data.data);
        setCharts(chartRes.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-matgarco-500" size={40} /></div>;
  if (error) return <div className="flex justify-center items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl"><AlertCircle /> {error}</div>;

  const kpiCards = [
    { title: 'إجمالي المتاجر', value: kpis?.totalMerchants || 0, sub: 'العدد الكلي', icon: Store, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'الإيرادات الشهرية (MRR)', value: `${(kpis?.mrr || 0).toLocaleString()} ج.م`, sub: 'إيرادات الاشتراكات', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'المتاجر النشطة', value: kpis?.activeMerchants || 0, sub: 'متاجر مفعلة', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'مبيعات المنصة (GMV)', value: `${(kpis?.totalGMV || 0).toLocaleString()} ج.م`, sub: 'عبر بوابة الدفع', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const pulse = charts?.dailyPulse || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">لوحة التحكم السريعة</h1>
        <p className="text-slate-500">نظرة عامة على أداء منصة Matgarco اليوم.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between group hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{kpi.title}</p>
              <h3 className="text-2xl font-black text-slate-900">{kpi.value}</h3>
              <div className="mt-2 text-sm font-bold text-emerald-600 flex items-center gap-1">{kpi.sub}</div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Daily Pulse */}
      <div className="bg-gradient-to-l from-matgarco-600 to-matgarco-800 rounded-2xl p-6 text-white shadow-lg shadow-matgarco-600/20">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Zap size={20} /> النبض اليومي (Daily Pulse)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="text-white/70 text-sm font-medium">متاجر جديدة اليوم</div>
            <div className="text-3xl font-black mt-1">{pulse.newMerchants || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="text-white/70 text-sm font-medium">طلبات اليوم</div>
            <div className="text-3xl font-black mt-1">{pulse.todayOrders || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-xl p-4">
            <div className="text-white/70 text-sm font-medium">مبيعات اليوم</div>
            <div className="text-3xl font-black mt-1">{(pulse.todayRevenue || 0).toLocaleString()} ج.م</div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend AreaChart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">نمو الإيرادات (آخر 12 شهر)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={charts?.revenueTrend || []}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip formatter={(value) => `${Number(value ?? 0).toLocaleString()} ج.م`} />
              <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Plan Distribution PieChart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">توزيع الباقات</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={(charts?.planDistribution || []).map((d: any) => ({ ...d, name: PLAN_NAMES[d.plan] || d.plan }))}
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
                dataKey="count" nameKey="name"
                paddingAngle={4}
              >
                {(charts?.planDistribution || []).map((d: any, i: number) => (
                  <Cell key={i} fill={PLAN_COLORS[d.plan] || '#cbd5e1'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Registrations Bar + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">تسجيلات المتاجر (آخر 30 يوم)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={charts?.registrations || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-slate-400"/> آخر النشاطات</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {(charts?.recentActivity || []).map((act: any, i: number) => (
              <div key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.type === 'new_merchant' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {act.type === 'new_merchant' ? <Store size={14} /> : <ShoppingCart size={14} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-900 truncate">{act.message}</div>
                  <div className="text-xs text-slate-500 truncate">{act.detail}</div>
                </div>
              </div>
            ))}
            {(!charts?.recentActivity || charts.recentActivity.length === 0) && (
              <div className="text-sm text-slate-400 text-center py-8">لا توجد نشاطات حتى الآن</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
