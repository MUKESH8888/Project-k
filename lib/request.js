import { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
const directory = process.env.SESSION_DATA_DIR || join(process.cwd(), ".data");
mkdirSync(directory, { recursive: true });
const db = new DatabaseSync(join(directory, "limits.sqlite"));
db.exec(
  "PRAGMA busy_timeout=10000; CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, count INTEGER, expires INTEGER)",
);
export function guard(request, maxBytes = 32768) {
  const origin = request.headers.get("origin");
  const expected = process.env.APP_ORIGIN || new URL(request.url).origin;
  if (origin && origin !== expected)
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > maxBytes)
    return Response.json({ error: "Request is too large." }, { status: 413 });
  const path = new URL(request.url).pathname;
  const ip =
    process.env.TRUST_PROXY === "true"
      ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
      : "local";
  const key = createHash("sha256").update(`${path}:${ip}`).digest("hex");
  const now = Date.now();
  db.prepare("DELETE FROM limits WHERE expires < ?").run(now);
  const row = db
    .prepare(
      "INSERT INTO limits VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
    )
    .get(key, now + 60000);
  if (row.count > (path.includes("/auth/") ? 20 : 60))
    return Response.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  return null;
}
export async function readJson(request) {
  const text = await request.text();
  if (Buffer.byteLength(text) > 32768) throw new Error("Request is too large.");
  try {
    const body = JSON.parse(text);
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error();
    return body;
  } catch {
    throw new Error("Invalid JSON request.");
  }
}
