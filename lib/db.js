import { commerceDatabaseUrl } from "./config.js";

if (process.env.VERCEL && !commerceDatabaseUrl) {
  throw new Error(
    "Vercel requires COMMERCE_DATABASE_URL or COMMERCE_DATABASE_DATABASE_URL. Configure a managed PostgreSQL database before deploying.",
  );
}

const backend = commerceDatabaseUrl
  ? await import("./db-postgres.js")
  : await import("./db-sqlite.js");

export const Db = backend.Db;
export const currentUser = backend.currentUser;
export const hashPassword = backend.hashPassword;
