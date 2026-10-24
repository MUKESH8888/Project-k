'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useCart } from '../../../components/CartContext';

export default function ProductDetailPage() {
  const { addToCart, showToast, setIsConsultationModalOpen } = useCart();

  // Media Gallery Images
  const galleryImages = [
    {
      title: 'Full Drape',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1emaGVTIB7QiE5dusOWDoxX2Kwh8lqssDlBdioL3Z68INfyngpdE-Kuj9W6mTp26imZYQznadJt1bndiTRpaTLZT3mVj-dKj1AOQXQUqXoh8DsAWzPZjXijVQ5DOPyj63W6I6ON2ieyT0jYWTLRERd-X0EyCWfW8CL7iTepLzwcHnUMeXbnFUkhfXJbE-KHD0N_npQfDAy_PdS14HCD9TSkn4N502O_pCbjTaWKczL1NOVqtqjY-6',
      alt: 'Luxurious high-resolution close up of a South Indian Telugu bride wearing an authentic Sindhoori vermilion red pure Kanchipuram silk saree.',
    },
    {
      title: 'Bridal Profile',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2X1-_UPXNY4n2vTeMz0I_h76J6B5p6s7HUpva0iz75rP64MwPVXXX0tgSm26663wMvAFJ4zm4x6x8SkdQ8DGEPt8aez4dwHJm4bjh9tgusOMvA7aHay2i2-LpyaiH2_3N9FpJuDGf_YnxatV_8Kk3lnrv5fqwpKbHEo9favVOFXz9ITk7Gkvf3eNmnMWoMhFMofmPm47XPuB5SAzyyyoepcIXQFBdfKp3BIdv64A_ljcfXefFOYsT',
      alt: 'Full drape profile of regal bride standing gracefully in traditional south Indian temple hall.',
    },
    {
      title: 'Grand Pallu',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNe4uxpepzQXPSA2ww5qHKAp7J3pZXSAJa76vjtyvxqqf5PXc9JOBpi0kYz0IL1NJz3Hd4UhajiTisrLJ5okJIw6xNaCVpphlRuYq2SmIVVbygUW9aHql6Ss-lL-AcPBzJ5DY9NNwcvCdS3Pd1RfxYKTb55shneJtxyJNID6n9fCUF5yrOqWn-2xlWTdzhdlPYahzNMNSZSff2NX-MPe6W5EW88NhqkP2DrZ8WJSDWN5RwLfB_anr5',
      alt: 'Extreme macro shot of intricate pure antique gold zari grand pallu with traditional temple Gopuram and Mayil peacock motifs.',
    },
    {
      title: 'Korvai Border',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgAR9K1y4kuxfC1f6adld0FW-xMBR-gooNCnGr5EPdCtuOMjEnzE5iG66MBzuA_P4LeoJb_fjAi6Xi4hujGVIcq_iO1PxFZhAB-p8nEJLDun1EujXHhFh1eR7CFkw2viEFRUuiOZyvUDkhpe_55ouEry2l3-TeNYUSN0dLzVyJUT0PNqSWiUm4hxqeDsn5PN4ydc3vUpt0knqBJRQsvqa6x9SOBN2MpK_lBuTWyBJDC7mKko3JYRAb',
      alt: 'Artisanal Korvai joint technique linking the rich deep vermilion red body with heavy antique gold border.',
    },
    {
      title: 'Fabric Grain',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPZSK9kLgLO4s08ORMCkqX_yhbzbPiZf_YTDwSuoghJvoKwQ8NGffcm-UcgbJ8MNehokfgEBMSkapb0xMRtqJNTcS9dkBX57es_E9zUyCscihwQ89Y2tT0ezYC92WG9Zpoypjt9YebMbmpMAGC_AJjw2rJFV5pzzosUWcOXav8AFpL2yANlm-21eCPbRGrOxCIUsL8Jy5NbcfNBnRgysUjF4j6ku5bgJ4hKWfR93YYzo-5ItJKOl6E',
      alt: 'Pure 100 percent Mulberry silk yarn threads, rich crimson sheen, genuine handloom grain.',
    },
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('Vermilion Sindhoor Red (సిందూరం)');
  const [pincode, setPincode] = useState('');
  const [deliveryEstimated, setDeliveryEstimated] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [videoDrawerOpen, setVideoDrawerOpen] = useState(false);
  const [blouseStitchingSelected, setBlouseStitchingSelected] = useState(false);

  const colors = [
    { name: 'Vermilion Sindhoor Red (సిందూరం)', hex: '#8E1624' },
    { name: 'Deep Rani Crimson (రాణీ గులాబీ)', hex: '#520B16' },
    { name: 'Antique Turmeric Gold (పసుపు పచ్చ)', hex: '#D49E35' },
  ];

  const product = {
    id: 1,
    title: 'Swarna Kanchi Pure Silk Saree - Sindhoori Vermilion Red with Korvai Gold Border',
    telugu: 'కళ్యాణం స్వర్ణ కాంచీపురం పట్టు చీర',
    price: 42500 + (blouseStitchingSelected ? 2499 : 0),
    originalPrice: 50000,
    shade: selectedColor,
    image: galleryImages[0].src,
    badge: null,
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) {
      showToast('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setDeliveryEstimated(
      pincode.startsWith('500')
        ? 'Express Delivery Available: Guaranteed by 8:00 PM Tomorrow via Hyderabad Jubilee Hills Fleet'
        : 'Standard Insured Air Delivery: Arrives in 2-3 business days via BlueDart Air'
    );
  };

  const handleAddToCart = () => {
    addToCart(product, selectedColor);
  };

  return (
    <>
      <Header />

      <main className="w-full pt-[116px] bg-background min-h-screen">
        <div className="flex flex-col w-full">
          {/* ============================================================
              Top Breadcrumb & Auspicious Notice
             ============================================================ */}
          <section className="w-full bg-surface-container-low py-space-sm px-margin-mobile md:px-margin">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-space-xs text-label-sm font-label-sm text-on-surface-variant flex-wrap"
              >
                <Link className="hover:text-primary transition-colors" href="/">
                  Home
                </Link>
                <span className="text-outline-variant">/</span>
                <Link className="hover:text-primary transition-colors" href="/sarees">
                  Sarees
                </Link>
                <span className="text-outline-variant">/</span>
                <Link className="hover:text-primary transition-colors" href="/sarees?category=kanchipuram">
                  Pattu Silk Sarees
                </Link>
                <span className="text-outline-variant">/</span>
                <Link className="hover:text-primary transition-colors" href="/sarees?category=kanchipuram">
                  Kanchipuram
                </Link>
                <span className="text-outline-variant">/</span>
                <span className="text-primary font-semibold truncate max-w-xs md:max-w-none">
                  Swarna Kanchi Pure Silk Saree
                </span>
              </nav>

              <div className="inline-flex items-center gap-2 bg-secondary-fixed/40 px-3 py-1 rounded-full text-label-sm font-label-sm text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[15px] text-secondary">
                  verified
                </span>
                <span>Auspicious Muhurtham Registry Priority Stock (Only 2 Handwoven Pieces)</span>
              </div>
            </div>
          </section>

          {/* ============================================================
              Product Hero & Purchase Grid
             ============================================================ */}
          <section className="w-full py-space-lg md:py-space-xl px-margin-mobile md:px-margin">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
              {/* LEFT COLUMN: Dynamic Media Showcase */}
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                {/* Main Stage Container */}
                <div className="relative bg-surface-container-lowest rounded-xl shadow-md overflow-hidden aspect-[2/3] max-h-[820px] group cursor-crosshair">
                  <img
                    alt={galleryImages[activeImageIndex].alt}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                    src={galleryImages[activeImageIndex].src}
                  />



                  {/* Video Drape Trigger */}
                  <button
                    onClick={() => setVideoDrawerOpen(true)}
                    type="button"
                    className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-inverse-surface/90 text-inverse-on-surface hover:text-secondary-fixed px-4 py-2 rounded-full shadow-lg backdrop-blur-sm transition-colors group/btn cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-secondary-fixed group-hover/btn:scale-110 transition-transform">
                      play_circle
                    </span>
                    <span className="text-label-sm font-label-sm">
                      360° Drape &amp; Weave Preview
                    </span>
                  </button>
                </div>

                {/* Thumbnails Strip */}
                <div className="grid grid-cols-5 gap-2 md:gap-3">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      type="button"
                      className={`relative rounded-lg overflow-hidden aspect-[2/3] shadow-sm p-0.5 focus:outline-none transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'ring-2 ring-primary opacity-100'
                          : 'opacity-70 hover:opacity-100 bg-surface-container'
                      }`}
                    >
                      <img
                        alt={img.title}
                        className="w-full h-full object-cover rounded"
                        src={img.src}
                      />
                      <span className="absolute bottom-1 inset-x-1 text-center bg-inverse-surface/85 text-inverse-on-surface text-[10px] font-label-sm py-0.5 rounded">
                        {img.title}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Master Weaver Heritage Assurance Box */}
                <div className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between gap-4 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-on-secondary-container">
                        palette
                      </span>
                    </div>
                    <div>
                      <p className="font-title-md text-title-md text-on-surface">
                        Weaver Provenance: Kanchipuram Heritage Guild
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Handcrafted by Master Weaver Sri Ramalingam • 220 Craft Hours on Traditional Pit Loom
                      </p>
                    </div>
                  </div>
                  <span className="text-label-md font-label-md text-secondary uppercase tracking-widest hidden sm:inline-block">
                    GI Tag #42
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: Buy Box & Matrimonial Customization */}
              <div className="lg:col-span-5 flex flex-col gap-space-md">
                {/* Header Information */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-secondary tracking-widest font-semibold uppercase">
                      కళ్యాణం వివాహ ప్రత్యేక కలెక్షన్ (Wedding Muhurtham Special)
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      SKU: <strong className="text-on-surface">KLM-KNC-8821</strong>
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold">
                    Swarna Kanchi Pure Silk Saree - Sindhoori Vermilion Red with Korvai Gold Border
                  </h1>
                  <p className="font-body-md text-body-md text-primary italic font-medium">
                    కళ్యాణం స్వర్ణ కాంచీపురం పట్టు చీర
                  </p>

                  {/* Social Proof & Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center text-secondary">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      4.9
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      (42 Verified Telugu Brides Reviewed)
                    </span>
                  </div>
                </div>

                {/* Pricing Card */}
                <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display-md text-display-md text-primary font-bold">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="font-headline-sm text-headline-sm text-outline-variant line-through">
                      ₹50,000
                    </span>
                    <span className="bg-primary text-on-primary text-label-sm font-label-sm font-semibold px-2 py-0.5 rounded-full">
                      Save ₹7,500 (15% OFF)
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">
                      check_circle
                    </span>
                    Inclusive of all GST. Pure Silver &amp; Gold Zari certified testing certificate included.
                  </p>

                  {/* Silk Mark Pill Indicator */}
                  <div className="mt-2 pt-3 bg-surface-container-high/40 -mx-5 -mb-5 px-5 py-3 rounded-b-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">
                        verified_user
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                        Government of India Silk Mark: Label No. SM-829104
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab(3)}
                      type="button"
                      className="text-label-sm font-label-sm text-primary underline hover:text-primary-container cursor-pointer"
                    >
                      Verify QR
                    </button>
                  </div>
                </div>

                {/* Color Variations Palette */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-label-md text-on-surface uppercase tracking-wide">
                    Auspicious Ceremonial Hue:{' '}
                    <span className="font-bold text-primary">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {colors.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                        className={`w-10 h-10 rounded-full transition-transform hover:scale-105 relative cursor-pointer ${
                          selectedColor === c.name
                            ? 'ring-2 ring-primary ring-offset-2'
                            : 'ring-1 ring-surface-dim'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedColor === c.name && (
                          <span className="material-symbols-outlined text-on-primary text-[16px] absolute inset-0 m-auto flex items-center justify-center">
                            check
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Matrimonial Customizations & Finishing Options */}
                <div className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-3">
                  <span className="font-label-md text-label-md text-on-surface font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      auto_awesome
                    </span>
                    Complimentary Matrimonial Customizations
                  </span>
                  <div className="grid grid-cols-1 gap-2 text-body-sm font-body-sm">
                    <label className="flex items-center gap-2 text-on-surface cursor-pointer">
                      <input checked readOnly className="accent-primary" type="checkbox" />
                      <span>Complimentary Pure Cotton Fall &amp; Pico (FREE)</span>
                    </label>
                    <label className="flex items-center gap-2 text-on-surface cursor-pointer">
                      <input checked readOnly className="accent-primary" type="checkbox" />
                      <span>Signature Hand-Twisted Silk Kuchu Tassels (FREE)</span>
                    </label>
                    <label className="flex items-center gap-2 text-on-surface cursor-pointer">
                      <input checked readOnly className="accent-primary" type="checkbox" />
                      <span>Unstitched Matching Blouse (Included in Saree Length)</span>
                    </label>
                    <label className="flex items-center gap-2 text-on-surface cursor-pointer font-semibold text-primary">
                      <input
                        checked={blouseStitchingSelected}
                        onChange={(e) => setBlouseStitchingSelected(e.target.checked)}
                        className="accent-primary"
                        type="checkbox"
                      />
                      <span>Custom Made-to-Measure Bridal Blouse Stitching (+₹2,499)</span>
                    </label>
                  </div>
                </div>

                {/* Auspicious Muhurtham Delivery Date & Pincode Checker */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                      Estimated Delivery &amp; Pincode Availability
                    </label>
                    <form onSubmit={handleCheckPincode} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter 6-digit Delivery Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="flex-1 px-3 py-2 bg-surface-container-lowest rounded-lg border border-surface-dim/40 text-body-sm font-body-sm focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-secondary text-on-secondary font-label-sm text-label-sm rounded-lg hover:bg-secondary-container hover:text-on-secondary-container transition-colors cursor-pointer"
                      >
                        Check Date
                      </button>
                    </form>
                    {deliveryEstimated && (
                      <p className="text-body-sm font-body-sm text-tertiary-container font-medium mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          local_shipping
                        </span>
                        {deliveryEstimated}
                      </p>
                    )}
                  </div>
                </div>

                {/* Primary Purchase CTAs */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 rounded-xl bg-primary-container text-on-primary font-title-md text-title-md font-bold hover:bg-surface-tint shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                      shopping_bag
                    </span>
                    <span>ADD TO BRIDAL BAG (₹{product.price.toLocaleString('en-IN')})</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsConsultationModalOpen(true)}
                      className="py-3 rounded-lg bg-surface-container text-primary font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">videocam</span>
                      <span>Book 1-on-1 Video Drape</span>
                    </button>
                    <Link
                      href="/checkout"
                      onClick={handleAddToCart}
                      className="py-3 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-bold hover:bg-secondary-fixed-dim transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">bolt</span>
                      <span>Buy Now Express</span>
                    </Link>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-label-sm font-label-sm text-on-surface-variant">
                  <div className="p-2 rounded bg-surface-container-lowest flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      verified
                    </span>
                    <span>Central Silk Board Verified</span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-lowest flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      local_shipping
                    </span>
                    <span>Free Worldwide Insured Delivery</span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-lowest flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-secondary text-[20px]">
                      currency_exchange
                    </span>
                    <span>10-Day Sacred Exchange Window</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================
              Detailed Information Tabs Section
             ============================================================ */}
          <section className="w-full py-space-xl px-margin-mobile md:px-margin bg-surface-container-lowest">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
              {/* Tab Navigation */}
              <div className="flex items-center gap-4 border-b border-surface-container overflow-x-auto pb-1 scrollbar-none">
                {[
                  'Weave Specifications',
                  'Master Weaver Provenance',
                  'Sacred Matrimonial Lore',
                  'Silk Mark & Zari Certification',
                  'Real Telugu Brides Reviews (42)',
                ].map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`py-3 px-2 font-title-md text-title-md whitespace-nowrap cursor-pointer transition-colors relative ${
                      activeTab === idx
                        ? 'text-primary font-bold border-b-2 border-primary -mb-0.5'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="pt-2">
                {activeTab === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter text-body-md font-body-md text-on-surface">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between py-2 border-b border-surface-container">
                        <span className="text-on-surface-variant font-medium">Fabric Purity:</span>
                        <span className="font-semibold">100% Pure Natural Mulberry Silk (Mulberry Warp &amp; Weft)</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-surface-container">
                        <span className="text-on-surface-variant font-medium">Zari Composition:</span>
                        <span className="font-semibold">Tested Silver Zari dipped in 24-Carat Pure Gold (MOP Zari)</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-surface-container">
                        <span className="text-on-surface-variant font-medium">Weaving Technique:</span>
                        <span className="font-semibold">Three-Shuttle Interlocking Korvai Technique</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-surface-container">
                        <span className="text-on-surface-variant font-medium">Origin &amp; Guild:</span>
                        <span className="font-semibold">Kanchipuram, Tamil Nadu (Telugu Padmashali Handloom Guild)</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between py-2 border-b border-surface-container">
                        <span className="text-on-surface-variant font-medium">Saree Length:</span>
                        <span className="font-semibold">5.5 Meters Body + 0.8 Meter Contrast Blouse Piece</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-surface-container">
                        <span className="text-on-surface-variant font-medium">Total Saree Weight:</span>
                        <span className="font-semibold">820 Grams (Substantial Heirloom Bridal Weight)</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-surface-container">
                        <span className="text-on-surface-variant font-medium">Wash &amp; Preservation:</span>
                        <span className="font-semibold">Strictly Professional Dry Clean. Wrap in Muslin Cloth.</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-surface-container">
                        <span className="text-on-surface-variant font-medium">GI Authentication:</span>
                        <span className="font-semibold">Geographical Indication Registry Tag #42</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="max-w-3xl flex flex-col gap-3 text-body-md font-body-md text-on-surface">
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Handcrafted by Sri Ramalingam • 4th Generation Pit Loom Master
                    </h3>
                    <p className="leading-relaxed">
                      Every warp and weft of this Swarna Kanchi drape was raised on an authentic pit loom in the historic weaving hamlet of Pillaiyarpalayam, Kanchipuram. Requiring over 220 craft hours and the collaborative coordination of two hereditary weavers simultaneously operating the three-shuttle Korvai mechanism, the border and body are structurally interlocked rather than stitched.
                    </p>
                    <p className="text-on-surface-variant leading-relaxed">
                      This technique guarantees that the heavy antique gold zari borders will never unravel or lose their tension, remaining a prized family heirloom passed down through sacred generations of Telugu brides.
                    </p>
                  </div>
                )}

                {activeTab === 2 && (
                  <div className="max-w-3xl flex flex-col gap-3 text-body-md font-body-md text-on-surface">
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Sacred Significance in Telugu Matrimonial Rites
                    </h3>
                    <p className="leading-relaxed">
                      In the sacred Telugu wedding ceremony, the bride undergoes two sacred saree transitions: the serene Yellow cotton or silk drape for the morning <strong className="text-primary">Mangala Snanam</strong> and <strong className="text-primary">Gauri Pooja</strong>, followed by the grand transition to the auspicious <strong className="text-primary">Vermilion Sindhoor Red Pattu</strong> gifted by her maternal uncle (Menamama) for the holy pinnacle moment of <strong className="text-primary">Jeelakarra-Bellam</strong> and <strong className="text-primary">Talambralu</strong>.
                    </p>
                    <p className="text-on-surface-variant leading-relaxed">
                      The intricate Mayil (peacock) motifs and temple Gopuram zig-zag borders woven into the pallu symbolize divine prosperity, marital longevity, and eternal blessings from Goddess Mahalakshmi.
                    </p>
                  </div>
                )}

                {activeTab === 3 && (
                  <div className="max-w-3xl flex flex-col gap-3 text-body-md font-body-md text-on-surface">
                    <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
                      Silk Mark Organisation of India • Government Authentication
                    </h3>
                    <p className="leading-relaxed">
                      Each Kalyanam Shopping Mall bridal saree arrives with an individual, tamper-evident holographic Silk Mark label issued by the Central Silk Board, Ministry of Textiles, Government of India.
                    </p>
                    <div className="p-4 bg-surface-container rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-title-md text-title-md font-bold block">
                          Verified Label Number: SM-829104
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          Scan the QR code on the physical tag to inspect laboratory test purity metrics.
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-secondary text-[36px]">
                        verified
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 4 && (
                  <div className="flex flex-col gap-space-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                      <div className="p-4 bg-surface-container rounded-xl flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-title-md text-title-md font-bold text-on-surface">
                            Lavanya &amp; Karthik Varma
                          </span>
                          <span className="text-body-sm text-on-surface-variant">
                            Married Nov 2024, Hyderabad
                          </span>
                        </div>
                        <div className="flex text-secondary">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className="material-symbols-outlined text-[16px]">
                              star
                            </span>
                          ))}
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          “I ordered this saree for my Muhurtham after a 1-on-1 video call from the US. The vermilion shade and the gold zari under wedding mandap lighting looked absolutely majestic. Everyone at the wedding kept praising the pure handloom drape!”
                        </p>
                      </div>

                      <div className="p-4 bg-surface-container rounded-xl flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-title-md text-title-md font-bold text-on-surface">
                            Deepika Reddy
                          </span>
                          <span className="text-body-sm text-on-surface-variant">
                            Married Dec 2024, Vijayawada
                          </span>
                        </div>
                        <div className="flex text-secondary">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span key={s} className="material-symbols-outlined text-[16px]">
                              star
                            </span>
                          ))}
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          “The Kuchu tassels and fall pico were completed flawlessly before delivery. You can immediately feel the heavy silk mark weight. Pure traditional elegance.”
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ============================================================
              Pair with Sacred Temple Jewellery Cross-sell
             ============================================================ */}
          <section className="w-full py-space-xl px-margin-mobile md:px-margin bg-background">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
                <div>
                  <span className="font-label-md text-label-md text-secondary uppercase tracking-widest block mb-1">
                    Complete The Sacred Telugu Bridal Look
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-primary">
                    Pair with Sacred Temple Jewellery
                  </h2>
                </div>
                <Link
                  href="/stores"
                  className="font-title-md text-title-md text-primary hover:text-surface-tint"
                >
                  Explore Jewellery Vault
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-2">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface-container">
                    <img
                      alt="Guttapusalu Temple Haram"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuABg8ZRIlcNzUSJZALutdE9cSv3E78gRb-r7_1EsD-hRQDd0AQbmHs6YNUmwOOCAn_yi3_4wVGd_a22qUThRT3kwMzkbHIPNHJ0D8iNn_gY7n-iX1e7hz2BxcX-OronJYrsOP7wUjeDwTz3eKZMmpy-Q_a99C7xqpt7QiqqS_TkPrn1l0-1V4rAnbP5mZpdYiwvMwvV8WciVmMyWdLsNc4FwU6RP6NOfiIcplVT3cSVE24EHYcnTJRG"
                    />
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">
                    Antique Guttapusalu Pearl &amp; Gold Haram
                  </h3>
                  <span className="text-secondary font-semibold font-body-sm">
                    22K Hallmarked Gold Craft
                  </span>
                </div>

                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-2">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface-container">
                    <img
                      alt="Kasu Mala Gold Necklace"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1emaGVTIB7QiE5dusOWDoxX2Kwh8lqssDlBdioL3Z68INfyngpdE-Kuj9W6mTp26imZYQznadJt1bndiTRpaTLZT3mVj-dKj1AOQXQUqXoh8DsAWzPZjXijVQ5DOPyj63W6I6ON2ieyT0jYWTLRERd-X0EyCWfW8CL7iTepLzwcHnUMeXbnFUkhfXJbE-KHD0N_npQfDAy_PdS14HCD9TSkn4N502O_pCbjTaWKczL1NOVqtqjY-6"
                    />
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">
                    Traditional Lakshmi Kasu Mala
                  </h3>
                  <span className="text-secondary font-semibold font-body-sm">
                    Pure Temple Jewellery Setting
                  </span>
                </div>

                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-2">
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-surface-container">
                    <img
                      alt="Bridal Vaddanam Waist Belt"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAF8sSmgJku0tU1xy-LRRu5KiSNkqs0e30CUBUrKywDpGm5L857eQVQKgLkH0x2Hjjm0PoFb80WCSEpOlH4jZ5V_VX-NYhEC1NFQW8nrxy1CZNgtht5eKMdP9Yt8r3ECVOMOZ0MLB-hQmGOpbNgr_KqzaOWN6kzY69PzPptY2wabuOgYiMYenCTMkHgXe7ixMlNIwSfBEYbdae95gxH9NHSmvplwvkMdNpuf3VnH-o-9RBA002xleWY"
                    />
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">
                    Embossed Nakshi Peacock Vaddanam (Waistbelt)
                  </h3>
                  <span className="text-secondary font-semibold font-body-sm">
                    Bridal Ceremonial Masterpiece
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 360° Drape Video Preview Drawer */}
      {videoDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-xl w-full p-6 shadow-2xl relative flex flex-col gap-4 border border-secondary-fixed/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">
                  play_circle
                </span>
                <h3 className="font-headline-sm text-headline-sm text-primary">
                  360° Drape &amp; Weave Preview
                </h3>
              </div>
              <button
                onClick={() => setVideoDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <img
                alt="360 Drape"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2X1-_UPXNY4n2vTeMz0I_h76J6B5p6s7HUpva0iz75rP64MwPVXXX0tgSm26663wMvAFJ4zm4x6x8SkdQ8DGEPt8aez4dwHJm4bjh9tgusOMvA7aHay2i2-LpyaiH2_3N9FpJuDGf_YnxatV_8Kk3lnrv5fqwpKbHEo9favVOFXz9ITk7Gkvf3eNmnMWoMhFMofmPm47XPuB5SAzyyyoepcIXQFBdfKp3BIdv64A_ljcfXefFOYsT"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                <span className="font-title-md text-title-md font-bold">
                  Daylight Studio Drape Test
                </span>
                <span className="text-body-sm opacity-80">
                  Observed under 5500K balanced daylight studio lighting. Notice the rich Korvai joint sheen.
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setVideoDrawerOpen(false);
                setIsConsultationModalOpen(true);
              }}
              className="w-full py-3 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-title-sm text-title-sm font-semibold hover:bg-secondary-fixed-dim transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">videocam</span>
              <span>Schedule Live Walkthrough of this Saree</span>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
