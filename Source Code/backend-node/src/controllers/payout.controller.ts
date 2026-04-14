import { Response } from 'express';
import { AuthRequest } from '../types';
import Merchant from '../models/Merchant';
import MerchantPayout from '../models/MerchantPayout';
import Order from '../models/Order';

// ── Commission rates (must match PLANS in Subscription.ts) ──────────────────
export const PAYMOB_FEE_RATE = 0.02;    // ~2% رسوم Paymob التقريبية
export const MATGARCO_COMMISSION: Record<string, number> = {
  free_trial:   0.03,   // 3%
  starter:      0.02,   // 2%
  professional: 0.01,   // 1% (مخفي)
  business:     0,      // 0%  — يستخدم Paymob الخاص
};

// Helper
function roundEgp(n: number) { return Math.round(n * 100) / 100; }

// ─────────────────────────────────────────────
// GET /api/payouts/pending  [Super Admin]
// ─────────────────────────────────────────────
export const getPendingPayouts = async (_req: AuthRequest, res: Response) => {
  // Group unpaid orders by merchant
  const pending = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
        payoutStatus: 'pending',
        usesMerchantPaymob: false,
      },
    },
    {
      $group: {
        _id: '$merchantId',
        ordersCount: { $sum: 1 },
        grossAmount: { $sum: '$total' },
        paymobFees: { $sum: '$paymobFee' },
        matgarcoCommission: { $sum: '$matgarcoFee' },
        netAmount: { $sum: '$merchantNet' },
        oldestOrder: { $min: '$createdAt' },
        orderIds: { $push: '$_id' },
      },
    },
    {
      $lookup: {
        from: 'merchants',
        localField: '_id',
        foreignField: '_id',
        as: 'merchant',
      },
    },
    { $unwind: '$merchant' },
    {
      $project: {
        merchantId: '$_id',
        storeName: '$merchant.storeName',
        subdomain: '$merchant.subdomain',
        email: '$merchant.email',
        subscriptionPlan: '$merchant.subscriptionPlan',
        bankInfo: '$merchant.payoutInfo',
        ordersCount: 1,
        grossAmount: 1,
        paymobFees: 1,
        matgarcoCommission: 1,
        netAmount: 1,
        oldestOrder: 1,
        orderIds: 1,
      },
    },
    { $sort: { netAmount: -1 } },
  ]);

  return res.status(200).json({ success: true, data: pending, total: pending.length });
};

// ─────────────────────────────────────────────
// POST /api/payouts/process  [Super Admin]
// Create payout record + mark orders as included
// ─────────────────────────────────────────────
export const processPayout = async (req: AuthRequest, res: Response) => {
  const { merchantId, transferReference, notes } = req.body;

  if (!merchantId) {
    return res.status(400).json({ success: false, message: 'merchantId required' });
  }

  // Fetch all pending paid orders
  const orders = await Order.find({
    merchantId,
    paymentStatus: 'paid',
    payoutStatus: 'pending',
    usesMerchantPaymob: false,
  });

  if (orders.length === 0) {
    return res.status(404).json({ success: false, message: 'No pending orders for this merchant' });
  }

  const orderIds = orders.map((o) => o._id);
  const now = new Date();
  const periodFrom = orders.reduce((min, o) => o.createdAt < min ? o.createdAt : min, orders[0].createdAt);

  const totals = orders.reduce(
    (acc, o) => ({
      gross: acc.gross + o.total,
      paymob: acc.paymob + o.paymobFee,
      commission: acc.commission + o.matgarcoFee,
      net: acc.net + o.merchantNet,
    }),
    { gross: 0, paymob: 0, commission: 0, net: 0 }
  );

  // Create payout record
  const payout = await MerchantPayout.create({
    merchantId,
    periodFrom,
    periodTo: now,
    ordersCount: orders.length,
    grossAmount: roundEgp(totals.gross),
    paymobFees: roundEgp(totals.paymob),
    matgarcoCommission: roundEgp(totals.commission),
    netAmount: roundEgp(totals.net),
    status: 'paid',
    paidAt: now,
    transferReference,
    notes,
    orderIds,
  });

  // Mark all orders as included in payout
  await Order.updateMany(
    { _id: { $in: orderIds } },
    { payoutStatus: 'paid', payoutId: payout._id }
  );

  // Update merchant pending balance
  await Merchant.findByIdAndUpdate(merchantId, {
    $inc: {
      'payoutInfo.pendingBalance': -roundEgp(totals.net),
      'payoutInfo.totalPaidOut': roundEgp(totals.net),
    },
    'payoutInfo.lastPayoutAt': now,
  });

  return res.status(201).json({ success: true, data: payout });
};

