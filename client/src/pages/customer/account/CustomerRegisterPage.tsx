import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

export const CustomerRegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: 'SA',
    postcode: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (formData.postcode && !/^[0-9]{4}$/.test(formData.postcode.trim())) {
      errs.postcode = 'Postcode must be 4 digits (e.g. 5245)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      error('Please review the errors highlighted below.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        address: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state,
          postcode: formData.postcode.trim(),
          country: 'Australia',
        },
      });

      success(`Welcome to The Fudge Shop, ${user.name}! Your account is active.`);
      navigate('/account/profile');
    } catch (err: any) {
      error(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-cream-100/50">
      <div className="w-full max-w-xl bg-cream-50 p-8 sm:p-10 rounded-3xl border border-cream-300 shadow-artisan-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-cream-200 text-chocolate-900 mb-1">
            <UserPlus className="w-7 h-7 text-caramel-700" />
          </div>
          <span className="block text-[11px] font-bold uppercase tracking-[0.25em] text-caramel-700">
            Join The Artisan Confectionery Club
          </span>
          <h1 className="font-serif text-3xl font-bold text-chocolate-950">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-600">
            Save your delivery details, track artisan parcels in real time, and view all purchase receipts.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-chocolate-800 border-b border-cream-200 pb-1">
              Account Credentials
            </h2>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Clara Henderson"
                className={`w-full px-4 py-2.5 text-sm bg-cream-100 border rounded-xl focus:outline-none focus:ring-1 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-cream-300 focus:ring-caramel-500'
                }`}
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="clara@example.com.au"
                    className={`w-full pl-9 pr-4 py-2.5 text-sm bg-cream-100 border rounded-xl focus:outline-none focus:ring-1 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-cream-300 focus:ring-caramel-500'
                    }`}
                  />
                  <Mail className="w-4 h-4 text-chocolate-400 absolute left-3 top-3" />
                </div>
                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0412 345 678"
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                  />
                  <Phone className="w-4 h-4 text-chocolate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Password (min 6 chars) *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-4 py-2.5 text-sm bg-cream-100 border rounded-xl focus:outline-none focus:ring-1 ${
                      errors.password ? 'border-red-500 focus:ring-red-500' : 'border-cream-300 focus:ring-caramel-500'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-chocolate-400 absolute left-3 top-3" />
                </div>
                {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-4 py-2.5 text-sm bg-cream-100 border rounded-xl focus:outline-none focus:ring-1 ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-cream-300 focus:ring-caramel-500'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-chocolate-400 absolute left-3 top-3" />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Delivery Address Defaults (Optional) */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-chocolate-800 border-b border-cream-200 pb-1 flex items-center justify-between">
              <span>Default Australian Shipping Address</span>
              <span className="text-[10px] lowercase font-normal text-chocolate-500">(optional)</span>
            </h2>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Street Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. 18 Pine Creek Lane"
                className="w-full px-4 py-2 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  City / Suburb
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Hahndorf"
                  className="w-full px-3 py-2 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  State
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-2 py-2 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500 cursor-pointer"
                >
                  <option value="SA">SA</option>
                  <option value="VIC">VIC</option>
                  <option value="NSW">NSW</option>
                  <option value="QLD">QLD</option>
                  <option value="WA">WA</option>
                  <option value="TAS">TAS</option>
                  <option value="ACT">ACT</option>
                  <option value="NT">NT</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Postcode
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  placeholder="5245"
                  className={`w-full px-3 py-2 text-sm bg-cream-100 border rounded-xl focus:outline-none focus:ring-1 ${
                    errors.postcode ? 'border-red-500 focus:ring-red-500' : 'border-cream-300 focus:ring-caramel-500'
                  }`}
                />
              </div>
            </div>
            {errors.postcode && <p className="text-xs text-red-600">{errors.postcode}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-sm rounded-xl shadow-artisan transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4 text-caramel-300" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="pt-4 border-t border-cream-200 text-center">
          <p className="text-xs text-chocolate-600">
            Already have an account?{' '}
            <Link
              to="/account/login"
              className="font-bold text-caramel-700 hover:text-caramel-800 underline underline-offset-2"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
