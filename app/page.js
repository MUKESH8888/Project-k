'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../components/CartContext';

// Verified catalog products for the homepage showcase
const FEATURED_PRODUCTS = [
  {
    id: 1,
    sku: 'KLM-W-001',
    category: 'Kanchipuram Pattu',
    occasion: 'Bridal Muhurtham',
    title: 'Swarna Kanchi Pure Silk Saree - Sindhoori Vermilion Red with Korvai Gold Border',
    telugu: 'సిందూర ఎరుపు కంచి పట్టు చీర',
    href: '/product/swarna-kanchi-pure-silk-saree',
    image: '/images/products/kanchipuram-pattu.jpg',
    price: 42500,
    originalPrice: 50000,
    discount: '15% OFF',
    rating: 4.9,
    reviews: 128,
    badge: 'SILK MARK CERTIFIED',
    pureZari: true,
    colors: ['#8E1624', '#520B16', '#D49E35'],
    deliveryNote: 'Free Insured Express Delivery',
    tag: 'muhurtham',
    description:
      'Handcrafted on traditional pit looms by 4th-generation master weavers using 100% pure mulberry silk and tested 24K dipped gold zari in grand temple gopuram motifs.',
  },
  {
    id: 2,
    sku: 'KLM-W-002',
    category: 'Kanchipuram Pattu',
    occasion: 'Bridal Muhurtham',
    title: 'Rani Pink Royal Bridal Brocade Kanchipuram Pattu with Peacocks & Floral Zari',
    telugu: 'రాణీ గులాబీ రాయల్ పెళ్లి పట్టు',
    href: '/product/swarna-kanchi-pure-silk-saree',
    image: '/images/products/designer-saree.jpg',
    price: 58000,
    originalPrice: 65000,
    discount: '10% OFF',
    rating: 5.0,
    reviews: 94,
    badge: 'TESTED SILVER & GOLD ZARI',
    pureZari: true,
    colors: ['#B81D52', '#751E2B', '#E2C87A'],
    deliveryNote: 'Complimentary Silk Kuchu Done',
    tag: 'muhurtham',
    description:
      'Opulent brocade all-over weaving featuring mayil (peacock) and chakram motifs, framing a magnificent 18-inch contrast zari pallu.',
  },
  {
    id: 3,
    sku: 'KLM-W-003',
    category: 'Gadwal Handloom',
    occasion: 'Puja & Auspicious Rituals',
    title: 'Mayilkan Green & Mustard Yellow Dual Tone Handloom Gadwal Saree',
    telugu: 'మయిల్ కణ్ ఆకుపచ్చ గద్వాల పట్టు',
    href: '/product/swarna-kanchi-pure-silk-saree',
    image: '/images/products/gadwal-pattu.jpg',
    price: 24900,
    originalPrice: 28000,
    discount: '11% OFF',
    rating: 4.8,
    reviews: 67,
    badge: 'HANDLOOM MARK CERTIFIED',
    pureZari: false,
    colors: ['#18483B', '#D19B27'],
    deliveryNote: 'Hand-knotted Tassels Included',
    tag: 'gadwal',
    description:
      'Distinguished by its lightweight pure cotton body joined to rich silk temple borders using the sacred Kutchi interlocking technique.',
  },
  {
    id: 4,
    sku: 'KLM-W-004',
    category: 'Banarasi Katan',
    occasion: 'Reception Grandeur',
    title: 'Padma Banarasi Katan Silk Saree in Midnight Royal Blue & Pure Gold Jaal',
    telugu: 'రాయల్ బ్లూ బనారసి కతాన్ పట్టు',
    href: '/product/swarna-kanchi-pure-silk-saree',
    image: '/images/products/banarasi-pattu.jpg',
    price: 36500,
    originalPrice: 40000,
    discount: '8% OFF',
    rating: 4.9,
    reviews: 82,
    badge: 'SILK MARK CERTIFIED',
    pureZari: true,
    colors: ['#102347', '#3B1238', '#C5A04B'],
    deliveryNote: 'Free Insured Air Shipping',
    tag: 'festive',
    description:
      'Woven with fine twisted katan silk yarns and dipped antique gold floral jall, offering unrivaled fluidity and aristocratic drape.',
  },
  {
    id: 5,
    sku: 'KLM-W-005',
    category: 'Pochampally Ikat',
    occasion: 'Ceremonial & Haldi',
    title: 'Telangana Double Ikat Pure Silk Saree with Geometric Temple Border',
    telugu: 'పోచంపల్లి డబుల్ ఇక్కత్ పట్టు',
    href: '/product/swarna-kanchi-pure-silk-saree',
    image: '/images/products/pochampally-ikat.jpg',
    price: 21500,
    originalPrice: 24500,
    discount: '12% OFF',
    rating: 4.8,
    reviews: 53,
    badge: 'GEOGRAPHICAL INDICATION (GI)',
    pureZari: false,
    colors: ['#D64045', '#1D3557', '#F4A261'],
    deliveryNote: 'GI Tag Authenticity Card Included',
    tag: 'festive',
    description:
      'UNESCO-recognized tie-and-dye weaving from Telangana looms, showcasing intricate geometric synchrony in pure natural silk.',
  },
  {
    id: 6,
    sku: 'KLM-M-005',
    category: 'Men Groom Wear',
    occasion: 'Puja & Traditional rituals',
    title: 'Telangana Heritage Khadi Silk Pattu Dhoti & Kanduva Set with Temple Zari Border',
    telugu: 'తెలంగాణ చేనేత పట్టు ధోతీ & కండువా',
    href: '/product/swarna-kanchi-pure-silk-saree',
    image: '/images/products/kanchipuram-pattu.jpg',
    price: 14200,
    originalPrice: 16800,
    discount: '15% OFF',
    rating: 4.9,
    reviews: 43,
    badge: '100% PURE SILK DHOTI',
    pureZari: true,
    colors: ['#FFF8F6', '#C5A04B'],
    deliveryNote: 'Groom Muhurtham Ready',
    tag: 'men',
    description:
      'Auspicious unstitched 9x5 pure raw silk dhoti paired with traditional zari angavastram for Telugu grooms and ceremonial pujas.',
  },
];

