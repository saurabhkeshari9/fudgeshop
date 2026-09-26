import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-chocolate-950 text-chocolate-100 pt-16 pb-12 border-t border-chocolate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Highlights Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-chocolate-800/80">
          <div className="flex items-center gap-4 bg-chocolate-900/40 p-4 rounded-xl border border-chocolate-800/60">
            <div className="p-3 bg-caramel-500/20 text-caramel-400 rounded-lg">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-cream-50 text-sm">Free Express Shipping $75+</div>
              <div className="text-xs text-chocolate-300">Fast, insulated Australia Post delivery nationwide.</div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-chocolate-900/40 p-4 rounded-xl border border-chocolate-800/60">
            <div className="p-3 bg-caramel-500/20 text-caramel-400 rounded-lg">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-cream-50 text-sm">Handmade in Hahndorf</div>
              <div className="text-xs text-chocolate-300">Slow-cooked in copper pans since 1980.</div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-chocolate-900/40 p-4 rounded-xl border border-chocolate-800/60">
            <div className="p-3 bg-caramel-500/20 text-caramel-400 rounded-lg">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-cream-50 text-sm">14-Day Taste Guarantee</div>
              <div className="text-xs text-chocolate-300">Authentic South Australian quality you can trust.</div>
            </div>
          </div>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Story */}
          <div className="space-y-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-cream-50 block leading-tight">
              The Fudge Shop
            </span>
            <span className="text-xs uppercase tracking-widest text-caramel-400 font-semibold block mt-1.5">
              Hahndorf, South Australia
            </span>
            <p className="text-sm text-chocolate-300 leading-relaxed">
              Serving the Adelaide Hills with hand-crafted artisan fudge in over 40 traditional and modern flavours, gourmet churned ice cream, giant freckles, and curated sweet gift hampers.
            </p>
            <div className="pt-2 text-xs text-chocolate-400">
              ABN: 78 123 456 789 | All prices in AUD ($)
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-cream-50 mb-4 tracking-wide">
              Explore Our Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-chocolate-300">
              <li>
                <Link to="/shop" className="hover:text-caramel-400 transition">
                  All Artisan Treats
                </Link>
              </li>
              <li>
                <Link to="/shop/home-made-fudge" className="hover:text-caramel-400 transition">
                  40+ Fudge Flavours
                </Link>
              </li>
              <li>
                <Link to="/shop/gift-boxes-hampers" className="hover:text-caramel-400 transition">
                  Gift Boxes & Tasters
                </Link>
              </li>
              <li>
                <Link to="/shop/giant-freckles-treats" className="hover:text-caramel-400 transition">
                  Giant Freckles & Treats
                </Link>
              </li>
              <li>
                <Link to="/shop/ice-cream" className="hover:text-caramel-400 transition">
                  Home-made Ice Cream
                </Link>
              </li>
              <li>
                <Link to="/shop/reduced-sugar" className="hover:text-caramel-400 transition">
                  Reduced Sugar Treats
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-cream-50 mb-4 tracking-wide">
              Customer Information
            </h4>
            <ul className="space-y-2.5 text-sm text-chocolate-300">
              <li>
                <Link to="/about" className="hover:text-caramel-400 transition">
                  Our Fudgy History
                </Link>
              </li>
              <li>
                <Link to="/visit-us" className="hover:text-caramel-400 transition">
                  Visit Us in Hahndorf
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-caramel-400 transition">
                  Delivery & Shipping
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-caramel-400 transition">
                  14-Day Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-caramel-400 transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-caramel-400 transition">
                  Get in Touch
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-caramel-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-caramel-400 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Location & Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-cream-50 mb-4 tracking-wide">
              Store Location
            </h4>
            <div className="space-y-3 text-sm text-chocolate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-caramel-400 flex-shrink-0 mt-0.5" />
                <span>
                  Shop 4, 56 Mount Barker Rd (Main Rd)<br />
                  Hahndorf, South Australia 5245
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-caramel-400 flex-shrink-0" />
                <a href="tel:0883887970" className="hover:text-cream-50 transition">
                  (08) 8388 7970
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-caramel-400 flex-shrink-0" />
                <a href="mailto:contact@fudgeshophahndorf.com.au" className="hover:text-cream-50 transition break-all">
                  contact@fudgeshophahndorf.com.au
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-caramel-400 flex-shrink-0 mt-0.5" />
                <span>Open 7 Days: 10:00 AM – 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-chocolate-800 text-xs text-chocolate-400 space-y-3 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div>
            © {new Date().getFullYear()} The Fudge Shop Hahndorf. Independent Portfolio Redesign Concept.
          </div>
          <div className="text-[11px] text-chocolate-400 max-w-xl">
            <span className="font-medium text-caramel-300">Independent Concept Notice:</span> This is a demonstration redesign concept created for portfolio presentation. All trademarks and brand references belong to their respective owners.
          </div>
        </div>
      </div>
    </footer>
  );
};
