import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Store,
  UserCheck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, clearCart, freeShippingThreshold } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { error } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'SA',
    postcode: '',
    country: 'Australia',
    shippingMethod: 'standard' as 'standard' | 'express',
    paymentMethod: 'Credit / Debit Card (Demo)',
    notes: '',
  });

  // Pre-fill user details if logged in
  React.useEffect(() => {
    if (user) {
      const parts = (user.name || '').trim().split(' ');
      const first = parts[0] || '';
      const last = parts.slice(1).join(' ') || '';
      setFormData((prev) => ({
        ...prev,
        firstName: prev.firstName || first,
        lastName: prev.lastName || last,
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address?.address || '',
        city: prev.city || user.address?.city || '',
        state: user.address?.state || prev.state || 'SA',
        postcode: prev.postcode || user.address?.postcode || '',
      }));
    }
  }, [user]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // If cart is empty, render redirection prompt
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-chocolate-900">
          Your basket is empty
        </h2>
        <p className="text-sm text-chocolate-600">
          Please select some handcrafted artisan treats before checking out.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-chocolate-900 text-cream-50 font-bold text-sm rounded-xl hover:bg-caramel-700 transition"
        >
          <span>Return to Shop</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const isFreeStandard = subtotal >= freeShippingThreshold;
  const standardFee = isFreeStandard ? 0 : 12.5;
  const expressFee = 16.5;
  const shippingCost = formData.shippingMethod === 'express' ? expressFee : standardFee;
  const grandTotal = subtotal + shippingCost;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Contact phone number is required';
    } else if (formData.phone.trim().length < 8) {
      errs.phone = 'Please provide a valid Australian phone number';
    }

    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City / Suburb is required';
    if (!formData.state.trim()) errs.state = 'State is required';

    const postcodeRegex = /^[0-9]{4}$/;
    if (!formData.postcode.trim()) {
      errs.postcode = 'Postcode is required';
    } else if (!postcodeRegex.test(formData.postcode.trim())) {
      errs.postcode = 'Postcode must be 4 digits (e.g. 5245)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      error('Please review the highlighted fields before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        shippingAddress: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postcode: formData.postcode.trim(),
          country: formData.country,
        },
        items: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        shippingMethod: formData.shippingMethod,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes.trim(),
      };

      const res = await orderService.createOrder(orderPayload);
      if (res.success && res.data) {
        clearCart();
        navigate(`/order-confirmation/${res.data.orderNumber}`);
      }
    } catch (err: any) {
      error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Title */}
      <div className="border-b border-cream-300 pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate-950">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
          Complete your Australian artisan order with verified server calculations.
        </p>
      </div>

      {/* Account Status / Fast Checkout Banner */}
      {isAuthenticated ? (
        <div className="bg-caramel-100/60 border border-caramel-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-caramel-200 flex items-center justify-center text-chocolate-900 flex-shrink-0">
              <UserCheck className="w-5 h-5 text-caramel-700" />
            </div>
            <div>
              <div className="text-xs font-bold text-chocolate-950">
                Logged in as {user?.name} ({user?.email})
              </div>
              <div className="text-[11px] text-chocolate-600">
                Your shipping details are pre-filled and this purchase will be linked to your account.
              </div>
            </div>
          </div>
          <Link
            to="/account/profile"
            className="text-xs font-bold text-caramel-800 hover:text-caramel-900 underline underline-offset-2"
          >
            Edit Profile
          </Link>
        </div>
      ) : (
        <div className="bg-cream-100 border border-cream-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="text-xs text-chocolate-700">
            <span className="font-bold text-chocolate-950">Have an artisan customer account? </span>
            Sign in for instant address autofill and to track order fulfillment in real time.
          </div>
          <Link
            to="/account/login"
            state={{ from: { pathname: '/checkout' } }}
            className="px-4 py-2 bg-chocolate-900 text-cream-50 text-xs font-bold rounded-xl hover:bg-caramel-700 transition flex-shrink-0 text-center"
          >
            Sign In to Account
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Checkout Form */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
          {/* 1. Customer Contact Details */}
          <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 space-y-4 shadow-artisan">
            <h2 className="font-serif text-xl font-bold text-chocolate-900 border-b border-cream-200 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-chocolate-900 text-cream-50 text-xs flex items-center justify-center font-sans font-bold">
                1
              </span>
              <span>Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Clara"
                  className={`w-full px-4 py-2.5 text-sm bg-cream-100 border rounded-xl focus:outline-none focus:ring-1 ${
                    errors.firstName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-cream-300 focus:ring-caramel-500'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Macleod"
                  className={`w-full px-4 py-2.5 text-sm bg-cream-100 border rounded-xl focus:outline-none focus:ring-1 ${
                    errors.lastName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-cream-300 focus:ring-caramel-500'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Email Address (for order receipt) *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="clara@example.com.au"
                  className={`w-full px-4 py-2.5 text-sm bg-cream-100 border rounded-xl focus:outline-none focus:ring-1 ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-cream-300 focus:ring-caramel-500'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Mobile / Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0412 345 678"
                  className={`w-full px-4 py-2.5 text-sm bg-cream-100 border rounded-xl focus:outline-none focus:ring-1 ${
                    errors.phone
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-cream-300 focus:ring-caramel-500'
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 space-y-4 shadow-artisan">
            <h2 className="font-serif text-xl font-bold text-chocolate-900 border-b border-cream-200 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-chocolate-900 text-cream-50 text-xs flex items-center justify-center font-sans font-bold">
                2
              </span>
              <span>Delivery Address</span>
            </h2>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 42 King William Street, Apt 3B"
                  className={`w-full px-4 py-2.5 text-sm bg-cream-100 border rounded-xl focus:outline-none focus:ring-1 ${
                    errors.address
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-cream-300 focus:ring-caramel-500'
                  }`}
                />
                {errors.address && (
                  <p className="text-xs text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                    City / Suburb *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Adelaide"
                    className={`w-full px-4 py-2.5 text-sm bg-cream-100 border rounded-xl focus:outline-none focus:ring-1 ${
                      errors.city
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-cream-300 focus:ring-caramel-500'
                    }`}
                  />
                  {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500 cursor-pointer"
                  >
                    <option value="SA">South Australia (SA)</option>
                    <option value="VIC">Victoria (VIC)</option>
                    <option value="NSW">New South Wales (NSW)</option>
                    <option value="QLD">Queensland (QLD)</option>
                    <option value="WA">Western Australia (WA)</option>
                    <option value="TAS">Tasmania (TAS)</option>
                    <option value="ACT">Australian Capital Territory (ACT)</option>
                    <option value="NT">Northern Territory (NT)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    placeholder="5000"
                    className={`w-full px-4 py-2.5 text-sm bg-cream-100 border rounded-xl focus:outline-none focus:ring-1 ${
                      errors.postcode
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-cream-300 focus:ring-caramel-500'
                    }`}
                  />
                  {errors.postcode && (
                    <p className="text-xs text-red-600">{errors.postcode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Delivery Method Selection */}
          <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 space-y-4 shadow-artisan">
            <h2 className="font-serif text-xl font-bold text-chocolate-900 border-b border-cream-200 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-chocolate-900 text-cream-50 text-xs flex items-center justify-center font-sans font-bold">
                3
              </span>
              <span>Delivery Method</span>
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                  formData.shippingMethod === 'standard'
                    ? 'border-caramel-600 bg-caramel-50/40'
                    : 'border-cream-200 bg-cream-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={formData.shippingMethod === 'standard'}
                    onChange={() => setFormData({ ...formData, shippingMethod: 'standard' })}
                    className="accent-caramel-600 w-4 h-4"
                  />
                  <div>
                    <div className="font-bold text-sm text-chocolate-900">
                      Australia Post Standard (Insulated Parcel)
                    </div>
                    <div className="text-xs text-chocolate-500">
                      Estimated 3–5 business days nationwide
                    </div>
                  </div>
                </div>
                <span className="font-bold text-sm text-chocolate-900">
                  {isFreeStandard ? 'FREE' : '$12.50 AUD'}
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${
                  formData.shippingMethod === 'express'
                    ? 'border-caramel-600 bg-caramel-50/40'
                    : 'border-cream-200 bg-cream-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={formData.shippingMethod === 'express'}
                    onChange={() => setFormData({ ...formData, shippingMethod: 'express' })}
                    className="accent-caramel-600 w-4 h-4"
                  />
                  <div>
                    <div className="font-bold text-sm text-chocolate-900">
                      Australia Post Express (Priority Chill Packaging)
                    </div>
                    <div className="text-xs text-chocolate-500">
                      Estimated 1–2 business days nationwide
                    </div>
                  </div>
                </div>
                <span className="font-bold text-sm text-chocolate-900">$16.50 AUD</span>
              </label>
            </div>
          </div>

          {/* 4. Payment Method & Notes */}
          <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 space-y-4 shadow-artisan">
            <h2 className="font-serif text-xl font-bold text-chocolate-900 border-b border-cream-200 pb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-chocolate-900 text-cream-50 text-xs flex items-center justify-center font-sans font-bold">
                4
              </span>
              <span>Payment (Portfolio Demo Mode)</span>
            </h2>

            <div className="p-4 bg-caramel-100/60 rounded-xl border border-caramel-300/80 text-xs text-chocolate-800 space-y-1">
              <div className="font-bold text-chocolate-950 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-caramel-700" />
                Portfolio Concept Simulation
              </div>
              <p>
                No real credit card will be charged. This checkout flow performs complete database verification, inventory deduction, and order creation.
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3.5 bg-cream-100 rounded-xl border border-cream-200 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={formData.paymentMethod === 'Credit / Debit Card (Demo)'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'Credit / Debit Card (Demo)' })}
                  className="accent-caramel-600 w-4 h-4"
                />
                <CreditCard className="w-4 h-4 text-chocolate-700" />
                <span className="text-sm font-semibold text-chocolate-900">
                  Credit / Debit Card (Visa, MasterCard, Amex)
                </span>
              </label>

              <label className="flex items-center gap-3 p-3.5 bg-cream-100 rounded-xl border border-cream-200 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={formData.paymentMethod === 'Pay On Collection (Hahndorf Store)'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'Pay On Collection (Hahndorf Store)' })}
                  className="accent-caramel-600 w-4 h-4"
                />
                <Store className="w-4 h-4 text-chocolate-700" />
                <span className="text-sm font-semibold text-chocolate-900">
                  Pick-up in Person (Pay at Hahndorf Store)
                </span>
              </label>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Special Delivery Instructions (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Leave at front porch if not home / Gift message on card"
                className="w-full px-4 py-2 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-8 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-base sm:text-lg rounded-2xl shadow-artisan-lg flex items-center justify-center gap-3 transition transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
                <span>Confirming Order with Kitchen...</span>
              </>
            ) : (
              <>
                <span>Place Order (${grandTotal.toFixed(2)} AUD)</span>
                <ArrowRight className="w-5 h-5 text-caramel-300" />
              </>
            )}
          </button>
        </form>

        {/* Right Order Review Sidebar */}
        <aside className="lg:col-span-5 bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-artisan space-y-6 sticky top-24">
          <h2 className="font-serif text-xl font-bold text-chocolate-900 border-b border-cream-200 pb-3">
            Your Delicacies ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.product._id} className="flex gap-3 text-sm items-center">
                <img
                  src={item.product.images[0] || 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=150&auto=format&fit=crop'}
                  alt={item.product.name}
                  className="w-14 h-14 object-cover rounded-lg bg-cream-200 border border-cream-200 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-chocolate-900 truncate">
                    {item.product.name}
                  </div>
                  <div className="text-xs text-chocolate-500">
                    Qty: {item.quantity} × ${item.product.price.toFixed(2)}
                  </div>
                </div>
                <div className="font-bold text-chocolate-900">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-cream-200 pt-4 space-y-2.5 text-sm text-chocolate-700">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-bold text-chocolate-900">${subtotal.toFixed(2)} AUD</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-bold text-chocolate-900">
                {shippingCost === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase text-xs">FREE</span>
                ) : (
                  `$${shippingCost.toFixed(2)} AUD`
                )}
              </span>
            </div>

            <div className="border-t border-cream-200 pt-3 flex justify-between items-baseline">
              <span className="font-bold text-base text-chocolate-950">Grand Total</span>
              <span className="font-serif text-2xl font-bold text-chocolate-950">
                ${grandTotal.toFixed(2)} AUD
              </span>
            </div>
            <p className="text-[11px] text-chocolate-400">
              Includes 10% Australian GST ($
              {(grandTotal / 11).toFixed(2)} AUD).
            </p>
          </div>

          <div className="pt-2 border-t border-cream-200 space-y-2 text-xs text-chocolate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-caramel-600" />
              <span>Dispatched fresh from Hahndorf, South Australia</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-caramel-600" />
              <span>Full 14-day freshness & satisfaction guarantee</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
