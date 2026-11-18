"use client";
import Link from "next/link";
import { useCart } from "./CartContext";
import { Shell, ProductCard } from "./Store";
export default function Wishlist({ products }) {
  const { wishlist, ready } = useCart();
  const saved = products.filter((p) => wishlist.includes(p.id));
  return (
    <Shell>
      <section className="section wrap">
        <p className="eyebrow">A LITTLE INSPIRATION, SAVED</p>
        <h1>
          Your <em>wishlist.</em>
        </h1>
        {!ready ? (
          <p>Loading your favourites…</p>
        ) : saved.length ? (
          <div className="product-grid">
            {saved.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Room for something beautiful.</h2>
            <p>Tap the heart on a piece to save it here.</p>
            <Link className="button" href="/sarees">
              Explore the collection
            </Link>
          </div>
        )}
      </section>
    </Shell>
  );
}
