import { Db } from "../../lib/db";
import { Catalog } from "../../components/Store";
export const dynamic = "force-dynamic";
export const metadata = { title: "Shop the collection | Kalyanam" };
export default async function Page({ searchParams }) {
  const q = await searchParams;
  return (
    <Catalog
      key={JSON.stringify(q)}
      products={await Db.getProducts()}
      initial={{ ...q, department: q.department || q.dept }}
    />
  );
}
