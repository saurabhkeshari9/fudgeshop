import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalItems,
    freeShippingThreshold,
    amountUntilFreeShipping,
  } = useCart();

  const isFreeShipping = subtotal >= freeShippingThreshold;
  const estimatedShipping = isFreeShipping ? 0 : 12.5;
  const grandTotal = subtotal + estimatedShipping;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="p-6 bg-cream-200 text-caramel-700 rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-900">
          Your shopping basket is empty
        </h1>
        <p className="text-sm text-chocolate-600 max-w-md mx-auto leading-relaxed">
          Looks like you haven't selected any sweet delicacies yet. Browse our copper-kettle boiled fudge, gourmet gift hampers, and giant freckles.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-chocolate-900 text-cream-50 font-bold text-base rounded-2xl hover:bg-caramel-700 transition shadow-artisan"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Explore 40+ Fudge Flavours</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-cream-300 pb-6 gap-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950">
          Your Shopping Basket
        </h1>
        <span className="text-sm font-semibold text-chocolate-600">
          {totalItems} {totalItems === 1 ? 'handcrafted item' : 'handcrafted items'}
        </span>
      </div>

      {/* Free shipping progress notification */}
      <div className="p-4 bg-cream-100 rounded-2xl border border-cream-300 space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-chocolate-900">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-caramel-700" />
            {isFreeShipping
              ? '🎉 Free Express Delivery Unlocked!'
              : `Add $${amountUntilFreeShipping.toFixed(2)} more to your basket to receive FREE Shipping across Australia!`}
          </span>
          <span>{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-cream-300 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-caramel-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Cart Grid: Items on Left, Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-cream-50 rounded-2xl border border-cream-300 overflow-hidden shadow-artisan">
            <div className="divide-y divide-cream-200">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
                >
                  <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
                    <img
                      src={item.product.images[0] || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=200&auto=format&fit=crop'}
                      alt={item.product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-cream-200 border border-cream-200"
                    />
                  </Link>

                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="font-serif text-lg font-bold text-chocolate-900 hover:text-caramel-700 transition block truncate"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-xs text-chocolate-500">
                      {item.product.weight} • ${item.product.price.toFixed(2)} each
                    </div>
                    <div className="text-xs text-emerald-800 font-medium">
                      In stock ({item.product.stock} available)
                    </div>
                  </div>

                  {/* Quantity and Line Subtotal */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                    <div className="flex items-center border border-cream-300 rounded-xl bg-cream-100 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="p-1.5 hover:bg-cream-200 text-chocolate-800 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-chocolate-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="p-1.5 hover:bg-cream-200 text-chocolate-800 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif text-lg font-bold text-chocolate-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-chocolate-400 hover:text-red-700 p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Actions Footer */}
            <div className="p-4 bg-cream-100/70 border-t border-cream-200 flex items-center justify-between">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-bold text-chocolate-800 hover:text-caramel-700 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-red-700 hover:text-red-900 transition"
              >
                Empty Basket
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-cream-50 p-6 rounded-2xl border border-cream-300 shadow-artisan space-y-6 sticky top-24">
          <h2 className="font-serif text-xl font-bold text-chocolate-900 pb-3 border-b border-cream-200">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm text-chocolate-700">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-chocolate-950">${subtotal.toFixed(2)} AUD</span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span>Estimated Shipping</span>
                <span className="block text-[11px] text-chocolate-400">Australia Post Express</span>
              </div>
              <span className="font-semibold text-chocolate-950">
                {isFreeShipping ? (
                  <span className="text-emerald-700 font-bold uppercase text-xs">FREE</span>
                ) : (
                  `$${estimatedShipping.toFixed(2)} AUD`
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-cream-200 flex justify-between items-baseline">
              <span className="font-bold text-base text-chocolate-950">Estimated Total</span>
              <span className="font-serif text-2xl font-bold text-chocolate-950">
                ${grandTotal.toFixed(2)} AUD
              </span>
            </div>
            <p className="text-[11px] text-chocolate-500">
              Includes 10% Australian GST. Calculated accurately at checkout.
            </p>
          </div>

          <Link
            to="/checkout"
            className="w-full py-4 px-6 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-base rounded-xl shadow-artisan-lg flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-5 h-5 text-caramel-300" />
          </Link>

          {/* Secure Shopping Info */}
          <div className="space-y-2 pt-2 border-t border-cream-200 text-xs text-chocolate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-caramel-600" />
              <span>Safe & Secure Demo Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-caramel-600" />
              <span>Handcrafted & Dispatched in Hahndorf, SA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
