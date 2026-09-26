import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-caramel-700">
          Store Agreement
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-chocolate-950">
          Terms & Conditions
        </h1>
        <p className="text-sm text-chocolate-600">Last updated: January 2026</p>
      </div>

      <div className="bg-cream-50 p-8 sm:p-10 rounded-3xl border border-cream-300 shadow-artisan space-y-6 text-sm text-chocolate-800 leading-relaxed">
        <h2 className="font-serif text-xl font-bold text-chocolate-950">
          1. General Terms & Currency
        </h2>
        <p>
          All pricing and transactions shown on this website are in Australian Dollars (AUD) and inclusive of 10% Australian Goods and Services Tax (GST) where applicable.
        </p>

        <h2 className="font-serif text-xl font-bold text-chocolate-950">
          2. Independent Portfolio Notice
        </h2>
        <p>
          This website is an independent portfolio and redesign demonstration. It is not an official commercial platform operated by The Fudge Shop Hahndorf. Orders placed within this environment are for demonstration and QA validation purposes only.
        </p>

        <h2 className="font-serif text-xl font-bold text-chocolate-950">
          3. Artisan Variation
        </h2>
        <p>
          As authentic confectionery is handmade in small batches and sliced by hand in copper pans, minor variations in weight, swirl patterns, and slice thickness may naturally occur.
        </p>

        <h2 className="font-serif text-xl font-bold text-chocolate-950">
          4. Contact
        </h2>
        <p>
          For any inquiries, contact our team at Shop 4, 56 Mount Barker Rd, Hahndorf SA 5245 or email contact@fudgeshophahndorf.com.au.
        </p>
      </div>
    </div>
  );
};
