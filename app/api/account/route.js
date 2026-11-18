import { sessionUser } from "../../../lib/session";
import { guard, readJson } from "../../../lib/request";
import { Db } from "../../../lib/db";
export async function GET(request) {
  const user = await sessionUser(request);
  if (!user)
    return Response.json({ error: "Please sign in." }, { status: 401 });
  return Response.json(await Db.getAccount(user.id), {
    headers: { "Cache-Control": "no-store" },
  });
}
export async function PUT(request) {
  const rejected = await guard(request);
  if (rejected) return rejected;
  const user = await sessionUser(request);
  if (!user)
    return Response.json({ error: "Please sign in." }, { status: 401 });
  try {
    return Response.json({
      user: await Db.updateProfile(user.id, await readJson(request)),
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}
