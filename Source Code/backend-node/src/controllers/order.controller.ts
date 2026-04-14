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

    // Validate merchant exists and is active
    const merchant = await Merchant.findOne({ _id: merchantId, isActive: true });
    if (!merchant) {
      throw new AppError('Store not found or inactive', 404);
    }

    // Validate and calculate order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.productId,
        merchantId,
        status: 'active',
      });

      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404);
      }

      // Check stock
      if (product.trackQuantity && product.quantity! < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400);
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        productImage: product.images[0]?.url,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemSubtotal,
      });

      // Update product stock
      if (product.trackQuantity) {
        product.quantity! -= item.quantity;
        product.sales += item.quantity;
        await product.save();
        // Notify low stock (threshold: 5)
        if (product.quantity! <= 5) {
          notifyLowStock(merchantId, product.name, product._id.toString(), product.quantity!);
        }
      }
    }

    const total = subtotal + shippingCost + tax - discount;

    // Calculate platform commission (legacy field)
    const plan = merchant.subscriptionPlan as string;
    const commissionRate = (SUBSCRIPTION_PLANS as any)[plan]?.commissionRate || 0;
    const commissionAmount = calculateCommission(total, commissionRate);

    // ── Aggregator commission breakdown ──
    const usesMerchantPaymob = plan === 'business' && !!(merchant as any).paymobConfig?.secretKey;
    const paymobFeeRate = usesMerchantPaymob ? 0 : PAYMOB_FEE_RATE;
    const matgarcoRate   = usesMerchantPaymob ? 0 : (MATGARCO_COMMISSION[plan] || 0);
    const paymobFee   = paymentMethod === 'cash' ? 0 : Math.round(total * paymobFeeRate * 100) / 100;
    const matgarcoFee = paymentMethod === 'cash' ? 0 : Math.round(total * matgarcoRate * 100) / 100;
    const merchantNet = total - paymobFee - matgarcoFee;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Find or create customer
    let customer = await Customer.findOne({
      merchantId,
      email: customerInfo.email,
    });

    if (!customer) {
      customer = await Customer.create({
        merchantId,
        email: customerInfo.email,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        phone: customerInfo.phone,
        acceptsMarketing: false,
      });

      // Update merchant stats
      await Merchant.findByIdAndUpdate(merchantId, {
        $inc: { 'stats.totalCustomers': 1 },
      });
    }

    // Create order
    const order = await Order.create({
      merchantId,
      orderNumber,
      customerId: customer._id,
      customerInfo,
      items: orderItems,
      subtotal,
      tax,
      shippingCost,
      discount,
      total,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      customerNotes,
      platformCommission: {
        percentage: commissionRate,
        amount: commissionAmount,
      },
      // Aggregator payout fields
      paymobFee,
      matgarcoFee,
      merchantNet,
      usesMerchantPaymob,
      payoutStatus: 'pending',
    });

    // Update customer stats
    customer.stats.totalOrders += 1;
    customer.stats.totalSpent += total;
    customer.stats.averageOrderValue = customer.stats.totalSpent / customer.stats.totalOrders;
    customer.stats.lastOrderDate = new Date();
    await customer.save();

    // Update merchant stats
    await Merchant.findByIdAndUpdate(merchantId, {
      $inc: {
        'stats.totalOrders': 1,
        'stats.totalRevenue': total,
      },
    });

    // Notify merchant of new order
    notifyNewOrder(merchantId, orderNumber, order._id.toString(), total);

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
