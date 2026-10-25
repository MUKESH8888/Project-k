'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useCart } from '../../../components/CartContext';

const product = {
  id: 1,
  sku: 'KLM-W-001',
  title: 'Swarna Kanchi Pure Silk Saree - Sindhoori Vermilion Red with Korvai Gold Border',
  telugu: 'స్వర్ణ కందుపట్టు చీరు',
  category: 'Kanchipuram Pattu',
  occasion: 'Bridal Muhurtham',
  price: 42500,
  originalPrice: 50000,
  discount: '15% OFF',
  rating: 4.9,
  reviews: 128,
  stock: 4,
  colors: ['#8E1624', '#520B16', '#D49E35'],
  badge: 'SILK MARK CERTIFIED',
  deliveryNote: 'Free Insured Delivery Across Telangana & India',
  description: 'Revered across centuries of Telugu wedding rites, each heirloom drape is hand-woven by hereditary masters using pure mulberry silk yarn and interlocking Korvai borders.',
  details: [
    { label: 'Fabric', value: '100% Pure Mulberry Silk' },
    { label: 'Zari', value: 'Tested Pure Gold & Silver Zari' },
    { label: 'Weave', value: 'Korvai Handloom' },
    { label: 'Border', value: 'Heavy Antique Gold Zari Border' },
    { label: 'Pallu', value: 'Temple Gopuram & Peacock Motifs' },
    { label: 'Blouse', value: 'Unstitched Blouse Fabric Included' },
    { label: 'Finish', value: 'Complimentary Fall, Pico & Kuchu' },
    { label: 'Occasion', value: 'Bridal Muhurtham & Festive' },
  ],
  gallery: [
    { title: 'Full Drape', src: '/images/products/kanchipuram-pattu.jpg', alt: 'Full drape of vermilion red Kanchipuram silk saree' },
    { title: 'Grand Pallu', src: '/images/products/designer-saree.jpg', alt: 'Intricate gold zari grand pallu with temple motifs' },
    { title: 'Korvai Border', src: '/images/products/gadwal-pattu.jpg', alt: 'Korvai joint technique border detail' },
    { title: 'Fabric Texture', src: '/images/products/banarasi-pattu.jpg', alt: 'Pure mulberry silk fabric grain close-up' },
  ],
};