const CURATED_COLLECTIONS = [
  {
    id: 'kanchi',
    title: 'Kanchipuram Silk',
    telugu: 'కంచి పట్టు చీరలు',
    subtitle: 'Sacred Korvai borders with tested 24K gold zari',
    image: '/images/products/kanchipuram-pattu.jpg',
    badge: 'BRIDAL MUHURTHAM',
    priceFrom: '₹28,000',
    href: '/sarees?category=Kanchipuram',
  },
  {
    id: 'banarasi',
    title: 'Banarasi Brocades',
    telugu: 'బనారసి కతాన్ పట్టు',
    subtitle: 'Intricate gold jaal and heritage Mughal motifs',
    image: '/images/products/banarasi-pattu.jpg',
    badge: 'RECEPTION & SANGEET',
    priceFrom: '₹22,000',
    href: '/sarees?category=Banarasi',
  },
  {
    id: 'gadwal',
    title: 'Gadwal Handlooms',
    telugu: 'గద్వాల చేనేత పట్టు',
    subtitle: 'Lightweight drapes with opulent silk zari borders',
    image: '/images/products/gadwal-pattu.jpg',
    badge: 'SACRED PUJA & FESTIVE',
    priceFrom: '₹18,500',
    href: '/sarees?category=Gadwal',
  },
  {
    id: 'men-kids',
    title: "Groom's & Kids Studio",
    telugu: 'పురుషులు & పిల్లల పట్టు',
    subtitle: 'Pattu panche, sherwanis, and girls pattu pavada sets',
    image: '/images/banners/hero-collection.jpg',
    badge: 'FAMILY ETHNIC WEAR',
    priceFrom: '₹5,900',
    href: '/?dept=men',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'We live in Dallas and were worried about finding an authentic Korvai Kanchipuram for our daughter’s wedding. The Kalyanam video shopping session felt just like sitting in their Gudur showroom! The saree arrived in 4 days with silk mark certificate and pristine kuchu work.',
    bride: 'Radha & Madhava Rao',
    location: 'Dallas, Texas',
    event: 'Bride’s Parents • December 2025 Muhurtham',
    rating: 5,
  },
  {
    quote:
      'For our wedding in Hyderabad, my entire family shopped from Kalyanam Mall Palakurthy. My Sindhoori Red muhurtham saree received endless compliments. The weight of the silk and the real gold zari shine is unmatched.',
    bride: 'Divya & Sai Krishna',
    location: 'Banjara Hills, Hyderabad',
    event: 'Telugu Matrimony Muhurtham',
    rating: 5,
  },
  {
    quote:
      'Direct-weaver pricing without artificial luxury markups. The groom dhoti set and matching kanduva are woven from thick mulberry silk. Kalyanam is the jewel of Telangana handloom shopping!',
    bride: 'K. Raghunath Varma',
    location: 'Warangal, Telangana',
    event: 'Family Matrimony Celebration',
    rating: 5,
  },
];

