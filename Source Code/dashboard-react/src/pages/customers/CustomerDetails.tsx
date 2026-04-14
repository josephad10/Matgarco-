import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  RefreshCw,
} from 'lucide-react';
import { customerAPI } from '../../lib/api';

const orderStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'مؤكد', color: 'bg-blue-100 text-blue-800' },
  processing: { label: 'قيد التجهيز', color: 'bg-indigo-100 text-indigo-800' },
  shipped: { label: 'تم الشحن', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'تم التسليم', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'مسترجع', color: 'bg-gray-100 text-gray-800' },
};

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: RefreshCw,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  refunded: RefreshCw,
};

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-yellow-100 text-yellow-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const CustomerDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerAPI.getOrders(id!),
    enabled: !!id,
  });

  const customer = data?.data?.data?.customer;
  const orders = data?.data?.data?.orders || [];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">العميل غير موجود</p>
        <button
          onClick={() => navigate('/dashboard/customers')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          العودة للعملاء
        </button>
      </div>
    );
  }

  const initials = `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`.toUpperCase();
  const avatarColor = getAvatarColor(customer.firstName + customer.lastName);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/customers')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            عميل منذ {formatDate(customer.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4 ${avatarColor}`}
            >
              {initials}
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{customer.email}</p>
            {customer.phone && (
              <p className="text-gray-500 text-sm mt-0.5">{customer.phone}</p>
            )}
            {customer.acceptsMarketing && (
              <span className="inline-flex mt-3 items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                يقبل التسويق
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">الإحصائيات</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                  <span>إجمالي الطلبات</span>
                </div>
                <span className="font-bold text-gray-900">
                  {customer.stats?.totalOrders || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span>إجمالي الإنفاق</span>
                </div>
                <span className="font-bold text-green-600">
                  {(customer.stats?.totalSpent || 0).toLocaleString()} جنيه
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span>متوسط الطلب</span>
                </div>
                <span className="font-bold text-gray-900">
                  {(customer.stats?.averageOrderValue || 0).toLocaleString()} جنيه
                </span>
              </div>
              {customer.stats?.lastOrderDate && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <span>آخر طلب</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    {formatDate(customer.stats.lastOrderDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">معلومات التواصل</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <a
                  href={`mailto:${customer.email}`}
                  className="text-blue-600 hover:text-blue-700 text-sm truncate"
                >
                  {customer.email}
                </a>
              </div>
              {customer.phone ? (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a href={`tel:${customer.phone}`} className="text-gray-700 text-sm">
                    {customer.phone}
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">لا يوجد تليفون</span>
                </div>
              )}
            </div>
          </div>

          {/* Addresses */}
          {customer.addresses?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                العناوين ({customer.addresses.length})
              </h3>
              <div className="space-y-4">
                {customer.addresses.map((addr: any, index: number) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border text-sm ${
                      addr.isDefault
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    {addr.isDefault && (
                      <span className="inline-block mb-1.5 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        {addr.label || 'افتراضي'}
                      </span>
                    )}
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        {addr.street && <p>{addr.street}</p>}
                        <p>
                          {[addr.city, addr.state, addr.country]
                            .filter(Boolean)
                            .join('، ')}
                        </p>
                        {addr.postalCode && (
                          <p className="text-gray-500">كود: {addr.postalCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Orders History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                سجل الطلبات ({orders.length})
              </h3>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">لا يوجد طلبات بعد</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map((order: any) => {
                  const statusInfo = orderStatusMap[order.orderStatus] || {
                    label: order.orderStatus,
                    color: 'bg-gray-100 text-gray-800',
                  };
                  const StatusIcon = statusIcons[order.orderStatus] || Clock;

                  return (
                    <div key={order._id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Link
                              to={`/dashboard/orders/${order._id}`}
                              className="font-semibold text-blue-600 hover:text-blue-700"
                            >
                              #{order.orderNumber}
                            </Link>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.label}
                            </span>
                          </div>

                          {/* Items Summary */}
                          <div className="flex items-center gap-2 mb-2">
                            <ShoppingBag className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {order.items?.length || 0} منتج
                              {order.items?.length > 0 && (
                                <span className="text-gray-400">
                                  {' '}— {order.items.slice(0, 2).map((i: any) => i.productName).join(', ')}
                                  {order.items.length > 2 && ` +${order.items.length - 2}`}
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDateTime(order.createdAt)}</span>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="text-left flex-shrink-0">
                          <p className="text-lg font-bold text-gray-900">
                            {(order.total || 0).toLocaleString()} جنيه
                          </p>
                          <Link
                            to={`/dashboard/orders/${order._id}`}
                            className="text-xs text-blue-600 hover:text-blue-700 mt-1 inline-block"
                          >
                            عرض الطلب ←
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
