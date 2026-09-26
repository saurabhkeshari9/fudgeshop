import { Router } from 'express';
import {
  getCategories,
  adminGetCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Customer public
router.get('/', getCategories);

// Admin protected
router.get('/admin/all', requireAuth, adminGetCategories);
router.post('/admin', requireAuth, createCategory);
router.put('/admin/:id', requireAuth, updateCategory);
router.delete('/admin/:id', requireAuth, deleteCategory);

export default router;
