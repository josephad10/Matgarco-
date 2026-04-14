"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t, lang } = useLanguage();

  const faqs = lang === "ar" ? [
    {
      question: "كيف تعمل الـ 14 يوم تجربة مجانية؟",
      answer: "بمجرد تسجيلك، ستحصل آلياً على تجربة مجانية شاملة لكامل مميزات الباقة المختارة لمدة 14 يوماً. لا نطلب تعبئة أي بيانات لبطاقتك الائتمانية حتى تقرر الاستمرار.",
    },
    {
      question: "ماذا تعني عمولة 0% في باقة الانطلاق والقمة؟",
      answer: "في باقة الخطوة، يتم احتساب عمولة 2% من كل طلب. لكن في باقتي الانطلاق والقمة، لا عمولات على الإطلاق — الأرباح بالكامل تذهب لك.",
    },
    {
      question: "هل أحتاج لمعرفة بالبرمجة للاشتراك؟",
      answer: "أبداً. متجركو يوفر لك AI Setup Wizard ومحرك ثيمات السحب والإفلات لبناء متجرك بنقرات بسيطة.",
    },
    {
      question: "كيف يتم تطبيق خصم الاشتراك السنوي؟",
      answer: "عند الدفع لعام كامل مقدماً، تحصل على خصم 20%، مما يعني اشتراك بتكلفة أوفر بكثير.",
    },
    {
      question: "كيف أربط شركات الشحن بحساباتي الخاصة؟",
      answer: "في باقتي الانطلاق والقمة، يمكنك إدخال مفاتيح API الخاصة من Bosta و Aramex مباشرة لاسترجاع الأرباح لحسابك فوراً.",
    },
  ] : [
    {
      question: "How does the 14-day free trial work?",
      answer: "Once you sign up, you automatically get full access to all features of your chosen plan for 14 days. No credit card required until you decide to subscribe.",
    },
    {
      question: "What does 0% commission mean on Growth and Pro plans?",
      answer: "On the Starter plan, a 2% commission is charged per order. On Growth and Pro plans, there are zero commissions — all profits go directly to you.",
    },
    {
      question: "Do I need coding skills to get started?",
      answer: "Not at all. Matgarco provides an AI Setup Wizard and a drag-and-drop Theme Engine to build your store with simple clicks.",
    },
    {
      question: "How does the annual discount work?",
      answer: "When you pay for a full year upfront, you get a 20% discount, making it significantly more cost-effective.",
    },
    {
      question: "How do I connect my own shipping accounts?",
      answer: "On Growth and Pro plans, you can enter your own API keys from Bosta and Aramex directly to receive payouts to your bank account instantly.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.pricingPage.faqTitle}</h2>
          <p className="text-slate-500">{t.pricingPage.faqSubtitle}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={cn(
                  "border rounded-2xl bg-white transition-all duration-300 overflow-hidden",
                  isOpen ? "border-matgarco-300 shadow-md" : "border-slate-200 hover:border-slate-300"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className={cn("w-full flex items-center justify-between p-6 font-bold text-slate-900 group", lang === "ar" ? "text-right" : "text-left")}
                >
                  <span className="text-lg group-hover:text-matgarco-700 transition-colors">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "text-slate-400 transition-transform duration-300 min-w-[20px]",
                      isOpen && "rotate-180 text-matgarco-600"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "px-6 text-slate-600 leading-relaxed transition-all duration-300 max-h-0 opacity-0",
                    isOpen && "max-h-[500px] pb-6 opacity-100"
                  )}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
