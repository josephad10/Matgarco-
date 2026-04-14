import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Store routing middleware — supports TWO access patterns:
 *
 * 1. Subdomain-based (production & local):
 *      demo.localhost:3001       → /store/demo
 *      mystore.matgarco.com      → /store/mystore
 *
 * 2. Path-based (local dev shortcut):
 *      localhost:3001/demo-store          → /store/demo-store
 *      localhost:3001/demo-store/products → /store/demo-store/products
 *
 * The /store/* routes are always available directly too.
 */

// Routes that belong to the Next.js app itself, NOT store subdomains.
// Also doubles as the canonical blocklist for store slug registration.
const RESERVED_PATHS = new Set([
  'store', 'api', '_next', 'favicon.ico',
  // Infrastructure subdomains that must never resolve to a merchant store
  'www', 'app', 'cdn', 'mail', 'smtp', 'admin', 'static', 'm',
]);

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const isPreview = url.searchParams.get('preview') === '1';
  const masterThemeId = url.searchParams.get('master_theme_id');

  // Prepare headers for React Server Components
  const requestHeaders = new Headers(request.headers);
  if (isPreview) requestHeaders.set('x-preview', '1');
  if (masterThemeId) requestHeaders.set('x-master-theme', masterThemeId);

  // Skip static files and Next.js internals
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Helper: build a response and attach OUTBOUND headers
  function buildResponse(response: NextResponse, sub?: string) {
    if (sub) response.headers.set('x-subdomain', sub);
    if (isPreview) response.headers.set('x-preview', '1');
    if (masterThemeId) response.headers.set('x-master-theme', masterThemeId);
    return response;
  }

  // ── 1. Subdomain-based routing ──
  const hostWithoutPort = hostname.split(':')[0];
  const rootDomains = ['matgarco.com', 'localhost', 'vercel.app'];
  let subdomain = '';

  for (const root of rootDomains) {
    // Anchor match to the END of the hostname so that a host like
    // "api.stores.matgarco.com" never resolves "stores" as the tenant.
    // The regex captures ONLY the single leftmost label that precedes
    // the root, e.g.: "mystore.matgarco.com" → "mystore".
    const anchoredRootRE = new RegExp(`^([a-z0-9][a-z0-9-]*)\.${root.replace('.', '\\.')}$`);
    const match = hostWithoutPort.match(anchoredRootRE);
    if (match) {
      subdomain = match[1]; // exactly one label — no multi-part leakage
      break;
    }
  }

  // Normalise: lowercase the pathname BEFORE any RESERVED_PATHS or slug
  // checks so that mixed-case paths like "/Store/demo" are caught.
  url.pathname = url.pathname.toLowerCase();

  if (subdomain && !RESERVED_PATHS.has(subdomain)) {
    requestHeaders.set('x-subdomain', subdomain);

    // Already under /store/* — skip rewrite but still attach headers
    if (url.pathname.startsWith('/store/')) {
      return buildResponse(NextResponse.next({ request: { headers: requestHeaders } }), subdomain);
    }

    const rewrittenUrl = url.clone();
    rewrittenUrl.pathname = `/store/${subdomain}${url.pathname}`;
    return buildResponse(NextResponse.rewrite(rewrittenUrl, { request: { headers: requestHeaders } }), subdomain);
  }

  // ── 2. Path-based routing (e.g. /demo-store → /store/demo-store) ──
  if (!url.pathname.startsWith('/store/')) {
    const segments = url.pathname.split('/').filter(Boolean);

    // Normalize to lowercase so "/Demo-Store" matches the same slug as
    // "/demo-store" (pathname was already lowercased above).
    const firstSegment = (segments[0] || '').toLowerCase();

    // Regex allows 1-char minimum (e.g. "a") up to 50 chars:
    //   ^[a-z0-9]([a-z0-9-]{0,48}[a-z0-9])?$
    // Breakdown:
    //   [a-z0-9]                 — mandatory first char (no leading hyphen)
    //   ([a-z0-9-]{0,48}[a-z0-9])? — optional body + last char (no trailing hyphen)
    // This correctly accepts 1-char ("a"), 2-char ("eg"), and up to 50-char slugs.
    if (firstSegment && !RESERVED_PATHS.has(firstSegment) && /^[a-z0-9]([a-z0-9-]{0,48}[a-z0-9])?$/.test(firstSegment)) {
      requestHeaders.set('x-subdomain', firstSegment);
      const rewrittenUrl = url.clone();
      rewrittenUrl.pathname = `/store${url.pathname}`;
      return buildResponse(NextResponse.rewrite(rewrittenUrl, { request: { headers: requestHeaders } }), firstSegment);
    }
  }

  // ── 3. Direct /store/* access — attach any URL parameters to headers ──
  return buildResponse(NextResponse.next({ request: { headers: requestHeaders } }));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
