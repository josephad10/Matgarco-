import mongoose from 'mongoose';
import { Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Customer from '../models/Customer';
import Merchant from '../models/Merchant';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../types';
import { generateOrderNumber, calculateCommission } from '../utils/helpers';
import { SUBSCRIPTION_PLANS } from '../utils/constants';
import { PAYMOB_FEE_RATE, MATGARCO_COMMISSION } from './payout.controller';
import {
  notifyNewOrder,
  notifyOrderStatusChanged,
  notifyOrderCancelled,
  notifyLowStock,
} from '../services/notification.service';

/**
 * Get all orders (merchant)
 * GET /api/orders
 */
export const getOrders = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const merchantId = req.user?.merchantId;

    if (!merchantId) {
      throw new AppError('No merchant associated', 400);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { merchantId };

    // Filters
    if (req.query.status) {
      filter.orderStatus = req.query.status;
    }
    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }
    if (req.query.search) {
      filter.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } },
        { 'customerInfo.email': { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('customerId', 'firstName lastName email')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  }
);

/**
 * Get single order
 * GET /api/orders/:id
 */
export const getOrderById = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const merchantId = req.user?.merchantId;

    const order = await Order.findOne({
      _id: id,
      merchantId,
    }).populate('customerId', 'firstName lastName email phone');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { order },
    });
  }
);

/**
 * Create order (checkout)
 * POST /api/orders
 *
 * ATOMIC STOCK DEDUCTION — Mongoose 8 / MongoDB 6+
 * Uses a replica-set session + withTransaction() to guarantee:
 *   1. Stock check + decrement are a single atomic document operation
 *      (no TOCTOU race condition — two simultaneous requests for the
 *      last item will produce exactly one success and one 400).
 *   2. If ANY item fails (out of stock / not found) the entire
 *      transaction aborts, restoring all previously decremented stock.
 *   3. Non-critical writes (merchant revenue stats, notifications)
 *      run fire-and-forget AFTER commit so they never block the
 *      commit path or cause spurious rollbacks.
 */
