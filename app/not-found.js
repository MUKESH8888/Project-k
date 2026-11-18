import Link from "next/link";
import { Shell } from "../components/Store";
export default function NotFound() {
  return (
    <Shell>
      <div className="empty-state">
        <p className="eyebrow">404 · A THREAD OUT OF PLACE</p>
        <h1>Let’s find your way back.</h1>
        <Link className="button" href="/sarees">
          Explore the collection
        </Link>
      </div>
    </Shell>
  );
}
