#!/usr/bin/env tsx
/**
 * Schema sync script (used during build/startup)
 * For standalone schema loading, use: npm run load-schema
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Client } from "pg";

function normalizeConnectionString(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!/^postgres(ql)?:\/\//i.test(trimmed)) {
    return null;
  }
  return trimmed;
}

async function main() {
  const connectionString = normalizeConnectionString(
    process.env.SUPABASE_DB_URL ||
    process.env.SUPABASE_CONNECTION_STRING ||
    process.env.DATABASE_URL
  );

  if (!connectionString) {
    throw new Error(
      "Missing Supabase connection string. Set SUPABASE_DB_URL (or SUPABASE_CONNECTION_STRING / DATABASE_URL) in backend/.env with your service-role Postgres URL."
    );
  }

  const currentDir = dirname(fileURLToPath(import.meta.url));
  const schemaPath = resolve(currentDir, "..", "supabase", "schema.sql");
  const sql = await readFile(schemaPath, "utf8");

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
      connectionTimeoutMillis: 10000,
    });
    await client.connect();
    return client;
  };

  const attempt = async (connString: string, label: string) => {
    console.log(`🔄 Syncing Supabase schema using ${label} host...`);
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
    await attempt(connectionString, "direct");
  } catch (error) {
    const err = error as NodeJS.ErrnoException & { address?: string; port?: number; code?: string };
    if ((err.code === "ENETUNREACH" || err.code === "ETIMEDOUT" || err.code === "ENOTFOUND") && connectionString.includes("supabase.co")) {
      console.error(
        `❌ Failed to reach Supabase direct host ${err.address ?? "(unknown)"}:${
          err.port ?? 5432
        } [code=${err.code}] – ${err.message}`
      );
      if (err.stack) console.error(err.stack);
      const pooler = normalizeConnectionString(
        process.env.SUPABASE_POOLER_DB_URL ||
        process.env.SUPABASE_POOLER_CONNECTION_STRING ||
        process.env.SUPABASE_POOLER_URL
      );
      if (!pooler) {
        throw new Error(
          "SUPABASE_POOLER_DB_URL not set. Provide the Supabase connection pooling URL to enable automatic fallback."
        );
      }
      await attempt(pooler, "pooler");
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


