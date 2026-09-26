import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@fudgeshop.local');
  const [password, setPassword] = useState('FudgeAdmin2026!');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { error, success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      success('Welcome back, Store Manager!');
      navigate(from, { replace: true });
    } catch (err: any) {
      error(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-block group">
          <span className="font-serif text-3xl font-bold text-chocolate-950 group-hover:text-caramel-700 transition">
            The Fudge Shop
          </span>
          <span className="text-[10px] tracking-widest uppercase font-semibold text-caramel-700 block">
            Hahndorf • Admin Management
          </span>
        </Link>
        <h2 className="font-serif text-2xl font-bold text-chocolate-900 pt-2">
          Sign In to Portal
        </h2>
        <p className="text-xs text-chocolate-600">
          Manage products, categories, customer orders, and homepage content.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-cream-50 py-8 px-6 sm:px-10 rounded-3xl border border-cream-300 shadow-artisan-lg space-y-6">
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
                  placeholder="admin@fudgeshop.local"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500"
                />
                <Mail className="w-4 h-4 text-chocolate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl text-chocolate-900 focus:outline-none focus:ring-1 focus:ring-caramel-500"
                />
                <Lock className="w-4 h-4 text-chocolate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-sm rounded-xl shadow-artisan flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-4 h-4 text-caramel-300" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-cream-200 text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-chocolate-600 hover:text-caramel-700 flex items-center justify-center gap-1.5 transition"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Back to Customer Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
