import Link from "next/link";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Link className="wordmark" href="/">
            kalyanam<span>THE ART OF CELEBRATION</span>
          </Link>
          <p>
            For the moments that become memories.
            <br />
            Discover Indian weaves and occasionwear,
            <br />
            chosen with care.
          </p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/sarees">All collections</Link>
          <Link href="/sarees?department=women">Sarees</Link>
          <Link href="/sarees?department=men">Menswear</Link>
          <Link href="/sarees?department=kids">Kidswear</Link>
        </div>
        <div>
          <h3>Here to help</h3>
          <Link href="/contact">Contact us</Link>
          <Link href="/shipping">Delivery & returns</Link>
          <Link href="/account">My account</Link>
          <Link href="/wishlist">Your wishlist</Link>
        </div>
        <div>
          <h3>Come, find your celebration.</h3>
          <p>
            Explore the collection in person.
            <br />
            Gudur · Palakurthy
          </p>
          <Link className="text-link" href="/stores">
            Find a store ↗
          </Link>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Kalyanam Shopping Mall</span>
        <Link href="/privacy">Privacy</Link>
        <span>Thoughtfully Indian.</span>
      </div>
    </footer>
  );
}
