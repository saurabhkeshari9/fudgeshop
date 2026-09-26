import { Router } from 'express';
import { getStoreSettings, updateStoreSettings } from '../controllers/settingsController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', getStoreSettings);
router.put('/admin', requireAuth, updateStoreSettings);

export default router;
