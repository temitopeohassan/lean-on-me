#!/usr/bin/env tsx
import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Client } from "pg";

async function main() {
  const connectionString =
    process.env.SUPABASE_DB_URL ||
    process.env.SUPABASE_CONNECTION_STRING ||
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "Missing Supabase connection string. Set SUPABASE_DB_URL (or SUPABASE_CONNECTION_STRING / DATABASE_URL) in backend/.env with your service-role Postgres URL."
    );
  }

  const currentDir = dirname(fileURLToPath(import.meta.url));
  const schemaPath = resolve(currentDir, "..", "supabase", "schema.sql");
  const sql = await readFile(schemaPath, "utf8");

  const normalized = connectionString.trim();

  if (!/^postgres(ql)?:\/\//i.test(normalized)) {
    throw new Error(
      'Invalid Supabase connection string. Expected it to start with "postgresql://" or "postgres://". Check SUPABASE_DB_URL in backend/.env.'
    );
  }

  const client = new Client({
    connectionString: normalized,
    ssl:
      normalized.includes("supabase.co") || normalized.includes("render.com")
        ? { rejectUnauthorized: false }
        : undefined,
  });

  console.log("🔄 Syncing Supabase schema...");

  try {
    await client.connect();
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
    console.log("✅ Supabase schema synced successfully.");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    console.error("❌ Failed to sync Supabase schema.");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});


