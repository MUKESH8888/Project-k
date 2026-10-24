'use client';

import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../components/CartContext';

export default function AboutPage() {
  const { setIsConsultationModalOpen } = useCart();

  const milestones = [
    {
      year: '75+ Years Ago',
      title: 'Sacred Roots in Handloom Weaving',
      desc: 'Started with deep devotion to authentic Telugu wedding handlooms in traditional pit loom clusters of Kanchipuram and Gadwal.',
    },
    {
      year: '3 Generations',
      title: 'Adorning Over 100,000 Families',
      desc: 'Became the trusted household choice for Telugu families across Gudur, Palakurthy, and wider Telangana.',
    },
    {
      year: 'Twin Flagship Stores',
      title: 'Gudur & Palakurthy Showrooms',
      desc: 'Established our spacious family ethnic wear showrooms offering full bridal suites, men’s traditional wear, and kids festive collections.',
    },
    {
      year: 'Today',
      title: 'Worldwide Matrimonial Concierge',
      desc: 'Live HD video shopping, direct weaver cooperatives, and fully insured air express dispatch to USA, UK, UAE, and Australia.',
    },
  ];

  const values = [
    {
      icon: 'verified',
      title: '100% Silk Mark Purity',
      desc: 'Each drape is officially certified by the Silk Mark Organisation of India (Central Silk Board), guaranteeing pure natural mulberry silk.',
    },
    {
      icon: 'flare',
      title: 'Tested Pure Gold Zari',
      desc: 'Our bridal masterpieces feature electroplated silver and 24K gold dipped zari accompanied by certified testing documentation.',
    },
    {
      icon: 'groups',
      title: '1,200+ Master Weaver Guilds',
      desc: 'Direct partnerships with artisan families eliminate intermediaries, safeguarding centuries-old Telugu weaving heritage.',
    },
    {
      icon: 'content_cut',
      title: 'Artisanal Fall, Pico & Kuchu',
      desc: 'Every saree arrives ready-to-wear with our in-house hand-tied silk tassels, fall attachment, and matching unstitched blouse fabric.',
    },
    {
      icon: 'videocam',
      title: '1-on-1 Video Concierge',
      desc: 'Our personal saree stylists showcase draping drape lines, pallu details, and borders over high-definition video calls.',
    },
    {
      icon: 'public',
      title: 'Global Insured Air Transit',
      desc: 'Full transit coverage ensures safe, auspicious handover across 50+ countries with custom packaging and sacred prasad packs.',
    },
  ];

  return (
    <>
      <Header />

      <main className="w-full pt-[116px] bg-background min-h-screen">
        <div className="flex flex-col w-full">
          {/* Header Banner */}
          <section className="w-full bg-surface-container-low py-space-xl px-margin border-b border-surface-container">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-sm text-center items-center">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">
                కళ్యాణం - తరతరాల తెలుగు సాంప్రదాయ వైభవం
              </span>
              <h1 className="font-display-lg text-headline-lg md:text-display-md text-primary font-bold">
                Our Sacred Heritage &amp; Weaving Chronicle
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Preserving the sacred dignity of Telugu wedding rites, certified silk authenticity, and artisanal master weavers since three generations.
              </p>
            </div>
          </section>

          {/* Narrative & Visual Montage */}
          <section className="w-full py-space-xl px-margin bg-background">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              <div className="lg:col-span-6 flex flex-col gap-space-md">
                <div className="inline-flex items-center gap-2 text-secondary font-label-md text-label-md uppercase tracking-wider">
                  <span className="w-6 h-[1.5px] bg-secondary inline-block" />
                  <span>The Soul of Kalyanam</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-primary leading-tight">
                  Woven with Reverence for Life’s Sacred Celebrations
                </h2>
                <div className="p-space-md bg-surface-container rounded-xl">
                  <p className="font-headline-md text-headline-md text-primary italic font-serif">
                    “మన సాంప్రదాయం, మన కళ్యాణం.”
                  </p>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-widest block mt-1">
                    — The Sacred Oath of Purity &amp; Heritage
                  </span>
                </div>
                <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                  In Telugu matrimony, a saree is never merely an ensemble—it is the sanctified vessel of blessings, prayers, and indelible family memories. From the auspicious dawn <span className="text-primary font-semibold">Mangala Snanam</span> and <span className="text-primary">Gauri Pooja</span> to the pinnacle moments of <span className="text-primary font-semibold">Jeelakarra Bellam</span> and <span className="text-primary font-semibold">Talambralu</span>, our weaves have dressed royalty and cherished brides alike.
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  We take profound pride in working directly with hereditary weavers across Kanchipuram, Gadwal, Pochampally, Uppada, and Varanasi, ensuring fair livelihoods while preserving ancient pit loom and Korvai techniques.
                </p>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-space-md">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
                  <img
                    alt="Master Weaver at Pit Loom"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuASKYN3mUVs9w7xUvpByb84A9_RzJKNx3qVhJzKQE2WF6lpwzt0gGnD-W870MqN60aM1NZV1GB5Chy0a3oIL8fXklTLHZzzv6aMYnT05j72yiStquhuKJbdAjZp-pIW8z_1jqVARRRXzHMAR52VFBJFKsytZhJu3pQbpRYOvP3ok5NrgClxT-0z9Bzlh7JY1HeHodRGqHlE2f_PHCv-jRuTtqM39C4ME2e_e0VlM4lh_illP4L2Sg7n"
                  />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md mt-8">
                  <img
                    alt="Antique Gold Zari Spools"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuABg8ZRIlcNzUSJZALutdE9cSv3E78gRb-r7_1EsD-hRQDd0AQbmHs6YNUmwOOCAn_yi3_4wVGd_a22qUThRT3kwMzkbHIPNHJ0D8iNn_gY7n-iX1e7hz2BxcX-OronJYrsOP7wUjeDwTz3eKZMmpy-Q_a99C7xqpt7QiqqS_TkPrn1l0-1V4rAnbP5mZpdYiwvMwvV8WciVmMyWdLsNc4FwU6RP6NOfiIcplVT3cSVE24EHYcnTJRG"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Heritage Milestones */}
          <section className="w-full py-space-xl px-margin bg-surface-container-low border-y border-surface-container">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
              <div className="text-center max-w-xl mx-auto">
                <span className="font-label-md text-label-md text-secondary uppercase tracking-widest block mb-1">
                  Generational Legacy
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary">
                  The Journey Across Eras
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
                {milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-2 border border-surface-container"
                  >
                    <span className="text-secondary font-headline-md text-headline-md font-bold">
                      {m.year}
                    </span>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">
                      {m.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pillars of Purity */}
          <section className="w-full py-space-xl px-margin bg-background">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
              <div className="text-center max-w-xl mx-auto">
                <span className="font-label-md text-label-md text-secondary uppercase tracking-widest block mb-1">
                  Artisanal Integrity
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary">
                  Our Sacrosanct Commitments
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {values.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-xs border border-surface-container"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center mb-1">
                      <span className="material-symbols-outlined text-[24px]">{v.icon}</span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold">
                      {v.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Consultation Callout */}
              <div className="mt-4 p-space-lg bg-inverse-surface text-inverse-on-surface rounded-2xl flex flex-col md:flex-row items-center justify-between gap-space-md">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-secondary-fixed font-bold">
                    Experience Our Heritage Showrooms or Virtual Video Drape
                  </h3>
                  <p className="font-body-sm text-body-sm text-surface-variant mt-1">
                    Connect with our chief saree curators for personalized wedding styling consultations.
                  </p>
                </div>
                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-secondary-fixed text-on-secondary-fixed font-semibold hover:bg-secondary-fixed-dim transition-colors shrink-0 cursor-pointer"
                >
                  Book Bridal Session
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
