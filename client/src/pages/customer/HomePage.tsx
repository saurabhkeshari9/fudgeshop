import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Award,
  Heart,
  Store,
  ChevronRight,
  Flame,
  Star,
  CheckCircle2,
  Gift,
  Clock,
  MapPin,
} from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { Product, Category, HomepageContent } from '../../types';
import { productService } from '../../services/productService';

export const HomePage: React.FC = () => {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [contentRes, catsRes, featuredRes, bestRes] = await Promise.all([
          productService.getHomepageContent(),
          productService.getCategories(),
          productService.getFeaturedProducts(),
          productService.getBestsellers(),
        ]);

        if (contentRes.data) setContent(contentRes.data);
        if (catsRes.data) setCategories(catsRes.data);
        if (featuredRes.data) setFeaturedProducts(featuredRes.data);
        if (bestRes.data) setBestsellers(bestRes.data);
      } catch (err) {
        console.error('Error loading homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
    }
  };

  const reviews = [
    {
      name: 'Sarah Jenkins',
      location: 'Adelaide, SA',
      rating: 5,
      comment:
        'The Biscoff & Clotted Cream fudge is sensational! We visit Hahndorf every autumn and The Fudge Shop is always our very first stop. The texture is unmatched.',
    },
    {
      name: 'David & Megan Miller',
      location: 'Melbourne, VIC',
      rating: 5,
      comment:
        'Ordered the Grand Hamper online for Mother’s Day. Arrived in Melbourne within 2 days, beautifully packed and completely intact. The Salted Caramel is world-class.',
    },
    {
      name: 'Liam Chen',
      location: 'Sydney, NSW',
      rating: 5,
      comment:
        'The giant chocolate freckles brought back so many childhood memories. Over 40 flavours of fudge and every single one we tried was rich, authentic, and delicious.',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-cream-100 border-b border-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:py-1.5 rounded-full bg-caramel-100 text-caramel-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-caramel-300 max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-caramel-600 flex-shrink-0" />
                <span className="text-left sm:text-center leading-tight">
                  {content?.hero?.badgeText || 'Artisan Confectioners of the Adelaide Hills'}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-chocolate-950 leading-[1.18] sm:leading-[1.15]">
                {content?.hero?.headline || 'Hand-made happiness, one delicious bite at a time.'}
              </h1>

              <p className="text-sm sm:text-lg text-chocolate-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {content?.hero?.subheadline ||
                  'Crafted with passion in the heart of historic Hahndorf since 1980. Over 40 legendary fudge flavours made fresh using South Australian butter and rich dairy.'}
              </p>

              <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <Link
                  to={content?.hero?.primaryCtaLink || '/shop'}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 text-sm sm:text-base font-bold rounded-2xl shadow-artisan-lg flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
                >
                  <span>{content?.hero?.primaryCtaText || 'Explore Our Flavours'}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-caramel-300" />
                </Link>

                <Link
                  to={content?.hero?.secondaryCtaLink || '/visit-us'}
                  className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 bg-cream-50 hover:bg-cream-200 text-chocolate-900 border border-cream-300 text-sm sm:text-base font-bold rounded-2xl flex items-center justify-center gap-2 transition"
                >
                  <Store className="w-4 h-4 text-caramel-700" />
                  <span>{content?.hero?.secondaryCtaText || 'Visit Hahndorf Store'}</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-5 sm:pt-6 border-t border-cream-300/80 grid grid-cols-3 gap-2 sm:gap-4 text-center sm:text-left">
                <div>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-chocolate-900">40+</div>
                  <div className="text-[10px] sm:text-xs text-chocolate-600 font-medium">Fresh Flavours</div>
                </div>
                <div>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-chocolate-900">1980</div>
                  <div className="text-[10px] sm:text-xs text-chocolate-600 font-medium">Est. in Hahndorf</div>
                </div>
                <div>
                  <div className="font-serif text-xl sm:text-2xl font-bold text-chocolate-900">100%</div>
                  <div className="text-[10px] sm:text-xs text-chocolate-600 font-medium">Australian Made</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-artisan-lg border-2 sm:border-4 border-cream-50 aspect-[4/3] sm:aspect-[4/5] bg-cream-200">
                <img
                  src={
                    content?.hero?.heroImage ||
                    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1200&auto=format&fit=crop'
                  }
                  alt="Artisan Fudge from Hahndorf"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/70 via-transparent to-transparent" />

                {/* Floating banner on hero image */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-cream-50/95 backdrop-blur-sm border border-cream-200 shadow-artisan">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="p-2 sm:p-2.5 bg-caramel-500/20 text-caramel-700 rounded-lg sm:rounded-xl flex-shrink-0">
                      <Award className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-chocolate-900">Copper Pan Tradition</h4>
                      <p className="text-[11px] sm:text-xs text-chocolate-600 line-clamp-1 sm:line-clamp-none">
                        Slow-boiled for signature velvet consistency and deep rich caramel notes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-caramel-700">
            Handcrafted Collections
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-chocolate-900">
            Discover Our Artisan Range
          </h2>
          <p className="text-xs sm:text-sm text-chocolate-600">
            From our famous copper-pan fudge to giant freckles, churned ice cream, and luxury gift hampers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop/${cat.slug}`}
              className="group bg-cream-100 rounded-2xl p-3 sm:p-4 border border-cream-300 hover:border-caramel-400 text-center flex flex-col items-center hover:shadow-artisan transition duration-300"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-2 sm:mb-3 border-2 border-cream-200 bg-cream-200 group-hover:scale-105 transition-transform flex-shrink-0">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=300&auto=format&fit=crop'}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xs sm:text-base font-bold text-chocolate-900 group-hover:text-caramel-700 transition line-clamp-2">
                {cat.name}
              </h3>
              <span className="text-[10px] sm:text-[11px] text-chocolate-500 mt-1 flex items-center gap-1 font-medium">
                Explore <ChevronRight className="w-3 h-3 text-caramel-600" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED FUDGE FLAVOURS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-caramel-700">
              Chef's Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-900 mt-1">
              {content?.featuredSectionTitle || 'Signature Small-Batch Fudges'}
            </h2>
            <p className="text-sm text-chocolate-600 mt-1 max-w-xl">
              {content?.featuredSectionSubtitle ||
                'Slow-stirred in traditional copper kettles using pure South Australian dairy and golden butter.'}
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-caramel-700 hover:text-caramel-800 transition"
          >
            <span>View All Flavours</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SEASONAL / PROMO BANNER: GIFTING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-chocolate-900 rounded-3xl overflow-hidden shadow-artisan-lg border border-chocolate-800 text-cream-50 grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-12 lg:p-16 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caramel-500/20 text-caramel-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-caramel-500/30">
              <Gift className="w-3.5 h-3.5 text-caramel-400 flex-shrink-0" />
              <span>Adelaide Hills Gift Boxes & Hampers</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight text-cream-50">
              The Gift of Hand-Made Happiness
            </h2>

            <p className="text-xs sm:text-base text-chocolate-200 leading-relaxed max-w-xl">
              Delight friends, colleagues, and loved ones with our signature embossed gift boxes. Select our famous 6-piece taster or curate your own custom assortment from over 40 fresh fudge flavours.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/shop/gift-boxes-hampers"
                className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 bg-caramel-500 hover:bg-caramel-600 text-chocolate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow flex items-center justify-center gap-2"
              >
                <span>Shop Gift Boxes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-chocolate-800 hover:bg-chocolate-700 text-cream-100 font-semibold text-xs sm:text-sm rounded-xl border border-chocolate-700 transition text-center"
              >
                Customise a Box
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 h-56 sm:h-72 lg:h-full relative min-h-[220px] sm:min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"
              alt="Artisan Confectionery Gift Box"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-chocolate-900/80 via-transparent to-transparent hidden lg:block" />
          </div>
        </div>
      </section>

      {/* 5. BESTSELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div>
            <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-caramel-700">
              Customer Favourites
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-chocolate-900 mt-1">
              {content?.bestsellerSectionTitle || 'Hahndorf Village Favourites'}
            </h2>
            <p className="text-xs sm:text-sm text-chocolate-600 mt-1 max-w-xl">
              {content?.bestsellerSectionSubtitle ||
                'The beloved recipes visitors travel through the Adelaide Hills to taste again and again.'}
            </p>
          </div>
          <Link
            to="/shop?filter=bestsellers"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-caramel-700 hover:text-caramel-800 transition"
          >
            <span>See All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. BRAND HERITAGE STORY */}
      <section className="bg-cream-100 py-12 sm:py-20 border-y border-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Image Collage */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-artisan-lg border-2 sm:border-4 border-cream-50 aspect-[16/10] sm:aspect-[4/3] bg-cream-200">
                <img
                  src={
                    content?.storySection?.image ||
                    'https://images.unsplash.com/photo-1579372786545-d24232daf58c?q=80&w=1200&auto=format&fit=crop'
                  }
                  alt="Historic Hahndorf Village Confectionery"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 hidden sm:block p-5 rounded-2xl bg-chocolate-900 text-cream-50 max-w-xs shadow-artisan-lg border border-chocolate-800">
                <div className="font-serif text-base sm:text-lg font-bold text-caramel-300">
                  {content?.storySection?.badge || 'Hahndorf Heritage Confectioner'}
                </div>
                <p className="text-[11px] text-chocolate-300 mt-1 leading-relaxed">
                  Keeping traditional artisan copper kettle confection methods alive in South Australia since 1980.
                </p>
              </div>
            </div>

            {/* Right Story Copy */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-caramel-700">
                {content?.storySection?.subtitle || 'Four Decades of Artisan Passion'}
              </span>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-chocolate-950 leading-tight">
                {content?.storySection?.title || 'The Sweet Heritage of Hahndorf'}
              </h2>

              <p className="text-xs sm:text-base text-chocolate-700 leading-relaxed">
                {content?.storySection?.description1 ||
                  'Located in the heart of historic Hahndorf—Australia’s oldest surviving German settlement—The Fudge Shop has been a beloved tradition for generations of families, locals, and travellers exploring South Australia.'}
              </p>

              <p className="text-xs sm:text-base text-chocolate-700 leading-relaxed">
                {content?.storySection?.description2 ||
                  'Every slab of fudge is hand-stirred in small batches using rich Australian cream, pure butter, and natural flavourings. From classic Clotted Cream and Maple Pecan to contemporary favourites like Biscoff, we take immense pride in every single slice.'}
              </p>

              <div className="pt-1 sm:pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-chocolate-900 hover:text-caramel-700 transition underline underline-offset-4"
                >
                  <span>Read our complete fudgy history</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VISIT OUR STORE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cream-100 rounded-3xl p-6 sm:p-10 lg:p-14 border border-cream-300 shadow-artisan grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-caramel-700">
              Adelaide Hills Destination
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-chocolate-900">
              {content?.visitSection?.title || 'Visit Us in Hahndorf, South Australia'}
            </h2>

            <p className="text-xs sm:text-base text-chocolate-700 leading-relaxed">
              {content?.visitSection?.description ||
                'Immerse yourself in the warm aroma of melting caramel, sample our famous fudge flavours, and treat yourself to our artisan ice cream right on Main Street.'}
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-chocolate-800">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-caramel-700 flex-shrink-0 mt-0.5" />
                <span className="font-medium">
                  {content?.visitSection?.address || 'Shop 4, 56 Mount Barker Rd (Main Rd), Hahndorf SA 5245'}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-chocolate-800">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-caramel-700 flex-shrink-0" />
                <span className="font-medium">
                  {content?.visitSection?.hours || 'Open 7 Days: 10:00 AM – 5:00 PM'}
                </span>
              </div>
            </div>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3">
              <Link
                to="/visit-us"
                className="w-full sm:w-auto px-6 py-3 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-xs sm:text-sm rounded-xl transition shadow text-center"
              >
                Plan Your Store Visit
              </Link>
              <a
                href="https://maps.google.com/?q=Shop+4,+56+Mount+Barker+Rd,+Hahndorf+SA+5245"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-cream-50 hover:bg-cream-200 text-chocolate-900 font-semibold text-xs sm:text-sm rounded-xl border border-cream-300 transition text-center"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[4/3] bg-cream-200 border-2 border-cream-200 shadow-sm">
            <img
              src={
                content?.visitSection?.image ||
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop'
              }
              alt="Hahndorf Store Visit"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-caramel-700">
            Real Confectionery Lovers
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-chocolate-900">
            Why Customers Love Our Fudge
          </h2>
          <p className="text-xs sm:text-sm text-chocolate-600">
            Generations of families returning for their favourite South Australian treats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 bg-cream-50 rounded-2xl border border-cream-300 shadow-artisan flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-chocolate-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-cream-200">
                <div className="font-bold text-xs sm:text-sm text-chocolate-900">{rev.name}</div>
                <div className="text-[11px] text-chocolate-500">{rev.location}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. NEWSLETTER SIGNUP */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-cream-100 rounded-3xl p-6 sm:p-12 border border-cream-300 shadow-artisan space-y-3 sm:space-y-4">
          <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-caramel-700">
            The Confectioner’s Club
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900">
            Subscribe for Seasonal Flavours & Treats
          </h2>
          <p className="text-xs sm:text-sm text-chocolate-600 max-w-lg mx-auto">
            Be the first to taste limited seasonal batches (Christmas rum fudge, Easter hot cross bun flavours, and Adelaide Hills cherry ripples).
          </p>

          {newsletterSubscribed ? (
            <div className="p-3.5 bg-caramel-100 text-caramel-800 rounded-xl text-xs sm:text-sm font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-caramel-700 flex-shrink-0" />
              <span>Thank you! You have joined The Confectioner’s Club.</span>
            </div>
          ) : (
            <form
              onSubmit={handleNewsletter}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-4 py-2.5 sm:py-3 bg-cream-50 border border-cream-300 rounded-xl text-xs sm:text-sm text-chocolate-900 focus:outline-none focus:ring-2 focus:ring-caramel-500"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-chocolate-900 text-cream-50 font-bold text-xs sm:text-sm rounded-xl hover:bg-caramel-700 transition flex-shrink-0"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
