import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-caramel-700">
          Customer Privacy
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-chocolate-950">
          Privacy Policy
        </h1>
        <p className="text-sm text-chocolate-600">Last updated: January 2026</p>
      </div>

      <div className="bg-cream-50 p-8 sm:p-10 rounded-3xl border border-cream-300 shadow-artisan space-y-6 text-sm text-chocolate-800 leading-relaxed">
        <p>
          The Fudge Shop Hahndorf respects your privacy and is committed to protecting the personal information you share with us. This policy outlines how we handle customer details in accordance with Australian Privacy Principles (APPs).
        </p>

        <h2 className="font-serif text-xl font-bold text-chocolate-950 pt-2">
          Information We Collect
        </h2>
        <p>
          When you place an order on our website or submit an inquiry, we collect information necessary to fulfill your request, including your name, delivery address, email address, and contact phone number.
        </p>

        <h2 className="font-serif text-xl font-bold text-chocolate-950 pt-2">
          Payment Information
        </h2>
        <p>
          We do not store complete credit card or payment credentials on our servers. In this demonstration portfolio concept, checkout is executed in demo mode without processing real funds.
        </p>

        <h2 className="font-serif text-xl font-bold text-chocolate-950 pt-2">
          Independent Portfolio Concept Disclaimer
        </h2>
        <p>
          This website redesign concept is created for portfolio demonstration purposes and is not officially affiliated with The Fudge Shop Hahndorf. No actual commercial transactions are processed.
        </p>
      </div>
    </div>
  );
};
