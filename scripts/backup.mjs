import { DatabaseSync, backup } from "node:sqlite";
import { mkdir, cp, access, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
const commerce = resolve(process.env.COMMERCE_DATA_DIR || ".data");
const sessions = resolve(process.env.SESSION_DATA_DIR || ".data");
const destination = join(
  resolve(process.env.BACKUP_DIR || ".data/backups"),
  new Date().toISOString().replaceAll(":", "-") + "-" + process.pid,
);
await mkdir(destination, { recursive: true });
for (const [directory, name] of [
  [commerce, "commerce.sqlite"],
  [sessions, "sessions.sqlite"],
  [sessions, "limits.sqlite"],
]) {
  const source = join(directory, name);
  try {
    await access(source);
  } catch {
    continue;
  }
  const db = new DatabaseSync(source, { readOnly: true });
  try {
    await backup(db, join(destination, name));
  } finally {
    db.close();
  }
  const check = new DatabaseSync(join(destination, name), { readOnly: true });
  try {
    if (check.prepare("PRAGMA integrity_check").get().integrity_check !== "ok")
      throw new Error("Backup integrity check failed: " + name);
  } finally {
    check.close();
  }
}
try {
  await access("public/images/uploads");
  await cp("public/images/uploads", join(destination, "uploads"), {
    recursive: true,
    errorOnExist: true,
    force: false,
  });
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}
await writeFile(
  join(destination, "RESTORE.txt"),
  "Private store backup. Stop the application before restoring. Copy commerce.sqlite into COMMERCE_DATA_DIR and the sessions/limits databases into SESSION_DATA_DIR. Do not leave older -wal or -shm sidecars in the target directory: restore into fresh directories and point the environment variables there. Copy uploads into public/images/uploads. Keep the existing catalog images and application source. Restart and verify sign-in, products and orders. Each database is a consistent snapshot; snapshots across databases are sequential.\n",
);
console.log("Verified backup saved to " + destination);
