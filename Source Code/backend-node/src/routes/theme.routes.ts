import { Router } from 'express';
import {
  getTheme,
  saveDraft,
  publishTheme,
  resetDraft,
  applyTemplate,
  getPublishedTheme,
  getPreviewTheme,
} from '../controllers/theme.controller';
import { authenticate, isMerchant } from '../middleware/auth.middleware';

const router = Router();

// ── Public (storefront reads) ─────────────────────────────────────────────────
router.get('/storefront/:subdomain', getPublishedTheme);
router.get('/storefront/:subdomain/preview', getPreviewTheme);

// ── Protected (dashboard) ─────────────────────────────────────────────────────
router.use(authenticate, isMerchant);

router.get('/', getTheme);
router.patch('/draft', saveDraft);
router.post('/publish', publishTheme);
router.post('/reset-draft', resetDraft);
router.post('/apply-template', applyTemplate);

export default router;
