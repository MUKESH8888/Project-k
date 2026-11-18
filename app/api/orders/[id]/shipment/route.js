import { requireAdmin } from "../../../../../lib/session";
import { guard, readJson } from "../../../../../lib/request";
import { Db } from "../../../../../lib/db";
export async function PUT(request, { params }) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  const rejected = await guard(request);
  if (rejected) return rejected;
  try {
    const order = await Db.updateShipment(
      (await params).id,
      await readJson(request),
    );
    return Response.json(order ? { order } : { error: "Order not found." }, {
      status: order ? 200 : 404,
    });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}
