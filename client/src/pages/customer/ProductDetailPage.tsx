import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Flame,
  Minus,
  Plus,
  ArrowLeft,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { ProductCard } from '../../components/common/ProductCard';
import { Product } from '../../types';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProduct = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const res = await productService.getProductBySlug(slug);
        if (res.data) {
          setProduct(res.data);
          setSelectedImage(res.data.images[0] || '');
          setRelated(res.related || []);
        } else {
          setError('Product not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-12 h-12 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-chocolate-700 font-serif text-lg">Preparing artisan confectionery details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="p-4 bg-cream-200 text-caramel-800 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-chocolate-900">
          Recipe Not Found
        </h2>
        <p className="text-sm text-chocolate-600">
          We couldn't locate this particular sweet delicacy. It may have sold out or been updated.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-chocolate-900 text-cream-50 font-bold text-sm rounded-xl hover:bg-caramel-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Treats</span>
        </Link>
      </div>
    );
  }

  const categoryName = typeof product.category === 'object' ? product.category.name : 'Confectionery';
  const categorySlug = typeof product.category === 'object' ? product.category.slug : '';

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 sm:space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-chocolate-500 overflow-x-auto whitespace-nowrap pb-1">
        <Link to="/" className="hover:text-caramel-700 flex-shrink-0">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-caramel-700 flex-shrink-0">Shop</Link>
        <span>/</span>
        {categorySlug && (
          <>
            <Link to={`/shop/${categorySlug}`} className="hover:text-caramel-700 flex-shrink-0">
              {categoryName}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-chocolate-900 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Gallery Column */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          <div className="aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-cream-200 border border-cream-300 shadow-artisan-lg relative">
            <img
              src={selectedImage || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1200&auto=format&fit=crop'}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 sm:gap-2">
              {product.featured && (
                <span className="inline-flex items-center gap-1.5 bg-amber-600 text-cream-50 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
                  <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> Featured Recipe
                </span>
              )}
              {product.bestseller && (
                <span className="inline-flex items-center gap-1.5 bg-chocolate-900 text-caramel-300 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md">
                  <Flame className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-caramel-400" /> Store Bestseller
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail row if multiple images */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    selectedImage === img
                      ? 'border-caramel-600 shadow'
                      : 'border-cream-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx +1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Purchase Column */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-caramel-700">
                {categoryName}
              </span>
              <span className="text-xs text-chocolate-500 font-mono">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-chocolate-950">
              {product.name}
            </h1>
          </div>

          {/* Price & Weight */}
          <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 pb-3 sm:pb-4 border-b border-cream-200">
            <span className="font-serif text-2xl sm:text-4xl font-bold text-chocolate-900">
              ${product.price.toFixed(2)} AUD
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm sm:text-base text-chocolate-400 line-through">
                ${product.compareAtPrice.toFixed(2)} AUD
              </span>
            )}
            <span className="text-xs font-semibold text-chocolate-700 bg-cream-200 px-2.5 py-1 rounded-lg">
              {product.weight}
            </span>
          </div>

          {/* Stock Availability */}
          <div>
            {isOutOfStock ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-100 text-red-900 text-xs font-bold border border-red-200">
                <span>Sold out in kitchen — Next batch boiling soon</span>
              </div>
            ) : isLowStock ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
                <span>Only {product.stock} left in stock for dispatch</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Freshly Cut & In Stock ({product.stock} available)</span>
              </div>
            )}
          </div>

          {/* Product Description */}
          <div className="text-xs sm:text-base text-chocolate-700 leading-relaxed space-y-2">
            <p>{product.description}</p>
          </div>

          {/* Purchase Actions */}
          {!isOutOfStock && (
            <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-cream-200">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                {/* Quantity adjuster */}
                <div className="flex items-center justify-between sm:justify-center border-2 border-cream-300 rounded-xl bg-cream-50 overflow-hidden w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 sm:p-3 hover:bg-cream-200 text-chocolate-800 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm sm:text-base font-bold text-chocolate-950">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2.5 sm:p-3 hover:bg-cream-200 text-chocolate-800 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Basket button */}
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 py-3 sm:py-3.5 px-4 sm:px-6 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-sm sm:text-base rounded-xl shadow-artisan flex items-center justify-center gap-2 transition"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Add to Basket</span>
                </button>
              </div>

              {/* Buy Now instant checkout button */}
              <button
                onClick={handleBuyNow}
                className="w-full py-2.5 sm:py-3 px-6 bg-caramel-500 hover:bg-caramel-600 text-chocolate-950 font-bold text-xs sm:text-base rounded-xl transition shadow"
              >
                Instant Checkout with Buy Now
              </button>
            </div>
          )}

          {/* Culinary Specifications Accordion / Boxes */}
          <div className="pt-4 sm:pt-6 border-t border-cream-200 space-y-3 sm:space-y-4 text-xs">
            {/* Ingredients */}
            <div className="p-3.5 sm:p-4 bg-cream-100 rounded-xl border border-cream-200 space-y-1">
              <span className="font-bold text-chocolate-900 uppercase tracking-wider block">
                Pure Ingredients:
              </span>
              <p className="text-chocolate-700 leading-relaxed">{product.ingredients}</p>
            </div>

            {/* Allergens */}
            <div className="p-3.5 sm:p-4 bg-amber-50 rounded-xl border border-amber-200/80 space-y-1">
              <span className="font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-700" />
                Allergen Information:
              </span>
              <p className="text-amber-800 leading-relaxed">{product.allergens}</p>
            </div>

            {/* Storage */}
            <div className="p-3.5 sm:p-4 bg-cream-100 rounded-xl border border-cream-200 space-y-1">
              <span className="font-bold text-chocolate-900 uppercase tracking-wider block">
                Storage & Longevity:
              </span>
              <p className="text-chocolate-700 leading-relaxed">{product.storageInstructions}</p>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-3 text-xs text-chocolate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-caramel-600 flex-shrink-0" />
              <span>Insulated Australia Post Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-caramel-600 flex-shrink-0" />
              <span>14-Day Taste Satisfaction Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Showcase */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-cream-300">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-widest font-bold text-caramel-700">
              Complete Your Box
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900 mt-1">
              Frequently Enjoyed Together
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((relProduct) => (
              <ProductCard key={relProduct._id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
