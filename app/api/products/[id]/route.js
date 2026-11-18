import { guard, readJson } from "../../../../lib/request";
import { requireAdmin } from "../../../../lib/session";
import { NextResponse } from "next/server";
import { Db } from "../../../../lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await Db.getProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const rejected = await guard(request);
  if (rejected) return rejected;

  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await readJson(request);

    const updated = await Db.updateProduct(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const rejected = await guard(request);
  if (rejected) return rejected;

  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    const deleted = await Db.deleteProduct(id);

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product removed from catalog",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
