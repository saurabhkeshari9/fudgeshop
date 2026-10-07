import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

export const CustomerLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as any)?.from?.pathname || '/account/profile';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      error('Please enter your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await login({ email: email.trim(), password });
      success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin' || user.role === 'staff') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectPath);
      }
    } catch (err: any) {
      error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8 sm:py-12 bg-cream-100/50">
      <div className="w-full max-w-md bg-cream-50 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-cream-300 shadow-artisan-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-cream-200 text-chocolate-900 mb-1">
            <UserCheck className="w-7 h-7 text-caramel-700" />
          </div>
          <span className="block text-[11px] font-bold uppercase tracking-[0.25em] text-caramel-700">
            Artisan Confectionery Account
          </span>
          <h1 className="font-serif text-3xl font-bold text-chocolate-950">
            Sign In to Your Account
          </h1>
          <p className="text-xs sm:text-sm text-chocolate-600">
            Track your artisan fudge orders, view transaction receipts, and checkout faster.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com.au"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl text-chocolate-950 focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
              <Mail className="w-4 h-4 text-chocolate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl text-chocolate-950 focus:outline-none focus:ring-1 focus:ring-caramel-500"
              />
              <Lock className="w-4 h-4 text-chocolate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-sm rounded-xl shadow-artisan transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-caramel-300" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="pt-4 border-t border-cream-200 text-center space-y-3">
          <p className="text-xs text-chocolate-600">
            Don't have an artisan account yet?{' '}
            <Link
              to="/account/register"
              className="font-bold text-caramel-700 hover:text-caramel-800 underline underline-offset-2"
            >
              Create an Account
            </Link>
          </p>

          <div className="flex items-center justify-center gap-2 text-[11px] text-chocolate-500 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-caramel-600" />
            <span>Store Staff or Owner?</span>
            <Link to="/admin/login" className="font-semibold text-chocolate-700 hover:underline">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
