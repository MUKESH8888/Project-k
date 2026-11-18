import { guard } from "../../../../lib/request";
import { deleteSession } from "../../../../lib/session";
import { NextResponse } from "next/server";

export async function POST(request) {
  const rejected = guard(request);
  if (rejected) return rejected;

  deleteSession(request);
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully from Kalyanam Shopping Mall.",
  });

  response.cookies.set("kalyanam_session", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}
