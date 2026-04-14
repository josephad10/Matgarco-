import React from 'react';

export default function AnnouncementBarSection({ settings }: { settings: Record<string, any> }) {
  const {
    text = '🎉 شحن مجاني على الطلبات فوق 200 ج.م',
    bgColor = 'var(--color-primary, #3B82F6)',
    textColor = '#ffffff',
  } = settings;

  return (
    <div
      className="w-full py-2 px-4 text-center text-sm font-semibold"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {text}
    </div>
  );
}
