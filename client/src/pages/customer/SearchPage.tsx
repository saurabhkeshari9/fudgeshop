import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { Product } from '../../types';
import { productService } from '../../services/productService';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    if (q.trim()) {
      performSearch(q.trim());
    } else {
      setProducts([]);
    }
  }, [searchParams]);

  const performSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      const res = await productService.getProducts({ search: searchTerm, limit: 50 });
      if (res.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const popularSearches = [
    'Salted Caramel',
    'Biscoff',
    'Maple Nut',
    'Baileys',
    'Macadamia',
    'Freckle',
    'Chilli Chocolate',
    'Gift Box',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Search Header Banner */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <span className="text-xs uppercase tracking-widest font-bold text-caramel-700">
          Recipe & Flavour Search
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-chocolate-950">
          Find Your Favourite Treat
        </h1>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="relative flex items-center max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search by flavour, ingredient, or treat name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-4 bg-cream-50 border-2 border-cream-300 rounded-2xl text-chocolate-950 placeholder:text-chocolate-400 text-base shadow-artisan focus:outline-none focus:border-caramel-500"
          />
          <Search className="w-5 h-5 text-chocolate-400 absolute left-4" />
          <button
            type="submit"
            className="absolute right-2 px-6 py-2.5 bg-chocolate-900 text-cream-50 font-bold text-sm rounded-xl hover:bg-caramel-700 transition"
          >
            Search
          </button>
        </form>

        {/* Popular searches suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-chocolate-500 font-medium">Popular:</span>
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={() => {
                setQuery(term);
                setSearchParams({ q: term });
              }}
              className="px-3 py-1 bg-cream-200/80 hover:bg-cream-300 text-chocolate-800 rounded-full transition"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results area */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-chocolate-600">Searching our confectionery recipes...</p>
        </div>
      ) : initialQuery.trim() ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-cream-300">
            <h2 className="font-serif text-xl font-bold text-chocolate-900">
              Results for <span className="italic text-caramel-800">"{initialQuery}"</span>
            </h2>
            <span className="text-xs font-semibold text-chocolate-600">
              {products.length} {products.length === 1 ? 'item found' : 'items found'}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-cream-50 rounded-3xl border border-cream-300 p-8 space-y-4 max-w-lg mx-auto">
              <div className="p-4 bg-cream-200 text-caramel-700 rounded-full w-14 h-14 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-chocolate-900">
                No matching confectionery found
              </h3>
              <p className="text-sm text-chocolate-600 leading-relaxed">
                We couldn't find any results for "{initialQuery}". Try searching for one of our signature ingredients such as "caramel", "macadamia", "clotted cream", or browse our full catalogue.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-chocolate-900 text-cream-50 font-bold text-sm rounded-xl hover:bg-caramel-700 transition"
              >
                <span>Browse All 40+ Flavours</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
