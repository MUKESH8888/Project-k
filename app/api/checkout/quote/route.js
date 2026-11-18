import { guard, readJson } from "../../../../lib/request";
import { Db } from "../../../../lib/db";
export async function POST(request) {
  const rejected = guard(request);
  if (rejected) return rejected;
  try {
    const body = await readJson(request);
    return Response.json(
      { quote: await Db.quoteOrder(body.items) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return Response.json({ error: e.message }, { status: 400 });
  }
}
