import React from 'react';
import { MapPin, Phone, Mail, Clock, Car, Navigation, Sparkles, ExternalLink } from 'lucide-react';

export const VisitUsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-bold text-caramel-700">
          Adelaide Hills Day Trip
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-chocolate-950">
          Visit Us in Historic Hahndorf
        </h1>
        <p className="text-base text-chocolate-700 leading-relaxed">
          Step off the leafy Main Street of Australia’s oldest German settlement and into a world of melting caramel and freshly churned treats.
        </p>
      </div>

      {/* Main Info Card & Map Preview */}
      <div className="bg-cream-50 rounded-3xl border border-cream-300 shadow-artisan overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Info Column */}
        <div className="lg:col-span-6 p-8 sm:p-12 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-caramel-700">
              Store Information
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-900">
              The Fudge Shop Hahndorf
            </h2>
          </div>

          <div className="space-y-5 text-sm text-chocolate-800">
            <div className="flex items-start gap-3.5">
              <MapPin className="w-5 h-5 text-caramel-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-chocolate-950">Physical Address:</strong>
                Shop 4, 56 Mount Barker Rd (Main Rd)<br />
                Hahndorf, South Australia 5245
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Clock className="w-5 h-5 text-caramel-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-chocolate-950">Opening Hours:</strong>
                Monday to Sunday: 10:00 AM – 5:00 PM<br />
                <span className="text-xs text-chocolate-500">Open 7 days a week including most public holidays.</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Phone className="w-5 h-5 text-caramel-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-chocolate-950">Telephone:</strong>
                <a href="tel:0883887970" className="hover:text-caramel-700 transition">
                  (08) 8388 7970
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Mail className="w-5 h-5 text-caramel-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-chocolate-950">Email Inquiries:</strong>
                <a href="mailto:contact@fudgeshophahndorf.com.au" className="hover:text-caramel-700 transition">
                  contact@fudgeshophahndorf.com.au
                </a>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://maps.google.com/?q=Shop+4,+56+Mount+Barker+Rd,+Hahndorf+SA+5245"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-chocolate-900 text-cream-50 font-bold text-sm rounded-xl hover:bg-caramel-700 transition shadow"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Driving Directions</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Visual / Map Representation */}
        <div className="lg:col-span-6 bg-cream-200 min-h-[350px] relative">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop"
            alt="The Fudge Shop in Hahndorf"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chocolate-950/60 via-transparent to-transparent flex items-end p-6">
            <div className="bg-cream-50/95 backdrop-blur-md p-4 rounded-xl border border-cream-200 shadow-artisan max-w-sm text-xs">
              <div className="font-bold text-chocolate-900 text-sm">Hahndorf Adelaide Hills</div>
              <div className="text-chocolate-600 mt-0.5">
                Located right in the village shopping arcade opposite iconic German bakeries and historic elm trees.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Tips */}
      <div className="space-y-6 pt-4">
        <h3 className="font-serif text-2xl font-bold text-chocolate-900 text-center">
          Planning Your Journey
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-cream-100 rounded-2xl border border-cream-300 space-y-3">
            <div className="p-3 bg-caramel-100 text-caramel-800 rounded-xl w-fit">
              <Car className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg font-bold text-chocolate-900">How to Get Here</h4>
            <p className="text-xs sm:text-sm text-chocolate-600 leading-relaxed">
              Just 25 minutes scenic drive from the Adelaide CBD up the South Eastern Freeway. Take the Hahndorf exit.
            </p>
          </div>

          <div className="p-6 bg-cream-100 rounded-2xl border border-cream-300 space-y-3">
            <div className="p-3 bg-caramel-100 text-caramel-800 rounded-xl w-fit">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg font-bold text-chocolate-900">In-Store Tastings</h4>
            <p className="text-xs sm:text-sm text-chocolate-600 leading-relaxed">
              Sample our daily batch before you buy! Taste seasonal limited releases and watch us slice fresh blocks.
            </p>
          </div>

          <div className="p-6 bg-cream-100 rounded-2xl border border-cream-300 space-y-3">
            <div className="p-3 bg-caramel-100 text-caramel-800 rounded-xl w-fit">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg font-bold text-chocolate-900">Churned Ice Cream</h4>
            <p className="text-xs sm:text-sm text-chocolate-600 leading-relaxed">
              Don't miss our house-churned ice creams, waffle cones, and thick milkshakes available exclusively in store.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
