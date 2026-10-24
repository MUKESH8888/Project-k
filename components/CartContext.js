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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHkT12UTrTxeV74z_cSXLY0-fFKXzu2zmXeu4dtKXKjWDwRTcYwVmSMBd6Q218o6a5xS4y9BR6-KZKbuD_-FoP69rev0kcmxQyJGeeKJuQCoZA2o6VJpFl_jheXqSyZazbKQdDt9bz5vbvtC7x8Eciwv4Ko43uFUPBsLKzzugqnshfEQbVkT7icv8PLFpIfwGXhb3EwofHAHoaIQZmL7U4dPCjfv81HKODfHgQC9s-J6AEM_SmrMOR',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCy0UOy__LQQHUHbfipT7aAQnxx0g8fvUMG4rKn4OS4EPMCgj2sHrLDyk0AouGi5rUfIYn_-piMH7x651LYfbD7mOQpAsqa71NKixgdMdQl5i2tg864l_uDnjBYiKZxgoHOJX9_iw7LyYP_vr0AYVkytM3GsexirfEI4e9KirlJticpCaJo2Oh3QLuf7TuU3fo_aJVtMWcYOG4CLUMv3ey5L6gj_q-fUyGzssTCgzLSSOc8Gnvkxi_c',
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
