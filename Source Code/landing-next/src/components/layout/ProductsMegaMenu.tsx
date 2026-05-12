"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  LayoutTemplate,
  Globe,
  Cpu,
  Truck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductsMegaMenuProps {
  isOpen: boolean;
}

export const ProductsMegaMenu: React.FC<ProductsMegaMenuProps> = ({
  isOpen,
}) => {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const hub = t.productsHub;

  if (!hub) return null;

  const PointerIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute top-[80px] left-0 w-full flex justify-center pt-2 px-6 z-[100] cursor-default pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.97 }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="w-full max-w-[1200px] pointer-events-auto bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden origin-top"
          >
            <div
              className={`grid grid-cols-1 lg:grid-cols-12 p-10 gap-10 ${isRtl ? "text-right" : "text-left"}`}
              dir={isRtl ? "rtl" : "ltr"}
            >
              {/* Column 1: Core Architecture */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-12">
                <h3 className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold px-2">
                  {hub.megaMenu.primaryTitle}
                </h3>
                <div className="flex flex-col gap-10">
                  <MenuLink
                    title={hub.themes.title}
                    subtitle={hub.themes.subtitle}
                    link={hub.themes.link}
                    icon={<LayoutTemplate className="w-8 h-8" />}
                    gradient="from-blue-50 to-blue-100"
                    border="border-blue-200"
                    color="text-blue-600"
                  />
                  <MenuLink
                    title={hub.domains.title}
                    subtitle={hub.domains.subtitle}
                    link={hub.domains.link}
                    icon={<Globe className="w-8 h-8" />}
                    gradient="from-emerald-50 to-emerald-100"
                    border="border-emerald-200"
                    color="text-emerald-600"
                  />
                </div>
              </div>

              {/* Column 2: Ecosystem */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-12">
                <h3 className="text-xs uppercase tracking-[0.25em] text-slate-400 font-bold px-2">
                  {hub.megaMenu.featuresTitle}
                </h3>
                <div className="flex flex-col gap-10">
                  <MenuLink
                    title={hub.ship.title}
                    subtitle={hub.ship.subtitle}
                    link={hub.ship.link}
                    icon={<Truck className="w-8 h-8" />}
                    gradient="from-indigo-50 to-indigo-100"
                    border="border-indigo-200"
                    color="text-indigo-600"
                  />
                  <MenuLink
                    title={hub.pay.title}
                    subtitle={hub.pay.subtitle}
                    link={hub.pay.link}
                    icon={<CreditCard className="w-8 h-8" />}
                    gradient="from-purple-50 to-purple-100"
                    border="border-purple-200"
                    color="text-purple-600"
                  />
                </div>
              </div>

              {/* Column 3: The Showstopper (Quantus AI) */}
              <div className="col-span-12 lg:col-span-4 h-full">
                <Link
                  href={hub.quantusAI.link}
                  className="group block h-full outline-none"
                >
                  <div className="bg-[#050505] rounded-[2rem] p-8 h-full flex flex-col justify-between relative overflow-hidden group shadow-2xl border border-slate-800">
                    {/* Breathing Neon */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 rounded-full blur-[60px] group-hover:bg-emerald-500/30 transition-colors duration-1000 animate-pulse" />

                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-white mb-8 backdrop-blur-xl group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500">
                        <Cpu className="w-8 h-8" />
                      </div>
                      <h4 className="text-3xl font-black text-white mb-4 tracking-tighter">
                        {hub.quantusAI.title}
                      </h4>
                      <p className="text-slate-400 text-[15px] font-medium leading-relaxed max-w-[90%] opacity-80 group-hover:opacity-100 transition-opacity">
                        {hub.quantusAI.subtitle}
                      </p>
                    </div>

                    <div className="relative z-10 mt-12">
                      <div className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#050505] font-black rounded-full group-hover:scale-105 transition-transform duration-300">
                        {isRtl ? "ابدأ التوليد" : "Start Generating"}
                        <PointerIcon
                          className={cn(
                            "w-5 h-5 transition-transform duration-300",
                            isRtl
                              ? "group-hover:-translate-x-1"
                              : "group-hover:translate-x-1",
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface MenuLinkProps {
  title: string;
  subtitle: string;
  link: string;
  icon: React.ReactNode;
  gradient: string;
  border: string;
  color: string;
}

const MenuLink: React.FC<MenuLinkProps> = ({
  title,
  subtitle,
  link,
  icon,
  gradient,
  border,
  color,
}) => {
  return (
    <Link
      href={link}
      className="block group hover:bg-slate-50 p-6 -m-6 rounded-3xl transition-colors duration-300 outline-none"
    >
      <div className="flex items-start gap-6">
        <div
          className={cn(
            "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm border bg-gradient-to-br group-hover:scale-110 transition-transform duration-500 shrink-0",
            gradient,
            border,
            color,
          )}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="text-2xl font-black text-[#050505] mb-2 tracking-tight group-hover:text-blue-700 transition-colors">
            {title}
          </h4>
          <p className="text-sm font-medium text-slate-500 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity line-clamp-2">
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
};
