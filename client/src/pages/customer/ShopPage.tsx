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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-cream-100 rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-cream-300">
        <div className="max-w-2xl space-y-2 sm:space-y-3">
          <div className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-caramel-700">
            Artisan Confectionery Catalog
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-chocolate-950">
            {activeCategoryObject ? activeCategoryObject.name : 'Hand-Crafted Treats & Fudges'}
          </h1>
          <p className="text-xs sm:text-base text-chocolate-700 leading-relaxed">
            {activeCategoryObject?.description ||
              'Explore over 40 fresh artisan fudge flavours, rich Belgian chocolates, giant rainbow freckles, and curated tasting gift hampers made in historic Hahndorf, South Australia.'}
          </p>
        </div>
      </div>

      {/* Main Shop Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
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

        {/* Mobile Filter Drawer (when mobileFiltersOpen is true) */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <div
              className="fixed inset-0 bg-chocolate-950/60 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
              <div className="w-screen max-w-full sm:max-w-md bg-cream-50 shadow-2xl flex flex-col border-l border-cream-300">
                <div className="p-4 border-b border-cream-200 flex items-center justify-between bg-cream-100">
                  <div className="flex items-center gap-2 font-serif text-lg font-bold text-chocolate-900">
                    <Filter className="w-4 h-4 text-caramel-700" />
                    <span>Filters ({products.length} treats)</span>
                  </div>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1.5 rounded-lg text-chocolate-600 hover:bg-cream-200"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                  {/* Search inside shop */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-chocolate-600">
                      Search Treats
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Flavour, nut, cocoa..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500"
                      />
                      <Search className="w-4 h-4 text-chocolate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-chocolate-600">
                      Collections
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-left truncate transition ${
                          selectedCategory === 'all'
                            ? 'bg-caramel-600 text-cream-50'
                            : 'bg-cream-100 text-chocolate-800 hover:bg-cream-200'
                        }`}
                      >
                        All Treats
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat._id}
                          onClick={() => setSelectedCategory(cat.slug)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold text-left truncate transition ${
                            selectedCategory === cat.slug
                              ? 'bg-caramel-600 text-cream-50'
                              : 'bg-cream-100 text-chocolate-800 hover:bg-cream-200'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2.5 pt-3 border-t border-cream-200">
                    <label className="text-xs font-bold uppercase tracking-wider text-chocolate-600">
                      Special Highlights
                    </label>
                    <label className="flex items-center gap-2.5 text-xs font-medium text-chocolate-800">
                      <input
                        type="checkbox"
                        checked={bestsellersOnly}
                        onChange={(e) => setBestsellersOnly(e.target.checked)}
                        className="rounded text-caramel-600 w-4 h-4"
                      />
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-caramel-600" /> Bestsellers Only
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs font-medium text-chocolate-800">
                      <input
                        type="checkbox"
                        checked={featuredOnly}
                        onChange={(e) => setFeaturedOnly(e.target.checked)}
                        className="rounded text-caramel-600 w-4 h-4"
                      />
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-caramel-600" /> Featured Only
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs font-medium text-chocolate-800">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="rounded text-caramel-600 w-4 h-4"
                      />
                      <span>In Stock Only</span>
                    </label>
                  </div>

                  {/* Price Slider */}
                  <div className="space-y-1.5 pt-3 border-t border-cream-200">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold uppercase tracking-wider text-chocolate-600">
                        Max Price
                      </label>
                      <span className="font-bold text-chocolate-900">${maxPrice} AUD</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-caramel-600"
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-cream-200 bg-cream-100 flex items-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="flex-1 py-2.5 px-3 border border-cream-300 rounded-xl text-xs font-bold text-chocolate-800 hover:bg-cream-200"
                  >
                    Reset All
                  </button>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="flex-1 py-2.5 px-3 bg-chocolate-900 text-cream-50 rounded-xl text-xs font-bold hover:bg-caramel-700"
                  >
                    Show {products.length} Treats
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Product Grid Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* Controls Bar */}
          <div className="bg-cream-50 p-3.5 sm:p-4 rounded-2xl border border-cream-300 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* Count & Mobile Filter Toggle */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
              <span className="text-xs sm:text-sm font-semibold text-chocolate-700">
                Showing <strong className="text-chocolate-950">{products.length}</strong> delicacies
              </span>

              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-caramel-100 text-caramel-900 border border-caramel-300 rounded-lg shadow-sm"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters {selectedCategory !== 'all' || bestsellersOnly || featuredOnly || inStockOnly ? '•' : ''}</span>
              </button>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
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

          {/* Active Filter Chips */}
          {(selectedCategory !== 'all' || bestsellersOnly || featuredOnly || inStockOnly || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-chocolate-500 font-semibold">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-cream-200 text-chocolate-800 px-2.5 py-1 rounded-full hover:bg-cream-300"
                >
                  <span>{activeCategoryObject?.name || selectedCategory}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {bestsellersOnly && (
                <button
                  onClick={() => setBestsellersOnly(false)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-cream-200 text-chocolate-800 px-2.5 py-1 rounded-full hover:bg-cream-300"
                >
                  <span>Bestsellers</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {featuredOnly && (
                <button
                  onClick={() => setFeaturedOnly(false)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-cream-200 text-chocolate-800 px-2.5 py-1 rounded-full hover:bg-cream-300"
                >
                  <span>Featured</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {inStockOnly && (
                <button
                  onClick={() => setInStockOnly(false)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-cream-200 text-chocolate-800 px-2.5 py-1 rounded-full hover:bg-cream-300"
                >
                  <span>In Stock</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-cream-200 text-chocolate-800 px-2.5 py-1 rounded-full hover:bg-cream-300"
                >
                  <span>"{searchQuery}"</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-caramel-700 hover:underline font-semibold ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            <div className="text-center py-16 sm:py-20 bg-cream-50 rounded-2xl sm:rounded-3xl border border-cream-300 p-6 sm:p-8 space-y-4">
              <div className="p-4 bg-cream-200 text-caramel-700 rounded-full w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-chocolate-900">
                No sweet treats match your criteria
              </h3>
              <p className="text-xs sm:text-sm text-chocolate-600 max-w-md mx-auto">
                We couldn't find any products matching your current filters or search query. Try clearing your filters to discover our 40+ handcrafted recipes.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-chocolate-900 text-cream-50 font-bold text-xs sm:text-sm rounded-xl hover:bg-caramel-700 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
