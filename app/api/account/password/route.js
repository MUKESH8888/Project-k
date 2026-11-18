import { NextResponse } from "next/server";
import { sessionUser, revokeUserSessions } from "../../../../lib/session";
import { guard, readJson } from "../../../../lib/request";
import { Db } from "../../../../lib/db";
export async function POST(request) {
  const rejected = await guard(request);
  if (rejected) return rejected;
  const user = await sessionUser(request);
  if (!user)
    return Response.json({ error: "Please sign in." }, { status: 401 });
  try {
    const body = await readJson(request);
    await Db.changePassword(user.id, body.currentPassword, body.newPassword);
    await revokeUserSessions(user.id);
    const response = NextResponse.json({ success: true });
    response.cookies.set("kalyanam_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}