// ─────────────────────────────────────────────
// GET /api/payouts/history  [Super Admin]
// All payouts, paginated
// ─────────────────────────────────────────────
export const getPayoutHistory = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const merchantId = req.query.merchantId as string;

  const filter: Record<string, any> = {};
  if (merchantId) filter.merchantId = merchantId;

  const [payouts, total] = await Promise.all([
    MerchantPayout.find(filter)
      .populate('merchantId', 'storeName subdomain email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    MerchantPayout.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    data: payouts,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
};

// ─────────────────────────────────────────────
// GET /api/payouts/my  [Merchant]
// My pending balance + payout history
// ─────────────────────────────────────────────
export const getMyPayouts = async (req: AuthRequest, res: Response) => {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new Error('Merchant not found');

  const [merchant, payouts, pendingOrders] = await Promise.all([
    Merchant.findById(merchantId).select('payoutInfo subscriptionPlan storeName'),
    MerchantPayout.find({ merchantId }).sort({ createdAt: -1 }).limit(10),
    Order.find({ merchantId, paymentStatus: 'paid', payoutStatus: 'pending' })
      .select('total paymobFee matgarcoFee merchantNet createdAt orderNumber')
      .sort({ createdAt: -1 }),
  ]);

  if (!merchant) return res.status(404).json({ success: false, message: 'Merchant not found' });

  // Next payout date: next Sunday
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const nextPayoutDate = new Date(now);
  nextPayoutDate.setDate(now.getDate() + daysUntilSunday);
  nextPayoutDate.setHours(12, 0, 0, 0);

  const plan = merchant.subscriptionPlan;
  const commissionRate = MATGARCO_COMMISSION[plan] || 0;
  const announcedRate = plan === 'professional' ? PAYMOB_FEE_RATE : PAYMOB_FEE_RATE + commissionRate;

  return res.status(200).json({
    success: true,
    data: {
      pendingBalance: merchant.payoutInfo?.pendingBalance || 0,
      totalPaidOut: merchant.payoutInfo?.totalPaidOut || 0,
      lastPayoutAt: merchant.payoutInfo?.lastPayoutAt,
      nextPayoutDate,
      commissionInfo: {
        plan,
        // What we show the merchant per their plan
        paymobRate: PAYMOB_FEE_RATE,
        matgarcoRate: plan === 'professional' ? 0 : commissionRate, // hide professional commission
        totalRate: announcedRate,
        description: getCommissionDescription(plan),
      },
      payoutHistory: payouts,
      pendingOrders,
    },
  });
};

// ─────────────────────────────────────────────
// PATCH /api/payouts/:id/mark-paid  [Super Admin]
// ─────────────────────────────────────────────
export const markPayoutPaid = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { transferReference, notes } = req.body;

  const payout = await MerchantPayout.findById(id);
  if (!payout) return res.status(404).json({ success: false, message: 'Payout not found' });

  payout.status = 'paid';
  payout.paidAt = new Date();
  if (transferReference) payout.transferReference = transferReference;
  if (notes) payout.notes = notes;
  await payout.save();

  await Order.updateMany(
    { _id: { $in: payout.orderIds } },
    { payoutStatus: 'paid', payoutId: payout._id }
  );

  return res.status(200).json({ success: true, data: payout });
};

// ─────────────────────────────────────────────
// PUT /api/payouts/bank-info  [Merchant]
// Update merchant bank details for payouts
// ─────────────────────────────────────────────
export const updateBankInfo = async (req: AuthRequest, res: Response) => {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new Error('Merchant not found');

  const { bankName, accountNumber, accountName, iban } = req.body;

  await Merchant.findByIdAndUpdate(merchantId, {
    'payoutInfo.bankName': bankName,
    'payoutInfo.accountNumber': accountNumber,
    'payoutInfo.accountName': accountName,
    'payoutInfo.iban': iban,
  });

  return res.status(200).json({ success: true, message: 'Bank info updated' });
};

// ─────────────────────────────────────────────
// PUT /api/payouts/paymob-config  [Merchant — Business plan only]
// ─────────────────────────────────────────────
export const updatePaymobConfig = async (req: AuthRequest, res: Response) => {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new Error('Merchant not found');

  const merchant = await Merchant.findById(merchantId);
  if (!merchant) return res.status(404).json({ success: false, message: 'Merchant not found' });

  if (merchant.subscriptionPlan !== 'business') {
    return res.status(403).json({
      success: false,
      message: 'ربط بوابة الدفع الخاصة متاح فقط لباقة Business',
    });
  }

  const { secretKey, publicKey, integrationId } = req.body;
  await Merchant.findByIdAndUpdate(merchantId, {
    paymobConfig: { secretKey, publicKey, integrationId },
  });

  return res.status(200).json({ success: true, message: 'Paymob config updated' });
};

// ─────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────
function getCommissionDescription(plan: string): string {
  switch (plan) {
    case 'free_trial': return 'عمولة 5% على كل معاملة (2% Paymob + 3% منصة)';
    case 'starter':    return 'عمولة 4% على كل معاملة (2% Paymob + 2% منصة)';
    case 'professional': return 'رسوم Paymob فقط 2% على كل معاملة';
    case 'business':   return 'أنت تدير بوابة الدفع الخاصة بك — بدون عمولة منصة';
    default: return '';
  }
}
