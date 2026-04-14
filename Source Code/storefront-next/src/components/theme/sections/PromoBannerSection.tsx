import React from 'react';
import BlockRenderer from '../blocks/BlockRenderer';

interface ThemeBlock {
  id: string;
  type: string;
  settings: Record<string, any>;
}

interface PromoBannerProps {
  variant?: string;
  settings: Record<string, any>;
  blocks?: ThemeBlock[];
}

const createLegacyBlocks = (settings: Record<string, any>): ThemeBlock[] => {
  const title = settings.title;
  const subtitle = settings.subtitle;
  const buttonLabel = settings.buttonText || settings.ctaText;
  const buttonLink = settings.buttonLink || settings.ctaLink;
  const image = settings.image;

  const blocks: ThemeBlock[] = [];
  if (image) {
    blocks.push({ id: 'legacy-image', type: 'image', settings: { src: image, alt: title || 'Promo image', fit: 'cover', radius: 'none', maxWidth: 100 } });
  }
  if (title) {
    blocks.push({ id: 'legacy-heading', type: 'heading', settings: { text: title, size: 'h1', align: 'center' } });
  }
  if (subtitle) {
    blocks.push({ id: 'legacy-paragraph', type: 'paragraph', settings: { text: subtitle, size: 'lg', align: 'center' } });
  }
  if (buttonLabel) {
    blocks.push({ id: 'legacy-button', type: 'button', settings: { label: buttonLabel, link: buttonLink || '/products', style: 'outline', size: 'md' } });
  }

  return blocks;
};

export default function PromoBannerSection({ variant = 'fullwidth', settings, blocks = [] }: PromoBannerProps) {
  const {
    bgColor = 'var(--primary)',
    textColor = '#ffffff',
    overlayOpacity = 20,
  } = settings;

  const effectiveBlocks = blocks.length > 0 ? blocks : createLegacyBlocks(settings);
  const imageBlock = effectiveBlocks.find((block) => block.type === 'image');
  const contentBlocks = effectiveBlocks.filter((block) => block.type !== 'image');
  const backgroundImage = imageBlock?.settings?.src || imageBlock?.settings?.image || '';
  const isBoxed = variant === 'boxed';

  return (
    <section
      className="relative py-16 px-4 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backgroundImage})`, opacity: Math.max(0, Math.min(100, Number(overlayOpacity))) / 100 }}
        />
      )}

      <div className="container relative mx-auto text-center">
        <div className={isBoxed ? 'max-w-4xl mx-auto bg-black/20 backdrop-blur-sm rounded-3xl px-6 py-10' : 'max-w-4xl mx-auto'}>
          <div className="space-y-4">
            {contentBlocks.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                context={{ sectionType: 'promo_banner', tone: 'dark', align: 'center', textColor }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
