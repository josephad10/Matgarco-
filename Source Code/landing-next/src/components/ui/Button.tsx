import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "shine";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-matgarco-700 text-white hover:bg-matgarco-800 shadow-md",
      outline: "border-2 border-slate-200 text-slate-700 hover:border-matgarco-500 hover:text-matgarco-700",
      ghost: "text-slate-600 hover:bg-slate-100",
      shine: "bg-matgarco-700 text-white relative overflow-hidden group shadow-lg shadow-matgarco-500/30",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg font-bold",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex justify-center items-center rounded-xl font-medium transition-all duration-300",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {variant === "shine" && (
          <span className="absolute inset-0 w-full h-full -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        )}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
);
Button.displayName = "Button";
