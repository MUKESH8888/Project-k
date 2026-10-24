'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../components/CartContext';

export default function SareesPage() {
  const { addToCart, toggleWishlist, wishlist, setIsConsultationModalOpen } = useCart();
  const [gridCols, setGridCols] = useState(4); // 3 or 4
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState(['Kanchipuram Pattu']);
  const [selectedZaris, setSelectedZaris] = useState(['Tested Pure Gold Zari']);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedColor, setSelectedColor] = useState(null);

  const rawProducts = [
    {
      id: 1,
      category: 'Kanchipuram Pattu',
      zariType: 'Tested Pure Gold Zari',
      title: 'Swarna Kanchi Pure Silk Saree - Sindhoori Vermilion Red with Korvai Gold Border',
      telugu: 'సిందూర ఎరుపు కంచి పట్టు చీర',
      href: '/product/swarna-kanchi-pure-silk-saree',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC1emaGVTIB7QiE5dusOWDoxX2Kwh8lqssDlBdioL3Z68INfyngpdE-Kuj9W6mTp26imZYQznadJt1bndiTRpaTLZT3mVj-dKj1AOQXQUqXoh8DsAWzPZjXijVQ5DOPyj63W6I6ON2ieyT0jYWTLRERd-X0EyCWfW8CL7iTepLzwcHnUMeXbnFUkhfXJbE-KHD0N_npQfDAy_PdS14HCD9TSkn4N502O_pCbjTaWKczL1NOVqtqjY-6',
      price: 42500,
      originalPrice: 50000,
      discount: '15% OFF',
      silkMark: true,
      pureZari: true,
      colorHex: '#8E1624',
      colorName: 'Vermilion Red',
      colors: ['#8E1624', '#520B16', '#D49E35'],
      deliveryNote: 'Free Insured Delivery',
    },
    {
      id: 2,
      category: 'Kanchipuram Pattu',
      zariType: 'Pure Silver Electroplated',
      title: 'Rani Pink Royal Bridal Brocade Kanchipuram Pattu with Peacocks & Floral Zari',
      telugu: 'రాణీ గులాబీ రాయల్ పెళ్లి పట్టు',
      href: '/product/swarna-kanchi-pure-silk-saree',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDZintyKDl-VguA5qsKX48HCNP7e_MPxmR00twJfbbR6Lg1nnDtjdr4DKdJTKYI41VvZGwfll2SoevaijVedY4ZdvXGZ45j2Oilmi_NFJ49c-dy7_bRgd0iCKfP8M6zxDqKU1TVK4eOVvk0eMx0WWhfrt5eqWC6TDi66Irwn9ILkkUvWeMdY4KkNelnxVR6hqt5Is52aI669PQ2Ml7yiNd18AdTJdlhUtL4kbLYG3DpmQIJP-w6Hf-z',
      price: 58000,
      originalPrice: 62000,
      discount: null,
      silkMark: true,
      pureZari: true,
      colorHex: '#B81D52',
      colorName: 'Rani Pink',
      colors: ['#B81D52', '#751E2B'],
      deliveryNote: 'Tested Silver Zari',
    },
    {
      id: 3,
      category: 'Gadwal Handloom',
      zariType: 'Tested Pure Gold Zari',
      title: 'Mayilkan Green & Mustard Yellow Dual Tone Handloom Gadwal Saree',
      telugu: 'మయిల్ కణ్ ఆకుపచ్చ గద్వాల పట్టు',
      href: '/product/swarna-kanchi-pure-silk-saree',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDN0r9MehqHsFPY4bZzYLYKfGU_stMf_JCllxQnbDiuxDplIHlrvZvnVi9Mo6tR4D9X700MCt2g1kP2jThEvN4dXWyFmypzBFOUw1tBslJFGXBxPBPN5tw_lrfXNKs9yLY2J1U-Ko2u1JIs2v1fVCymmRgwgc_JWCD8hyix-ImoitncJ_kTdSGE_-Pla6QHXav_-TyzDVrl5kEhJJOjuGFran3wN5sOLhq84FTMH3SD2G-zy7VU3Vwx',
      price: 24900,
      originalPrice: 28000,
      discount: '11% OFF',
      handloomMark: true,
      colorHex: '#18483B',
      colorName: 'Mayilkan Green',
      colors: ['#18483B', '#D19B27'],
      deliveryNote: 'Silk Mark Certified',
    },
    {
      id: 4,
      category: 'Banarasi Katan',
      zariType: 'Tested Pure Gold Zari',
      title: 'Padma Banarasi Katan Silk Saree in Midnight Royal Blue & Pure Gold Jaal',
      telugu: 'రాయల్ బ్లూ బనారసి కతాన్ పట్టు',
      href: '/product/swarna-kanchi-pure-silk-saree',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuACfyIdaUK4TQNg52-1_Tk9jay-zIYLzL11hkBIWa6VNHRV-3MxA9uu9abIxacf5Vsqh6Sn6J0JOOKPrBpcJgFTqxUGUA7KEwbkmQWbis2vfihdP9IEVJhr_rKvDZFfX6klncVvVMI81dXbn55nJoh6-TkUiHIvJnby7RRli55x99YC5fCgB0yc70pMdavOa8E_Qsn_pC6SMuljtKVKhyqdjfjN9GaxNwKDeeFLGzsl74UvUdBgYQFU',
      price: 36500,
      originalPrice: 40000,
      discount: null,
      silkMark: true,
      pureZari: true,
      colorHex: '#102347',
      colorName: 'Royal Sapphire Blue',
      colors: ['#102347', '#3B1238', '#143E32'],
      deliveryNote: 'Complimentary Kuchu',
    },
    {
      id: 5,
      category: 'Kanchipuram Pattu',
      zariType: 'Tested Pure Gold Zari',
      title: 'Kalyanam Royal Korvai Saree - Turmeric Mustard & Magenta Contrast Border',
      telugu: 'పసుపు పచ్చ కాంచీపురం పట్టు చీర',
      href: '/product/swarna-kanchi-pure-silk-saree',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC4D_kKb1RQDVeLQ-8Sfw2e5pkoPacsUQl8q1CUCarJ3ODFj002Dv0thz-P02GLqW-LNEV3sXWDq99E_gC832Eek0IKjf5yzjvvwVN8xbC_ydZDqD9HcuqKd5Dd5XxiEG13CKJUI0Ydnq97p7w0-_svsPCDF1AOeTFcLh7Dj52y5ujGPW6CTx1qBEpZGk3yL5xf5lvB2TVidN09WfHCcPp68yl69BUWOdgyaBZqOqTTEdOhJ6X_-BN-',
      price: 46000,
      originalPrice: 52000,
      discount: '12% OFF',
      silkMark: true,
      pureZari: true,
      colorHex: '#D49E35',
      colorName: 'Temple Gold',
      colors: ['#D49E35', '#B81D52'],
      deliveryNote: 'Tested Gold Zari',
    },
    {
      id: 6,
      category: 'Uppada Jamdani',
      zariType: 'Half Fine Zari',
      title: 'Uppada Jamdani Fine Handloom Silk Saree - Temple Ivory with Ganga Jamuna Zari',
      telugu: 'ఉప్పాడ జామ్‌దానీ పట్టు చీర',
      href: '/product/swarna-kanchi-pure-silk-saree',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDQJE_obURIAOjvPU02l3Cs_zbiGKBzqC5kheF9nFLS7wtnswCk1CAaI41byzWszGzEaYrKbITJ5LuCK_2gJDFoXWnz-i83KulPBbw7aBxj3311kK8_a9RzqRJtrFtN1VKykwnICKOsfWlhnqXgWQ3xmBfWdQFnByOAPu3lFUK8-d79ICvqx8xk9HvfUFu-L4j6VrXilMqoQje8KxDSyPZyoynL3N8G4bEZ2ZsHqwSH76eAI79E9Blg',
      price: 29500,
      originalPrice: 34000,
      discount: null,
      handloomMark: true,
      colorHex: '#F5EBE1',
      colorName: 'Ivory Temple',
      colors: ['#F5EBE1', '#D49E35'],
      deliveryNote: 'GI Tag Certified',
    },
    {
      id: 7,
      category: 'Kanchipuram Pattu',
      zariType: 'Tested Pure Gold Zari',
      title: 'Dharmavaram Heavy Bridal Pattu - Crimson Body with Grand Twin Peacock Pallu',
      telugu: 'ధర్మవరం రాయల్ పెళ్లి పట్టు',
      href: '/product/swarna-kanchi-pure-silk-saree',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD1us0VeC6zKYfvsAQbFe6Qb5MBeM9RvG1c3leQKrY3b0lO2DcKvQlaPBQu01vPSzXEpWBKU3Qs18qk7qYbNoSJWzqKuMES0hIslxytSRyrMaIgZ8Rck2jYkyXpLu3W8tInhJdKdMNiCauInWYH5pGCKfdll-_wmQQNghQx-ovJCOxcG9-pInsV1vhiqyEy7FKJ9kdArb9hoUVqtktl9Jb_oaAuqmVrJhoe8mIADr9agfNMl-noj6by',
      price: 52000,
      originalPrice: 58000,
      discount: '10% OFF',
      silkMark: true,
      pureZari: true,
      colorHex: '#801020',
      colorName: 'Deep Wine',
      colors: ['#801020', '#D49E35'],
      deliveryNote: 'Free Insured Delivery',
    },
    {
      id: 8,
      category: 'Pochampally Ikat',
      zariType: 'Metallic Copper Zari',
      title: 'Pochampally Double Ikat Silk Saree - Geometric Chevron Heritage Diamonds',
      telugu: 'పోచంపల్లి ఇక్కత్ పట్టు చీర',
      href: '/product/swarna-kanchi-pure-silk-saree',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuATTe6A-9Knp98SsDGSAFhFEZcQUGHR2raWqjxGlom9xJxT8uN_CBGIg9OwLkbuRNZAQzwp9VhGndsN_FOE-b-WUEVnt7L_kMOfkAzIHVd3M6kUXJEVB-3XxMicQ1XYy9BbZ9w0VGKT4MszGTR_tDu0xGeuZ7fc7DWBbB9mouJyJ1dXZ50v_49cCoje7OHXbMSC97IVOPiITkyMy21_LNnob6kWj4l2YIN77nKeJbUtD8DA3TjPiTjZ',
      price: 19800,
      originalPrice: 22500,
      discount: null,
      handloomMark: true,
      colorHex: '#D49E35',
      colorName: 'Temple Gold',
      colors: ['#D49E35', '#961224'],
      deliveryNote: 'Telangana Handloom',
    },
  ];

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = rawProducts.filter((product) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      if (selectedZaris.length > 0 && !selectedZaris.includes(product.zariType)) {
        return false;
      }
      if (selectedPriceRange === 'under-20') return product.price < 20000;
      if (selectedPriceRange === '20-40') return product.price >= 20000 && product.price <= 40000;
      if (selectedPriceRange === '40-75') return product.price > 40000 && product.price <= 75000;
      if (selectedPriceRange === 'above-75') return product.price > 75000;
      if (selectedColor && product.colorName !== selectedColor) return false;
      return true;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    }
    return result;
  }, [selectedCategories, selectedZaris, selectedPriceRange, selectedColor, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedZaris([]);
    setSelectedPriceRange('all');
    setSelectedColor(null);
  };

  return (
    <>
      <Header />

      <main className="w-full pt-[116px] bg-background min-h-screen">
        <div className="flex flex-col w-full">
          {/* ============================================================
              TOP EDITORIAL HEADER & BREADCRUMB RIBBON
             ============================================================ */}
          <section className="w-full bg-surface-container-low/70 py-space-lg px-margin">
            <div className="max-w-7xl mx-auto flex flex-col gap-space-md">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center flex-wrap gap-2 text-label-sm font-label-sm text-on-surface-variant">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Home</span>
                </Link>
                <span className="opacity-40">/</span>
                <Link className="hover:text-primary transition-colors" href="/sarees">
                  Sarees
                </Link>
                <span className="opacity-40">/</span>
                <span className="text-primary font-semibold">
                  Kanchipuram Sarees (కాంచీపురం పట్టు చీరలు)
                </span>
              </nav>

              {/* Clean Page Header */}
              <div className="py-4">
                <h1 className="text-2xl md:text-3xl font-bold text-[#0B0B0B]">Pattu Silk Sarees</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Authentic handwoven silk sarees — Kanchipuram, Banarasi, Gadwal, Pochampally &amp; more
                </p>
              </div>
            </div>
          </section>

          {/* ============================================================
              INTERACTIVE CONTROLS BAR: Filter Toggle, Count, Sort, Grid
             ============================================================ */}
          <section className="w-full bg-surface-container-lowest shadow-sm sticky top-[148px] z-30 px-margin py-3 border-y border-surface-container">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-md">
                <button
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-label-sm font-label-sm font-semibold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Filters</span>
                </button>
                <span className="font-label-md text-label-md text-on-surface-variant hidden sm:inline">
                  Showing <span className="font-semibold text-on-surface">1 - {filteredProducts.length}</span> of 128 Heirlooms
                </span>
              </div>

              <div className="flex items-center gap-space-md ml-auto">
                {/* View Columns Toggles */}
                <div className="hidden md:flex items-center bg-surface-container p-0.5 rounded-lg">
                  <button
                    onClick={() => setGridCols(3)}
                    className={`px-2.5 py-1 rounded-md text-label-sm font-label-sm flex items-center gap-1 transition-all cursor-pointer ${
                      gridCols === 3
                        ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">view_column</span>
                    <span className="hidden lg:inline">3 Cols</span>
                  </button>
                  <button
                    onClick={() => setGridCols(4)}
                    className={`px-2.5 py-1 rounded-md text-label-sm font-label-sm flex items-center gap-1 transition-all cursor-pointer ${
                      gridCols === 4
                        ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">grid_view</span>
                    <span className="hidden lg:inline">4 Cols</span>
                  </button>
                </div>

                {/* Sorting Selector */}
                <div className="flex items-center gap-2">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant hidden sm:inline"
                    htmlFor="sortSelect"
                  >
                    Sort By:
                  </label>
                  <div className="relative">
                    <select
                      id="sortSelect"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-surface-container-low text-on-surface font-title-sm text-label-sm font-medium py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:bg-surface-container cursor-pointer border border-surface-dim/30"
                    >
                      <option value="featured">Featured Curations</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest Muhurtham Arrivals</option>
                      <option value="rating">Customer Rating &amp; Reviews</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-2 pointer-events-none text-on-surface-variant text-[18px]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================
              MAIN CONTENT STAGE: Sidebar Filters + Products Canvas
             ============================================================ */}
          <div className="w-full max-w-7xl mx-auto px-margin py-space-xl flex flex-col lg:flex-row gap-gutter items-start">
            {/* Sticky Filters Sidebar */}
            <aside
              className={`w-full lg:w-[280px] shrink-0 bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-lg lg:sticky lg:top-[220px] ${
                mobileFilterOpen ? 'block' : 'hidden lg:flex'
              }`}
            >
              {/* Filter Header with Reset */}
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px] text-primary">
                    filter_list
                  </span>
                  <span className="font-headline-sm text-headline-sm text-primary font-bold">
                    Refine Weaves
                  </span>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors font-semibold cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {/* Active Filter Chips */}
              <div className="flex flex-wrap gap-1.5">
                {selectedCategories.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-on-surface text-label-sm font-label-sm"
                  >
                    {c}
                    <button
                      onClick={() =>
                        setSelectedCategories(selectedCategories.filter((item) => item !== c))
                      }
                      className="material-symbols-outlined text-[14px] hover:text-primary leading-none cursor-pointer"
                    >
                      close
                    </button>
                  </span>
                ))}
                {selectedZaris.map((z, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-on-surface text-label-sm font-label-sm"
                  >
                    {z}
                    <button
                      onClick={() =>
                        setSelectedZaris(selectedZaris.filter((item) => item !== z))
                      }
                      className="material-symbols-outlined text-[14px] hover:text-primary leading-none cursor-pointer"
                    >
                      close
                    </button>
                  </span>
                ))}
              </div>

              {/* Filter Section 1: Saree Category / Weave */}
              <div className="flex flex-col gap-2 pt-space-xs">
                <div className="font-title-lg text-title-md text-on-surface font-semibold py-1">
                  Saree Category / Weave
                </div>
                <div className="flex flex-col gap-2 pt-1 font-body-sm text-body-sm text-on-surface-variant">
                  {[
                    { label: 'Kanchipuram Pattu', count: 128 },
                    { label: 'Banarasi Katan', count: 64 },
                    { label: 'Gadwal Handloom', count: 42 },
                    { label: 'Pochampally Ikat', count: 35 },
                    { label: 'Uppada Jamdani', count: 18 },
                  ].map((cat, idx) => (
                    <label key={idx} className="flex items-center justify-between cursor-pointer group">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.label)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategories([...selectedCategories, cat.label]);
                            } else {
                              setSelectedCategories(
                                selectedCategories.filter((item) => item !== cat.label)
                              );
                            }
                          }}
                          className="accent-primary rounded h-4 w-4"
                        />
                        <span className="group-hover:text-primary transition-colors">
                          {cat.label}
                        </span>
                      </span>
                      <span className="text-label-sm font-label-sm opacity-60">
                        {cat.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Section 2: Pure Zari Type */}
              <div className="flex flex-col gap-2 pt-space-xs border-t border-surface-container pt-3">
                <div className="font-title-lg text-title-md text-on-surface font-semibold py-1">
                  Pure Zari Authenticity
                </div>
                <div className="flex flex-col gap-2 pt-1 font-body-sm text-body-sm text-on-surface-variant">
                  {[
                    'Tested Pure Gold Zari',
                    'Pure Silver Electroplated',
                    'Half Fine Zari',
                    'Metallic Copper Zari',
                  ].map((zari, idx) => (
                    <label key={idx} className="flex items-center justify-between cursor-pointer group">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedZaris.includes(zari)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedZaris([...selectedZaris, zari]);
                            } else {
                              setSelectedZaris(selectedZaris.filter((item) => item !== zari));
                            }
                          }}
                          className="accent-primary rounded h-4 w-4"
                        />
                        <span className="group-hover:text-primary transition-colors">
                          {zari}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Section 3: Price Range */}
              <div className="flex flex-col gap-2 pt-space-xs border-t border-surface-container pt-3">
                <div className="font-title-lg text-title-md text-on-surface font-semibold py-1">
                  Price Budget
                </div>
                <div className="flex flex-col gap-2 pt-1 font-body-sm text-body-sm text-on-surface-variant">
                  {[
                    { id: 'all', label: 'All Budgets' },
                    { id: 'under-20', label: 'Under ₹20,000' },
                    { id: '20-40', label: '₹20,000 - ₹40,000' },
                    { id: '40-75', label: '₹40,000 - ₹75,000' },
                    { id: 'above-75', label: 'Above ₹75,000 (Royal Heirloom)' },
                  ].map((item) => (
                    <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="priceFilter"
                        checked={selectedPriceRange === item.id}
                        onChange={() => setSelectedPriceRange(item.id)}
                        className="accent-primary"
                      />
                      <span className="group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter Section 4: Ceremonial Color Swatches */}
              <div className="flex flex-col gap-2 pt-space-xs border-t border-surface-container pt-3">
                <div className="font-title-lg text-title-md text-on-surface font-semibold py-1">
                  Ceremonial Color
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { name: 'Vermilion Red', hex: '#8E1624' },
                    { name: 'Rani Pink', hex: '#B81D52' },
                    { name: 'Temple Gold', hex: '#D49E35' },
                    { name: 'Mayilkan Green', hex: '#18483B' },
                    { name: 'Royal Sapphire Blue', hex: '#102347' },
                    { name: 'Deep Wine', hex: '#801020' },
                  ].map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setSelectedColor(selectedColor === color.name ? null : color.name)
                      }
                      title={color.name}
                      className={`w-7 h-7 rounded-full cursor-pointer hover:scale-110 transition-transform ${
                        selectedColor === color.name
                          ? 'ring-2 ring-primary ring-offset-2'
                          : 'ring-1 ring-surface-dim'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Canvas */}
            <div className="flex-1 flex flex-col gap-space-lg w-full">
              {filteredProducts.length === 0 ? (
                <div className="p-12 bg-surface-container-lowest rounded-xl text-center flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-[48px] text-secondary">
                    filter_alt_off
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-primary">
                    No sarees match your selected filters
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                    Try clearing some filters or browse all our royal handlooms.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-title-sm text-title-sm cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div
                  className={`grid gap-gutter ${
                    gridCols === 3
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                  }`}
                >
                  {filteredProducts.map((product) => {
                    const isWishlisted = wishlist.includes(product.id);

                    return (
                      <div
                        key={product.id}
                        className="group flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-container">
                          <Link href={product.href} className="block w-full h-full">
                            <div
                              className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                              style={{ backgroundImage: `url('${product.image}')` }}
                            />
                          </Link>

                          <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
                            {product.discount && (
                              <span className="bg-[#751E2B] text-white font-label-sm text-label-sm px-2 py-0.5 rounded shadow-sm">
                                {product.discount}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer ${
                              isWishlisted
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-lowest/80 text-on-surface hover:text-primary'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              favorite
                            </span>
                          </button>

                          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                            <button
                              onClick={() => setQuickViewProduct(product)}
                              className="flex-1 py-2 rounded-lg bg-inverse-surface/90 text-inverse-on-surface text-label-sm font-label-sm backdrop-blur-sm hover:bg-inverse-surface transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                visibility
                              </span>{' '}
                              Quick View
                            </button>
                          </div>
                        </div>

                        <div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm bg-surface-container-lowest">
                          <div>
                            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block">
                              {product.category}
                            </span>
                            <Link href={product.href}>
                              <h3 className="font-title-md text-title-md text-on-surface line-clamp-2 mt-1 group-hover:text-primary transition-colors">
                                {product.title}
                              </h3>
                            </Link>
                            <p className="font-label-sm text-label-sm text-on-surface-variant italic mt-1">
                              {product.telugu}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 pt-1">
                            <div className="flex items-center gap-1.5">
                              {product.colors.map((c, i) => (
                                <span
                                  key={i}
                                  className={`w-3.5 h-3.5 rounded-full cursor-pointer hover:scale-110 transition-transform ${
                                    i === 0 ? 'ring-2 ring-primary ring-offset-1' : ''
                                  }`}
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                              <span className="text-[11px] text-on-surface-variant ml-1 font-label-sm">
                                {product.colorName}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <div className="flex flex-col">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-title-lg text-title-lg text-primary font-bold">
                                    ₹{product.price.toLocaleString('en-IN')}
                                  </span>
                                  {product.originalPrice > product.price && (
                                    <span className="font-body-sm text-body-sm text-on-surface-variant line-through">
                                      ₹{product.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-tertiary-container font-semibold">
                                  {product.deliveryNote}
                                </span>
                              </div>

                              <button
                                onClick={() => addToCart(product)}
                                className="px-3 py-2 rounded-lg bg-primary-container text-on-primary hover:bg-surface-tint font-label-sm text-label-sm flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[16px]">
                                  shopping_bag
                                </span>{' '}
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination Bar */}
              <div className="mt-4 flex items-center justify-between bg-surface-container-lowest p-4 rounded-xl shadow-sm">
                <span className="text-body-sm font-body-sm text-on-surface-variant">
                  Showing 1 - {filteredProducts.length} of 128 Handwoven Silks
                </span>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-body-sm">
                    1
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-body-sm">
                    2
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-body-sm">
                    3
                  </button>
                  <button className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-body-sm flex items-center gap-1">
                    <span>Next</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Bottom Consultation Prompt */}
              <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col md:flex-row items-center justify-between gap-space-md border border-secondary-fixed/30">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                    <span className="material-symbols-outlined text-[24px]">videocam</span>
                  </div>
                  <div>
                    <h3 className="font-title-lg text-title-lg font-bold text-primary">
                      Cannot decide on the right Muhurtham weave?
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Schedule a live video walkthrough with our senior saree stylists from Jubilee Hills.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-title-sm text-title-sm font-semibold hover:bg-secondary-fixed-dim transition-colors shrink-0 cursor-pointer"
                >
                  Book Free Video Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative flex flex-col md:flex-row gap-6 border border-secondary-fixed/30 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer z-10"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="w-full md:w-1/2 aspect-[2/3] rounded-xl overflow-hidden bg-surface-container relative">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${quickViewProduct.image}')` }}
              />
              <span className="absolute top-3 left-3 bg-tertiary-container text-on-tertiary font-label-sm text-label-sm px-2.5 py-1 rounded shadow-sm">
                Silk Mark Certified
              </span>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between gap-4">
              <div>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider block">
                  {quickViewProduct.category}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 font-bold">
                  {quickViewProduct.title}
                </h3>
                <p className="font-body-sm text-body-sm text-primary italic font-medium mt-1">
                  {quickViewProduct.telugu}
                </p>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="font-display-md text-headline-lg text-primary font-bold">
                    ₹{quickViewProduct.price.toLocaleString('en-IN')}
                  </span>
                  {quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="font-body-sm text-body-sm text-on-surface-variant line-through">
                      ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                  Handcrafted with pure mulberry silk yarn and interlocking Korvai borders. Includes complimentary Fall, Pico, and hand-twisted Kuchu.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-3 rounded-lg bg-primary-container text-on-primary font-title-md text-title-md font-semibold hover:bg-surface-tint shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    shopping_bag
                  </span>
                  <span>Add to Bridal Bag</span>
                </button>
                <Link
                  href={quickViewProduct.href}
                  onClick={() => setQuickViewProduct(null)}
                  className="w-full py-2.5 rounded-lg bg-surface-container text-on-surface text-center font-label-md text-label-md hover:bg-surface-container-high transition-colors"
                >
                  View Full Drape &amp; Weave Details
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
