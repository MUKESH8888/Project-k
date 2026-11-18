import { sessionUser } from "../../../../../lib/session";
import { guard } from "../../../../../lib/request";
import { Db } from "../../../../../lib/db";
export async function POST(request, { params }) {
  const rejected = await guard(request);
  if (rejected) return rejected;
  const user = await sessionUser(request);
  if (!user)
    return Response.json({ error: "Please sign in." }, { status: 401 });
  try {
    const order = await Db.cancelOwnOrder(user.id, (await params).id);
    return Response.json(order ? { order } : { error: "Order not found." }, {
      status: order ? 200 : 404,
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 409 });
  }
}
