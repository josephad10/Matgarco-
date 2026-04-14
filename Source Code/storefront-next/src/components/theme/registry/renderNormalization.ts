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

interface NormalizeRenderOptions {
  excludeTypes?: string[];
}

export function normalizeRenderableSection(rawSection: any): RenderSectionData {
  const resolvedId = rawSection?.id ?? `section-${Math.random().toString(36).slice(2, 8)}`;
  const resolvedType = rawSection?.type ?? rawSection?.id ?? 'custom';
  const rawBlocks = rawSection?.blocks ?? [];

  return {
    id: resolvedId,
    type: resolvedType,
    enabled: rawSection?.enabled ?? true,
    variant: rawSection?.variant,
    settings: {
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
