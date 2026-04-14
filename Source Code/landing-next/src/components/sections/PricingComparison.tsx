"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

export function PricingComparison() {
  const { t, lang } = useLanguage();

  const categories = lang === "ar" ? [
    {
      name: "إعداد المتجر والهوية",
      features: [
        { name: "تجهيز المتجر", lite: "AI Setup Wizard (3-min)", pro: "AI Wizard + Custom Theme Access", prime: "AI Wizard + AI Store Mirroring" },
        { name: "الدومين والهوية", lite: "Matgarco Subdomain", pro: "Custom Domain Mapping", prime: "Custom Domain Mapping" },
        { name: "العلامة المائية", lite: "Matgarco Branding", pro: "Full White-Labeling", prime: "Full White-Labeling" },
        { name: "قوالب تصميم", lite: "2 Basic Templates", pro: "5 Premium Templates", prime: "All Templates + Custom" },
      ],
    },
    {
      name: "التجارة والعمليات",
      features: [
        { name: "المنتجات النشطة", lite: "100 منتج", pro: "عدد لا محدود", prime: "عدد لا محدود" },
        { name: "حسابات فريق العمل", lite: "1 مستخدم", pro: "3 مستخدمين (RBAC)", prime: "10 مستخدمين (+ Audit)" },
        { name: "نقل البيانات", lite: "Social Bridge", pro: "Social Bridge", prime: "Social Bridge" },
      ],
    },
    {
      name: "الشحن واللوجستيات",
      features: [
        { name: "أنظمة الشحن", lite: "حساب متجركو الرئيسي", pro: "مفاتيح API خاصة", prime: "API Keys + Concierge" },
      ],
    },
    {
      name: "الذكاء الاصطناعي والإحصائيات",
      features: [
        { name: "أرصدة AI", lite: "30 / شهر", pro: "100 / شهر", prime: "300 / شهر" },
        { name: "ميزات AI متقدمة", lite: "Content Copilot", pro: "Growth Copilot", prime: "Price Watch" },
        { name: "التحليلات", lite: "تقارير أساسية", pro: "Heatmaps + ROI", prime: "Predictive Forecasting" },
      ],
    },
    {
      name: "أدوات البيع والدعم",
      features: [
        { name: "محركات البيع", lite: "واجهة أساسية", pro: "Wholesale B2B", prime: "Wholesale + Referral" },
        { name: "الاحتفاظ بالعملاء", lite: "Checkout أساسي", pro: "Abandoned Cart", prime: "Cart + Sentiment AI" },
        { name: "الدعم الفني", lite: "دعم عادي", pro: "أولوية في الدعم", prime: "مدير حساب VIP" },
      ],
    },
  ] : [
    {
      name: "Store Setup & Identity",
      features: [
        { name: "Store Setup", lite: "AI Setup Wizard (3-min)", pro: "AI Wizard + Custom Theme Access", prime: "AI Wizard + AI Store Mirroring" },
        { name: "Domain & Identity", lite: "Matgarco Subdomain", pro: "Custom Domain Mapping", prime: "Custom Domain Mapping" },
        { name: "Branding", lite: "Matgarco Branding", pro: "Full White-Labeling", prime: "Full White-Labeling" },
        { name: "Design Templates", lite: "2 Basic Templates", pro: "5 Premium Templates", prime: "All Templates + Custom" },
      ],
    },
    {
      name: "Commerce & Operations",
      features: [
        { name: "Active Products", lite: "100 Products", pro: "Unlimited", prime: "Unlimited" },
        { name: "Team Accounts", lite: "1 User (Owner)", pro: "3 Users (RBAC)", prime: "10 Users (+ Audit Logs)" },
        { name: "Data Migration", lite: "Social Bridge", pro: "Social Bridge", prime: "Social Bridge" },
      ],
    },
    {
      name: "Shipping & Logistics",
      features: [
        { name: "Shipping Systems", lite: "Matgarco Master Account", pro: "Own API Keys", prime: "API Keys + Concierge" },
      ],
    },
    {
      name: "AI & Analytics",
      features: [
        { name: "AI Credits", lite: "30 / month", pro: "100 / month", prime: "300 / month" },
        { name: "Advanced AI", lite: "Content Copilot", pro: "Growth Copilot", prime: "Price Watch" },
        { name: "Analytics", lite: "Basic Reports", pro: "Heatmaps + ROI", prime: "Predictive Forecasting" },
      ],
    },
    {
      name: "Sales Tools & Support",
      features: [
        { name: "Sales Engines", lite: "Basic Storefront", pro: "Wholesale B2B", prime: "Wholesale + Referral" },
        { name: "Retention", lite: "Basic Checkout", pro: "Abandoned Cart", prime: "Cart + Sentiment AI" },
        { name: "Support Level", lite: "Standard", pro: "Priority Support", prime: "VIP Account Manager" },
      ],
    },
  ];

  const liteLabel = lang === "ar" ? "الخطوة" : "Starter";
  const proLabel = lang === "ar" ? "الانطلاق" : "Growth";
  const primeLabel = lang === "ar" ? "القمة" : "Pro";

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.pricingPage.comparisonTitle}</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">{t.pricingPage.comparisonSubtitle}</p>
        </div>

        <div className="overflow-x-auto pb-8">
          <table className={cn("w-full min-w-[800px] border-collapse", lang === "ar" ? "text-right" : "text-left")}>
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className={cn("w-1/4 p-4 text-slate-500 font-bold bg-slate-50", lang === "ar" ? "rounded-tr-xl" : "rounded-tl-xl")}>{t.pricingPage.feature}</th>
                <th className="w-1/4 p-4 text-center font-bold text-slate-900 bg-slate-50">
                  Matgar Lite <span className="block text-sm font-normal text-slate-500">({liteLabel})</span>
                </th>
                <th className="w-1/4 p-4 text-center font-bold text-matgarco-700 bg-matgarco-50 border-x border-matgarco-100 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-matgarco-700 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">{t.pricingPage.recommended}</div>
                  Matgar Pro <span className="block text-sm font-normal text-matgarco-600">({proLabel})</span>
                </th>
                <th className={cn("w-1/4 p-4 text-center font-bold text-slate-900 bg-slate-50", lang === "ar" ? "rounded-tl-xl" : "rounded-tr-xl")}>
                  Matgar Prime <span className="block text-sm font-normal text-slate-500">({primeLabel})</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, catIdx) => (
                <React.Fragment key={catIdx}>
                  <tr>
                    <td colSpan={4} className="bg-slate-100 p-4 font-bold text-slate-700 mt-4 text-sm rounded-lg relative top-4">
                      {category.name}
                    </td>
                  </tr>
                  <tr><td colSpan={4} className="h-4"></td></tr>
                  {category.features.map((feature, featIdx) => (
                    <tr key={featIdx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-slate-800 font-medium">{feature.name}</td>
                      <td className="p-4 text-center text-slate-500">{feature.lite}</td>
                      <td className="p-4 text-center text-slate-900 font-medium bg-matgarco-50/30 border-x border-matgarco-50/50">{feature.pro}</td>
                      <td className="p-4 text-center text-slate-900 font-bold">{feature.prime}</td>
                    </tr>
                  ))}
                  <tr><td colSpan={4} className="h-6"></td></tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
