import { NextResponse } from "next/server";

// CRITICAL: Prevent Next.js from caching this API route
export const dynamic = "force-dynamic";

const TAKEN_DOMAINS = [
  "apple",
  "zara",
  "nike",
  "amazon",
  "facebook",
  "shopify",
  "google",
  "matgarco",
];

// ─── Mock: Specific TLD overrides for taken domains ──────────────────────────
// In production, this would be a real WHOIS/registrar API lookup.
const TAKEN_EXACT: Record<string, string[]> = {
  apple: [".com", ".net", ".co"],
  zara: [".com", ".net"],
  nike: [".com"],
  amazon: [".com", ".co", ".eg"],
  facebook: [".com", ".net"],
  shopify: [".com", ".io"],
  google: [".com", ".net", ".co", ".ai"],
  matgarco: [".com"],
};

// ─── Advanced Permutation Dictionaries ────────────────────────────────────────

const PREFIXES = ["get", "try", "my", "the", "hello", "weare"];

const SUFFIXES = [
  "hq",
  "labs",
  "studio",
  "app",
  "global",
  "online",
  "store",
  "shop",
  "tech",
  "group",
];

const TRENDY_TLDS: { ext: string; price: string; category: string }[] = [
  { ext: ".io", price: "1,500 EGP/yr", category: "Tech & SaaS" },
  { ext: ".ai", price: "3,500 EGP/yr", category: "AI & Future" },
  { ext: ".co", price: "850 EGP/yr", category: "Startup" },
  { ext: ".app", price: "600 EGP/yr", category: "Digital Product" },
  { ext: ".tech", price: "400 EGP/yr", category: "Technology" },
  { ext: ".net", price: "600 EGP/yr", category: "Global" },
  { ext: ".eg", price: "850 EGP/yr", category: "Local Trust" },
];

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q")?.toLowerCase().trim();

  if (!rawQuery) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  // Extract base name and the user's explicitly requested TLD (if any)
  const parts = rawQuery.split(".");
  const rawBaseName = parts[0];
  const requestedTld =
    parts.length > 1 ? `.${parts.slice(1).join(".")}` : ".com";

  // Sanitize base name: English alphanumeric + hyphens only, strip edge hyphens
  const baseName = rawBaseName
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");

  if (!baseName) {
    return NextResponse.json(
      {
        error:
          "Invalid domain format. Use English letters, numbers, and hyphens.",
      },
      { status: 400 },
    );
  }

  // RFC 1035: Domain labels capped at 63 characters
  if (baseName.length > 63) {
    return NextResponse.json(
      { error: "Domain name exceeds maximum length (63 characters)" },
      { status: 400 },
    );
  }

  // Simulate registrar lookup latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Determine exact-match availability using TLD-aware lookup
  const takenTldsForBase = TAKEN_EXACT[baseName];
  const isExactMatchTaken = takenTldsForBase
    ? takenTldsForBase.includes(requestedTld)
    : false;

  const exactMatchDomain = `${baseName}${requestedTld}`;

  let pool: {
    domain: string;
    price: string;
    available: boolean;
    category: string;
  }[] = [];

  // 1. Trendy TLDs (e.g., facebook.io, facebook.ai)
  for (const tld of TRENDY_TLDS) {
    pool.push({
      domain: `${baseName}${tld.ext}`,
      price: tld.price,
      available: true,
      category: tld.category,
    });
  }

  // 2. Suffix Combinations (e.g., facebookhq.com, facebooklabs.com)
  for (const suffix of SUFFIXES) {
    pool.push({
      domain: `${baseName}${suffix}.com`,
      price: "550 EGP/yr",
      available: true,
      category: "Premium .com",
    });
  }

  // 3. Prefix Combinations (e.g., getfacebook.com, tryfacebook.com)
  for (const prefix of PREFIXES) {
    pool.push({
      domain: `${prefix}${baseName}.com`,
      price: "550 EGP/yr",
      available: true,
      category: "Action .com",
    });
  }

  // 4. Hyphenated Brands (e.g., my-facebook.com, facebook-app.com)
  pool.push({
    domain: `my-${baseName}.com`,
    price: "550 EGP/yr",
    available: true,
    category: "Brand",
  });
  pool.push({
    domain: `${baseName}-app.com`,
    price: "550 EGP/yr",
    available: true,
    category: "App",
  });

  // Filter out the exact match to prevent redundancy
  pool = pool.filter((s) => s.domain !== exactMatchDomain);

  // Fisher-Yates shuffle for high randomization on every request
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Select the top 6 highly diverse suggestions
  const finalSuggestions = pool.slice(0, 6);

  return NextResponse.json({
    exactMatch: {
      domain: exactMatchDomain,
      available: !isExactMatchTaken,
    },
    suggestions: finalSuggestions,
  });
}
