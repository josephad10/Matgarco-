"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MegaCTA } from "@/components/sections/MegaCTA";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Target,
  Eye,
  Heart,
  Sparkles,
  TrendingUp,
  Shield,
  Lightbulb,
  HeadphonesIcon,
} from "lucide-react";

const valuesIcons = [
  <Shield key="s" size={24} />,
  <Lightbulb key="l" size={24} />,
  <HeadphonesIcon key="h" size={24} />,
  <TrendingUp key="t" size={24} />,
];

const valuesColors = [
  "bg-blue-50 text-blue-600",
  "bg-purple-50 text-purple-600",
  "bg-emerald-50 text-emerald-600",
  "bg-amber-50 text-amber-600",
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <section className="pt-32 pb-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-matgarco-50 border border-matgarco-100 text-matgarco-700 text-sm font-bold mb-6">
              <Sparkles size={16} /> {t.aboutPage.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              {t.aboutPage.heroTitle1}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-matgarco-600 to-cyan-500">
                {t.aboutPage.heroTitle2}
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              {t.aboutPage.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-slate-50 border-y border-slate-100">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Mission Card */}
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-matgarco-50 flex items-center justify-center text-matgarco-700 mb-8 group-hover:scale-110 transition-transform">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {t.aboutPage.missionTitle}
              </h3>
              <p className="text-lg text-slate-500 leading-relaxed">
                {t.aboutPage.missionDesc}
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-8 group-hover:scale-110 transition-transform">
                <Eye size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {t.aboutPage.visionTitle}
              </h3>
              <p className="text-lg text-slate-500 leading-relaxed">
                {t.aboutPage.visionDesc}
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                {t.aboutPage.valuesTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.aboutPage.values.map((value, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col items-center text-center p-8 rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${valuesColors[idx]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    {valuesIcons[idx]}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team section */}
        <section className="py-20 bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-sm font-bold mb-6">
              <Heart size={16} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t.aboutPage.teamTitle}
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto mb-12">
              {t.aboutPage.teamSubtitle}
            </p>

            {/* Team member avatars */}
            <div className="flex justify-center -space-x-4">
              {["M", "S", "A", "K", "R", "N"].map((initial, idx) => {
                const colors = [
                  "bg-matgarco-500",
                  "bg-rose-500",
                  "bg-emerald-500",
                  "bg-indigo-500",
                  "bg-amber-500",
                  "bg-teal-500",
                ];
                return (
                  <div
                    key={idx}
                    className={`w-16 h-16 rounded-full ${colors[idx]} border-4 border-slate-50 flex items-center justify-center text-white font-bold text-xl shadow-lg hover:scale-110 hover:z-10 transition-transform`}
                  >
                    {initial}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <MegaCTA />
      </main>

      <Footer />
    </div>
  );
}
