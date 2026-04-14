import { headers } from 'next/headers';

/**
 * Check if the current request is in preview mode.
 * Works in any server component — reads the x-preview header
 * set by the middleware when ?preview=1 is in the URL.
 */
export function isPreviewMode(): boolean {
  try {
    const h = headers();
    return h.get('x-preview') === '1';
  } catch {
    return false;
  }
}

/**
 * Super Admin Template Maker preview injection
 */
export function getMasterThemeId(): string | null {
  try {
    return headers().get('x-master-theme');
  } catch {
    return null;
  }
}
