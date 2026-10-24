'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../components/CartContext';

// ── Department Configuration & Metadata ──
const DEPARTMENTS_META = {
  women: {
    key: 'women',
    title: "Royal Women's Heritage Collection",
    telugu: 'రాయల్ మహిళల పట్టు & సాంప్రదాయ కలెక్షన్',
    badge: 'MASTER WEAVER HANDLOOM • కంచి పట్టు & వివాహ వైభవం',
    desc: 'Revered across centuries of Telugu wedding rites, each heirloom drape is hand-woven by hereditary masters using pure mulberry silk yarn and interlocking Korvai borders. Accented with authentic tested zari motifs that narrate sacred temple lore.',
    heroImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDsDtVt7hyzWV-Ikwju3GCBEESwFvBnjLQb5hNgOCkVuxXomj8hfMits6wQZrCVvZKakUxdpe1SHIsu4FgjvrNgSKGf51386tmun57Qr3M1aodWfK_rCD0O4Nl2mMhu_IFK2FcThU2xfsl-1GRfU40L9sqJx9t-VWax_8sVLr-4W5vlTknul_2XnDByf9Zplf6Q_8t6gTyiMuYtijaLKrRyoGxwW2jtqgcreTUGRmZE32XTmiXGMFkK',
    categories: [
      'Kanchipuram Pattu',
      'Bridal Pattu',
      'Banarasi Silk',
      'Gadwal Handloom',
      'Pochampally Ikat',
      'Bridal Lehengas',
      'Half Sarees (Langa Voni)',
    ],
    occasions: [
      'Bridal Muhurtham',
      'Reception Grandeur',
      'Festive & Varalakshmi Vratham',
      'Puja & Traditional rituals',
    ],
    badges: ['100% Pure Silk Mark', 'Tested Gold & Silver Zari', 'Express Insured Delivery'],
    accentColor: '#1a1b18',
  },
  men: {
    key: 'men',
    title: "Men's Heritage Wedding & Groom Studio",
    telugu: 'పురుషుల పెళ్లి పంచెలు, షేర్వానీలు & కుర్తాలు',
    badge: "GROOM'S ATTIRE & ROYAL COUTURE • పెళ్లి కొడుకు స్టూడియో",
    desc: 'Tailored with dignity and masculine splendor for South Indian Telugu grooms and festive celebrations. Featuring pure mulberry silk wedding panche sets, raw silk bandhgalas, and jacquard sherwanis handwoven on traditional pit looms.',
    heroImage:
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80',
    categories: ['Pattu Panche & Dhotis', 'Sherwanis', 'Kurta Sets', 'Silk Shirts'],
    occasions: [
      'Bridal Muhurtham',
      'Reception Grandeur',
      'Festive & Varalakshmi Vratham',
      'Puja & Traditional rituals',
    ],
    badges: ['Pure Mulberry Silk', 'Handwoven Pit Loom Weaves', 'Custom Fit Tailoring'],
    accentColor: '#1B4D3E',
  },
  kids: {
    key: 'kids',
    title: "Kids' Traditional Pattu & Festive Wear",
    telugu: 'పిల్లల పట్టు పావడాలు, ధోతీలు & ఫ్రాకులు',
    badge: 'LITTLE HEIRLOOMS • చిన్నారల పట్టు వైభవం',
    desc: 'Adorning the next generation with innocence and regal Telugu splendor. Pure silk pattu pavadas with contrast dhavani borders, comfortable cotton inner linings, and vibrant festive kurta-dhoti sets for traditional ceremonies.',
    heroImage:
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=1200&q=80',
    categories: ['Girls Pattu Pavada', 'Boys Kurta Sets', 'Girls Festive Frocks', 'Junior Sherwanis'],
    occasions: [
      'Bridal Muhurtham',
      'Festive & Varalakshmi Vratham',
      'Puja & Traditional rituals',
      'Sangeet & Party',
    ],
    badges: ['Soft Cotton Inner Lining', 'Pure Silk Mark Certified', 'Non-Allergic Natural Dyes'],
    accentColor: '#1A5276',
  },
};

