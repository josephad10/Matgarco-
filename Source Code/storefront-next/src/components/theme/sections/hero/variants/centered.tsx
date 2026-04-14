import React from 'react';
import type { HeroProps } from '../index';
import BlockRenderer from '../../../blocks/BlockRenderer';

export default function HeroCentered({ settings, blocks }: HeroProps) {
  const {
    backgroundImage = '',
    overlayOpacity = 40,
    height = 'medium',
  } = settings;

  const minHeight = height === 'small' ? '400px' : height === 'fullscreen' ? '100vh' : '600px';

  return (
    <section 
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ minHeight }}
    >
      {/* Background */}
      {backgroundImage ? (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-slate-900" />
      )}
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 z-10 bg-black" 
        style={{ opacity: overlayOpacity / 100 }}
      />
      
      {/* Content */}
      <div className="container relative z-20 mx-auto px-4 flex flex-col items-center text-center">
        <div className="max-w-3xl flex flex-col items-center gap-6">
          {blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              context={{ sectionType: 'hero', tone: 'dark', align: 'center' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
