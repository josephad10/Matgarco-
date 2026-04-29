import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Merchant, { IMerchant } from '../models/Merchant';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/jwt.service';
import { generateToken } from '../utils/helpers';
import { AuthRequest } from '../types';
import { sendWelcomeEmail } from '../services/email.service';

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = asyncHandler(
  async (req: Request, res: Response, __next: NextFunction) => {
    const { email, password, firstName, lastName, phone } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }
    
    // Create verification token
    const verificationToken = generateToken();
    
    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: 'merchant_owner', // Default role for registration
      verificationToken,
    });
    
    // Generate JWT tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    
    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    
    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();
    
    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    // Send verification email
    await sendWelcomeEmail(user.email, user.firstName);
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
      },
    });
  }
);

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(
  async (req: Request, res: Response, __next: NextFunction) => {
    const { email, password } = req.body;
    
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is disabled', 403);
    }
    
    // Generate tokens
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      merchantId: user.merchantId?.toString(),
    };
    
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    // Save refresh token
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();
    
    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    // Fetch merchant to check onboarding status + subdomain
    let onboardingCompleted = true;
    let subdomain = '';
    if (user.merchantId) {
      const merchant = await Merchant.findById(user.merchantId).select('onboardingCompleted subdomain').lean<IMerchant>();
      onboardingCompleted = merchant?.onboardingCompleted ?? true;
      subdomain = merchant?.subdomain || '';
    } else {
      // User has no merchant → they need to complete onboarding
      onboardingCompleted = false;
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          merchantId: user.merchantId,
          subdomain,
          avatar: user.avatar,
          emailVerified: user.emailVerified,
          onboardingCompleted,
          staffRole: user.staffRole,
          staffRoleLabel: user.staffRoleLabel,
          permissions: user.permissions ?? {},
        },
      },
    });
  }
);

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response, __next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      throw new AppError('Refresh token not found', 401);
    }
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Find user and check if refresh token matches
    const user = await User.findById(decoded.userId);
    
    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }
    
    // Generate new access token
    const payload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      merchantId: user.merchantId?.toString(),
    };
    
    const accessToken = generateAccessToken(payload);
    
    res.status(200).json({
      success: true,
      data: {
        accessToken,
      },
    });
  }
);

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = asyncHandler(
  async (req: AuthRequest, res: Response, __next: NextFunction) => {
    if (req.user) {
      // Clear refresh token from database
      await User.findByIdAndUpdate(req.user.userId, {
        refreshToken: undefined,
      });
    }
    
    // Clear cookie
    res.clearCookie('refreshToken');
    
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }
);

/**
 * Get current user
 * GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(
  async (req: AuthRequest, res: Response, __next: NextFunction) => {
    const user = await User.findById(req.user?.userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }
    
    // Fetch subdomain from merchant
    let subdomain = '';
    if (user.merchantId) {
      const merchant = await Merchant.findById(user.merchantId).select('subdomain').lean<IMerchant>();
      subdomain = merchant?.subdomain || '';
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        merchantId: user.merchantId,
        subdomain,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin,
        staffRole: user.staffRole,
        staffRoleLabel: user.staffRoleLabel,
        permissions: user.permissions ?? {},
      },
    });
  }
);

/**
 * Verify email
 * POST /api/auth/verify-email
 */
export const verifyEmail = asyncHandler(
  async (req: Request, res: Response, __next: NextFunction) => {
    const { token } = req.body;
    
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }
    
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  }
);

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, __next: NextFunction) => {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if email exists
      res.status(200).json({
        success: true,
        message: 'If an account exists, a password reset email has been sent.',
      });
      return;
    }
    
    // Generate reset token
    const resetToken = generateToken();
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();
    
    // TODO: Send reset email
    
    res.status(200).json({
      success: true,
      message: 'If an account exists, a password reset email has been sent.',
    });
  }
);

/**
 * Update profile
 * PATCH /api/auth/me
 */
export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response, __next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Not authenticated', 401);

    const { firstName, lastName, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    );

    if (!user) throw new AppError('User not found', 404);

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          merchantId: user.merchantId,
        },
      },
    });
  }
);

/**
 * Change password
 * POST /api/auth/change-password
 */
export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response, __next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Not authenticated', 401);

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new AppError('Current and new password are required', 400);
    }
    if (newPassword.length < 8) {
      throw new AppError('New password must be at least 8 characters', 400);
    }

    const user = await User.findById(userId).select('+password');
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new AppError('كلمة المرور الحالية غير صحيحة', 400);

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  }
);

/**
 * Reset password
 * POST /api/auth/reset-password
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, __next: NextFunction) => {
    const { token, newPassword } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    
    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }
    
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  }
);

