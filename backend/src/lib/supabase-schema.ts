import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Client } from "pg";

const SCHEMA_FILE =
  process.env.SUPABASE_SCHEMA_PATH ?? resolve(process.cwd(), "supabase", "schema.sql");

let schemaApplied = false;

function normalizeConnectionString(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!/^postgres(ql)?:\/\//i.test(trimmed)) {
    console.warn(
      '⚠️  Invalid Supabase connection string. Expected it to start with "postgresql://". Skipping schema sync.'
    );
    return null;
  }
  return trimmed;
}

export async function ensureSupabaseSchema(): Promise<void> {
  if (schemaApplied) return;

  if (process.env.SUPABASE_SKIP_SCHEMA_SYNC === "true") {
    console.warn("⚠️  Skipping Supabase schema sync due to SUPABASE_SKIP_SCHEMA_SYNC=true.");
    return;
  }

  const connectionString =
    normalizeConnectionString(
      process.env.SUPABASE_DB_URL ||
        process.env.SUPABASE_CONNECTION_STRING ||
        process.env.DATABASE_URL
    );

  if (!connectionString) {
    console.warn(
      "⚠️  SUPABASE_DB_URL (or SUPABASE_CONNECTION_STRING / DATABASE_URL) not set. Skipping Supabase schema sync."
    );
    return;
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

  const attempt = async (connString: string, label: string) => {
    console.log(`🔄 Applying Supabase schema using ${label} host...`);
    const sql = await readFile(SCHEMA_FILE, "utf8");
    const client = await connect(connString);
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw error;
    } finally {
      await client.end();
    }
  };

  try {
    await attempt(connectionString, "direct");
    schemaApplied = true;
    console.log("✅ Supabase schema is up to date.");
  } catch (error) {
    const err = error as NodeJS.ErrnoException & { hostname?: string; address?: string; port?: number };
    if ((err.code === "ENETUNREACH" || err.code === "ETIMEDOUT") && connectionString.includes("supabase.co")) {
      console.error(
        `❌ Failed to reach Supabase direct host ${err.address ?? err.hostname ?? "(unknown)"}:${
          err.port ?? 5432
        } [code=${err.code}] – ${err.message}`
      );
      if (err.stack) console.error(err.stack);
      const pooler =
        process.env.SUPABASE_POOLER_DB_URL ||
        process.env.SUPABASE_POOLER_CONNECTION_STRING ||
        process.env.SUPABASE_POOLER_URL;
      if (!pooler) {
        console.error(
          "❌ SUPABASE_POOLER_DB_URL not set. Provide the Supabase connection pooling URL to enable automatic fallback."
        );
        throw error;
      }
      await attempt(pooler, "pooler");
      schemaApplied = true;
      console.log("✅ Supabase schema is up to date (via pooler).");
      return;
    } else if (err.code === "ENOENT") {
      console.error(`❌ Supabase schema file not found at ${SCHEMA_FILE}.`);
    } else if (err.code === "ENOTFOUND" || err.code === "ETIMEDOUT") {
      const host = err.hostname ?? "unknown host";
      console.error(`❌ Unable to reach Supabase host (${host}). The API will start but database may be missing tables.`);
    } else {
      console.error("❌ Failed to sync Supabase schema at startup.");
    }
    console.error(err.stack ?? err.message);
    // Do not crash the server; continue with startup so routes can still run (may degrade)
  } finally {
    console.log("ℹ️  Supabase schema sync attempt complete.");
  }
}


