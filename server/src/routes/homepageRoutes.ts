import { Router } from 'express';
import { getHomepageContent, updateHomepageContent } from '../controllers/homepageController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', getHomepageContent);
router.put('/admin', requireAuth, updateHomepageContent);

export default router;
