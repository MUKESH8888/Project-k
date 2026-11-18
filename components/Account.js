"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthContext";
import { Shell, money } from "./Store";
async function api(url, method = "GET", body) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Please try again.");
  return data;
}
export default function Account() {
  const { user, loading, openLogin, logout, refreshUser } = useAuth();
  const [tab, setTab] = useState("Orders"),
    [account, setAccount] = useState(null),
    [orders, setOrders] = useState([]),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    let active = true;
    Promise.all([api("/api/account"), api("/api/account/orders")])
      .then(([a, o]) => {
        if (active) {
          setAccount(a);
          setOrders(o.orders);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [user]);
  async function action(url, method, body, success) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api(url, method, body);
      setMessage(success);
      if (url.endsWith("/password")) {
        await refreshUser();
        setAccount(null);
        setOrders([]);
      } else {
        const [a, o] = await Promise.all([
          api("/api/account"),
          api("/api/account/orders"),
        ]);
        setAccount(a);
        setOrders(o.orders);
        if (url === "/api/account") await refreshUser();
      }
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell>
      <section className="section wrap">
        <p className="eyebrow">YOUR KALYANAM</p>
        <h1>{user ? `Hello, ${user.name}.` : "Welcome back."}</h1>
        {message && (
          <p className="success-message" role="status">
            {message}
          </p>
        )}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {loading ? (
          <p>Loading…</p>
        ) : !user ? (
          <div className="empty-state">
            <p>Sign in to manage orders, addresses and your account.</p>
            <button className="button" onClick={openLogin}>
              Sign in
            </button>
          </div>
        ) : (
          <>
            <div className="account-actions">
              <p>{user.email}</p>
              <button className="text-link" onClick={logout}>
                Sign out
              </button>
              {user.role === "admin" && (
                <Link className="button" href="/admin">
                  Open store management
                </Link>
              )}
            </div>
            <nav className="account-tabs" aria-label="Account sections">
              {["Orders", "Addresses", "Profile", "Security"].map((t) => (
                <button
                  key={t}
                  className={tab === t ? "active" : ""}
                  onClick={() => {
                    setTab(t);
                    setError("");
                    setMessage("");
                  }}
                >
                  {t}
                </button>
              ))}
            </nav>
            {!account ? (
              <p>Loading your account…</p>
            ) : (
              <>
                {tab === "Orders" && (
                  <>
                    <h2>Your orders</h2>
                    {orders.length ? (
                      orders.map((o) => (
                        <article className="order-record" key={o.id}>
                          <div>
                            <strong>{o.id}</strong>
                            <span className="status-pill">{o.status}</span>
                          </div>
                          <p>
                            {o.items
                              .map((i) => `${i.title} × ${i.quantity}`)
                              .join(" · ")}
                          </p>
                          <p>
                            {money(o.totalAmount)} · {o.paymentMethod} ·{" "}
                            {new Date(o.createdAt).toLocaleDateString("en-IN")}
                          </p>
                          <p className="muted">{o.shippingAddress}</p>
                          {o.shipment && (
                            <div className="shipment-note">
                              <span>
                                {o.shipment.carrier} ·{" "}
                                {o.shipment.trackingNumber}
                              </span>
                              {o.shipment.trackingUrl && (
                                <a
                                  className="text-link"
                                  href={o.shipment.trackingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Track shipment ↗
                                </a>
                              )}
                            </div>
                          )}
                          <ol className="order-timeline">
                            {(
                              o.history || [
                                { status: o.status, at: o.createdAt },
                              ]
                            ).map((h, i) => (
                              <li key={i}>
                                <span>{h.status}</span>
                                <small>
                                  {new Date(h.at).toLocaleString("en-IN")}
                                </small>
                              </li>
                            ))}
                          </ol>
                          {["Confirmed", "Processing"].includes(o.status) && (
                            <button
                              className="text-link"
                              disabled={busy}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Cancel this order? Your items will be returned to stock.",
                                  )
                                )
                                  action(
                                    "/api/account/orders/" + o.id,
                                    "POST",
                                    {},
                                    "Your order was cancelled.",
                                  );
                              }}
                            >
                              Cancel order
                            </button>
                          )}
                        </article>
                      ))
                    ) : (
                      <p>
                        No account orders yet. Guest orders are not linked by
                        email alone.
                      </p>
                    )}
                  </>
                )}
                {tab === "Profile" && (
                  <form
                    className="account-form stack-form"
                    key={account.user.name + account.user.phone}
                    onSubmit={(e) => {
                      e.preventDefault();
                      action(
                        "/api/account",
                        "PUT",
                        Object.fromEntries(new FormData(e.currentTarget)),
                        "Profile updated.",
                      );
                    }}
                  >
                    <h2>Your details</h2>
                    <label>
                      Full name
                      <input
                        name="name"
                        required
                        maxLength={100}
                        autoComplete="name"
                        defaultValue={account.user.name}
                      />
                    </label>
                    <label>
                      Phone number
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        maxLength={25}
                        defaultValue={account.user.phone || ""}
                      />
                    </label>
                    <p className="muted">
                      Email: {account.user.email}. Contact the store if you need
                      help with your account email.
                    </p>
                    <button className="button" disabled={busy}>
                      Save profile
                    </button>
                  </form>
                )}
                {tab === "Addresses" && (
                  <>
                    <h2>Saved addresses</h2>
                    <div className="address-grid">
                      {account.addresses.map((a) => (
                        <article className="info-card" key={a.id}>
                          <h3>{a.label}</h3>
                          <p>
                            {a.name}
                            <br />
                            {a.address}
                            <br />
                            {a.city}, {a.state} — {a.pincode}
                            <br />
                            {a.phone}
                          </p>
                          <button
                            className="text-link"
                            disabled={busy}
                            onClick={() =>
                              action(
                                "/api/account/addresses/" + a.id,
                                "DELETE",
                                null,
                                "Address removed.",
                              )
                            }
                          >
                            Remove address
                          </button>
                        </article>
                      ))}
                    </div>
                    <form
                      className="account-form"
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        if (
                          await action(
                            "/api/account/addresses",
                            "POST",
                            Object.fromEntries(new FormData(form)),
                            "Address saved.",
                          )
                        )
                          form.reset();
                      }}
                    >
                      <h3>Add an address</h3>
                      <div className="form-grid">
                        {[
                          ["label", "Label (e.g. Home)"],
                          ["name", "Recipient name"],
                          ["phone", "Phone number"],
                          ["pincode", "PIN code"],
                          ["city", "City"],
                          ["state", "State"],
                        ].map(([name, label]) => (
                          <label key={name}>
                            {label}
                            <input
                              name={name}
                              required
                              maxLength={name === "pincode" ? 6 : 100}
                              type={name === "phone" ? "tel" : "text"}
                              inputMode={
                                name === "pincode" ? "numeric" : undefined
                              }
                              pattern={
                                name === "pincode" ? "[1-9][0-9]{5}" : undefined
                              }
                            />
                          </label>
                        ))}
                        <label className="span-two">
                          Street address
                          <textarea name="address" required maxLength={500} />
                        </label>
                      </div>
                      <button
                        className="button"
                        disabled={busy || account.addresses.length >= 10}
                      >
                        Save address
                      </button>
                    </form>
                  </>
                )}
                {tab === "Security" && (
                  <form
                    className="account-form stack-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      action(
                        "/api/account/password",
                        "POST",
                        Object.fromEntries(new FormData(e.currentTarget)),
                        "Password changed. All sessions have been signed out. Please sign in again.",
                      );
                    }}
                  >
                    <h2>Change password</h2>
                    <label>
                      Current password
                      <input
                        name="currentPassword"
                        type="password"
                        autoComplete="current-password"
                        required
                        maxLength={128}
                      />
                    </label>
                    <label>
                      New password
                      <input
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={10}
                        maxLength={128}
                      />
                    </label>
                    <p className="muted">
                      Use 10–128 characters. Changing your password signs you
                      out on all devices.
                    </p>
                    <button className="button" disabled={busy}>
                      Change password
                    </button>
                  </form>
                )}
              </>
            )}
          </>
        )}
      </section>
    </Shell>
  );
}
