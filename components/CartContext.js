"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
const Context = createContext();
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]),
    [wishlist, setWishlist] = useState([]),
    [ready, setReady] = useState(false),
    [toastMessage, setToast] = useState(""),
    [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const timer = useRef();
  // Hydrate browser-only storage after SSR so the server and first client render agree.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("kalyanam-bag-v2") || "{}");
      if (Array.isArray(saved.items))
        setCartItems(
          saved.items.filter(
            (i) =>
              typeof i.id === "string" &&
              Number.isInteger(i.quantity) &&
              i.quantity > 0,
          ),
        );
      if (Array.isArray(saved.wishlist)) setWishlist(saved.wishlist);
    } catch {}
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(
          "kalyanam-bag-v2",
          JSON.stringify({ items: cartItems, wishlist }),
        );
      } catch {}
  }, [cartItems, wishlist, ready]);
  useEffect(() => () => clearTimeout(timer.current), []);
  function showToast(message) {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 3500);
  }
  function addToCart(product, shade, quantity = 1) {
    if (product.stock < 1) {
      showToast("This piece is currently sold out.");
      return;
    }
    setCartItems((old) => {
      const found = old.find((i) => i.id === product.id),
        qty = Math.min(product.stock, 20, (found?.quantity || 0) + quantity);
      return found
        ? old.map((i) =>
            i.id === product.id ? { ...product, quantity: qty } : i,
          )
        : [...old, { ...product, quantity: qty }];
    });
    showToast("Added to your bag.");
  }
  function toggleWishlist(id) {
    setWishlist((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
    );
  }
  const cartCount = cartItems.reduce((n, i) => n + i.quantity, 0),
    cartTotal = cartItems.reduce((n, i) => n + i.price * i.quantity, 0);
  return (
    <Context.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        ready,
        wishlist,
        wishlistCount: wishlist.length,
        addToCart,
        toggleWishlist,
        showToast,
        toastMessage,
        isConsultationModalOpen,
        setIsConsultationModalOpen,
        clearCart: () => setCartItems([]),
        removeFromCart: (id) =>
          setCartItems((old) => old.filter((i) => i.id !== id)),
        updateQuantity: (id, q) =>
          setCartItems((old) =>
            old.map((i) =>
              i.id === id
                ? { ...i, quantity: Math.max(1, Math.min(i.stock, 20, q)) }
                : i,
            ),
          ),
      }}
    >
      {children}
      {toastMessage && (
        <div className="toast" role="status">
          ✓ {toastMessage}
        </div>
      )}
    </Context.Provider>
  );
}
export const useCart = () => useContext(Context);
