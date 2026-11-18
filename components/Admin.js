"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./AuthContext";
import { money } from "./Store";
const images = [
  "kanchipuram-pattu",
  "designer-saree",
  "gadwal-pattu",
  "banarasi-pattu",
  "pochampally-ikat",
  "men-pattu-panche",
  "men-royal-sherwani",
  "kids-pattu-pavada",
  "kids-boys-kurta",
];
async function api(url, method = "GET", body) {
  const r = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Request failed");
  return d;
}
export default function Admin() {
  const { user, loading, openLogin, logout } = useAuth();
  const [tab, setTab] = useState("Overview"),
    [data, setData] = useState(null),
    [error, setError] = useState(""),
    [editor, setEditor] = useState(null),
    [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const [stats, products, orders, appointments, messages] =
        await Promise.all(
          [
            "/api/admin/stats",
            "/api/products",
            "/api/orders",
            "/api/appointments",
            "/api/contact",
          ].map((u) => api(u)),
        );
      setData({
        stats: stats.stats,
        products: products.products,
        orders: orders.orders,
        appointments: appointments.appointments,
        messages: messages.messages,
      });
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, []);
  useEffect(() => {
    // refresh updates state only after the network requests settle.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user?.role === "admin") refresh();
  }, [user, refresh]);
  async function action(url, method, body) {
    setBusy(true);
    try {
      await api(url, method, body);
      setEditor(null);
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <div className="empty-state">Checking access…</div>;
  if (user?.role !== "admin")
    return (
      <main id="main-content" className="empty-state">
        <Link className="wordmark" href="/">
          kalyanam
        </Link>
        <h1>Store management</h1>
        <p>
          {user
            ? "This account does not have administrator access."
            : "Sign in with your administrator account to continue."}
        </p>
        {user ? (
          <button className="button" onClick={logout}>
            Sign out
          </button>
        ) : (
          <button className="button" onClick={openLogin}>
            Sign in
          </button>
        )}
        <Link className="text-link" href="/">
          Back to storefront
        </Link>
      </main>
    );
  return (
    <div className="admin-shell">
      <header className="admin-top">
        <Link className="wordmark" href="/">
          kalyanam
        </Link>
        <span>STORE MANAGEMENT · {user.name}</span>
        <Link className="text-link" href="/">
          View storefront ↗
        </Link>
        <button className="text-link" onClick={logout}>
          Sign out
        </button>
      </header>
      <main id="main-content" className="admin-body">
        <h1>Your store, at a glance.</h1>
        <p>Live orders, inventory and customer enquiries.</p>
        <nav className="admin-tabs" aria-label="Store management">
          {["Overview", "Products", "Orders", "Appointments", "Enquiries"].map(
            (t) => (
              <button
                className={tab === t ? "active" : ""}
                key={t}
                onClick={() => {
                  setTab(t);
                  setEditor(null);
                }}
              >
                {t}
              </button>
            ),
          )}
        </nav>
        {error && (
          <p className="form-error" role="alert">
            {error} <button onClick={refresh}>Retry</button>
          </p>
        )}
        {!data ? (
          <p>Loading store data…</p>
        ) : (
          <>
            {tab === "Overview" && (
              <>
                <div className="stat-grid">
                  {[
                    ["Collected revenue", money(data.stats.totalRevenue)],
                    ["Orders", data.stats.ordersCount],
                    ["Appointments", data.stats.appointmentsCount],
                    ["Low-stock pieces", data.stats.lowStockCount],
                  ].map(([title, value]) => (
                    <div className="stat-card" key={title}>
                      <span>{title}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
                <div className="admin-heading">
                  <h2>Recent orders</h2>
                  <button
                    className="text-link"
                    onClick={() => setTab("Orders")}
                  >
                    View all orders
                  </button>
                </div>
                <Orders
                  orders={data.orders.slice(0, 6)}
                  busy={busy}
                  action={action}
                />
              </>
            )}
            {tab === "Products" && (
              <>
                <div className="admin-heading">
                  <h2>Catalog & inventory</h2>
                  <button className="button" onClick={() => setEditor({})}>
                    Add product
                  </button>
                </div>
                {editor && (
                  <form
                    className="admin-form"
                    key={editor.id || "new"}
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = new FormData(e.currentTarget);
                      const file = form.get("photo");
                      form.delete("photo");
                      const values = Object.fromEntries(form);
                      setBusy(true);
                      try {
                        if (file?.size) {
                          const upload = new FormData();
                          upload.set("photo", file);
                          const response = await fetch("/api/uploads", {
                            method: "POST",
                            body: upload,
                          });
                          const result = await response.json();
                          if (!response.ok) throw new Error(result.error);
                          values.image = result.image;
                        }
                        await action(
                          "/api/products" + (editor.id ? "/" + editor.id : ""),
                          editor.id ? "PUT" : "POST",
                          values,
                        );
                      } catch (error) {
                        setError(error.message);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <h3>{editor.id ? "Edit product" : "New product"}</h3>
                    <div className="form-grid">
                      <label className="span-two">
                        Product name
                        <input
                          name="title"
                          required
                          maxLength={200}
                          defaultValue={editor.title}
                        />
                      </label>
                      <label>
                        Department
                        <select
                          name="department"
                          defaultValue={editor.department || "women"}
                        >
                          <option value="women">Women</option>
                          <option value="men">Men</option>
                          <option value="kids">Kids</option>
                        </select>
                      </label>
                      <label>
                        Collection
                        <input
                          name="category"
                          required
                          defaultValue={editor.category || "Occasionwear"}
                        />
                      </label>
                      <label>
                        Price (₹)
                        <input
                          type="number"
                          name="price"
                          min="1"
                          step="0.01"
                          required
                          defaultValue={editor.price}
                        />
                      </label>
                      <label>
                        Available stock
                        <input
                          type="number"
                          name="stock"
                          min="0"
                          step="1"
                          required
                          defaultValue={editor.stock ?? 0}
                        />
                      </label>
                      <label className="span-two">
                        Catalog photograph
                        <select
                          name="image"
                          defaultValue={
                            editor.image ||
                            "/images/products/kanchipuram-pattu.jpg"
                          }
                        >
                          {(editor.image?.includes("/uploads/") ||
                            editor.image?.startsWith("/media/")) && (
                            <option value={editor.image}>
                              Uploaded photograph
                            </option>
                          )}
                          {images.map((i) => (
                            <option
                              key={i}
                              value={"/images/products/" + i + ".jpg"}
                            >
                              {i.replaceAll("-", " ")}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="span-two">
                        Or upload a new photograph
                        <input
                          type="file"
                          name="photo"
                          accept="image/jpeg,image/png,image/webp"
                        />
                        <small>
                          JPEG, PNG or WebP, up to 5 MB. A new upload replaces
                          the selected catalog photograph.
                        </small>
                      </label>
                      <label className="span-two">
                        Description
                        <textarea
                          name="description"
                          defaultValue={editor.description}
                        />
                      </label>
                    </div>
                    <button className="button" disabled={busy}>
                      {busy ? "Saving…" : "Save product"}
                    </button>{" "}
                    <button
                      className="text-link"
                      type="button"
                      onClick={() => setEditor(null)}
                    >
                      Cancel
                    </button>
                  </form>
                )}
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Piece</th>
                        <th>Product</th>
                        <th>Collection</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.products.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <Image
                              src={p.image}
                              width={45}
                              height={60}
                              alt=""
                            />
                          </td>
                          <td>{p.title}</td>
                          <td>{p.category}</td>
                          <td>{money(p.price)}</td>
                          <td>{p.stock}</td>
                          <td>
                            <button
                              className="text-link"
                              onClick={() => setEditor(p)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-link"
                              disabled={busy}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Remove ${p.title} from the catalog? Existing order records will remain.`,
                                  )
                                )
                                  action("/api/products/" + p.id, "DELETE");
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {tab === "Orders" && (
              <Orders orders={data.orders} busy={busy} action={action} />
            )}
            {tab === "Appointments" && (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Phone</th>
                      <th>Date / time (IST)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.appointments.map((a) => (
                      <tr key={a.id}>
                        <td>{a.customerName}</td>
                        <td>{a.customerPhone}</td>
                        <td>
                          {a.date}
                          <br />
                          {a.slot}
                        </td>
                        <td>
                          <select
                            aria-label={`Status for ${a.customerName}`}
                            disabled={busy}
                            value={a.status}
                            onChange={(e) =>
                              action("/api/appointments/" + a.id, "PUT", {
                                status: e.target.value,
                              })
                            }
                          >
                            {[
                              "Requested",
                              "Booked",
                              "Completed",
                              "Cancelled",
                            ].map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!data.appointments.length && (
                  <p className="empty-state">No appointments yet.</p>
                )}
              </div>
            )}
            {tab === "Enquiries" && (
              <div>
                {data.messages.length ? (
                  data.messages.map((m) => (
                    <article className="order-record" key={m.id}>
                      <strong>{m.name}</strong>
                      <p>{m.email}</p>
                      <p style={{ whiteSpace: "pre-wrap" }}>{m.message}</p>
                      <a
                        className="text-link"
                        href={"mailto:" + encodeURIComponent(m.email)}
                      >
                        Reply by email ↗
                      </a>
                    </article>
                  ))
                ) : (
                  <p className="empty-state">No customer enquiries yet.</p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
function Orders({ orders, busy, action }) {
  const transitions = {
    Confirmed: ["Processing", "Cancelled"],
    Processing: ["Dispatched", "Cancelled"],
    Dispatched: ["Delivered"],
    Delivered: [],
    Cancelled: [],
  };
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer / delivery</th>
            <th>Items</th>
            <th>Total / payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <strong>{o.id}</strong>
                <br />
                {new Date(o.createdAt).toLocaleDateString("en-IN")}
              </td>
              <td>
                {o.customerName}
                <br />
                {o.customerEmail}
                <br />
                {o.customerPhone}
                <p>{o.shippingAddress}</p>
              </td>
              <td>
                {o.items.map((i) => (
                  <p key={i.productId}>
                    {i.title} × {i.quantity}
                  </p>
                ))}
              </td>
              <td>
                {money(o.totalAmount)}
                <br />
                {o.paymentStatus}
              </td>
              <td>
                <select
                  disabled={busy || !transitions[o.status]?.length}
                  aria-label={`Status for ${o.id}`}
                  value={o.status}
                  onChange={(e) =>
                    action("/api/orders/" + o.id, "PUT", {
                      status: e.target.value,
                    })
                  }
                >
                  <option>{o.status}</option>
                  {transitions[o.status]?.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {o.status !== "Cancelled" && (
                  <details className="shipment-editor">
                    <summary>Shipment details</summary>
                    <form
                      className="stack-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        action(
                          "/api/orders/" + o.id + "/shipment",
                          "PUT",
                          Object.fromEntries(new FormData(e.currentTarget)),
                        );
                      }}
                    >
                      <label>
                        Courier
                        <input
                          name="carrier"
                          required
                          maxLength={100}
                          defaultValue={o.shipment?.carrier || ""}
                        />
                      </label>
                      <label>
                        Tracking number
                        <input
                          name="trackingNumber"
                          required
                          maxLength={100}
                          defaultValue={o.shipment?.trackingNumber || ""}
                        />
                      </label>
                      <label>
                        Tracking link (optional)
                        <input
                          name="trackingUrl"
                          type="url"
                          placeholder="https://…"
                          defaultValue={o.shipment?.trackingUrl || ""}
                        />
                      </label>
                      <button className="button" disabled={busy}>
                        Save tracking
                      </button>
                    </form>
                  </details>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!orders.length && (
        <p className="empty-state">
          Orders will appear here when customers check out.
        </p>
      )}
    </div>
  );
}
