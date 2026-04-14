import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/templates/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Arabic fonts sourced from Google Fonts
        cairo:   ['var(--font-heading)', 'Cairo', 'sans-serif'],
        tajawal: ['var(--font-heading)', 'Tajawal', 'sans-serif'],
        almarai: ['var(--font-heading)', 'Almarai', 'sans-serif'],
      },
      colors: {
        // CSS variable-driven palette — set dynamically by theme engine
        primary:    'var(--color-primary)',
        secondary:  'var(--color-secondary)',
        accent:     'var(--color-accent)',
        surface:    'var(--color-surface)',
        'text-base': 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
        border:     'var(--color-border)',
      },
      backgroundColor: {
        page: 'var(--color-background)',
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-in-out',
        'slide-up':    'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0' },               to: { opacity: '1' } },
        slideUp:    { from: { transform: 'translateY(20px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideRight: { from: { transform: 'translateX(-20px)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};

export default config;
