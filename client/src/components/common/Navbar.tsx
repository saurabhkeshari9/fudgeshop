import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Store,
  Lock,
  User as UserIcon,
  LogOut,
  Package,
  Receipt,
  UserCheck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Category, HomepageContent } from '../../types';
import { productService } from '../../services/productService';

export const Navbar: React.FC = () => {
  const { totalItems, setIsDrawerOpen } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcement, setAnnouncement] = useState<string>(
    '🇦🇺 Free Express Australia Post Shipping on all orders over $75 | Handcrafted in Hahndorf SA'
  );

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Close mobile menu and search on route change
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setCategoriesDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Load categories & announcement
    productService.getCategories().then((res) => {
      if (res.data) setCategories(res.data);
    }).catch(() => {});

    productService.getHomepageContent().then((res) => {
      if (res.data?.announcement?.enabled && res.data?.announcement?.text) {
        setAnnouncement(res.data.announcement.text);
      }
    }).catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-cream-300/80 transition-all">
      {/* Top Announcement Banner */}
      {announcement && (
        <div className="bg-chocolate-900 text-cream-100 text-[11px] sm:text-xs py-1.5 px-3 text-center tracking-wide font-medium flex items-center justify-center gap-1.5 border-b border-chocolate-800/60 shadow-sm leading-snug">
          <Sparkles className="w-3.5 h-3.5 text-caramel-400 animate-pulse hidden sm:inline flex-shrink-0" />
          <span className="line-clamp-1 sm:line-clamp-none">{announcement}</span>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-chocolate-800 hover:bg-cream-200 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="group flex flex-col items-center sm:items-start py-1">
              <span className="font-serif text-xl sm:text-2xl lg:text-[27px] font-bold tracking-tight text-chocolate-900 group-hover:text-caramel-700 transition leading-none">
                The Fudge Shop
              </span>
              <span className="text-[9px] sm:text-[10.5px] tracking-[0.16em] sm:tracking-[0.24em] uppercase font-semibold text-caramel-700 mt-1 select-none">
                Hahndorf • Adelaide Hills
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition hover:text-caramel-600 ${
                location.pathname === '/' ? 'text-caramel-700 font-semibold' : 'text-chocolate-800'
              }`}
            >
              Home
            </Link>

            <Link
              to="/shop"
              className={`text-sm font-medium transition hover:text-caramel-600 ${
                location.pathname === '/shop' ? 'text-caramel-700 font-semibold' : 'text-chocolate-800'
              }`}
            >
              Shop All
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-sm font-medium text-chocolate-800 hover:text-caramel-600 py-2 transition"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              >
                Categories
                <ChevronDown className="w-3.5 h-3.5 text-chocolate-500" />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-cream-50 border border-cream-300 rounded-xl shadow-artisan-lg py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-chocolate-400 border-b border-cream-200">
                    Artisan Collections
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/shop/${cat.slug}`}
                      className="block px-4 py-2.5 text-sm text-chocolate-800 hover:bg-cream-200 hover:text-caramel-700 transition font-medium"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`text-sm font-medium transition hover:text-caramel-600 ${
                location.pathname === '/about' ? 'text-caramel-700 font-semibold' : 'text-chocolate-800'
              }`}
            >
              Our Story
            </Link>

            <Link
              to="/visit-us"
              className={`flex items-center gap-1 text-sm font-medium transition hover:text-caramel-600 ${
                location.pathname === '/visit-us' ? 'text-caramel-700 font-semibold' : 'text-chocolate-800'
              }`}
            >
              <Store className="w-4 h-4 text-caramel-600" />
              Visit Hahndorf
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-medium transition hover:text-caramel-600 ${
                location.pathname === '/contact' ? 'text-caramel-700 font-semibold' : 'text-chocolate-800'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Icons (Search, Cart, Admin) */}
          <div className="flex items-center gap-1.5 sm:gap-4">
            {/* Search Trigger */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 sm:p-2.5 rounded-full text-chocolate-800 hover:bg-cream-200 transition"
                aria-label="Open search bar"
              >
                <Search className="w-5 h-5" />
              </button>

              {searchOpen && (
                <div className="fixed inset-x-3 top-16 sm:top-20 z-50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80">
                  <form
                    onSubmit={handleSearchSubmit}
                    className="w-full bg-cream-50 border border-cream-300 rounded-2xl shadow-artisan-lg p-2.5 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Search over 40 flavours..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="flex-1 px-3 py-2 text-xs sm:text-sm bg-cream-100 border border-cream-200 rounded-xl text-chocolate-900 placeholder:text-chocolate-400 focus:outline-none focus:ring-1 focus:ring-caramel-500"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-chocolate-900 text-cream-50 text-xs font-semibold rounded-xl hover:bg-caramel-700 transition flex-shrink-0"
                    >
                      Go
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-cream-200/80 hover:bg-cream-300 text-chocolate-900 transition flex items-center justify-center group"
              aria-label="View Shopping Basket"
            >
              <ShoppingBag className="w-5 h-5 text-chocolate-800 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-berry-700 text-cream-50 text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center shadow">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Customer Account Button & Dropdown */}
            {isAuthenticated ? (
              <div
                className="relative hidden sm:block"
                onMouseEnter={() => setUserDropdownOpen(true)}
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-cream-300 bg-cream-100 hover:bg-cream-200 text-chocolate-900 transition shadow-sm"
                >
                  <UserIcon className="w-3.5 h-3.5 text-caramel-700" />
                  <span className="max-w-[100px] truncate">{user?.name.split(' ')[0] || 'Account'}</span>
                  <ChevronDown className="w-3 h-3 text-chocolate-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-cream-50 border border-cream-300 rounded-2xl shadow-artisan-lg py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-cream-200">
                      <div className="text-xs font-bold text-chocolate-950 truncate">{user?.name}</div>
                      <div className="text-[11px] text-chocolate-500 truncate">{user?.email}</div>
                    </div>
                    <Link
                      to="/account/profile"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-chocolate-800 hover:bg-cream-200 transition"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-caramel-700" />
                      <span>Profile & Address</span>
                    </Link>
                    <Link
                      to="/account/orders"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-chocolate-800 hover:bg-cream-200 transition"
                    >
                      <Package className="w-3.5 h-3.5 text-caramel-700" />
                      <span>My Orders</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-caramel-700 hover:bg-cream-200 transition border-t border-cream-200"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Admin Portal</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition border-t border-cream-200 text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/account/login"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-cream-300 bg-cream-100/70 hover:bg-cream-200 text-chocolate-800 transition"
              >
                <UserIcon className="w-3.5 h-3.5 text-caramel-700" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Admin Portal Quick Link (if admin or staff) */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                title="Admin Portal"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-cream-300 bg-caramel-100/60 hover:bg-caramel-200 text-chocolate-800 transition"
              >
                <Lock className="w-3.5 h-3.5 text-caramel-700" />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-cream-200 bg-cream-50 px-4 pt-3 pb-8 space-y-3 shadow-inner max-h-[calc(100vh-4.5rem)] overflow-y-auto">
          {isAuthenticated ? (
            <div className="bg-cream-100 p-3 rounded-xl border border-cream-200 space-y-1">
              <div className="text-xs font-bold text-chocolate-950 truncate">{user?.name}</div>
              <div className="text-[11px] text-chocolate-600 truncate">{user?.email}</div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-center text-xs">
                <Link
                  to="/account/profile"
                  className="bg-cream-50 p-2 rounded-lg border border-cream-300 font-semibold text-chocolate-800 hover:bg-cream-200 transition"
                >
                  Profile & Address
                </Link>
                <Link
                  to="/account/orders"
                  className="bg-cream-50 p-2 rounded-lg border border-cream-300 font-semibold text-chocolate-800 hover:bg-cream-200 transition"
                >
                  My Orders
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-cream-200">
              <Link
                to="/account/login"
                className="text-center py-2.5 text-xs font-bold rounded-xl bg-chocolate-900 text-cream-50 shadow-artisan"
              >
                Sign In
              </Link>
              <Link
                to="/account/register"
                className="text-center py-2.5 text-xs font-bold rounded-xl border border-cream-300 bg-cream-100 text-chocolate-900"
              >
                Register
              </Link>
            </div>
          )}

          <Link
            to="/"
            className="block py-2 text-sm sm:text-base font-semibold text-chocolate-900 border-b border-cream-200"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="block py-2 text-sm sm:text-base font-semibold text-chocolate-900 border-b border-cream-200"
          >
            Shop All Treats
          </Link>

          <div className="py-2 border-b border-cream-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-caramel-700 mb-2">
              Collections
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-1">
              {categories.map((c) => (
                <Link
                  key={c._id}
                  to={`/shop/${c.slug}`}
                  className="text-xs sm:text-sm text-chocolate-700 hover:text-caramel-700 py-1 truncate block"
                >
                  • {c.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            to="/about"
            className="block py-2 text-sm sm:text-base font-semibold text-chocolate-900 border-b border-cream-200"
          >
            Our Story & History
          </Link>
          <Link
            to="/visit-us"
            className="block py-2 text-sm sm:text-base font-semibold text-chocolate-900 border-b border-cream-200"
          >
            Visit Our Hahndorf Store
          </Link>
          <Link
            to="/contact"
            className="block py-2 text-sm sm:text-base font-semibold text-chocolate-900 border-b border-cream-200"
          >
            Contact Us
          </Link>

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 py-2 text-sm font-semibold text-caramel-700"
            >
              <Lock className="w-4 h-4" /> Admin Portal
            </Link>
          )}

          {isAuthenticated && (
            <button
              onClick={logout}
              className="w-full text-left py-2 text-sm font-semibold text-red-700 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
};
