import { sessionUser } from "../../../../lib/session";
import { guard, readJson } from "../../../../lib/request";
import { Db } from "../../../../lib/db";
export async function POST(request) {
  const rejected = guard(request);
  if (rejected) return rejected;
  const user = sessionUser(request);
  if (!user)
    return Response.json({ error: "Please sign in." }, { status: 401 });
  try {
    return Response.json(
      { address: await Db.saveAddress(user.id, await readJson(request)) },
      { status: 201 },
    );
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}
