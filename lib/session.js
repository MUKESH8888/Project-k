import { randomBytes, createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { currentUser } from "./db.js";
const directory = process.env.SESSION_DATA_DIR || join(process.cwd(), ".data");
mkdirSync(directory, { recursive: true });
const db = new DatabaseSync(join(directory, "sessions.sqlite"));
db.exec(
  "PRAGMA busy_timeout=10000; PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user TEXT NOT NULL, expires INTEGER NOT NULL)",
);
const digest = (value) => createHash("sha256").update(value).digest("hex");
export function createSession(user) {
  const token = randomBytes(32).toString("hex");
  const safe = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    authVersion: currentUser(user.id)?.authVersion || 0,
  };
  db.prepare("DELETE FROM sessions WHERE expires < ?").run(Date.now());
  db.prepare("INSERT INTO sessions VALUES (?, ?, ?)").run(
    digest(token),
    JSON.stringify(safe),
    Date.now() + 604800000,
  );
  return token;
}
export function sessionUser(request) {
  const token = request.cookies.get("kalyanam_session")?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const row = db
    .prepare("SELECT user FROM sessions WHERE token = ? AND expires > ?")
    .get(digest(token), Date.now());
  if (!row) return null;
  const session = JSON.parse(row.user),
    user = currentUser(session.id);
  if (!user || (session.authVersion || 0) !== user.authVersion) return null;
  return user;
}
export function revokeUserSessions(userId) {
  db.prepare("DELETE FROM sessions WHERE json_extract(user,'$.id')=?").run(
    userId,
  );
}
export function deleteSession(request) {
  const token = request.cookies.get("kalyanam_session")?.value;
  if (token)
    db.prepare("DELETE FROM sessions WHERE token = ?").run(digest(token));
}
export function requireAdmin(request) {
  const user = sessionUser(request);
  if (!user)
    return Response.json({ error: "Please sign in." }, { status: 401 });
  if (user.role !== "admin")
    return Response.json(
      { error: "Administrator access required." },
      { status: 403 },
    );
  const origin = request.headers.get("origin");
  if (
    request.method !== "GET" &&
    origin &&
    origin !== (process.env.APP_ORIGIN || new URL(request.url).origin)
  )
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  return null;
}
