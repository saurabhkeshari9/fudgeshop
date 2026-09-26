import React from 'react';
import { RotateCcw, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-caramel-700">
          Our Taste Guarantee
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-chocolate-950">
          Refund & Returns Policy
        </h1>
        <p className="text-base text-chocolate-700 leading-relaxed">
          We pride ourselves on the finest small-batch artisan confectionery in South Australia. Here is how our 14-day guarantee works.
        </p>
      </div>

      <div className="bg-cream-50 p-8 sm:p-10 rounded-3xl border border-cream-300 shadow-artisan space-y-8 text-sm text-chocolate-800 leading-relaxed">
        <div className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-chocolate-950 flex items-center gap-2.5">
            <RotateCcw className="w-5 h-5 text-caramel-700" />
            <span>14-Day Taste Satisfaction Guarantee</span>
          </h2>
          <p>
            If you receive a confectionery item that you believe does not meet our high standards or is not what you ordered, we will promptly replace the item or refund your purchase at our discretion.
          </p>
          <p>
            Requests for refunds or replacements must be received within <strong>14 days of parcel delivery</strong>.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-cream-200">
          <h2 className="font-serif text-xl font-bold text-chocolate-950">
            Return Procedure & Address
          </h2>
          <p>
            To lodge a refund request, please email our store team at{' '}
            <a href="mailto:contact@fudgeshophahndorf.com.au" className="text-caramel-800 underline font-semibold">
              contact@fudgeshophahndorf.com.au
            </a>{' '}
            with your order number, photo evidence (if damaged in transit), and details of the issue.
          </p>
          <p>
            If requested to return the product, please mail the item back to our physical store:
          </p>
          <div className="p-4 bg-cream-100 rounded-xl border border-cream-200 font-medium text-chocolate-900">
            <strong>The Fudge Shop Hahndorf</strong><br />
            Shop 4, 56 Mount Barker Rd (Main Rd)<br />
            Hahndorf, South Australia 5245
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-cream-200">
          <h2 className="font-serif text-xl font-bold text-chocolate-950">
            Damaged or Melted Goods
          </h2>
          <p>
            While we take extreme care packaging our orders with protective insulation, Australia Post delays or unusual weather conditions can occasionally cause transit issues. Please inform us immediately upon delivery so we can lodge an inquiry and replace your goods swiftly.
          </p>
        </div>
      </div>
    </div>
  );
};
