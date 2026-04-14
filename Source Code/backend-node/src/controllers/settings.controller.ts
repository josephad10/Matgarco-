import { Response } from 'express';
import { AuthRequest } from '../types';
import PlatformSettings from '../models/PlatformSettings';
import Ticket from '../models/Ticket';
import Announcement from '../models/Announcement';
import User from '../models/User';
import { AppError } from '../middleware/error.middleware';

// ─── Platform Settings ──────────────────────────────────────────────
export const getPlatformSettings = async (_req: AuthRequest, res: Response) => {
  let settings = await PlatformSettings.findById('platform_settings');
  if (!settings) {
    settings = await PlatformSettings.create({ _id: 'platform_settings' });
  }
  res.status(200).json({ success: true, data: settings });
};

export const updatePlatformSettings = async (req: AuthRequest, res: Response) => {
  const settings = await PlatformSettings.findByIdAndUpdate(
    'platform_settings',
    { $set: req.body },
    { new: true, upsert: true, runValidators: true }
  );
  res.status(200).json({ success: true, data: settings });
};

// ─── Tickets ────────────────────────────────────────────────────────
export const listAllTickets = async (req: AuthRequest, res: Response) => {
  const { status, category, priority } = req.query;
  const q: any = {};
  if (status && status !== 'all') q.status = status;
  if (category && category !== 'all') q.category = category;
  if (priority && priority !== 'all') q.priority = priority;

  const tickets = await Ticket.find(q)
    .populate('merchantId', 'storeName subdomain')
    .populate('assignedTo', 'firstName lastName')
    .sort({ updatedAt: -1 });

  const stats = {
    open: await Ticket.countDocuments({ status: 'open' }),
    in_progress: await Ticket.countDocuments({ status: 'in_progress' }),
    resolved: await Ticket.countDocuments({ status: 'resolved' }),
    closed: await Ticket.countDocuments({ status: 'closed' })
  };

  res.status(200).json({ success: true, data: tickets, stats });
};

export const getTicket = async (req: AuthRequest, res: Response) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('merchantId', 'storeName subdomain')
    .populate('assignedTo', 'firstName lastName');
  if (!ticket) throw new AppError('Ticket not found', 404);
  res.status(200).json({ success: true, data: ticket });
};

export const replyToTicket = async (req: AuthRequest, res: Response) => {
  const { content } = req.body;
  if (!content) throw new AppError('content is required', 400);

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) throw new AppError('Ticket not found', 404);

  const user = req.user as any;
  ticket.messages.push({
    senderId: user.id,
    senderRole: 'admin',
    senderName: `${user.firstName || 'Admin'} ${user.lastName || ''}`.trim(),
    content,
    createdAt: new Date()
  });

  if (ticket.status === 'open') ticket.status = 'in_progress';
  await ticket.save();

  res.status(200).json({ success: true, data: ticket });
};

export const updateTicketStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
  if (!validStatuses.includes(status)) throw new AppError('Invalid status', 400);

  const update: any = { status };
  if (status === 'resolved') update.resolvedAt = new Date();

  const ticket = await Ticket.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!ticket) throw new AppError('Ticket not found', 404);

  res.status(200).json({ success: true, data: ticket });
};

export const assignTicket = async (req: AuthRequest, res: Response) => {
  const { staffId } = req.body;
  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id,
    { assignedTo: staffId, status: 'in_progress' },
    { new: true }
  ).populate('assignedTo', 'firstName lastName');

  if (!ticket) throw new AppError('Ticket not found', 404);
  res.status(200).json({ success: true, data: ticket });
};

// ─── Announcements ──────────────────────────────────────────────────
export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  const user = req.user as any;
  const announcement = await Announcement.create({
    ...req.body,
    createdBy: user.id
  });
  res.status(201).json({ success: true, data: announcement });
};

export const listAnnouncements = async (_req: AuthRequest, res: Response) => {
  const announcements = await Announcement.find()
    .populate('createdBy', 'firstName lastName')
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: announcements });
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  const result = await Announcement.findByIdAndDelete(req.params.id);
  if (!result) throw new AppError('Announcement not found', 404);
  res.status(200).json({ success: true, message: 'تم حذف التعميم' });
};

// ─── Admin Staff ────────────────────────────────────────────────────
export const listAdminStaff = async (_req: AuthRequest, res: Response) => {
  const staff = await User.find({
    role: 'super_admin'
  }).select('firstName lastName email adminRole lastLogin createdAt');
  res.status(200).json({ success: true, data: staff });
};

export const createAdminStaff = async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, email, password, adminRole } = req.body;
  const validRoles = ['super_admin', 'finance_manager', 'support_agent', 'theme_developer'];
  if (!validRoles.includes(adminRole)) throw new AppError('Invalid admin role', 400);

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('البريد الإلكتروني مستخدم بالفعل', 400);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: 'super_admin',
    adminRole
  });

  res.status(201).json({ success: true, data: { _id: user._id, firstName, lastName, email, adminRole } });
};

export const updateStaffRole = async (req: AuthRequest, res: Response) => {
  const { adminRole } = req.body;
  const validRoles = ['super_admin', 'finance_manager', 'support_agent', 'theme_developer'];
  if (!validRoles.includes(adminRole)) throw new AppError('Invalid admin role', 400);

  const user = await User.findByIdAndUpdate(req.params.id, { adminRole }, { new: true })
    .select('firstName lastName email adminRole');
  if (!user) throw new AppError('User not found', 404);

  res.status(200).json({ success: true, data: user });
};

export const removeStaff = async (req: AuthRequest, res: Response) => {
  const currentUser = req.user as any;
  if (req.params.id === currentUser.id) throw new AppError('لا يمكنك حذف نفسك!', 400);

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new AppError('User not found', 404);

  res.status(200).json({ success: true, message: 'تم حذف الموظف' });
};
