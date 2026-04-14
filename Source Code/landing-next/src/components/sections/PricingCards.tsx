"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/i18n/LanguageContext";

export function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { t, lang } = useLanguage();

  const plans = [
    {
      id: "lite",
      name: "Matgar Lite",
      arabicName: lang === "ar" ? "الخطوة" : "Starter",
      priceMonthly: 250,
      commission: lang === "ar" ? "2% عمولة / طلب" : "2% per order",
      products: lang === "ar" ? "100 منتج" : "100 Products",
      staff: lang === "ar" ? "1 مستخدم" : "1 User",
      aiCredits: lang === "ar" ? "30 رصيد شهرياً" : "30 /month",
      features: lang === "ar" ? [
        { name: "متجر فرعي Matgarco", included: true },
        { name: "واجهة متجر أساسية", included: true },
        { name: "شحن عبر حساب متجركو الرئيسي", included: true },
        { name: "لوحة تحكم أساسية", included: true },
        { name: "ربط دومين خاص مخصص", included: false },
        { name: "بدون علامة متجركو المائية", included: false },
      ] : [
        { name: "Matgarco Subdomain Store", included: true },
        { name: "Basic Storefront", included: true },
        { name: "Shipping via Matgarco Account", included: true },
        { name: "Basic Dashboard", included: true },
        { name: "Custom Domain Mapping", included: false },
        { name: "White-Label Branding", included: false },
      ],
    },
    {
      id: "pro",
      name: "Matgar Pro",
      arabicName: lang === "ar" ? "الانطلاق" : "Growth",
      priceMonthly: 450,
      commission: lang === "ar" ? "0% عمولة 🥇" : "0% Commission 🥇",
      products: lang === "ar" ? "عدد لا محدود" : "Unlimited",
      staff: lang === "ar" ? "3 مستخدمين" : "3 Users",
      aiCredits: lang === "ar" ? "100 رصيد شهرياً" : "100 /month",
      highlighted: true,
      features: lang === "ar" ? [
        { name: "ربط دومين خاص مخصص", included: true },
        { name: "بدون علامة متجركو المائية (White-label)", included: true },
        { name: "مفاتيح شحن خاصة (Bosta/Aramex)", included: true },
        { name: "إدارة فرق العمل (صلاحيات مخصصة)", included: true },
        { name: "استرجاع السلات المتروكة", included: true },
        { name: "محرك المبيعات بالجملة B2B", included: true },
      ] : [
        { name: "Custom Domain Mapping", included: true },
        { name: "Full White-Label Branding", included: true },
        { name: "Own Shipping API Keys (Bosta/Aramex)", included: true },
        { name: "Team Management (Custom Roles)", included: true },
        { name: "Abandoned Cart Recovery", included: true },
        { name: "B2B Wholesale Engine", included: true },
      ],
    },
    {
      id: "prime",
      name: "Matgar Prime",
      arabicName: lang === "ar" ? "القمة" : "Pro",
      priceMonthly: 699,
      commission: lang === "ar" ? "0% عمولة 🥇" : "0% Commission 🥇",
      products: lang === "ar" ? "عدد لا محدود" : "Unlimited",
      staff: lang === "ar" ? "10 مستخدمين" : "10 Users",
      aiCredits: lang === "ar" ? "300 رصيد شهرياً" : "300 /month",
      features: lang === "ar" ? [
        { name: "كل ميزات باقة الانطلاق", included: true },
        { name: "تجهيز الشحن كخدمة (Concierge Setup)", included: true },
        { name: "AI Price Watch (مراقبة أسعار المنافسين)", included: true },
        { name: "ذكاء اصطناعي لتوقع المخزون والتنبؤ", included: true },
        { name: "محرك الإحالة (Referral Engine)", included: true },
        { name: "مدير حساب مخصص (VIP Support)", included: true },
      ] : [
        { name: "All Growth Plan Features", included: true },
        { name: "Concierge Shipping Setup", included: true },
        { name: "AI Price Watch (Competitors)", included: true },
        { name: "Predictive Inventory AI", included: true },
        { name: "Referral Engine", included: true },
        { name: "Dedicated VIP Account Manager", included: true },
      ],
    },
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Toggle Billing */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex items-center bg-slate-200/50 p-1.5 rounded-full border border-slate-200">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300",
                !isAnnual ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {t.pricingPage.monthly}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2",
                isAnnual ? "bg-matgarco-700 text-white shadow-md shadow-matgarco-500/20" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {t.pricingPage.annual}
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                isAnnual ? "bg-white overflow-hidden text-matgarco-700" : "bg-emerald-100 text-emerald-700"
              )}>{t.pricingPage.save}</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col p-8 rounded-3xl transition-all duration-300",
                plan.highlighted
                  ? "bg-slate-900 text-white shadow-2xl shadow-matgarco-900/40 md:-translate-y-4 border-2 border-matgarco-500"
                  : "bg-white border border-slate-200 shadow-lg"
              )}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-matgarco-500 text-white text-sm font-bold rounded-full shadow-lg whitespace-nowrap">
                  {t.pricingPage.mostPopular}
                </div>
              )}

              <div className="mb-8">
                <h3 className={cn(
                  "text-xl font-bold mb-2",
                  plan.highlighted ? "text-slate-100" : "text-slate-500"
                )}>{plan.name} <span className="text-sm font-normal">({plan.arabicName})</span></h3>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-5xl font-black">
                    {isAnnual ? Math.floor(plan.priceMonthly * 0.8) : plan.priceMonthly}
                  </span>
                  <span className={cn(
                    "font-medium",
                    plan.highlighted ? "text-slate-400" : "text-slate-500"
                  )}>{t.pricingPage.perMonth}</span>
                </div>
                {isAnnual && (
                  <p className={cn(
                    "text-sm mt-2 font-medium",
                    plan.highlighted ? "text-emerald-400" : "text-emerald-600"
                  )}>{t.pricingPage.paidAnnually} {Math.floor(plan.priceMonthly * 0.8 * 12)} {lang === "ar" ? "ج.م" : "EGP"}</p>
                )}
              </div>

              {/* Quick Spec Metrics */}
              <div className={cn(
                "grid grid-cols-2 gap-3 mb-8 pb-8 border-b",
                plan.highlighted ? "border-slate-800" : "border-slate-100"
              )}>
                <div className="flex flex-col gap-1">
                  <span className={cn("text-xs font-bold", plan.highlighted ? "text-slate-400" : "text-slate-400")}>{t.pricingPage.commission}</span>
                  <span className="font-bold text-sm tracking-tight">{plan.commission}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={cn("text-xs font-bold", plan.highlighted ? "text-slate-400" : "text-slate-400")}>{t.pricingPage.products}</span>
                  <span className="font-bold text-sm tracking-tight">{plan.products}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={cn("text-xs font-bold", plan.highlighted ? "text-slate-400" : "text-slate-400")}>{t.pricingPage.staff}</span>
                  <span className="font-bold text-sm tracking-tight">{plan.staff}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={cn("text-xs font-bold", plan.highlighted ? "text-slate-400" : "text-slate-400")}>{t.pricingPage.ai}</span>
                  <span className="font-bold text-sm tracking-tight">{plan.aiCredits}</span>
                </div>
              </div>

              {/* Feature List */}
              <ul className="space-y-4 flex-grow mb-10">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex flex-start gap-3 items-start">
                    {feature.included ? (
                      <div className={cn("mt-0.5 rounded-full p-0.5", plan.highlighted ? "bg-matgarco-500/20 text-matgarco-400" : "bg-emerald-100 text-emerald-600")}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="mt-0.5 rounded-full p-0.5 bg-slate-100 text-slate-400">
                        <X size={14} strokeWidth={3} />
                      </div>
                    )}
                    <span className={cn(
                      "text-sm leading-tight",
                      feature.included ? (plan.highlighted ? "text-slate-200" : "text-slate-700") : "text-slate-400 line-through"
                    )}>{feature.name}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? "shine" : "outline"}
                className={cn("w-full py-4 text-lg", !plan.highlighted && "bg-white hover:bg-slate-50")}
              >
                {t.pricingPage.choosePlan} {plan.arabicName}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
