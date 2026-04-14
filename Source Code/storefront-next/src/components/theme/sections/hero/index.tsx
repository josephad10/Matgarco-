import React from 'react';
import HeroCentered from './variants/centered';
import HeroSplit from './variants/split';

// Standard props passed from ThemeRenderer
export interface HeroProps {
  id: string;
  variant?: string;
  settings: Record<string, any>;
  blocks: {
    id: string;
    type: string;
    settings: Record<string, any>;
  }[];
  storeData?: any;
}

const VariantRegistry: Record<string, React.FC<HeroProps>> = {
  centered: HeroCentered,
  split: HeroSplit,
};

// ─── Component ─────────────────────────────────────────────────────────────
export default function HeroSectionResolver(props: HeroProps) {
  const Component = VariantRegistry[props.variant ?? 'centered'] ?? VariantRegistry.centered;
  return <Component {...props} />;
}
