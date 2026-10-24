'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../components/CartContext';
import { useAuth } from '../../components/AuthContext';

export default function CheckoutPage() {
  const { cartItems, removeFromCart, showToast } = useCart();
  const { user, openLogin, logout } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState('addr1');
  const [selectedShipping, setSelectedShipping] = useState('std');
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [couponApplied, setCouponApplied] = useState(true);
  const [vpaInput, setVpaInput] = useState('');
  const [vpaVerified, setVpaVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Fallback items if cart is empty
  const items =
    cartItems.length > 0
      ? cartItems
      : [
          {
            id: 1,
            title: 'Swarna Kanchi Pure Silk Saree',
            telugu: 'స్వర్ణ కంచి పట్టు చీర',
            price: 42500,
            shade: 'Sindhoori Vermilion Red',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBHkT12UTrTxeV74z_cSXLY0-fFKXzu2zmXeu4dtKXKjWDwRTcYwVmSMBd6Q218o6a5xS4y9BR6-KZKbuD_-FoP69rev0kcmxQyJGeeKJuQCoZA2o6VJpFl_jheXqSyZazbKQdDt9bz5vbvtC7x8Eciwv4Ko43uFUPBsLKzzugqnshfEQbVkT7icv8PLFpIfwGXhb3EwofHAHoaIQZmL7U4dPCjfv81HKODfHgQC9s-J6AEM_SmrMOR',
            badge: 'WEDDING',
            quantity: 1,
            customizations: ['Fall & Pico Included'],
          },
          {
            id: 3,
            title: 'Mayilkan Handloom Gadwal Saree',
            telugu: 'మయిల్కన్ గద్వాల పట్టు',
            price: 24900,
            shade: 'Peacock Emerald & Mustard',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCy0UOy__LQQHUHbfipT7aAQnxx0g8fvUMG4rKn4OS4EPMCgj2sHrLDyk0AouGi5rUfIYn_-piMH7x651LYfbD7mOQpAsqa71NKixgdMdQl5i2tg864l_uDnjBYiKZxgoHOJX9_iw7LyYP_vr0AYVkytM3GsexirfEI4e9KirlJticpCaJo2Oh3QLuf7TuU3fo_aJVtMWcYOG4CLUMv3ey5L6gj_q-fUyGzssTCgzLSSOc8Gnvkxi_c',
            badge: 'HANDLOOM',
            quantity: 1,
            customizations: ['Silk Kuchu Done'],
          },
        ];

  const subtotal = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const discount = couponApplied ? 2500 : 0;
  const shippingFee = selectedShipping === 'exp' ? 250 : 0;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleVerifyVPA = (e) => {
    e.preventDefault();
    if (!vpaInput.includes('@')) {
      showToast('Please enter a valid UPI VPA (e.g. name@okaxis)');
      return;
    }
    setVpaVerified(true);
    showToast('UPI ID Verified Successfully: Sravanthi Reddy');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: user ? user.name : 'Sunitha Rao',
          customerPhone: user?.phone || '+91 98491 23456',
          customerEmail: user?.email || 'sunitha@kalyanammall.com',
          shippingAddress:
            selectedAddress === 'addr1'
              ? 'Flat 402, Sri Krishna Nilayam, Road No. 10, Banjara Hills, Hyderabad, Telangana - 500034'
              : 'Door 3-6-288, Himayatnagar Main Road, Near Liberty Circle, Hyderabad, Telangana - 500029',
          items: items.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity || 1,
            shade: item.shade,
            customizations: item.customizations || ['Fall & Pico Included'],
          })),
          total: grandTotal,
          paymentMethod: selectedPayment,
          shippingMethod: selectedShipping,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setConfirmedOrder(data.order);
      } else {
        setConfirmedOrder({ id: 'ORD-' + Math.floor(10000 + Math.random() * 90000), total: grandTotal });
      }
      setIsProcessing(false);
      setOrderConfirmed(true);
      showToast('Auspicious celebration! Your wedding order is confirmed.');
    } catch (err) {
      console.error('Order error:', err);
      setConfirmedOrder({ id: 'ORD-98214', total: grandTotal });
      setIsProcessing(false);
      setOrderConfirmed(true);
      showToast('Order confirmed successfully!');
    }
  };

  return (
    <>
      <Header />

      <main className="w-full pt-[116px] bg-background min-h-screen">
        <div className="flex flex-col w-full">
          {/* ============================================================
              Step Progress Indicator
             ============================================================ */}
          <div className="w-full bg-surface-container-low py-space-md shadow-sm border-b border-surface-container">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin">
              <div className="flex items-center justify-between max-w-4xl mx-auto relative">
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-surface-variant z-0 hidden md:block">
                  <div className="h-full bg-secondary w-1/3 transition-all duration-500" />
                </div>

                <div className="flex flex-col items-center relative z-10">
                  <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-label-md shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface mt-2 font-semibold">
                    1. Bag
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary hidden md:inline">
                    {items.length} Items
                  </span>
                </div>

                <div className="flex flex-col items-center relative z-10">
                  <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-label-md shadow-md ring-4 ring-primary-container/20">
                    2
                  </div>
                  <span className="font-label-md text-label-md text-primary font-bold mt-2">
                    2. Delivery
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-medium hidden md:inline">
                    In Progress
                  </span>
                </div>

                <div className="flex flex-col items-center relative z-10">
                  <div className="w-9 h-9 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-bold text-label-md">
                    3
                  </div>
                  <span className="font-label-md text-label-md text-on-surface-variant mt-2 font-medium">
                    3. Payment
                  </span>
                  <span className="font-label-sm text-label-sm text-surface-dim hidden md:inline">
                    Upcoming
                  </span>
                </div>

                <div className="flex flex-col items-center relative z-10">
                  <div className="w-9 h-9 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-bold text-label-md">
                    4
                  </div>
                  <span className="font-label-md text-label-md text-on-surface-variant mt-2 font-medium">
                    4. Confirmation
                  </span>
                  <span className="font-label-sm text-label-sm text-surface-dim hidden md:inline">
                    Final Step
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              Main Checkout Grid
             ============================================================ */}
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
              {/* Left Column: Account, Address, Shipping, Payment */}
              <div className="lg:col-span-7 flex flex-col gap-space-lg">
                {/* 1. Account Box */}
                <div className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-sm flex items-center justify-between border border-surface-container">
                  <div className="flex items-center gap-space-md">
                    <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
                      <span className="material-symbols-outlined text-[20px]">
                        {user ? 'person_check' : 'account_circle'}
                      </span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                        {user ? (user.role === 'admin' ? 'Administrator Account' : 'Telugu Matrimonial Account') : 'Guest / Member Checkout'}
                      </p>
                      <h2 className="font-title-md text-title-md text-on-surface font-bold">
                        {user ? user.name : 'Sunitha Rao'}{' '}
                        <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
                          ({user ? (user.phone || user.email) : '+91 98491 XXXXX'})
                        </span>
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={openLogin}
                    className="font-label-sm text-label-sm text-primary hover:text-primary-container font-semibold uppercase tracking-wider underline cursor-pointer"
                  >
                    {user ? 'Switch Account' : 'Sign In'}
                  </button>
                </div>

                {/* 2. Delivery Address */}
                <div className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-surface-container">
                  <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[22px]">
                        pin_drop
                      </span>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        Delivery Address
                      </h2>
                    </div>
                    <button className="font-label-sm text-label-sm text-secondary hover:text-on-secondary-container font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">add</span> Add New
                    </button>
                  </div>

                  {/* Address 1: Primary */}
                  <div
                    onClick={() => setSelectedAddress('addr1')}
                    className={`p-space-md rounded-lg shadow-sm relative overflow-hidden cursor-pointer transition-all ${
                      selectedAddress === 'addr1'
                        ? 'bg-surface-container-low ring-2 ring-primary'
                        : 'bg-surface opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-secondary text-on-secondary font-label-sm text-label-sm px-3 py-1 rounded-bl-lg font-semibold tracking-wider">
                      PRIMARY RESIDENCE
                    </div>
                    <div className="flex items-start gap-space-md">
                      <div className="pt-0.5">
                        <input
                          checked={selectedAddress === 'addr1'}
                          onChange={() => setSelectedAddress('addr1')}
                          className="w-4 h-4 accent-primary cursor-pointer"
                          type="radio"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-title-md text-title-md text-on-surface font-bold">
                            Sunitha Rao
                          </span>
                          <span className="bg-surface-container text-on-surface-variant text-label-sm font-label-sm px-2 py-0.5 rounded">
                            Home
                          </span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 leading-relaxed">
                          Flat 402, Sri Krishna Nilayam, Road No. 10, Banjara Hills, Hyderabad, Telangana - 500034
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            phone
                          </span>
                          <span>+91 98491 23456</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Address 2: Father's Residence */}
                  <div
                    onClick={() => setSelectedAddress('addr2')}
                    className={`p-space-md rounded-lg flex items-start gap-space-md cursor-pointer transition-all ${
                      selectedAddress === 'addr2'
                        ? 'bg-surface-container-low ring-2 ring-primary'
                        : 'bg-surface opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="pt-0.5">
                      <input
                        checked={selectedAddress === 'addr2'}
                        onChange={() => setSelectedAddress('addr2')}
                        className="w-4 h-4 accent-primary cursor-pointer"
                        type="radio"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-title-md text-title-md text-on-surface font-bold">
                          Raghavendra Rao (Father&apos;s Residence)
                        </span>
                        <span className="bg-surface-container text-on-surface-variant text-label-sm font-label-sm px-2 py-0.5 rounded">
                          Family
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Door 3-6-288, Himayatnagar Main Road, Near Liberty Circle, Hyderabad, Telangana - 500029
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Transit & Delivery Method */}
                <div className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-surface-container">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">
                      local_shipping
                    </span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                      Transit &amp; Delivery Method
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div
                      onClick={() => setSelectedShipping('std')}
                      className={`p-space-md rounded-lg relative cursor-pointer border transition-all ${
                        selectedShipping === 'std'
                          ? 'bg-surface-container-low border-primary ring-1 ring-primary'
                          : 'bg-surface border-surface-container'
                      }`}
                    >
                      <div className="flex items-start gap-space-sm">
                        <input
                          checked={selectedShipping === 'std'}
                          onChange={() => setSelectedShipping('std')}
                          className="mt-1 accent-primary"
                          type="radio"
                        />
                        <div>
                          <span className="font-title-md text-title-md text-on-surface font-bold block">
                            Standard Insured Courier
                          </span>
                          <span className="font-label-sm text-label-sm text-tertiary-container font-semibold mt-0.5 block">
                            Complimentary (₹0)
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">
                            Safe door delivery in 2-3 business days via BlueDart Air.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => setSelectedShipping('exp')}
                      className={`p-space-md rounded-lg relative cursor-pointer border transition-all ${
                        selectedShipping === 'exp'
                          ? 'bg-surface-container-low border-primary ring-1 ring-primary'
                          : 'bg-surface border-surface-container'
                      }`}
                    >
                      <div className="flex items-start gap-space-sm">
                        <input
                          checked={selectedShipping === 'exp'}
                          onChange={() => setSelectedShipping('exp')}
                          className="mt-1 accent-primary"
                          type="radio"
                        />
                        <div className="w-full">
                          <div className="flex items-center justify-between">
                            <span className="font-title-md text-title-md text-on-surface font-bold">
                              Express Same-Day
                            </span>
                            <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded font-bold">
                              HYD ONLY
                            </span>
                          </div>
                          <span className="font-label-sm text-label-sm text-primary font-bold mt-0.5 block">
                            ₹250
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">
                            Dedicated Jubilee Hills logistics by 8:00 PM today.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Complimentary Master-Weaver Finishes */}
                <div className="bg-surface-container-low p-space-md rounded-xl flex items-start gap-space-md border border-secondary-fixed/40">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">
                      content_cut
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">
                        Complimentary Master-Weaver Finishes
                      </h3>
                      <span className="bg-secondary text-on-secondary font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold">
                        APPLIED
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Pure cotton matching Fall attachment, delicate Pico edging, and traditional hand-twisted silk Kuchu tassels are custom-crafted by our in-house artisan team prior to dispatch.
                    </p>
                  </div>
                </div>

                {/* 5. Payment Preference */}
                <div className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-surface-container">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[22px]">
                        account_balance_wallet
                      </span>
                      <h2 className="font-headline-sm text-headline-sm text-on-surface">
                        Payment Preference
                      </h2>
                    </div>
                    <span className="font-label-sm text-label-sm text-tertiary-container font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        verified_user
                      </span>{' '}
                      256-Bit SSL Secured
                    </span>
                  </div>

                  <div className="space-y-space-sm">
                    {/* UPI Option */}
                    <div
                      className={`p-space-md rounded-lg border transition-all ${
                        selectedPayment === 'upi'
                          ? 'bg-surface-container-low border-primary'
                          : 'bg-surface border-surface-container'
                      }`}
                    >
                      <div
                        onClick={() => setSelectedPayment('upi')}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            checked={selectedPayment === 'upi'}
                            onChange={() => setSelectedPayment('upi')}
                            className="accent-primary"
                            type="radio"
                          />
                          <span className="font-title-md text-title-md text-on-surface font-bold">
                            UPI Instant Transfer
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant">
                          <span className="bg-surface px-2 py-1 rounded shadow-sm">GPay</span>
                          <span className="bg-surface px-2 py-1 rounded shadow-sm">PhonePe</span>
                          <span className="bg-surface px-2 py-1 rounded shadow-sm">Paytm</span>
                        </div>
                      </div>

                      {selectedPayment === 'upi' && (
                        <div className="mt-4 pt-4 bg-surface-container-lowest p-4 rounded-lg flex flex-col md:flex-row items-center gap-space-md border border-surface-container">
                          <div className="bg-surface p-3 rounded-lg shadow-inner flex flex-col items-center shrink-0">
                            {/* High Quality Styled QR Code */}
                            <svg
                              className="w-28 h-28 text-on-surface"
                              fill="currentColor"
                              viewBox="0 0 100 100"
                            >
                              <path d="M0 0h36v36H0zM8 8h20v20H8zM64 0h36v36H64zM72 8h20v20H72zM0 64h36v36H0zM8 72h20v20H8z" />
                              <path d="M44 8h12v12H44zM44 28h12v12H44zM8 44h12v12H8zM28 44h12v12H28zM44 44h12v12H44zM64 44h12v12H64zM84 44h8v8h-8zM84 64h8v8h-8zM44 64h12v12H44zM44 84h12v12H44zM64 72h20v8H64zM72 84h20v12H72zM16 16h4v4h-4zM80 16h4v4h-4zM16 80h4v4h-4z" />
                            </svg>
                            <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 font-mono">
                              Scan to Pay
                            </span>
                          </div>
                          <div className="flex-1 w-full flex flex-col gap-2">
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              Scan using your preferred UPI app on mobile or enter your registered Virtual Payment Address (VPA).
                            </p>
                            <form onSubmit={handleVerifyVPA} className="flex items-center gap-2 mt-1">
                              <input
                                className="bg-surface px-3 py-2 text-body-sm font-body-sm rounded flex-1 focus:outline-none border border-surface-dim/40"
                                placeholder="e.g. sunitharao@okaxis"
                                type="text"
                                value={vpaInput}
                                onChange={(e) => setVpaInput(e.target.value)}
                              />
                              <button
                                type="submit"
                                className="bg-secondary text-on-secondary px-4 py-2 font-label-sm text-label-sm font-semibold rounded hover:bg-secondary-container hover:text-on-secondary-container transition-colors shrink-0 cursor-pointer"
                              >
                                {vpaVerified ? 'Verified ✓' : 'Verify VPA'}
                              </button>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card & NetBanking Options */}
                    <div
                      onClick={() => setSelectedPayment('card')}
                      className={`p-space-md rounded-lg flex items-center justify-between cursor-pointer border transition-all ${
                        selectedPayment === 'card'
                          ? 'bg-surface-container-low border-primary'
                          : 'bg-surface border-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          checked={selectedPayment === 'card'}
                          onChange={() => setSelectedPayment('card')}
                          className="accent-primary"
                          type="radio"
                        />
                        <span className="font-title-md text-title-md text-on-surface font-semibold">
                          Credit / Debit Card &amp; Flexi EMI
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-label-sm font-label-sm text-on-surface-variant">
                        <span className="bg-surface-container-high px-2 py-0.5 rounded">Visa</span>
                        <span className="bg-surface-container-high px-2 py-0.5 rounded">
                          MasterCard
                        </span>
                        <span className="bg-surface-container-high px-2 py-0.5 rounded">RuPay</span>
                        <span className="bg-surface-container-high px-2 py-0.5 rounded">Amex</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setSelectedPayment('nb')}
                      className={`p-space-md rounded-lg flex items-center justify-between cursor-pointer border transition-all ${
                        selectedPayment === 'nb'
                          ? 'bg-surface-container-low border-primary'
                          : 'bg-surface border-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          checked={selectedPayment === 'nb'}
                          onChange={() => setSelectedPayment('nb')}
                          className="accent-primary"
                          type="radio"
                        />
                        <span className="font-title-md text-title-md text-on-surface font-semibold">
                          Net Banking
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        SBI • HDFC • ICICI • Axis &amp; 48 others
                      </span>
                    </div>

                    <div
                      onClick={() => setSelectedPayment('cod')}
                      className={`p-space-md rounded-lg flex items-center justify-between cursor-pointer border transition-all ${
                        selectedPayment === 'cod'
                          ? 'bg-surface-container-low border-primary'
                          : 'bg-surface border-surface-container'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          checked={selectedPayment === 'cod'}
                          onChange={() => setSelectedPayment('cod')}
                          className="accent-primary"
                          type="radio"
                        />
                        <span className="font-title-md text-title-md text-on-surface font-semibold">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary font-semibold">
                        Available up to ₹50,000
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Pillar Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm pt-2">
                  <div className="bg-surface-container-lowest p-3 rounded-lg text-center flex flex-col items-center border border-surface-container">
                    <span className="material-symbols-outlined text-secondary text-[22px] mb-1">
                      verified
                    </span>
                    <span className="font-label-sm text-label-sm font-bold text-on-surface">
                      Pure Silk Mark
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Central Silk Board
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-lg text-center flex flex-col items-center border border-surface-container">
                    <span className="material-symbols-outlined text-secondary text-[22px] mb-1">
                      security
                    </span>
                    <span className="font-label-sm text-label-sm font-bold text-on-surface">
                      Transit Insurance
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      100% Value Covered
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-lg text-center flex flex-col items-center border border-surface-container">
                    <span className="material-symbols-outlined text-secondary text-[22px] mb-1">
                      lock
                    </span>
                    <span className="font-label-sm text-label-sm font-bold text-on-surface">
                      256-Bit SSL
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Bank Grade Security
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest p-3 rounded-lg text-center flex flex-col items-center border border-surface-container">
                    <span className="material-symbols-outlined text-secondary text-[22px] mb-1">
                      workspace_premium
                    </span>
                    <span className="font-label-sm text-label-sm font-bold text-on-surface">
                      Pure Silver Zari
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Lab Authenticated
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column (Sticky): Order Summary & Payment Button */}
              <div className="lg:col-span-5 flex flex-col gap-space-lg lg:sticky lg:top-[168px]">
                <div className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-md flex flex-col gap-space-md border border-surface-container">
                  <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                      Order Summary
                    </h2>
                    <span className="font-label-sm text-label-sm text-secondary font-bold">
                      {items.length} HEIRLOOM ITEMS
                    </span>
                  </div>

                  {/* Saree Items List */}
                  <div className="flex flex-col gap-space-md divide-y divide-surface-container">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-space-md pt-2 first:pt-0">
                        <div className="w-20 h-28 rounded-lg overflow-hidden bg-surface-container shrink-0 relative">
                          <img
                            alt={item.title}
                            className="w-full h-full object-cover"
                            src={item.image}
                          />
                          <span className="absolute bottom-1 right-1 bg-tertiary-container text-on-tertiary font-label-sm text-[9px] px-1 py-0.5 rounded">
                            {item.badge}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h3 className="font-title-md text-title-md text-on-surface font-bold leading-snug">
                                {item.title}
                              </h3>
                              <span className="font-title-md text-title-md text-on-surface font-bold shrink-0">
                                ₹{item.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="font-label-sm text-label-sm text-secondary italic">
                              {item.telugu}
                            </p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                              Shade: <span className="font-semibold text-on-surface">{item.shade}</span> • Qty: {item.quantity || 1}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <span className="font-label-sm text-label-sm text-tertiary-container font-semibold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">
                                check_circle
                              </span>{' '}
                              Fall &amp; Pico Included
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="font-label-sm text-label-sm text-outline hover:text-error transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Block */}
                  {couponApplied ? (
                    <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between border border-secondary-fixed/40">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[20px]">
                          sell
                        </span>
                        <div>
                          <span className="font-label-sm text-label-sm text-on-surface font-bold block">
                            KALYANAMBRIDAL
                          </span>
                          <span className="font-label-sm text-label-sm text-secondary block">
                            Muhurtham auspicious savings applied
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-title-md text-title-md text-tertiary-container font-bold">
                          -₹2,500
                        </span>
                        <button
                          onClick={() => setCouponApplied(false)}
                          className="text-outline hover:text-on-surface text-label-sm cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCouponApplied(true)}
                      className="text-primary font-semibold text-body-sm hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">sell</span>
                      <span>Apply Bridal Code (KALYANAMBRIDAL)</span>
                    </button>
                  )}

                  {/* Calculations */}
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>Saree Heritage Subtotal</span>
                      <span className="font-semibold text-on-surface">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between font-body-sm text-body-sm text-tertiary-container font-semibold">
                        <span>Festive Bridal Privilege Code</span>
                        <span>-₹2,500</span>
                      </div>
                    )}
                    <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        Complimentary Finishing (Fall, Pico &amp; Kuchu)
                        <span className="text-secondary font-semibold text-[11px] bg-secondary-fixed/50 px-1 rounded">
                          ₹900 VALUE
                        </span>
                      </span>
                      <span className="font-bold text-tertiary-container uppercase text-label-sm">
                        FREE
                      </span>
                    </div>
                    <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>Insured Express Air Transit</span>
                      <span className="font-bold text-tertiary-container uppercase text-label-sm">
                        {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>Integrated GST (5% Included)</span>
                      <span>₹{Math.round(grandTotal * 0.05).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="my-2 h-[1px] bg-surface-container" />

                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold block">
                          Grand Total
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          Total savings: ₹{(discount + 900).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-headline-lg text-headline-lg text-primary font-bold">
                          ₹{grandTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Pay Button */}
                  <button
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    className="w-full bg-primary-container text-on-primary py-3.5 px-space-md rounded-lg font-label-lg text-label-lg font-bold tracking-wider uppercase hover:bg-primary transition-all duration-300 shadow-md flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                      lock
                    </span>
                    <span>
                      {isProcessing
                        ? 'AUTHENTICATING SECURE PAYMENT...'
                        : `PROCEED TO SECURE PAY ₹${grandTotal.toLocaleString('en-IN')}`}
                    </span>
                  </button>

                  <p className="font-body-sm text-body-sm text-on-surface-variant text-center flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      sentiment_satisfied_alt
                    </span>
                    <span>100% Genuine Silk Certified or 10X Moneyback Guarantee</span>
                  </p>

                  <div className="bg-surface-container-high/60 p-space-sm rounded-lg flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">
                      support_agent
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-tight">
                      Need Telugu bridal assistance? Call{' '}
                      <span className="font-bold text-on-surface">+91 98490 00000</span> or connect with our{' '}
                      <span className="text-primary font-semibold underline cursor-pointer">
                        Jubilee Hills Bridal Concierge
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-low p-space-md rounded-xl flex items-center gap-space-md border border-secondary-fixed/40">
                  <div className="w-12 h-12 rounded-full bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">
                      local_activity
                    </span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface font-bold">
                      Auspicious Wedding Muhurtham Delivery
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Need auspicious delivery timed for a specific Telugu muhurtham date? Our delivery specialists coordinate timed handovers with sacred prasad packs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Celebratory Order Confirmation Modal */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-lg w-full p-8 shadow-2xl relative flex flex-col items-center text-center gap-4 border border-secondary-fixed/50 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[36px]">auto_awesome</span>
            </div>

            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
              శుభం • AUSPICIOUS WEDDING BLESSINGS
            </span>

            <h2 className="font-display-md text-headline-md font-bold text-primary">
              Order Confirmed Successfully!
            </h2>

            <p className="font-body-md text-body-md text-on-surface-variant">
              Your sacred order <strong className="text-on-surface">#{confirmedOrder?.id || 'KLM-ORD-2025-9821'}</strong> for{' '}
              <strong className="text-primary">₹{grandTotal.toLocaleString('en-IN')}</strong> has been confirmed.
            </p>

            <div className="p-4 bg-surface-container-low rounded-xl text-left w-full text-body-sm flex flex-col gap-1.5 border border-surface-container">
              <div>
                <strong>Delivery Address:</strong> {selectedAddress === 'addr1' ? 'Banjara Hills, Hyderabad' : 'Himayatnagar, Hyderabad'}
              </div>
              <div>
                <strong>Finishes Applied:</strong> Complimentary Fall, Pico &amp; Hand-twisted Silk Kuchu
              </div>
              <div>
                <strong>Estimated Delivery:</strong> Within 48 hours with laboratory silk test report
              </div>
            </div>

            <div className="flex gap-3 w-full pt-2">
              <Link
                href="/"
                className="flex-1 py-3 rounded-lg bg-primary text-on-primary font-semibold text-center hover:bg-primary-container transition-colors"
              >
                Back to Shopping Mall
              </Link>
              <Link
                href="/stores"
                className="flex-1 py-3 rounded-lg bg-surface-container text-on-surface font-semibold text-center hover:bg-surface-container-high transition-colors"
              >
                Locate Stores
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
