import React from 'react';

export interface ThemeBlock {
  id: string;
  type: string;
  settings: Record<string, any>;
}

interface BlockRenderContext {
  sectionType: string;
  tone?: 'dark' | 'light';
  align?: 'left' | 'center' | 'right';
  textColor?: string;
}

interface BlockRendererProps {
  block: ThemeBlock;
  context: BlockRenderContext;
}

interface BlockComponentProps {
  block: ThemeBlock;
  context: BlockRenderContext;
}

const resolveTextAlignClass = (align: string) => {
  if (align === 'center') return 'text-center';
  if (align === 'right') return 'text-right';
  return 'text-left';
};

const resolveRadiusClass = (radius: string) => {
  if (radius === 'none') return 'rounded-none';
  if (radius === 'sm') return 'rounded';
  if (radius === 'md') return 'rounded-md';
  if (radius === 'full') return 'rounded-full';
  return 'rounded-xl';
};

const renderHeading = ({ block, context }: BlockComponentProps) => {
  const tone = context.tone ?? 'light';
  const align = block.settings.align || context.align || 'left';
  const textAlignClass = resolveTextAlignClass(align);
  const tag = (block.settings.size as 'h1' | 'h2' | 'h3') || 'h2';
  const Tag = tag;
  const sizeClass =
    tag === 'h1'
      ? context.sectionType === 'hero'
        ? 'text-4xl md:text-6xl font-black'
        : 'text-4xl md:text-5xl font-black'
      : tag === 'h2'
        ? 'text-3xl md:text-4xl font-bold'
        : 'text-2xl md:text-3xl font-bold';
  const toneClass = tone === 'dark' ? 'text-white' : 'text-slate-800';
  const extraHeroClass = context.sectionType === 'hero' && tone === 'dark' ? 'drop-shadow-lg' : '';
  const textColor = block.settings.color || context.textColor;

  return (
    <Tag className={`${sizeClass} ${toneClass} ${textAlignClass} ${extraHeroClass} leading-tight`} style={textColor ? { color: textColor } : undefined}>
      {block.settings.text}
    </Tag>
  );
};

const renderParagraph = ({ block, context }: BlockComponentProps) => {
  const tone = context.tone ?? 'light';
  const align = block.settings.align || context.align || 'left';
  const textAlignClass = resolveTextAlignClass(align);
  const size = block.settings.size || (context.sectionType === 'hero' ? 'lg' : 'md');
  const sizeClass =
    size === 'sm'
      ? 'text-sm md:text-base'
      : size === 'lg'
        ? 'text-lg md:text-xl'
        : size === 'xl'
          ? 'text-xl md:text-2xl'
          : 'text-base md:text-lg';
  const toneClass = tone === 'dark' ? 'text-slate-200' : 'text-slate-600';
  const extraHeroClass = context.sectionType === 'hero' && tone === 'dark' ? 'drop-shadow' : '';
  const textColor = block.settings.color || context.textColor;

  return (
    <p className={`${sizeClass} ${toneClass} ${textAlignClass} ${extraHeroClass} leading-relaxed`} style={textColor ? { color: textColor } : undefined}>
      {block.settings.text}
    </p>
  );
};

const renderButton = ({ block, context }: BlockComponentProps) => {
  const tone = context.tone ?? 'light';
  const isOutline = block.settings.style === 'outline';
  const buttonSize = block.settings.size || 'md';
  const sizeClass =
    buttonSize === 'sm'
      ? 'px-5 py-2.5 text-sm'
      : buttonSize === 'lg'
        ? 'px-10 py-4 text-lg'
        : 'px-8 py-3.5';
  const baseClass = `${sizeClass} inline-block font-bold rounded-lg transition-all`;
  const solidToneClass =
    tone === 'dark'
      ? 'bg-[var(--primary)] text-white hover:opacity-90 shadow-xl'
      : 'bg-[var(--primary)] text-white hover:opacity-90 shadow-lg';
  const outlineToneClass =
    tone === 'dark'
      ? 'border-2 border-white text-white hover:bg-white hover:text-slate-900'
      : 'border-2 border-slate-300 text-slate-700 hover:bg-slate-100';

  return (
    <a href={block.settings.link || '#'} className={`${baseClass} ${isOutline ? outlineToneClass : solidToneClass}`}>
      {block.settings.label}
    </a>
  );
};

const renderImage = ({ block }: BlockComponentProps) => {
  const src = block.settings.src || block.settings.image || '';
  if (!src) {
    return null;
  }

  const fit = block.settings.fit === 'contain' ? 'object-contain' : 'object-cover';
  const radiusClass = resolveRadiusClass(block.settings.radius || 'lg');
  const maxWidth = Number(block.settings.maxWidth || 100);

  return (
    <img
      src={src}
      alt={block.settings.alt || 'Image block'}
      className={`w-full ${fit} ${radiusClass}`}
      style={{ maxWidth: `${Math.max(20, Math.min(100, maxWidth))}%` }}
      loading="lazy"
    />
  );
};

const renderDivider = ({ block, context }: BlockComponentProps) => {
  const align = block.settings.align || context.align || 'center';
  const width = Number(block.settings.width || 100);

  return (
    <hr
      className={align === 'left' ? 'mr-auto' : align === 'right' ? 'ml-auto' : 'mx-auto'}
      style={{
        width: `${Math.max(20, Math.min(100, width))}%`,
        borderTopWidth: `${Number(block.settings.thickness || 1)}px`,
        borderTopStyle: block.settings.style || 'solid',
        borderTopColor: block.settings.color || '#E5E7EB',
      }}
    />
  );
};

const renderSpacer = ({ block }: BlockComponentProps) => {
  const size = block.settings.size || 'md';
  const sizeHeight = size === 'sm' ? 12 : size === 'lg' ? 32 : size === 'xl' ? 48 : 24;
  const customHeight = Number(block.settings.height || sizeHeight);
  return <div style={{ height: `${Math.max(8, customHeight)}px` }} />;
};

const BlockComponentMap: Record<string, (props: BlockComponentProps) => React.ReactNode> = {
  heading: renderHeading,
  paragraph: renderParagraph,
  subtext: renderParagraph,
  button: renderButton,
  image: renderImage,
  divider: renderDivider,
  spacer: renderSpacer,
};

export default function BlockRenderer({ block, context }: BlockRendererProps) {
  const renderBlock = BlockComponentMap[block.type];
  if (!renderBlock) return null;
  return <>{renderBlock({ block, context })}</>;
}
