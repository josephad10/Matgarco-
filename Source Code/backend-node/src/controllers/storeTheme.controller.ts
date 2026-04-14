import { Response } from 'express';
import { AuthRequest } from '../types';
import StoreTheme from '../models/StoreTheme';
import Theme from '../models/Theme';
import { AppError } from '../middleware/error.middleware';

/**
 * @desc    Get merchant's active theme
 * @route   GET /api/store-themes/my-active
 * @access  Private (Merchant)
 */
export const getMyActiveTheme = async (req: AuthRequest, res: Response) => {
  const merchantId = req.user!.merchantId;
  let activeTheme = await StoreTheme.findOne({ merchantId, isActive: true }).populate('themeId', 'name slug');
  
  if (!activeTheme) {
    // If no active theme, find default 'dawn' theme and install it
    const defaultTheme = await Theme.findOne({ slug: 'dawn' }) || await Theme.findOne();
    if (defaultTheme) {
      activeTheme = await StoreTheme.create({
        merchantId,
        themeId: defaultTheme._id,
        name: `Custom ${defaultTheme.name}`,
        isActive: true,
        globalSettings: defaultTheme.globalSettings,
        pages: defaultTheme.pages
      });
      activeTheme = await activeTheme.populate('themeId', 'name slug');
    }
  }

  res.status(200).json({ success: true, data: activeTheme });
};

/**
 * @desc    Update merchant's active theme (save changes from builder)
 * @route   PUT /api/store-themes/my-active
 * @access  Private (Merchant)
 */
export const updateActiveTheme = async (req: AuthRequest, res: Response) => {
  const merchantId = req.user!.merchantId;
  const { globalSettings, pages } = req.body;

  const activeTheme = await StoreTheme.findOneAndUpdate(
    { merchantId, isActive: true },
    { globalSettings, pages },
    { new: true, runValidators: true }
  );

  if (!activeTheme) {
    throw new AppError('لا يوجد قالب نشط للتعديل عليه', 404);
  }

  res.status(200).json({ success: true, data: activeTheme, message: 'تم حفظ التعديلات بنجاح' });
};

/**
 * @desc    Install a new base Theme for the merchant
 * @route   POST /api/store-themes/install/:themeId
 * @access  Private (Merchant)
 */
export const installTheme = async (req: AuthRequest, res: Response) => {
  const merchantId = req.user!.merchantId;
  const baseTheme = await Theme.findById(req.params.themeId);
  if (!baseTheme) throw new AppError('القالب غير موجود', 404);

  // Mark all existing as inactive
  await StoreTheme.updateMany({ merchantId }, { isActive: false });

  const newStoreTheme = await StoreTheme.create({
    merchantId,
    themeId: baseTheme._id,
    name: `Custom ${baseTheme.name}`,
    isActive: true,
    globalSettings: baseTheme.globalSettings,
    pages: baseTheme.pages
  });

  res.status(201).json({ success: true, data: newStoreTheme, message: 'تم تثبيت القالب بنجاح وتفعيله' });
};
