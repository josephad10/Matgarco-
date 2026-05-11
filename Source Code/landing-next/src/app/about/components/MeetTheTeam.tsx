"use client";

import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent } from "react";

const colorMap: Record<string, { border: string; glow: string; text: string }> =
  {
    navy: {
      border: "group-hover:border-b-[#000080]",
      glow: "from-[#000080]/60 via-[#000080]/10 to-transparent",
      text: "text-blue-400",
    },
    purple: {
      border: "group-hover:border-b-purple-500",
      glow: "from-purple-500/60 via-purple-500/10 to-transparent",
      text: "text-purple-400",
    },
    green: {
      border: "group-hover:border-b-emerald-500",
      glow: "from-emerald-500/60 via-emerald-500/10 to-transparent",
      text: "text-emerald-400",
    },
    gold: {
      border: "group-hover:border-b-yellow-500",
      glow: "from-yellow-500/60 via-yellow-500/10 to-transparent",
      text: "text-yellow-400",
    },
    red: {
      border: "group-hover:border-b-red-500",
      glow: "from-red-500/60 via-red-500/10 to-transparent",
      text: "text-red-400",
    },
    gray: {
      border: "group-hover:border-b-slate-400",
      glow: "from-slate-400/60 via-slate-400/10 to-transparent",
      text: "text-slate-300",
    },
  };

function TeamCard({ member }: { member: any }) {
  const { t } = useLanguage();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 40 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 40 });

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const styles = colorMap[member.color] || colorMap.gray;

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 border-b-4 transition-all duration-500 hover:scale-105 ${styles.border}`}
    >
      {/* Searchlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-screen"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${springX}px ${springY}px,
              rgba(255,255,255,0.08),
              transparent 80%
            )
          `,
        }}
      />

      {/* Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${styles.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0`}
      />

      {/* Portrait Aspect Ratio Container */}
      <div className="relative w-full aspect-[4/5] bg-[#000000] overflow-hidden z-20">
        <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105">
          <Image 
            src={member.img}
            alt={member.name}
            fill
            style={{ objectPosition: member.focus || 'center' }}
            className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 relative z-20">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {member.name}
          </h3>
          <Link
            href={member.link}
            target="_blank"
            className="opacity-50 hover:opacity-100 transition-opacity"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </Link>
        </div>

        <p
          className={`text-sm font-bold text-slate-400 group-hover:${styles.text} transition-colors duration-500 text-center mb-5`}
        >
          {member.role}
        </p>

        <div className="text-xs text-slate-400 leading-relaxed text-center flex-1">
          <span className="font-bold text-white">
            {t.aboutMegaPage.team.responsibility}{" "}
          </span>
          {member.desc}
        </div>

        <div className="mt-5 pt-4 border-t border-white/5 text-center flex items-center justify-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px]">⚡</span>
          <p className="text-[11px] italic text-white font-medium tracking-wide">
            {member.quote}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MeetTheTeam() {
  const { t, lang } = useLanguage();
  const isRtl = lang === "ar";
  const copy = t.aboutMegaPage?.team;

  if (!copy) return null;

  return (
    <section className="relative w-full py-24 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            {copy.title}
          </h2>
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {copy.members.map((member: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <TeamCard member={member} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
