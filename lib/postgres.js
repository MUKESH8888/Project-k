import { AsyncLocalStorage } from "node:async_hooks";
import { Pool } from "pg";
import { commerceDatabaseUrl } from "./config.js";

const connectionString = commerceDatabaseUrl;
if (!connectionString) {
  throw new Error(
    "Set COMMERCE_DATABASE_URL or COMMERCE_DATABASE_DATABASE_URL to a managed PostgreSQL connection string.",
  );
}

export const pool = new Pool({
  connectionString,
  max: Number(process.env.PG_POOL_MAX || 1),
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
  allowExitOnIdle: true,
});

pool.on("error", (error) => {
  console.error("Unexpected managed PostgreSQL pool error:", error);
});

export const ready = (async () => {
  const client = await pool.connect();
  try {
    for (const statement of [
      `CREATE TABLE IF NOT EXISTS records (
         kind TEXT NOT NULL,
         id TEXT NOT NULL,
         data JSONB NOT NULL,
         created_at BIGSERIAL,
         PRIMARY KEY (kind, id)
       )`,
      "CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)",
      `CREATE UNIQUE INDEX IF NOT EXISTS records_user_email
       ON records (lower(data->>'email')) WHERE kind = 'users'`,
      `CREATE UNIQUE INDEX IF NOT EXISTS records_order_idempotency
       ON records (data->>'idempotencyKey') WHERE kind = 'orders'`,
      `CREATE TABLE IF NOT EXISTS sessions (
         token TEXT PRIMARY KEY,
         user_data JSONB NOT NULL,
         expires BIGINT NOT NULL
       )`,
      "CREATE INDEX IF NOT EXISTS sessions_expiration ON sessions (expires)",
      `CREATE TABLE IF NOT EXISTS limits (
         key TEXT PRIMARY KEY,
         count INTEGER NOT NULL,
         expires BIGINT NOT NULL
       )`,
    ])
      await client.query(statement);
  } finally {
    client.release();
  }
})();

const transactions = new AsyncLocalStorage();

export function inTransaction() {
  return Boolean(transactions.getStore());
}

export async function query(text, values = []) {
  await ready;
  const client = transactions.getStore();
  return client ? client.query(text, values) : pool.query(text, values);
}

export async function transaction(callback) {
  await ready;
  for (let attempt = 0; ; attempt += 1) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN ISOLATION LEVEL SERIALIZABLE");
      const result = await transactions.run(client, callback);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      if (
        attempt < 2 &&
        (error.code === "40001" || error.code === "40P01")
      )
        continue;
      throw error;
    } finally {
      client.release();
    }
  }
}

export async function lockKey(key) {
  await query("SELECT pg_advisory_xact_lock(hashtext($1))", [key]);
}
