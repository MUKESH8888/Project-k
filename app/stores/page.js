'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../components/CartContext';

const STORES = [
  {
    id: 'gudur',
    name: 'Kalyanam Shopping Mall — Gudur Store',
    telugu: 'కళ్యాణం షాపింగ్ మాల్ — గూడూరు (ఫ్లాగ్‌షిప్)',
    tag: 'GRAND FLAGSHIP SHOWROOM',
    image: '/images/banners/hero-collection.jpg',
    address: 'Palakurthy Road, Gudur, Telangana 506252',
    landmark: 'Near Main Cross Roads, Palakurthy Road Junction',
    phone: '+91 98490 12345',
    timings: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM',
    mapUrl: 'https://maps.app.goo.gl/tn1VL1L4jCtobqdT7?g_st=iw',
    code: 'PCF6+8GQ',
    amenities: [
      'Multi-Floor Family Collection (Women, Men, Kids)',
      'VIP Bridal Muhurtham Saree Lounge with Personal Stylists',
      'Exclusive Traditional Pattu Panche & Dhoti Studio for Grooms',
      'Children Festive Pattu Pavada & Ethnic Pavilion',
      'Silk Mark Testing & Guarantee Counter',
      'Dedicated Customer Car Parking Available',
    ],
    isFlagship: true,
  },
  {
    id: 'palakurthy',
    name: 'Kalyanam Shopping Mall — Palakurthy Store',
    telugu: 'కళ్యాణం షాపింగ్ మాల్ — పాలకుర్తి',
    tag: 'HERITAGE WEAVING DESTINATION',
    image: '/images/banners/hero-bridal.jpg',
    address: 'Palakurthy Main Road, Palakurthy, Telangana 506146',
    landmark: 'Opposite State Bank, Palakurthy Main Road',
    phone: '+91 98490 54321',
    timings: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM',
    mapUrl: 'https://maps.app.goo.gl/iFrxPDS4CcHRxKAQ6?g_st=iw',
    code: 'MC5J+66H',
    amenities: [
      'Pure Kanchipuram, Banarasi & Gadwal Pattu Sarees',
      'Designer Wedding Lehengas & Half Sarees',
      'Men Ethnic Kurtas, Sherwanis & Kanduvas',
      'Expert Saree Draping & Styling Assistance',
      'Direct Weaver Pricing Guarantee',
      'Ready-to-Wear Fall & Pico Workshop On-Site',
    ],
    isFlagship: false,
  },
];

export default function StoresPage() {
  const { setIsConsultationModalOpen } = useCart();

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#1A1918]">
      <a href="#main-stores" className="skip-link">
        Skip to main content
      </a>
      <Header />

      <main id="main-stores" className="relative pt-[115px] md:pt-[135px]">
        {/* Banner Section */}
        <section className="bg-gradient-to-b from-[#FAF7F2] to-[#FFFDFB] border-b border-[#EAE5DC] py-16 md:py-20 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-gold font-bold text-xs uppercase tracking-[0.2em] block mb-3">
              వివాహ వేడుకల షోరూమ్స్ • PHYSICAL DESTINATIONS
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#7A1426] mb-4">
              Our Physical Flagship Showrooms
            </h1>
            <div className="divider-royal">
              <span className="text-gold text-lg">◆</span>
            </div>
            <p className="text-sm sm:text-base text-[#615D56] max-w-2xl mx-auto leading-relaxed">
              Step into the grand shopping destinations of Kalyanam Shopping Mall in Gudur and Palakurthy, Telangana. Immerse yourself in authentic handloom silk, touch the pure zari, and enjoy royal Telugu family hospitality.
            </p>
          </div>
        </section>

        {/* Stores Detailed Grid */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {STORES.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#EAE5DC] hover:border-gold shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Store Header Image */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#FAF3EA]">
                  <Image
                    src={store.image}
                    alt={store.name}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="badge badge-gold shadow-md text-[10px]">
                      {store.tag}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    <span>Open Today</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="font-heading text-2xl font-bold mb-1">
                      {store.name}
                    </h2>
                    <div className="text-xs text-gold font-medium">
                      {store.telugu}
                    </div>
                  </div>
                </div>

                {/* Store Body Information */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-6">
                  {/* Address & Timings */}
                  <div className="space-y-3.5 text-xs text-[#555]">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-gold text-[20px] shrink-0 mt-0.5">
                        location_on
                      </span>
                      <div>
                        <strong className="block text-charcoal font-semibold text-sm">
                          {store.address}
                        </strong>
                        <span className="text-[#888]">{store.landmark}</span>
                        <div className="mt-1 font-mono text-[11px] text-burgundy">
                          Google Plus Code: {store.code}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-gold text-[20px] shrink-0">
                        schedule
                      </span>
                      <div>
                        <span className="font-semibold text-charcoal">{store.timings}</span>
                        <span className="text-[#888] block">All 7 Days Open for Wedding Shoppers</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-gold text-[20px] shrink-0">
                        call
                      </span>
                      <a
                        href={`tel:${store.phone.replace(/[^0-9+]/g, '')}`}
                        className="text-burgundy font-bold hover:underline text-sm"
                      >
                        {store.phone}
                      </a>
                    </div>
                  </div>

                  {/* Highlights / Amenities */}
                  <div className="pt-4 border-t border-[#EAE5DC]">
                    <div className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
                      Showroom Highlights &amp; Services
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#666]">
                      {store.amenities.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-gold font-bold">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-[#EAE5DC] flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href={store.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex-1 w-full py-3 text-xs uppercase tracking-wider font-bold text-center flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[17px]">directions</span>
                      <span>Google Maps Directions</span>
                    </a>

                    <button
                      onClick={() => setIsConsultationModalOpen(true)}
                      className="btn-outline flex-1 w-full py-3 text-xs uppercase tracking-wider font-bold text-center flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[17px]">calendar_month</span>
                      <span>Book VIP Lounge Visit</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Showroom Hospitality Promise */}
        <section className="py-16 bg-[#FAF7F2] border-t border-[#EAE5DC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-gold font-bold text-xs uppercase tracking-widest block mb-2">
              అతిథి దేవో భవ • FAMILY HOSPITALITY
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#7A1426] mb-4">
              Planning a Family Wedding Shopping Trip?
            </h2>
            <p className="text-xs sm:text-sm text-[#555] max-w-xl mx-auto leading-relaxed mb-8">
              Let us know your arrival date in advance! Our senior bridal consultant will reserve a private viewing suite, arrange customized refreshment, and pre-curate sarees matching your color palette and budget.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:+919849012345"
                className="btn-secondary px-8 py-3.5 text-xs font-bold uppercase tracking-wider shadow"
              >
                Call to Reserve VIP Bridal Suite (+91 98490 12345)
              </a>
              <Link
                href="/sarees"
                className="btn-outline px-8 py-3.5 text-xs font-bold uppercase tracking-wider"
              >
                Preview Handloom Catalog First
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