export const createOrder = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const {
      merchantId,
      items,
      customerInfo,
      shippingAddress,
      billingAddress,
      paymentMethod,
      customerNotes,
      shippingCost = 0,
      tax = 0,
      discount = 0,
    } = req.body;

    // ── Pre-flight: validate merchant OUTSIDE the transaction ─────────────────
    // This is a read-only check; if it fails we save the overhead of opening
    // a session entirely.
    const merchant = await Merchant.findOne({ _id: merchantId, isActive: true });
    if (!merchant) {
      throw new AppError('Store not found or inactive', 404);
    }

    // Pre-compute plan economics so they are available inside the callback
    // without re-querying the DB under the session lock.
    const plan              = merchant.subscriptionPlan as string;
    const commissionRate    = (SUBSCRIPTION_PLANS as any)[plan]?.commissionRate || 0;
    const usesMerchantPaymob = plan === 'business' && !!(merchant as any).paymobConfig?.secretKey;
    const paymobFeeRate     = usesMerchantPaymob ? 0 : PAYMOB_FEE_RATE;
    const matgarcoRate      = usesMerchantPaymob ? 0 : (MATGARCO_COMMISSION[plan] || 0);

    // ── Session scaffolding ───────────────────────────────────────────────────
    // Declare result variables outside the transaction callback so they are
    // accessible in the post-commit block.
    let order: any;
    // Accumulate low-stock alerts outside so they survive the callback scope.
    const lowStockAlerts: Array<{ name: string; id: string; qty: number }> = [];

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        // Reset accumulators: withTransaction() may retry the callback on
        // transient write-conflict errors (WCE), so we must start clean.
        const orderItems: any[] = [];
        let subtotal = 0;
        lowStockAlerts.length = 0;

        // ── ATOMIC STOCK DEDUCTION LOOP ─────────────────────────────────────
        // One findOneAndUpdate per cart item.
        // Filter guarantees: correct merchant, active status, AND
        //   • if trackQuantity=true  → quantity must be >= requested (atomic guard)
        //   • if trackQuantity=false → no quantity restriction
        // Update uses an aggregation pipeline so the quantity decrement is
        // conditional on trackQuantity — a plain $inc would blindly decrement
        // untracked products.
        for (const item of items) {
          const updated = await Product.findOneAndUpdate(
            {
              _id: item.productId,
              merchantId,
              status: 'active',
              $or: [
                { trackQuantity: false },
                { trackQuantity: true, quantity: { $gte: item.quantity } },
              ],
            },
            [
              {
                $set: {
                  // Decrement only when trackQuantity is true — safe for both paths
                  quantity: {
                    $cond: {
                      if: '$trackQuantity',
                      then: { $subtract: ['$quantity', item.quantity] },
                      else: '$quantity',
                    },
                  },
                  // Always increment sales counter
                  sales: { $add: ['$sales', item.quantity] },
                },
              },
            ],
            // Return the post-update document; bind to the session so this
            // write participates in the transaction and is rolled back on abort.
            { new: true, session }
          );

          // null means the filter matched nothing:
          // either the product doesn't exist / wrong merchant / not active,
          // OR quantity was insufficient. Either way it's a hard stop.
          if (!updated) {
            throw new AppError(
              `Insufficient stock or product not found: ${item.productId}`,
              400
            );
          }

          const itemSubtotal = updated.price * item.quantity;
          subtotal += itemSubtotal;

          orderItems.push({
            productId:    updated._id,
            productName:  updated.name,
            productImage: updated.images[0]?.url,
            quantity:     item.quantity,
            price:        updated.price,
            subtotal:     itemSubtotal,
          });

          // Post-update low-stock check (after decrement so value is final)
          if (updated.trackQuantity && updated.quantity! <= 5) {
            lowStockAlerts.push({
              name: updated.name,
              id:   updated._id.toString(),
              qty:  updated.quantity!,
            });
          }
        }

        // ── TOTALS ───────────────────────────────────────────────────────────
        const total           = subtotal + shippingCost + tax - discount;
        const commissionAmount = calculateCommission(total, commissionRate);
        const paymobFee       = paymentMethod === 'cash' ? 0 : Math.round(total * paymobFeeRate * 100) / 100;
        const matgarcoFee     = paymentMethod === 'cash' ? 0 : Math.round(total * matgarcoRate  * 100) / 100;
        const merchantNet     = total - paymobFee - matgarcoFee;

        // ── CUSTOMER FIND-OR-CREATE (inside transaction) ──────────────────────
        // .session() pins the read to the same snapshot as the writes above.
        let customer = await Customer
          .findOne({ merchantId, email: customerInfo.email })
          .session(session);

        const isNewCustomer = !customer;

        if (!customer) {
          // Model.create() requires array form when passing a session.
          [customer] = await Customer.create(
            [{
              merchantId,
              email:    customerInfo.email,
              firstName: customerInfo.firstName,
              lastName:  customerInfo.lastName,
              phone:     customerInfo.phone,
              acceptsMarketing: false,
            }],
            { session }
          );
        }

        // ── ORDER DOCUMENT CREATION (inside transaction) ──────────────────────
        const orderNumber = generateOrderNumber();
        [order] = await Order.create(
          [{
            merchantId,
            orderNumber,
            customerId:  customer._id,
            customerInfo,
            items:       orderItems,
            subtotal,
            tax,
            shippingCost,
            discount,
            total,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod,
            customerNotes,
            platformCommission: { percentage: commissionRate, amount: commissionAmount },
            paymobFee,
            matgarcoFee,
            merchantNet,
            usesMerchantPaymob,
            payoutStatus: 'pending',
          }],
          { session }
        );

        // ── CUSTOMER STATS (inside transaction) ──────────────────────────────
        customer.stats.totalOrders    += 1;
        customer.stats.totalSpent     += total;
        customer.stats.averageOrderValue =
          customer.stats.totalSpent / customer.stats.totalOrders;
        customer.stats.lastOrderDate   = new Date();
        await customer.save({ session });

        // Increment new-customer count on the merchant document
        if (isNewCustomer) {
          await Merchant.findByIdAndUpdate(
            merchantId,
            { $inc: { 'stats.totalCustomers': 1 } },
            { session }
          );
        }
      }); // ← withTransaction commits here; aborts + retries on WCE
    } finally {
      // Always release the server-side cursor regardless of outcome.
      await session.endSession();
    }

    // ── POST-COMMIT: fire-and-forget non-critical operations ──────────────────
    // These run only after a successful commit. Failures here are logged but
    // do NOT affect the already-confirmed order or roll back stock.

    // Merchant order/revenue counters (non-critical aggregate stats)
    Merchant.findByIdAndUpdate(merchantId, {
      $inc: {
        'stats.totalOrders':  1,
        'stats.totalRevenue': order.total,
      },
    }).catch((err: Error) =>
      console.error('[Matgarco] Merchant stats update failed after order commit:', err.message)
    );

    // Low-stock push notifications
    for (const alert of lowStockAlerts) {
      notifyLowStock(merchantId, alert.name, alert.id, alert.qty);
    }

    // New-order push notification to merchant dashboard
    notifyNewOrder(merchantId, order.orderNumber, order._id.toString(), order.total);

    // ── RESPONSE — structure identical to original API contract ───────────────
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order },
    });
  }
);

