/**
 * Public Theme Browse — allows merchants to list available themes
 * No auth required for browsing; installing requires merchant auth.
 */
import { Router, Request, Response } from 'express';
import Theme from '../models/Theme';

const router = Router();

/**
 * GET /api/themes/browse — List all active themes (public)
 */
router.get('/browse', async (req: Request, res: Response) => {
  const { category } = req.query;
  
  const filter: any = { status: 'active' };
  if (category && category !== 'all') {
    filter.category = category;
  }

  const themes = await Theme.find(filter)
    .select('name slug description category isPremium allowedPlans globalSettings thumbnail screenshots version')
    .sort({ isPremium: 1, name: 1 })
    .lean();

  res.json({ success: true, data: themes });
});

export default router;
