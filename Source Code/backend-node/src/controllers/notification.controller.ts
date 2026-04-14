import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Notification from '../models/Notification';
import { AppError } from '../middleware/error.middleware';

/**
 * GET /api/notifications
 * Returns the 50 most recent notifications for the merchant.
 * Also returns unreadCount for the bell badge.
 */
export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = req.user!.merchantId;

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ merchantId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
      Notification.countDocuments({ merchantId, isRead: false }),
    ]);

    res.json({ success: true, data: { notifications, unreadCount } });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Marks a single notification as read.
 */
export const markRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = req.user!.merchantId;
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, merchantId },
      { isRead: true },
      { new: true }
    );

    if (!notification) throw new AppError('Notification not found', 404);

    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/read-all
 * Marks all merchant notifications as read.
 */
export const markAllRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = req.user!.merchantId;

    await Notification.updateMany({ merchantId, isRead: false }, { isRead: true });

    res.json({ success: true, message: 'تم تعيين جميع الإشعارات كمقروءة' });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/notifications/:id
 * Deletes a single notification.
 */
export const deleteNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = req.user!.merchantId;
    const { id } = req.params;

    await Notification.findOneAndDelete({ _id: id, merchantId });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
