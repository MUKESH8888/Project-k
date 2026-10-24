'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

function HeaderContent() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams?.get('search') || '';

  const { cartCount, wishlistCount, setIsConsultationModalOpen, showToast } = useCart();
  const { user, isAdmin, logout, openLogin } = useAuth();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [liveResults, setLiveResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Sync searchQuery when URL param changes
  useEffect(() => {
    setSearchQuery(currentSearch);
  }, [currentSearch]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search suggestion debounced query
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setLiveResults([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setLiveResults((data.products || []).slice(0, 6));
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Search fetch error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    showToast('Logged out successfully.');
  };

  const executeSearch = (queryText) => {
    const q = (queryText ?? searchQuery).trim();
    setShowSuggestions(false);
    if (q) {
      router.push(`/?search=${encodeURIComponent(q)}`);
    } else {
      router.push('/');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setLiveResults([]);
    setShowSuggestions(false);
    if (currentSearch) {
      router.push('/');
    }
  };

  // Only 3 navigation links, aligned to middle as requested
  const navLinks = [
    { label: 'Women', telugu: 'మహిళలు', dept: 'women', href: '/?dept=women' },
    { label: 'Men', telugu: 'పురుషులు', dept: 'men', href: '/?dept=men' },
    { label: 'Kids', telugu: 'పిల్లలు', dept: 'kids', href: '/?dept=kids' },
  ];

  const currentDept = searchParams?.get('dept');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-md">
      {/* 1. Main brand bar — RS Brothers Deep Charcoal & Gold styling */}
      <div className="bg-[#1a1b18] text-white py-2.5 sm:py-3.5 px-3 sm:px-4 md:px-8 border-b border-[#2d2e2b]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 md:gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 group py-0.5">
            <img
              alt="Kalyanam Shopping Mall — కళ్యాణం షాపింగ్ మాల్"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-opacity hover:opacity-95"
              src="/images/logo.png"
            />
          </Link>

          {/* Search bar — RS Brothers clean sharp look */}
          <div className="flex-1 max-w-xl relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#c5a04b] text-[18px] sm:text-[20px] pointer-events-none">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (liveResults.length > 0) setShowSuggestions(true);
                }}
                className="w-full bg-white/10 text-white placeholder:text-gray-400 pl-9 sm:pl-11 pr-20 sm:pr-24 py-2 rounded-none text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#c5a04b] focus:bg-white/15 border border-white/20 transition-all font-sans"
                placeholder="Search products, weaves, bridal sarees..."
                type="text"
                autoComplete="off"
              />

              {/* Clear button */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-16 sm:right-20 text-gray-400 hover:text-white p-1 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              )}

              {/* Submit button — RS Brothers sharp button */}
              <button
                type="submit"
                className="absolute right-1 px-3 sm:px-4 py-1.5 bg-[#c5a04b] text-[#1a1b18] text-xs font-bold rounded-none hover:bg-[#d8b564] active:scale-95 transition-all cursor-pointer shadow-sm flex items-center gap-1 uppercase tracking-wider font-sans"
              >
                <span className="material-symbols-outlined text-[14px] sm:hidden">search</span>
                <span className="hidden sm:inline">Search</span>
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {showSuggestions && liveResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white text-[#212326] rounded-[10px] shadow-2xl overflow-hidden border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                  <span>Found {liveResults.length} instant results</span>
                  <button
                    onClick={() => executeSearch(searchQuery)}
                    className="text-[#1a1b18] font-bold hover:text-[#c5a04b] cursor-pointer"
                  >
                    View all &rarr;
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {liveResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setShowSuggestions(false);
                        router.push(p.href || `/?search=${encodeURIComponent(p.title)}`);
                      }}
                      className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 text-left transition-colors cursor-pointer"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-11 h-11 rounded-[6px] object-cover bg-gray-100 shrink-0 border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate font-sans">{p.title}</p>
                        <p className="text-[11px] text-gray-500 font-medium font-sans">{p.category} · <span className="capitalize">{p.department}</span></p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-[#1a1b18] font-sans">₹{p.price.toLocaleString('en-IN')}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
            {/* Cart */}
            <Link
              href="/checkout"
              className="flex flex-col items-center text-white/90 hover:text-[#c5a04b] transition-colors relative group p-1"
            >
              <div className="relative">
                <span className="material-symbols-outlined text-[20px] sm:text-[24px]">shopping_bag</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#d72c0d] text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-[#1a1b18]">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 hidden md:block text-gray-300 group-hover:text-[#c5a04b] font-sans">Cart</span>
            </Link>

            {/* Wishlist */}
            <Link
              href="/sarees"
              className="flex flex-col items-center text-white/90 hover:text-[#c5a04b] transition-colors relative group p-1"
            >
              <div className="relative">
                <span className="material-symbols-outlined text-[20px] sm:text-[24px]">favorite</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#c5a04b] text-[#1a1b18] text-[9px] sm:text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-[#1a1b18]">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 hidden md:block text-gray-300 group-hover:text-[#c5a04b] font-sans">Wishlist</span>
            </Link>

            {/* Profile / Sign In */}
            <div className="relative" ref={dropdownRef}>
              {user ? (
                <div>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-none bg-white/10 hover:bg-white/20 transition-colors cursor-pointer border border-white/20"
                  >
                    <div className="w-6 h-6 rounded-none bg-[#c5a04b] flex items-center justify-center text-[#1a1b18] font-bold text-xs uppercase shadow-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold max-w-[80px] truncate hidden md:block text-white font-sans">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-[#c5a04b]">expand_more</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white text-[#212326] rounded-[10px] shadow-2xl py-2 border border-gray-200 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="font-bold text-sm truncate text-gray-900">{user.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 bg-[#1a1b18] text-[#c5a04b] text-[10px] px-2 py-0.5 rounded-none font-bold uppercase tracking-wider">
                            Administrator
                          </span>
                        )}
                      </div>
                      <div className="py-1 text-sm">
                        {isAdmin ? (
                          <Link
                            href="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 transition-colors text-[#1a1b18] font-semibold"
                          >
                            <span className="material-symbols-outlined text-[18px] text-[#c5a04b]">admin_panel_settings</span>
                            Admin Dashboard
                          </Link>
                        ) : (
                          <Link
                            href="/checkout"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                          >
                            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                            My Orders &amp; Cart
                          </Link>
                        )}
                        <Link
                          href="/sarees"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                        >
                          <span className="material-symbols-outlined text-[18px]">favorite</span>
                          Wishlist ({wishlistCount})
                        </Link>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setIsConsultationModalOpen(true);
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer text-gray-700"
                        >
                          <span className="material-symbols-outlined text-[18px] text-[#c5a04b]">videocam</span>
                          Video Consultation
                        </button>
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[#d72c0d] hover:bg-red-50 transition-colors cursor-pointer font-semibold text-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Single unified Sign In button */
                <button
                  onClick={openLogin}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-none bg-transparent hover:bg-white/10 text-white hover:text-[#c5a04b] transition-all text-xs font-semibold cursor-pointer border border-white/30 hover:border-[#c5a04b] uppercase tracking-wider font-sans"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#c5a04b]">person</span>
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main navigation bar — RS Brothers clean high-end nav */}
      <div className="bg-[#141414] border-t border-white/10 px-2 sm:px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center justify-center gap-2 sm:gap-6 md:gap-12 py-2 sm:py-2.5">
            {navLinks.map((item) => {
              const isActive = currentDept === item.dept;

              return (
                <Link
                  key={item.dept}
                  href={item.href}
                  className={`group relative inline-flex items-center gap-1.5 sm:gap-2 px-4 py-1.5 rounded-none text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all font-sans ${
                    isActive
                      ? 'bg-[#c5a04b] text-[#1a1b18] font-bold shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-[13px] sm:text-[14px]">{item.label}</span>
                  <span className="text-[10px] sm:text-[11px] opacity-75 group-hover:opacity-100 transition-opacity hidden sm:inline normal-case font-normal">
                    ({item.telugu})
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-[#1a1b18] inline-block ml-0.5" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <Suspense
      fallback={
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1b18] h-[116px]" />
      }
    >
      <HeaderContent />
    </Suspense>
  );
}
