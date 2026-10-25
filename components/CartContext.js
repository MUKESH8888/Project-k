'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const initialCartItems = [
  {
    id: 1,
    title: 'Swarna Kanchi Pure Silk Saree',
    telugu: 'స్వర్ణ కంచి పట్టు చీర',
    price: 42500,
    originalPrice: 50000,
    shade: 'Sindhoori Vermilion Red',
    image: '/images/products/kanchipuram-pattu.jpg',
    badge: 'SILK MARK',
    quantity: 1,
    customizations: ['Fall & Pico Included', 'Silk Kuchu Done'],
  },
  {
    id: 3,
    title: 'Mayilkan Handloom Gadwal Saree',
    telugu: 'మయిల్కన్ గద్వాల పట్టు',
    price: 24900,
    originalPrice: 28000,
    shade: 'Peacock Emerald & Mustard',
    image: '/images/products/gadwal-pattu.jpg',
    badge: 'HANDLOOM',
    quantity: 1,
    customizations: ['Silk Kuchu Done'],
  },
];

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [wishlist, setWishlist] = useState([1, 2, 3, 4]);
  const [toastMessage, setToastMessage] = useState(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const addToCart = (product, shade = null) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          telugu: product.telugu || 'కళ్యాణం పట్టు చీర',
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          shade: shade || product.shade || 'Ceremonial Red',
          image: product.image,
          badge: product.badge || 'SILK MARK',
          quantity: 1,
          customizations: ['Fall & Pico Included', 'Silk Kuchu Done'],
        },
      ];
    });
    showToast(`Added "${product.title}" to your sacred bridal bag!`);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from your bag.');
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from your wishlist.');
        return prev.filter((itemId) => itemId !== id);
      } else {
        showToast('Saved to your sacred wedding wishlist.');
        return [...prev, id];
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        wishlist,
        wishlistCount: wishlist.length,
        addToCart,
        removeFromCart,
        clearCart,
        toggleWishlist,
        toastMessage,
        showToast,
        isConsultationModalOpen,
        setIsConsultationModalOpen,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-5 py-3.5 rounded-xl shadow-2xl border border-secondary-fixed/30 animate-bounce">
          <span className="material-symbols-outlined text-secondary-fixed text-[22px]">
            check_circle
          </span>
          <span className="font-body-sm text-body-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
