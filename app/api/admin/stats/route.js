import { requireAdmin } from "../../../../lib/session";
import { NextResponse } from "next/server";
import { Db } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  try {
    const stats = await Db.getAdminStats();
    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch admin stats" },
      { status: 500 },
    );
  }
}
