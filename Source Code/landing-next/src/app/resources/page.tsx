"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MegaCTA } from "@/components/sections/MegaCTA";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  Code2,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function ResourcesPage() {
  const { t, lang, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const resourceCards = lang === "ar"
    ? [
        { icon: <BookOpen size={24} />, title: "مركز المساعدة", description: "مقالات شاملة وإرشادات خطوة بخطوة لكل ميزة في المنصة.", link: "#", color: "bg-matgarco-50 text-matgarco-700", borderColor: "hover:border-matgarco-300" },
        { icon: <Video size={24} />, title: "دروس الفيديو", description: "شروحات مصورة لإعداد متجرك، تخصيص الثيمات، وإدارة الطلبات.", link: "#", color: "bg-purple-50 text-purple-700", borderColor: "hover:border-purple-300" },
        { icon: <Code2 size={24} />, title: "وثائق المطورين (API)", description: "وثائق API كاملة ومحدثة للتكامل مع أنظمتك الخارجية.", link: "#", color: "bg-emerald-50 text-emerald-700", borderColor: "hover:border-emerald-300" },
        { icon: <FileText size={24} />, title: "المدونة", description: "نصائح تسويقية، دراسات حالة ناجحة، وأحدث اتجاهات التجارة.", link: "#", color: "bg-amber-50 text-amber-700", borderColor: "hover:border-amber-300" },
        { icon: <MessageSquare size={24} />, title: "مجتمع التجار", description: "تواصل مع تجار آخرين، شارك خبراتك واستفد من تجاربهم.", link: "#", color: "bg-rose-50 text-rose-700", borderColor: "hover:border-rose-300" },
        { icon: <HelpCircle size={24} />, title: "الأسئلة الشائعة", description: "إجابات سريعة لأكثر الأسئلة شيوعاً حول الباقات والدفع.", link: "/pricing", color: "bg-teal-50 text-teal-700", borderColor: "hover:border-teal-300" },
      ]
    : [
        { icon: <BookOpen size={24} />, title: "Help Center", description: "Comprehensive articles and step-by-step guides for every platform feature.", link: "#", color: "bg-matgarco-50 text-matgarco-700", borderColor: "hover:border-matgarco-300" },
        { icon: <Video size={24} />, title: "Video Tutorials", description: "Video walkthroughs for setting up your store, customizing themes, and managing orders.", link: "#", color: "bg-purple-50 text-purple-700", borderColor: "hover:border-purple-300" },
        { icon: <Code2 size={24} />, title: "Developer Docs (API)", description: "Complete and up-to-date API documentation for integrating with external systems.", link: "#", color: "bg-emerald-50 text-emerald-700", borderColor: "hover:border-emerald-300" },
        { icon: <FileText size={24} />, title: "Blog", description: "Marketing tips, case studies, and the latest e-commerce trends.", link: "#", color: "bg-amber-50 text-amber-700", borderColor: "hover:border-amber-300" },
        { icon: <MessageSquare size={24} />, title: "Merchant Community", description: "Connect with other merchants, share experiences and learn from their journeys.", link: "#", color: "bg-rose-50 text-rose-700", borderColor: "hover:border-rose-300" },
        { icon: <HelpCircle size={24} />, title: "FAQ", description: "Quick answers to the most common questions about plans, payments, and shipping.", link: "/pricing", color: "bg-teal-50 text-teal-700", borderColor: "hover:border-teal-300" },
      ];

  const guides = lang === "ar"
    ? [
        { title: "كيف تنشئ متجرك الأول في 5 دقائق", category: "البداية", readTime: "5 دقائق" },
        { title: "دليل تخصيص الثيم الخاص بمتجرك", category: "التصميم", readTime: "8 دقائق" },
        { title: "ربط بوابة Paymob خطوة بخطوة", category: "المدفوعات", readTime: "6 دقائق" },
        { title: "إعداد حساب بوسطة الخاص بك", category: "الشحن", readTime: "4 دقائق" },
        { title: "استخدام AI Copilot لكتابة وصف احترافي", category: "الذكاء الاصطناعي", readTime: "3 دقائق" },
        { title: "إضافة صلاحيات الموظفين وإدارة الفريق", category: "الإدارة", readTime: "5 دقائق" },
      ]
    : [
        { title: "How to Create Your First Store in 5 Minutes", category: "Getting Started", readTime: "5 min" },
        { title: "Guide to Customizing Your Store Theme", category: "Design", readTime: "8 min" },
        { title: "Connecting Paymob Step by Step", category: "Payments", readTime: "6 min" },
        { title: "Setting Up Your Bosta Shipping Account", category: "Shipping", readTime: "4 min" },
        { title: "Using AI Copilot for Professional Descriptions", category: "AI", readTime: "3 min" },
        { title: "Adding Staff Permissions & Team Management", category: "Management", readTime: "5 min" },
      ];

  const browseNow = lang === "ar" ? "تصفح الآن" : "Browse Now";

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      <main className="flex-grow">
        <section className="pt-32 pb-16 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-sm font-bold mb-6">
              <Sparkles size={16} /> {t.resourcesPage.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              {t.resourcesPage.heroTitle1}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-600 to-matgarco-600">{t.resourcesPage.heroTitle2}</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">{t.resourcesPage.heroSubtitle}</p>
          </div>
        </section>

        <section className="py-20 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">{t.resourcesPage.exploreTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourceCards.map((card, idx) => (
                <Link href={card.link} key={idx} className={`group flex flex-col p-8 rounded-3xl bg-white border-2 border-slate-100 ${card.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <div className={`w-14 h-14 rounded-2xl ${card.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>{card.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-matgarco-700 transition-colors">{card.title}</h3>
                  <p className="text-slate-500 leading-relaxed flex-grow">{card.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-matgarco-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">{browseNow} <Arrow size={14} /></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">{t.resourcesPage.guidesTitle}</h2>
            <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">{t.resourcesPage.guidesSubtitle}</p>
            <div className="space-y-4">
              {guides.map((guide, idx) => (
                <Link href="#" key={idx} className="group flex items-center justify-between p-6 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-matgarco-50 text-matgarco-700 flex items-center justify-center font-bold text-sm flex-shrink-0">{String(idx + 1).padStart(2, "0")}</div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-matgarco-700 transition-colors">{guide.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">{guide.category}</span>
                        <span className="text-xs text-slate-400">{guide.readTime} {t.resourcesPage.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <Arrow size={18} className={`text-slate-300 group-hover:text-matgarco-600 transition-all ${isRTL ? "group-hover:-translate-x-2" : "group-hover:translate-x-2"}`} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50 border-t border-slate-100">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{t.resourcesPage.notFoundTitle}</h3>
              <p className="text-slate-500 mb-8 max-w-lg mx-auto">{t.resourcesPage.notFoundSubtitle}</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="mailto:support@matgarco.com" className="px-8 py-3 bg-matgarco-700 text-white font-bold rounded-xl hover:bg-matgarco-800 transition-all shadow-md">{t.resourcesPage.emailCta}</a>
                <a href="#" className="px-8 py-3 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:border-matgarco-300 transition-all">{t.resourcesPage.chatCta}</a>
              </div>
            </div>
          </div>
        </section>

        <MegaCTA />
      </main>
      <Footer />
    </div>
  );
}
