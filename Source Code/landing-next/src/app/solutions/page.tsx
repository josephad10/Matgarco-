"use client";

import { Navbar } from "@/components/layout/Navbar";
import { GlobalFooter } from "@/components/sections/GlobalFooter";

import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Shirt,
  MonitorSmartphone,
  Palette,
  Coffee,
  GraduationCap,
  Gem,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";

export default function SolutionsPage() {
  const [activeSolution, setActiveSolution] = useState(0);
  const { t, lang, isRTL } = useLanguage();
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const solutions = lang === "ar"
    ? [
        { id: "fashion", icon: <Shirt size={28} />, title: "الأزياء والموضة", tagline: "اعرض تفاصيل الأناقة بأعلى جودة", description: "قوالب مصممة خصيصاً لعرض الملابس والإكسسوارات مع نظام متقدم يدعم خيارات المقاسات، الألوان، والصور ثلاثية الأبعاد.", color: "from-rose-500 to-pink-600", bgLight: "bg-rose-50", textColor: "text-rose-600", benefits: ["جدول مقاسات ذكي لكل منتج", "معرض صور عالي الجودة", "تصنيفات حسب الموسم والمجموعة", "خيارات ألوان وأنماط متعددة"] },
        { id: "electronics", icon: <MonitorSmartphone size={28} />, title: "الإلكترونيات والتقنية", tagline: "مواصفات تقنية بعرض احترافي", description: "جداول مقارنة مواصفات تقنية مفصلة وفلاتر تصفية متقدمة بناءً على العلامة التجارية والخصائص الفنية.", color: "from-blue-500 to-indigo-600", bgLight: "bg-blue-50", textColor: "text-blue-600", benefits: ["جدول مواصفات تقنية تلقائي", "فلاتر متقدمة", "مقارنة بين المنتجات", "دعم الضمان والاستبدال"] },
        { id: "digital", icon: <Palette size={28} />, title: "المنتجات الرقمية", tagline: "بيع الملفات والدورات بنقرة واحدة", description: "تسليم فوري وآمن للملفات بعد الدفع مباشرة. مثالي للقوالب والكتب الإلكترونية.", color: "from-purple-500 to-violet-600", bgLight: "bg-purple-50", textColor: "text-purple-600", benefits: ["تسليم تلقائي فوري", "حماية الملفات بروابط مؤقتة", "دعم تنسيقات متعددة", "نظام تراخيص ذكي"] },
        { id: "food", icon: <Coffee size={28} />, title: "المأكولات والمقاهي", tagline: "طلبات مخصصة وتوصيل مجدول", description: "خيارات توصيل مجدول واستلام من الفروع مع دعم الطلبات الخاصة.", color: "from-amber-500 to-orange-600", bgLight: "bg-amber-50", textColor: "text-amber-600", benefits: ["قائمة طعام تفاعلية", "تخصيصات الطلب", "حجز مواعيد التوصيل", "استلام من الفروع"] },
        { id: "education", icon: <GraduationCap size={28} />, title: "التعليم والدورات", tagline: "منصتك التعليمية الخاصة", description: "أنشئ أكاديميتك الخاصة مع نظام إدارة المحتوى التعليمي وتتبع التقدم.", color: "from-teal-500 to-emerald-600", bgLight: "bg-teal-50", textColor: "text-teal-600", benefits: ["نظام فصول ودروس منظم", "تتبع تقدم الطالب", "شهادات إلكترونية", "اختبارات مدمجة"] },
        { id: "jewelry", icon: <Gem size={28} />, title: "المجوهرات والاكسسوارات", tagline: "اعرض الفخامة بأسلوب يليق بها", description: "واجهات عرض فاخرة مع تكبير عالي الدقة وعرض 360° للقطع الثمينة.", color: "from-yellow-500 to-amber-600", bgLight: "bg-yellow-50", textColor: "text-yellow-600", benefits: ["عرض 360° للمنتجات", "نظام حجز القطع الخاصة", "كتالوج رقمي فاخر", "دعم النقش والتخصيص"] },
      ]
    : [
        { id: "fashion", icon: <Shirt size={28} />, title: "Fashion & Apparel", tagline: "Showcase elegance in high quality", description: "Custom-built templates for clothing and accessories with advanced options for sizes, colors, and 3D product imagery.", color: "from-rose-500 to-pink-600", bgLight: "bg-rose-50", textColor: "text-rose-600", benefits: ["Smart size chart per product", "High-quality image gallery", "Seasonal & collection categories", "Multiple color & pattern options"] },
        { id: "electronics", icon: <MonitorSmartphone size={28} />, title: "Electronics & Tech", tagline: "Professional spec sheets", description: "Detailed tech spec comparison tables and advanced filters by brand, price range, and technical features.", color: "from-blue-500 to-indigo-600", bgLight: "bg-blue-50", textColor: "text-blue-600", benefits: ["Auto-generated spec tables", "Advanced filters (brand, price, RAM)", "Side-by-side product comparison", "Warranty & return policy support"] },
        { id: "digital", icon: <Palette size={28} />, title: "Digital Products", tagline: "Sell files & courses in one click", description: "Instant and secure file delivery after payment. Perfect for templates, ebooks, and courses.", color: "from-purple-500 to-violet-600", bgLight: "bg-purple-50", textColor: "text-purple-600", benefits: ["Instant auto-delivery", "File protection with temp links", "Multiple format support", "Smart licensing system"] },
        { id: "food", icon: <Coffee size={28} />, title: "Food & Cafés", tagline: "Custom orders & scheduled delivery", description: "Scheduled delivery and branch pickup options with support for special orders and customizations.", color: "from-amber-500 to-orange-600", bgLight: "bg-amber-50", textColor: "text-amber-600", benefits: ["Interactive food menu", "Order customizations (add, remove)", "Delivery time scheduling", "Branch pickup support"] },
        { id: "education", icon: <GraduationCap size={28} />, title: "Education & Courses", tagline: "Your own learning platform", description: "Build your academy with a content management system, student progress tracking, and digital certificates.", color: "from-teal-500 to-emerald-600", bgLight: "bg-teal-50", textColor: "text-teal-600", benefits: ["Organized lessons & chapters", "Auto student progress tracking", "Digital certificates", "Built-in quizzes & assessments"] },
        { id: "jewelry", icon: <Gem size={28} />, title: "Jewelry & Accessories", tagline: "Display luxury at its finest", description: "Premium display with high-res zoom and 360° views for precious items with custom order booking.", color: "from-yellow-500 to-amber-600", bgLight: "bg-yellow-50", textColor: "text-yellow-600", benefits: ["360° product views", "Custom piece reservation", "Digital luxury catalog", "Engraving & customization"] },
      ];

  const active = solutions[activeSolution];

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      <main className="flex-grow">
        <section className="pt-32 pb-16 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-matgarco-50 border border-matgarco-100 text-matgarco-700 text-sm font-bold mb-6">
              <ShoppingBag size={16} /> {t.solutionsPage.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              {t.solutionsPage.heroTitle1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-matgarco-600 to-cyan-500">{t.solutionsPage.heroTitle2}</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">{t.solutionsPage.heroSubtitle}</p>
          </div>
        </section>

        <section className="py-20 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {solutions.map((sol, idx) => (
                <button key={sol.id} onClick={() => setActiveSolution(idx)} className={cn("flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-300 border-2", activeSolution === idx ? "bg-white border-slate-900 text-slate-900 shadow-lg scale-105" : "bg-white/50 border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-700")}>
                  <span className={cn("transition-colors", activeSolution === idx ? sol.textColor : "text-slate-400")}>{sol.icon}</span>
                  {sol.title}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[450px]">
              <div className="order-2 lg:order-1">
                <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6", active.bgLight, active.textColor)}>{active.icon} {active.tagline}</div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{active.title}</h2>
                <p className="text-lg text-slate-500 leading-relaxed mb-8">{active.description}</p>
                <ul className="space-y-4 mb-10">
                  {active.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={cn("mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", active.bgLight, active.textColor)}><Check size={12} strokeWidth={3} /></div>
                      <span className="text-slate-700 font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="shine" size="lg">{t.solutionsPage.ctaPrefix} {active.title} {t.solutionsPage.ctaSuffix}<Arrow size={18} className="mx-2" /></Button>
              </div>

              <div className="order-1 lg:order-2">
                <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl border border-slate-200 group">
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-10", active.color)} />
                  <div className="absolute inset-0 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", active.color)}>{active.icon}</div>
                        <div><div className="w-24 h-3 bg-slate-200 rounded-full" /><div className="w-16 h-2 bg-slate-100 rounded-full mt-1.5" /></div>
                      </div>
                      <div className="flex gap-2"><div className="w-8 h-8 rounded-lg bg-slate-100" /><div className="w-8 h-8 rounded-lg bg-slate-100" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-3 flex flex-col group-hover:shadow-md transition-shadow">
                          <div className={cn("h-24 rounded-xl mb-3 bg-gradient-to-br opacity-20", active.color)} />
                          <div className="w-3/4 h-2.5 bg-slate-200 rounded-full mb-2" />
                          <div className="w-1/2 h-2 bg-slate-100 rounded-full" />
                          <div className="mt-auto pt-3 flex justify-between items-center">
                            <div className="w-12 h-3 bg-slate-200 rounded-full" />
                            <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br opacity-80", active.color)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {t.solutionsPage.stats.map((stat, i) => (
              <div key={i} className="group">
                <div className="text-4xl font-black text-matgarco-700 mb-2 group-hover:scale-110 transition-transform">{stat.num}</div>
                <div className="text-slate-500 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        
      </main>
      <GlobalFooter />
    </div>
  );
}
