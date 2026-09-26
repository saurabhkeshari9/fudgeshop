import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  Flame,
  Check,
} from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { Product, Category } from '../../types';
import { productService } from '../../services/productService';

export const ShopPage: React.FC = () => {
  const { category: categoryParam } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam || searchParams.get('category') || 'all'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [bestsellersOnly, setBestsellersOnly] = useState(searchParams.get('bestseller') === 'true');
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === 'true');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync route param with state
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  // Load Categories on mount
  useEffect(() => {
    productService.getCategories().then((res) => {
      if (res.data) setCategories(res.data);
    }).catch(() => {});
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          limit: 100,
        };

        if (selectedCategory && selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        if (sortBy === 'price-asc') params.sort = 'price-asc';
        if (sortBy === 'price-desc') params.sort = 'price-desc';
        if (sortBy === 'newest') params.sort = 'newest';
        if (sortBy === 'name') params.sort = 'name';
        if (bestsellersOnly) params.bestseller = 'true';
        if (featuredOnly) params.featured = 'true';
        if (inStockOnly) params.inStock = 'true';
        if (maxPrice < 100) params.maxPrice = maxPrice;

        const res = await productService.getProducts(params);
        if (res.data) {
          setProducts(res.data);
          setTotalProducts(res.total || res.data.length);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy, bestsellersOnly, featuredOnly, inStockOnly, maxPrice]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setBestsellersOnly(false);
    setFeaturedOnly(false);
    setInStockOnly(false);
    setMaxPrice(100);
  };

  const activeCategoryObject = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-cream-100 rounded-3xl p-8 sm:p-12 border border-cream-300">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs uppercase tracking-widest font-bold text-caramel-700">
            Artisan Confectionery Catalog
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-chocolate-950">
            {activeCategoryObject ? activeCategoryObject.name : 'Hand-Crafted Treats & Fudges'}
          </h1>
          <p className="text-sm sm:text-base text-chocolate-700 leading-relaxed">
            {activeCategoryObject?.description ||
              'Explore over 40 fresh artisan fudge flavours, rich Belgian chocolates, giant rainbow freckles, and curated tasting gift hampers made in historic Hahndorf, South Australia.'}
          </p>
        </div>
      </div>

      {/* Main Shop Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Left Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-cream-50 p-6 rounded-2xl border border-cream-300 space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-cream-200">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-chocolate-900">
              <Filter className="w-4 h-4 text-caramel-700" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-chocolate-500 hover:text-caramel-700 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Search inside shop */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-chocolate-600">
              Search Treats
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Flavour, nut, cocoa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
              <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-chocolate-400 hover:text-chocolate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-chocolate-600">
              Collections
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-caramel-600 text-cream-50 font-bold'
                    : 'text-chocolate-800 hover:bg-cream-200'
                }`}
              >
                <span>All Treats</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-caramel-600 text-cream-50 font-bold'
                      : 'text-chocolate-800 hover:bg-cream-200'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="space-y-2.5 pt-4 border-t border-cream-200">
            <label className="text-xs font-bold uppercase tracking-wider text-chocolate-600">
              Special Highlights
            </label>

            <label className="flex items-center gap-2.5 text-sm font-medium text-chocolate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={bestsellersOnly}
                onChange={(e) => setBestsellersOnly(e.target.checked)}
                className="rounded text-caramel-600 focus:ring-caramel-500 w-4 h-4"
              />
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-caramel-600" />
                Bestsellers Only
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-sm font-medium text-chocolate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
                className="rounded text-caramel-600 focus:ring-caramel-500 w-4 h-4"
              />
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-caramel-600" />
                Featured Only
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-sm font-medium text-chocolate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-caramel-600 focus:ring-caramel-500 w-4 h-4"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Price Slider */}
          <div className="space-y-2 pt-4 border-t border-cream-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-600">
                Max Price
              </label>
              <span className="text-xs font-bold text-chocolate-900">${maxPrice} AUD</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-caramel-600 cursor-pointer"
            />
          </div>
        </aside>

        {/* Right Product Grid Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* Controls Bar */}
          <div className="bg-cream-50 p-4 rounded-2xl border border-cream-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Count & Mobile Filter Toggle */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
              <span className="text-sm font-semibold text-chocolate-700">
                Showing <strong className="text-chocolate-950">{products.length}</strong> delicacies
              </span>

              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-cream-200 text-chocolate-900 rounded-lg"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <label className="text-xs text-chocolate-600 font-semibold whitespace-nowrap">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500 cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Flavour Name (A–Z)</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-cream-100/70 rounded-2xl border border-cream-200 h-96 animate-pulse p-4 space-y-4"
                >
                  <div className="bg-cream-300/80 rounded-xl aspect-[4/3] w-full" />
                  <div className="h-4 bg-cream-300/80 rounded w-1/3" />
                  <div className="h-6 bg-cream-300/80 rounded w-2/3" />
                  <div className="h-4 bg-cream-300/80 rounded w-full" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-cream-50 rounded-3xl border border-cream-300 p-8 space-y-4">
              <div className="p-4 bg-cream-200 text-caramel-700 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-chocolate-900">
                No sweet treats match your criteria
              </h3>
              <p className="text-sm text-chocolate-600 max-w-md mx-auto">
                We couldn't find any products matching your current filters or search query. Try clearing your filters to discover our 40+ handcrafted recipes.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-chocolate-900 text-cream-50 font-bold text-sm rounded-xl hover:bg-caramel-700 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
