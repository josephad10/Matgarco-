/**
 * Theme engine — converts ThemeData into CSS custom properties
 * injected into <html> so every component can use var(--color-primary) etc.
 *
 * NEW SYSTEM: theme.globalSettings.colors / .typography / .layout
 * LEGACY (will be removed): theme.colors / theme.fonts
 */

import type { ThemeData } from '@/types/theme';

// Default colour palette — used when theme has empty/missing colors
const DEFAULT_COLORS = {
  primary:    '#3B82F6',
  secondary:  '#1E40AF',
  background: '#F8FAFC',
  surface:    '#FFFFFF',
  text:       '#111827',
  textMuted:  '#6B7280',
  accent:     '#10B981',
  border:     '#E5E7EB',
};

const DEFAULT_FONTS = {
  headingFont: 'Cairo',
  fontFamily:  'Cairo',
  fontSize:    'md',
};

const FONT_SCALE: Record<string, string> = {
  sm: '15px',
  md: '16px',
  lg: '17px',
};

/**
 * Build a <style> string of CSS variables from ThemeData.
 */
export function buildCSSVariables(theme: ThemeData): string {
  // New system: globalSettings.colors — Legacy: theme.colors
  const rawColors: any = theme.globalSettings?.colors || theme.colors || {};
  const colors = { ...DEFAULT_COLORS, ...rawColors };

  // New system: globalSettings.typography — Legacy: theme.fonts
  const rawTypo: any = theme.globalSettings?.typography || theme.fonts || {};
  const typography = { ...DEFAULT_FONTS, ...rawTypo };

  const heading = typography.headingFont || typography.heading || DEFAULT_FONTS.headingFont;
  const body    = typography.fontFamily  || typography.body    || DEFAULT_FONTS.fontFamily;
  const size    = FONT_SCALE[typography.fontSize || typography.size || 'md'] ?? '16px';

  // Layout direction
  const layout: any = theme.globalSettings?.layout || {};
  const direction = layout.direction || theme.store?.direction || 'rtl';

  return `
    :root {
      --color-primary:     ${colors.primary};
      --color-secondary:   ${colors.secondary};
      --color-background:  ${colors.background};
      --color-surface:     ${colors.surface};
      --color-text:        ${colors.text};
      --color-text-muted:  ${colors.textMuted};
      --color-accent:      ${colors.accent};
      --color-border:      ${colors.border};

      /* Legacy aliases (some components use short names) */
      --primary:      ${colors.primary};
      --secondary:    ${colors.secondary};
      --background:   ${colors.background};
      --surface:      ${colors.surface};
      --text:         ${colors.text};
      --text-muted:   ${colors.textMuted};
      --accent:       ${colors.accent};
      --border:       ${colors.border};

      --font-heading:    '${heading}', sans-serif;
      --font-body:       '${body}', sans-serif;
      --font-base-size:  ${size};

      --radius: 0.75rem;
    }

    html {
      font-size: var(--font-base-size);
      font-family: var(--font-body);
      background-color: var(--color-background);
      color: var(--color-text);
      direction: ${direction};
    }
  `.trim();
}

/**
 * Returns the Google Fonts URL for the heading + body fonts.
 */
export function buildGoogleFontsURL(theme: ThemeData): string {
  const rawTypo: any = theme.globalSettings?.typography || theme.fonts || {};
  const heading = rawTypo.headingFont || rawTypo.heading || DEFAULT_FONTS.headingFont;
  const body    = rawTypo.fontFamily  || rawTypo.body    || DEFAULT_FONTS.fontFamily;
  const families = [...new Set([heading, body])];
  const query = families
    .map((f) => `family=${encodeURIComponent(f)}:wght@300;400;500;600;700;900`)
    .join('&');
  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}
