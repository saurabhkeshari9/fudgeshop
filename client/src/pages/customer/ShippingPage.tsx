import React from 'react';
import { Truck, ShieldCheck, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShippingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-caramel-700">
          Australia-Wide Delivery
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-chocolate-950">
          Shipping & Delivery Policy
        </h1>
        <p className="text-base text-chocolate-700 leading-relaxed">
          We dispatch fresh artisan confectionery directly from our kitchen in Hahndorf, South Australia to all states and territories.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-cream-100 rounded-2xl border border-cream-300 space-y-2">
          <Truck className="w-6 h-6 text-caramel-700" />
          <h3 className="font-serif text-lg font-bold text-chocolate-900">Standard Delivery</h3>
          <p className="text-xs sm:text-sm text-chocolate-600">
            $12.50 Flat Rate across Australia. Estimated 3–5 business days. Free on orders over $75.
          </p>
        </div>

        <div className="p-6 bg-cream-100 rounded-2xl border border-cream-300 space-y-2">
          <Clock className="w-6 h-6 text-caramel-700" />
          <h3 className="font-serif text-lg font-bold text-chocolate-900">Express Priority</h3>
          <p className="text-xs sm:text-sm text-chocolate-600">
            $16.50 Express via Australia Post. Estimated 1–2 business days with priority dispatch.
          </p>
        </div>

        <div className="p-6 bg-cream-100 rounded-2xl border border-cream-300 space-y-2">
          <ShieldCheck className="w-6 h-6 text-caramel-700" />
          <h3 className="font-serif text-lg font-bold text-chocolate-900">Insulated Packaging</h3>
          <p className="text-xs sm:text-sm text-chocolate-600">
            Thermal wrap protection ensures your fudge and chocolates arrive in pristine condition year-round.
          </p>
        </div>
      </div>

      {/* Policy Details */}
      <div className="bg-cream-50 p-8 rounded-3xl border border-cream-300 space-y-6 text-sm text-chocolate-800 leading-relaxed shadow-artisan">
        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-chocolate-950">
            Order Processing & Dispatch Schedule
          </h2>
          <p>
            Orders placed Monday through Thursday are typically dispatched within 24–48 hours. To protect chocolate and confectionery from spending the weekend in transit hubs during warmer months, orders placed on Friday, Saturday, or Sunday are dispatched fresh on Monday morning.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-chocolate-950">
            Delivery Accuracy & Addresses
          </h2>
          <p>
            It is the customer's responsibility to enter the correct postal address at checkout. If a parcel is returned due to an incorrect address entered at the time of ordering, re-delivery charges will apply.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-chocolate-950">
            In-Store Collection
          </h2>
          <p>
            Local customers and Adelaide Hills travellers may select <em>Pay on Collection</em> to collect orders directly from our store at <strong>Shop 4, 56 Mount Barker Rd, Hahndorf SA 5245</strong> at no extra cost.
          </p>
        </div>

        <div className="p-4 bg-caramel-100/70 rounded-xl border border-caramel-300 flex items-start gap-3 text-xs text-chocolate-900">
          <AlertCircle className="w-5 h-5 text-caramel-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Summer Warm Weather Guarantee:</strong> During heatwaves in South Australia, we include gel chill packs and hold dispatch if necessary until temperatures cool down to preserve quality.
          </div>
        </div>
      </div>

      <div className="pt-4 text-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-chocolate-900 text-cream-50 font-bold text-sm rounded-2xl hover:bg-caramel-700 transition shadow"
        >
          <span>Ready to Order? Explore Treats</span>
        </Link>
      </div>
    </div>
  );
};
