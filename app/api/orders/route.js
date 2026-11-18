import { guard, readJson } from "../../../lib/request";
import { sessionUser } from "../../../lib/session";
import { requireAdmin } from "../../../lib/session";
import { NextResponse } from "next/server";
import { Db } from "../../../lib/db";

export async function GET(request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const orders = await Db.getOrders();
    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 400 },
    );
  }
}

export async function POST(request) {
  const rejected = guard(request);
  if (rejected) return rejected;

  try {
    const body = await readJson(request);

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 },
      );
    }

    const newOrder = await Db.createOrder({
      ...body,
      userId: sessionUser(request)?.id || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Auspicious wedding order placed successfully!",
        order: newOrder,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to place order" },
      { status: 400 },
    );
  }
}
