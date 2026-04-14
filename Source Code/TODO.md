# Matgarco - Development TODO

**Last Updated:** 17 مارس 2026  
**Current Phase:** Phase 3 Complete (80%) → Phase 4 Payment Next

---

## ✅ Phase 0: Project Setup (COMPLETED ✓)

- [x] Create project documentation
- [x] Setup project structure (7 projects)
- [x] Initialize all folders
- [x] Install all npm dependencies
- [x] Create .env files + .gitignore

---

## ✅ Phase 1: Backend API (100% COMPLETE ✓)

### Endpoints Summary: ~55+ endpoints across 11 controllers

- [x] Auth (8): register, login, refresh, logout, me, verify-email, forgot/reset password
- [x] Merchant (10): CRUD + stats + subdomain check + onboarding + suspend/activate
- [x] Product (8): CRUD + duplicate + featured + slug + search
- [x] Order (7): create (checkout) + list + details + status + payment + cancel + tracking
- [x] Customer (4): list + details + update + orders
- [x] Upload (2): single + multiple image (Multer + Cloudinary)
- [x] Theme (7): get + save draft + publish + reset + apply template + storefront published/preview
- [x] Staff (5): list + create + update + delete + reset password (RBAC)
- [x] Notification (4): list + mark read + mark all read + delete
- [x] Search (1): global search
- [x] Storefront (3): products + product by slug + categories (public)

### Models: 7

- [x] User (auth, roles, OAuth)
- [x] Merchant (subscription, limits, stats, subdomain)
- [x] Product (variants, SEO, images, inventory)
- [x] Order (timeline, commission, shipping, payment)
- [x] Customer (addresses, stats)
- [x] ThemeSettings (draft/published, colors, fonts, sections)
- [x] Notification (in-app notifications)

### Middleware:

- [x] JWT auth + authorize() + checkPermission() (RBAC)
- [x] Tenant isolation middleware
- [x] File upload (Multer + Cloudinary)
- [x] Zod validation
- [x] Error handling + AppError
- [x] CORS + Helmet

### Pending (not critical):
- [ ] Email service (Nodemailer) — needs actual email config
- [ ] Email templates (HTML, Arabic RTL)

---

## ✅ Phase 2: Merchant Dashboard (100% COMPLETE ✓)

- [x] Auth: Login + Register (2 steps) + Auto-login + Protected routes
- [x] Onboarding Wizard (5 steps: StoreInfo → Template → Colors → Social → Done)
- [x] Layout: Sidebar (RTL) + Mobile menu + Top bar + SearchBar + NotificationBell + Logo
- [x] Overview: Stats cards + Revenue chart + Orders chart + Recent orders
- [x] Products: List (grid+list) + Add + Edit + View + ImageUpload + Carousel
- [x] Orders: List + Details (progress bar, items, pricing, tracking, timeline, modals)
- [x] Customers: List + Details + Order history
- [x] Store Design: 7 panels (StoreInfo, Template, Colors, Typography, Sections, SEO, Social)
- [x] Reports: Full analytics page
- [x] Settings: شاملة (متجر، لوجو، ألوان، تواصل)
- [x] Staff: Management + RBAC permissions
- [x] Notifications: Bell + Panel

---

## 🟡 Phase 3: Customer Storefront (80% — Core Complete)

### ✅ Done:
- [x] Next.js 14 project setup
- [x] Subdomain middleware (subdomain + path-based routing)
- [x] Theme engine (CSS variables, Google Fonts)
- [x] CartProvider (Context + useReducer + localStorage)
- [x] 6 Templates (Spark, Volt, Épure, Bloom, Noir, Mosaic)
- [x] Homepage (`/store/[subdomain]`) — dynamic template loading
- [x] Products page (`/store/[subdomain]/products`) — search, sort, pagination
- [x] Product detail (`/store/[subdomain]/products/[slug]`) — images, add to cart
- [x] Cart page (`/store/[subdomain]/cart`) — items, quantities, totals
- [x] Checkout page (`/store/[subdomain]/checkout`) — customer info + shipping + COD
- [x] Order confirmation (`/store/[subdomain]/orders/[id]`) — success + order details
- [x] API client functions (theme, products, merchant)
- [x] Preview mode support

