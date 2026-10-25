'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

const NAV_LINKS = [
  { label: 'Women', telugu: 'మహిళలు', dept: 'women', href: '/?dept=women' },
  { label: 'Sarees', telugu: 'పట్టు చీరలు', href: '/sarees' },
  { label: 'Men', telugu: 'పురుషులు', dept: 'men', href: '/?dept=men' },
  { label: 'Kids', telugu: 'పిల్లల పట్టు', dept: 'kids', href: '/?dept=kids' },
  { label: 'Stores', telugu: 'షోరూమ్స్', href: '/stores' },
  { label: 'Heritage', telugu: 'మా కథ', href: '/about' },
  { label: 'Contact', telugu: 'సంప్రదించండి', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartCount, cartTotal, wishlistCount, setIsConsultationModalOpen } = useCart();
  const { user, isAdmin, logout, openLogin } = useAuth();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollY.current;

      setIsScrolled(currentScrollY > 30);

      // When near the top, always keep navbar visible
      if (currentScrollY <= 60) {
        setIsVisible(true);
      } else if (currentScrollY > prevScrollY && currentScrollY > 90) {
        // Scrolling DOWN -> Nav bar goes up (slides offscreen)
        setIsVisible(false);
      } else if (currentScrollY < prevScrollY - 4) {
        // Scrolling UP -> Nav bar comes down
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer and ensure navbar is visible on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsVisible(true);
  }, [pathname, searchParams]);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setLiveResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setLiveResults((data.products || []).slice(0, 5));
          setShowSuggestions(true);
        }
      } catch (e) {
        // Fallback silently
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = async () => {
    await logout();
    setProfileDropdown(false);
    router.push('/');
  };

  const doSearch = (q) => {
    const query = (q || searchQuery).trim();
    setShowSuggestions(false);
    router.push(query ? `/?search=${encodeURIComponent(query)}` : '/');
  };

  const currentDept = searchParams.get('dept') || '';
  const isActive = (href) =>
    pathname === href || (href.includes('dept=') && currentDept === href.split('dept=')[1]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible || mobileMenuOpen || showSuggestions
          ? 'translate-y-0'
          : '-translate-y-full'
      }`}
    >
      {/* 1. Top Luxury Auspicious Bar */}
      <div className="bg-[#181716] text-[#FAF3EA] text-[11px] border-b border-[#332E27] tracking-wider py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="text-gold font-bold">శ్రీరస్తు •</span>
            <span className="text-[#DFD7CD] hidden sm:inline">100% Pure Silk Mark Certified Handlooms</span>
            <span className="text-gold/60 mx-1 hidden sm:inline">•</span>
            <span className="text-cream/90">Free Insured Transit Across India</span>
            <span className="text-gold/60 mx-1 hidden md:inline">•</span>
            <span className="text-gold hidden md:inline font-medium">Worldwide Shipping to USA, UK & UAE</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] shrink-0 font-medium">
            <Link
              href="/stores"
              className="text-cream/80 hover:text-gold transition-colors hidden sm:flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px] text-gold">storefront</span>
              <span>Gudur & Palakurthy Stores</span>
            </Link>
            <a
              href="https://wa.me/919849012345?text=Hello%20Kalyanam%20Mall,%20I%20would%20like%20to%20inquire%20about%20bridal%20sarees"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:text-gold-light transition-colors flex items-center gap-1 font-semibold"
            >
              <span className="material-symbols-outlined text-[14px]">chat</span>
              <span>WhatsApp Concierge</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Brand & Actions Bar */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-[#EAE5DC] py-2.5'
            : 'bg-white border-b border-[#EAE5DC]/60 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-charcoal hover:text-burgundy rounded-lg"
              aria-label="Open Navigation Menu"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>

            {/* Brand Identity / Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative h-11 w-auto flex items-center">
                <img
                  src="/images/logo.png"
                  alt="Kalyanam Shopping Mall"
                  className="h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
                />
              </div>
              <div className="hidden sm:flex flex-col border-l border-[#C5A04B]/30 pl-3">
                <span className="font-heading text-lg md:text-xl font-extrabold text-[#7A1426] tracking-tight leading-none">
                  కళ్యాణం
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A04B] font-semibold mt-0.5">
                  Shopping Mall
                </span>
              </div>
            </Link>

            {/* Instant Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  doSearch(searchQuery);
                }}
                className="relative w-full"
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (liveResults.length > 0) setShowSuggestions(true);
                  }}
                  placeholder="Search Kanchipuram, Banarasi, Pattu Panche, Lehengas..."
                  className="w-full bg-[#FAF7F2] text-charcoal text-sm pl-10 pr-10 py-2.5 rounded-full border border-[#DFD8CC] focus:border-[#C5A04B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A04B]/20 transition-all placeholder:text-[#88837A]"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold material-symbols-outlined text-[19px]">
                  search
                </span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setLiveResults([]);
                      setShowSuggestions(false);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#88837A] hover:text-charcoal"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}

                {/* Suggestions Dropdown */}
                {showSuggestions && liveResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EAE5DC] shadow-2xl rounded-2xl z-50 overflow-hidden divide-y divide-[#F2ECE1]">
                    <div className="px-4 py-2 bg-[#FAF7F2] text-[11px] font-semibold text-[#7A1426] uppercase tracking-wider flex items-center justify-between">
                      <span>Curated Silk Suggestions</span>
                      <span className="text-muted text-[10px]">{liveResults.length} matches</span>
                    </div>
                    {liveResults.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          router.push(p.href || `/product/${p.id}`);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-[#FFFBF7] transition-colors flex items-center gap-3 group"
                      >
                        <img
                          src={p.image || '/images/products/kanchipuram-pattu.jpg'}
                          alt={p.title}
                          className="w-11 h-11 object-cover rounded-lg border border-[#EAE5DC]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-charcoal truncate group-hover:text-burgundy">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-[#C5A04B] font-medium">
                            {p.telugu && <span className="mr-2 text-charcoal/70">{p.telugu}</span>}
                            {p.price && '₹' + Number(p.price).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-[#C5A04B] opacity-0 group-hover:opacity-100 transition-opacity">
                          chevron_right
                        </span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => doSearch(searchQuery)}
                      className="w-full text-center py-2.5 text-xs font-semibold text-burgundy hover:bg-[#FAF7F2] transition-colors"
                    >
                      View all results for &ldquo;{searchQuery}&rdquo; →
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* VIP Video Consultation CTA */}
              <button
                onClick={() => setIsConsultationModalOpen(true)}
                className="hidden xl:inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#C5A04B]/50 bg-gradient-to-r from-[#FFFBF7] to-[#FAF3EA] text-[#7A1426] hover:border-[#7A1426] transition-all shadow-sm hover:shadow"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-burgundy"></span>
                </span>
                <span className="material-symbols-outlined text-gold text-[18px]">videocam</span>
                <span className="text-xs font-bold uppercase tracking-wider">Video Shopping</span>
              </button>

              {/* Wishlist Button */}
              <Link
                href="/sarees"
                className="relative p-2.5 text-charcoal hover:text-burgundy rounded-full hover:bg-[#FAF7F2] transition-colors"
                title="Sacred Wedding Wishlist"
              >
                <span className="material-symbols-outlined text-[22px]">favorite</span>
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-burgundy text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag / Cart */}
              <Link
                href="/cart"
                className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-[#FAF3EA] border border-[#DFC587]/60 text-charcoal hover:bg-[#F5ECD9] transition-all"
                title="Sacred Bridal Bag"
              >
                <div className="relative">
                  <span className="material-symbols-outlined text-[22px] text-burgundy">shopping_bag</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-burgundy text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                {cartTotal > 0 && (
                  <span className="text-xs font-bold text-burgundy hidden sm:inline">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-full border border-[#C5A04B]/40 hover:border-burgundy bg-[#FAF7F2] transition-all"
                  >
                    <span className="w-8 h-8 rounded-full bg-burgundy text-gold font-bold flex items-center justify-center text-xs shadow-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </button>
                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-[#EAE5DC] shadow-2xl rounded-2xl z-50 py-2 divide-y divide-[#F2ECE1]">
                      <div className="px-4 py-2.5">
                        <div className="text-xs font-bold text-charcoal">{user.name}</div>
                        <div className="text-[11px] text-[#777] truncate">{user.email}</div>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/checkout"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-charcoal hover:bg-[#FAF7F2]"
                        >
                          <span className="material-symbols-outlined text-[16px] text-gold">local_shipping</span>
                          <span>My Orders & Checkout</span>
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileDropdown(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-gold font-semibold hover:bg-gold/10"
                          >
                            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                            <span>Admin Portal</span>
                          </Link>
                        )}
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-burgundy hover:bg-burgundy/10 transition-colors font-medium"
                        >
                          <span className="material-symbols-outlined text-[16px]">logout</span>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={openLogin}
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-charcoal border border-[#DFD8CC] hover:border-burgundy hover:text-burgundy bg-white transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px] text-gold">person</span>
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Secondary Category Navigation Bar (Desktop) */}
      <nav className="hidden lg:block bg-[#FFFDFB] border-b border-[#EAE5DC] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1 md:gap-3 py-2.5">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.dept || link.href}
                  href={link.href}
                  className={`group relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold uppercase tracking-wider transition-all duration-200 ${
                    active
                      ? 'bg-burgundy text-[#FFFBF7] shadow-md font-bold'
                      : 'text-[#4A4740] hover:text-burgundy hover:bg-[#FAF3EA]'
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`text-[10px] font-normal transition-opacity ${
                      active ? 'text-gold-light' : 'text-gold opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    {link.telugu}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 4. Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-out Menu */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#EAE5DC] flex items-center justify-between bg-[#FAF7F2]">
              <div className="flex items-center gap-2.5">
                <img src="/images/logo.png" alt="Kalyanam" className="h-9 w-auto" />
                <div>
                  <div className="font-heading font-bold text-burgundy text-base">కళ్యాణం</div>
                  <div className="text-[9px] uppercase tracking-widest text-gold font-semibold">
                    Shopping Mall
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-[#777] hover:text-charcoal hover:bg-white"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-[#EAE5DC]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  doSearch(searchQuery);
                  setMobileMenuOpen(false);
                }}
                className="relative"
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pure silk sarees..."
                  className="w-full bg-[#FAF7F2] text-xs pl-9 pr-3 py-2.5 rounded-full border border-[#DFD8CC] focus:outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold material-symbols-outlined text-[17px]">
                  search
                </span>
              </form>
            </div>

            {/* Drawer Navigation Links */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'bg-burgundy text-white font-bold'
                      : 'text-charcoal hover:bg-[#FAF3EA] hover:text-burgundy'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{link.label}</span>
                    <span className="text-xs text-gold font-normal">({link.telugu})</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </Link>
              ))}

              <div className="pt-4 border-t border-[#EAE5DC] mt-4 space-y-2">
                <button
                  onClick={() => {
                    setIsConsultationModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-dark text-charcoal font-bold text-xs uppercase tracking-wider shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  <span>Book VIP Video Shopping</span>
                </button>

                {!user && (
                  <button
                    onClick={() => {
                      openLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-burgundy text-burgundy font-semibold text-xs uppercase tracking-wider"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    <span>Sign In / Create Account</span>
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Footer Contact */}
            <div className="p-4 bg-[#FAF7F2] border-t border-[#EAE5DC] text-xs text-[#666]">
              <div className="font-semibold text-charcoal mb-1">Gudur & Palakurthy Showrooms</div>
              <div className="flex items-center gap-1.5 text-burgundy font-medium">
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>+91 98490 12345 / 54321</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}