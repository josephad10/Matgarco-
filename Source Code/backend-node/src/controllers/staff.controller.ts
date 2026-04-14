import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import User from '../models/User';
import { AppError } from '../middleware/error.middleware';

// ─── Helper: normalise permissions to a plain object ─────────────────────────
const mapToObj = (map: unknown): Record<string, boolean> => {
  if (map && typeof map === 'object' && !(map instanceof Map)) {
    return { ...(map as Record<string, boolean>) };
  }
  return {};
};

// ─── GET /api/staff ────────────────────────────────────────────────────────────
export const getStaff = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = req.user!.merchantId;

    const staff = await User.find({
      merchantId,
      role: 'merchant_staff',
    })
      .select('-password -refreshToken')
      .lean();

    const result = staff.map((u) => ({
      ...u,
      permissions: mapToObj(u.permissions),
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/staff ───────────────────────────────────────────────────────────
export const createStaff = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = req.user!.merchantId;
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      staffRole,
      staffRoleLabel,
      permissions,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      throw new AppError('الاسم والبريد الإلكتروني وكلمة المرور مطلوبة', 400);
    }

    // Check email uniqueness
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      throw new AppError('البريد الإلكتروني مستخدم بالفعل', 409);
    }

    // Build permissions as a plain object
    const permissionsMap: Record<string, boolean> = {};
    if (permissions && typeof permissions === 'object') {
      Object.entries(permissions).forEach(([k, v]) => {
        permissionsMap[k] = Boolean(v);
      });
    }

    const newStaff = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim(),
      role: 'merchant_staff',
      staffRole: staffRole || 'staff',
      staffRoleLabel: staffRoleLabel || '',
      permissions: permissionsMap,
      merchantId,
      isEmailVerified: true, // Owner-created accounts are pre-verified
    });

    const { password: _p, refreshToken: _r, ...staffData } = newStaff.toObject();

    res.status(201).json({
      success: true,
      message: 'تم إضافة الموظف بنجاح',
      data: { ...staffData, permissions: mapToObj(newStaff.permissions as unknown) },
    });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/staff/:id ──────────────────────────────────────────────────────
export const updateStaff = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = req.user!.merchantId;
    const { id } = req.params;
    const {
      firstName,
      lastName,
      phone,
      staffRole,
      staffRoleLabel,
      permissions,
      isActive,
    } = req.body;

    const staff = await User.findOne({ _id: id, merchantId, role: 'merchant_staff' });
    if (!staff) {
      throw new AppError('الموظف غير موجود', 404);
    }

    if (firstName !== undefined) staff.firstName = firstName.trim();
    if (lastName !== undefined) staff.lastName = lastName.trim();
    if (phone !== undefined) staff.phone = phone?.trim();
    if (staffRole !== undefined) staff.staffRole = staffRole;
    if (staffRoleLabel !== undefined) staff.staffRoleLabel = staffRoleLabel;
    if (isActive !== undefined) staff.isActive = Boolean(isActive);

    // Update permissions as a plain object
    if (permissions && typeof permissions === 'object') {
      const permObj: Record<string, boolean> = {};
      Object.entries(permissions).forEach(([k, v]) => { permObj[k] = Boolean(v); });
      (staff as any).permissions = permObj;
    }

    await staff.save();

    const { password: _p, refreshToken: _r, ...staffData } = staff.toObject();

    res.json({
      success: true,
      message: 'تم تحديث بيانات الموظف بنجاح',
      data: { ...staffData, permissions: mapToObj(staff.permissions as unknown) },
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/staff/:id ─────────────────────────────────────────────────────
export const deleteStaff = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = req.user!.merchantId;
    const { id } = req.params;

    const staff = await User.findOneAndDelete({ _id: id, merchantId, role: 'merchant_staff' });
    if (!staff) {
      throw new AppError('الموظف غير موجود', 404);
    }

    res.json({ success: true, message: 'تم حذف الموظف بنجاح' });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/staff/:id/reset-password ───────────────────────────────────────
export const resetStaffPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const merchantId = req.user!.merchantId;
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      throw new AppError('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 400);
    }

    const staff = await User.findOne({ _id: id, merchantId, role: 'merchant_staff' });
    if (!staff) {
      throw new AppError('الموظف غير موجود', 404);
    }

    staff.password = newPassword; // pre-save hook will hash it
    await staff.save();

    res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    next(error);
  }
};
