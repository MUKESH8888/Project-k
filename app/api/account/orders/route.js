import { sessionUser } from "../../../../lib/session";
import { Db } from "../../../../lib/db";
export async function GET(request) {
  const user = sessionUser(request);
  if (!user)
    return Response.json({ error: "Please sign in." }, { status: 401 });
  return Response.json(
    { orders: (await Db.getOrders()).filter((o) => o.userId === user.id) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
