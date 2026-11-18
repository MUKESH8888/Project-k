"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Shell } from "./Store";
import { useCart } from "./CartContext";
export function About() {
  return (
    <Shell>
      <section className="catalog-intro wrap">
        <p className="eyebrow">THE HEART OF KALYANAM</p>
        <h1>
          Woven into your <em>story.</em>
        </h1>
        <p>Indian tradition. Family celebrations. Memories in the making.</p>
      </section>
      <section className="story-section">
        <div className="story-image">
          <Image
            src="/images/banners/hero-collection.jpg"
            alt="The Kalyanam occasionwear collection"
            fill
            sizes="(max-width:700px) 100vw,50vw"
          />
        </div>
        <div className="story-copy">
          <p className="eyebrow">MORE THAN A WARDROBE</p>
          <h2>
            Something special.
            <br />
            <em>Something yours.</em>
          </h2>
          <p>
            We believe the best outfit is the one that feels like part of your
            story. A rich silk drape, a beautifully detailed sherwani, a little
            festive outfit — each has a place in the moments that bring us
            together.
          </p>
          <p>
            Kalyanam brings sarees and occasionwear for the whole family
            together in one thoughtful collection. Explore online or join us in
            store to find your perfect piece.
          </p>
          <Link className="text-link" href="/sarees">
            Explore the collection ↗
          </Link>
        </div>
      </section>
      <section className="service-section wrap">
        <h2>
          Considered details.
          <br />
          <em>Meaningful moments.</em>
        </h2>
        <p>
          Our team can help you explore colours, compare weaves and plan outfits
          for your occasion.
        </p>
        <Link className="button" href="/stores">
          Meet us in store
        </Link>
      </section>
    </Shell>
  );
}
export function Stores() {
  const { setIsConsultationModalOpen } = useCart();
  return (
    <Shell>
      <section className="section wrap">
        <p className="eyebrow">WE’D LOVE TO SEE YOU</p>
        <h1>
          Feel the weave.
          <br />
          <em>Find your favourite.</em>
        </h1>
        <p>
          Visit our stores to explore the collection in person. Contact our team
          before travelling to confirm opening hours and availability.
        </p>
        <div className="info-grid">
          {[
            ["Gudur", "Palakurthy Road, Gudur, Telangana 506252"],
            [
              "Palakurthy",
              "Palakurthy Main Road, Palakurthy, Telangana 506146",
            ],
          ].map(([name, address]) => (
            <article key={name} className="info-card">
              <p className="eyebrow">KALYANAM SHOPPING MALL</p>
              <h2>{name}</h2>
              <p>{address}</p>
              <a
                className="text-link"
                href={
                  "https://www.google.com/maps/search/?api=1&query=" +
                  encodeURIComponent("Kalyanam Shopping Mall " + address)
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in maps ↗
              </a>
            </article>
          ))}
        </div>
        <section className="service-section">
          <h2>
            Make a little time <em>for yourself.</em>
          </h2>
          <p>Request a personal shopping appointment with our team.</p>
          <button
            className="button"
            onClick={() => setIsConsultationModalOpen(true)}
          >
            Request an appointment
          </button>
        </section>
      </section>
    </Shell>
  );
}
export function Contact() {
  const [busy, setBusy] = useState(false),
    [done, setDone] = useState(false),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setDone(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Shell>
      <section className="section wrap">
        <p className="eyebrow">WE’RE HERE TO HELP</p>
        <h1>
          Let’s start a <em>conversation.</em>
        </h1>
        <div className="info-grid">
          <div>
            <h2>A little help goes a long way.</h2>
            <p>
              Ask about a weave, an order, or finding the right look for your
              occasion. Share your order reference if you have one.
            </p>
            <p>Your message goes directly to the store’s enquiry inbox.</p>
            <Link className="text-link" href="/stores">
              Find a store ↗
            </Link>
          </div>
          <div className="info-card">
            {done ? (
              <div role="status">
                <h2>Thank you for reaching out.</h2>
                <p>
                  Your enquiry has been saved. Our team can reply using the
                  email address you provided.
                </p>
                <button className="text-link" onClick={() => setDone(false)}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="stack-form" onSubmit={submit}>
                <label>
                  Your name
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={100}
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                  />
                </label>
                <label>
                  How can we help?
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    maxLength={3000}
                  />
                </label>
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <button className="button" disabled={busy}>
                  {busy ? "Sending…" : "Send enquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}
export function Policy({ type }) {
  return (
    <Shell>
      <section className="section wrap">
        <div className="prose">
          <p className="eyebrow">A LITTLE CLARITY</p>
          <h1>
            {type === "privacy" ? "Your privacy." : "Delivery & returns."}
          </h1>
          {type === "privacy" ? (
            <>
              <h2>Information you share</h2>
              <p>
                We store the details needed to manage your account, process your
                order and respond to enquiries: your name, email, phone,
                delivery address and order history. Passwords are stored as
                salted hashes.
              </p>
              <h2>Cookies and local storage</h2>
              <p>
                A session cookie keeps you signed in. Your bag and wishlist are
                saved in your browser’s local storage. This storefront does not
                include advertising trackers.
              </p>
              <h2>Your choices</h2>
              <p>
                Contact our team to request access to, correction of, or
                deletion of your information. Some order records may need to be
                retained for accounting and customer support.
              </p>
              <h2>Payment information</h2>
              <p>
                This storefront currently accepts cash on delivery. It does not
                collect card numbers, CVVs or UPI credentials.
              </p>
            </>
          ) : (
            <>
              <h2>Delivery charges</h2>
              <p>
                Delivery is complimentary on orders of ₹5,000 or more. A ₹199
                delivery fee applies below ₹5,000. Charges are shown before you
                place your order.
              </p>
              <h2>Dispatch and delivery</h2>
              <p>
                After your order is placed, our team will contact you to confirm
                dispatch arrangements and an estimated delivery date for your
                address. Delivery timing depends on availability and
                destination. Orders are currently accepted for Indian addresses.
              </p>
              <h2>Payment</h2>
              <p>
                Pay on delivery. Placing your order does not charge you online.
                Your order remains unpaid until payment is collected.
              </p>
              <h2>Changes, concerns and returns</h2>
              <p>
                Contact our team with your order reference before dispatch if
                you need to change or cancel an order. If a piece arrives
                damaged or differs from your order, keep its packaging and
                contact us with photographs. Our team will review the issue and
                explain the available resolution. Do not send a return without
                arranging it with the team.
              </p>
              <h2>Product appearance</h2>
              <p>
                Colours can vary slightly between screens. Ask for a personal
                appointment if you would like to discuss the fabric, finish or
                colour before ordering.
              </p>
            </>
          )}
          <Link className="text-link" href="/contact">
            Contact the team ↗
          </Link>
        </div>
      </section>
    </Shell>
  );
}
