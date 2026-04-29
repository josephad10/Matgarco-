import { Response, NextFunction } from 'express';
import Customer from '../models/Customer';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../types';

/**
 * Get all customers
 * GET /api/customers
 */
export const getCustomers = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const merchantId = req.user?.merchantId;

    if (!merchantId) {
      throw new AppError('No merchant associated', 400);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = { merchantId };

    if (req.query.search) {
      filter.$or = [
        { email: { $regex: req.query.search, $options: 'i' } },
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [customers, total] = await Promise.all([
      Customer.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ 'stats.totalSpent': -1 }),
      Customer.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        customers,
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
 * Get single customer
 * GET /api/customers/:id
 */
export const getCustomerById = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const merchantId = req.user?.merchantId;

    const customer = await Customer.findOne({ _id: id, merchantId });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { customer },
    });
  }
);

/**
 * Update customer
 * PATCH /api/customers/:id
 */
export const updateCustomer = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const merchantId = req.user?.merchantId;
    const updates = req.body;

    // Don't allow updating stats
    delete updates.stats;

    const customer = await Customer.findOneAndUpdate(
      { _id: id, merchantId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Customer updated',
      data: { customer },
    });
  }
);

/**
 * Get customer orders
 * GET /api/customers/:id/orders
 */
export const getCustomerOrders = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const merchantId = req.user?.merchantId;

    const customer = await Customer.findOne({ _id: id, merchantId });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    const Order = require('../models/Order').default;
    const orders = await Order.find({ customerId: id, merchantId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        customer,
        orders,
      },
    });
  }
);

