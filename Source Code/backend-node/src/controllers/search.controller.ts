import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Product from '../models/Product';
import Order from '../models/Order';
import Customer from '../models/Customer';

/**
 * GET /api/search?q=...
 * Searches products, orders, and customers scoped to the merchant.
 * Returns up to 5 results per category.
 */
export const globalSearch = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const merchantId = req.user!.merchantId;
    const q = (req.query.q as string || '').trim();

    if (!q || q.length < 2) {
      res.json({ success: true, data: { products: [], orders: [], customers: [] } });
      return;
    }

    const regex = new RegExp(q, 'i');

    const [products, orders, customers] = await Promise.all([
      // Products: match name or SKU
      Product.find({
        merchantId,
        $or: [{ name: regex }, { sku: regex }],
      })
        .select('_id name price status images sku')
        .limit(5)
        .lean(),

      // Orders: match order number or customer name/email/phone
      Order.find({
        merchantId,
        $or: [
          { orderNumber: regex },
          { 'customerInfo.firstName': regex },
          { 'customerInfo.lastName': regex },
          { 'customerInfo.email': regex },
          { 'customerInfo.phone': regex },
        ],
      })
        .select('_id orderNumber total orderStatus customerInfo createdAt')
        .limit(5)
        .lean(),

      // Customers: match name, email, or phone
      Customer.find({
        merchantId,
        $or: [
          { firstName: regex },
          { lastName: regex },
          { email: regex },
          { phone: regex },
        ],
      })
        .select('_id firstName lastName email phone')
        .limit(5)
        .lean(),
    ]);

    res.json({
      success: true,
      data: { products, orders, customers },
    });
  } catch (err) {
    next(err);
  }
};
