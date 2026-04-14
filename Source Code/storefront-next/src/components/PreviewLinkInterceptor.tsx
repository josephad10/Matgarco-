'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

/**
 * Client component that intercepts anchor clicks to:
 * 1. Maintain ?preview=1 for draft themes.
 * 2. Prepend /store/[subdomain] for path-based routing on localhost. 
 */
export default function PreviewLinkInterceptor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isPreview = searchParams.get('preview') === '1';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a');
      if (!anchor) return;

      let href = anchor.getAttribute('href');
      if (!href) return;

      // Skip external links, anchors, mailto, tel, javascript
      if (
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:')
      ) {
        return;
      }

      let modified = false;

      // --- 1. Fix Path-Based Routing (Localhost shortcut) ---
      // If we are browsing via `http://localhost:3001/store/demo-store`
      // A link to `/categories` should become `/store/demo-store/categories`
      if (window.location.pathname.startsWith('/store/')) {
        const subdomainMatch = window.location.pathname.match(/^\/store\/([^\/]+)/);
        const subdomain = subdomainMatch ? subdomainMatch[1] : null;
        
        if (subdomain && href.startsWith('/') && !href.startsWith('/store/')) {
          href = `/store/${subdomain}${href === '/' ? '' : href}`;
          modified = true;
        }
      }

      // --- 2. Maintain Preview State ---
      if (isPreview) {
        let qsObj = new URLSearchParams(href.split('?')[1] || '');
        if (!qsObj.has('preview')) qsObj.set('preview', '1');
        
        const masterId = searchParams.get('master_theme_id');
        if (masterId && !qsObj.has('master_theme_id')) {
          qsObj.set('master_theme_id', masterId);
        }
        
        href = `${href.split('?')[0]}?${qsObj.toString()}`;
        modified = true;
      }

      if (modified) {
        e.preventDefault();
        e.stopPropagation();
        router.push(href);
      }
    };

    // Use capture phase to intercept before Next.js Link handler
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [isPreview, router]);

  return null;
}
