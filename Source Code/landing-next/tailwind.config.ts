import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        matgarco: {
          navy: '#000080',
          black: '#050505',
          50: '#e5f2ff',
          100: '#cce6ff',
          200: '#99cdff',
          300: '#66b4ff',
          400: '#339bff',
          500: '#0082ff',
          600: '#006ed9',
          700: '#000080', 
          800: '#000066',
          900: '#00004d',
          950: '#000033',
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background, #050505)", 
        surface: "var(--surface, #111111)", 
        foreground: "var(--foreground, #F8FAFC)", 
        primary: "var(--primary, #000080)",
      },
      boxShadow: {
        'neu-inner': 'inset 4px 4px 10px rgba(0, 0, 0, 0.4), inset -4px -4px 10px rgba(255, 255, 255, 0.02)',
        'neu-glow': '0 0 20px rgba(0, 0, 128, 0.4)'
      },
      fontFamily: {
        sans: ["var(--font-tajawal)", "var(--font-inter)", "sans-serif"],
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "marquee": "marquee 30s linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "slow-zoom": "slow-zoom 35s alternate infinite linear",
        "twinkle": "twinkle 4s alternate infinite ease-in-out",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        "slow-zoom": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.15)" },
        },
        "twinkle": {
          "0%": { opacity: "0.1" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0.1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
