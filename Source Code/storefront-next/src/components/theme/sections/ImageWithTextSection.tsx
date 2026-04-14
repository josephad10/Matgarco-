import React from 'react';
import BlockRenderer from '../blocks/BlockRenderer';

interface ThemeBlock {
  id: string;
  type: string;
  settings: Record<string, any>;
}

interface ImageWithTextProps {
  variant?: string;
  settings: Record<string, any>;
  blocks?: ThemeBlock[];
}

const createLegacyBlocks = (settings: Record<string, any>): ThemeBlock[] => {
  const title = settings.title;
  const text = settings.text || settings.content;
  const image = settings.image;
  const buttonLabel = settings.buttonText || settings.ctaText;
  const buttonLink = settings.buttonLink || settings.ctaLink;

  const blocks: ThemeBlock[] = [];

  if (image) {
    blocks.push({ id: 'legacy-image', type: 'image', settings: { src: image, alt: title || 'Image', fit: 'cover', radius: 'lg', maxWidth: 100 } });
  }
  if (title) {
    blocks.push({ id: 'legacy-heading', type: 'heading', settings: { text: title, size: 'h2', align: 'left' } });
  }
  if (text) {
    blocks.push({ id: 'legacy-paragraph', type: 'paragraph', settings: { text, size: 'md', align: 'left' } });
  }
  if (buttonLabel) {
    blocks.push({ id: 'legacy-button', type: 'button', settings: { label: buttonLabel, link: buttonLink || '/about', style: 'solid', size: 'md' } });
  }

  return blocks;
};

export default function ImageWithTextSection({ variant = 'text_right', settings, blocks = [] }: ImageWithTextProps) {
  const {
    imagePosition = 'right',
    backgroundColor = 'var(--surface)',
  } = settings;

  const effectiveBlocks = blocks.length > 0 ? blocks : createLegacyBlocks(settings);
  const imageBlocks = effectiveBlocks.filter((block) => block.type === 'image');
  const contentBlocks = effectiveBlocks.filter((block) => block.type !== 'image');
  const shouldImageBeLeft = variant === 'text_left' || imagePosition === 'left';
  const layoutClass = shouldImageBeLeft ? 'lg:flex-row-reverse' : 'lg:flex-row';

  return (
    <section className="py-16" style={{ backgroundColor }}>
      <div className="container mx-auto px-4">
        <div className={`flex flex-col gap-12 items-center ${layoutClass}`}>
          <div className="w-full lg:w-1/2">
            <div className="aspect-square md:aspect-[4/3] rounded-[var(--radius)] overflow-hidden shadow-lg relative">
              {imageBlocks.length > 0 ? (
                <div className="w-full h-full flex items-center justify-center">
                  {imageBlocks.map((block) => (
                    <BlockRenderer key={block.id} block={block} context={{ sectionType: 'image_with_text', align: 'center' }} />
                  ))}
                </div>
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-bold">
                  Placeholder Image
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="space-y-5">
              {contentBlocks.map((block) => (
                <BlockRenderer key={block.id} block={block} context={{ sectionType: 'image_with_text', tone: 'light', align: 'left' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
