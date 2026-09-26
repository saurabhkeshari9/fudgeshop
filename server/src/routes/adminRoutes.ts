import { Router } from 'express';
import { getCustomersList, getDashboardStats } from '../controllers/customerController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/dashboard/stats', requireAuth, getDashboardStats);
router.get('/customers', requireAuth, getCustomersList);

export default router;
