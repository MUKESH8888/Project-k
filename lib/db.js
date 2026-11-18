if (process.env.VERCEL && !process.env.COMMERCE_DATABASE_URL) {
  throw new Error(
    "Vercel requires COMMERCE_DATABASE_URL. Configure a managed PostgreSQL database before deploying.",
  );
}

const backend = process.env.COMMERCE_DATABASE_URL
  ? await import("./db-postgres.js")
  : await import("./db-sqlite.js");

export const Db = backend.Db;
export const currentUser = backend.currentUser;
export const hashPassword = backend.hashPassword;