export default function ProductDetailPage() {
  const { addToCart, showToast, setIsConsultationModalOpen, wishlist, toggleWishlist } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryEstimated, setDeliveryEstimated] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const isInWishlist = wishlist.includes(product.id);

  const handleCheckDelivery = () => {
    if (!pincode || pincode.length !== 6) {
      showToast('Please enter a valid 6-digit pincode');
      return;
    }
    setDeliveryEstimated('3-5 business days');
    showToast(`Delivery to ${pincode}: Estimated 3-5 business days`);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, shade: selectedColor });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const tabs = [
    { label: 'Description', icon: 'description' },
    { label: 'Specifications', icon: 'checklist' },
    { label: 'Delivery & Returns', icon: 'local_shipping' },
  ];

  return (
    <div className="min-h-screen bg-cream text-text-primary">
      <a href="#main-product" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-product" className="relative pt-[115px] md:pt-[135px]">
        {/* Breadcrumbs */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-burgundy transition-colors">Home</Link></li>
            <li><span className="material-symbols-outlined text-[14px]">chevron_right</span></li>
            <li><Link href="/?dept=women" className="hover:text-burgundy transition-colors">Women</Link></li>
            <li><span className="material-symbols-outlined text-[14px]">chevron_right</span></li>
            <li className="text-text-primary font-medium truncate max-w-[200px]">{product.category}</li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Image Gallery Column */}
            <div className="lg:col-span-7">
              {/* Main Image */}
              <div className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden bg-surface-high border border-border">
                <Image
                  src={product.gallery[activeImageIndex].src}
                  alt={product.gallery[activeImageIndex].alt}
                  fill
                  className="object-cover object-center transition-opacity duration-300"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                {/* Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="badge badge-gold">{product.badge}</span>
                </div>
                {/* Image navigation dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {product.gallery.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${activeImageIndex === idx ? 'bg-gold scale-125' : 'bg-white/70 hover:bg-gold/60'}`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
              {/* Thumbnail Strip */}
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-gold ring-2 ring-gold/40' : 'border-border hover:border-gold'}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.title}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                      sizes="120px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info Column */}
            <div className="lg:col-span-5">
              {/* Category & Rating */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="badge badge-silk">{product.category}</span>
                <div className="flex items-center gap-1 text-gold">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="font-bold text-sm">{product.rating}</span>
                  <span className="text-text-secondary text-xs">({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-2 leading-tight">
                {product.title}
              </h1>
              <p className="text-text-secondary italic text-sm mb-5">{product.telugu}</p>

              {/* Price Block */}
              <div className="mb-6 p-4 bg-surface-high border border-border rounded-lg">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-heading text-3xl font-bold text-text-primary">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-text-muted line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-burgundy font-bold text-xs bg-burgundy/10 px-2 py-0.5 rounded">
                      {product.discount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted">Includes GST. Complimentary Fall, Pico & Kuchu finishing.</p>
              </div>

              {/* SKU / Stock / Occasion */}
              <div className="flex flex-wrap gap-4 mb-6 text-xs text-text-muted border-b border-border pb-4">
                <span><span className="font-semibold text-text-primary">SKU:</span> {product.sku}</span>
                <span>
                  <span className="font-semibold text-text-primary">Stock:</span>{' '}
                  {product.stock} {product.stock <= 2 ? '(Low Stock!)' : 'available'}
                </span>
                <span><span className="font-semibold text-text-primary">Occasion:</span> {product.occasion}</span>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                  Select Shade
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${selectedColor === color ? 'border-gold ring-2 ring-gold scale-110' : 'border-white hover:border-gold'}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select shade ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity Picker */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-2 border border-border rounded-lg overflow-hidden w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity === 1}
                    className="w-10 h-10 flex items-center justify-center bg-surface-high hover:bg-gold/10 text-text-secondary disabled:opacity-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <span className="w-10 text-center font-mono font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center bg-surface-high hover:bg-gold/10 text-text-secondary disabled:opacity-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mb-6 space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded || product.stock === 0}
                  className={`w-full py-4 text-lg font-bold uppercase tracking-wider shadow-lg rounded-lg transition-all disabled:opacity-60 ${
                    product.stock === 0
                      ? 'bg-surface-high text-text-muted border border-border cursor-not-allowed'
                      : 'btn-secondary hover:scale-[1.02]'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">
                      {isAdded ? 'check_circle' : product.stock === 0 ? 'block' : 'shopping_bag'}
                    </span>
                    {isAdded ? 'Added to Bag!' : product.stock === 0 ? 'Out of Stock' : 'Add to Bridal Bag'}
                  </span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="w-full py-3 border border-border rounded-lg text-text-secondary hover:text-burgundy hover:border-gold transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isInWishlist ? 'text-gold' : ''}`}>
                    {isInWishlist ? 'favorite' : 'favorite_border'}
                  </span>
                  {isInWishlist ? 'Saved to Wishlist' : 'Save to Wishlist'}
                </button>

                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="w-full py-3 border border-gold/30 rounded-lg text-gold hover:bg-gold/5 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">videocam</span>
                  Book Video Consultation
                </button>
              </div>

              {/* Delivery Check */}
              <div className="p-4 bg-surface-high border border-border rounded-lg mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                  Check Delivery
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit Pincode"
                    maxLength={6}
                    className="flex-1 input-field text-sm"
                  />
                  <button
                    onClick={handleCheckDelivery}
                    className="btn-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                  >
                    Check
                  </button>
                </div>
                {deliveryEstimated && (
                  <p className="mt-3 text-sm text-gold font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                    Estimated Delivery: {deliveryEstimated}
                  </p>
                )}
                <p className="mt-2 text-xs text-text-muted flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  {product.deliveryNote}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: 'verified', label: 'Silk Mark Certified' },
                  { icon: 'local_shipping', label: 'Free Insured Delivery' },
                  { icon: 'autorenew', label: '7-Day Easy Returns' },
                ].map((trust) => (
                  <div key={trust.label} className="flex flex-col items-center text-center p-3 bg-surface border border-border rounded-lg">
                    <span className="material-symbols-outlined text-gold text-[20px] mb-1">{trust.icon}</span>
                    <span className="text-[10px] font-semibold text-text-secondary leading-tight">{trust.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Product Details Tabs */}
        <section className="bg-surface-high border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Tab Headers */}
            <div className="flex gap-1 mb-8 border-b border-border">
              {tabs.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
                    activeTab === idx
                      ? 'border-gold text-burgundy'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gold/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeTab === 0 && (
                <div className="max-w-3xl">
                  <h2 className="font-heading text-xl font-bold text-text-primary mb-4">About This Saree</h2>
                  <p className="text-text-secondary leading-relaxed mb-4">{product.description}</p>
                  <p className="text-text-secondary leading-relaxed">
                    The Sindhoori Vermilion Red shade is considered the most auspicious for Telugu bridal ceremonies.
                    Hand-woven on traditional pit looms by master artisans from Kanchipuram, this saree features
                    the legendary Korvai weaving technique that interlocks the border with the body — a hallmark
                    of the finest bridal sarees. The grand pallu showcases intricate temple gopuram and peacock
                    motifs in pure tested zari.
                  </p>
                </div>
              )}

              {activeTab === 1 && (
                <div className="max-w-2xl">
                  <h2 className="font-heading text-xl font-bold text-text-primary mb-4">Product Specifications</h2>
                  <div className="space-y-0">
                    {product.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center py-3 ${idx < product.details.length - 1 ? 'border-b border-border' : ''}`}
                      >
                        <span className="w-40 text-sm font-semibold text-text-primary">{detail.label}</span>
                        <span className="text-sm text-text-secondary">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div className="max-w-3xl space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-text-primary mb-3">Delivery Information</h2>
                    <ul className="space-y-2 text-text-secondary text-sm">
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-gold text-[16px] mt-0.5">check</span>
                        Free insured delivery across India on all orders above ₹5,000
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-gold text-[16px] mt-0.5">check</span>
                        International shipping available to USA, UK, UAE, Australia & 50+ countries
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-gold text-[16px] mt-0.5">check</span>
                        Estimated delivery: 3-5 business days (domestic) / 7-12 business days (international)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-gold text-[16px] mt-0.5">check</span>
                        Sacred prasad pack included with every bridal saree order
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary mb-3">Return & Exchange Policy</h3>
                    <ul className="space-y-2 text-text-secondary text-sm">
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-gold text-[16px] mt-0.5">check</span>
                        7-day easy return policy from date of delivery
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-gold text-[16px] mt-0.5">check</span>
                        Exchange available for size, shade, or style within 15 days
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-gold text-[16px] mt-0.5">check</span>
                        Full refund processed within 5-7 business days of return receipt
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-burgundy text-cream py-16 text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-cream/80 mb-6">
              Our expert saree stylists can guide you through our bridal collection with a personal 1-on-1 HD video consultation.
            </p>
            <button
              onClick={() => setIsConsultationModalOpen(true)}
              className="btn-gold px-10 py-4 text-lg font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[20px]">videocam</span>
                Book Bridal Consultation
              </span>
            </button>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}