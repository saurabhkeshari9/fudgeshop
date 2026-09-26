import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Package, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

export const AccountNav: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    info('You have signed out.');
    navigate('/');
  };

  const navItems = [
    { label: 'Personal Profile & Address', path: '/account/profile', icon: User },
    { label: 'My Orders', path: '/account/orders', icon: Package },
  ];

  return (
    <div className="bg-cream-50 border-b border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-caramel-700">
                Customer Account
              </span>
              {isAdmin && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-berry-100 text-berry-800">
                  Staff / Admin
                </span>
              )}
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
              Welcome, {user?.name || 'Valued Customer'}
            </h1>
            <p className="text-xs text-chocolate-600">
              {user?.email} {user?.phone ? `• ${user.phone}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <NavLink
                to="/admin/dashboard"
                className="px-3 py-2 text-xs font-bold rounded-xl border border-caramel-300 bg-caramel-100/60 text-chocolate-900 hover:bg-caramel-200 transition flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-caramel-700" />
                <span>Admin Dashboard</span>
              </NavLink>
            )}

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-cream-300 bg-cream-100 text-chocolate-800 hover:bg-cream-200 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-chocolate-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-2 mt-6 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-chocolate-900 text-cream-50 shadow-artisan'
                      : 'bg-cream-100/70 text-chocolate-800 hover:bg-cream-200'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
