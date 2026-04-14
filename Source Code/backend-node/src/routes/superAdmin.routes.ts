import { Router } from 'express';
import { 
  getDashboardKPIs, 
  getDashboardCharts,
  getMerchants, 
  getMerchantDetails, 
  toggleMerchantStatus,
  notifyMerchant,
  changeMerchantPlan,
  getAdvancedFinanceReports,
  getThemes,
  getTheme,
  createTheme,
  updateThemeStatus,
  updateThemePlans,
  updateThemeDetails,
  releaseThemeVersion,
  getThemeMerchants,
  deleteTheme,
  impersonateMerchant,
  listPlans,
  updatePlan
} from '../controllers/superAdmin.controller';
import {
  getPlatformSettings,
  updatePlatformSettings,
  listAllTickets,
  getTicket,
  replyToTicket,
  updateTicketStatus,
  assignTicket,
  createAnnouncement,
  listAnnouncements,
  deleteAnnouncement,
  listAdminStaff,
  createAdminStaff,
  updateStaffRole,
  removeStaff
} from '../controllers/settings.controller';
import { getAllSubscriptions } from '../controllers/subscription.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Protect all super admin routes
router.use(authenticate, authorize('super_admin'));

// KPIs & Analytics
router.get('/kpis', getDashboardKPIs);
router.get('/dashboard/charts', getDashboardCharts);
router.get('/finance/advanced', getAdvancedFinanceReports);

// Merchants Management
router.get('/merchants', getMerchants);
router.get('/merchants/:id', getMerchantDetails);
router.put('/merchants/:id/status', toggleMerchantStatus);
router.post('/merchants/:id/notify', notifyMerchant);
router.patch('/merchants/:id/plan', changeMerchantPlan);
router.post('/impersonate/:merchantId', impersonateMerchant);

// Themes Management
router.get('/themes', getThemes);
router.get('/themes/:id', getTheme);
router.post('/themes', createTheme);
router.patch('/themes/:id', updateThemeDetails);
router.patch('/themes/:id/status', updateThemeStatus);
router.patch('/themes/:id/plans', updateThemePlans);
router.post('/themes/:id/version', releaseThemeVersion);
router.get('/themes/:id/merchants', getThemeMerchants);
router.delete('/themes/:id', deleteTheme);

// Platform Settings
router.get('/settings', getPlatformSettings);
router.patch('/settings', updatePlatformSettings);

// Tickets / Support
router.get('/tickets', listAllTickets);
router.get('/tickets/:id', getTicket);
router.post('/tickets/:id/reply', replyToTicket);
router.patch('/tickets/:id/status', updateTicketStatus);
router.patch('/tickets/:id/assign', assignTicket);

// Announcements
router.post('/announcements', createAnnouncement);
router.get('/announcements', listAnnouncements);
router.delete('/announcements/:id', deleteAnnouncement);

// Admin Staff
router.get('/staff', listAdminStaff);
router.post('/staff', createAdminStaff);
router.patch('/staff/:id', updateStaffRole);
router.delete('/staff/:id', removeStaff);

// Subscriptions overview
router.get('/subscriptions/all', getAllSubscriptions);

// Subscription Plans (Pricing, Limits)
router.get('/plans', listPlans);
router.patch('/plans/:slug', updatePlan);

export default router;
