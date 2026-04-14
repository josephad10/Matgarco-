import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType =
  | 'new_order'
  | 'order_status_changed'
  | 'order_cancelled'
  | 'low_stock'
  | 'new_customer';

export interface INotification extends Document {
  merchantId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;       // e.g. /dashboard/orders/123
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['new_order', 'order_status_changed', 'order_cancelled', 'low_stock', 'new_customer'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Auto-delete notifications older than 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model<INotification>('Notification', notificationSchema);
