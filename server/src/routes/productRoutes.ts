import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getBestsellers,
  adminGetProducts,
  adminGetProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from '../controllers/productController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Customer public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestsellers);
router.get('/slug/:slug', getProductBySlug);

// Admin protected routes
router.get('/admin/all', requireAuth, adminGetProducts);
router.get('/admin/:id', requireAuth, adminGetProductById);
router.post('/admin', requireAuth, createProduct);
router.put('/admin/:id', requireAuth, updateProduct);
router.delete('/admin/:id', requireAuth, deleteProduct);
router.patch('/admin/:id/toggle-status', requireAuth, toggleProductStatus);

export default router;
