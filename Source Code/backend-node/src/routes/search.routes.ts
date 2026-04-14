import { Router } from 'express';
import { authenticate, isMerchant } from '../middleware/auth.middleware';
import { globalSearch } from '../controllers/search.controller';

const router = Router();

router.get('/', authenticate, isMerchant, globalSearch);

export default router;
