import { createInterface } from "node:readline/promises";
import { DatabaseSync } from "node:sqlite";
import { join } from "node:path";
import { Db } from "../lib/db.js";
const prompt = createInterface({
  input: process.stdin,
  output: process.stdout,
});
try {
  const email =
    process.env.ADMIN_EMAIL || (await prompt.question("Administrator email: "));
  const name =
    process.env.ADMIN_NAME || (await prompt.question("Administrator name: "));
  const password = process.env.ADMIN_PASSWORD;
  if (!password)
    throw new Error(
      "Set ADMIN_PASSWORD in your environment before running this command (minimum 10 characters). The password is never printed.",
    );
  let user = await Db.findUserByEmail(email);
  if (user)
    throw new Error(
      "This email already exists. Choose a new administrator email; existing accounts are never promoted automatically.",
    );
  user = await Db.registerUser({ name, email, password });
  const sql = new DatabaseSync(
    join(
      process.env.COMMERCE_DATA_DIR || join(process.cwd(), ".data"),
      "commerce.sqlite",
    ),
  );
  sql.exec("PRAGMA busy_timeout=10000");
  const row = JSON.parse(
    sql
      .prepare("SELECT data FROM records WHERE kind='users' AND id=?")
      .get(user.id).data,
  );
  row.role = "admin";
  sql
    .prepare("UPDATE records SET data=? WHERE kind='users' AND id=?")
    .run(JSON.stringify(row), user.id);
  sql.close();
  console.log("Administrator created. Sign in at /admin.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  prompt.close();
}
