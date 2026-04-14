import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Matgarco',
  description: 'منصة التجارة الإلكترونية',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
