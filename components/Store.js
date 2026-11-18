"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartContext";
import Header from "./Header";
import Footer from "./Footer";
import Icon from "./Icons";
export const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
export function Shell({ children }) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
export function ProductCard({ product: p }) {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  return (
    <article className="product-card">
      <div className="product-photo">
        <Link href={"/product/" + p.id}>
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(max-width:600px) 50vw,(max-width:1000px) 33vw,25vw"
          />
        </Link>
        <span className="product-tag">
          {p.stock === 0 ? "Sold out" : p.category}
        </span>
        <button
          className={`wish-button ${wishlist.includes(p.id) ? "saved" : ""}`}
          aria-label={`${wishlist.includes(p.id) ? "Remove" : "Save"} ${p.title} ${wishlist.includes(p.id) ? "from" : "to"} wishlist`}
          aria-pressed={wishlist.includes(p.id)}
          onClick={() => toggleWishlist(p.id)}
        >
          <Icon name="heart" size={19} />
        </button>
      </div>
      <div className="product-meta">
        <p>
          {p.department === "women"
            ? "THE SAREE COLLECTION"
            : p.department === "men"
              ? "FOR HIM"
              : "LITTLE CELEBRATIONS"}
        </p>
        <Link href={"/product/" + p.id}>
          <h3>{p.title}</h3>
        </Link>
        <div className="price">
          {money(p.price)}
          {p.originalPrice > p.price && <del>{money(p.originalPrice)}</del>}
        </div>
        <button
          className="card-add"
          disabled={p.stock === 0}
          onClick={() => addToCart(p)}
          aria-label={`Add ${p.title} to bag`}
        >
          {p.stock === 0 ? "Sold out" : "Add to bag"}
          <Icon name="bag" size={17} />
        </button>
      </div>
    </article>
  );
}
export function Home({ products }) {
  const { setIsConsultationModalOpen } = useCart();
  const [department, setDepartment] = useState("all");
  const selection = products.filter(
    (p) => department === "all" || p.department === department,
  );
  return (
    <Shell>
      <section className="shop-hero wrap">
        <div className="shop-hero-copy">
          <p className="eyebrow">THE CELEBRATION COLLECTION</p>
          <h1>
            Celebrate in <em>style.</em>
          </h1>
          <p>Sarees, menswear and festive favourites for your whole family.</p>
          <a className="button" href="#shop-products">
            Shop now <Icon name="arrow" size={18} />
          </a>
        </div>
        <div className="shop-hero-photo">
          <Image
            src="/images/banners/hero-bridal.jpg"
            alt="A bride wearing a richly woven silk saree"
            fill
            priority
            sizes="(max-width:700px) 45vw,55vw"
          />
        </div>
      </section>
      <section className="home-products wrap" id="shop-products">
        <div className="section-heading">
          <div>
            <h2>Find your favourite</h2>
            <p>Beautiful pieces. Ready for your next celebration.</p>
          </div>
          <Link className="text-link" href="/sarees">
            View all products <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="shop-tabs" role="group" aria-label="Shop by department">
          {[
            ["all", "All products"],
            ["women", "Sarees"],
            ["men", "Men"],
            ["kids", "Kids"],
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={department === value}
              className={department === value ? "active" : ""}
              onClick={() => setDepartment(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="product-grid">
          {selection.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {!selection.length && (
          <p className="empty-state">
            This collection is being updated. Please explore another category.
          </p>
        )}
      </section>
      <section className="shopping-help wrap">
        <div>
          <h2>Need help choosing?</h2>
          <p>Explore colours and fabrics with our team, online or in store.</p>
        </div>
        <button
          className="button outline"
          onClick={() => setIsConsultationModalOpen(true)}
        >
          Book an appointment
        </button>
        <Link className="text-link" href="/stores">
          Find a store ↗
        </Link>
      </section>
    </Shell>
  );
}
export function Catalog({ products, initial = {} }) {
  const [department, setDepartment] = useState(initial.department || "all"),
    [category, setCategory] = useState(initial.category || ""),
    [search, setSearch] = useState(initial.search || ""),
    [sort, setSort] = useState("featured"),
    [budget, setBudget] = useState("all");
  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (department === "all" || p.department === department) &&
        (!category ||
          p.category.toLowerCase().includes(category.toLowerCase())) &&
        (!search ||
          `${p.title} ${p.category} ${p.colorFamily}`
            .toLowerCase()
            .includes(search.toLowerCase())) &&
        (budget === "all" || p.price <= Number(budget)),
    );
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, department, category, search, sort, budget]);
  return (
    <Shell>
      <section className="catalog-intro wrap">
        <p className="eyebrow">THE KALYANAM COLLECTION</p>
        <h1>
          Find your <em>forever favourite.</em>
        </h1>
        <p>
          Beautiful weaves. Thoughtful details. Something for every celebration.
        </p>
      </section>
      <section className="wrap catalog">
        <div className="department-tabs">
          {[
            ["all", "All collections"],
            ["women", "Sarees"],
            ["men", "Men"],
            ["kids", "Kids"],
          ].map(([v, label]) => (
            <button
              key={v}
              className={department === v ? "active" : ""}
              onClick={() => {
                setDepartment(v);
                setCategory("");
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="catalog-controls">
          <label>
            Search
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find your favourite weave"
            />
          </label>
          <label>
            Weave
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All weaves</option>
              {[...new Set(products.map((p) => p.category))].map((c) => (
                <option key={c}>{c}</option>
              ))}
              {category && !products.some((p) => p.category === category) && (
                <option>{category}</option>
              )}
            </select>
          </label>
          <label>
            Price
            <select value={budget} onChange={(e) => setBudget(e.target.value)}>
              <option value="all">All prices</option>
              <option value="10000">Under â‚¹10,000</option>
              <option value="25000">Under â‚¹25,000</option>
              <option value="50000">Under â‚¹50,000</option>
            </select>
          </label>
          <label>
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Our selection</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>
        <p className="result-count" aria-live="polite">
          {filtered.length} thoughtfully selected pieces
        </p>
        {filtered.length ? (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No pieces found</h2>
            <p>Try a different weave, price or search.</p>
            <button
              className="button"
              onClick={() => {
                setSearch("");
                setCategory("");
                setDepartment("all");
                setBudget("all");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </Shell>
  );
}
export function Product({ product: p, related }) {
  const { addToCart, wishlist, toggleWishlist, setIsConsultationModalOpen } =
    useCart();
  const [qty, setQty] = useState(1);
  return (
    <Shell>
      <div className="wrap product-detail">
        <nav className="breadcrumb">
          <Link href="/">Home</Link> / <Link href="/sarees">Collections</Link> /{" "}
          {p.category}
        </nav>
        <div className="detail-grid">
          <div className="detail-photo">
            <Image
              src={p.image}
              alt={p.title}
              fill
              priority
              sizes="(max-width:700px) 100vw,50vw"
            />
          </div>
          <div className="detail-copy">
            <p className="eyebrow">{p.category}</p>
            <h1>{p.title}</h1>
            <p className="detail-subtitle">{p.telugu}</p>
            <div className="price large">
              {money(p.price)}
              {p.originalPrice > p.price && <del>{money(p.originalPrice)}</del>}
            </div>
            <p className="muted">Inclusive of applicable taxes</p>
            <p>{p.description}</p>
            <p className="stock-note">
              {p.stock > 0
                ? `${p.stock} available Â· Ready for your celebration`
                : "Currently sold out"}
            </p>
            <div className="buy-row">
              <label className="quantity">
                Quantity
                <select
                  aria-label="Quantity"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {Array.from(
                    { length: Math.min(p.stock, 20) || 1 },
                    (_, i) => (
                      <option key={i}>{i + 1}</option>
                    ),
                  )}
                </select>
              </label>
              <button
                className="button"
                disabled={!p.stock}
                onClick={() => addToCart(p, null, qty)}
              >
                Add to bag <Icon name="bag" size={18} />
              </button>
              <button
                className="icon-button"
                aria-label="Save to wishlist"
                aria-pressed={wishlist.includes(p.id)}
                onClick={() => toggleWishlist(p.id)}
              >
                <Icon name="heart" />
              </button>
            </div>
            <div className="delivery-note">
              <Icon name="truck" />
              <span>
                Complimentary delivery on orders â‚¹5,000+
                <br />
                <small>
                  â‚¹199 delivery below â‚¹5,000 Â· Cash on delivery
                </small>
              </span>
            </div>
            <details open>
              <summary>The details</summary>
              <p>
                {p.category}. Colour: {p.colorFamily || "As pictured"}. Please
                refer to the product image for design and finish. Minor colour
                variations can occur between screens.
              </p>
            </details>
            <details>
              <summary>Care & keeping</summary>
              <p>
                Professional dry cleaning recommended for silk and embellished
                pieces. Store folded in a breathable cotton cover, away from
                direct sunlight.
              </p>
            </details>
            <details>
              <summary>Delivery & returns</summary>
              <p>
                Our team confirms dispatch and delivery timing after your order.{" "}
                <Link href="/shipping">
                  Read delivery and return information.
                </Link>
              </p>
            </details>
            <button
              className="text-link consultation-link"
              onClick={() => setIsConsultationModalOpen(true)}
            >
              Need a closer look? Request an appointment â†—
            </button>
          </div>
        </div>
      </div>
      <section className="section wrap">
        <div className="section-heading">
          <h2>
            You may also <em>love.</em>
          </h2>
        </div>
        <div className="product-grid">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </Shell>
  );
}
