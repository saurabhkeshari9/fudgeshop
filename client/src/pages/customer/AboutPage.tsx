import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Heart, Sparkles, Store, ArrowRight, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-bold text-caramel-700">
          Four Decades of Passion
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-chocolate-950">
          A Fudgy History from Historic Hahndorf
        </h1>
        <p className="text-base sm:text-lg text-chocolate-700 leading-relaxed">
          How a small village confectionery store on Mount Barker Road became an Adelaide Hills icon for over 40 years.
        </p>
      </div>

      {/* Main Image Banner */}
      <div className="rounded-3xl overflow-hidden shadow-artisan-lg border border-cream-300 aspect-[21/9] bg-cream-200">
        <img
          src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1600&auto=format&fit=crop"
          alt="Artisan copper pan fudge making"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Story Narrative */}
      <div className="space-y-8 text-chocolate-800 text-base sm:text-lg leading-relaxed font-normal">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 font-serif text-2xl sm:text-3xl font-bold text-chocolate-950 leading-snug">
            "We believe fudge should be slow-cooked, richly textured, and never rushed."
          </div>
          <div className="md:col-span-7 space-y-4 text-chocolate-700">
            <p>
              In 1980, tucked away on the shaded Main Street of Hahndorf—Australia’s oldest surviving German settlement—The Fudge Shop opened its doors with a simple copper kettle and an unyielding commitment to traditional methods.
            </p>
            <p>
              While industrial confectionery shifted toward powdered mixes, emulsifiers, and shortcuts, our kitchen stayed true to the classic technique: pure South Australian full cream milk, golden butter, sugar, and slow boiling in heavy-bottomed copper pans.
            </p>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-cream-300">
          <div className="p-6 bg-cream-100 rounded-2xl border border-cream-300 space-y-3">
            <div className="p-3 bg-caramel-200 text-caramel-800 rounded-xl w-fit">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-chocolate-950">Copper Pan Boiling</h3>
            <p className="text-xs sm:text-sm text-chocolate-600 leading-relaxed">
              Uniform heat distribution allows slow caramelisation, producing the signature melt-in-the-mouth velvet finish.
            </p>
          </div>

          <div className="p-6 bg-cream-100 rounded-2xl border border-cream-300 space-y-3">
            <div className="p-3 bg-caramel-200 text-caramel-800 rounded-xl w-fit">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-chocolate-950">Local Dairy & Nuts</h3>
            <p className="text-xs sm:text-sm text-chocolate-600 leading-relaxed">
              We source Australian roasted macadamias, pecans, clotted cream, and Murray River sea salt.
            </p>
          </div>

          <div className="p-6 bg-cream-100 rounded-2xl border border-cream-300 space-y-3">
            <div className="p-3 bg-caramel-200 text-caramel-800 rounded-xl w-fit">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-chocolate-950">40+ Signature Flavours</h3>
            <p className="text-xs sm:text-sm text-chocolate-600 leading-relaxed">
              From heritage butterscotch and rum & raisin to modern favourites like speculoos Biscoff and white choc raspberry.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
            More Than Just Fudge
          </h2>
          <p className="text-chocolate-700">
            Over the decades, our repertoire has expanded to include churned home-made ice cream, authentic Belgian chocolates, hand-crafted giant freckles coated in rainbow nonpareils, and festive seasonal specialities.
          </p>
          <p className="text-chocolate-700">
            Whether you stop by in person during an Adelaide Hills weekend drive or order a gift box delivered anywhere in Australia, you are experiencing four decades of handcrafted South Australian devotion.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-chocolate-900 text-cream-50 p-8 sm:p-12 rounded-3xl border border-chocolate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-artisan-lg">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">
            Ready to Taste the Difference?
          </h3>
          <p className="text-sm text-chocolate-200 max-w-lg">
            Discover all 40+ flavours or build your bespoke taster box today.
          </p>
        </div>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-caramel-500 hover:bg-caramel-600 text-chocolate-950 font-bold text-sm rounded-xl transition shadow flex items-center gap-2 flex-shrink-0"
        >
          <span>Explore All Treats</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
