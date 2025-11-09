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

  const connect = async (connString: string) => {
    const client = new Client({
      connectionString: connString,
      ssl:
        connString.includes("supabase.co") ||
        connString.includes("supabase.net") ||
        connString.includes("supabase.in") ||
        connString.includes("render.com")
          ? { rejectUnauthorized: false }
          : undefined,
    });
    await client.connect();
    return client;
  };

  const attempt = async (connString: string) => {
    console.log(`🔄 Syncing Supabase schema using ${connString.includes("pooler") ? "pooler" : "direct"} host...`);
    const client = await connect(connString);
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("COMMIT");
      console.log("✅ Supabase schema synced successfully.");
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw error;
    } finally {
      await client.end();
    }
  };

  try {
    await attempt(normalized);
  } catch (error) {
    const err = error as NodeJS.ErrnoException & { address?: string; port?: number };
    if ((err.code === "ENETUNREACH" || err.code === "ETIMEDOUT") && normalized.includes("supabase.co")) {
      console.error(
        `❌ Failed to reach Supabase direct host ${err.address ?? "(unknown)"}:${
          err.port ?? 5432
        } [code=${err.code}] – ${err.message}`
      );
      if (err.stack) console.error(err.stack);
      console.warn("⚠️  Retrying schema sync using Supabase connection pool...");
      const pooler = normalized
        .replace("db.", "pooler.")
        .replace(".supabase.co", ".supabase.net")
        .replace(":5432", ":6543");
      await attempt(pooler);
    } else {
      console.error("❌ Failed to sync Supabase schema.");
      if (err.stack) console.error(err.stack);
      throw error;
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exit(1);
});


