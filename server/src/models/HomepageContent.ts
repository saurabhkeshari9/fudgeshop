import mongoose, { Document, Schema } from 'mongoose';

export interface IHomepageContent extends Document {
  hero: {
    headline: string;
    subheadline: string;
    heroImage: string;
    badgeText: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  featuredSectionTitle: string;
  featuredSectionSubtitle: string;
  bestsellerSectionTitle: string;
  bestsellerSectionSubtitle: string;
  storySection: {
    title: string;
    subtitle: string;
    description1: string;
    description2: string;
    image: string;
    badge: string;
  };
  visitSection: {
    title: string;
    description: string;
    address: string;
    hours: string;
    image: string;
  };
  updatedAt: Date;
}

const HomepageContentSchema = new Schema<IHomepageContent>(
  {
    hero: {
      headline: { type: String, default: 'Hand-Made Happiness, One Delicious Bite at a Time.' },
      subheadline: {
        type: String,
        default: 'Crafted with passion in the heart of historic Hahndorf since 1980. Over 40 legendary fudge flavours made fresh with premium Australian ingredients.',
      },
      heroImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1600&auto=format&fit=crop',
      },
      badgeText: { type: String, default: 'Artisan Confectioners of the Adelaide Hills' },
      primaryCtaText: { type: String, default: 'Shop Hand-Crafted Fudge' },
      primaryCtaLink: { type: String, default: '/shop' },
      secondaryCtaText: { type: String, default: 'Plan Your Visit' },
      secondaryCtaLink: { type: String, default: '/visit-us' },
    },
    announcement: {
      enabled: { type: Boolean, default: true },
      text: { type: String, default: '🇦🇺 Free Express Shipping across Australia on all orders over $75 | Handcrafted in Hahndorf SA' },
      link: { type: String, default: '/shipping' },
    },
    featuredSectionTitle: { type: String, default: 'Hand-Made Confectionery' },
    featuredSectionSubtitle: { type: String, default: 'Small-batch artisan fudges cooked slowly in copper pans for sublime velvet texture.' },
    bestsellerSectionTitle: { type: String, default: 'Store Favourites & Bestsellers' },
    bestsellerSectionSubtitle: { type: String, default: 'The beloved recipes visitors travel through the Adelaide Hills to taste.' },
    storySection: {
      title: { type: String, default: 'The Sweet Heritage of Hahndorf' },
      subtitle: { type: String, default: 'Four Decades of Pure Artisan Passion' },
      description1: {
        type: String,
        default: 'Nestled on the iconic tree-lined Main Street of Australia’s oldest surviving German settlement, The Fudge Shop has been delighting generations of visitors with traditional recipes and warm village charm.',
      },
      description2: {
        type: String,
        default: 'Every slab is prepared using rich Australian dairy, golden butter, and natural flavourings. From heritage butterscotch to modern gourmet Biscoff & clotted cream, each recipe is handcrafted with pride.',
      },
      image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=1200&auto=format&fit=crop',
      },
      badge: { type: String, default: 'Est. in South Australia' },
    },
    visitSection: {
      title: { type: String, default: 'Visit Us in Hahndorf' },
      description: {
        type: String,
        default: 'Breathe in the rich aroma of warm caramel and freshly churned ice cream. Stop by on your next Adelaide Hills journey.',
      },
      address: { type: String, default: 'Shop 4, 56 Mount Barker Rd, Hahndorf SA 5245' },
      hours: { type: String, default: 'Open 7 Days: 10:00 AM – 5:00 PM' },
      image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      },
    },
  },
  {
    timestamps: true,
  }
);

export const HomepageContent = mongoose.model<IHomepageContent>('HomepageContent', HomepageContentSchema);
