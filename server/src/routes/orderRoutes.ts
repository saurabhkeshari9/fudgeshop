import { Router } from 'express';
import {
  createOrder,
  getOrderByIdOrNumber,
  getMyOrders,
  getMyOrderById,
  adminGetOrders,
  adminGetOrderById,
  updateOrderStatus,
} from '../controllers/orderController';
import { requireAuth, optionalAuth } from '../middleware/auth';

const router = Router();

// Customer order placement (optional auth to link logged-in customer)
router.post('/', optionalAuth, createOrder);

// Customer authenticated routes
router.get('/my-orders', requireAuth, getMyOrders);
router.get('/my-orders/:id', requireAuth, getMyOrderById);

// Public order lookup by OrderNumber or ID
router.get('/lookup/:id', getOrderByIdOrNumber);

// Admin protected
router.get('/admin/all', requireAuth, adminGetOrders);
router.get('/admin/:id', requireAuth, adminGetOrderById);
router.patch('/admin/:id/status', requireAuth, updateOrderStatus);

export default router;
