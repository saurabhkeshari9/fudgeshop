import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { success } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    success('Thank you! Your message has been sent to our Hahndorf team.');
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-bold text-caramel-700">
          We’d Love to Hear From You
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-chocolate-950">
          Contact The Fudge Shop
        </h1>
        <p className="text-base text-chocolate-700 leading-relaxed">
          Questions about custom wedding favours, corporate gifting hampers, allergens, or store visits? Reach out to our confectionery team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Details */}
        <div className="lg:col-span-5 bg-cream-50 p-5 sm:p-8 rounded-3xl border border-cream-300 shadow-artisan space-y-8">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-bold text-chocolate-900">
              Direct Contact
            </h2>
            <p className="text-xs sm:text-sm text-chocolate-600 leading-relaxed">
              We respond promptly during shop operating hours (10:00 AM – 5:00 PM, 7 days a week).
            </p>
          </div>

          <div className="space-y-6 text-sm text-chocolate-800">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-cream-200 text-caramel-700 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-chocolate-950">Visit Our Store:</strong>
                Shop 4, 56 Mount Barker Rd (Main Rd)<br />
                Hahndorf, South Australia 5245
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-cream-200 text-caramel-700 rounded-xl">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-chocolate-950">Telephone:</strong>
                <a href="tel:0883887970" className="hover:text-caramel-700 transition">
                  (08) 8388 7970
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-cream-200 text-caramel-700 rounded-xl">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-chocolate-950">Email Support:</strong>
                <a href="mailto:contact@fudgeshophahndorf.com.au" className="hover:text-caramel-700 transition break-all">
                  contact@fudgeshophahndorf.com.au
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-cream-200 text-caramel-700 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-chocolate-950">Trading Hours:</strong>
                Monday to Sunday: 10:00 AM – 5:00 PM
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7 bg-cream-50 p-5 sm:p-10 rounded-3xl border border-cream-300 shadow-artisan">
          <h2 className="font-serif text-2xl font-bold text-chocolate-900 mb-6">
            Send an Online Message
          </h2>

          {submitted ? (
            <div className="p-8 bg-cream-100 rounded-2xl border border-cream-300 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-chocolate-900">
                Message Received
              </h3>
              <p className="text-sm text-chocolate-600 max-w-sm mx-auto">
                Thank you for contacting The Fudge Shop. A member of our confectionery team will get back to you shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', message: '' });
                }}
                className="px-6 py-2.5 bg-chocolate-900 text-cream-50 text-xs font-bold rounded-xl hover:bg-caramel-700 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Liam Taylor"
                    className="w-full px-4 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="liam@example.com"
                    className="w-full px-4 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0412 345 678"
                  className="w-full px-4 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-chocolate-700">
                  Your Message or Inquiry *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you need..."
                  className="w-full px-4 py-2.5 text-sm bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-caramel-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-chocolate-900 text-cream-50 hover:bg-caramel-700 font-bold text-sm rounded-xl shadow-artisan flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>Send Message to Hahndorf Store</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
