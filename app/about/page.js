'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../components/CartContext';

const milestones = [
  { year: '75+ Years Ago', title: 'Sacred Roots in Handloom Weaving', desc: 'Started with deep devotion to authentic Telugu wedding handlooms in traditional pit loom clusters of Kanchipuram and Gadwal.' },
  { year: '3 Generations', title: 'Adorning Over 100,000 Families', desc: 'Became the trusted household choice for Telugu families across Gudur, Palakurthy, and wider Telangana.' },
  { year: 'Twin Flagship Stores', title: 'Gudur & Palakurthy Showrooms', desc: 'Established spacious family ethnic wear showrooms offering full bridal suites, mens traditional wear, and kids festive collections.' },
  { year: 'Today', title: 'Worldwide Matrimonial Concierge', desc: 'Live HD video shopping, direct weaver cooperatives, and fully insured air express dispatch to USA, UK, UAE, and Australia.' },
];

const values = [
  { icon: 'verified', title: '100% Silk Mark Purity', desc: 'Each drape is officially certified by the Silk Mark Organisation of India, guaranteeing pure natural mulberry silk.' },
  { icon: 'flare', title: 'Tested Pure Zari', desc: 'Bridal masterpieces feature electroplated silver and 24K gold dipped zari with certified testing documentation.' },
  { icon: 'groups', title: '1,200+ Master Weaver Guilds', desc: 'Direct partnerships with artisan families eliminate intermediaries, safeguarding centuries-old Telugu weaving heritage.' },
  { icon: 'content_cut', title: 'Artisanal Fall, Pico & Kuchu', desc: 'Every saree arrives ready-to-wear with hand-tied silk tassels, fall attachment, and matching unstitched blouse fabric.' },
  { icon: 'videocam', title: '1-on-1 Video Concierge', desc: 'Personal saree stylists showcase draping lines, pallu details, and borders over high-definition video calls.' },
  { icon: 'public', title: 'Global Insured Air Transit', desc: 'Full transit coverage ensures safe, auspicious handover across 50+ countries with custom packaging and sacred prasad packs.' },
];

export default function AboutPage() {
  const { setIsConsultationModalOpen } = useCart();
  return (
    <div className="min-h-screen bg-cream text-text-primary">
      <a href="#main-about" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-about" className="relative pt-[115px] md:pt-[135px]">
        {/* Hero Banner */}
        <section className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <span className="text-gold font-semibold text-[11px] uppercase tracking-widest block mb-4">కల్యాణం • HERITAGE</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">Our Sacred Heritage & Weaving Chronicle</h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Preserving the sacred dharma of Telugu handloom weaving across generations. Each saree tells a story of devotion, craftsmanship, and timeless elegance.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative h-[500px] rounded-lg overflow-hidden bg-surface-high border border-border">
                <Image
                  src="/images/banners/hero-collection.jpg"
                  alt="Kalyanam Heritage Weaving"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute bottom-8 left-8 z-20 bg-surface p-6 rounded-lg shadow-lg">
                  <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">75+ Years of Weaving Excellence</h3>
                  <p className="text-text-secondary text-sm">From traditional pit looms to global matrimonial concierge</p>
                </div>
              </div>
              <div>
                <h2 className="font-heading text-3xl font-bold text-text-primary mb-6">Our Story</h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  Kalyanam Shopping Mall was founded on the sacred principle of preserving Telugu bridal heritage through authentic handloom weaving. For over seven decades, we have served families across Gudur, Palakurthy, and beyond, adorning brides with the finest pure silk sarees for their most precious moments.
                </p>
                <p className="text-text-secondary text-lg leading-relaxed mb-6">
                  Our commitment to quality means every drape carries the Silk Mark certification, features tested zari, and arrives with complimentary fall, pico, and kuchu finishing — ready for the muhurtham.
                </p>
                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="btn-secondary px-8 py-3 text-lg font-bold uppercase tracking-wider shadow-lg flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  Book Bridal Session
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="bg-surface-high border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center mb-12">
              <span className="text-gold font-semibold text-[11px] uppercase tracking-widest block mb-4">తరతరాల సంప్రదాయం • MILESTONES</span>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">A Chronicle of Devotion</h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">Tracing our journey from village looms to global matrimonial concierge.</p>
            </div>

            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-12 top-0 bottom-0 w-px bg-border" />
              {milestones.map((m, idx) => (
                <div key={idx} className="relative pl-20 pb-10 last:pb-0">
                  <div className="absolute left-8 top-1 w-8 h-8 rounded-full bg-gold text-charcoal flex items-center justify-center font-bold text-xs shadow-lg border-4 border-surface-high">
                    {idx + 1}
                  </div>
                  <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-burgundy block mb-2">{m.year}</span>
                    <h3 className="font-bold text-text-primary text-lg mb-2">{m.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-gold font-semibold text-[11px] uppercase tracking-widest block mb-4">కెలిమితిత్తి • ARTISANAL INTEGRITY</span>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">Our Sacrosanct Commitments</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, idx) => (
                <div key={idx} className="p-6 bg-surface border border-border rounded-lg shadow-sm hover:shadow-medium transition-all group">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:bg-gold group-hover:text-charcoal transition-colors">
                    <span className="material-symbols-outlined text-[20px]">{v.icon}</span>
                  </div>
                  <h3 className="font-bold text-text-primary text-lg mb-2">{v.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-burgundy text-cream py-20 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold mb-6">Experience Our Heritage</h2>
            <p className="text-cream/90 text-lg mb-8">
              Connect with our chief saree curators for personalized wedding styling consultations in our Gudur and Palakurthy showrooms.
            </p>
            <button
              onClick={() => setIsConsultationModalOpen(true)}
              className="btn-gold px-10 py-4 text-lg font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              Book Bridal Consultation
            </button>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}