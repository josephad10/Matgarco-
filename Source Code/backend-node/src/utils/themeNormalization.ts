export interface NormalizedSection {
  id: string;
  type: string;
  enabled: boolean;
  variant?: string;
  settings: Record<string, any>;
  blocks: Array<{ id: string; type: string; settings: Record<string, any> }>;
  [key: string]: any;
}

export interface NormalizedPage {
  sections: NormalizedSection[];
  [key: string]: any;
}

type SectionFallback = {
  variant?: string;
  settings?: Record<string, any>;
  blocks?: Array<{ type: string; settings: Record<string, any> }>;
};

const createSectionId = (type: string) => `${type}-${Math.random().toString(36).slice(2, 8)}`;
const createBlockId = (sectionId: string, index: number) => `${sectionId}-blk-${index + 1}`;

export function deriveSectionFallbacksFromPages(pages: any): Record<string, SectionFallback> {
  const fallbacks: Record<string, SectionFallback> = {};
  const sourcePages = pages && typeof pages === 'object' ? pages : {};

  for (const page of Object.values(sourcePages)) {
    const sections = Array.isArray((page as any)?.sections) ? (page as any).sections : [];
    for (const section of sections) {
      const type = section?.type || section?.id;
      if (!type || fallbacks[type]) continue;

      fallbacks[type] = {
        variant: section?.variant,
        settings: section?.settings || section?.config || {},
        blocks: Array.isArray(section?.blocks)
          ? section.blocks.map((block: any) => ({
              type: block?.type,
              settings: block?.settings || {},
            }))
          : [],
      };
    }
  }

  return fallbacks;
}

export function normalizeThemeSection(
  section: any,
  sectionFallbacks: Record<string, SectionFallback> = {}
): NormalizedSection {
  const resolvedType = section?.type || section?.id || 'custom';
  const sectionId = section?.id || createSectionId(resolvedType);
  const fallback = sectionFallbacks[resolvedType] || {};

  const rawSettings = section?.settings || section?.config || {};
  const settings = {
    ...(fallback.settings || {}),
    ...(typeof rawSettings === 'object' && rawSettings ? rawSettings : {}),
  };

  const rawBlocks = section?.blocks ?? fallback.blocks ?? [];
  const blocks = Array.isArray(rawBlocks)
    ? rawBlocks.map((block: any, index: number) => ({
        id: block?.id || createBlockId(sectionId, index),
        type: block?.type || 'custom',
        settings: block?.settings || {},
      }))
    : [];

  return {
    id: sectionId,
    type: resolvedType,
    name: section?.name,
    enabled: section?.enabled ?? true,
    variant: section?.variant ?? fallback.variant,
    settings,
    blocks,
  };
}

export function normalizeThemePages(
  rawPages: any,
  fallbackPages: Record<string, { sections: any[]; [key: string]: any }> = {}
): Record<string, NormalizedPage> {
  const sourcePages = rawPages && typeof rawPages === 'object' ? rawPages : fallbackPages;
  const sectionFallbacks = deriveSectionFallbacksFromPages(fallbackPages);

  const pageKeys = new Set<string>([...Object.keys(fallbackPages), ...Object.keys(sourcePages)]);
  const normalized: Record<string, NormalizedPage> = {};

  for (const pageKey of pageKeys) {
    const sourcePage = (sourcePages as any)[pageKey] || {};
    const fallbackPage = (fallbackPages as any)[pageKey] || {};
    const sections = Array.isArray(sourcePage.sections)
      ? sourcePage.sections
      : Array.isArray(fallbackPage.sections)
        ? fallbackPage.sections
        : [];

    normalized[pageKey] = {
      ...fallbackPage,
      ...sourcePage,
      sections: sections.map((section: any) => normalizeThemeSection(section, sectionFallbacks)),
    };
  }

  if (!normalized.home && fallbackPages.home) {
    normalized.home = {
      ...fallbackPages.home,
      sections: (fallbackPages.home.sections || []).map((section: any) => normalizeThemeSection(section, sectionFallbacks)),
    };
  }

  return normalized;
}
