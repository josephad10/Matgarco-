import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Search,
  Eye,
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  RefreshCw,
  Loader2,
  Download,
  CheckSquare,
  Square,
  X as XIcon,
} from 'lucide-react';
import { orderAPI } from '../../lib/api';
import { downloadCSV } from '../../lib/exportCSV';

type OrderStatusFilter = 'all' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatusFilter = 'all' | 'pending' | 'paid' | 'failed' | 'refunded';

const orderStatusMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'مؤكد', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  processing: { label: 'قيد التجهيز', color: 'bg-indigo-100 text-indigo-800', icon: RefreshCw },
  shipped: { label: 'تم الشحن', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'تم التسليم', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800', icon: XCircle },
  refunded: { label: 'مسترجع', color: 'bg-gray-100 text-gray-800', icon: RefreshCw },
};

const paymentStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'لم يتم الدفع', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'تم الدفع', color: 'bg-green-100 text-green-800' },
  failed: { label: 'فشل الدفع', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'تم الاسترجاع', color: 'bg-gray-100 text-gray-800' },
};

const paymentMethodMap: Record<string, string> = {
  cash: 'نقداً عند الاستلام',
  card: 'بطاقة ائتمان',
  paymob: 'Paymob',
  wallet: 'محفظة إلكترونية',
};

export const OrdersList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // Fetch orders
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', currentPage, searchQuery, statusFilter, paymentFilter],
    queryFn: () =>
      orderAPI.getAll({
        page: currentPage,
        limit: 15,
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        paymentStatus: paymentFilter !== 'all' ? paymentFilter : undefined,
      }),
  });

  const orders = data?.data?.data?.orders || [];
  const pagination = data?.data?.data?.pagination || {
    page: 1,
    pages: 1,
    total: 0,
  };

  // Quick status update
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('تم تحديث حالة الطلب');
    },
    onError: () => toast.error('فشل تحديث الحالة'),
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) =>
      Promise.all(ids.map((id) => orderAPI.updateStatus(id, status))),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      const label = orderStatusMap[vars.status]?.label || vars.status;
      toast.success(`تم تحديث ${vars.ids.length} طلب إلى “${label}”`);
      setSelectedIds(new Set());
    },
    onError: () => toast.error('فشل تحديث الحالة'),
  });

  const handleSelectAll = () => {
    if (selectedIds.size === orders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o: any) => o._id)));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const exportOrders = () => {
    const rows = orders.map((o: any) => ({
      رقم_الطلب: o.orderNumber,
      العميل: `${o.customerInfo?.firstName || ''} ${o.customerInfo?.lastName || ''}`.trim(),
      البريد: o.customerInfo?.email || '',
      المبلغ: o.total,
      حالة_الطلب: orderStatusMap[o.orderStatus]?.label || o.orderStatus,
      حالة_الدفع: paymentStatusMap[o.paymentStatus]?.label || o.paymentStatus,
      طريقة_الدفع: paymentMethodMap[o.paymentMethod] || o.paymentMethod,
      عدد_المنتجات: o.items?.length || 0,
      التاريخ: o.createdAt ? new Date(o.createdAt).toLocaleDateString('ar-EG') : '',
    }));
    downloadCSV(`طلبات-${new Date().toISOString().slice(0, 10)}`, rows);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-gray-600 mt-1">
            {pagination.total} طلب إجمالي
          </p>
        </div>
        <button
          onClick={exportOrders}
          disabled={orders.length === 0}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          <span>تصدير CSV</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="بحث برقم الطلب أو البريد..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as OrderStatusFilter);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">كل الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="confirmed">مؤكد</option>
            <option value="processing">قيد التجهيز</option>
            <option value="shipped">تم الشحن</option>
            <option value="delivered">تم التسليم</option>
            <option value="cancelled">ملغي</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value as PaymentStatusFilter);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">كل حالات الدفع</option>
            <option value="pending">لم يتم الدفع</option>
            <option value="paid">تم الدفع</option>
            <option value="failed">فشل الدفع</option>
            <option value="refunded">مسترجع</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-blue-700">
            {selectedIds.size} طلب محدد
          </span>
          <div className="flex items-center gap-2 mr-auto">
            <button
              onClick={() => bulkStatusMutation.mutate({ ids: [...selectedIds], status: 'confirmed' })}
              disabled={bulkStatusMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              تأكيد
            </button>
            <button
              onClick={() => bulkStatusMutation.mutate({ ids: [...selectedIds], status: 'processing' })}
              disabled={bulkStatusMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              تجهيز
            </button>
            <button
              onClick={() => bulkStatusMutation.mutate({ ids: [...selectedIds], status: 'cancelled' })}
              disabled={bulkStatusMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              إلغاء
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700">حدث خطأ في تحميل الطلبات</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            لا توجد طلبات
          </h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== 'all'
              ? 'لم يتم العثور على طلبات مطابقة لبحثك'
              : 'لم يتم استقبال أي طلبات بعد'}
          </p>
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && !error && orders.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <button onClick={handleSelectAll}>
                      {selectedIds.size === orders.length && orders.length > 0 ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    رقم الطلب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    العميل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المنتجات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    حالة الطلب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الدفع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order: any) => {
                  const statusInfo = orderStatusMap[order.orderStatus] || orderStatusMap.pending;
                  const paymentInfo = paymentStatusMap[order.paymentStatus] || paymentStatusMap.pending;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr
                      key={order._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedIds.has(order._id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-4 py-4">
                        <button onClick={() => toggleSelect(order._id)}>
                          {selectedIds.has(order._id) ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                      {/* Order Number */}
                      <td className="px-6 py-4">
                        <Link
                          to={`/dashboard/orders/${order._id}`}
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {order.customerInfo?.email}
                          </p>
                        </div>
                      </td>

                      {/* Items Count */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">
                            {order.items?.length || 0} منتج
                          </span>
                          {order.items?.length > 0 && (
                            <span className="text-xs text-gray-500">
                              ({order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} قطعة)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {order.total?.toLocaleString()} جنيه
                        </span>
                      </td>

                      {/* Order Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="px-6 py-4">
                        <div>
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${paymentInfo.color}`}>
                            {paymentInfo.label}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {paymentMethodMap[order.paymentMethod] || order.paymentMethod}
                          </p>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/dashboard/orders/${order._id}`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>

                          {/* Quick status update */}
                          {order.orderStatus === 'pending' && (
                            <button
                              onClick={() => statusMutation.mutate({ id: order._id, status: 'confirmed' })}
                              disabled={statusMutation.isPending}
                              className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                              title="تأكيد الطلب"
                            >
                              تأكيد
                            </button>
                          )}
                          {order.orderStatus === 'confirmed' && (
                            <button
                              onClick={() => statusMutation.mutate({ id: order._id, status: 'processing' })}
                              disabled={statusMutation.isPending}
                              className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                              title="بدء التجهيز"
                            >
                              تجهيز
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                عرض {(pagination.page - 1) * 15 + 1} - {Math.min(pagination.page * 15, pagination.total)} من {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-700">
                  {currentPage} / {pagination.pages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.pages))}
                  disabled={currentPage === pagination.pages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
