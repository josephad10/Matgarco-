import type { SectionSchema } from './types';
import { AnnouncementBarSchema } from './sections/announcement_bar/schema';
import { FeaturedProductsSchema } from './sections/featured_products/schema';
import { HeroSchema } from './sections/hero/schema';
import { CategoriesGridSchema } from './sections/categories_grid/schema';
import { PromoBannerSchema } from './sections/promo_banner/schema';
import { NewArrivalsSchema } from './sections/new_arrivals/schema';
import { TrustBadgesSchema } from './sections/trust_badges/schema';
import { TestimonialsSchema } from './sections/testimonials/schema';
import { NewsletterSchema } from './sections/newsletter/schema';
import { ImageWithTextSchema } from './sections/image_with_text/schema';
import { HeaderSchema } from './sections/header/schema';
import { FooterSchema } from './sections/footer/schema';

export const SectionRegistry: Record<string, SectionSchema> = {
  [AnnouncementBarSchema.type]: AnnouncementBarSchema,
  [FeaturedProductsSchema.type]: FeaturedProductsSchema,
  [HeroSchema.type]: HeroSchema,
  [CategoriesGridSchema.type]: CategoriesGridSchema,
  [PromoBannerSchema.type]: PromoBannerSchema,
  [NewArrivalsSchema.type]: NewArrivalsSchema,
  [TrustBadgesSchema.type]: TrustBadgesSchema,
  [TestimonialsSchema.type]: TestimonialsSchema,
  [NewsletterSchema.type]: NewsletterSchema,
  [ImageWithTextSchema.type]: ImageWithTextSchema,
  [HeaderSchema.type]: HeaderSchema,
  [FooterSchema.type]: FooterSchema,
};
