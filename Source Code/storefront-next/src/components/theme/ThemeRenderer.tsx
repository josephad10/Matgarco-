import React from 'react';
import type { ThemeSection } from '@/types/theme';
import { ComponentMap } from './registry/componentMap';
import { normalizeRenderableSections } from './registry/renderNormalization';

interface ThemeRendererProps {
  sections: ThemeSection[];
  storeData?: any;
}

export default function ThemeRenderer({ sections = [], storeData }: ThemeRendererProps) {
  if (!sections || sections.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        لا توجد أقسام محددة في هذا القالب.
      </div>
    );
  }

  // Renderer stays dumb: preserve incoming order and only omit global chrome
  // sections because they are rendered by StorePageShell.
  const orderedSections = normalizeRenderableSections(sections, { excludeTypes: ['header', 'footer'] });

  return (
    <div className="theme-renderer-wrapper w-full min-h-screen flex flex-col">
      {orderedSections.map((section, index) => {
        const typeKey = section.type || '';
        const Component = ComponentMap[typeKey];

        if (!Component) {
          return (
            <div
              key={section.id || index}
              className="p-4 border border-dashed border-amber-300 bg-amber-50 text-amber-600 text-center m-4 rounded text-sm"
            >
              قسم غير معروف: <code>{typeKey}</code>
            </div>
          );
        }

        return (
          <Component
            key={section.id || index}
            id={section.id}
            variant={section.variant}
            settings={section.settings || {}}
            blocks={section.blocks || []}
            storeData={storeData}
          />
        );
      })}
    </div>
  );
}
