import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
    freeShippingThreshold,
    amountUntilFreeShipping,
  } = useCart();

  if (!isDrawerOpen) return null;

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-chocolate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-full sm:max-w-md bg-cream-50 shadow-2xl flex flex-col border-l border-cream-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-cream-200 flex items-center justify-between bg-cream-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-caramel-700" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-chocolate-900 flex items-center gap-1.5">
                <span>Your Basket</span>
                <span className="font-sans text-base sm:text-lg font-bold text-caramel-800">({totalItems})</span>
              </h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-lg text-chocolate-500 hover:text-chocolate-900 hover:bg-cream-200 transition"
              aria-label="Close basket"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-4 sm:px-5 py-3 bg-cream-200/70 border-b border-cream-300/80">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-chocolate-800 mb-1.5">
              <span className="flex items-center gap-1.5 line-clamp-1">
                <Truck className="w-4 h-4 text-caramel-700 flex-shrink-0" />
                {amountUntilFreeShipping === 0
                  ? '🎉 Free Shipping Unlocked!'
                  : `Add $${amountUntilFreeShipping.toFixed(2)} for Free Shipping`}
              </span>
              <span className="flex-shrink-0 font-bold ml-1">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-cream-300/80 rounded-full h-2 overflow-hidden">
              <div
                className="bg-caramel-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="p-4 bg-cream-200 text-caramel-700 rounded-full">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-xl font-bold text-chocolate-900">
                  Your basket is empty
                </h3>
                <p className="text-sm text-chocolate-600 max-w-xs">
                  Discover over 40 flavours of artisan fudge, giant freckles, and curated sweet gift hampers.
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="mt-2 px-6 py-2.5 bg-chocolate-900 text-cream-50 font-semibold text-sm rounded-xl hover:bg-caramel-700 transition shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex gap-4 p-3.5 bg-cream-100/70 rounded-xl border border-cream-200/90"
                >
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=200&auto=format&fit=crop'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-cream-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-chocolate-900 truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-xs text-chocolate-500 mb-2">
                      {item.product.weight} • ${item.product.price.toFixed(2)} each
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-cream-300 rounded-lg bg-cream-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="p-1 hover:bg-cream-200 text-chocolate-700 transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-chocolate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="p-1 hover:bg-cream-200 text-chocolate-700 transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-chocolate-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-chocolate-400 hover:text-red-700 transition"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-cream-200 bg-cream-100 space-y-3">
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold text-chocolate-800">Subtotal</span>
                <span className="font-serif text-2xl font-bold text-chocolate-900">
                  ${subtotal.toFixed(2)} AUD
                </span>
              </div>
              <p className="text-xs text-chocolate-500">
                Shipping and GST calculated at checkout. Orders dispatched from Hahndorf SA.
              </p>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2">
                <Link
                  to="/cart"
                  onClick={() => setIsDrawerOpen(false)}
                  className="py-2.5 sm:py-3 px-2 sm:px-4 border border-chocolate-800 text-chocolate-900 hover:bg-cream-200 text-center text-xs sm:text-sm font-semibold rounded-xl transition"
                >
                  View Cart
                </Link>

                <Link
                  to="/checkout"
                  onClick={() => setIsDrawerOpen(false)}
                  className="py-2.5 sm:py-3 px-2 sm:px-4 bg-chocolate-900 hover:bg-caramel-700 text-cream-50 text-center text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
