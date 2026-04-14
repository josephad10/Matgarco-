'use client';

import { useEffect } from 'react';

/** Sets document.dir and document.lang based on the store's theme */
export default function ThemeDocumentSync({ dir, lang }: { dir: string; lang: string }) {
  useEffect(() => {
    document.documentElement.dir  = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);
  return null;
}
