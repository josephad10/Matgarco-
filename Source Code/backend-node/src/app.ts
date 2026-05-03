import express, { Application } from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import merchantRoutes from './routes/merchant.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import customerRoutes from './routes/customer.routes';
import uploadRoutes from './routes/upload.routes';
import staffRoutes from './routes/staff.routes';
import notificationRoutes from './routes/notification.routes';
import searchRoutes from './routes/search.routes';
import themeRoutes from './routes/theme.routes';
import storefrontRoutes from './routes/storefront.routes';
import superAdminRoutes from './routes/superAdmin.routes';
import subscriptionRoutes from './routes/subscription.routes';
import paymentRoutes from './routes/payment.routes';
import payoutRoutes from './routes/payout.routes';
import storeThemeRoutes from './routes/storeTheme.routes';
import publicThemesRoutes from './routes/publicThemes.routes';
import publicRoutes from './routes/public.routes';
import contactRoutes from './routes/contact.routes';

const app: Application = express();

// -----------------------------------------------------------------------
// CRITICAL: Reverse Proxy Trust Configuration
//
// `trust proxy: 1` instructs Express to trust exactly ONE hop of proxy
// headers (X-Forwarded-For). This is required when running behind:
//   - Cloudflare (production CDN)
//   - Vercel Edge Network
//   - Railway / Render internal load balancers
//
// Without this setting, `req.ip` resolves to the internal proxy IP
// (e.g., 10.0.0.1), causing ALL clients to share a single rate-limit
// bucket — effectively breaking the apiLimiter for the entire platform.
//
// Security caveat: Setting this to `true` (trust all proxies) is unsafe.
// Using `1` (trust exactly one hop) is the correct production posture.
// -----------------------------------------------------------------------
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.STOREFRONT_URL || 'http://localhost:3001',
    process.env.DASHBOARD_URL || 'http://localhost:3002',
    process.env.ADMIN_URL || 'http://localhost:3003',
    'http://localhost:5173', // Super Admin Vite default
  ],
  credentials: true,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Matgarco API v1.0',
    version: '1.0.0',
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/merchants', merchantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/storefront', storefrontRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/store-themes', storeThemeRoutes);
app.use('/api/themes', publicThemesRoutes);

// Public unauthenticated routes — mounted last among route declarations
// to signal explicitly that no auth middleware is applied to this prefix.
app.use('/api/public', publicRoutes);

// Contact form route — self-contained CORS, JSON parsing, and rate limiting
app.use('/api/contact', contactRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
