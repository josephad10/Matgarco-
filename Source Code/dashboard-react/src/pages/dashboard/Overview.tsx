import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { merchantAPI, orderAPI } from '../../lib/api';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  ArrowLeft,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ORDER_STATUS_AR: Record<string, string> = {
  pending: 'معلق',
  confirmed: 'مؤكد',
  processing: 'جاري التجهيز',
  shipped: 'تم الشحن',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
  refunded: 'مُسترد',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
};

export default function Overview() {
  const user = useAuthStore((state) => state.user);

  const { data: merchantData } = useQuery({
    queryKey: ['merchant', user?.merchantId],
    queryFn: () => merchantAPI.getById(user!.merchantId!),
    enabled: !!user?.merchantId,
  });
  const merchant = merchantData?.data?.data?.merchant;

  // Fetch last 20 orders for charts
  const { data: ordersData } = useQuery({
    queryKey: ['orders', { limit: 20, sort: '-createdAt' }],
    queryFn: () => orderAPI.getAll({ limit: 20, sort: '-createdAt' }),
  });
  const orders: any[] = ordersData?.data?.data?.orders || [];

  // Build chart data: last 7 days revenue
  const revenueChartData = useMemo(() => {
    const days: Record<string, { day: string; إيراد: number; طلبات: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('ar-EG', { weekday: 'short' });
      days[key] = { day: label, إيراد: 0, طلبات: 0 };
    }
    orders.forEach((o) => {
      const key = new Date(o.createdAt).toISOString().slice(0, 10);
      if (days[key] && o.orderStatus !== 'cancelled' && o.orderStatus !== 'refunded') {
        days[key].إيراد += o.total || 0;
        days[key].طلبات += 1;
      }
    });
    return Object.values(days);
  }, [orders]);

  // Order status distribution for bar chart
  const statusChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      counts[o.orderStatus] = (counts[o.orderStatus] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      الحالة: ORDER_STATUS_AR[status] || status,
      عدد: count,
    }));
  }, [orders]);

  const stats = [
    {
      name: 'إجمالي الطلبات',
      value: merchant?.stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      name: 'إجمالي الإيرادات',
      value: `${(merchant?.stats?.totalRevenue || 0).toLocaleString('ar-EG')} ج`,
      icon: DollarSign,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      name: 'المنتجات',
      value: merchant?.stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      name: 'العملاء',
      value: merchant?.stats?.totalCustomers || 0,
      icon: Users,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-7 text-white">
        <h1 className="text-3xl font-bold mb-1">مرحباً، {user?.firstName} 👋</h1>
        <p className="text-blue-100 text-sm">
          متجرك <span className="font-semibold text-white">{merchant?.storeName}</span>
          {' · '}
          <span className="opacity-80">{merchant?.subdomain}.matgarco.com</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.lightColor} p-2.5 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart — 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">الإيرادات (آخر 7 أيام)</h2>
            <span className="text-xs text-gray-400">بالجنيه</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(v: any) => [`${v.toLocaleString('ar-EG')} ج`, 'إيراد']}
              />
              <Area
                type="monotone"
                dataKey="إيراد"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                dot={{ r: 3, fill: '#3b82f6' }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Status Bar Chart — 1/3 width */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-5">الطلبات حسب الحالة</h2>
          {statusChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={statusChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="الحالة" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: 12 }}
                />
                <Bar dataKey="عدد" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">
              لا توجد بيانات
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders — 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">أحدث الطلبات</h2>
            <Link
              to="/dashboard/orders"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              عرض الكل
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length > 0 ? (
              recentOrders.map((order: any) => (
                <Link
                  key={order._id}
                  to={`/dashboard/orders/${order._id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">
                      {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">
                      {order.total?.toLocaleString('ar-EG')} ج
                    </p>
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${STATUS_COLORS[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}>
                      {ORDER_STATUS_AR[order.orderStatus] || order.orderStatus}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">لا توجد طلبات بعد</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions — 1/3 */}
        <div className="space-y-3">
          <h2 className="font-bold text-gray-900 px-1">إجراءات سريعة</h2>
          <Link
            to="/dashboard/products/new"
            className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-sm transition"
          >
            <div className="p-2.5 bg-blue-50 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">إضافة منتج</p>
              <p className="text-xs text-gray-500">أضف منتجاً جديداً للمتجر</p>
            </div>
            <ArrowLeft className="h-4 w-4 text-gray-400 mr-auto" />
          </Link>

          <Link
            to="/dashboard/orders"
            className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200 hover:border-green-300 hover:shadow-sm transition"
          >
            <div className="p-2.5 bg-green-50 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">الطلبات</p>
              <p className="text-xs text-gray-500">إدارة طلبات العملاء</p>
            </div>
            <ArrowLeft className="h-4 w-4 text-gray-400 mr-auto" />
          </Link>

          <Link
            to="/dashboard/customers"
            className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 hover:shadow-sm transition"
          >
            <div className="p-2.5 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">العملاء</p>
              <p className="text-xs text-gray-500">تصفح قاعدة عملائك</p>
            </div>
            <ArrowLeft className="h-4 w-4 text-gray-400 mr-auto" />
          </Link>

          <Link
            to="/dashboard/settings"
            className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-200 hover:border-orange-300 hover:shadow-sm transition"
          >
            <div className="p-2.5 bg-orange-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">الإعدادات</p>
              <p className="text-xs text-gray-500">إعدادات المتجر والاشتراك</p>
            </div>
            <ArrowLeft className="h-4 w-4 text-gray-400 mr-auto" />
          </Link>
        </div>
      </div>
    </div>
  );
}
