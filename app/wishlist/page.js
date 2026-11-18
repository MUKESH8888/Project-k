import { Db } from "../../lib/db";
import Wishlist from "../../components/Wishlist";
export const dynamic = "force-dynamic";
export default async function Page() {
  return <Wishlist products={await Db.getProducts()} />;
}
