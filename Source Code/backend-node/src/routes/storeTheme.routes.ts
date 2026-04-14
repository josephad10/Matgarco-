import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/error.middleware';
import {
  getMyActiveTheme,
  updateActiveTheme,
  installTheme,
} from '../controllers/storeTheme.controller';

const router = Router();

router.use(authenticate);

router.get('/my-active', asyncHandler(getMyActiveTheme));
router.put('/my-active', asyncHandler(updateActiveTheme));
router.post('/install/:themeId', asyncHandler(installTheme));

export default router;
