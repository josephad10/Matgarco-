"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { Facebook, Twitter, Instagram, Linkedin, Shield, Send, MessageCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

// Generic TikTok Icon
const TikTokIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);

export function GlobalFooter() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";

  const socialLinks = [
    { Icon: Facebook, href: "#" },
    { Icon: Twitter, href: "#" },
    { Icon: Instagram, href: "#" },
    { Icon: Linkedin, href: "#" },
    { Icon: TikTokIcon, href: "#" },
    { Icon: MessageCircle, href: "#" }, // WhatsApp
  ];

  return (
    <footer dir={isRtl ? "rtl" : "ltr"} className="relative overflow-hidden bg-[#000000] pt-20 pb-8 text-white">
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent z-10"></div>
      
      {/* Navy Nebula Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[1000px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          
          {/* Brand Area */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Matgarco"
                width={195}
                height={48}
                className="object-contain"
              />
              <sup className="text-[10px] text-gray-500 font-bold -mt-4">®</sup>
            </div>
            
            <p className="mt-8 text-sm text-gray-400 leading-relaxed max-w-sm">
              {t.footer?.description}
            </p>

            <div className="flex items-center gap-5 mt-10">
              {socialLinks.map(({ Icon, href }, idx) => (
                <span 
                  key={idx} 
                  className="text-gray-400 hover:text-white hover:scale-110 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-300 cursor-pointer"
                >
                  <Icon size={20} />
                </span>
              ))}
            </div>
          </div>

          {/* Links Area */}
          {t.footer?.columns?.map((column: any, colIdx: number) => (
            <div key={colIdx} className="lg:col-span-1">
              <h3 className="text-white font-semibold text-lg mb-8 uppercase tracking-wider text-[13px]">
                {column.title}
              </h3>
              <div className="flex flex-col gap-4">
                {column.links.map((link: string, linkIdx: number) => {
                  const isSoon = link === "Mobile App" || 
                                 link === "تطبيق الجوال" || 
                                 link === "Developer API" || 
                                 link === "واجهة المطورين";

                  return (
                    <span 
                      key={linkIdx} 
                      className="block text-[13px] text-gray-400 hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 transition-all duration-200 cursor-pointer mb-1 w-fit"
                    >
                      {link}
                      {isSoon && (
                        <span className={`${isRtl ? "mr-2" : "ml-2"} px-2 py-0.5 text-[9px] bg-blue-900/40 text-blue-400 border border-blue-500/30 rounded-full font-bold uppercase tracking-tighter`}>
                          Soon
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-gray-500 font-medium tracking-wide">
          
          <div className="flex items-center">
            {t.footer?.bottomBar?.copyright}
          </div>

          <div className="flex items-center gap-4">
            {t.footer?.bottomBar?.policyLinks?.map((link: string, idx: number) => (
              <React.Fragment key={idx}>
                <span className="hover:text-white cursor-pointer transition-colors">
                  {link}
                </span>
                {idx < t.footer.bottomBar.policyLinks.length - 1 && (
                  <span className="text-gray-700">•</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.footer?.bottomBar?.secured}</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
