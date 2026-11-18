import { sessionUser } from "../../../../lib/session";
export async function GET(request) {
  const user = sessionUser(request);
  return Response.json(
    { authenticated: Boolean(user), user },
    { headers: { "Cache-Control": "no-store" } },
  );
}
