'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../components/CartContext';

export default function CheckoutPage() {
  const { cartItems, cartTotal, showToast, removeFromCart, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const [deliveryDetails, setDeliveryDetails] = useState({
    name: 'Smt. Kavitha Reddy',
    phone: '+91 98491 55667',
    email: 'kavitha.reddy@gmail.com',
    address: 'Flat 402, Sri Sai Residency, Near Hanuman Temple, Ashok Nagar',
    pincode: '506001',
    city: 'Warangal',
    state: 'Telangana',
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod'
  const [upiId, setUpiId] = useState('kavitha.reddy@oksbi');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const subtotal = cartTotal;
  const deliveryFee = subtotal > 5000 ? 0 : 199;
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.15) : 0;
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount);

  const formatPrice = (price) => `₹${Number(price || 0).toLocaleString('en-IN')}`;

  const handleApplyCoupon = () => {
    if (couponCode.trim().toLowerCase() === 'kalyanam15') {
      setCouponApplied(true);
      showToast('Auspicious 15% discount applied successfully!');
    } else {
      showToast('Invalid coupon code. Try code: KALYANAM15');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0 && !placedOrder) {
      showToast('Your bridal shopping bag is empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: deliveryDetails.name,
          customerEmail: deliveryDetails.email,
          customerPhone: deliveryDetails.phone,
          shippingAddress: `${deliveryDetails.address}, ${deliveryDetails.city}, ${deliveryDetails.state} - ${deliveryDetails.pincode}`,
          totalAmount: total,
          paymentMethod:
            paymentMethod === 'upi'
              ? `UPI (${upiId || 'Instant App'})`
              : paymentMethod === 'cod'
              ? 'Cash on Delivery (COD)'
              : 'Credit / Debit Card',
          items: cartItems.map((item) => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            shade: item.shade || 'Ceremonial Red',
          })),
        }),
      });

      const data = await response.json();
      if (data.success && data.order) {
        setPlacedOrder(data.order);
        clearCart();
        showToast(`Sacred order confirmed! ID: ${data.order.id}`);
        setStep(4);
      } else {
        throw new Error(data.error || 'Failed to complete order');
      }
    } catch (err) {
      console.error('Order error:', err);
      showToast(err.message || 'Error submitting order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepLabels = ['Bag Review', 'Delivery Address', 'Payment', 'Confirmation'];

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col justify-between">
      <a href="#main-checkout" className="skip-link">
        Skip to main content
      </a>
      <Header />

      <main id="main-checkout" className="flex-1 relative pt-[115px] md:pt-[135px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
            <div>
              <p className="text-xs uppercase tracking-widest text-burgundy font-bold">
                Kalyanam Sacred Bridal Checkout
              </p>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-burgundy-900 mt-1">
                Complete Your Sacred Order
              </h1>
            </div>
            <Link
              href="/sarees"
              className="text-sm text-charcoal/70 hover:text-burgundy transition-colors flex items-center gap-1 font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Continue Exploring Weaves
            </Link>
          </div>

          {/* Stepper */}
          <nav aria-label="Checkout Steps" className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
            {stepLabels.map((label, i) => {
              const stepNumber = i + 1;
              const isActive = step === stepNumber;
              const isPassed = step > stepNumber;
              return (
                <div key={i} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (stepNumber < step && !isSubmitting) setStep(stepNumber);
                    }}
                    disabled={stepNumber > step}
                    className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap shadow-sm ${
                      isActive
                        ? 'bg-burgundy text-white shadow-md'
                        : isPassed
                        ? 'bg-gold/20 text-burgundy hover:bg-gold/30 cursor-pointer'
                        : 'bg-surface-low text-charcoal/50 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isActive ? 'bg-gold text-charcoal' : isPassed ? 'bg-burgundy text-white' : 'bg-charcoal/10'
                      }`}
                    >
                      {isPassed ? '✓' : stepNumber}
                    </span>
                    {label}
                  </button>
                  {i < stepLabels.length - 1 && (
                    <span className="material-symbols-outlined text-[16px] text-charcoal/30">
                      chevron_right
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Step Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* STEP 1: CART REVIEW */}
              {step === 1 && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
                  <h2 className="font-heading text-xl font-bold text-burgundy-900 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-gold">shopping_bag</span>
                    Review Your Sacred Bridal Bag ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                  </h2>

                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-cream-card flex items-center justify-center mx-auto mb-4 border border-border">
                        <span className="material-symbols-outlined text-3xl text-burgundy">
                          shopping_bag
                        </span>
                      </div>
                      <p className="font-heading text-lg font-bold text-charcoal mb-2">
                        Your Bridal Bag is Empty
                      </p>
                      <p className="text-sm text-charcoal/70 mb-6 max-w-sm mx-auto">
                        Explore our handcrafted Kanchipuram, Gadwal, and Banarasi pattu weaves to begin.
                      </p>
                      <Link
                        href="/sarees"
                        className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider"
                      >
                        Explore Handloom Sarees
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="flex gap-4 p-4 rounded-xl border border-border bg-cream-card/50 hover:bg-cream-card transition-colors items-center"
                        >
                          <div className="w-20 h-24 rounded-lg overflow-hidden relative shrink-0 border border-border bg-white">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-charcoal/40">
                                <span className="material-symbols-outlined text-3xl">checkroom</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy bg-burgundy/10 px-2 py-0.5 rounded-full inline-block mb-1">
                              {item.badge || 'SILK MARK'}
                            </span>
                            <h3 className="font-bold text-sm text-charcoal truncate">{item.title}</h3>
                            <p className="text-xs text-charcoal/60 mt-0.5">{item.shade || 'Ceremonial Silk'}</p>
                            <p className="text-xs text-emerald-rich font-medium mt-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">verified</span>
                              Fall &amp; Pico complimentary done
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-charcoal/70">Qty: {item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="text-xs text-rose-700 hover:text-rose-900 font-semibold underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-burgundy-900 block text-base">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-charcoal/40 line-through">
                                {formatPrice(item.originalPrice * item.quantity)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Coupon code box */}
                      <div className="p-4 rounded-xl border border-gold/30 bg-gold/5 mt-6">
                        <label className="block text-xs font-bold uppercase tracking-wider text-burgundy-900 mb-2">
                          Privilege Wedding Coupon Code
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter KALYANAM15"
                            className="input-field text-sm uppercase flex-1"
                            disabled={couponApplied}
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={couponApplied || !couponCode.trim()}
                            className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                          >
                            {couponApplied ? 'Applied' : 'Apply'}
                          </button>
                        </div>
                        {couponApplied && (
                          <p className="text-xs text-emerald-rich font-bold mt-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            Auspicious 15% discount active! Saved {formatPrice(couponDiscount)}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={cartItems.length === 0}
                        className="w-full btn-gold py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm mt-6 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                      >
                        Proceed to Delivery Address
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: DELIVERY DETAILS */}
              {step === 2 && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
                  <h2 className="font-heading text-xl font-bold text-burgundy-900 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-gold">local_shipping</span>
                    Insured Wedding Delivery Address
                  </h2>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setStep(3);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryDetails.name}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, name: e.target.value })}
                          className="input-field w-full text-sm"
                          placeholder="e.g., Smt. Sunitha Reddy"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                          Mobile / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={deliveryDetails.phone}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })}
                          className="input-field w-full text-sm"
                          placeholder="+91 98491 XXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                        Email Address for Order Updates *
                      </label>
                      <input
                        type="email"
                        required
                        value={deliveryDetails.email}
                        onChange={(e) => setDeliveryDetails({ ...deliveryDetails, email: e.target.value })}
                        className="input-field w-full text-sm"
                        placeholder="you@domain.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                        Complete Postal Address (House / Flat No, Street, Landmark) *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={deliveryDetails.address}
                        onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                        className="input-field w-full text-sm"
                        placeholder="House no., Landmark, Street, Colony..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={deliveryDetails.pincode}
                          onChange={(e) =>
                            setDeliveryDetails({
                              ...deliveryDetails,
                              pincode: e.target.value.replace(/\D/g, '').slice(0, 6),
                            })
                          }
                          className="input-field w-full text-sm"
                          placeholder="6-digit pincode"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                          City / Town *
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryDetails.city}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })}
                          className="input-field w-full text-sm"
                          placeholder="e.g. Warangal / Hyderabad"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1.5">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryDetails.state}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, state: e.target.value })}
                          className="input-field w-full text-sm"
                          placeholder="Telangana / AP"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-600 text-lg">verified_user</span>
                      Orders above ₹5,000 receive complimentary insured door delivery with tamper-evident seal.
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn-outline px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                      >
                        Back to Bag
                      </button>
                      <button
                        type="submit"
                        className="btn-gold flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        Proceed to Payment
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {step === 3 && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
                  <h2 className="font-heading text-xl font-bold text-burgundy-900 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-gold">payments</span>
                    Select Secure Payment Option
                  </h2>

                  <form onSubmit={handlePlaceOrder} className="space-y-6">
                    {/* Payment Options Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'upi'
                            ? 'border-burgundy bg-burgundy/5 text-burgundy'
                            : 'border-border hover:border-burgundy/30 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="sr-only"
                        />
                        <span className="material-symbols-outlined text-3xl mb-1 text-gold">
                          qr_code_scanner
                        </span>
                        <span className="text-sm font-bold">UPI / QR</span>
                        <span className="text-[10px] text-charcoal/60 mt-0.5">GPay, PhonePe, Paytm</span>
                      </label>

                      <label
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'card'
                            ? 'border-burgundy bg-burgundy/5 text-burgundy'
                            : 'border-border hover:border-burgundy/30 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="sr-only"
                        />
                        <span className="material-symbols-outlined text-3xl mb-1 text-gold">credit_card</span>
                        <span className="text-sm font-bold">Card</span>
                        <span className="text-[10px] text-charcoal/60 mt-0.5">Visa, RuPay, MC</span>
                      </label>

                      <label
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'cod'
                            ? 'border-burgundy bg-burgundy/5 text-burgundy'
                            : 'border-border hover:border-burgundy/30 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="sr-only"
                        />
                        <span className="material-symbols-outlined text-3xl mb-1 text-gold">
                          account_balance_wallet
                        </span>
                        <span className="text-sm font-bold">Pay on Delivery</span>
                        <span className="text-[10px] text-charcoal/60 mt-0.5">Cash / UPI at Door</span>
                      </label>
                    </div>

                    {/* Method Specific Details */}
                    {paymentMethod === 'upi' && (
                      <div className="p-4 rounded-xl bg-cream-card border border-border space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70">
                          Enter UPI Virtual Payment Address (VPA)
                        </label>
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi, username@okhdfcbank"
                          className="input-field w-full text-sm"
                        />
                        <div className="flex items-center gap-2 text-xs text-charcoal/60">
                          <span className="material-symbols-outlined text-sm text-emerald-rich">
                            lock_clock
                          </span>
                          Instant approval request will be sent to your UPI App upon clicking Place Order.
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="p-4 rounded-xl bg-cream-card border border-border space-y-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="4532 •••• •••• 8890"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                            className="input-field w-full text-sm font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="MM/YY"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                              className="input-field w-full text-sm font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                              CVV
                            </label>
                            <input
                              type="password"
                              maxLength={4}
                              required
                              placeholder="•••"
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                              className="input-field w-full text-sm font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'cod' && (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                        <span className="material-symbols-outlined text-amber-700 text-xl shrink-0 mt-0.5">
                          info
                        </span>
                        <div>
                          <p className="font-bold">Auspicious Cash on Delivery Guarantee</p>
                          <p className="mt-1">
                            Pay via Cash or UPI at your doorstep upon receiving and inspecting your certified
                            handloom silk saree box.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={isSubmitting}
                        className="btn-outline px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-gold flex-1 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin"></span>
                            Confirming Auspicious Order...
                          </>
                        ) : (
                          <>
                            Confirm &amp; Place Order — {formatPrice(total)}
                            <span className="material-symbols-outlined text-sm">lock</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STEP 4: CONFIRMATION */}
              {step === 4 && (
                <div className="bg-white rounded-2xl p-6 sm:p-10 border border-border shadow-sm text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-rich/10 text-emerald-rich flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-5xl">verified</span>
                  </div>

                  <p className="text-xs uppercase tracking-widest text-burgundy font-bold">
                    శుభం భూయాత్ • Congratulations
                  </p>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-burgundy-900 mt-2 mb-3">
                    Thank You! Your Sacred Order is Confirmed
                  </h2>
                  <p className="text-sm text-charcoal/70 max-w-lg mx-auto mb-6">
                    Your bridal sarees are being ceremonially prepared with traditional neem leaves and pure
                    cotton protective pouches at our flagship Gudur showroom.
                  </p>

                  <div className="max-w-md mx-auto p-5 rounded-2xl bg-cream-card border border-border text-left space-y-3 mb-8">
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-border">
                      <span className="text-charcoal/60">Order Reference</span>
                      <span className="font-mono font-bold text-burgundy-900">
                        {placedOrder?.id || 'KLM-20261025-001'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-border">
                      <span className="text-charcoal/60">Amount Paid</span>
                      <span className="font-bold text-charcoal">
                        {formatPrice(placedOrder?.totalAmount || total)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-border">
                      <span className="text-charcoal/60">Payment Method</span>
                      <span className="font-medium text-charcoal">
                        {placedOrder?.paymentMethod || 'UPI Instant Transfer'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-charcoal/60">Estimated Delivery</span>
                      <span className="font-bold text-emerald-rich">2 - 4 Business Days</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/"
                      className="btn-gold px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">home</span>
                      Return to Showroom Home
                    </Link>
                    <Link
                      href="/admin"
                      className="btn-outline px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                      Track in Admin Portal
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary Sidebar */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm sticky top-[150px]">
                <h3 className="font-heading text-lg font-bold text-burgundy-900 pb-4 border-b border-border flex items-center gap-2">
                  <span className="material-symbols-outlined text-gold">receipt_long</span>
                  Order Summary
                </h3>

                {/* Items preview */}
                <div className="divide-y divide-border/60 max-h-64 overflow-y-auto my-4 pr-1">
                  {(placedOrder ? placedOrder.items : cartItems).map((it, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3 text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal truncate">{it.title}</p>
                        <p className="text-xs text-charcoal/60">
                          Qty: {it.quantity} • {it.shade || 'Silk'}
                        </p>
                      </div>
                      <span className="font-bold text-burgundy-900 shrink-0">
                        {formatPrice(it.price * (it.quantity || 1))}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-charcoal/70">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/70">
                    <span>Insured Courier Delivery</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-rich font-bold">FREE</span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-emerald-rich font-medium">
                      <span>Wedding Coupon (15%)</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between items-baseline font-bold text-base text-charcoal">
                    <span>Total Amount</span>
                    <span className="text-xl font-heading text-burgundy-900">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-border/80 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-charcoal/70">
                    <span className="material-symbols-outlined text-gold text-base">verified</span>
                    <span>100% Certified Silk Mark Purity</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-charcoal/70">
                    <span className="material-symbols-outlined text-gold text-base">local_shipping</span>
                    <span>Free Shipping Across Telangana on ₹5,000+</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-charcoal/70">
                    <span className="material-symbols-outlined text-gold text-base">published_with_changes</span>
                    <span>7-Day Hassle-Free Exchange Privilege</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}