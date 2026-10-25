'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from './CartContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { setIsConsultationModalOpen, showToast } = useCart();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    showToast('Auspicious welcome! You are subscribed to Kalyanam Bridal Drops.');
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="w-full bg-[#141210] text-[#EDE8E0] pt-16 pb-10 border-t border-[#2D2A26] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-14">
          {/* Column 1: Brand & Heritage (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                alt="Kalyanam Shopping Mall"
                className="h-11 w-auto object-contain"
                src="/images/logo.png"
              />
              <div className="flex flex-col border-l border-gold/40 pl-3">
                <span className="font-heading text-xl font-bold text-white tracking-tight">
                  కళ్యాణం
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-semibold">
                  Shopping Mall
                </span>
              </div>
            </Link>

            <p className="text-xs text-gold italic font-medium">
              కళ్యాణం — తరతరాల తెలుగు సాంప్రదాయ వైభవం
            </p>

            <p className="text-xs text-[#B8B2A7] leading-relaxed font-light">
              Adorning over 100,000 sacred matrimonies across three generations. Twin multi-floor flagship shopping destinations in Gudur and Palakurthy, Telangana with direct-weaver authentic handloom pure silk.
            </p>

            <div className="space-y-2 text-xs text-[#C8C2B7] pt-2">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-gold shrink-0 mt-0.5">
                  location_on
                </span>
                <span>Gudur &amp; Palakurthy Flagship Showrooms, Telangana</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-gold shrink-0">
                  call
                </span>
                <span>+91 98490 12345 / +91 98490 54321</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-gold shrink-0">
                  mail
                </span>
                <span>concierge@kalyanammall.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Sacred Collections (2.5 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider mb-1">
              Handloom Weaves
            </h3>
            <ul className="space-y-2 text-xs text-[#B8B2A7]">
              <li>
                <Link href="/sarees" className="hover:text-gold transition-colors">
                  Pure Kanchipuram Pattu (కాంచీపురం)
                </Link>
              </li>
              <li>
                <Link href="/sarees" className="hover:text-gold transition-colors">
                  Banarasi Katan Silk Brocades (బనారసి)
                </Link>
              </li>
              <li>
                <Link href="/sarees" className="hover:text-gold transition-colors">
                  Gadwal Handloom Silk &amp; Cotton (గద్వాల)
                </Link>
              </li>
              <li>
                <Link href="/sarees" className="hover:text-gold transition-colors">
                  Pochampally Double Ikat (పోచంపల్లి)
                </Link>
              </li>
              <li>
                <Link href="/?dept=men" className="hover:text-gold transition-colors">
                  Groom Pattu Panche &amp; Kanduva (పురుషులు)
                </Link>
              </li>
              <li>
                <Link href="/?dept=kids" className="hover:text-gold transition-colors">
                  Girls Pattu Pavada &amp; Dhoti Sets (పిల్లలు)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: White-Glove Concierge (2.5 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider mb-1">
              Bridal Services
            </h3>
            <ul className="space-y-2 text-xs text-[#B8B2A7]">
              <li>
                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="text-left hover:text-gold transition-colors text-xs text-[#B8B2A7]"
                >
                  Book HD Video Shopping
                </button>
              </li>
              <li>
                <Link href="/stores" className="hover:text-gold transition-colors">
                  Gudur &amp; Palakurthy Stores
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  75+ Yrs Weaving Heritage
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact Master Stylists
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-gold transition-colors">
                  Track Auspicious Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Privilege Newsletter & Purity Trust (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider mb-1">
              Privilege Circle
            </h3>
            <p className="text-xs text-[#B8B2A7] leading-relaxed font-light">
              Receive private invitations for limited master-weaver drop previews and Telugu wedding muhurtham dates.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-2 mt-1">
              <input
                className="w-full bg-[#201D1A] text-white placeholder:text-[#777] px-4 py-2.5 text-xs rounded-full border border-[#3E3830] focus:outline-none focus:border-gold"
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-wider shrink-0"
              >
                {subscribed ? 'Joined!' : 'Join'}
              </button>
            </form>

            {/* Purity Guarantee Badges */}
            <div className="pt-3 border-t border-[#2D2A26] mt-2">
              <span className="text-[10px] font-bold text-gold uppercase tracking-widest block mb-2">
                Certified Purity Standards
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#EDE8E0]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-gold">
                    verified
                  </span>
                  <span>100% Silk Mark</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-gold">
                    flare
                  </span>
                  <span>Tested Real Zari</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-gold">
                    content_cut
                  </span>
                  <span>Fall &amp; Pico Free</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-gold">
                    flight_takeoff
                  </span>
                  <span>Global Air Transit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Rights Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8E877D] border-t border-[#2D2A26]">
          <p>
            © 2026 Kalyanam Shopping Mall Private Limited. Woven with reverence for Telugu matrimony traditions.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Secure Checkout: UPI • RuPay • Visa • Mastercard • Net Banking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
