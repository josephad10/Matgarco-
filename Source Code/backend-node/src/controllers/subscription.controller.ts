import { Response } from 'express';
import { AuthRequest } from '../types';
import Subscription, { PLANS, PlanId } from '../models/Subscription';
import Merchant from '../models/Merchant';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await Subscription.aggregate([
    { $unwind: '$invoices' },
    { $count: 'total' },
  ]);
  const seq = String((count[0]?.total || 0) + 1).padStart(5, '0');
  return `INV-${year}-${seq}`;
}

const PLAN_ORDER: PlanId[] = ['free_trial', 'starter', 'professional', 'business'];

// ─────────────────────────────────────────────
// GET /api/subscriptions/plans
// ─────────────────────────────────────────────
export const listPlans = async (_req: AuthRequest, res: Response) => {
  const plans = Object.values(PLANS).map((p) => ({
    id: p.id,
    name: p.name,
    nameEn: p.nameEn,
    price: p.price,
    yearlyPrice: p.yearlyPrice,
    limits: p.limits,
    commission: p.commission,
    features: p.features,
  }));
  res.status(200).json({ success: true, data: plans });
};

// ─────────────────────────────────────────────
// GET /api/subscriptions/my
// ─────────────────────────────────────────────
export const getMySubscription = async (req: AuthRequest, res: Response) => {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new Error('Merchant not found');

  const subscription = await Subscription.findOne({ merchantId });
  if (!subscription) {
    return res.status(404).json({ success: false, message: 'No subscription found. Please subscribe to a plan.' });
  }

  const planDetails = PLANS[subscription.plan];
  return res.status(200).json({ success: true, data: { subscription, planDetails } });
};

// ─────────────────────────────────────────────
// POST /api/subscriptions/subscribe
// ─────────────────────────────────────────────
export const subscribeToPlan = async (req: AuthRequest, res: Response) => {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new Error('Merchant not found');

  const { planId, billingCycle = 'monthly' } = req.body as { planId: PlanId; billingCycle?: 'monthly' | 'yearly' };

  if (!PLANS[planId]) {
    return res.status(400).json({ success: false, message: 'Invalid plan' });
  }

  const existing = await Subscription.findOne({ merchantId });
  if (existing && existing.status === 'active') {
    return res.status(400).json({ success: false, message: 'Already subscribed. Use upgrade/downgrade instead.' });
  }

  const plan = PLANS[planId];
  const now = new Date();
  const isFreeTrial = planId === 'free_trial';
  const amount = billingCycle === 'yearly' ? plan.yearlyPrice : plan.price;

  const periodEnd = new Date(now);
  if (isFreeTrial) {
    periodEnd.setDate(periodEnd.getDate() + (plan.trialDays || 14));
  } else if (billingCycle === 'yearly') {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  const invoices: any[] = [];
  if (amount > 0) {
    const invoiceNumber = await generateInvoiceNumber();
    invoices.push({
      invoiceNumber,
      amount,
      currency: 'EGP',
      status: 'paid',
      description: `اشتراك ${plan.name} — ${billingCycle === 'yearly' ? 'سنوي' : 'شهري'}`,
      billingPeriodStart: now,
      billingPeriodEnd: periodEnd,
      paidAt: now,
      paymentMethod: 'manual',
      createdAt: now,
    });
  }

  const data = {
    merchantId,
    plan: planId,
    billingCycle,
    amount,
    currency: 'EGP',
    status: isFreeTrial ? 'trialing' : 'active',
    startDate: now,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    autoRenew: !isFreeTrial,
    invoices,
  };

  const subscription = existing
    ? await Subscription.findOneAndUpdate({ merchantId }, data, { new: true })
    : await Subscription.create(data);

  await Merchant.findByIdAndUpdate(merchantId, {
    subscriptionPlan: planId,
    subscriptionStatus: 'active',
    subscriptionStartDate: now,
    subscriptionEndDate: periodEnd,
    trialEndsAt: isFreeTrial ? periodEnd : undefined,
    limits: plan.limits,
  });

  return res.status(201).json({ success: true, data: subscription });
};

// ─────────────────────────────────────────────
// POST /api/subscriptions/upgrade
// ─────────────────────────────────────────────
export const upgradePlan = async (req: AuthRequest, res: Response) => {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new Error('Merchant not found');

  const { planId, billingCycle = 'monthly' } = req.body as { planId: PlanId; billingCycle?: 'monthly' | 'yearly' };

  if (!PLANS[planId] || planId === 'free_trial') {
    return res.status(400).json({ success: false, message: 'Invalid upgrade plan' });
  }

  const subscription = await Subscription.findOne({ merchantId });
  if (!subscription) {
    return res.status(404).json({ success: false, message: 'No subscription found' });
  }

  const currentIdx = PLAN_ORDER.indexOf(subscription.plan);
  const newIdx = PLAN_ORDER.indexOf(planId);
  if (newIdx <= currentIdx) {
    return res.status(400).json({ success: false, message: 'Use /downgrade to switch to a lower plan' });
  }

  const newPlan = PLANS[planId];
  const now = new Date();
  const amount = billingCycle === 'yearly' ? newPlan.yearlyPrice : newPlan.price;
  const periodEnd = billingCycle === 'yearly' ? addYears(now, 1) : addMonths(now, 1);
  const invoiceNumber = await generateInvoiceNumber();

  subscription.plan = planId;
  subscription.billingCycle = billingCycle;
  subscription.amount = amount;
  subscription.status = 'active';
  subscription.currentPeriodStart = now;
  subscription.currentPeriodEnd = periodEnd;
  subscription.cancelledAt = undefined;
  subscription.cancellationReason = undefined;
  subscription.invoices.push({
    invoiceNumber,
    amount,
    currency: 'EGP',
    status: 'paid',
    description: `ترقية إلى ${newPlan.name} — ${billingCycle === 'yearly' ? 'سنوي' : 'شهري'}`,
    billingPeriodStart: now,
    billingPeriodEnd: periodEnd,
    paidAt: now,
    paymentMethod: 'manual',
    createdAt: now,
  } as any);

  await subscription.save();

  await Merchant.findByIdAndUpdate(merchantId, {
    subscriptionPlan: planId,
    subscriptionStatus: 'active',
    subscriptionStartDate: now,
    subscriptionEndDate: periodEnd,
    limits: newPlan.limits,
  });

  return res.status(200).json({ success: true, data: subscription });
};

// ─────────────────────────────────────────────
// POST /api/subscriptions/downgrade
// ─────────────────────────────────────────────
export const downgradePlan = async (req: AuthRequest, res: Response) => {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new Error('Merchant not found');

  const { planId } = req.body as { planId: PlanId };

  if (!PLANS[planId] || planId === 'free_trial') {
    return res.status(400).json({ success: false, message: 'Invalid plan for downgrade' });
  }

  const subscription = await Subscription.findOne({ merchantId });
  if (!subscription) {
    return res.status(404).json({ success: false, message: 'No subscription found' });
  }

  const currentIdx = PLAN_ORDER.indexOf(subscription.plan);
  const newIdx = PLAN_ORDER.indexOf(planId);
  if (newIdx >= currentIdx) {
    return res.status(400).json({ success: false, message: 'Use /upgrade to switch to a higher plan' });
  }

  const newPlan = PLANS[planId];
  subscription.plan = planId;
  subscription.amount = newPlan.price;
  subscription.status = 'active';
  await subscription.save();

  await Merchant.findByIdAndUpdate(merchantId, {
    subscriptionPlan: planId,
    limits: newPlan.limits,
  });

  return res.status(200).json({
    success: true,
    message: `تم التحويل إلى ${newPlan.name} بنجاح`,
    data: subscription,
  });
};

// ─────────────────────────────────────────────
// POST /api/subscriptions/cancel
// ─────────────────────────────────────────────
export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new Error('Merchant not found');

  const { reason } = req.body as { reason?: string };

  const subscription = await Subscription.findOne({ merchantId });
  if (!subscription) {
    return res.status(404).json({ success: false, message: 'No subscription found' });
  }
  if (subscription.status === 'cancelled') {
    return res.status(400).json({ success: false, message: 'Subscription already cancelled' });
  }

  subscription.status = 'cancelled';
  subscription.cancelledAt = new Date();
  subscription.cancellationReason = reason || 'غير محدد';
  subscription.autoRenew = false;
  await subscription.save();

  await Merchant.findByIdAndUpdate(merchantId, { subscriptionStatus: 'cancelled' });

  return res.status(200).json({
    success: true,
    message: 'تم إلغاء الاشتراك. سيستمر الوصول حتى نهاية الفترة الحالية.',
    data: { currentPeriodEnd: subscription.currentPeriodEnd },
  });
};

