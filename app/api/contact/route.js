import { guard, readJson } from "../../../lib/request";
import { Db } from "../../../lib/db";
import { requireAdmin } from "../../../lib/session";
export async function POST(request) {
  const rejected = await guard(request);
  if (rejected) return rejected;
  try {
    await Db.createMessage(await readJson(request));
    return Response.json({ success: true }, { status: 201 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}
export async function GET(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;
  return Response.json({ messages: await Db.getMessages() });
}
