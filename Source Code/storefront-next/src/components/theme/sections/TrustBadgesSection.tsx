import React from 'react';
import BlockRenderer from '../blocks/BlockRenderer';

const BADGE_ICONS: Record<string, string> = {
  shipping:  '🚀',
  guarantee: '↩️',
  secure:    '🔒',
  support:   '💬',
};

const BADGE_LABELS: Record<string, { title: string; desc: string }> = {
  shipping:  { title: 'شحن سريع',        desc: 'توصيل داخل 2-5 أيام عمل' },
  guarantee: { title: 'ضمان الإرجاع',    desc: 'إرجاع مجاني خلال 14 يوماً' },
  secure:    { title: 'دفع آمن 100%',    desc: 'جميع بياناتك محمية ومشفرة' },
  support:   { title: 'دعم فني 24/7',    desc: 'فريقنا دائماً في خدمتك' },
};

export default function TrustBadgesSection({ settings = {}, blocks = [] }: { settings: Record<string, any>; blocks?: any[] }) {
  const {
    badges = ['shipping', 'guarantee', 'secure', 'support'],
    title = 'لماذا نحن؟',
    backgroundColor = 'var(--background)',
    borderColor = 'var(--border)',
  } = settings;

  const legacyBadgeKeys: string[] = Array.isArray(badges) ? badges : Object.keys(BADGE_LABELS);
  const legacyBlocks = [
    { id: 'legacy-heading', type: 'heading', settings: { text: title, size: 'h3', align: 'center' } },
    ...legacyBadgeKeys
      .filter((key) => !!BADGE_LABELS[key])
      .map((key, index) => ({
        id: `legacy-badge-${index + 1}`,
        type: 'badge_item',
        settings: {
          icon: BADGE_ICONS[key] ?? '✅',
          title: BADGE_LABELS[key].title,
          description: BADGE_LABELS[key].desc,
        },
      })),
  ];

  const effectiveBlocks = blocks.length > 0 ? blocks : legacyBlocks;
  const headingBlocks = effectiveBlocks.filter((block) => ['heading', 'paragraph', 'subtext', 'divider', 'spacer'].includes(block.type));
  const badgeBlocks = effectiveBlocks.filter((block) => block.type === 'badge_item');

  const columnsClass =
    badgeBlocks.length >= 4
      ? 'md:grid-cols-4'
      : badgeBlocks.length === 3
        ? 'md:grid-cols-3'
        : badgeBlocks.length === 2
          ? 'md:grid-cols-2'
          : 'md:grid-cols-1';

  return (
    <section className="py-10 border-y" style={{ borderColor, backgroundColor }}>
      <div className="container mx-auto px-4">
        <div className="space-y-4 mb-6">
          {headingBlocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              context={{ sectionType: 'trust_badges', tone: 'light', align: 'center' }}
            />
          ))}
        </div>
        <div className={`grid grid-cols-2 ${columnsClass} gap-6`}>
          {badgeBlocks.map((block) => {
            return (
              <div key={block.id} className="flex items-center gap-4 p-4">
                <div className="text-3xl flex-shrink-0">{block.settings?.icon || '✅'}</div>
                <div>
                  <p className="font-bold text-sm text-[var(--text)]">{block.settings?.title || 'شارة ثقة'}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{block.settings?.description || ''}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
