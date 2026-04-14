import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowRight,
  Loader2,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Truck,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Printer,
  AlertCircle,
} from 'lucide-react';
import { orderAPI } from '../../lib/api';

const orderStatusMap: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'قيد الانتظار', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
  confirmed: { label: 'مؤكد', color: 'text-blue-800', bgColor: 'bg-blue-100' },
  processing: { label: 'قيد التجهيز', color: 'text-indigo-800', bgColor: 'bg-indigo-100' },
  shipped: { label: 'تم الشحن', color: 'text-purple-800', bgColor: 'bg-purple-100' },
  delivered: { label: 'تم التسليم', color: 'text-green-800', bgColor: 'bg-green-100' },
  cancelled: { label: 'ملغي', color: 'text-red-800', bgColor: 'bg-red-100' },
  refunded: { label: 'مسترجع', color: 'text-gray-800', bgColor: 'bg-gray-100' },
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

const statusFlow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const timelineIcons: Record<string, React.ElementType> = {
  'Order Created': FileText,
  pending: Clock,
  confirmed: CheckCircle,
  processing: RefreshCw,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  'Payment paid': CreditCard,
  'Payment pending': Clock,
  'Payment failed': XCircle,
  'Payment refunded': RefreshCw,
};

export const OrderDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingProvider, setShippingProvider] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Fetch order data
  const { data: orderResponse, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderAPI.getById(id!),
    enabled: !!id,
  });

  const order = orderResponse?.data?.data?.order;

  // Status mutation
  const statusMutation = useMutation({
    mutationFn: ({ status, note }: { status: string; note?: string }) =>
      orderAPI.updateStatus(id!, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowStatusModal(false);
      setStatusNote('');
      toast.success('تم تحديث حالة الطلب بنجاح');
    },
    onError: () => toast.error('فشل تحديث حالة الطلب'),
  });

  // Payment mutation
  const paymentMutation = useMutation({
    mutationFn: ({ paymentStatus, transactionId }: { paymentStatus: string; transactionId?: string }) =>
      orderAPI.updatePayment(id!, paymentStatus, transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('تم تحديث حالة الدفع بنجاح');
    },
    onError: () => toast.error('فشل تحديث حالة الدفع'),
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: (reason?: string) => orderAPI.cancel(id!, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowCancelModal(false);
      setCancelReason('');
      toast.success('تم إلغاء الطلب');
    },
    onError: () => toast.error('فشل إلغاء الطلب'),
  });

  // Tracking mutation
  const trackingMutation = useMutation({
    mutationFn: () => orderAPI.updateTracking(id!, trackingNumber, shippingProvider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      setShowTrackingModal(false);
      setTrackingNumber('');
      setShippingProvider('');
      toast.success('تم حفظ بيانات الشحن بنجاح');
    },
    onError: () => toast.error('فشل حفظ بيانات الشحن'),
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">الطلب غير موجود</p>
        <button
          onClick={() => navigate('/dashboard/orders')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          العودة للطلبات
        </button>
      </div>
    );
  }

  const currentStatusIndex = statusFlow.indexOf(order.orderStatus);
  const canCancel = !['delivered', 'cancelled', 'refunded'].includes(order.orderStatus);
  const nextStatus = currentStatusIndex >= 0 && currentStatusIndex < statusFlow.length - 1
    ? statusFlow[currentStatusIndex + 1]
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/orders')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              طلب #{order.orderNumber}
            </h1>
            <p className="text-gray-600 mt-1">
              تم الإنشاء: {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة</span>
          </button>

          {nextStatus && (
            <button
              onClick={() => {
                setSelectedStatus(nextStatus);
                setShowStatusModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {orderStatusMap[nextStatus]?.label || nextStatus}
              </span>
            </button>
          )}

          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <XCircle className="w-4 h-4" />
              <span>إلغاء</span>
            </button>
          )}
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block text-center border-b-2 pb-4">
        <h1 className="text-2xl font-bold">فاتورة طلب #{order.orderNumber}</h1>
        <p className="text-gray-600">{formatDate(order.createdAt)}</p>
      </div>

      {/* Status Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:shadow-none print:border-none">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">حالة الطلب</h2>
          <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${orderStatusMap[order.orderStatus]?.bgColor} ${orderStatusMap[order.orderStatus]?.color}`}>
            {orderStatusMap[order.orderStatus]?.label || order.orderStatus}
          </span>
        </div>

        {/* Progress Steps */}
        {order.orderStatus !== 'cancelled' && order.orderStatus !== 'refunded' && (
          <div className="flex items-center justify-between mt-6">
            {statusFlow.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const info = orderStatusMap[status];

              return (
                <React.Fragment key={status}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted && index < currentStatusIndex ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${
                      isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {info?.label}
                    </span>
                  </div>
                  {index < statusFlow.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      index < currentStatusIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {order.orderStatus === 'cancelled' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">تم إلغاء هذا الطلب</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border print:border-gray-300">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                المنتجات ({order.items?.length || 0})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="px-6 py-4 flex items-center gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {item.productImage ? (
                      <img
                        src={typeof item.productImage === 'string' ? item.productImage : item.productImage?.url}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.productName}
                    </h3>
                    {item.variantName && (
                      <p className="text-sm text-gray-500">{item.variantName}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {item.price} جنيه × {item.quantity}
                    </p>
                  </div>

                  {/* Item Total */}
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">
                      {item.subtotal?.toLocaleString()} جنيه
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>المجموع الفرعي</span>
                <span>{order.subtotal?.toLocaleString()} جنيه</span>
              </div>
              {order.shippingCost > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>الشحن</span>
                  <span>{order.shippingCost?.toLocaleString()} جنيه</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>الضريبة</span>
                  <span>{order.tax?.toLocaleString()} جنيه</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>الخصم</span>
                  <span>-{order.discount?.toLocaleString()} جنيه</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
                <span>الإجمالي</span>
                <span>{order.total?.toLocaleString()} جنيه</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:shadow-none">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">سجل الأحداث</h2>
            <div className="space-y-4">
              {order.timeline?.slice().reverse().map((event: any, index: number) => {
                const TimelineIcon = timelineIcons[event.status] || Clock;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <TimelineIcon className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {orderStatusMap[event.status]?.label || event.status}
                      </p>
                      {event.note && (
                        <p className="text-sm text-gray-600 mt-0.5">{event.note}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(event.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar - Right col */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:shadow-none">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">معلومات العميل</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <a href={`mailto:${order.customerInfo?.email}`} className="text-blue-600 hover:text-blue-700">
                  {order.customerInfo?.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <a href={`tel:${order.customerInfo?.phone}`} className="text-gray-700">
                  {order.customerInfo?.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:shadow-none">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">عنوان الشحن</h2>
            {order.shippingAddress ? (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="text-gray-700 text-sm space-y-1">
                  <p className="font-medium">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}</p>
                  <p>{order.shippingAddress.country || 'مصر'}</p>
                  {order.shippingAddress.phone && (
                    <p className="text-gray-500">{order.shippingAddress.phone}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">لا يوجد عنوان شحن</p>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:shadow-none">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">معلومات الدفع</h2>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${paymentStatusMap[order.paymentStatus]?.color}`}>
                {paymentStatusMap[order.paymentStatus]?.label || order.paymentStatus}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  {paymentMethodMap[order.paymentMethod] || order.paymentMethod}
                </span>
              </div>
              {order.paymentTransactionId && (
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700 font-mono text-xs">
                    {order.paymentTransactionId}
                  </span>
                </div>
              )}

              {order.paymentStatus === 'pending' && (
                <button
                  onClick={() => paymentMutation.mutate({ paymentStatus: 'paid' })}
                  disabled={paymentMutation.isPending}
                  className="w-full mt-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {paymentMutation.isPending ? 'جاري التحديث...' : 'تأكيد الدفع'}
                </button>
              )}
            </div>
          </div>

          {/* Shipping & Tracking */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:shadow-none">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">الشحن والتتبع</h2>
            {order.trackingNumber ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{order.shippingProvider}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">رقم التتبع</p>
                  <p className="font-mono font-medium text-gray-900">{order.trackingNumber}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 text-sm mb-3">لم يتم إضافة معلومات الشحن بعد</p>
                {['confirmed', 'processing'].includes(order.orderStatus) && (
                  <button
                    onClick={() => setShowTrackingModal(true)}
                    className="w-full px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    إضافة رقم التتبع
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          {(order.customerNotes || order.merchantNotes) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:shadow-none">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">ملاحظات</h2>
              {order.customerNotes && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">ملاحظات العميل</p>
                  <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
                    {order.customerNotes}
                  </p>
                </div>
              )}
              {order.merchantNotes && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">ملاحظاتك</p>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                    {order.merchantNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Commission Info */}
          {order.platformCommission?.amount > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:hidden">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">عمولة المنصة</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">نسبة العمولة</span>
                  <span className="font-medium">{order.platformCommission.percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">مبلغ العمولة</span>
                  <span className="font-medium text-red-600">
                    {order.platformCommission.amount?.toLocaleString()} جنيه
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">صافي الربح</span>
                  <span className="font-bold text-green-600">
                    {(order.total - order.platformCommission.amount)?.toLocaleString()} جنيه
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:hidden">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              تحديث حالة الطلب إلى: {orderStatusMap[selectedStatus]?.label}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ملاحظة (اختياري)
              </label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="أضف ملاحظة..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => statusMutation.mutate({ status: selectedStatus, note: statusNote || undefined })}
                disabled={statusMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {statusMutation.isPending ? 'جاري التحديث...' : 'تأكيد'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:hidden">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إضافة معلومات الشحن</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شركة الشحن
                </label>
                <select
                  value={shippingProvider}
                  onChange={(e) => setShippingProvider(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر شركة الشحن</option>
                  <option value="aramex">Aramex</option>
                  <option value="dhl">DHL</option>
                  <option value="fedex">FedEx</option>
                  <option value="bosta">Bosta</option>
                  <option value="mylerz">Mylerz</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم التتبع
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل رقم التتبع"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowTrackingModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={() => trackingMutation.mutate()}
                disabled={!trackingNumber || !shippingProvider || trackingMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {trackingMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:hidden">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">إلغاء الطلب</h3>
            </div>
            <p className="text-gray-600 mb-4">
              هل أنت متأكد من إلغاء هذا الطلب؟ سيتم إرجاع المخزون تلقائياً.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                سبب الإلغاء (اختياري)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="حدد سبب الإلغاء..."
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                تراجع
              </button>
              <button
                onClick={() => cancelMutation.mutate(cancelReason || undefined)}
                disabled={cancelMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'جاري الإلغاء...' : 'تأكيد الإلغاء'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
