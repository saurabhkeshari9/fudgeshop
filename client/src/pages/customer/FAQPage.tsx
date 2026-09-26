import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Does your fudge need to be stored in the refrigerator?',
      a: 'No! Authentic copper-pan fudge is best stored at room temperature in an airtight container away from direct sunlight. Storing fudge in the fridge can draw out the natural moisture and cause crystallisation or dryness. Keep it cool and dry in your pantry.',
    },
    {
      q: 'What is the shelf life of your artisan fudge?',
      a: 'When stored in an airtight container, our fudge maintains peak flavour and velvet texture for 3 to 6 months. For gift boxes, individual slices are sealed to lock in freshness.',
    },
    {
      q: 'Can fudge be frozen for later enjoyment?',
      a: 'Yes, absolutely! Wrap the fudge tightly in parchment or foil, then place it inside a sealed freezer bag. It can be frozen for up to 12 months. When ready to enjoy, simply allow it to thaw on your counter at room temperature overnight.',
    },
    {
      q: 'Do you offer gluten-free or nut-free options?',
      a: 'Many of our traditional fudge flavours (such as Classic Clotted Cream, Salted Caramel, and Butterscotch) do not contain gluten ingredients. However, all our confectionery is prepared in a kitchen that also processes wheat, peanuts, and tree nuts (walnuts, pecans, macadamias). Please read the detailed allergen tags on each product page.',
    },
    {
      q: 'How does shipping work during hot Australian summer months?',
      a: 'We monitor regional temperatures closely. All parcels are packaged with thermal foil wrap and ice gel packs when required. If extreme heatwaves are forecasted along your transit route, we will notify you and dispatch as soon as temperatures moderate.',
    },
    {
      q: 'Can I order custom gift boxes or corporate hampers?',
      a: 'Yes! We frequently assemble bespoke hampers and 4-pack or 6-pack taster boxes for corporate gifts, weddings, and special events. Contact our team at contact@fudgeshophahndorf.com.au for custom assortments.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-bold text-caramel-700">
          Frequently Asked Questions
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-chocolate-950">
          Everything You Need to Know
        </h1>
        <p className="text-base text-chocolate-700 leading-relaxed">
          Storage tips, ingredients, shelf-life, and ordering advice from our Hahndorf confectioners.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-cream-50 rounded-2xl border border-cream-300 overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif text-lg font-bold text-chocolate-900 hover:text-caramel-700 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-caramel-700 flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-sm sm:text-base text-chocolate-700 leading-relaxed border-t border-cream-200 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-cream-100 rounded-3xl border border-cream-300 text-center space-y-3">
        <h3 className="font-serif text-2xl font-bold text-chocolate-900">
          Have another question?
        </h3>
        <p className="text-sm text-chocolate-600">
          We are always happy to help. Reach out to our store team directly.
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-chocolate-900 text-cream-50 font-bold text-sm rounded-xl hover:bg-caramel-700 transition shadow"
          >
            <span>Contact Our Team</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
