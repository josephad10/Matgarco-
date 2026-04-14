import { SectionRegistry } from './registry';

export interface RenderSectionData {
  id: string;
  type: string;
  enabled: boolean;
  variant?: string;
  settings: Record<string, any>;
  blocks: Array<{
    id: string;
    type: string;
    settings: Record<string, any>;
  }>;
}

export interface RenderPageData {
  sections: RenderSectionData[];
  [key: string]: any;
}

interface NormalizeRenderOptions {
  excludeTypes?: string[];
}

interface NormalizePagesOptions {
  fallbackPages?: Record<string, { sections: any[]; [key: string]: any }>;
}

export function normalizeRenderableSection(rawSection: any): RenderSectionData {
  const resolvedId = rawSection?.id ?? `section-${Math.random().toString(36).slice(2, 8)}`;
  const resolvedType = rawSection?.type ?? rawSection?.id ?? 'custom';
  const schema = SectionRegistry[resolvedType];
  const preset = schema?.presets?.[0];
  const rawBlocks = rawSection?.blocks ?? preset?.blocks ?? [];

  return {
    id: resolvedId,
    type: resolvedType,
    enabled: rawSection?.enabled ?? true,
    variant: rawSection?.variant ?? schema?.defaultVariant,
    settings: {
      ...(preset?.settings ?? {}),
      ...(rawSection?.settings ?? rawSection?.config ?? {}),
    },
    blocks: Array.isArray(rawBlocks)
      ? rawBlocks.map((block: any, index: number) => ({
          id: block?.id ?? `${resolvedId}-blk-${index + 1}`,
          type: block?.type,
          settings: block?.settings ?? {},
        }))
      : [],
  };
}

export function normalizeRenderableSections(
  rawSections: any[] = [],
  options: NormalizeRenderOptions = {}
): RenderSectionData[] {
  const excludeTypes = new Set(options.excludeTypes || []);

  return rawSections
    .map(normalizeRenderableSection)
    .filter((section) => !excludeTypes.has(section.type));
}

export function normalizeRenderablePages(
  rawPages: any,
  options: NormalizePagesOptions = {}
): Record<string, RenderPageData> {
  const fallbackPages = options.fallbackPages || {};
  const sourcePages = rawPages && typeof rawPages === 'object' ? rawPages : fallbackPages;
  const pageKeys = new Set<string>([...Object.keys(fallbackPages), ...Object.keys(sourcePages)]);
  const normalized: Record<string, RenderPageData> = {};

  for (const pageKey of pageKeys) {
    const sourcePage = sourcePages[pageKey] || {};
    const fallbackPage = fallbackPages[pageKey] || {};
    const sourceSections = Array.isArray(sourcePage.sections) ? sourcePage.sections : undefined;
    const fallbackSections = Array.isArray(fallbackPage.sections) ? fallbackPage.sections : [];

    normalized[pageKey] = {
      ...fallbackPage,
      ...sourcePage,
      sections: normalizeRenderableSections(sourceSections ?? fallbackSections),
    };
  }

  if (!normalized.home && fallbackPages.home) {
    normalized.home = {
      ...fallbackPages.home,
      sections: normalizeRenderableSections(fallbackPages.home.sections || []),
    };
  }

  return normalized;
}
