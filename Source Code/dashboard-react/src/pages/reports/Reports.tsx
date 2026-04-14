import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  Calendar,
  Award,
  MapPin,
  CreditCard,
  Loader2,
  Download,
} from 'lucide-react';
import { orderAPI, customerAPI, productAPI } from '../../lib/api';

// ─── Constants ────────────────────────────────────────────────────────────────

const RANGE_OPTIONS = [
  { label: '7 أيام', days: 7 },
  { label: '30 يوم', days: 30 },
  { label: '90 يوم', days: 90 },
  { label: '12 شهر', days: 365 },
];

const ORDER_STATUS_AR: Record<string, string> = {
  pending: 'معلق',
  confirmed: 'مؤكد',
  processing: 'جاري التجهيز',
  shipped: 'تم الشحن',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
  refunded: 'مُسترد',
};

const PAYMENT_METHOD_AR: Record<string, string> = {
  cash: 'كاش',
  card: 'بطاقة',
  paymob: 'Paymob',
  wallet: 'محفظة',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#6366f1',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444',
  refunded: '#6b7280',
};

const PAYMENT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString('ar-EG');

const groupByDay = (orders: any[], days: number) => {
  const map: Record<string, { label: string; إيراد: number; طلبات: number }> = {};
  const useMonths = days >= 365;
  const step = useMonths ? 'month' : 'day';

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    if (step === 'day') {
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = days <= 30
        ? d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })
        : d.toLocaleDateString('ar-EG', { weekday: 'short' });
      map[key] = { label, إيراد: 0, طلبات: 0 };
    }
  }

  // For 12 months: group by month
  if (useMonths) {
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0, 7); // YYYY-MM
      const label = d.toLocaleDateString('ar-EG', { month: 'short', year: '2-digit' });
      map[key] = { label, إيراد: 0, طلبات: 0 };
    }
  }

  orders.forEach((o) => {
    if (o.orderStatus === 'cancelled' || o.orderStatus === 'refunded') return;
    const d = new Date(o.createdAt);
    const key = useMonths ? d.toISOString().slice(0, 7) : d.toISOString().slice(0, 10);
    if (map[key]) {
      map[key].إيراد += o.total || 0;
      map[key].طلبات += 1;
    }
  });

  return Object.values(map).map((v) => ({ ...v, إيراد: Math.round(v.إيراد) }));
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const KpiCard = ({
  label,
  value,
  sub,
  icon: Icon,
  color,
  bgColor,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <div className="flex items-center justify-between mb-3">
      <div className={`${bgColor} p-2.5 rounded-lg`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{sub}</p>}
  </div>
);

// Custom label for PieChart
const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const Reports: React.FC = () => {
  const [rangeDays, setRangeDays] = useState(30);

  // Fetch a large batch of orders for aggregation
  const { data: ordersRes, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders-report', 500],
    queryFn: () => orderAPI.getAll({ limit: 500 }),
  });

  const { data: customersRes } = useQuery({
    queryKey: ['customers-report'],
    queryFn: () => customerAPI.getAll({ limit: 1 }),
  });

  const { data: productsRes } = useQuery({
    queryKey: ['products-report'],
    queryFn: () => productAPI.getAll({ limit: 1 }),
  });

  const allOrders: any[] = ordersRes?.data?.data?.orders || [];
  const totalCustomersCount: number = customersRes?.data?.data?.pagination?.total || 0;
  const totalProductsCount: number = productsRes?.data?.data?.pagination?.total || 0;

  // Filter orders to selected range
  const cutoff = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - rangeDays);
    return d;
  }, [rangeDays]);

  const rangeOrders = useMemo(
    () => allOrders.filter((o) => new Date(o.createdAt) >= cutoff),
    [allOrders, cutoff]
  );

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const { totalRevenue, totalOrders, avgOrderValue, deliveredCount, cancelledCount } = useMemo(() => {
    let rev = 0, total = 0, delivered = 0, cancelled = 0;
    rangeOrders.forEach((o) => {
      total++;
      if (o.orderStatus === 'delivered') { delivered++; rev += o.total || 0; }
      if (o.orderStatus === 'cancelled') cancelled++;
    });
    return {
      totalRevenue: rev,
      totalOrders: total,
      avgOrderValue: delivered > 0 ? rev / delivered : 0,
      deliveredCount: delivered,
      cancelledCount: cancelled,
    };
  }, [rangeOrders]);

  // ── Revenue over time ─────────────────────────────────────────────────────
  const revenueData = useMemo(() => groupByDay(rangeOrders, rangeDays), [rangeOrders, rangeDays]);

  // ── Orders by status ──────────────────────────────────────────────────────
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    rangeOrders.forEach((o) => {
      counts[o.orderStatus] = (counts[o.orderStatus] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([k, v]) => ({ name: ORDER_STATUS_AR[k] || k, value: v, key: k }))
      .sort((a, b) => b.value - a.value);
  }, [rangeOrders]);

  // ── Payment methods ───────────────────────────────────────────────────────
  const paymentData = useMemo(() => {
    const counts: Record<string, number> = {};
    rangeOrders.forEach((o) => {
      const pm = o.paymentMethod || 'cash';
      counts[pm] = (counts[pm] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([k, v]) => ({ name: PAYMENT_METHOD_AR[k] || k, value: v }))
      .sort((a, b) => b.value - a.value);
  }, [rangeOrders]);

  // ── Top cities ────────────────────────────────────────────────────────────
  const cityData = useMemo(() => {
    const counts: Record<string, number> = {};
    rangeOrders.forEach((o) => {
      const city = o.shippingAddress?.city;
      if (city) counts[city] = (counts[city] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([k, v]) => ({ المدينة: k, طلبات: v }))
      .sort((a, b) => b.طلبات - a.طلبات)
      .slice(0, 8);
  }, [rangeOrders]);

  // ── Top products ──────────────────────────────────────────────────────────
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number; image?: string }> = {};
    rangeOrders.forEach((o) => {
      if (o.orderStatus === 'cancelled' || o.orderStatus === 'refunded') return;
      (o.items || []).forEach((item: any) => {
        const key = item.productId || item.productName;
        if (!map[key]) map[key] = { name: item.productName, qty: 0, revenue: 0, image: item.productImage };
        map[key].qty += item.quantity || 1;
        map[key].revenue += item.subtotal || 0;
      });
    });
    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [rangeOrders]);

  const isLoading = ordersLoading;

  // ── Export all report data as multi-section CSV ───────────────────────────
  const exportReport = () => {
    const escape = (v: unknown) => {
      const s = String(v ?? '').replace(/"/g, '""');
      return /[",\n\r]/.test(s) ? `"${s}"` : s;
    };
    const row = (...cols: unknown[]) => cols.map(escape).join(',');

    const rangeLabel = RANGE_OPTIONS.find(r => r.days === rangeDays)?.label || '';
    const date = new Date().toLocaleDateString('ar-EG');

    const lines: string[] = [
      // ── KPI Summary
      row('تقرير المتجر', `آخر ${rangeLabel}`, `بتاريخ ${date}`),
      '',
      row('=== ملخص KPIs ==='),
      row('إجمالي الإيرادات', 'إجمالي الطلبات', 'تم توصيلها', 'متوسط قيمة الطلب', 'طلبات ملغاة'),
      row(Math.round(totalRevenue), totalOrders, deliveredCount, Math.round(avgOrderValue), cancelledCount),
      '',
      // ── Revenue Over Time
      row('=== الإيرادات عبر الزمن ==='),
      row('التاريخ', 'الإيراد', 'الطلبات'),
      ...revenueData.map((d: any) => row(d.تاريخ, d.إيراد, d.طلبات)),
      '',
      // ── Order Status
      row('=== توزيع حالة الطلبات ==='),
      row('الحالة', 'العدد'),
      ...statusData.map((d: any) => row(d.name, d.value)),
      '',
      // ── Payment Methods
      row('=== طرق الدفع ==='),
      row('الطريقة', 'العدد'),
      ...paymentData.map((d: any) => row(d.name, d.value)),
      '',
      // ── Top Cities
      row('=== أكثر المدن ==='),
      row('المدينة', 'طلبات'),
      ...cityData.map((d: any) => row(d['المدينة'], d['طلبات'])),
      '',
      // ── Top Products
      row('=== أكثر المنتجات مبيعاً ==='),
      row('المنتج', 'الكمية', 'الإيراد'),
      ...topProducts.map((p: any) => row(p.name, p.qty, p.revenue)),
    ];

    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `تقرير-${rangeLabel}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقارير والإحصائيات</h1>
          <p className="text-gray-500 text-sm mt-1">تحليل أداء متجرك</p>
        </div>
        {/* Range Selector + Export */}
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => setRangeDays(opt.days)}
                className={`px-4 py-2 text-sm font-medium transition ${
                  rangeDays === opt.days
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تصدير</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="إجمالي الإيرادات"
          value={`${fmt(Math.round(totalRevenue))} ج`}
          icon={DollarSign}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <KpiCard
          label="إجمالي الطلبات"
          value={totalOrders}
          sub={`${deliveredCount} تم توصيلها`}
          icon={ShoppingCart}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <KpiCard
          label="متوسط قيمة الطلب"
          value={`${fmt(Math.round(avgOrderValue))} ج`}
          icon={TrendingUp}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
        <KpiCard
          label="معدل الإلغاء"
          value={totalOrders > 0 ? `${((cancelledCount / totalOrders) * 100).toFixed(1)}%` : '0%'}
          sub={`${cancelledCount} طلب ملغي`}
          icon={Calendar}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Store summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">إجمالي العملاء</p>
              <p className="text-3xl font-bold mt-1">{fmt(totalCustomersCount)}</p>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">إجمالي المنتجات</p>
              <p className="text-3xl font-bold mt-1">{fmt(totalProductsCount)}</p>
            </div>
            <Package className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-900 mb-5">
          الإيرادات والطلبات عبر الزمن
          <span className="text-gray-400 font-normal text-sm mr-2">
            (آخر {RANGE_OPTIONS.find(r => r.days === rangeDays)?.label})
          </span>
        </h2>
        {revenueData.some(d => d.إيراد > 0 || d.طلبات > 0) ? (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                interval={rangeDays <= 7 ? 0 : 'preserveStartEnd'}
              />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(v: any, name: string) =>
                  name === 'إيراد' ? [`${fmt(v)} ج`, 'إيراد'] : [v, 'طلبات']
                }
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="إيراد"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#gRevenue)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart />
        )}
      </div>

      {/* Middle Row: Status Pie + Payment Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-4">الطلبات حسب الحالة</h2>
          {statusData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={STATUS_COLORS[entry.key] || '#6b7280'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any, name: string) => [v, name]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {statusData.map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: STATUS_COLORS[item.key] || '#6b7280' }}
                      />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyChart />
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-4">طرق الدفع</h2>
          {paymentData.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={paymentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={renderCustomLabel}
                  >
                    {paymentData.map((_, i) => (
                      <Cell key={i} fill={PAYMENT_COLORS[i % PAYMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {paymentData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: PAYMENT_COLORS[i % PAYMENT_COLORS.length] }}
                      />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyChart />
          )}
        </div>
      </div>

      {/* Top Cities */}
      {cityData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            أكثر المدن طلباً
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              layout="vertical"
              data={cityData}
              margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="المدينة"
                width={80}
                tick={{ fontSize: 12, fill: '#374151' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
              />
              <Bar dataKey="طلبات" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                {cityData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-500" />
          <h2 className="font-bold text-gray-900">أفضل المنتجات مبيعاً</h2>
          <span className="text-xs text-gray-400 mr-1">
            (آخر {RANGE_OPTIONS.find(r => r.days === rangeDays)?.label})
          </span>
        </div>
        {topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-right">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">المنتج</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">الكمية</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-left">الإيراد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topProducts.map((p, i) => (
                  <tr key={p.name} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                        i === 1 ? 'bg-gray-100 text-gray-600' :
                        i === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-white text-gray-400 border border-gray-200'
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
                        {p.qty}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-left">
                      <span className="text-sm font-bold text-gray-900">{fmt(Math.round(p.revenue))} ج</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">لا توجد بيانات مبيعات</p>
          </div>
        )}
      </div>

      {/* Payment method + City credit card detail */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-500" />
          ملخص المدفوعات
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['cash', 'card', 'paymob', 'wallet'].map((pm, i) => {
            const count = rangeOrders.filter(o => (o.paymentMethod || 'cash') === pm).length;
            const rev = rangeOrders
              .filter(o => (o.paymentMethod || 'cash') === pm && o.orderStatus !== 'cancelled' && o.orderStatus !== 'refunded')
              .reduce((s, o) => s + (o.total || 0), 0);
            return (
              <div key={pm} className="bg-gray-50 rounded-xl p-4 text-center">
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: PAYMENT_COLORS[i] + '20', color: PAYMENT_COLORS[i] }}
                >
                  <CreditCard className="w-4 h-4" />
                </div>
                <p className="font-semibold text-gray-900">{count} طلب</p>
                <p className="text-xs text-gray-500 mt-0.5">{PAYMENT_METHOD_AR[pm]}</p>
                <p className="text-xs font-medium mt-1" style={{ color: PAYMENT_COLORS[i] }}>
                  {fmt(Math.round(rev))} ج
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const EmptyChart = () => (
  <div className="flex items-center justify-center h-[200px] text-gray-300 text-sm flex-col gap-2">
    <TrendingUp className="w-8 h-8" />
    <span className="text-gray-400">لا توجد بيانات للفترة المحددة</span>
  </div>
);
