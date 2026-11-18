import { createInterface } from "node:readline/promises";
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
  if (!(await Db.promoteUserToAdmin(user.id)))
    throw new Error("Administrator account could not be activated.");
  console.log("Administrator created. Sign in at /admin.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  prompt.close();
}
