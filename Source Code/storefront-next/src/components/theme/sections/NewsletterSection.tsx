import React from 'react';
import BlockRenderer from '../blocks/BlockRenderer';

interface ThemeBlock {
  id: string;
  type: string;
  settings: Record<string, any>;
}

const createLegacyBlocks = (settings: Record<string, any>): ThemeBlock[] => {
  const title = settings.title || 'اشترك في نشرتنا البريدية';
  const subtitle = settings.subtitle || 'احصل على أحدث العروض والتخفيضات في بريدك مباشرة';
  const buttonText = settings.buttonText || 'اشترك مجاناً';

  return [
    { id: 'legacy-heading', type: 'heading', settings: { text: title, size: 'h2', align: 'center' } },
    { id: 'legacy-subtitle', type: 'paragraph', settings: { text: subtitle, size: 'md', align: 'center' } },
    { id: 'legacy-button', type: 'button', settings: { label: buttonText, link: '#', style: 'outline', size: 'md' } },
  ];
};

export default function NewsletterSection({ settings = {}, blocks = [] }: { settings: Record<string, any>; blocks?: ThemeBlock[] }) {
  const {
    backgroundColor = 'var(--primary)',
    textColor = '#ffffff',
    placeholder = 'بريدك الإلكتروني',
  } = settings;

  const effectiveBlocks = blocks.length > 0 ? blocks : createLegacyBlocks(settings);
  const contentBlocks = effectiveBlocks.filter((block) => block.type !== 'button');
  const ctaBlocks = effectiveBlocks.filter((block) => block.type === 'button');

  return (
    <section className="py-16 px-4" style={{ backgroundColor }}>
      <div className="container mx-auto text-center text-white max-w-xl">
        <div className="space-y-3 mb-8">
          {contentBlocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              context={{ sectionType: 'newsletter', tone: 'dark', align: 'center', textColor }}
            />
          ))}
        </div>
        <form
          className="flex flex-col sm:flex-row gap-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder={placeholder}
            className="flex-1 px-5 py-3 rounded-full text-gray-900 outline-none text-sm font-medium placeholder:text-gray-400 shadow"
          />
          {ctaBlocks.map((block) => (
            <div key={block.id} className="shrink-0">
              <BlockRenderer block={block} context={{ sectionType: 'newsletter', tone: 'dark', align: 'center' }} />
            </div>
          ))}
        </form>
      </div>
    </section>
  );
}
