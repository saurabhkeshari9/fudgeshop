import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

// Admin: Aggregated Customer Directory from Orders
export const getCustomersList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customers = await Order.aggregate([
      {
        $group: {
          _id: '$customer.email',
          firstName: { $last: '$customer.firstName' },
          lastName: { $last: '$customer.lastName' },
          email: { $last: '$customer.email' },
          phone: { $last: '$customer.phone' },
          totalOrders: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [{ $ne: ['$orderStatus', 'Cancelled'] }, '$totalAmount', 0],
            },
          },
          lastOrderDate: { $max: '$createdAt' },
          latestOrderStatus: { $last: '$orderStatus' },
        },
      },
      { $sort: { lastOrderDate: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Real Dashboard Metrics
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      cancelledOrders,
      totalProducts,
      activeProducts,
      lowStockProducts,
      recentOrders,
      revenueResult,
      topProducts,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Order.countDocuments({ orderStatus: 'Processing' }),
      Order.countDocuments({ orderStatus: 'Delivered' }),
      Order.countDocuments({ orderStatus: 'Cancelled' }),
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ stock: { $lte: 5 } }),
      Order.find().sort({ createdAt: -1 }).limit(6),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
      // Top products by order count
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            name: { $first: '$items.name' },
            totalSold: { $sum: '$items.quantity' },
            revenue: { $sum: '$items.subtotal' },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalRevenue: Number(totalRevenue.toFixed(2)),
          totalOrders,
          pendingOrders,
          processingOrders,
          deliveredOrders,
          cancelledOrders,
          totalProducts,
          activeProducts,
          lowStockProducts,
        },
        recentOrders,
        topProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};
