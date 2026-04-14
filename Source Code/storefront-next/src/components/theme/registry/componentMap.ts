import React from 'react';
import HeaderSection from '../sections/header';
import HeroSection from '../sections/hero';
import FeaturedProductsSection from '../sections/FeaturedProductsSection';
import CategoriesGridSection from '../sections/categories_grid';
import AnnouncementBarSection from '../sections/AnnouncementBarSection';
import PromoBannerSection from '../sections/PromoBannerSection';
import NewArrivalsSection from '../sections/NewArrivalsSection';
import TrustBadgesSection from '../sections/TrustBadgesSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import NewsletterSection from '../sections/NewsletterSection';
import ImageWithTextSection from '../sections/ImageWithTextSection';
import FooterSection from '../sections/footer';

export const ComponentMap: Record<string, React.FC<any>> = {
  header: HeaderSection,
  footer: FooterSection,
  announcement_bar: AnnouncementBarSection,
  hero: HeroSection,
  featured_products: FeaturedProductsSection,
  categories_grid: CategoriesGridSection,
  promo_banner: PromoBannerSection,
  new_arrivals: NewArrivalsSection,
  trust_badges: TrustBadgesSection,
  testimonials: TestimonialsSection,
  newsletter: NewsletterSection,
  image_with_text: ImageWithTextSection,
};
