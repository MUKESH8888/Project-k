'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../components/CartContext';

export default function ContactPage() {
  const { showToast, setIsConsultationModalOpen } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    occasion: 'Bridal Muhurtham',
    weddingDate: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Please provide your name and phone number.');
      return;
    }
    setSubmitted(true);
    showToast('Inquiry submitted! Our master saree stylist will call you within 2 business hours.');
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        email: '',
        occasion: 'Bridal Muhurtham',
        weddingDate: '',
        message: '',
      });
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#1A1918]">
      <a href="#main-contact" className="skip-link">
        Skip to main content
      </a>
      <Header />

      <main id="main-contact" className="relative pt-[115px] md:pt-[135px]">
        {/* Page Banner Header */}
        <section className="bg-gradient-to-b from-[#FAF7F2] to-[#FFFDFB] border-b border-[#EAE5DC] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-gold font-bold text-xs uppercase tracking-[0.2em] block mb-3">
              సంప్రదించండి • BRIDAL CONCIERGE &amp; STORES
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#7A1426] mb-4">
              Get in Touch with Kalyanam
            </h1>
            <div className="divider-royal">
              <span className="text-gold text-lg">◆</span>
            </div>
            <p className="text-sm sm:text-base text-[#615D56] max-w-2xl mx-auto leading-relaxed">
              Whether you are planning a sacred Telugu wedding muhurtham, scheduling a VIP video shopping session, or visiting our Gudur and Palakurthy showrooms — our hereditary stylists are at your service.
            </p>
          </div>
        </section>

        {/* Contact Info & Inquiry Form Grid */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Direct Showrooms & Concierge Contact */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="badge badge-gold mb-3 text-[10px]">DIRECT SHOWROOMS</span>
                <h2 className="font-heading text-2xl font-bold text-charcoal mb-4">
                  Visit Us or Connect Instantly
                </h2>
                <p className="text-xs text-[#666] leading-relaxed mb-6 font-light">
                  Experience traditional Telugu hospitality. Our stores feature dedicated bridal lounges, groom studios, and hundreds of authentic handloom pattu drapes.
                </p>
              </div>

              {/* Showroom 1: Gudur */}
              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#EAE5DC] hover:border-gold transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-bold text-lg text-charcoal">
                    Gudur Flagship Mall
                  </h3>
                  <span className="text-xs text-gold font-bold">గూడూరు</span>
                </div>
                <p className="text-xs text-[#555] mb-3">
                  Palakurthy Road, Gudur, Telangana - 506252
                </p>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-[#EAE5DC]">
                  <a
                    href="tel:+919849012345"
                    className="flex items-center gap-1.5 font-bold text-burgundy hover:text-burgundy-deep"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span>+91 98490 12345</span>
                  </a>
                  <a
                    href="https://maps.app.goo.gl/tn1VL1L4jCtobqdT7?g_st=iw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold font-semibold hover:underline"
                  >
                    View Map →
                  </a>
                </div>
              </div>

              {/* Showroom 2: Palakurthy */}
              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#EAE5DC] hover:border-gold transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-bold text-lg text-charcoal">
                    Palakurthy Showroom
                  </h3>
                  <span className="text-xs text-gold font-bold">పాలకుర్తి</span>
                </div>
                <p className="text-xs text-[#555] mb-3">
                  Palakurthy Main Road, Palakurthy, Telangana - 506146
                </p>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-[#EAE5DC]">
                  <a
                    href="tel:+919849054321"
                    className="flex items-center gap-1.5 font-bold text-burgundy hover:text-burgundy-deep"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                    <span>+91 98490 54321</span>
                  </a>
                  <a
                    href="https://maps.app.goo.gl/iFrxPDS4CcHRxKAQ6?g_st=iw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold font-semibold hover:underline"
                  >
                    View Map →
                  </a>
                </div>
              </div>

              {/* WhatsApp Quick Dial */}
              <div className="bg-gradient-to-r from-[#1B7043] to-[#124C2D] text-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-green-200 font-bold mb-1">
                    Instant Messaging
                  </div>
                  <div className="font-heading font-bold text-lg">WhatsApp Concierge</div>
                  <div className="text-xs text-white/80">Available 9:00 AM - 9:00 PM IST</div>
                </div>
                <a
                  href="https://wa.me/919849012345?text=Hello%20Kalyanam%20Mall,%20I%20would%20like%20to%20connect%20with%20a%20bridal%20stylist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full bg-white text-[#1B7043] font-bold text-xs uppercase tracking-wider hover:bg-gold hover:text-charcoal transition-colors shadow"
                >
                  Chat Now
                </a>
              </div>
            </div>

            {/* Right Column: White-Glove Inquiry Form */}
            <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-[#EAE5DC] shadow-xl">
              <span className="text-gold font-bold text-xs uppercase tracking-widest block mb-1">
                ఆన్‌లైన్ విచారణ • WRITE TO OUR MASTER STYLISTS
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-[#7A1426] mb-3">
                Send a Message or Request a Callback
              </h2>
              <p className="text-xs text-[#666] leading-relaxed mb-8">
                Share your wedding timeline, preferred weave type (Kanchipuram, Banarasi, Gadwal), or custom queries. Our senior stylist will respond promptly.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <span className="material-symbols-outlined text-emerald-600 text-[48px]">
                    check_circle
                  </span>
                  <h3 className="font-heading text-xl font-bold text-emerald-900">
                    Thank You for Contacting Kalyanam!
                  </h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Your inquiry has been received. Master stylist Sri Ramalingam or our senior bridal team will connect with you via WhatsApp or phone call.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Smt. Lakshmi Devi"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98491 23456"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                        Occasion Type
                      </label>
                      <select
                        value={formData.occasion}
                        onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                        className="input-field bg-white"
                      >
                        <option value="Bridal Muhurtham">Bridal Muhurtham (లగ్నం)</option>
                        <option value="Reception / Sangeet">Reception &amp; Sangeet</option>
                        <option value="Groom Traditional Wear">Groom Pattu Panche / Sherwani</option>
                        <option value="Daughter Pattu Pavada">Children / Girls Pattu Pavada</option>
                        <option value="General Handloom Inquiry">General Handloom Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                      Wedding / Muhurtham Date (If applicable)
                    </label>
                    <input
                      type="date"
                      value={formData.weddingDate}
                      onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                      Your Message / Specific Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about color preferences (e.g. Sindhoori Red, Rani Pink), zari choices, or if you prefer a video call..."
                      className="w-full p-4 rounded-2xl border border-[#EAE5DC] text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="btn-primary w-full py-4 text-xs font-bold tracking-widest uppercase shadow-xl"
                    >
                      Submit Consultation Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-[#FAF7F2] border-t border-[#EAE5DC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-gold font-bold text-xs uppercase tracking-widest block mb-2">
                తరచుగా అడిగే ప్రశ్నలు • COMMON QUESTIONS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#7A1426]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'How do I know my saree is 100% pure silk?',
                  a: 'Every pure silk saree from Kalyanam Shopping Mall bears an official Silk Mark tag authorized by the Silk Mark Organisation of India (Ministry of Textiles). You can verify its unique numbered hologram QR code.',
                },
                {
                  q: 'Do you ship to USA, UK, UAE, and Australia?',
                  a: 'Yes, we provide fully insured international express courier services via DHL and FedEx. Shipments typically arrive within 4-7 business days with real-time tracking.',
                },
                {
                  q: 'Are Fall, Pico, and Kuchu included?',
                  a: 'Yes! We provide complimentary fall stitching, pico edges, and hand-knotted silk kuchu tassels on all bridal sarees so your drape arrives ready for the muhurtham.',
                },
                {
                  q: 'Can I visit the Gudur or Palakurthy showroom in person?',
                  a: 'Absolutely! Both of our flagship showrooms are open 7 days a week. We invite you to experience our exclusive private bridal lounge and feel the pure silk weaves in person.',
                },
              ].map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-[#EAE5DC] shadow-xs">
                  <h3 className="font-heading font-bold text-base text-charcoal mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-xs text-[#555] leading-relaxed font-light">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
