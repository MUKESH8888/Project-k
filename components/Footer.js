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
    showToast('Subscribed to Kalyanam Bridal Drops privilege invitations!');
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const logoUrl = '/images/logo.png';

  return (
    <footer className="w-full bg-[#1a1b18] text-white pt-12 pb-8 border-t border-[#2d2e2b] font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand & Heritage Identity */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img
                alt="Kalyanam Shopping Mall"
                className="h-10 w-auto object-contain"
                src={logoUrl}
              />
            </Link>
            <p className="text-xs text-[#c5a04b] italic font-medium">
              కళ్యాణం - తరతరాల తెలుగు సాంప్రదాయ వైభవం
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              Serving the communities of Gudur and Palakurthy, Telangana with authentic silk sarees, handloom wedding wear, and festive fashion for the entire family.
            </p>
            <div className="flex flex-col gap-1.5 mt-2 text-xs text-gray-300">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#c5a04b] shrink-0 mt-0.5">
                  location_on
                </span>
                <span>
                  Gudur &amp; Palakurthy, Telangana
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#c5a04b] shrink-0">
                  call
                </span>
                <span>+91 98490 12345 / +91 98490 54321</span>
              </div>
            </div>
          </div>

          {/* Column 2: Departments & Collections */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Collections
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-gray-300">
              <li className="hover:text-white transition-colors">
                <Link href="/?dept=women">Women&apos;s Wear (మహిళలు)</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/?dept=men">Men&apos;s Ethnic (పురుషులు)</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/?dept=kids">Kids Collection (పిల్లలు)</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/sarees">Pattu Silk Sarees</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/sarees?category=bridal">Bridal &amp; Muhurtham</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/stores">Flagship Showrooms</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/about">About Kalyanam</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Concierge */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer Concierge
            </h3>
            <ul className="flex flex-col gap-2 text-xs text-gray-300">
              <li className="hover:text-white transition-colors">
                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="text-left hover:text-[#c5a04b] transition-colors cursor-pointer"
                >
                  Book Virtual Video Consultation
                </button>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/about">Silk Mark Verification Guide</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/checkout">Track Your Matrimonial Order</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/product/swarna-kanchi-pure-silk-saree">
                  Custom Blouse Stitching &amp; Kuchu
                </Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/about">Worldwide Insured Shipping Policy</Link>
              </li>
              <li className="hover:text-white transition-colors">
                <Link href="/stores">Auspicious Muhurtham Calendar</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Bridal Drops & Newsletter */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Privilege Newsletter
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Receive privileged preview invitations for limited master-weaver muhurtham weaves.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center mt-1">
              <input
                className="w-full bg-white/10 text-white placeholder:text-gray-400 px-3 py-2 text-xs rounded-none border border-white/20 focus:outline-none focus:border-[#c5a04b]"
                placeholder="Enter your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-[#c5a04b] text-[#1a1b18] text-xs px-4 py-2 rounded-none font-bold hover:bg-[#d8b564] transition-colors shrink-0 cursor-pointer uppercase tracking-wider"
              >
                {subscribed ? 'Joined!' : 'Join'}
              </button>
            </form>
            <div className="pt-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Artisanal Trust Assurances
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#c5a04b]">
                    verified
                  </span>
                  <span>Silk Mark Certified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#c5a04b]">
                    workspace_premium
                  </span>
                  <span>Handloom Mark India</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#c5a04b]">
                    star
                  </span>
                  <span>100% Pure Zari</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[#c5a04b]">
                    lock
                  </span>
                  <span>256-Bit Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rights & Payment Icons */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 border-t border-white/10">
          <p>
            © 2025 Kalyanam Shopping Mall Private Limited. Crafted with reverence for Telugu bridal heritage.
          </p>
          <div className="flex items-center gap-3">
            <span>
              Secured Payments: UPI • RuPay • Visa • Mastercard • NetBanking
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