/**
 * Update order status
 * PATCH /api/orders/:id/status
 */
export const updateOrderStatus = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { orderStatus, note } = req.body;
    const merchantId = req.user?.merchantId;

    const order = await Order.findOne({ _id: id, merchantId });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    order.orderStatus = orderStatus;
    
    // Add timeline event
    order.timeline.push({
      status: orderStatus,
      timestamp: new Date(),
      note: note || `Status updated to ${orderStatus}`,
    });

    // Update fulfillment status
    if (orderStatus === 'delivered') {
      order.fulfillmentStatus = 'fulfilled';
    }

    await order.save();

    // Notify merchant of status change
    notifyOrderStatusChanged(
      merchantId!,
      order.orderNumber,
      order._id.toString(),
      orderStatus
    );

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: { order },
    });
  }
);

/**
 * Update payment status
 * PATCH /api/orders/:id/payment
 */
export const updatePaymentStatus = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { paymentStatus, transactionId } = req.body;
    const merchantId = req.user?.merchantId;

    const order = await Order.findOne({ _id: id, merchantId });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    order.paymentStatus = paymentStatus;
    
    if (transactionId) {
      order.paymentTransactionId = transactionId;
    }

    // Add timeline event
    order.timeline.push({
      status: `Payment ${paymentStatus}`,
      timestamp: new Date(),
      note: `Payment status updated to ${paymentStatus}`,
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated',
      data: { order },
    });
  }
);

/**
 * Cancel order
 * POST /api/orders/:id/cancel
 */
export const cancelOrder = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { reason } = req.body;
    const merchantId = req.user?.merchantId;

    const order = await Order.findOne({ _id: id, merchantId });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
      throw new AppError('Cannot cancel this order', 400);
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          quantity: item.quantity,
          sales: -item.quantity,
        },
      });
    }

    order.orderStatus = 'cancelled';
    order.timeline.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: reason || 'Order cancelled',
    });

    await order.save();

    // Notify merchant of cancellation
    notifyOrderCancelled(merchantId!, order.orderNumber, order._id.toString());

    // Update merchant stats
    await Merchant.findByIdAndUpdate(merchantId, {
      $inc: {
        'stats.totalOrders': -1,
        'stats.totalRevenue': -order.total,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Order cancelled',
      data: { order },
    });
  }
);

/**
 * Add tracking info
 * PATCH /api/orders/:id/tracking
 */
export const updateTracking = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { trackingNumber, shippingProvider } = req.body;
    const merchantId = req.user?.merchantId;

    const order = await Order.findOneAndUpdate(
      { _id: id, merchantId },
      {
        $set: {
          trackingNumber,
          shippingProvider,
          orderStatus: 'shipped',
        },
        $push: {
          timeline: {
            status: 'shipped',
            timestamp: new Date(),
            note: `Shipped via ${shippingProvider}. Tracking: ${trackingNumber}`,
          },
        },
      },
      { new: true }
    );

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Tracking info updated',
      data: { order },
    });
  }
);