### ❌ Remaining:
- [ ] اختبار Checkout → Order flow كامل
- [ ] Mobile optimization
- [ ] About page
- [ ] Product reviews display (when backend ready)
- [ ] Wishlist (future)

---

## ❌ Phase 4: Payment Integration (0%)

### نموذج طبقي (Tiered):
- Free/Starter → Matgarco Paymob account (تلقائي، بدون إعداد)
- Professional → Matgarco أو حساب Paymob خاص (API Key)
- Business → أي منصة دفع + ربط كامل

### TODO:
- [ ] إنشاء حساب Paymob للمنصة
- [ ] Backend: `paymentConfig` في Merchant model
- [ ] Backend: `getPaymentConfig()` — routing حسب الخطة
- [ ] Backend: Paymob API integration (create intention, webhooks)
- [ ] Backend: Webhook endpoint لتأكيد الدفع
- [ ] Storefront: خيارات الدفع في checkout (COD ✅ + Card + Wallet + Fawry)
- [ ] Dashboard (Prof+): حقل "ربط حساب Paymob" + Test Connection

---

## ❌ Phase 5: Shipping Integration (0%)

### نموذج طبقي:
- Free/Starter → يدوي (tracking number) أو Matgarco Bosta
- Professional → Matgarco أو حساب Bosta خاص
- Business → أي شركة شحن

### TODO:
- [ ] Phase 5a: يدوي (tracking number فقط) — **جزئياً جاهز**
- [ ] Phase 5b: Bosta API integration (حساب مركزي)
- [ ] Phase 5c: ربط حساب خاص (Professional+)
- [ ] Dashboard: إعدادات الشحن

---

## ❌ Phase 6: Subscription Management (0%)

- [ ] Backend: Subscription model + plan enforcement
- [ ] Backend: Upgrade/Downgrade/Cancel endpoints
- [ ] Dashboard: صفحة الاشتراك + Invoices
- [ ] Integration مع Paymob لدفع الاشتراكات

---

## ❌ Phase 7: Landing Page (0%)

- [ ] Homepage (Hero, Features, Testimonials, CTA)
- [ ] Pricing page (مقارنة الخطط)
- [ ] Features + About + Contact pages
- [ ] Responsive + Animations + SEO

---

## ❌ Phase 8: AI Features (0%)

- [ ] FastAPI + Ollama setup
- [ ] Product description generator + SEO optimizer
- [ ] Backend: AI proxy + credit system
- [ ] Dashboard: AI tools in product form

---

## ❌ Phase 9: Super Admin Dashboard (0%)

- [ ] React SPA + Admin auth
- [ ] Dashboard (KPIs, revenue)
- [ ] Merchants management + Subscriptions overview

---

## ❌ Phase 10: Email & Notifications (0%)

- [ ] Nodemailer / SendGrid setup
- [ ] Order confirmation + Password reset emails
- [ ] Arabic RTL email templates
- [ ] Backend notification system — **جاهز** ✅

---

## ❌ Phase 11: Advanced Features (Future)

- [ ] Product reviews system
- [ ] Discount / coupon system
- [ ] Wishlist
- [ ] Advanced inventory management
- [ ] Multi-language (AR/EN)
- [ ] SMS notifications

---

## ❌ Phase 12: Testing & Deployment

- [ ] Unit tests + Integration tests + E2E
- [ ] Domain + DNS + MongoDB Atlas + SSL
- [ ] Deploy backend (Railway) + frontend (Vercel)
- [ ] Wildcard subdomain + Sentry + Monitoring

---

## 📝 Dev Notes

```bash
# Backend (Port 5000)
cd backend-node && npm run dev

# Dashboard (Port 3002)
cd dashboard-react && npx vite --port 3002

# Storefront (Port 3001)
cd storefront-next && npx next dev -p 3001
```

**Demo:** demo@matgarco.com / Demo1234

---

**Keep pushing! 🚀**
