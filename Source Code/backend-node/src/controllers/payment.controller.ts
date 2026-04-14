import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import Order from '../models/Order';
import Merchant from '../models/Merchant';
import { createPaymobIntention, verifyPaymobHmac } from '../services/payment.service';

// ─────────────────────────────────────────────
// POST /api/payments/create-intention
// Creates a Paymob payment intention for an order
// ─────────────────────────────────────────────
export const createIntention = async (req: Request, res: Response) => {
  const {
    orderId,
    // OR build from cart directly
    subdomain,
    customerInfo,
    shippingAddress,
    items,
    total,
  } = req.body;

  let order: any = null;
  let merchantId: string;

  // If orderId provided, look up existing order
  if (orderId) {
    order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    merchantId = order.merchantId.toString();
  } else {
    // Cart-based mode: find merchant by subdomain
    const merchant = await Merchant.findOne({ subdomain });
    if (!merchant) return res.status(404).json({ success: false, message: 'Store not found' });
    merchantId = merchant._id.toString();
  }

  const merchant = await Merchant.findById(merchantId).select('+paymobConfig.secretKey');
  if (!merchant) return res.status(404).json({ success: false, message: 'Merchant not found' });

  const usesMerchantPaymob = merchant.subscriptionPlan === 'business' && !!(merchant as any).paymobConfig?.secretKey;
  let merchantKeys: { secretKey: string; publicKey: string } | undefined;
  
  if (usesMerchantPaymob) {
    merchantKeys = {
      secretKey: (merchant as any).paymobConfig.secretKey,
      publicKey: (merchant as any).paymobConfig.publicKey,
    };
  }

  // Build intention payload
  const intentionItems = order
    ? order.items.map((i: any) => ({
        name: i.productName,
        amount: Math.round(i.price * 100),
        quantity: i.quantity,
      }))
    : (items || []).map((i: any) => ({
        name: i.productName || i.name,
        amount: Math.round(i.price * 100),
        quantity: i.quantity,
      }));

  const amountCents = order
    ? Math.round(order.total * 100)
    : Math.round((total || 0) * 100);

  const billing = order ? order.customerInfo : customerInfo;
  const shipping = order ? order.shippingAddress : shippingAddress;

  const result = await createPaymobIntention({
    amount: amountCents,
    currency: 'EGP',
    merchantOrderId: order ? order._id.toString() : `cart-${Date.now()}`,
    billingData: {
      firstName: billing?.firstName || 'N/A',
      lastName: billing?.lastName || 'N/A',
      phone: billing?.phone || '01000000000',
      email: billing?.email || 'noemail@matgarco.com',
      street: shipping?.street || 'N/A',
      city: shipping?.city || 'Cairo',
      country: 'EG',
      state: shipping?.state,
    },
    items: intentionItems,
  }, merchantKeys);

  // Save paymob_intention_id on order if exists
  if (order) {
    await Order.findByIdAndUpdate(order._id, {
      paymentMethod: 'card',
      paymentStatus: 'pending',
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      clientSecret: result.clientSecret,
      intentionId: result.intentionId,
      paymentUrl: result.paymentUrl,
      publicKey: merchantKeys?.publicKey || process.env.PAYMOB_PUBLIC_KEY,
    },
  });
};

// ─────────────────────────────────────────────
// POST /api/payments/webhook
// Paymob sends payment result here (Transaction Processed Callback)
// ─────────────────────────────────────────────
export const handleWebhook = async (req: Request, res: Response) => {
  const hmac = (req.query.hmac as string) || '';
  const body = req.body;

  // Verify HMAC signature
  if (hmac && !verifyPaymobHmac(body?.obj || body, hmac)) {
    return res.status(401).json({ success: false, message: 'Invalid HMAC signature' });
  }

  // Transaction data is nested under body.obj for v2
  const transaction = body?.obj || body;
  const isSuccess = transaction?.success === true || transaction?.success === 'true';
  const merchantOrderId = transaction?.order?.merchant_order_id || transaction?.extras?.merchant_order_id;
  const transactionId = transaction?.id?.toString();

  if (merchantOrderId) {
    const paymentStatus = isSuccess ? 'paid' : 'failed';
    await Order.findByIdAndUpdate(merchantOrderId, {
      paymentStatus,
      paymentTransactionId: transactionId,
      $push: {
        timeline: {
          status: `payment_${paymentStatus}`,
          timestamp: new Date(),
          note: `Paymob transaction ${transactionId}: ${isSuccess ? 'Paid' : 'Failed'}`,
        },
      },
    });
  }

  // Always return 200 to Paymob to prevent retries
  return res.status(200).json({ success: true, received: true });
};

// ─────────────────────────────────────────────
// GET /api/payments/status/:orderId
// Check payment status for an order
// ─────────────────────────────────────────────
export const getPaymentStatus = async (req: AuthRequest, res: Response) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).select('paymentStatus paymentTransactionId paymentMethod total orderNumber');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  return res.status(200).json({ success: true, data: order });
};
