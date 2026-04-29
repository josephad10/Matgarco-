"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  MessageCircle, 
  Globe, 
  Filter, 
  Users,
  Instagram,
  Facebook,
  MessageSquare,
  Globe2
} from "lucide-react";

export function EcosystemBentoGrid() {
  const { t, lang } = useLanguage();
  const eco = t.ecosystem?.cards;

  if (!eco) return null;

  const CardWrapper = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, y: -5, boxShadow: "0px 10px 30px rgba(0,0,128,0.4)" }}
      className={`bg-[#050505] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden group hover:border-[#3B82F6]/30 transition-colors transform-gpu will-change-transform ${className}`}
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000080]/0 via-transparent to-[#3B82F6]/0 group-hover:from-[#000080]/10 group-hover:to-[#3B82F6]/5 transition-all duration-500 pointer-events-none" />
      {children}
    </motion.div>
  );

  const Badge = ({ icon: Icon, text }: { icon: any, text: string }) => (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#000080]/30 border border-[#3B82F6]/20 text-white font-medium text-sm w-max mb-4 group-hover:bg-[#3B82F6]/20 transition-colors">
      <Icon size={16} className="text-[#3B82F6]" />
      {text}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full" dir={lang === "ar" ? "rtl" : "ltr"}>
      
      {/* Card 1: Media Buyer */}
      <CardWrapper className="md:col-span-5 lg:col-span-4" delay={0.1}>
        <div className="flex-grow">
          {/* Mockup */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-8 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-sm border border-orange-500/20">MH</div>
              <div>
                <div className="text-white font-medium text-sm">{eco.mediaBuyer.name}</div>
                <div className="text-orange-400 text-xs">{eco.mediaBuyer.role}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                <div className="text-green-400 text-xs mb-1">{eco.mediaBuyer.salesLabel}</div>
                <div className="text-white font-bold">9.7M</div>
              </div>
              <div className="flex-1 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                <div className="text-blue-400 text-xs mb-1">{eco.mediaBuyer.ordersLabel}</div>
                <div className="text-white font-bold">17.8k</div>
              </div>
            </div>
          </div>
        </div>
        <Badge icon={TrendingUp} text={eco.mediaBuyer.badge} />
        <p className="text-sm text-gray-400 leading-relaxed mt-2">{eco.mediaBuyer.desc}</p>
      </CardWrapper>

      {/* Card 2: Social Inbox */}
      <CardWrapper className="md:col-span-7 lg:col-span-8" delay={0.2}>
        <div className="flex-grow flex items-center justify-center min-h-[200px] relative mb-8">
          {/* Mockup */}
          <div className="absolute w-full max-w-sm aspect-video flex items-center justify-center">
            {/* Center Logo */}
            <div className="w-16 h-16 rounded-2xl bg-[#000080]/80 border border-[#3B82F6]/50 flex items-center justify-center z-10 shadow-[0_0_60px_rgba(0,0,128,0.9)]">
              <span className="text-white font-black text-2xl">M</span>
            </div>
            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full text-white/10" pointerEvents="none">
              <motion.line x1="20%" y1="20%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" animate={{ strokeDashoffset: [20, 0] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
              <motion.line x1="80%" y1="20%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" animate={{ strokeDashoffset: [20, 0] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
              <motion.line x1="20%" y1="80%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" animate={{ strokeDashoffset: [20, 0] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
              <motion.line x1="80%" y1="80%" x2="50%" y2="50%" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" animate={{ strokeDashoffset: [20, 0] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
            </svg>
            {/* Nodes */}
            <div className="absolute top-[10%] left-[10%] w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center"><MessageCircle size={18} /></div>
            <div className="absolute top-[10%] right-[10%] w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center"><MessageSquare size={18} /></div>
            <div className="absolute bottom-[10%] left-[10%] w-10 h-10 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center"><Instagram size={18} /></div>
            <div className="absolute bottom-[10%] right-[10%] w-10 h-10 rounded-full bg-blue-600/20 text-blue-600 flex items-center justify-center"><Facebook size={18} /></div>
          </div>
        </div>
        <Badge icon={MessageCircle} text={eco.socialInbox.badge} />
        <p className="text-sm text-gray-400 leading-relaxed mt-2">{eco.socialInbox.desc}</p>
      </CardWrapper>

      {/* Card 3: Custom Domain */}
      <CardWrapper className="md:col-span-4 lg:col-span-4" delay={0.3}>
        <div className="flex-grow flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
            <Globe2 size={28} />
          </div>
          <div className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-center text-white/50 text-sm font-mono mb-3">
            {eco.customDomain.placeholder}
          </div>
          <div className="text-[10px] text-emerald-400 font-medium bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
            {eco.customDomain.instantPaymentsBadge}
          </div>
        </div>
        <Badge icon={Globe} text={eco.customDomain.badge} />
        <p className="text-sm text-gray-400 leading-relaxed mt-2">{eco.customDomain.desc}</p>
      </CardWrapper>

      {/* Card 4: Funnel Builder */}
      <CardWrapper className="md:col-span-4 lg:col-span-4" delay={0.4}>
        <div className="flex-grow flex flex-col justify-center gap-3 mb-8 px-4">
          {/* Funnel Mockup */}
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }} className="w-full h-8 bg-[#3B82F6]/30 rounded-t-lg mx-auto border border-[#3B82F6]/50 transform-gpu" />
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="w-4/5 h-8 bg-[#3B82F6]/20 mx-auto border-x border-[#3B82F6]/30 transform-gpu" />
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} className="w-3/5 h-8 bg-[#3B82F6]/10 rounded-b-lg mx-auto border border-[#3B82F6]/20 transform-gpu" />
        </div>
        <Badge icon={Filter} text={eco.funnelBuilder.badge} />
        <p className="text-sm text-gray-400 leading-relaxed mt-2">{eco.funnelBuilder.desc}</p>
      </CardWrapper>

      {/* Card 5: Community */}
      <CardWrapper className="md:col-span-4 lg:col-span-4" delay={0.5}>
        <div className="flex-grow mb-8">
          {/* Post Mockup */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold text-xs border border-pink-500/20">AH</div>
              <div>
                <div className="text-white font-medium text-xs">{eco.community.author}</div>
                <div className="text-white/40 text-[10px]">{eco.community.handle}</div>
              </div>
            </div>
            <p className="text-white/80 text-xs mb-3">{eco.community.post}</p>
            <div className="flex gap-4 text-white/40 text-xs">
              <span className="flex items-center gap-1"><MessageCircle size={12} /> 12</span>
              <span className="flex items-center gap-1"><TrendingUp size={12} /> 28</span>
            </div>
          </div>
        </div>
        <Badge icon={Users} text={eco.community.badge} />
        <p className="text-sm text-gray-400 leading-relaxed mt-2">{eco.community.desc}</p>
      </CardWrapper>

    </div>
  );
}
