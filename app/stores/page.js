'use client';

import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../components/CartContext';

const stores = [
  {
    name: 'Kalyanam Shopping Mall — Gudur Store',
    telugu: 'కళ్యాణం షాపింగ్ మాల్ — గూడూరు',
    address: 'Palakurthy Rd, Gudur, Telangana 506252',
    phone: '+91 98490 12345',
    timings: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM',
    mapUrl: 'https://maps.app.goo.gl/tn1VL1L4jCtobqdT7?g_st=iw',
    code: 'PCF6+8GQ',
    features: [
      'Complete Family Collection (Women, Men, Kids)',
      'Wedding & Bridal Saree Lounge',
      'Traditional Pattu Panche & Dhotis',
      'Direct Weaver Sourced Weaves',
    ],
    isFlagship: true,
  },
  {
    name: 'Kalyanam Shopping Mall — Palakurthy Store',
    telugu: 'కళ్యాణం షాపింగ్ మాల్ — పాలకుర్తి',
    address: 'Palakurthy Main Road, Palakurthy, Telangana 506146',
    phone: '+91 98490 54321',
    timings: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM',
    mapUrl: 'https://maps.app.goo.gl/iFrxPDS4CcHRxKAQ6?g_st=iw',
    code: 'MC5J+66H',
    features: [
      'Pattu Sarees & Lehengas',
      'Men Ethnic Wear & Sherwanis',
      'Children Festive Pavada Sets',
      'Expert Saree Consultation',
    ],
    isFlagship: false,
  },
];

export default function StoresPage() {
  const { setIsConsultationModalOpen } = useCart();

  return (
    <>
      <Header />

      <main className="w-full pt-[116px] bg-background min-h-screen">
        <div className="flex flex-col w-full">
          {/* Header Banner */}
          <section className="w-full bg-surface-container-low py-space-xl px-margin border-b border-surface-container">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-sm text-center items-center">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">
                వివాహ వేడుకల షోరూమ్స్ • TELUGU BRIDAL DESTINATIONS
              </span>
              <h1 className="font-display-lg text-headline-lg md:text-display-md text-primary font-bold">
                Our Physical Flagship Stores
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Step into the grand showrooms of Kalyanam Shopping Mall in Gudur and Palakurthy, Telangana. Experience extensive collections across Women, Men &amp; Kids wear, wedding pattu sarees, and direct weaver prices.
              </p>
            </div>
          </section>

          {/* Stores Grid */}
          <section className="w-full py-space-xl px-margin bg-background">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {stores.map((store, idx) => (
                <div
                  key={idx}
                  className={`p-space-lg rounded-2xl flex flex-col justify-between gap-space-md border transition-all ${
                    store.isFlagship
                      ? 'bg-surface-container-lowest border-primary shadow-lg ring-1 ring-primary/20'
                      : 'bg-surface-container-lowest border-surface-container shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {store.isFlagship && (
                          <span className="bg-primary text-on-primary font-label-sm text-label-sm px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold inline-block mb-1.5">
                            HYDERABAD FLAGSHIP
                          </span>
                        )}
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          {store.name}
                        </h2>
                        <p className="font-body-sm text-body-sm text-secondary italic">
                          {store.telugu}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-secondary text-[28px]">
                        storefront
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 text-body-sm text-on-surface-variant">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                          location_on
                        </span>
                        <span>{store.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                          phone
                        </span>
                        <span className="font-medium text-on-surface">{store.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                          schedule
                        </span>
                        <span>{store.timings}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider block mb-2">
                        Showroom Highlights:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {store.features.map((f, i) => (
                          <span
                            key={i}
                            className="bg-surface-container px-2.5 py-1 rounded-md text-label-sm font-label-sm text-on-surface"
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-surface-container">
                    <a
                      href={store.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-center font-label-md text-label-md flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">directions</span>
                      <span>Google Maps</span>
                    </a>
                    <button
                      onClick={() => setIsConsultationModalOpen(true)}
                      className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors text-center font-label-md text-label-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">videocam</span>
                      <span>Virtual Tour</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
