import { Response, NextFunction } from 'express';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../types';
import { uploadImage, uploadMultipleImages } from '../config/cloudinary';

/**
 * Upload single image
 * POST /api/upload/single
 */
export const uploadSingleImage = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const merchantId = req.user?.merchantId;

    if (!merchantId) {
      throw new AppError('Merchant context is required', 400);
    }

    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    // Upload to Cloudinary in merchant-specific folder
    const folder = `matgarco/${merchantId}`;
    const result = await uploadImage(req.file, folder);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  }
);

/**
 * Upload multiple images
 * POST /api/upload/multiple
 */
export const uploadMultipleImagesController = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const merchantId = req.user?.merchantId;

    if (!merchantId) {
      throw new AppError('Merchant context is required', 400);
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    // Upload to Cloudinary in merchant-specific folder
    const folder = `matgarco/${merchantId}`;
    const results = await uploadMultipleImages(req.files, folder);

    res.status(200).json({
      success: true,
      message: `${results.length} images uploaded successfully`,
      data: {
        images: results,
      },
    });
  }
);
