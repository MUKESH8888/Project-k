import { notFound } from "next/navigation";
import { Db } from "../../../lib/db";
import { Product } from "../../../components/Store";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) {
  const p = await Db.getProductById((await params).id);
  return {
    title: p ? `${p.title} | Kalyanam` : "Product not found | Kalyanam",
  };
}
export default async function Page({ params }) {
  const p = await Db.getProductById((await params).id);
  if (!p) notFound();
  return (
    <Product
      product={p}
      related={(await Db.getProducts())
        .filter((x) => x.id !== p.id && x.department === p.department)
        .slice(0, 4)}
    />
  );
}