// ─────────────────────────────────────────────
// GET /api/subscriptions/invoices
// ─────────────────────────────────────────────
export const listInvoices = async (req: AuthRequest, res: Response) => {
  const merchantId = req.user?.merchantId;
  if (!merchantId) throw new Error('Merchant not found');

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const subscription = await Subscription.findOne({ merchantId });
  if (!subscription) {
    return res.status(200).json({ success: true, data: [], total: 0 });
  }

  const allInvoices = [...subscription.invoices].reverse();
  const total = allInvoices.length;
  const paginated = allInvoices.slice((page - 1) * limit, page * limit);

  return res.status(200).json({ success: true, data: paginated, total, page, pages: Math.ceil(total / limit) });
};

// ─────────────────────────────────────────────
// GET /api/super-admin/subscriptions/all
// ─────────────────────────────────────────────
export const getAllSubscriptions = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string;

  const filter: Record<string, any> = {};
  if (status && status !== 'all') filter.status = status;

  const [subscriptions, total] = await Promise.all([
    Subscription.find(filter)
      .populate('merchantId', 'storeName subdomain email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Subscription.countDocuments(filter),
  ]);

  const allInvoices = subscriptions.flatMap((sub) =>
    sub.invoices.map((inv) => ({
      ...JSON.parse(JSON.stringify(inv)),
      merchantName: (sub.merchantId as any)?.storeName,
      merchantEmail: (sub.merchantId as any)?.email,
      plan: sub.plan,
      subscriptionId: sub._id,
    }))
  );

  return res.status(200).json({
    success: true,
    data: {
      subscriptions,
      invoices: allInvoices.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    },
    total,
    page,
    pages: Math.ceil(total / limit),
  });
};
