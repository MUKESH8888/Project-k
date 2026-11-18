import { sessionUser } from "../../../../../lib/session";
import { guard } from "../../../../../lib/request";
import { Db } from "../../../../../lib/db";
export async function DELETE(request, { params }) {
  const rejected = await guard(request);
  if (rejected) return rejected;
  const user = await sessionUser(request);
  if (!user)
    return Response.json({ error: "Please sign in." }, { status: 401 });
  const removed = await Db.removeAddress(user.id, (await params).id);
  return Response.json(
    removed ? { success: true } : { error: "Address not found." },
    { status: removed ? 200 : 404 },
  );
}
