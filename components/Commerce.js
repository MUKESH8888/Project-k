"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { Shell, money } from "./Store";
import Icon from "./Icons";
export function Cart() {
  const { cartItems, cartTotal, ready, updateQuantity, removeFromCart } =
    useCart();
  return (
    <Shell>
      <section className="section wrap">
        <p className="eyebrow">YOUR NEXT CELEBRATION STARTS HERE</p>
        <h1>
          Your shopping <em>bag.</em>
        </h1>
        {!ready ? (
          <p>Loading your bag…</p>
        ) : !cartItems.length ? (
          <div className="empty-state">
            <Icon name="bag" size={40} />
            <h2>A beautiful beginning awaits.</h2>
            <p>Your bag is empty. Let’s find something you love.</p>
            <Link href="/sarees" className="button">
              Discover the collection
            </Link>
          </div>
        ) : (
          <div className="checkout-grid">
            <div>
              {cartItems.map((i) => (
                <div className="bag-item" key={i.id}>
                  <Link href={"/product/" + i.id}>
                    <Image
                      src={i.image}
                      alt={i.title}
                      width={115}
                      height={145}
                    />
                  </Link>
                  <div>
                    <p className="eyebrow">{i.category}</p>
                    <Link href={"/product/" + i.id}>
                      <h3>{i.title}</h3>
                    </Link>
                    <p>{money(i.price)}</p>
                    <div className="item-actions">
                      <label>
                        Quantity{" "}
                        <input
                          aria-label={`Quantity for ${i.title}`}
                          type="number"
                          min="1"
                          max={Math.min(i.stock, 20)}
                          value={i.quantity}
                          onChange={(e) =>
                            updateQuantity(i.id, Number(e.target.value) || 1)
                          }
                        />
                      </label>
                      <button
                        className="text-link"
                        onClick={() => removeFromCart(i.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <strong>{money(i.price * i.quantity)}</strong>
                </div>
              ))}
            </div>
            <Summary total={cartTotal}>
              <Link href="/checkout" className="button">
                Continue to checkout <Icon name="arrow" size={18} />
              </Link>
              <Link href="/sarees" className="text-link">
                Continue exploring
              </Link>
            </Summary>
          </div>
        )}
      </section>
    </Shell>
  );
}
function Summary({ total, children }) {
  const delivery = total >= 5000 ? 0 : 199;
  return (
    <aside className="order-summary">
      <p className="eyebrow">THE DETAILS</p>
      <h2>Order summary</h2>
      <div>
        <span>Subtotal</span>
        <span>{money(total)}</span>
      </div>
      <div>
        <span>Delivery</span>
        <span>{delivery ? money(delivery) : "Complimentary"}</span>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong>{money(total + delivery)}</strong>
      </div>
      <p className="muted">
        Inclusive of applicable taxes. Final prices and availability are checked
        when you place your order.
      </p>
      {children}
    </aside>
  );
}
export function Checkout() {
  const { cartItems, cartTotal, clearCart, ready } = useCart();
  const { user } = useAuth();
  const [quote, setQuote] = useState(null),
    [quoteVersion, setQuoteVersion] = useState(0),
    [addresses, setAddresses] = useState([]);
  const deliveryForm = useRef(null);
  const fingerprint = JSON.stringify(
    cartItems.map((i) => ({ productId: i.id, quantity: i.quantity })),
  );
  const quoteReady = quote?.fingerprint === fingerprint;
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [order, setOrder] = useState(null);
  const key = useRef(null);
  useEffect(() => {
    if (!ready || !cartItems.length) return;
    const controller = new AbortController();
    fetch("/api/checkout/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: JSON.parse(fingerprint) }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setQuote({ ...data.quote, fingerprint });
        setError("");
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setQuote(null);
          setError(e.message);
        }
      });
    return () => controller.abort();
  }, [ready, cartItems.length, fingerprint, quoteVersion]);
  useEffect(() => {
    if (!user) return;
    let active = true;
    fetch("/api/account")
      .then((r) => r.json())
      .then((d) => {
        if (active) setAddresses(d.addresses || []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user]);
  useEffect(() => {
    key.current = sessionStorage.getItem("checkout-key") || crypto.randomUUID();
    sessionStorage.setItem("checkout-key", key.current);
  }, []);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (!quoteReady)
        throw new Error(
          "Please refresh your order total before placing the order.",
        );
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          shippingAddress: `${values.address}, ${values.city}, ${values.state} - ${values.pincode}`,
          paymentMethod: "cod",
          expectedTotal: quote.totalAmount,
          idempotencyKey: key.current,
          items: cartItems.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
          })),
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setOrder(d.order);
      clearCart();
      sessionStorage.removeItem("checkout-key");
    } catch (e) {
      setError(e.message || "Unable to place your order. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell>
      <section className="section wrap">
        <p className="eyebrow">ONE STEP CLOSER</p>
        <h1>
          {order ? "A beautiful choice." : "Make it "}
          <em>{order ? "Thank you." : "yours."}</em>
        </h1>
        {order ? (
          <div className="confirmation">
            <Icon name="check" size={42} />
            <h2>Your order is confirmed.</h2>
            <p>
              Keep your order reference: <strong>{order.id}</strong>
            </p>
            <p>{money(order.totalAmount)} · Pay on delivery</p>
            <p>
              Our team will contact you about dispatch. No online payment has
              been taken.
            </p>
            <p>{order.shippingAddress}</p>
            <button className="button outline" onClick={() => window.print()}>
              Print confirmation
            </button>
            <Link className="button" href="/sarees">
              Continue shopping
            </Link>
          </div>
        ) : !ready ? (
          <p>Loading…</p>
        ) : !cartItems.length ? (
          <div className="empty-state">
            <h2>Your bag is empty.</h2>
            <Link className="button" href="/sarees">
              Find something beautiful
            </Link>
          </div>
        ) : (
          <form className="checkout-grid" onSubmit={submit} ref={deliveryForm}>
            <div>
              <h2>Delivery details</h2>
              {user && addresses.length > 0 && (
                <label className="saved-address-select">
                  Use a saved address
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const address = addresses.find(
                        (a) => a.id === e.target.value,
                      );
                      if (!address) return;
                      const values = {
                        customerName: address.name,
                        customerPhone: address.phone,
                        customerEmail: user.email,
                        address: address.address,
                        city: address.city,
                        state: address.state,
                        pincode: address.pincode,
                      };
                      Object.entries(values).forEach(([name, value]) => {
                        deliveryForm.current.elements.namedItem(name).value =
                          value;
                      });
                    }}
                  >
                    <option value="">Enter a new address</option>
                    {addresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label} — {a.city}, {a.pincode}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <div className="form-grid">
                {[
                  ["customerName", "Full name", "text", "name"],
                  ["customerEmail", "Email address", "email", "email"],
                  ["customerPhone", "Phone number", "tel", "tel"],
                  ["pincode", "PIN code", "text", "postal-code"],
                  ["city", "City", "text", "address-level2"],
                  ["state", "State", "text", "address-level1"],
                ].map(([name, label, type, auto]) => (
                  <label key={name}>
                    {label}
                    <input
                      name={name}
                      type={type}
                      autoComplete={auto}
                      defaultValue={
                        name === "customerName"
                          ? user?.name || ""
                          : name === "customerEmail"
                            ? user?.email || ""
                            : name === "customerPhone"
                              ? user?.phone || ""
                              : ""
                      }
                      inputMode={name === "pincode" ? "numeric" : undefined}
                      required
                      maxLength={name === "pincode" ? 6 : 100}
                      pattern={
                        name === "pincode"
                          ? "[0-9]{6}"
                          : name === "customerPhone"
                            ? "[+0-9 -]{10,16}"
                            : undefined
                      }
                    />
                  </label>
                ))}
                <label className="span-two">
                  Street address
                  <textarea
                    name="address"
                    autoComplete="street-address"
                    required
                    minLength={8}
                    maxLength={500}
                  />
                </label>
              </div>
              <div className="payment-box">
                <Icon name="check" />
                <div>
                  <h3>Cash on delivery</h3>
                  <p>
                    Pay when your order arrives. No card or UPI details
                    required.
                  </p>
                </div>
              </div>
              <p className="muted">
                By placing an order, you agree to our{" "}
                <Link href="/shipping">delivery and returns information</Link>{" "}
                and <Link href="/privacy">privacy notice</Link>.
              </p>
              {error && (
                <p className="form-error" role="alert">
                  {error}{" "}
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => {
                      setQuote(null);
                      setQuoteVersion((v) => v + 1);
                    }}
                  >
                    Refresh order total
                  </button>
                </p>
              )}
            </div>
            <Summary total={quote?.subtotal ?? cartTotal}>
              {!quoteReady && (
                <p role="status">Checking current prices and availability…</p>
              )}
              <ul className="checkout-items">
                {(quote?.items || cartItems).map((i) => (
                  <li key={i.productId || i.id}>
                    <span>
                      {i.title} × {i.quantity}
                    </span>
                    <span>{money(i.price * i.quantity)}</span>
                  </li>
                ))}
              </ul>
              <button className="button" disabled={busy || !quoteReady}>
                {busy ? "Placing your order…" : "Place order · Pay on delivery"}
                <Icon name="arrow" size={18} />
              </button>
            </Summary>
          </form>
        )}
      </section>
    </Shell>
  );
}