export default function HomePage() {
  const { addToCart, toggleWishlist, wishlist, setIsConsultationModalOpen } = useCart();
  const [activeTab, setActiveTab] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  const filteredProducts =
    activeTab === 'all'
      ? FEATURED_PRODUCTS
      : FEATURED_PRODUCTS.filter((p) => p.tag === activeTab);

  const handleInstantAdd = (product) => {
    addToCart(product);
    setAddedItemNotice(product.id);
    setTimeout(() => setAddedItemNotice(null), 2200);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#1A1918]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />

      <main id="main-content" className="relative pt-[115px] md:pt-[135px]">
        {/* ========================================================= */}
        {/* HERO SECTION: ROYAL HERITAGE MATRIMONY COUTURE            */}
        {/* ========================================================= */}
        <section className="relative min-h-[640px] md:min-h-[720px] flex items-center overflow-hidden bg-[#141210]">
          {/* Background Hero Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banners/hero-bridal.jpg"
              alt="Authentic Kalyanam Telugu Bridal Kanchipuram Saree"
              fill
              priority
              className="object-cover object-center scale-105 animate-pulse duration-[10000ms]"
              sizes="100vw"
            />
            {/* Rich Vignette & Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#180A0E]/95 via-[#180A0E]/80 to-transparent md:to-[#180A0E]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-black/40" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-2xl">
              {/* Auspicious Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#7A1426]/70 border border-[#C5A04B]/60 backdrop-blur-md mb-6 shadow-xl">
                <span className="text-gold font-bold text-xs tracking-wider">శ్రీరస్తు • SHREE RASTU</span>
                <span className="w-1 h-1 rounded-full bg-gold"></span>
                <span className="text-[#FFFBF7] text-xs font-medium tracking-wide">
                  Royal Telugu Matrimony Couture
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] mb-6 tracking-tight drop-shadow-md">
                Woven in Pure Gold &amp; Silk for Your{' '}
                <span className="text-gold-gradient italic font-serif">Sacred Muhurtham</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#F2ECE1] font-light leading-relaxed mb-8 max-w-xl drop-shadow">
                Authentic 100% Silk Mark certified Kanchipuram, Banarasi, and Gadwal drapes handwoven by hereditary masters for Telugu matrimony celebrations across the world.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
                <Link
                  href="/sarees"
                  className="btn-secondary px-8 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase text-center shadow-2xl flex items-center justify-center gap-2"
                >
                  <span>Explore Bridal Sarees</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>

                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="btn-gold-outline px-7 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase text-center backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px] text-gold">videocam</span>
                  <span>Book VIP Video Drape</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gold text-[20px]">verified</span>
                  <div className="text-[11px] text-[#EDE8E0] leading-tight">
                    <strong className="block text-white">Silk Mark</strong> Pure Mulberry Silk
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gold text-[20px]">flare</span>
                  <div className="text-[11px] text-[#EDE8E0] leading-tight">
                    <strong className="block text-white">Tested Zari</strong> 24K Gold &amp; Silver
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gold text-[20px]">content_cut</span>
                  <div className="text-[11px] text-[#EDE8E0] leading-tight">
                    <strong className="block text-white">Complimentary</strong> Fall, Pico &amp; Kuchu
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gold text-[20px]">flight_takeoff</span>
                  <div className="text-[11px] text-[#EDE8E0] leading-tight">
                    <strong className="block text-white">Global Air</strong> Insured Shipping
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: CURATED WEAVE COLLECTIONS                      */}
        {/* ========================================================= */}
        <section className="py-16 md:py-24 bg-[#FFFDFB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-gold font-bold text-xs uppercase tracking-[0.2em] block mb-2">
                తరతరాల కళాఖండాలు • WEAVING CHRONICLES
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#7A1426] mb-4">
                Curated for Sacred Telugu Traditions
              </h2>
              <div className="divider-royal">
                <span className="text-gold text-lg">◆</span>
              </div>
              <p className="text-sm sm:text-base text-[#615D56] leading-relaxed">
                From auspicious Kanchipuram bridal muhurtham sarees to lightweight Gadwal temple borders and groom’s royal silk panche sets.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CURATED_COLLECTIONS.map((col) => (
                <Link
                  key={col.id}
                  href={col.href}
                  className="group relative rounded-2xl overflow-hidden bg-white border border-[#EAE5DC] hover:border-gold shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#FAF3EA]">
                    <Image
                      src={col.image}
                      alt={col.title}
                      fill
                      className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="badge badge-gold shadow-md text-[10px]">
                        {col.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-gold text-xs font-medium block mb-1">
                        {col.telugu}
                      </span>
                      <h3 className="font-heading text-xl font-bold mb-1 leading-snug">
                        {col.title}
                      </h3>
                      <p className="text-xs text-white/80 line-clamp-1 mb-2 font-light">
                        {col.subtitle}
                      </p>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/20">
                        <span className="text-gold font-bold">Starts {col.priceFrom}</span>
                        <span className="flex items-center gap-1 font-semibold text-white group-hover:text-gold transition-colors">
                          <span>Explore</span>
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: LIVE FEATURED MASTERPIECES WITH TABS          */}
        {/* ========================================================= */}
        <section className="py-16 md:py-20 bg-[#FAF7F2] border-y border-[#EAE5DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-gold font-bold text-xs uppercase tracking-[0.2em] block mb-2">
                  ప్రత్యేక ఆభరణాలు • HEIRLOOM MASTERPIECES
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#7A1426]">
                  Signature Handloom Drops
                </h2>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { key: 'all', label: 'All Drapes' },
                  { key: 'muhurtham', label: 'Bridal Muhurtham' },
                  { key: 'gadwal', label: 'Gadwal Handloom' },
                  { key: 'festive', label: 'Banarasi & Ikat' },
                  { key: 'men', label: 'Groom Dhoti & Sets' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'bg-burgundy text-white shadow-md'
                        : 'bg-white text-charcoal/80 border border-[#EAE5DC] hover:border-gold hover:text-burgundy'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => {
                const isSaved = wishlist.includes(p.id);
                const wasAdded = addedItemNotice === p.id;

                return (
                  <div
                    key={p.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#EAE5DC] hover:border-gold shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative"
                  >
                    {/* Image Area */}
                    <div className="relative h-80 sm:h-96 w-full overflow-hidden bg-[#FAF3EA]">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        <span className="badge badge-silk shadow-sm text-[10px]">
                          {p.badge}
                        </span>
                        {p.discount && (
                          <span className="badge bg-[#7A1426] text-white text-[10px] font-bold">
                            {p.discount}
                          </span>
                        )}
                      </div>

                      {/* Wishlist Heart Toggle */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(p.id);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
                          isSaved
                            ? 'bg-burgundy text-white shadow-md'
                            : 'bg-white/85 text-charcoal/70 hover:text-burgundy hover:bg-white shadow'
                        }`}
                        title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
                      >
                        <span
                          className={`material-symbols-outlined text-[19px] ${
                            isSaved ? 'fill-current' : ''
                          }`}
                        >
                          favorite
                        </span>
                      </button>

                      {/* Quick Action Overlay on Hover */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-3">
                        <button
                          onClick={() => setQuickViewProduct(p)}
                          className="flex-1 py-2 rounded-full bg-white text-charcoal text-xs font-bold uppercase tracking-wider hover:bg-gold hover:text-charcoal transition-colors text-center shadow-lg"
                        >
                          Quick View
                        </button>
                        <button
                          onClick={() => handleInstantAdd(p)}
                          className="flex-1 py-2 rounded-full bg-burgundy text-white text-xs font-bold uppercase tracking-wider hover:bg-burgundy-deep transition-colors text-center shadow-lg"
                        >
                          {wasAdded ? '✓ Added' : 'Add to Bag'}
                        </button>
                      </div>
                    </div>

                    {/* Product Details Area */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Telugu Subtitle & Category */}
                        <div className="flex items-center justify-between text-xs text-[#8A857B] mb-1">
                          <span className="text-gold font-semibold">{p.category}</span>
                          <span className="text-[11px]">{p.telugu}</span>
                        </div>

                        {/* Title */}
                        <Link href={p.href} className="group-hover:text-burgundy transition-colors">
                          <h3 className="font-heading text-base font-bold text-charcoal line-clamp-2 leading-snug mb-3">
                            {p.title}
                          </h3>
                        </Link>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-1.5 text-xs text-[#6B665E] mb-3">
                          <span className="flex items-center text-amber-500 font-bold">
                            ★ {p.rating}
                          </span>
                          <span>•</span>
                          <span>{p.reviews} Verified Brides</span>
                        </div>
                      </div>

                      {/* Price & Cart Footer */}
                      <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-heading text-lg font-bold text-[#7A1426]">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                            {p.originalPrice && (
                              <span className="text-xs text-[#9E9A91] line-through">
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#4A7A56] font-medium block">
                            {p.deliveryNote}
                          </span>
                        </div>

                        {/* Color Dots */}
                        <div className="flex items-center -space-x-1">
                          {p.colors.map((c, i) => (
                            <span
                              key={i}
                              className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Catalog CTA */}
            <div className="text-center mt-12">
              <Link
                href="/sarees"
                className="btn-primary px-10 py-4 text-xs font-bold tracking-widest uppercase shadow-xl inline-flex items-center gap-2"
              >
                <span>View Full Wedding Catalog (150+ Handlooms)</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: THE KALYANAM PURITY PROMISE                   */}
        {/* ========================================================= */}
        <section className="py-20 bg-[#FFFDFB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-gold font-bold text-xs uppercase tracking-[0.2em] block mb-2">
                స్వచ్ఛత హామీ • PURITY ASSURANCE
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#7A1426] mb-3">
                The 4 Pillars of Kalyanam Authenticity
              </h2>
              <div className="divider-royal">
                <span className="text-gold text-lg">◆</span>
              </div>
              <p className="text-sm text-[#666] leading-relaxed">
                When you invest in an heirloom saree for your daughter or daughter-in-law, you deserve absolute certified authenticity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: 'verified',
                  title: '100% Silk Mark Certified',
                  telugu: 'సిల్క్ మార్క్ సర్టిఫైడ్',
                  desc: 'Officially certified by the Silk Mark Organisation of India (SMOI), guaranteeing 100% pure natural mulberry silk yarn.',
                },
                {
                  icon: 'flare',
                  title: 'Tested Gold & Silver Zari',
                  telugu: 'స్వర్ణ & వెండి జరీ',
                  desc: 'Bridal masterpieces woven with tested electroplated silver wire and 24-karat gold dipped threads that retain luster for decades.',
                },
                {
                  icon: 'groups',
                  title: 'Direct Weaver Guilds',
                  telugu: 'చేనేత కుటుంబాలు',
                  desc: 'Over 1,200 hereditary artisan families in Kanchi, Gadwal, and Varanasi. Zero middlemen, ensuring fair prices for brides.',
                },
                {
                  icon: 'local_shipping',
                  title: 'Ready-to-Wear Service',
                  telugu: 'ఫాల్ & కుచ్చు కంప్లీట్',
                  desc: 'Every drape arrives ready for the mandap with handcrafted silk kuchu tassels, fall stitched, and unstitched matching blouse length.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#EAE5DC] hover:border-gold hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 rounded-full bg-white border border-[#DFC587] flex items-center justify-center text-gold mb-5 group-hover:bg-burgundy group-hover:text-white transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[30px]">{item.icon}</span>
                  </div>
                  <span className="text-[11px] text-gold font-semibold uppercase tracking-wider block mb-1">
                    {item.telugu}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-charcoal mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B665E] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: VIP VIDEO SHOPPING SPOTLIGHT                   */}
        {/* ========================================================= */}
        <section className="py-20 bg-gradient-to-br from-[#1C0E12] via-[#2A1118] to-[#140A0D] text-white relative overflow-hidden">
          {/* Subtle gold ornamentation in background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-burgundy/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold uppercase tracking-wider mb-6">
                  <span className="material-symbols-outlined text-[16px]">videocam</span>
                  <span>1-on-1 Personalized Concierge</span>
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
                  Shop Our Gudur &amp; Palakurthy Showrooms From{' '}
                  <span className="text-gold-gradient italic font-serif">Anywhere in the World</span>
                </h2>

                <p className="text-base text-[#E6DFD5] leading-relaxed mb-8 max-w-xl font-light">
                  Bridal shopping from USA, UK, UAE, or outstation? Schedule a complimentary HD video call with our master saree stylists. We drape each saree, showcase real daylight colors, display the pallu weight, and answer every question.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-sm text-[#F0EBE1]">
                      Real-time live draping on mannequins to assess pleating and border height
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-sm text-[#F0EBE1]">
                      Side-by-side comparison under natural white daylight lamps
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-sm text-[#F0EBE1]">
                      Global time-zone slots curated for US (PST/EST), Europe, and Gulf brides
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    onClick={() => setIsConsultationModalOpen(true)}
                    className="btn-secondary px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    <span>Book Your Free 30-Min Video Slot</span>
                  </button>

                  <a
                    href="https://wa.me/919849012345?text=Hello%20Kalyanam%20Mall,%20I%20would%20like%20to%20book%20a%20video%20call%20for%20wedding%20sarees"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-center text-white border-white/40 hover:bg-white hover:text-charcoal transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px] text-green-400">chat</span>
                    <span>WhatsApp Quick Booking</span>
                  </a>
                </div>
              </div>

              {/* Visual Card Mockup */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border-2 border-gold/40 shadow-2xl bg-[#26151B]">
                  <div className="relative h-96 w-full">
                    <Image
                      src="/images/banners/hero-collection.jpg"
                      alt="Virtual Video Consultation at Kalyanam Mall"
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      <span>HD Live Concierge</span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gold text-charcoal font-bold flex items-center justify-center text-sm shadow">
                          SR
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">Sri Ramalingam</div>
                          <div className="text-[11px] text-gold">Master Weaver &amp; Stylist (35+ Yrs Exp)</div>
                        </div>
                      </div>
                      <p className="text-xs text-white/80 italic font-light">
                        &ldquo;I personally inspect the Korvai joint and zari weight of every bridal saree before presenting it to our brides over video.&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: REAL BRIDES OF KALYANAM                       */}
        {/* ========================================================= */}
        <section className="py-20 bg-[#FFFDFB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-gold font-bold text-xs uppercase tracking-[0.2em] block mb-2">
                సంతోషకరమైన వధూవరులు • REAL WEDDINGS
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#7A1426] mb-3">
                Real Brides of Kalyanam
              </h2>
              <div className="divider-royal">
                <span className="text-gold text-lg">◆</span>
              </div>
              <p className="text-sm text-[#666] leading-relaxed">
                Over 100,000 sacred matrimonies adorned across three generations of Telugu families.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#EAE5DC] hover:border-gold hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-1 text-amber-500 mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <span key={i} className="text-lg">★</span>
                      ))}
                    </div>

                    <p className="text-sm text-[#4A4740] italic leading-relaxed mb-6 font-light">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EAE5DC]">
                    <div className="font-heading font-bold text-base text-charcoal">
                      {t.bride}
                    </div>
                    <div className="text-xs text-gold font-semibold">{t.location}</div>
                    <div className="text-[11px] text-[#888]">{t.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 7: TWIN FLAGSHIP SHOWROOMS                       */}
        {/* ========================================================= */}
        <section className="py-20 bg-[#FAF7F2] border-t border-[#EAE5DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-gold font-bold text-xs uppercase tracking-[0.2em] block mb-2">
                మా షోరూమ్స్ • VISIT OUR STORES
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#7A1426] mb-3">
                Experience Grandeur at Our Physical Showrooms
              </h2>
              <div className="divider-royal">
                <span className="text-gold text-lg">◆</span>
              </div>
              <p className="text-sm text-[#666]">
                Spacious multi-floor family shopping complexes in Telangana with dedicated bridal lounges and groom studios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gudur Store */}
              <div className="bg-white rounded-2xl p-8 border border-[#EAE5DC] hover:border-gold shadow-md hover:shadow-2xl transition-all">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="badge badge-gold mb-2 text-[10px]">FLAGSHIP STORE</span>
                    <h3 className="font-heading text-2xl font-bold text-charcoal">
                      Gudur Shopping Mall
                    </h3>
                    <div className="text-xs text-gold font-semibold">కళ్యాణం షాపింగ్ మాల్ — గూడూరు</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Open Today
                  </span>
                </div>

                <div className="space-y-3 text-xs text-[#555] mb-6">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-gold text-[18px] shrink-0">location_on</span>
                    <span>Palakurthy Road, Gudur, Telangana 506252 (Plus Code: PCF6+8GQ)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-gold text-[18px] shrink-0">call</span>
                    <span className="font-semibold text-charcoal">+91 98490 12345</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-gold text-[18px] shrink-0">schedule</span>
                    <span>Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#EAE5DC]">
                  <a
                    href="https://maps.app.goo.gl/tn1VL1L4jCtobqdT7?g_st=iw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline flex-1 py-2.5 text-xs text-center justify-center font-bold"
                  >
                    Google Maps Directions
                  </a>
                  <a
                    href="tel:+919849012345"
                    className="btn-secondary py-2.5 px-5 text-xs font-bold"
                  >
                    Call Store
                  </a>
                </div>
              </div>

              {/* Palakurthy Store */}
              <div className="bg-white rounded-2xl p-8 border border-[#EAE5DC] hover:border-gold shadow-md hover:shadow-2xl transition-all">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="badge badge-silk mb-2 text-[10px]">HERITAGE SHOWROOM</span>
                    <h3 className="font-heading text-2xl font-bold text-charcoal">
                      Palakurthy Showroom
                    </h3>
                    <div className="text-xs text-gold font-semibold">కళ్యాణం షాపింగ్ మాల్ — పాలకుర్తి</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Open Today
                  </span>
                </div>

                <div className="space-y-3 text-xs text-[#555] mb-6">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-gold text-[18px] shrink-0">location_on</span>
                    <span>Palakurthy Main Road, Palakurthy, Telangana 506146 (Plus Code: MC5J+66H)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-gold text-[18px] shrink-0">call</span>
                    <span className="font-semibold text-charcoal">+91 98490 54321</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-gold text-[18px] shrink-0">schedule</span>
                    <span>Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#EAE5DC]">
                  <a
                    href="https://maps.app.goo.gl/iFrxPDS4CcHRxKAQ6?g_st=iw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline flex-1 py-2.5 text-xs text-center justify-center font-bold"
                  >
                    Google Maps Directions
                  </a>
                  <a
                    href="tel:+919849054321"
                    className="btn-secondary py-2.5 px-5 text-xs font-bold"
                  >
                    Call Store
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* QUICK VIEW MODAL (UX INTERACTIVITY)                       */}
        {/* ========================================================= */}
        {quickViewProduct && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
              onClick={() => setQuickViewProduct(null)}
            />

            <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 p-6 md:p-8 animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-charcoal/60 hover:text-charcoal hover:bg-[#FAF7F2] transition-colors"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-[#FAF3EA] border border-[#EAE5DC]">
                  <Image
                    src={quickViewProduct.image}
                    alt={quickViewProduct.title}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="badge badge-silk text-[10px]">{quickViewProduct.badge}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gold font-bold uppercase tracking-wider mb-1">
                    {quickViewProduct.category} • {quickViewProduct.telugu}
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-charcoal mb-3 leading-snug">
                    {quickViewProduct.title}
                  </h3>

                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="font-heading text-2xl font-bold text-burgundy">
                      ₹{quickViewProduct.price.toLocaleString('en-IN')}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span className="text-sm text-[#888] line-through">
                        ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {quickViewProduct.discount && (
                      <span className="badge bg-burgundy text-white text-[10px]">
                        {quickViewProduct.discount}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#555] leading-relaxed mb-6 font-light">
                    {quickViewProduct.description}
                  </p>

                  <div className="space-y-2.5 text-xs text-[#444] mb-6 p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-gold text-[16px]">verified</span>
                      <span>Certified 100% Pure Natural Mulberry Silk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-gold text-[16px]">content_cut</span>
                      <span>Complimentary Fall, Pico &amp; Hand-knotted Silk Kuchu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-gold text-[16px]">local_shipping</span>
                      <span>Free Insured Air Delivery (India &amp; Global Express)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        addToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className="btn-secondary flex-1 py-3.5 text-xs uppercase tracking-wider font-bold shadow-lg"
                    >
                      Add to Sacred Bag
                    </button>
                    <Link
                      href={quickViewProduct.href}
                      className="btn-outline py-3.5 px-6 text-xs uppercase tracking-wider font-bold"
                    >
                      Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* FLOATING WHATSAPP ASSISTANT BUTTON                        */}
        {/* ========================================================= */}
        <div className="fixed bottom-6 right-6 z-40">
          <a
            href="https://wa.me/919849012345?text=Hello%20Kalyanam%20Mall,%20I%20need%20assistance%20choosing%20my%20wedding%20saree"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-[#1B7043] hover:bg-[#145733] text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-white/30 group"
          >
            <span className="material-symbols-outlined text-[24px]">chat</span>
            <span className="text-xs font-bold tracking-wide hidden sm:inline">
              Stylist WhatsApp
            </span>
          </a>
        </div>

        <Footer />
      </main>
    </div>
  );
}