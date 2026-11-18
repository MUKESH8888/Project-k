"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import Icon from "./Icons";
export default function Header() {
  const [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false);
  const { cartCount } = useCart(),
    { user, openLogin } = useAuth(),
    router = useRouter();
  const links = [
    ["New arrivals", "/sarees"],
    ["Sarees", "/sarees?department=women"],
    ["The wedding edit", "/sarees?category=Bridal"],
    ["Men", "/sarees?department=men"],
    ["Little celebrations", "/sarees?department=kids"],
    ["Our story", "/about"],
  ];
  return (
    <header className="site-header">
      <div className="announcement">
        Beautiful traditions. New beginnings.{" "}
        <span>Complimentary delivery on orders ₹5,000+</span>
      </div>
      <div className="header-main wrap">
        <button
          className="icon-button mobile-menu"
          aria-label="Open navigation"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          <Icon name={menu ? "close" : "menu"} />
        </button>
        <Link href="/" className="wordmark" aria-label="Kalyanam home">
          kalyanam<span>THE ART OF CELEBRATION</span>
        </Link>
        <div className="header-note">
          Rooted in tradition.
          <br />
          Made for your moments.
        </div>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Search collections"
            aria-expanded={search}
            onClick={() => setSearch(!search)}
          >
            <Icon name="search" />
          </button>
          <Link className="icon-button" href="/wishlist" aria-label="Wishlist">
            <Icon name="heart" />
          </Link>
          {user ? (
            <Link
              className="icon-button"
              href="/account"
              aria-label="My account"
            >
              <Icon name="user" />
            </Link>
          ) : (
            <button
              className="icon-button"
              onClick={openLogin}
              aria-label="Sign in"
            >
              <Icon name="user" />
            </button>
          )}
          <Link
            className="icon-button bag-link"
            href="/cart"
            aria-label={`Shopping bag, ${cartCount} items`}
          >
            <Icon name="bag" />
            <span>{cartCount}</span>
          </Link>
        </div>
      </div>
      <nav
        className={`nav-links ${menu ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        {links.map(([label, href]) => (
          <Link key={label} href={href} onClick={() => setMenu(false)}>
            {label}
          </Link>
        ))}
        <Link href="/stores" className="store-link">
          Visit our stores ↗
        </Link>
      </nav>
      {search && (
        <form
          className="search-bar wrap"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(
              "/sarees?search=" +
                encodeURIComponent(new FormData(e.currentTarget).get("q")),
            );
            setSearch(false);
          }}
        >
          <label className="sr-only" htmlFor="site-search">
            Search products
          </label>
          <input
            id="site-search"
            name="q"
            placeholder="Try Kanchipuram, festive, or a favourite colour…"
            autoFocus
            required
          />
          <button className="button">
            Search <Icon name="arrow" size={18} />
          </button>
        </form>
      )}
    </header>
  );
}
