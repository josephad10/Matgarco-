import React from 'react';

const PLACEHOLDER_CATEGORIES = [
  { name: 'إلكترونيات', emoji: '📱' },
  { name: 'ملابس', emoji: '👗' },
  { name: 'طعام وشراب', emoji: '🍔' },
  { name: 'رياضة', emoji: '⚽' },
  { name: 'منزل وحديقة', emoji: '🏠' },
  { name: 'صحة وجمال', emoji: '💄' },
];

export interface CategoriesGridProps {
  id: string;
  variant?: string;
  settings: Record<string, any>;
  blocks: any[];
  storeData?: any;
}

export default function CategoriesGridSection({ settings, variant = 'grid', storeData }: CategoriesGridProps) {
  const {
    title = 'تسوق حسب الفئة',
    style = '3col',
    bgColor = '#ffffff',
  } = settings;

  const colClass =
    style === '2col'
      ? 'grid-cols-2'
      : style === 'horizontal'
      ? 'flex overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar'
      : 'grid-cols-2 sm:grid-cols-3';

  // Try to use real categories from storeData, fallback to placeholders
  const rawCategories: any[] = storeData?.categories || storeData?.store?.categories || [];
  
  const categories =
    rawCategories.length > 0
      ? rawCategories.map((c: any) => ({ 
          name: typeof c === 'string' ? c : c.name, 
          emoji: c.emoji || '🛍️' 
        }))
      : PLACEHOLDER_CATEGORIES;

  const isSlider = variant === 'slider';
  const containerClass = isSlider ? 'flex overflow-x-auto gap-4 snap-x hide-scrollbar pb-6' : `grid ${colClass} gap-4`;
  const itemClass = isSlider ? 'min-w-[140px] snap-center shrink-0' : '';

  return (
    <section className="py-12 px-4" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto">
        {title && (
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-8 text-center drop-shadow-sm">
            {title}
          </h2>
        )}
        <div className={containerClass}>
          {categories.map((cat: { name: string; emoji: string }, i: number) => (
            <a
              key={i}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`group flex flex-col items-center justify-center p-6 rounded-2xl bg-white shadow-sm border border-slate-200 hover:border-matgarco-500 hover:shadow-lg transition-all duration-300 text-center cursor-pointer ${itemClass}`}
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="text-sm font-bold text-slate-700 group-hover:text-matgarco-600 transition-colors">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
