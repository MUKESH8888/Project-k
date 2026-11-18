import { Db } from "../lib/db";
import { Home } from "../components/Store";
export const dynamic = "force-dynamic";
export default async function Page() {
  return <Home products={await Db.getProducts()} />;
}