// ── Master Weave Archive Categories for Homepage ──
const WEAVE_COLLECTIONS = [
  {
    key: 'pattu',
    dept: 'women',
    tag: 'ROYAL PATTU',
    tagBg: 'bg-[#144738] text-white',
    title: 'Pattu Silk Sarees',
    subtitle: 'Royalty in timeless Kanchi weaves',
    telugu: 'కంచి పట్టు చీరలు',
    count: '450+ Sarees',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDsDtVt7hyzWV-Ikwju3GCBEESwFvBnjLQb5hNgOCkVuxXomj8hfMits6wQZrCVvZKakUxdpe1SHIsu4FgjvrNgSKGf51386tmun57Qr3M1aodWfK_rCD0O4Nl2mMhu_IFK2FcThU2xfsl-1GRfU40L9sqJx9t-VWax_8sVLr-4W5vlTknul_2XnDByf9Zplf6Q_8t6gTyiMuYtijaLKrRyoGxwW2jtqgcreTUGRmZE32XTmiXGMFkK',
  },
  {
    key: 'bridal',
    dept: 'women',
    tag: 'MUHURTHAM',
    tagBg: 'bg-[#1a1b18] text-white',
    title: 'Bridal Muhurtham Sarees',
    subtitle: 'Sacred red & crimson wedding silks',
    telugu: 'పెళ్లి పట్టు చీరలు',
    count: '280+ Sarees',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD1us0VeC6zKYfvsAQbFe6Qb5MBeM9RvG1c3leQKrY3b0lO2DcKvQlaPBQu01vPSzXEpWBKU3Qs18qk7qYbNoSJWzqKuMES0hIslxytSRyrMaIgZ8Rck2jYkyXpLu3W8tInhJdKdMNiCauInWYH5pGCKfdll-_wmQQNghQx-ovJCOxcG9-pInsV1vhiqyEy7FKJ9kdArb9hoUVqtktl9Jb_oaAuqmVrJhoe8mIADr9agfNMl-noj6by',
  },
  {
    key: 'kanchipuram',
    dept: 'women',
    tag: 'HEAVY ZARI',
    tagBg: 'bg-[#c5a04b] text-white',
    title: 'Kanchipuram Sarees',
    subtitle: 'Heavy contrast korvai borders',
    telugu: 'వరలక్ష్మి కంచి పట్టు',
    count: '520+ Sarees',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC4D_kKb1RQDVeLQ-8Sfw2e5pkoPacsUQl8q1CUCarJ3ODFj002Dv0thz-P02GLqW-LNEV3sXWDq99E_gC832Eek0IKjf5yzjvvwVN8xbC_ydZDqD9HcuqKd5Dd5XxiEG13CKJUI0Ydnq97p7w0-_svsPCDF1AOeTFcLh7Dj52y5ujGPW6CTx1qBEpZGk3yL5xf5lvB2TVidN09WfHCcPp68yl69BUWOdgyaBZqOqTTEdOhJ6X_-BN-',
  },
  {
    key: 'banarasi',
    dept: 'women',
    tag: 'KATAN WEAVE',
    tagBg: 'bg-[#201A19] text-white',
    title: 'Banarasi Silk Sarees',
    subtitle: 'Intricate floral jaal & brocades',
    telugu: 'బనారసి కతాన్ పట్టు',
    count: '310+ Sarees',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtSxFqF7G72Q4G-rwhQhB-DztXDyeWUZDeQa1WkVF85lzhJNIKYmzBFP5YLRqdQIV5St8ltdYlG5jjYPsVuczVHiWIINACR6Y2OAJ6SMn7P0dmLRIt3-lHijcgDisf149b9Y5jBXiT_iIz6qQ6uS7DVet0qQWp9Hwlb7NHqTB894Q8Iw8JuO9Mbc1SEm9_PBfpY0onDsf8FHgSelp_V1_3171jTTZ5fuMlsf2zvQedKFcSD8tRSMvY',
  },
  {
    key: 'gadwal',
    dept: 'women',
    tag: 'KUTTU WEAVE',
    tagBg: 'bg-[#003024] text-white',
    title: 'Gadwal Handloom Sarees',
    subtitle: 'Kuttu border handloom perfection',
    telugu: 'గద్వాల చేనేత పట్టు',
    count: '190+ Sarees',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC-jKZFkZzvp04kuaz3VR922YXpdhkOvjaOGNcJWpP0gVOnPSFPRoXxLduGF9BjWu7T4lmlSfzxwHB_4SdzSQ6q96m9hh9-O_8DUNg_EdZUr-FIyweqs8c0bRkzvSGq6guIhxwc8RgpW-oGxN0jFRsu0s_RKWoRUXq9NFKkEQ2Tv-SkA8I_8u-KzHWvsI3NNccfXUzF7Vy-weRch87VHLxv9xFaEz79fzMRM5GaLp-AFvDUZNP-wV9f',
  },
  {
    key: 'pochampally',
    dept: 'women',
    tag: 'DOUBLE IKAT',
    tagBg: 'bg-[#9C4100] text-white',
    title: 'Pochampally Ikat Silks',
    subtitle: 'Telangana geometric silk legacy',
    telugu: 'పోచంపల్లి ఇకత్ పట్టు',
    count: '160+ Sarees',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATTe6A-9Knp98SsDGSAFhFEZcQUGHR2raWqjxGlom9xJxT8uN_CBGIg9OwLkbuRNZAQzwp9VhGndsN_FOE-b-WUEVnt7L_kMOfkAzIHVd3M6kUXJEVB-3XxMicQ1XYy9BbZ9w0VGKT4MszGTR_tDu0xGeuZ7fc7DWBbB9mouJyJ1dXZ50v_49cCoje7OHXbMSC97IVOPiITkyMy21_LNnob6kWj4l2YIN77nKeJbUtD8DA3TjPiTjZ',
  },
  {
    key: 'men',
    dept: 'men',
    tag: "GROOM'S ATTIRE",
    tagBg: 'bg-[#1B4D3E] text-white',
    title: "Men's Wedding Panche & Sherwanis",
    subtitle: 'Regal silk kurtas, panche & dhotis',
    telugu: 'పురుషుల పెళ్లి పంచె & షేర్వానీలు',
    count: '120+ Styles',
    image:
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80',
  },
  {
    key: 'kids',
    dept: 'kids',
    tag: 'FESTIVE PATTU',
    tagBg: 'bg-[#1A5276] text-white',
    title: "Kids' Pattu Pavadas & Frocks",
    subtitle: 'Authentic South Indian festive wear',
    telugu: 'పిల్లల పట్టు పావడాలు & కుర్తాలు',
    count: '95+ Styles',
    image:
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=700&q=80',
  },
];

// ── Physical Twin Showrooms in Telangana ──
const STORE_LOCATIONS = [
  {
    name: 'Kalyanam Shopping Mall — Gudur Flagship',
    telugu: 'కళ్యాణం షాపింగ్ మాల్ — గూడూరు',
    address: 'Palakurthy Rd, Gudur, Telangana 506252',
    mapUrl: 'https://maps.app.goo.gl/tn1VL1L4jCtobqdT7?g_st=iw',
    phone: '+91 98490 12345',
    code: 'PCF6+8GQ',
    hours: 'Mon–Sat: 9:00 AM – 8:30 PM | Sun: 10:00 AM – 7:00 PM',
    highlight: 'Sprawling Multi-Floor Bridal & Family Shopping Landmark',
  },
  {
    name: 'Kalyanam Shopping Mall — Palakurthy Showroom',
    telugu: 'కళ్యాణం షాపింగ్ మాల్ — పాలకుర్తి',
    address: 'Main Road, Palakurthy, Telangana 506146',
    mapUrl: 'https://maps.app.goo.gl/iFrxPDS4CcHRxKAQ6?g_st=iw',
    phone: '+91 98490 54321',
    code: 'MC5J+66H',
    hours: 'Mon–Sat: 9:00 AM – 8:30 PM | Sun: 10:00 AM – 7:00 PM',
    highlight: 'Handloom Silk Sarees, Groom Studio & Children Festive Wear',
  },
];

// ── 4 Pillars of Artisanal Trust ──
const TRUST_PILLARS = [
  {
    icon: 'verified',
    color: 'text-[#144738] bg-[#144738]/10',
    title: '100% Silk Mark Certified',
    desc: 'Every thread authenticated by the Silk Mark Organisation of India (Central Silk Board), guaranteeing pure natural mulberry silk.',
  },
  {
    icon: 'workspace_premium',
    color: 'text-[#c5a04b] bg-[#c5a04b]/10',
    title: 'Pure Silver & Gold Zari',
    desc: 'Our bridal weaves feature tested silver-electroplated and 24K gold dipped zari threads accompanied by laboratory authenticity cards.',
  },
  {
    icon: 'local_shipping',
    color: 'text-[#1a1b18] bg-[#1a1b18]/10',
    title: 'Insured Global Shipping',
    desc: 'Full transit insurance on all international shipments to USA, UK, UAE, Canada, and Australia via premium DHL Express partners.',
  },
  {
    icon: 'content_cut',
    color: 'text-[#352F2E] bg-[#352F2E]/10',
    title: 'Complimentary Kuchu & Fall',
    desc: 'Receive ready-to-wear perfection with our signature hand-tied silk tassels (Kuchu), matching blouse fabric, and precision fall-pico.',
  },
];

