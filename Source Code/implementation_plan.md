# خطة التطوير الشاملة لمنصة Matgarco SaaS 🚀
# Matgarco Enterprise Development Plan

> **الهدف:** تحويل Matgarco من منصة MVP إلى SaaS بمستوى Shopify/Salla — جاهزة للإطلاق التجاري
> **المتطلبات:** التوثيق الموجود في [PROJECT_DOCUMENTATION.md](file:///f:/PROGRAMMING/matgarcoo/matgarco/PROJECT_DOCUMENTATION.md) + رؤية المستخدم الموسّعة

---

## 📊 تحليل الحالة الحالية (Current State Audit)

### ✅ ما تم إنجازه بالفعل
| Sub-Project | Status | Key Features |
|---|---|---|
| **backend-node** | ~65% | Auth, Products, Orders, Customers, ThemeSettings, Staff, Notifications, Search, Storefront APIs, Super Admin basic KPIs/Merchants/Themes |
| **dashboard-react** | ~80% | Auth, Dashboard, Products CRUD, Orders, Customers, Reports, Store Design (7 panels), Staff, Notifications, Search, Onboarding |
| **storefront-next** | ~75% | 6 Templates (Spark/Volt/Épure/Bloom/Noir/Mosaic), Products, Cart, Checkout (COD), Theme Engine, Preview Mode |
| **landing-next** | ~90% | Home, Pricing, Solutions, Resources, About — AR/EN i18n |
| **super-admin-react** | ~40% | Login, Overview KPIs, Merchants List/Details, Subscriptions, ThemesList, GlobalSettings |

### ❌ ما هو مفقود (Critical Gaps)

| Missing Feature | Impact | Priority |
|---|---|---|
| **Subscription Model + Billing** | لا يوجد نظام دفع اشتراكات حقيقي (Paymob) | 🔴 Critical |
| **Payment Integration (Storefront)** | Checkout فقط COD — لا كروت ولا محافظ | 🔴 Critical |
| **Financial Reports (Super Admin)** | لا Churn/LTV/Commission reports | 🟡 High |
| **Template Architecture (True Themes)** | القوالب الـ6 = نفس الكود بألوان مختلفة فقط | 🔴 Critical |
| **Subscription Routes** | لا يوجد backend endpoints للاشتراكات | 🔴 Critical |
| **Review System** | لا Model ولا UI (Storefront + Dashboard) | 🟡 High |
| **Analytics Model/Aggregation** | لا daily analytics collection | 🟡 High |
| **AI Service (FastAPI + Ollama)** | لا يوجد أي AI service | 🟠 Medium |
| **Discount/Coupon System** | لا يوجد | 🟡 High |
| **Shipping Integration (Bosta)** | لا يوجد | 🟠 Medium |
| **Support Ticket System** | لا يوجد | 🟠 Medium |
| **Affiliate/Referral System** | لا يوجد | 🟢 Low |
| **Super Admin Roles (Finance/Support)** | دور واحد فقط (super_admin) | 🟢 Low |
| **Email Service (Transactional)** | لا يوجد إرسال إيميلات حقيقي | 🟡 High |
| **PWA / Order Tracking (Storefront)** | لا يوجد | 🟠 Medium |

---

## 🗺️ خطة التنفيذ (16 مرحلة)

> [!IMPORTANT]
> المراحل مرتبة حسب الأولوية والتبعيات. مرحلة القوالب (Phase 14-16) في النهاية لأنها تحتاج تركيز كامل 100%.

---

## المرحلة 1: نظام الاشتراكات والفواتير 💳
**المدة المقدرة:** 3-4 جلسات عمل
**الأولوية:** 🔴 حرجة

### Backend

#### [NEW] `Subscription.ts` model
- إنشاء Mongoose model كامل حسب المواصفات في [PROJECT_DOCUMENTATION.md](file:///f:/PROGRAMMING/matgarcoo/matgarco/PROJECT_DOCUMENTATION.md) (Section 4.6)
- Fields: `merchantId`, `plan`, `billingCycle`, `amount`, `currency`, `startDate`, `endDate`, `status`, `autoRenew`, `paymentMethod`, `invoices[]`, `isTrialPeriod`, `trialEndsAt`, `cancelledAt`, `cancellationReason`
- Indexes: `merchantId`, `status`, `nextBillingDate`

#### [NEW] `PlatformSettings.ts` model
- مستند واحد (singleton) يحفظ إعدادات المنصة المركزية
- Fields: `paymobApiKey`, `paymobIframeId`, `smtpConfig`, `maintenanceMode`, `commissionRates`, `shippingDefaults`
- يُستخدم من Super Admin لحفظ الإعدادات فعلياً بدل الـ mock الحالي في [GlobalSettings.tsx](file:///f:/PROGRAMMING/matgarcoo/matgarco/super-admin-react/src/pages/GlobalSettings.tsx)

#### [NEW] `subscription.routes.ts`
```
GET    /api/subscriptions/plans          → listPlans (public)
GET    /api/subscriptions/my             → getMySubscription (merchant)
POST   /api/subscriptions/subscribe      → subscribeToPlan (merchant)
POST   /api/subscriptions/upgrade        → upgradePlan (merchant)
POST   /api/subscriptions/cancel         → cancelSubscription (merchant)
GET    /api/subscriptions/invoices       → listInvoices (merchant)
```

#### [NEW] `subscription.controller.ts`
- `listPlans`: يرجع الـ 4 باقات (Free Trial, Starter, Professional, Business) بالأسعار والحدود
- `subscribeToPlan`: يبدأ الاشتراك ويسجل أول invoice
- `upgradePlan`: يحسب الفرق ويعمل prorate
- `cancelSubscription`: يسجل سبب الإلغاء ويضع تاريخ الانتهاء
- `getMySubscription`: يرجع الاشتراك الحالي + الفواتير

#### [MODIFY] [Merchant.ts](file:///f:/PROGRAMMING/matgarcoo/matgarco/backend-node/src/models/Merchant.ts) model
- إضافة `paymentConfig` field:
  ```ts
  paymentConfig?: {
    paymobApiKey?: string;
    paymobHmac?: string;
    bankAccountInfo?: { bankName, accountNumber, iban }
  }
  ```

#### [MODIFY] [superAdmin.controller.ts](file:///f:/PROGRAMMING/matgarcoo/matgarco/backend-node/src/controllers/superAdmin.controller.ts)
- إضافة endpoint: `GET /api/superadmin/subscriptions/stats` (إجمالي إيرادات الاشتراكات، توزيع الخطط، الفواتير)
- إضافة endpoint: `GET /api/superadmin/finance/reports` (Churn Rate, LTV, Commission Revenue)

### Dashboard (Merchant)

#### [NEW] `SubscriptionPage.tsx`
- عرض الباقة الحالية + تاريخ التجديد
- زرار "ترقية الباقة" مع مقارنة الأسعار
- جدول الفواتير السابقة
- زرار "إلغاء الاشتراك" مع تأكيد

### Super Admin

#### [MODIFY] [Subscriptions.tsx](file:///f:/PROGRAMMING/matgarcoo/matgarco/super-admin-react/src/pages/Subscriptions.tsx)
- ربط التقارير المالية الحقيقية من الـ API الجديد
- إضافة Churn Rate card، LTV card، Commission Revenue chart
- جدول الفواتير الحقيقي (بدل الـ placeholder الحالي)

---

## المرحلة 2: بوابات الدفع (Paymob Integration) 💰
**المدة المقدرة:** 3-4 جلسات عمل
**الأولوية:** 🔴 حرجة

### Backend

#### [NEW] `services/payment.service.ts`
- `createPaymentIntention(order, merchantConfig)`: ينشئ طلب دفع في Paymob
- `getPaymentConfig(merchant)`: يحدد هل يستخدم حساب المنصة أو حساب التاجر حسب الباقة
- `calculateCommission(order, plan)`: يحسب عمولة المنصة (3% Free, 2% Starter, 0% Pro/Business)
- `handleWebhook(payload, hmac)`: يعالج callback من Paymob ويحدث حالة الطلب

#### [NEW] `routes/payment.routes.ts`
```
POST   /api/payments/create-intention    → createPaymentIntention
POST   /api/payments/webhook             → handlePaymobWebhook (public)
GET    /api/payments/methods/:subdomain  → getAvailablePaymentMethods (public)
```

#### [MODIFY] [order.controller.ts](file:///f:/PROGRAMMING/matgarcoo/matgarco/backend-node/src/controllers/order.controller.ts)
- تحديث `createOrder`: إضافة خيارات الدفع (card, wallet, fawry) بجانب COD
- إضافة `platformCommission` حساب تلقائي عند إنشاء الطلب

### Storefront

#### [MODIFY] Checkout flow
- إضافة خيارات الدفع: بطاقة ائتمان، محفظة إلكترونية، فوري
- Paymob iframe integration للدفع الآمن
- صفحة تأكيد الدفع + حالة الطلب

### Dashboard

#### [MODIFY] Settings page
- إضافة قسم "إعدادات الدفع" (Professional+)
- حقل Paymob API Key الخاص بالتاجر مع Test Connection
- عرض البيانات البنكية لاستلام التحويلات

---

## المرحلة 3: نظام التقارير المالية المتقدمة 📈
**المدة المقدرة:** 2-3 جلسات عمل
**الأولوية:** 🟡 عالية

### Backend

#### [NEW] `models/Analytics.ts`
- Mongoose model حسب المواصفات (Section 4.10)
- Daily aggregation: `totalOrders`, `totalRevenue`, `averageOrderValue`, `topProducts`, `traffic`
- Indexes: `merchantId + date` compound

#### [NEW] `services/analytics.service.ts`
- `calculateDailyAggregation(merchantId, date)`: يحسب الإحصائيات اليومية
- `getChurnRate(period)`: نسبة التجار الذين ألغوا اشتراكهم
- `calculateLTV()`: متوسط القيمة الدائمة للعميل
- `getCommissionRevenue(period)`: أرباح العمولات

#### [NEW] `routes/analytics.routes.ts`
```
GET    /api/analytics/dashboard     → dashboardOverview (merchant)
GET    /api/analytics/sales         → salesAnalytics (merchant)
GET    /api/analytics/products      → productAnalytics (merchant)
GET    /api/analytics/customers     → customerAnalytics (merchant)
GET    /api/analytics/export        → exportCSV (merchant, Business plan only)
```

### Super Admin

#### [MODIFY] [Home.tsx](file:///f:/PROGRAMMING/matgarcoo/matgarco/super-admin-react/src/pages/Home.tsx) (Dashboard)
- رسوم بيانية ديناميكية: نمو التسجيلات (يومي/أسبوعي/شهري)
- نمو الإيرادات (MRR/ARR)
- توزيع التجار على الباقات (Pie Chart)
- "النبض اليومي" — تنبيهات: "3 متاجر سجلت اليوم"، "متجر X حقق 50k"

#### [MODIFY] [Subscriptions.tsx](file:///f:/PROGRAMMING/matgarcoo/matgarco/super-admin-react/src/pages/Subscriptions.tsx)
- إضافة: Churn Rate, LTV, Commission Revenue charts
- سجل الفواتير الحقيقي مع فلترة (ناجحة/فاشلة/مستردة)
- إمكانية إصدار فاتورة ضريبية يدوية

---

## المرحلة 4: نظام الخصومات والكوبونات 🏷️
**المدة المقدرة:** 2 جلسات عمل
**الأولوية:** 🟡 عالية

### Backend

#### [NEW] `models/Coupon.ts`
```ts
{
  merchantId: ObjectId,
  code: string,          // "SAVE20"
  type: "percentage" | "fixed",
  value: number,         // 20 (%) or 50 (EGP)
  minOrderAmount?: number,
  maxUses?: number,
  usedCount: number,
  validFrom: Date,
  validUntil: Date,
  isActive: boolean,
  applicablePlans: string[]  // Professional+ only
}
```

#### [NEW] `routes/coupon.routes.ts`
```
GET     /api/coupons                → listCoupons (merchant)
POST    /api/coupons                → createCoupon (merchant)
PATCH   /api/coupons/:id            → updateCoupon (merchant)
DELETE  /api/coupons/:id            → deleteCoupon (merchant)
POST    /api/coupons/validate       → validateCoupon (public storefront)
```

#### [MODIFY] [order.controller.ts](file:///f:/PROGRAMMING/matgarcoo/matgarco/backend-node/src/controllers/order.controller.ts)
- تطبيق الكوبون عند إنشاء الطلب (حساب الخصم في `discount` field)

### Dashboard

#### [NEW] `CouponsPage.tsx`
- جدول الكوبونات + إنشاء/تعديل/حذف
- إحصائيات: عدد الاستخدامات، إجمالي الخصومات

### Storefront

#### [MODIFY] Checkout
- حقل "أدخل كود الخصم" مع validation فوري

---

## المرحلة 5: نظام المراجعات والتقييمات ⭐
**المدة المقدرة:** 2 جلسات عمل
**الأولوية:** 🟡 عالية

### Backend

#### [NEW] `models/Review.ts`
- حسب المواصفات (Section 4.9)
- Fields: `merchantId`, `productId`, `customerId`, `rating`, `title`, `comment`, `status`, `helpful`

#### [NEW] `routes/review.routes.ts`
```
GET     /api/reviews/product/:productId   → getProductReviews (public)
POST    /api/reviews/product/:productId   → createReview (customer)
PATCH   /api/reviews/:id/approve          → approveReview (merchant)
PATCH   /api/reviews/:id/reject           → rejectReview (merchant)
DELETE  /api/reviews/:id                  → deleteReview (merchant)
```

### Storefront

#### [MODIFY] Product Detail page
- عرض المراجعات + التقييم المتوسط + نجوم
- فورم إضافة مراجعة جديدة (بعد الشراء)

### Dashboard

#### [NEW] `ReviewsPage.tsx`
- قائمة المراجعات مع فلترة (pending/approved/rejected)
- أزرار: قبول / رفض / حذف

---

## المرحلة 6: نظام الشحن المتكامل 🚚
**المدة المقدرة:** 2-3 جلسات عمل
**الأولوية:** 🟠 متوسطة

### Backend

#### [NEW] `services/shipping.service.ts`
- تكامل مع Bosta API (حساب مركزي للمنصة)
- `createShipment(order)`: إنشاء شحنة
- `trackShipment(trackingNumber)`: تتبع الشحنة
- `calculateShippingCost(address, weight)`: حساب التكلفة

#### [MODIFY] [Merchant.ts](file:///f:/PROGRAMMING/matgarcoo/matgarco/backend-node/src/models/Merchant.ts)
- إضافة `shippingConfig`:
  ```ts
  shippingConfig?: {
    provider: 'manual' | 'platform_bosta' | 'own_bosta' | 'custom';
    bostaApiKey?: string;
    shippingZones?: [{ zone, cost }];
  }
  ```

### Dashboard

#### [NEW] `ShippingSettingsPage.tsx`
- إعداد مناطق الشحن والأسعار
- ربط حساب Bosta الخاص (Professional+)
- جدول الشحنات الحالية مع تتبع

### Storefront

#### [MODIFY] Checkout
- حساب تكلفة الشحن ديناميكياً حسب العنوان

---

## المرحلة 7: خدمة البريد الإلكتروني 📧
**المدة المقدرة:** 1-2 جلسات عمل
**الأولوية:** 🟡 عالية

### Backend

#### [NEW] `services/email.service.ts`
- Nodemailer + SMTP configuration
- Email templates مع تصميم branded:
  - `welcomeMerchant(merchant)`: ترحيب تاجر جديد
  - `orderConfirmation(order)`: تأكيد طلب للعميل
  - `orderStatusUpdate(order)`: تحديث حالة الطلب
  - `subscriptionInvoice(subscription)`: فاتورة اشتراك
  - `passwordReset(user, token)`: إعادة تعيين كلمة المرور
  - `trialExpiring(merchant)`: تنبيه انتهاء الفترة التجريبية
  - `paymentFailed(subscription)`: فشل الدفع

#### [MODIFY] كل Controllers المتعلقة
- [auth.controller.ts](file:///f:/PROGRAMMING/matgarcoo/matgarco/backend-node/src/controllers/auth.controller.ts): إرسال verification email حقيقي
- [order.controller.ts](file:///f:/PROGRAMMING/matgarcoo/matgarco/backend-node/src/controllers/order.controller.ts): إرسال order confirmation
- `subscription logic`: إرسال فواتير

---

## المرحلة 8: نظام التذاكر والدعم الفني 🎫
**المدة المقدرة:** 2-3 جلسات عمل
**الأولوية:** 🟠 متوسطة

### Backend

#### [NEW] `models/Ticket.ts`
```ts
{
  merchantId: ObjectId,
  subject: string,
  category: "billing" | "technical" | "shipping" | "general",
  priority: "low" | "medium" | "high" | "urgent",
  status: "open" | "in_progress" | "resolved" | "closed",
  messages: [{
    senderId: ObjectId,
    senderRole: "merchant" | "admin",
    content: string,
    attachments?: string[],
    createdAt: Date
  }],
  assignedTo?: ObjectId,
  resolvedAt?: Date
}
```

#### [NEW] `routes/ticket.routes.ts`
```
POST    /api/tickets                → createTicket (merchant)
GET     /api/tickets                → listMyTickets (merchant)
GET     /api/tickets/:id            → getTicket (merchant)
POST    /api/tickets/:id/reply      → replyToTicket (merchant/admin)
PATCH   /api/tickets/:id/status     → updateTicketStatus (admin)
GET     /api/superadmin/tickets     → listAllTickets (super_admin)
```

### Dashboard (Merchant)

#### [NEW] `SupportPage.tsx`
- قائمة التذاكر المفتوحة + إنشاء تذكرة جديدة
- محادثة (chat-like) داخل كل تذكرة

### Super Admin

#### [NEW] `SupportCenter.tsx` (بدل placeholder الحالي)
- قائمة كل التذاكر مع فلترة (open/in_progress/resolved)
- تعيين تذكرة لموظف معين
- الرد على التذاكر مباشرة

---

## المرحلة 9: نظام الإشعارات والتعميمات العالمية 📢
**المدة المقدرة:** 1-2 جلسات عمل
**الأولوية:** 🟠 متوسطة

### Backend

#### [NEW] `models/Announcement.ts`
```ts
{
  title: string,
  content: string,
  type: "info" | "warning" | "promo",
  targetPlans: string[],    // ["all"] or ["professional", "business"]
  startDate: Date,
  endDate: Date,
  isActive: boolean,
  createdBy: ObjectId
}
```

#### [NEW] أو [MODIFY] [routes/superAdmin.routes.ts](file:///f:/PROGRAMMING/matgarcoo/matgarco/backend-node/src/routes/superAdmin.routes.ts)
```
POST   /api/superadmin/announcements        → createAnnouncement
GET    /api/superadmin/announcements        → listAnnouncements
DELETE /api/superadmin/announcements/:id    → deleteAnnouncement
GET    /api/notifications/announcements     → getActiveAnnouncements (merchant)
```

### Super Admin

#### [MODIFY] [GlobalSettings.tsx](file:///f:/PROGRAMMING/matgarcoo/matgarco/super-admin-react/src/pages/GlobalSettings.tsx)
- ربط قسم التعميمات بـ API حقيقي (بدل الـ mock الحالي)
- قائمة التعميمات السابقة مع حذف

### Dashboard

#### [MODIFY] Layout
- بنر علوي (Top Banner) يعرض التعميم الحالي للتاجر
- إمكانية إغلاقه مؤقتاً

---

## المرحلة 10: تحسينات Super Admin المتقدمة 👑
**المدة المقدرة:** 2-3 جلسات عمل
**الأولوية:** 🟡 عالية

### أ. صلاحيات متعددة (Admin Roles)

#### [MODIFY] [User.ts](file:///f:/PROGRAMMING/matgarcoo/matgarco/backend-node/src/models/User.ts) model
- إضافة `adminRole` field:
  ```ts
  adminRole?: "super_admin" | "finance_manager" | "support_agent" | "theme_developer"
  ```

#### [MODIFY] Backend middleware
- [authorize()](file:///f:/PROGRAMMING/matgarcoo/matgarco/backend-node/src/middleware/auth.middleware.ts#60-76) middleware يدعم الأدوار الجديدة
- Finance Manager: يرى KPIs + Subscriptions + Reports فقط
- Support Agent: يرى Merchants + Tickets + يقدر يعمل Impersonate
- Theme Developer: يرفع قوالب جديدة فقط

### ب. Super Admin Staff Management

#### [NEW] `StaffAdminPage.tsx` (بدل placeholder الحالي)
- إضافة/حذف موظفين للإدارة العليا
- تعيين الدور (Finance/Support/Developer)
- سجل النشاطات (Activity Log)

### ج. Plans Engine (تحكم ديناميكي)

#### [NEW] Super Admin > Plans Management
- التحكم في سعر كل باقة (Free Trial, Starter, Professional, Business)
- تعديل الـ Limits (maxProducts, maxStaff, aiCredits)
- تعديل نسب العمولة (Commission Rate)
- تفعيل/إيقاف باقة معينة

---

## المرحلة 11: خدمة الذكاء الاصطناعي 🤖
**المدة المقدرة:** 3-4 جلسات عمل
**الأولوية:** 🟠 متوسطة

### AI Service (Python)

#### [NEW] مشروع `ai-python/`
- FastAPI setup + Ollama integration
- Endpoints:
  ```
  POST /api/ai/generate-description   → productDescriptionGenerator
  POST /api/ai/optimize-seo           → seoOptimizer
  POST /api/ai/suggest-categories     → categorySuggester
  ```

### Backend

#### [NEW] `models/AIUsage.ts`
- حسب المواصفات (Section 4.11)
- Credit tracking per merchant per month

#### [NEW] `services/ai.service.ts`
- HTTP client يتصل بـ FastAPI service
- Credit deduction logic
- Rate limiting per plan

#### [NEW] `routes/ai.routes.ts`
```
POST   /api/ai/generate-description  → generateDescription (merchant)
POST   /api/ai/optimize-seo          → optimizeSEO (merchant)
POST   /api/ai/suggest-categories    → suggestCategories (merchant)
GET    /api/ai/usage                 → getUsageStats (merchant)
```

### Dashboard

#### [MODIFY] Product Create/Edit page
- زرار "✨ توليد وصف بالذكاء الاصطناعي" بجانب حقل الوصف
- زرار "🔍 تحسين SEO" بجانب حقول السيو
- عداد الرصيد المتبقي (Credits remaining)

#### [NEW] `AIToolsPage.tsx` (optional)
- عرض استهلاك الرصيد + تاريخ الاستخدام
- أدوات AI إضافية (تسويق، صور)

---

## المرحلة 12: تحسينات Storefront 🛍️
**المدة المقدرة:** 2-3 جلسات عمل
**الأولوية:** 🟡 عالية

### Storefront

#### Order Tracking
- صفحة `/orders/:id/track` — تتبع الطلب بالرقم
- Timeline حي لحالة الطلب

#### Wishlist (قائمة الأمنيات)
- زرار ❤️ على كل ProductCard
- صفحة `/wishlist` تعرض المنتجات المحفوظة
- LocalStorage-based (لا يحتاج تسجيل دخول)

#### Product Quick View
- Modal سريع عند hover على المنتج
- عرض الصورة + السعر + Add to Cart بدون فتح صفحة جديدة

#### Product Zoom
- Image gallery مع zoom on hover/click في صفحة المنتج

#### PWA Features
- Service Worker + manifest.json
- التطبيق يعمل offline للصفحات المحملة مسبقاً
- إضافة للشاشة الرئيسية

---

## المرحلة 13: Affiliate / Referral System 🤝
**المدة المقدرة:** 2-3 جلسات عمل
**الأولوية:** 🟢 منخفضة (لكن Growth Engine قوية)

### Backend

#### [NEW] `models/Affiliate.ts`
```ts
{
  name: string,
  email: string,
  referralCode: string,
  commissionRate: number,     // e.g., 15%
  totalReferrals: number,
  totalEarnings: number,
  payoutHistory: [{
    amount: number,
    paidAt: Date,
    method: string
  }],
  isActive: boolean
}
```

#### [NEW] `routes/affiliate.routes.ts`
```
POST   /api/affiliates                 → registerAffiliate (public)
GET    /api/affiliates/dashboard       → affiliateDashboard (affiliate)
GET    /api/superadmin/affiliates      → listAllAffiliates (admin)
PATCH  /api/superadmin/affiliates/:id  → updateAffiliate (admin)
```

#### [MODIFY] Auth flow
- عند تسجيل تاجر جديد، تحقق من `?ref=CODE` في URL
- ربط التاجر الجديد بالشريك المسوّق

### Super Admin

#### [NEW] `AffiliatesPage.tsx`
- قائمة الشركاء + روابط الإحالة
- تقارير الإحالات + المدفوعات

---

## المرحلة 14-16: محرك القوالب المتقدم (The True Theme Engine) 🎨🌟

> [!CAUTION]
> هذا القسم هو الأهم والأكثر تعقيداً في المشروع بالكامل. يحتاج تركيز 100%.
> سيتم تنفيذه بعد إكمال جميع المراحل السابقة.

### المشكلة الحالية
القوالب الـ 6 الحالية (Spark, Volt, Épure, Bloom, Noir, Mosaic) هي عملياً **نفس الكود** بألوان ومتغيرات CSS مختلفة فقط. كل قالب يحتوي على:
- [Header.tsx](file:///f:/PROGRAMMING/matgarcoo/matgarco/storefront-next/src/templates/spark/Header.tsx), [Footer.tsx](file:///f:/PROGRAMMING/matgarcoo/matgarco/landing-next/src/components/layout/Footer.tsx), [HomePage.tsx](file:///f:/PROGRAMMING/matgarcoo/matgarco/storefront-next/src/templates/spark/HomePage.tsx), [ProductCard.tsx](file:///f:/PROGRAMMING/matgarcoo/matgarco/storefront-next/src/templates/spark/ProductCard.tsx)
- ومجلد `sections/` (فقط في Spark)

**لكن الفرق بين Spark و Volt مثلاً هو فقط:**
- ألوان مختلفة (primary, secondary, background)
- Dark Mode vs Light Mode
- تغييرات بسيطة في layout

**ما نريد الوصول إليه:**
قوالب مختلفة فعلياً في **البنية والتصميم**، مثل Shopify Themes.

---

### المرحلة 14: إعادة هيكلة معمارية القوالب 🏗️
**المدة:** 4-5 جلسات

#### أ. Theme Architecture

كل قالب يصبح **مكتبة مكونات مستقلة** (Component Library):

```
storefront-next/src/templates/
├── _shared/                     # مكونات مشتركة بين كل القوالب
│   ├── CartDrawer.tsx
│   ├── CheckoutForm.tsx
│   ├── ProductGallery.tsx
│   └── SearchOverlay.tsx
├── spark/
│   ├── config.json              # قابل لإعادة التعريف من الـ DB
│   ├── Header.tsx               # هيكل header خاص بالقالب
│   ├── Footer.tsx
│   ├── HomePage.tsx
│   ├── ProductCard.tsx
│   ├── ProductPage.tsx          # ← جديد: كل قالب له صفحة منتج مختلفة
│   ├── CategoryPage.tsx         # ← جديد
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── CategoriesGrid.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Newsletter.tsx
│   │   └── TrustBadges.tsx
│   └── styles/
│       └── spark.css            # CSS خاص بالقالب
├── volt/
│   ├── config.json
│   ├── Header.tsx               # header مختلف تماماً (mega menu)
│   ├── Footer.tsx
│   ├── HomePage.tsx             # layout مختلف (grid vs carousel)
│   ├── ProductCard.tsx          # card بشكل overlay
│   ├── ProductPage.tsx
│   └── sections/
│       ├── HeroSlider.tsx       # ← نوع Hero مختلف
│       ├── ProductCarousel.tsx  # ← بدل grid
│       └── BrandShowcase.tsx    # ← قسم جديد خاص بـ Volt
...
```

#### ب. Theme Config JSON ([config.json](file:///f:/PROGRAMMING/matgarcoo/matgarco/landing-next/tsconfig.json))

كل قالب يأتي بملف [config.json](file:///f:/PROGRAMMING/matgarcoo/matgarco/landing-next/tsconfig.json) يحدد:
```json
{
  "id": "spark",
  "name": "Spark",
  "version": "2.0.0",
  "description": "قالب سريع وعصري يناسب جميع المتاجر",
  "category": "general",
  "thumbnail": "/themes/spark/preview.png",
  "requiredPlan": "free_trial",
  "availableSections": [
    { "id": "hero", "name": "البنر الرئيسي", "component": "Hero", "configurable": true },
    { "id": "featured_products", "name": "منتجات مميزة", "component": "FeaturedProducts", "configurable": true },
    { "id": "categories_grid", "name": "شبكة الفئات", "component": "CategoriesGrid", "configurable": true }
  ],
  "colorSchemes": [
    { "name": "Default", "colors": { "primary": "#3B82F6", "secondary": "#1E40AF" } },
    { "name": "Ocean", "colors": { "primary": "#0891B2", "secondary": "#155E75" } }
  ],
  "supportedFonts": ["Cairo", "Tajawal", "IBM Plex Sans Arabic"],
  "features": ["hero_section", "featured_products", "categories", "newsletter"]
}
```

#### ج. Dynamic Template Loader

```tsx
// storefront-next/src/lib/templateLoader.ts
export async function loadTemplate(templateId: string) {
  const templates: Record<string, () => Promise<TemplateModule>> = {
    spark: () => import('../templates/spark'),
    volt: () => import('../templates/volt'),
    epure: () => import('../templates/epure'),
    bloom: () => import('../templates/bloom'),
    noir: () => import('../templates/noir'),
    mosaic: () => import('../templates/mosaic'),
  };
  return templates[templateId]?.() || templates.spark();
}
```

---

### المرحلة 15: نظام رفع القوالب من Super Admin 📦
**المدة:** 3-4 جلسات

#### أ. Theme Uploader API

#### [NEW] `routes/themeUpload.routes.ts`
```
POST   /api/superadmin/themes/upload     → uploadThemeZip (admin)
POST   /api/superadmin/themes/:id/update → updateThemeVersion (admin)
DELETE /api/superadmin/themes/:id        → deleteTheme (admin)
```

#### ب. Upload Flow:
1. Super Admin يرفع ملف `.zip` يحتوي على:
   ```
   my-theme/
   ├── config.json          # الإعدادات (required)
   ├── Header.tsx           # المكونات (required)
   ├── Footer.tsx
   ├── HomePage.tsx
   ├── ProductCard.tsx
   ├── sections/
   │   └── Hero.tsx
   └── preview.png          # صورة معاينة (required)
   ```
2. Backend يفك الضغط → يتحقق من [config.json](file:///f:/PROGRAMMING/matgarcoo/matgarco/landing-next/tsconfig.json) → يحفظ الملفات
3. يعمل build incremental عشان الـ storefront يقدر يحمّل القالب الجديد

#### ج. Theme Versioning

#### [MODIFY] [models/Theme.ts](file:///f:/PROGRAMMING/matgarcoo/matgarco/backend-node/src/models/Theme.ts)
```ts
{
  name: string,
  slug: string,
  description: string,
  version: string,           // "2.1.0"
  previousVersions: [{
    version: string,
    releasedAt: Date,
    changelog: string
  }],
  category: "general" | "fashion" | "electronics" | "food" | "digital",
  thumbnail: string,
  allowedPlans: string[],
  status: "active" | "maintenance" | "draft",
  config: {},                // parsed from config.json
  merchantCount: number,     // عدد المتاجر التي تستخدم هذا القالب
  isBuiltIn: boolean,        // true = القوالب الأصلية الـ 6
  uploadedBy?: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Super Admin

#### [MODIFY] [ThemesList.tsx](file:///f:/PROGRAMMING/matgarcoo/matgarco/super-admin-react/src/pages/ThemesList.tsx) — تحسين كبير
- زرار رفع قالب جديد (ZIP) مع drag & drop
- عرض عدد المتاجر التي تستخدم كل قالب
- تعديل [config.json](file:///f:/PROGRAMMING/matgarcoo/matgarco/landing-next/tsconfig.json) من الواجهة (JSON Editor)
- إدارة الإصدارات (Release new version + changelog)
- تصنيف القوالب حسب الفئة (ملابس/إلكترونيات/طعام)
- ربط القالب بالاشتراكات (drag & drop للباقات المسموحة)
- Preview mode: عرض القالب في iframe

---

### المرحلة 16: ربط القوالب عبر كل المشاريع 🔗
**المدة:** 3-4 جلسات

#### أ. Storefront Integration

#### [MODIFY] [storefront-next/src/middleware.ts](file:///f:/PROGRAMMING/matgarcoo/matgarco/storefront-next/src/middleware.ts)
- عند تحميل المتجر → يقرأ `templateId` من `ThemeSettings.published`
- يحمّل المكونات الصحيحة ديناميكياً

#### [MODIFY] كل صفحات Storefront
- Product Page يستخدم `ProductPage` من القالب (بدل مكون واحد مشترك)
- Category Page يستخدم `CategoryPage` من القالب

#### ب. Dashboard Integration

#### [MODIFY] [StoreDesignPage.tsx](file:///f:/PROGRAMMING/matgarcoo/matgarco/dashboard-react/src/pages/store-design/StoreDesignPage.tsx) > `TemplatePanel`
- عرض القوالب المتاحة حسب باقة التاجر
- القوالب المقفولة تظهر بعلامة 👑 مع "ترقية للوصول"
- Preview حي للقالب قبل التطبيق

#### ج. Landing Page Integration

#### [MODIFY] `landing-next` Pricing/Features sections
- عرض عدد القوالب المتاحة لكل باقة
- قسم "Templates Gallery" يعرض كل القوالب مع preview

---

## المرحلة الإضافية: Feature Flags ⚡
**المدة:** 1 جلسة

### Backend

#### [MODIFY] `PlatformSettings.ts`
```ts
featureFlags: {
  aiEnabled: boolean,
  reviewsEnabled: boolean,
  affiliateEnabled: boolean,
  newSignupsEnabled: boolean,
  maintenanceMode: boolean
}
```

### Super Admin

#### [MODIFY] [GlobalSettings.tsx](file:///f:/PROGRAMMING/matgarcoo/matgarco/super-admin-react/src/pages/GlobalSettings.tsx)
- قسم "Feature Flags" — Toggle switches لكل ميزة
- إيقاف أي ميزة بضغطة زر في حالة الطوارئ

---

## 📋 ملخص الأولويات

| # | المرحلة | الأولوية | التبعيات |
|---|---------|----------|----------|
| 1 | الاشتراكات والفواتير | 🔴 | — |
| 2 | بوابات الدفع (Paymob) | 🔴 | مرحلة 1 |
| 3 | التقارير المالية | 🟡 | مراحل 1-2 |
| 4 | الخصومات والكوبونات | 🟡 | — |
| 5 | المراجعات والتقييمات | 🟡 | — |
| 6 | الشحن (Bosta) | 🟠 | — |
| 7 | البريد الإلكتروني | 🟡 | — |
| 8 | التذاكر والدعم الفني | 🟠 | — |
| 9 | الإشعارات العالمية | 🟠 | — |
| 10 | تحسينات Super Admin | 🟡 | مراحل 1-9 |
| 11 | الذكاء الاصطناعي | 🟠 | — |
| 12 | تحسينات Storefront | 🟡 | — |
| 13 | Affiliate System | 🟢 | — |
| **14** | **إعادة هيكلة القوالب** | **🔴** | **مراحل 1-13** |
| **15** | **نظام رفع القوالب** | **🔴** | **مرحلة 14** |
| **16** | **ربط القوالب عبر المشاريع** | **🔴** | **مرحلة 15** |

---

## ✍️ اقتراحات إضافية لتحسين المنصة

1. **Multi-Language Storefront**: دعم العربية والإنجليزية في المتاجر (حالياً عربي فقط)
2. **Inventory Alerts**: إشعارات تلقائية عند انخفاض المخزون
3. **Bulk Import/Export**: استيراد/تصدير المنتجات بـ CSV/Excel
4. **Custom Pages Builder**: السماح للتاجر بإنشاء صفحات مخصصة (About, FAQ, Contact)
5. **Social Login (Google/Facebook)**: تسجيل دخول سريع للعملاء
6. **Webhook Events System**: إرسال events للتجار عند أحداث معينة (new order, payment, etc.)
7. **SEO Sitemap Generator**: توليد sitemap.xml تلقائي لكل متجر
8. **Performance Monitoring**: مراقبة سرعة الصفحات + uptime للمتاجر من Super Admin
9. **Dark Mode Dashboard**: وضع ليلي للوحة التحكم
10. **Mobile App (React Native)**: تطبيق التاجر للموبايل (حلم المستقبل!)

---

> **ملحوظة مهمة:** المراحل 14-16 (محرك القوالب) هي القلب النابض للمنصة. تم وضعها في النهاية عمداً لأنها تحتاج:
> - كل البنية التحتية السابقة جاهزة (subscriptions, payments, etc.)
> - تركيز كامل 100% بدون انشغال بمهام أخرى
> - تعديلات تطال كل المشاريع الخمسة (backend + storefront + dashboard + super-admin + landing)
