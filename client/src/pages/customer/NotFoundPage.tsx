import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-28 text-center space-y-6">
      <div className="font-serif text-8xl font-bold text-caramel-600">404</div>
      <h1 className="font-serif text-3xl font-bold text-chocolate-900">
        Page Not Located
      </h1>
      <p className="text-sm text-chocolate-600 leading-relaxed max-w-sm mx-auto">
        The treat or page you're searching for seems to have vanished like a fresh slice of warm fudge!
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 bg-chocolate-900 text-cream-50 font-bold text-sm rounded-xl hover:bg-caramel-700 transition flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-3 bg-cream-200 text-chocolate-900 font-bold text-sm rounded-xl hover:bg-cream-300 transition flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse 40+ Flavours</span>
        </Link>
      </div>
    </div>
  );
};
