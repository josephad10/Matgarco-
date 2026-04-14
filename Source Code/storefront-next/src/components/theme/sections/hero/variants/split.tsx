import React from 'react';
import { HeroProps } from '../index';
import BlockRenderer from '../../../blocks/BlockRenderer';

export default function HeroSplit({ settings, blocks }: HeroProps) {
  const {
    backgroundImage = '',
    height = 'medium',
  } = settings;

  const minHeight = height === 'small' ? '400px' : height === 'fullscreen' ? '100vh' : '650px';

  return (
    <section 
      className="relative w-full overflow-hidden bg-slate-50 flex items-center"
      style={{ minHeight }}
    >
      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="flex-1 space-y-6">
          {blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              context={{ sectionType: 'hero', tone: 'light', align: 'left' }}
            />
          ))}
        </div>
        
        {/* Image Content */}
        <div className="flex-1 w-full flex justify-center mt-8 md:mt-0">
          {backgroundImage ? (
             <img 
                src={backgroundImage} 
                className="w-full max-w-lg object-cover rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
                alt="Hero banner layout image"
             />
          ) : (
            <div className="w-full max-w-lg aspect-square bg-slate-200 rounded-2xl flex items-center justify-center border-4 border-dashed border-slate-300">
               <span className="text-slate-400 font-bold">مكان الصورة (Image Placeholder)</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
