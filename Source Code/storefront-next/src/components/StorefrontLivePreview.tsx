'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { buildCSSVariables } from '@/lib/theme';

export default function StorefrontLivePreview() {
  const router = useRouter();

  useEffect(() => {
    const isIframe = window !== window.parent;
    if (!isIframe) return; // Only run inside Merchant Dashboard Builder iframe

    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'STORE_THEME_UPDATE') {
        const payload = e.data.payload;
        
        // 1. Instantly update CSS variables for 60fps design tweaks (colors, typography)
        const cssString = buildCSSVariables({ 
          // reconstruct enough of the theme object for the CSS generator
          globalSettings: payload.globalSettings || {},
          store: payload.store || {}
        } as any);

        let styleTag = document.getElementById('live-preview-styles');
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = 'live-preview-styles';
          document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = cssString;

        // 2. Debounced router.refresh() for structural updates (Section add/remove/reorder)
        // This waits 1s to allow the dashboard to save the draft to the DB before refetching
        clearTimeout((window as any)._previewRefreshTimeout);
        (window as any)._previewRefreshTimeout = setTimeout(() => {
          router.refresh();
        }, 800);
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [router]);

  return null;
}