// ── Color Swatches Palette ──
const COLOR_SWATCHES = [
  { name: 'Red', hex: '#B2182B', label: 'Sindhoori Red' },
  { name: 'Pink', hex: '#D43F8D', label: 'Rani Pink' },
  { name: 'Blue', hex: '#0E5284', label: 'Royal Blue' },
  { name: 'Yellow', hex: '#E5A912', label: 'Haldi Yellow' },
  { name: 'Green', hex: '#004D38', label: 'Emerald Green' },
  { name: 'Wine', hex: '#4A0E17', label: 'Wine Maroon' },
  { name: 'Gold', hex: '#C5A04B', label: 'Antique Gold' },
  { name: 'Cream', hex: '#F5EEDB', label: 'Silk Cream' },
];

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deptParam = searchParams?.get('dept') || '';
  const searchParam = searchParams?.get('search') || '';

  const { addToCart, toggleWishlist, wishlist, showToast, setIsConsultationModalOpen } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  // Dedicated Department Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOccasion, setSelectedOccasion] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedZari, setSelectedZari] = useState('all');
  const [maxPrice, setMaxPrice] = useState(80000);
  const [sortBy, setSortBy] = useState('featured');
  const [gridCols, setGridCols] = useState(4); // 3 or 4 cols
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Determine if viewing a specific department or search
  const isDeptView = Boolean(deptParam && DEPARTMENTS_META[deptParam.toLowerCase()]);
  const activeDeptMeta = isDeptView ? DEPARTMENTS_META[deptParam.toLowerCase()] : null;

  // Reset local filters when department or search changes
  useEffect(() => {
    setSelectedCategory('all');
    setSelectedOccasion('all');
    setSelectedColor('all');
    setSelectedZari('all');
    setMaxPrice(80000);
    setSortBy('featured');
  }, [deptParam, searchParam]);

  // Fetch products from database
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (isDeptView) {
          params.set('department', deptParam);
        }
        if (searchParam) {
          params.set('search', searchParam);
        }
        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setAllProducts(data.products || []);
      } catch (e) {
        console.error('Failed to load products', e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [deptParam, searchParam, isDeptView]);

  // Filter & Sort Products in memory for department view
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (selectedOccasion !== 'all') {
      list = list.filter((p) => p.occasion === selectedOccasion);
    }
    if (selectedColor !== 'all') {
      list = list.filter((p) => p.colorFamily === selectedColor);
    }
    if (selectedZari !== 'all') {
      list = list.filter((p) => p.zariType === selectedZari);
    }
    if (maxPrice < 80000) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => b.id.localeCompare(a.id));
    }

    return list;
  }, [allProducts, selectedCategory, selectedOccasion, selectedColor, selectedZari, maxPrice, sortBy]);

  const handleAddToCart = (product, qty = 1) => {
    addToCart({ ...product, quantity: qty });
    showToast(`${product.title.split(' ').slice(0, 3).join(' ')} added to your cart!`);
    if (quickViewProduct) setQuickViewProduct(null);
  };

  const handleClearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedOccasion('all');
    setSelectedColor('all');
    setSelectedZari('all');
    setMaxPrice(80000);
    setSortBy('featured');
  };

  const hasActiveLocalFilters =
    selectedCategory !== 'all' ||
    selectedOccasion !== 'all' ||
    selectedColor !== 'all' ||
    selectedZari !== 'all' ||
    maxPrice < 80000;

  return (
    <>
      <Header />

      {/* ══════════════════════════════════════════════════════════════════
          SCENARIO A: DEDICATED DEPARTMENT SCREEN (WOMEN, MEN, OR KIDS)
          Triggered when user clicks Women, Men, or Kids in the navbar
          The entire screen below the navbar becomes the department catalog
         ══════════════════════════════════════════════════════════════════ */}
      {isDeptView ? (
        <main className="pt-[116px] bg-white text-[#201A19] min-h-screen">
          {/* 1. Breadcrumb & Top Editorial Ribbon */}
          <section className="w-full bg-[#f8f9fa] border-b border-gray-200 py-4 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex flex-col gap-4">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center flex-wrap gap-2 text-xs text-gray-500 font-medium">
                <Link href="/" className="hover:text-[#1a1b18] transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">home</span>
                  <span>Home</span>
                </Link>
                <span className="opacity-40">/</span>
                <span className="capitalize font-semibold text-gray-900">
                  {activeDeptMeta.key}&apos;s Collection ({activeDeptMeta.telugu})
                </span>
                <Link
                  href="/"
                  className="ml-auto text-xs font-bold text-[#1a1b18] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                  Back to Home
                </Link>
              </nav>

              {/* Department Editorial Banner Card */}
              <div className="bg-white p-5 md:p-8 rounded-[10px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="max-w-3xl flex flex-col gap-2 z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#c5a04b] text-[#1a1b18] text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                      {activeDeptMeta.badge}
                    </span>
                  </div>

                  <h1 className="font-sans text-2xl sm:text-4xl lg:text-5xl text-[#1a1b18] font-bold tracking-tight">
                    {activeDeptMeta.title}
                  </h1>

                  <p className="text-sm md:text-base text-gray-600 leading-relaxed font-sans">
                    {activeDeptMeta.desc}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-2 pt-2 text-xs font-semibold text-gray-700">
                    {activeDeptMeta.badges.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#1a1b18]">verified</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Counter Pill Badge */}
                <div className="shrink-0 flex md:flex-col items-center justify-center p-4 rounded-[10px] bg-[#f8f9fa] text-center min-w-[200px] border border-gray-200 z-10 self-stretch md:self-auto">
                  <span className="font-sans text-3xl md:text-4xl font-bold text-[#1a1b18]">
                    {filteredProducts.length}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-gray-600 mt-1 font-semibold">
                    Handcrafted Styles
                  </span>
                  <div className="w-12 h-0.5 bg-[#C5A04B] my-2" />
                  <span className="text-[11px] font-bold text-[#c5a04b]">
                    Auspicious Muhurtham Live
                  </span>
                </div>

                {/* Subtle Ambient Glow */}
                <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#c5a04b]/20 rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>
          </section>

          {/* 2. Interactive Control Bar (Filter toggle, Count, Grid switch, Sort) */}
          <section className="w-full bg-white border-b border-gray-200 sticky top-[116px] z-30 px-4 md:px-8 py-3 shadow-xs">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8f9fa] text-[#1a1b18] text-xs font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Filters {hasActiveLocalFilters && '• Active'}</span>
                </button>

                <span className="text-xs md:text-sm text-gray-600 font-medium hidden sm:inline">
                  Showing <strong className="text-gray-900">{filteredProducts.length}</strong> items in{' '}
                  <span className="capitalize font-semibold text-[#1a1b18]">{activeDeptMeta.key}</span>
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Grid Column Switch (3 vs 4 cols) */}
                <div className="hidden md:flex items-center bg-gray-100 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setGridCols(3)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      gridCols === 3 ? 'bg-white text-[#1a1b18] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">view_column</span>
                    <span>3 Cols</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridCols(4)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      gridCols === 4 ? 'bg-white text-[#1a1b18] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">grid_view</span>
                    <span>4 Cols</span>
                  </button>
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-2">
                  <label htmlFor="sortSelect" className="text-xs text-gray-500 font-medium hidden sm:inline">
                    Sort By:
                  </label>
                  <div className="relative">
                    <select
                      id="sortSelect"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-xs font-bold py-1.5 pl-3 pr-8 rounded-none focus:outline-none focus:ring-1 focus:ring-[#1a1b18] cursor-pointer"
                    >
                      <option value="featured">Featured Curations</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Customer Rating</option>
                      <option value="newest">Newest Arrivals</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-2 pointer-events-none text-gray-400 text-[16px]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Main Catalog Canvas: Left Filters Sidebar + Right Product Grid */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Filter Sidebar */}
            <aside
              className={`w-full lg:w-[280px] shrink-0 bg-white p-5 rounded-[10px] shadow-sm border border-gray-200 flex flex-col gap-6 ${
                mobileFilterOpen ? 'block' : 'hidden lg:flex'
              }`}
            >
              {/* Filter Header with Clear All */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px] text-[#1a1b18]">filter_list</span>
                  <h3 className="font-sans text-lg font-bold text-gray-900">Refine Collection</h3>
                </div>
                {hasActiveLocalFilters && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="text-xs font-bold text-[#1a1b18] hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Active Filter Chips */}
              {hasActiveLocalFilters && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f8f9fa] text-[#1a1b18] text-xs font-semibold">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory('all')} className="hover:text-red-800">
                        ×
                      </button>
                    </span>
                  )}
                  {selectedOccasion !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f8f9fa] text-[#1a1b18] text-xs font-semibold">
                      {selectedOccasion}
                      <button onClick={() => setSelectedOccasion('all')} className="hover:text-red-800">
                        ×
                      </button>
                    </span>
                  )}
                  {selectedColor !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f8f9fa] text-[#1a1b18] text-xs font-semibold capitalize">
                      Color: {selectedColor}
                      <button onClick={() => setSelectedColor('all')} className="hover:text-red-800">
                        ×
                      </button>
                    </span>
                  )}
                  {maxPrice < 80000 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f8f9fa] text-[#1a1b18] text-xs font-semibold">
                      Under ₹{maxPrice.toLocaleString('en-IN')}
                      <button onClick={() => setMaxPrice(80000)} className="hover:text-red-800">
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* 1. Category / Weave Filter */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Category / Style
                </span>
                <div className="flex flex-col gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`flex items-center justify-between text-left text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#1a1b18] text-white font-bold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>All {activeDeptMeta.title.split(' ')[1]}</span>
                    <span>{allProducts.length}</span>
                  </button>
                  {activeDeptMeta.categories.map((cat) => {
                    const count = allProducts.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                        className={`flex items-center justify-between text-left text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-[#1a1b18] text-white font-bold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="opacity-60">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Occasion Filter */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Ceremonial Occasion
                </span>
                <div className="flex flex-col gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedOccasion('all')}
                    className={`flex items-center justify-between text-left text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                      selectedOccasion === 'all'
                        ? 'bg-[#1a1b18] text-white font-bold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>All Occasions</span>
                  </button>
                  {activeDeptMeta.occasions.map((occ) => {
                    const count = allProducts.filter((p) => p.occasion === occ).length;
                    return (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => setSelectedOccasion(selectedOccasion === occ ? 'all' : occ)}
                        className={`flex items-center justify-between text-left text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                          selectedOccasion === occ
                            ? 'bg-[#1a1b18] text-white font-bold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{occ}</span>
                        <span className="opacity-60">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Price Range Filter */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-900">Max Price</span>
                  <span className="text-xs font-bold text-[#1a1b18]">₹{maxPrice.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="80000"
                  step="2500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#1a1b18] h-1.5 bg-gray-200 rounded-none cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                  <span>₹5,000</span>
                  <span>₹40,000</span>
                  <span>₹80,000+</span>
                </div>
              </div>

              {/* 4. Auspicious Colors Filter */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Auspicious Colors
                </span>
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {COLOR_SWATCHES.map((color) => {
                    const isSelected = selectedColor === color.name.toLowerCase();
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() =>
                          setSelectedColor(isSelected ? 'all' : color.name.toLowerCase())
                        }
                        className={`flex flex-col items-center gap-1 p-1.5 rounded-none transition-all cursor-pointer ${
                          isSelected ? 'bg-[#f8f9fa] ring-2 ring-[#1a1b18]' : 'hover:bg-gray-50'
                        }`}
                        title={color.label}
                      >
                        <span
                          className="w-6 h-6 rounded-full shadow-inner ring-1 ring-black/10"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[10px] text-gray-700 font-medium">{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Virtual Video Shopping Card within Sidebar */}
              <div className="p-4 rounded-none bg-[#f8f9fa] border border-gray-200 flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-1.5 text-[#1a1b18] font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  <span>Personal Video Drape</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Need assistance selecting wedding silks? Schedule an exclusive 1-on-1 virtual video session.
                </p>
                <button
                  type="button"
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="w-full mt-1 py-2 bg-[#c5a04b] hover:bg-[#d8b564] text-[#1a1b18] font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Book Video Session
                </button>
              </div>
            </aside>

            {/* Right Product Grid Canvas */}
            <section className="flex-1 w-full flex flex-col gap-6">
              {loading && (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
                  <div className="w-10 h-10 border-3 border-[#1a1b18] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium">Curating authentic {activeDeptMeta.key} weaves…</p>
                </div>
              )}

              {!loading && filteredProducts.length === 0 && (
                <div className="py-20 text-center bg-white rounded-[10px] border border-gray-200 p-8">
                  <span className="material-symbols-outlined text-[54px] text-gray-300">filter_alt_off</span>
                  <h3 className="text-lg font-bold text-gray-800 mt-2">No matching heirlooms found</h3>
                  <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
                    Try adjusting your filters or price slider to see more styles.
                  </p>
                  <button
                    onClick={handleClearAllFilters}
                    className="mt-4 px-5 py-2 bg-[#1a1b18] text-white rounded-lg font-bold text-sm hover:bg-black transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Products Grid */}
              {!loading && filteredProducts.length > 0 && (
                <div
                  className={`grid gap-4 md:gap-6 ${
                    gridCols === 3
                      ? 'grid-cols-2 md:grid-cols-3'
                      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                  }`}
                >
                  {filteredProducts.map((product) => {
                    const isWishlisted = wishlist.some((w) => w.id === product.id);
                    return (
                      <div
                        key={product.id}
                        className="group flex flex-col bg-white rounded-[10px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex-1 justify-between"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
                          <Link href={product.href || `/product/${product.id}`} className="block w-full h-full">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                              loading="lazy"
                            />
                          </Link>

                          {/* Clean Discount Tag */}
                          {product.discount && (
                            <span className="absolute top-3 left-3 bg-[#d72c0d] text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px] shadow-sm">
                              {product.discount}
                            </span>
                          )}

                          {/* Wishlist Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(product);
                            }}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          >
                            <span
                              className={`material-symbols-outlined text-[19px] ${
                                isWishlisted ? 'text-[#1a1b18]' : 'text-gray-400'
                              }`}
                            >
                              {isWishlisted ? 'favorite' : 'favorite_border'}
                            </span>
                          </button>

                          {/* Quick View Button on Hover */}
                          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              type="button"
                              onClick={() => {
                                setQuickViewProduct(product);
                                setQuickViewQty(1);
                              }}
                              className="w-full py-2 bg-black/85 hover:bg-black text-white text-xs font-bold rounded-none backdrop-blur-sm transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer uppercase tracking-wider"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                              Quick View
                            </button>
                          </div>
                        </div>

                        {/* Metadata Details */}
                        <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a1b18] bg-[#1a1b18]/10 px-2 py-0.5 rounded">
                                {product.category}
                              </span>
                              {product.rating && (
                                <div className="flex items-center gap-0.5 text-[#C5A04B]">
                                  <span className="material-symbols-outlined text-[14px]">star</span>
                                  <span className="text-[11px] font-bold text-gray-700">{product.rating}</span>
                                </div>
                              )}
                            </div>

                            <Link href={product.href || `/product/${product.id}`}>
                              <h3 className="font-sans text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-[#1a1b18] transition-colors min-h-[2.5rem]">
                                {product.title}
                              </h3>
                            </Link>

                            {product.telugu && (
                              <p className="text-[11px] text-gray-500 italic mt-0.5 truncate">
                                {product.telugu}
                              </p>
                            )}
                          </div>

                          <div>
                            {/* Color Swatch Dots */}
                            {product.colors && product.colors.length > 0 && (
                              <div className="flex items-center gap-1.5 mb-2">
                                {product.colors.map((c, i) => (
                                  <span
                                    key={i}
                                    className="w-3.5 h-3.5 rounded-full border border-white shadow-sm ring-1 ring-gray-300"
                                    style={{ backgroundColor: c }}
                                  />
                                ))}
                                <span className="text-[10px] text-gray-400 font-medium ml-1">
                                  {product.colors.length} shades
                                </span>
                              </div>
                            )}

                            {/* Pricing & Add to Cart */}
                            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                              <div>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-bold text-base md:text-lg text-gray-900">
                                    ₹{product.price.toLocaleString('en-IN')}
                                  </span>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-gray-400 line-through text-xs">
                                      ₹{product.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-[#144738] font-semibold block">
                                  {product.deliveryNote || 'Insured Delivery'}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAddToCart(product)}
                                className="px-3.5 py-2 bg-[#1a1b18] hover:bg-black text-white text-xs font-bold rounded-none shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0 uppercase tracking-wider"
                                title="Add to Cart"
                              >
                                <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                                <span>Add</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* 4. Heritage Care Guide Footer Banner */}
          <section className="w-full py-12 px-4 md:px-8 bg-[#f8f9fa] border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold text-[#c5a04b] uppercase tracking-widest block mb-1">
                  Telugu Bridal Heritage Guide
                </span>
                <h3 className="font-sans text-2xl md:text-3xl text-[#1a1b18] font-bold">
                  Caring for Your Heritage Handlooms
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-white rounded-[10px] shadow-sm border border-gray-100 flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-none bg-[#f8f9fa] flex items-center justify-center text-[#1a1b18]">
                    <span className="material-symbols-outlined text-[22px]">dry_cleaning</span>
                  </div>
                  <h4 className="font-sans font-bold text-gray-900">Dry Cleaning &amp; Washing</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Never machine-wash pure mulberry silk with gold zari. Always opt for reputed dry cleaning specialists who understand handlooms.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-[10px] shadow-sm border border-gray-100 flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-none bg-[#f8f9fa] flex items-center justify-center text-[#1a1b18]">
                    <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                  </div>
                  <h4 className="font-sans font-bold text-gray-900">Storage in Muslin Wrap</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Wrap your saree in breathable, unbleached pure cotton or muslin fabric. Avoid plastic covers which trap humidity and cause zari oxidation.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-[10px] shadow-sm border border-gray-100 flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-none bg-[#f8f9fa] flex items-center justify-center text-[#1a1b18]">
                    <span className="material-symbols-outlined text-[22px]">restart_alt</span>
                  </div>
                  <h4 className="font-sans font-bold text-gray-900">Airing &amp; Refolding</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Unfold and air out your bridal weaves once every six months in indirect shaded breeze. Change fold lines periodically to avoid creasing.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        /* ══════════════════════════════════════════════════════════════════
            SCENARIO B: THE COMPLETE ROYAL HOMEPAGE (USER APPROVED & PRAISED)
            Rendered on `/` or when no specific department filter is active
           ══════════════════════════════════════════════════════════════════ */
        <main className="pt-[116px] bg-white text-[#201A19] min-h-screen">
          {/* 1. EDITORIAL LUXURY HERO SECTION */}
          <section className="relative w-full overflow-hidden bg-[#1a1b18] text-white shadow-lg">
            <div className="relative min-h-[580px] md:min-h-[660px] lg:min-h-[720px] w-full flex items-center">
              {/* Background Visual */}
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDK_ItvZUlKRiaoR8B6t0zWjsx74aZQ5c1DygDKKyK40cAyJeA9UvQyVPHby4rpX4gHIv10KpiHTT6nZjrhA2VmESbNqTA7n4krKRHcxIvrQf5yYI42J8myxwr6ckZauHXE1aGeQXtFjc298wmubdbb4RPf0m7YsLXhzHySmni1plkiTpegLXtU5yzJiW3Z7jNXGZh0eKqX1pMfDre4LlPSQQOKHC6pVulxRfhbqo0FhCVnSH4xpbtE')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a1b18]/95 via-[#1a1b18]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1b18]/90 via-transparent to-black/50" />

              {/* Hero Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 w-full">
                <div className="max-w-2xl flex flex-col items-start gap-4 md:gap-5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c5a04b]/20 backdrop-blur-md border border-[#c5a04b]/40">
                    <span
                      className="material-symbols-outlined text-[#c5a04b] text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      stars
                    </span>
                    <span className="font-semibold text-xs md:text-sm tracking-widest text-[#c5a04b] uppercase font-sans">
                      కళ్యాణ వైభోగమే • TRADITION WOVEN IN GOLD
                    </span>
                  </div>

                  <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl text-white leading-tight font-bold drop-shadow-md">
                    Elegance Woven in Tradition
                  </h1>

                  <p className="text-base sm:text-lg text-gray-200 max-w-xl leading-relaxed font-sans">
                    Discover exquisite pure silk sarees, royal groom couture &amp; festive children&apos;s wear handcrafted by master weavers for life&apos;s most sacred celebrations.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href="#collections"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-none bg-[#c5a04b] text-[#1a1b18] font-bold text-xs sm:text-sm hover:bg-[#d8b564] shadow-xl hover:shadow-2xl transition-all group uppercase tracking-wider font-sans"
                    >
                      <span>Shop Collections</span>
                      <span className="material-symbols-outlined text-[18px] text-[#c5a04b] group-hover:translate-x-1 transition-transform">
                        east
                      </span>
                    </a>

                    <Link
                      href="/?dept=women"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-none bg-transparent hover:bg-white text-white hover:text-[#1a1b18] font-bold text-xs sm:text-sm shadow-md transition-all border-2 border-white uppercase tracking-wider font-sans"
                    >
                      <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                      <span>Explore Bridal</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setIsConsultationModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-5 py-3 rounded-none bg-white/15 backdrop-blur-md hover:bg-white/25 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer border border-white/30 uppercase tracking-wider font-sans"
                    >
                      <span className="material-symbols-outlined text-[18px]">videocam</span>
                      <span>Live Video Shopping</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-xs border border-white/10">
                      <span className="material-symbols-outlined text-[#c5a04b] text-[15px]">verified</span>
                      <span>100% Pure Mulberry Silk</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-xs border border-white/10">
                      <span className="material-symbols-outlined text-[#c5a04b] text-[15px]">verified_user</span>
                      <span>Certified Silk Mark</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/90 text-xs border border-white/10">
                      <span className="material-symbols-outlined text-[#c5a04b] text-[15px]">flare</span>
                      <span>Handwoven Pure Zari</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. SACRED WEAVES ARCHIVE & FAMILY COLLECTIONS (BENTO GRID) */}
          <section className="w-full py-12 md:py-16 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[#c5a04b] text-xs font-bold uppercase tracking-widest mb-1.5">
                    <span className="w-6 h-[2px] bg-[#c5a04b] inline-block" />
                    <span>Sacred Weaves &amp; Family Collections</span>
                  </div>
                  <h2 className="font-sans text-2xl md:text-4xl text-[#1a1b18] font-bold">
                    Shop by Master Weave &amp; Occasion
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 mt-1 font-sans">
                    తరతరాల తెలుగు సాంప్రదాయ హస్తకళల అపురూప వైభవం — Curated for Women, Men &amp; Kids
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/?dept=women"
                    className="inline-flex items-center gap-1 text-sm font-bold text-[#1a1b18] hover:text-[#1a1b18] group transition-colors"
                  >
                    <span>View All Collections</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>

              {/* 8 Category Bento Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {WEAVE_COLLECTIONS.map((c) => (
                  <Link
                    key={c.key}
                    href={`/?dept=${c.dept}`}
                    className="group flex flex-col text-left bg-white rounded-[10px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                      <img
                        src={c.image}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <span
                        className={`absolute top-3 left-3 text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${c.tagBg}`}
                      >
                        {c.tag}
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 text-[11px] text-white/90 font-medium px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm">
                        {c.telugu}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        <h3 className="font-sans text-base md:text-lg font-bold text-gray-900 group-hover:text-[#1a1b18] transition-colors leading-snug">
                          {c.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{c.subtitle}</p>
                      </div>
                      <span className="mt-3 text-xs font-bold text-[#c5a04b] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        {c.count} <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* 3. FEATURED MUHURTHAM BRIDAL & FAMILY SHOWCASE (LIVE PRODUCTS) */}
          <section id="collections" className="w-full py-12 md:py-16 px-4 md:px-8 bg-[#f8f9fa] border-y border-gray-200">
            <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-[#1a1b18] text-xs font-bold uppercase tracking-wider mb-1.5">
                    <span className="material-symbols-outlined text-[#c5a04b] text-[18px]">favorite</span>
                    <span>Sacred Telugu Matrimony Exclusives</span>
                  </div>
                  <h2 className="font-sans text-2xl md:text-4xl text-[#1a1b18] font-bold">
                    The Muhurtham Bridal &amp; Festive Edit
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 mt-1">
                    వివాహ వేడుకల ప్రత్యేక కలెక్షన్ — Master-weaver handlooms and royal couture crafted for sacred Jeelakarra-Bellam moments.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/?dept=women"
                    className="px-4 py-2 rounded-none bg-[#1a1b18] text-white text-xs md:text-sm font-bold hover:bg-black transition-all shadow-sm"
                  >
                    View Full Women&apos;s Catalog &rarr;
                  </Link>
                </div>
              </div>

              {/* Live Products Grid */}
              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
                  <div className="w-10 h-10 border-3 border-[#1a1b18] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium">Curating sacred weaves…</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {allProducts.slice(0, 8).map((product) => {
                    const isWishlisted = wishlist.some((w) => w.id === product.id);
                    return (
                      <div
                        key={product.id}
                        className="group flex flex-col bg-white rounded-[10px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex-1 justify-between"
                      >
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
                          <Link href={product.href || `/product/${product.id}`} className="block w-full h-full">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                              loading="lazy"
                            />
                          </Link>

                          {product.discount && (
                            <span className="absolute top-3 left-3 bg-[#d72c0d] text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px] shadow-sm">
                              {product.discount}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(product);
                            }}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          >
                            <span
                              className={`material-symbols-outlined text-[19px] ${
                                isWishlisted ? 'text-[#1a1b18]' : 'text-gray-400'
                              }`}
                            >
                              {isWishlisted ? 'favorite' : 'favorite_border'}
                            </span>
                          </button>

                          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              type="button"
                              onClick={() => {
                                setQuickViewProduct(product);
                                setQuickViewQty(1);
                              }}
                              className="w-full py-2 bg-black/85 hover:bg-black text-white text-xs font-bold rounded-none backdrop-blur-sm transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer uppercase tracking-wider"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                              Quick View
                            </button>
                          </div>
                        </div>

                        <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a1b18] bg-[#1a1b18]/10 px-2 py-0.5 rounded">
                                {product.category}
                              </span>
                              {product.rating && (
                                <div className="flex items-center gap-0.5 text-[#C5A04B]">
                                  <span className="material-symbols-outlined text-[14px]">star</span>
                                  <span className="text-[11px] font-bold text-gray-700">{product.rating}</span>
                                </div>
                              )}
                            </div>

                            <Link href={product.href || `/product/${product.id}`}>
                              <h3 className="font-sans text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-[#1a1b18] transition-colors min-h-[2.5rem]">
                                {product.title}
                              </h3>
                            </Link>

                            {product.telugu && (
                              <p className="text-[11px] text-gray-500 italic mt-0.5 truncate">
                                {product.telugu}
                              </p>
                            )}
                          </div>

                          <div>
                            {product.colors && product.colors.length > 0 && (
                              <div className="flex items-center gap-1.5 mb-2">
                                {product.colors.map((c, i) => (
                                  <span
                                    key={i}
                                    className="w-3.5 h-3.5 rounded-full border border-white shadow-sm ring-1 ring-gray-300"
                                    style={{ backgroundColor: c }}
                                  />
                                ))}
                                <span className="text-[10px] text-gray-400 font-medium ml-1">
                                  {product.colors.length} shades
                                </span>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                              <div>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-bold text-base md:text-lg text-gray-900">
                                    ₹{product.price.toLocaleString('en-IN')}
                                  </span>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-gray-400 line-through text-xs">
                                      ₹{product.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-[#144738] font-semibold block">
                                  {product.deliveryNote || 'Insured Delivery'}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAddToCart(product)}
                                className="px-3.5 py-2 bg-[#1a1b18] hover:bg-black text-white text-xs font-bold rounded-none shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0 uppercase tracking-wider"
                                title="Add to Cart"
                              >
                                <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                                <span>Add</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* 4. BRAND SACRED LEGACY & MASTER WEAVER CHRONICLE */}
          <section className="w-full py-16 px-4 md:px-8 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div className="aspect-[4/5] rounded-[10px] overflow-hidden shadow-lg border border-gray-200">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuASKYN3mUVs9w7xUvpByb84A9_RzJKNx3qVhJzKQE2WF6lpwzt0gGnD-W870MqN60aM1NZV1GB5Chy0a3oIL8fXklTLHZzzv6aMYnT05j72yiStquhuKJbdAjZp-pIW8z_1jqVARRRXzHMAR52VFBJFKsytZhJu3pQbpRYOvP3ok5NrgClxT-0z9Bzlh7JY1HeHodRGqHlE2f_PHCv-jRuTtqM39C4ME2e_e0VlM4lh_illP4L2Sg7n"
                        alt="Telugu master weaver at pit wooden loom"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5 bg-white rounded-[10px] shadow-sm border border-gray-100">
                      <span className="font-sans text-2xl font-bold text-[#1a1b18] block">75+ Years</span>
                      <p className="text-xs text-gray-600 mt-1">
                        Of unyielding devotion to authentic hand-crafted Telugu weaves.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-8">
                    <div className="p-5 bg-[#f8f9fa] rounded-[10px] border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-1.5 text-[#c5a04b] font-bold text-xs uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[16px]">history_edu</span>
                        <span>AUTHENTIC PROVENANCE</span>
                      </div>
                      <p className="font-sans text-xl font-bold text-gray-900 mt-1">3 Generations</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Adorning Telugu brides across Gudur, Palakurthy, Hyderabad &amp; Andhra Pradesh.
                      </p>
                    </div>
                    <div className="aspect-[4/5] rounded-[10px] overflow-hidden shadow-lg border border-gray-200">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuABg8ZRIlcNzUSJZALutdE9cSv3E78gRb-r7_1EsD-hRQDd0AQbmHs6YNUmwOOCAn_yi3_4wVGd_a22qUThRT3kwMzkbHIPNHJ0D8iNn_gY7n-iX1e7hz2BxcX-OronJYrsOP7wUjeDwTz3eKZMmpy-Q_a99C7xqpt7QiqqS_TkPrn1l0-1V4rAnbP5mZpdYiwvMwvV8WciVmMyWdLsNc4FwU6RP6NOfiIcplVT3cSVE24EHYcnTJRG"
                        alt="Gold zari spools and jacquard shuttles"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-3 right-4 hidden md:flex items-center gap-2.5 bg-[#352F2E] text-white px-5 py-2.5 rounded-full shadow-2xl border border-white/10">
                  <span className="material-symbols-outlined text-[#c5a04b] text-[20px]">auto_awesome</span>
                  <span className="text-xs font-semibold tracking-wide">Sacred Jeelakarra-Bellam Silks</span>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col gap-5">
                <div className="inline-flex items-center gap-2 text-[#c5a04b] text-xs font-bold uppercase tracking-widest">
                  <span className="w-6 h-[2px] bg-[#c5a04b] inline-block" />
                  <span>Our Sacred Legacy</span>
                </div>

                <h2 className="font-sans text-3xl md:text-5xl text-[#1a1b18] font-bold leading-tight">
                  Tradition That Becomes a Cherished Memory
                </h2>

                <div className="p-5 bg-[#f8f9fa] rounded-[10px] border border-gray-200">
                  <p className="font-sans text-2xl md:text-3xl text-[#1a1b18] italic font-semibold">
                    “మన సాంప్రదాయం, మన కళ్యాణం.”
                  </p>
                  <span className="text-xs text-[#c5a04b] font-bold uppercase tracking-widest block mt-1.5">
                    — The Sacred Oath of Purity &amp; Heritage
                  </span>
                </div>

                <p className="text-base text-gray-800 leading-relaxed font-sans">
                  At Kalyanam Shopping Mall, every saree tells the sacred tale of Telugu wedding heritage. From the auspicious dawn <strong className="text-[#1a1b18]">Mangala Snanam</strong> to the holy moments of <strong className="text-[#1a1b18]">Jeelakarra Bellam</strong> and <strong className="text-[#1a1b18]">Talambralu</strong>, our weaves have adorned over three generations of brides with timeless dignity, purity, and master-weaver craftsmanship.
                </p>

                <p className="text-sm text-gray-600 leading-relaxed">
                  We deal directly with traditional weaver households in Kanchipuram, Gadwal, Dharmavaram, Pochampally, and Varanasi, ensuring fair artisan livelihoods while safeguarding ancient handloom techniques with uncompromised certified pure gold and silver zari.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-200">
                  <div>
                    <span className="font-sans text-2xl md:text-3xl font-bold text-[#1a1b18]">100K+</span>
                    <span className="text-xs text-gray-500 block mt-0.5">Happy Telugu Brides</span>
                  </div>
                  <div>
                    <span className="font-sans text-2xl md:text-3xl font-bold text-[#1a1b18]">1,200+</span>
                    <span className="text-xs text-gray-500 block mt-0.5">Master Weavers</span>
                  </div>
                  <div>
                    <span className="font-sans text-2xl md:text-3xl font-bold text-[#1a1b18]">100%</span>
                    <span className="text-xs text-gray-500 block mt-0.5">Pure Silk Mark Certified</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#1a1b18] hover:text-[#1a1b18] group transition-colors"
                  >
                    <span>Read Our Complete Weaving Chronicle</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                      arrow_right_alt
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 5. VIRTUAL VIDEO SHOPPING CONCIERGE BANNER */}
          <section className="w-full py-12 md:py-16 px-4 md:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="relative rounded-3xl overflow-hidden bg-[#201A19] text-white shadow-2xl border border-white/10">
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAb2Q6teSg32k96_uxzYHd35pqEzLBjH5Vrjx2oz6GbZwFo1HQKH_GyDkgMNWE_0Dtpy9ljly2yHHpWzCjlG4yzyLhP81ZTIhOfvAXEhbBYgNro5bQarYTgQ55LPuZccuVCgmcexIRpFyP76_DyTA-Zhfuh7iZltpcR82oT1JYLBL90dr5s6bBZ7R_Ng8hM9F5gMceaxvZNGt_udcz42-9pEi_aibE8K1KVjNI0rj2sFfkA03rgZy1G')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#201A19] via-[#201A19]/90 to-[#201A19]/60" />

                <div className="relative z-10 p-6 sm:p-10 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 text-[#c5a04b] text-xs font-bold uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#c5a04b] animate-pulse" />
                      <span>Exclusive Bridal Concierge • Live From Flagship Showrooms</span>
                    </div>

                    <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl text-[#c5a04b] font-bold leading-tight">
                      Personalized 1-on-1 Virtual Video Shopping
                    </h2>

                    <p className="text-sm md:text-base text-gray-300 max-w-2xl leading-relaxed">
                      Living in the USA, UK, UAE, or anywhere worldwide? Experience the splendor of Kalyanam right from your home. Our master saree stylists will drape, display zari borders under daylight-balanced studio lighting, and assist your entire bridal entourage in real time.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#c5a04b] text-[18px]">schedule</span>
                        <span>45-Min Dedicated Slot</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#c5a04b] text-[18px]">verified</span>
                        <span>Real-Time Zari Purity Inspection</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#c5a04b] text-[18px]">public</span>
                        <span>Worldwide Express Delivery</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 items-start lg:items-end justify-center">
                    <button
                      type="button"
                      onClick={() => setIsConsultationModalOpen(true)}
                      className="w-full sm:w-auto lg:w-full px-6 py-4 rounded-none bg-[#c5a04b] text-[#1a1b18] font-bold text-sm md:text-base hover:bg-[#d8b564] shadow-xl hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span className="material-symbols-outlined text-[20px] text-[#1a1b18] group-hover:scale-110 transition-transform">
                        videocam
                      </span>
                      <span>Book Free Video Appointment</span>
                    </button>
                    <p className="text-xs text-gray-400 text-center w-full">
                      Available 7 days a week • 10:00 AM to 9:00 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. PHYSICAL TWIN SHOWROOMS IN TELANGANA */}
          <section className="w-full py-12 md:py-16 px-4 md:px-8 bg-[#f8f9fa] border-t border-gray-200">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              <div className="text-center max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-[#c5a04b] block mb-1">
                  Visit In Person
                </span>
                <h2 className="font-sans text-2xl md:text-4xl text-[#1a1b18] font-bold">
                  Our Grand Twin Showrooms in Telangana
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Experience grand multi-floor halls featuring certified handlooms, bridal couture, groom&apos;s studio, and festive kids&apos; collections.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {STORE_LOCATIONS.map((store, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-[10px] overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="text-[10px] bg-[#1a1b18] text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Flagship Location
                          </span>
                          <h3 className="font-sans text-xl font-bold text-gray-900 mt-2 leading-tight">
                            {store.name}
                          </h3>
                          <p className="text-xs text-[#c5a04b] font-semibold mt-0.5 italic">
                            {store.telugu}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-none bg-[#f8f9fa] flex items-center justify-center text-[#1a1b18] shrink-0">
                          <span className="material-symbols-outlined text-[24px]">storefront</span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 mt-2 flex items-start gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#1a1b18] shrink-0 mt-0.5">
                          location_on
                        </span>
                        <span>
                          {store.address} (Plus Code: <strong>{store.code}</strong>)
                        </span>
                      </p>

                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-gray-400 shrink-0">
                          schedule
                        </span>
                        <span>{store.hours}</span>
                      </p>

                      <p className="text-xs text-[#c5a04b] mt-3 font-semibold bg-[#c5a04b]/15 p-2 rounded-lg">
                        ✨ {store.highlight}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
                      <a
                        href={store.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-[#c5a04b] hover:bg-[#d8b564] text-[#1a1b18] font-bold text-xs rounded-none flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">directions</span>
                        Get Directions (Google Maps)
                      </a>
                      <a
                        href={`tel:${store.phone.replace(/\s/g, '')}`}
                        className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-none flex items-center justify-center gap-1.5 transition-colors border border-gray-200"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#1a1b18]">call</span>
                        Call Store
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 7. ARTISANAL PURITY & TRUST GUARANTEES */}
          <section className="w-full py-16 px-4 md:px-8 bg-[#f8f9fa] border-t border-gray-200">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-bold text-[#c5a04b] uppercase tracking-widest block mb-1">
                  Our Sacrosanct Promise
                </span>
                <h2 className="font-sans text-2xl md:text-4xl text-[#1a1b18] font-bold">
                  Artisanal Purity &amp; Trust Guarantees
                </h2>
                <div className="w-12 h-0.5 bg-[#c5a04b] mx-auto mt-2.5" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {TRUST_PILLARS.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-white rounded-[10px] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center gap-3 border border-gray-100"
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${p.color}`}>
                      <span className="material-symbols-outlined text-[28px]">{p.icon}</span>
                    </div>
                    <h3 className="font-sans text-lg font-bold text-gray-900">{p.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-sans">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          SHARED INTERACTIVE QUICK VIEW MODAL
         ══════════════════════════════════════════════════════════════════ */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className="bg-white rounded-[10px] max-w-2xl w-full overflow-hidden shadow-2xl relative border border-gray-200 flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:w-1/2 relative bg-gray-100 aspect-[3/4] md:aspect-auto">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.title}
                className="w-full h-full object-cover"
              />
              {quickViewProduct.discount && (
                <span className="absolute top-3 left-3 bg-[#d72c0d] text-white text-xs font-bold px-2 py-0.5 rounded-[2px] shadow-md">
                  {quickViewProduct.discount}
                </span>
              )}
            </div>

            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a1b18] bg-[#1a1b18]/10 px-2.5 py-0.5 rounded-full">
                    {quickViewProduct.category}
                  </span>
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <h3 className="font-sans text-lg font-bold text-gray-900 leading-snug">
                  {quickViewProduct.title}
                </h3>

                {quickViewProduct.telugu && (
                  <p className="text-xs text-[#c5a04b] font-semibold italic mt-0.5">
                    {quickViewProduct.telugu}
                  </p>
                )}

                <div className="flex items-baseline gap-2 mt-3">
                  <span className="font-bold text-2xl text-[#1a1b18]">
                    ₹{quickViewProduct.price.toLocaleString('en-IN')}
                  </span>
                  {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="text-gray-400 line-through text-sm">
                      ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#144738] font-semibold mt-1">
                  ✓ {quickViewProduct.deliveryNote || '100% Pure Mulberry Silk Mark Certified'}
                </p>

                {quickViewProduct.colors && (
                  <div className="mt-4">
                    <span className="text-xs font-bold text-gray-700 block mb-1.5">
                      Available Shades:
                    </span>
                    <div className="flex items-center gap-2">
                      {quickViewProduct.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-5 h-5 rounded-full border-2 border-white ring-1 ring-gray-400 shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setQuickViewQty(Math.max(1, quickViewQty - 1))}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded-l-lg text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-gray-800">{quickViewQty}</span>
                    <button
                      type="button"
                      onClick={() => setQuickViewQty(quickViewQty + 1)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded-r-lg text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleAddToCart(quickViewProduct, quickViewQty)}
                  className="w-full py-3 bg-[#1a1b18] hover:bg-black text-white font-bold text-sm rounded-none shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  <span>Add to Cart (₹{(quickViewProduct.price * quickViewQty).toLocaleString('en-IN')})</span>
                </button>

                <Link
                  href={quickViewProduct.href || `/product/${quickViewProduct.id}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="text-center text-xs font-bold text-[#c5a04b] hover:underline py-1"
                >
                  View Complete Details &amp; Weave Specifications &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="pt-[116px] min-h-screen bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-[#1a1b18] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
