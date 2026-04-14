import Notification, { NotificationType } from '../models/Notification';

interface CreateNotificationParams {
  merchantId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

/**
 * Creates a notification for a merchant.
 * Fires-and-forgets — errors are caught and logged without breaking the caller.
 */
export const createNotification = async (params: CreateNotificationParams): Promise<void> => {
  try {
    await Notification.create(params);
  } catch (err) {
    // Notification creation should never break the main flow
    console.error('⚠️  Failed to create notification:', err);
  }
};

/**
 * Convenience builders for each notification type.
 */
export const notifyNewOrder = (merchantId: string, orderNumber: string, orderId: string, total: number) =>
  createNotification({
    merchantId,
    type: 'new_order',
    title: 'طلب جديد',
    message: `طلب جديد رقم #${orderNumber} بقيمة ${total.toFixed(2)} ج.م`,
    link: `/dashboard/orders/${orderId}`,
  });

export const notifyOrderStatusChanged = (
  merchantId: string,
  orderNumber: string,
  orderId: string,
  newStatus: string
) => {
  const statusLabels: Record<string, string> = {
    confirmed: 'تم التأكيد',
    processing: 'قيد التجهيز',
    shipped: 'تم الشحن',
    delivered: 'تم التسليم',
    cancelled: 'ملغي',
  };
  return createNotification({
    merchantId,
    type: 'order_status_changed',
    title: 'تحديث حالة طلب',
    message: `طلب #${orderNumber} — ${statusLabels[newStatus] || newStatus}`,
    link: `/dashboard/orders/${orderId}`,
  });
};

export const notifyOrderCancelled = (merchantId: string, orderNumber: string, orderId: string) =>
  createNotification({
    merchantId,
    type: 'order_cancelled',
    title: 'طلب ملغي',
    message: `تم إلغاء الطلب رقم #${orderNumber}`,
    link: `/dashboard/orders/${orderId}`,
  });

export const notifyLowStock = (merchantId: string, productName: string, productId: string, qty: number) =>
  createNotification({
    merchantId,
    type: 'low_stock',
    title: 'مخزون منخفض',
    message: `${productName} — المخزون المتبقي: ${qty} فقط`,
    link: `/dashboard/products/${productId}`,
  });
