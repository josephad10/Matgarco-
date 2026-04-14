import React from "react";
import { cn } from "@/lib/utils"; // We'll create a basic utils file for tailwind-merge

interface BentoCardProps {
  title: string;
  description: string;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  backgroundImage?: string;
}

export const BentoCard = ({
  title,
  description,
  className,
  icon,
  children,
  backgroundImage,
}: BentoCardProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 group transition-all duration-300 hover:shadow-xl hover:shadow-matgarco-500/10 hover:-translate-y-1",
        className
      )}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none transition-opacity duration-300 group-hover:opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      <div className="relative z-10 flex flex-col gap-3">
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-matgarco-50 flex items-center justify-center text-matgarco-700 mb-4 transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
        )}
        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-matgarco-700 transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 leading-relaxed text-lg">
          {description}
        </p>
      </div>
      <div className="relative z-10 mt-8 flex-grow">
        {children}
      </div>
      
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-matgarco-400/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-6",
        className
      )}
    >
      {children}
    </div>
  );
};
