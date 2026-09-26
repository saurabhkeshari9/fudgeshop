import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Star, Flame, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const categoryName = typeof product.category === 'object' ? product.category.name : '';

  return (
    <div className="group bg-cream-50 rounded-2xl border border-cream-300/90 overflow-hidden shadow-artisan hover:shadow-artisan-hover transition-all duration-300 flex flex-col h-full">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] bg-cream-200 overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop'}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.featured && (
            <span className="inline-flex items-center gap-1 bg-amber-600 text-cream-50 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
          {product.bestseller && (
            <span className="inline-flex items-center gap-1 bg-chocolate-900 text-caramel-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              <Flame className="w-3 h-3 text-caramel-400" /> Bestseller
            </span>
          )}
        </div>

        {/* Stock Alert Badge */}
        {isOutOfStock ? (
          <div className="absolute top-3 right-3 bg-red-800 text-cream-50 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            Sold Out
          </div>
        ) : isLowStock ? (
          <div className="absolute top-3 right-3 bg-amber-700 text-cream-50 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            Only {product.stock} left
          </div>
        ) : null}

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-chocolate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
          <Link
            to={`/product/${product.slug}`}
            className="pointer-events-auto p-2.5 bg-cream-50/95 hover:bg-cream-100 text-chocolate-900 rounded-full shadow-md transition transform hover:scale-105"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {categoryName && (
          <div className="text-[11px] uppercase tracking-wider font-semibold text-caramel-700 mb-1">
            {categoryName}
          </div>
        )}

        <h3 className="font-serif text-lg font-bold text-chocolate-900 line-clamp-1 group-hover:text-caramel-700 transition">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        <p className="text-xs text-chocolate-600 line-clamp-2 mt-1 mb-3 flex-1 leading-relaxed">
          {product.description}
        </p>

        {/* Weight & Price Row */}
        <div className="flex items-baseline justify-between pt-2 border-t border-cream-200">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-chocolate-900">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-chocolate-400 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-chocolate-500 bg-cream-200/80 px-2 py-0.5 rounded-md">
            {product.weight}
          </span>
        </div>

        {/* Add to Cart Action */}
        <button
          onClick={() => addToCart(product, 1)}
          disabled={isOutOfStock}
          className={`mt-4 w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${
            isOutOfStock
              ? 'bg-cream-200 text-chocolate-400 cursor-not-allowed border border-cream-300'
              : 'bg-chocolate-900 text-cream-50 hover:bg-caramel-700 active:scale-[0.99] shadow-sm'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {isOutOfStock ? 'Sold Out' : 'Add to Basket'}
        </button>
      </div>
    </div>
  );
};
