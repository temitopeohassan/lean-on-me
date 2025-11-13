#!/usr/bin/env tsx
/**
 * Standalone script to load Supabase schema
 * 
 * This script can be run independently to load the schema into Supabase.
 * It handles connection issues, URL encoding, and provides detailed error messages.
 * 
 * Usage:
 *   npm run load-schema
 *   or
 *   tsx scripts/load-schema.ts
 */

import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Client } from "pg";

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message: string) {
  console.error(`${colors.red}${message}${colors.reset}`);
}

function logSuccess(message: string) {
  console.log(`${colors.green}${message}${colors.reset}`);
}

function logInfo(message: string) {
  console.log(`${colors.cyan}${message}${colors.reset}`);
}

function logWarning(message: string) {
  console.warn(`${colors.yellow}${message}${colors.reset}`);
}

/**
 * Normalize and validate connection string
 */
function normalizeConnectionString(raw: string | undefined): string | null {
  if (!raw) return null;
  
  const trimmed = raw.trim();
  
  if (!/^postgres(ql)?:\/\//i.test(trimmed)) {
    logError('Invalid Supabase connection string. Expected it to start with "postgresql://" or "postgres://".');
    return null;
  }
  
  // Parse URL to check for special characters in password
  try {
    const url = new URL(trimmed);
    // If password contains special characters, they should already be encoded
    // But we'll ensure the full URL is properly formatted
    return trimmed;
  } catch (error) {
    logError(`Failed to parse connection string: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

/**
 * Create a Postgres client with proper SSL configuration
 */
async function createClient(connectionString: string): Promise<Client> {
  const isSupabase = 
    connectionString.includes("supabase.co") ||
    connectionString.includes("supabase.net") ||
    connectionString.includes("supabase.in") ||
    connectionString.includes("supabase.com");
  
  // Parse connection string to potentially force IPv4
  let finalConnectionString = connectionString;
  
  // If it's a Supabase connection and might have IPv6 issues, try to force IPv4
  // by using the hostname directly (Node.js will prefer IPv4 if available)
  try {
    const url = new URL(connectionString.replace(/^postgresql:/, "http:"));
    // Keep the original connection string, but we'll handle IPv6 in error messages
  } catch {
    // Invalid URL format, use as-is
  }
  
  const client = new Client({
    connectionString: finalConnectionString,
    ssl: isSupabase
      ? { rejectUnauthorized: false }
      : undefined,
    // Add connection timeout
    connectionTimeoutMillis: 15000, // Increased timeout for IPv6/IPv4 resolution
  });
  
  return client;
}

/**
 * Test connection to database
 */
async function testConnection(client: Client): Promise<boolean> {
  try {
    const result = await client.query("SELECT version()");
    logInfo(`Connected to PostgreSQL: ${result.rows[0]?.version?.substring(0, 50) || "unknown version"}...`);
    return true;
  } catch (error) {
    logError(`Connection test failed: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Check if tables already exist
 */
async function checkExistingTables(client: Client): Promise<string[]> {
  try {
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('reputations', 'loan_requests', 'loan_agreements')
      ORDER BY table_name;
    `);
    return result.rows.map((row) => row.table_name);
  } catch (error) {
    logWarning(`Could not check existing tables: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

/**
 * Load schema from file and execute
 */
async function loadSchema(connectionString: string, label: string): Promise<boolean> {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const schemaPath = resolve(currentDir, "..", "supabase", "schema.sql");
  
  logInfo(`\n📄 Reading schema file: ${schemaPath}`);
  
  let sql: string;
  try {
    sql = await readFile(schemaPath, "utf8");
    logSuccess(`✅ Schema file loaded (${sql.length} characters)`);
  } catch (error) {
    logError(`❌ Failed to read schema file: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
  
  logInfo(`\n🔄 Connecting to Supabase using ${label} host...`);
  
  const client = await createClient(connectionString);
  
  try {
    await client.connect();
    logSuccess("✅ Connected to database");
    
    // Test connection
    const connected = await testConnection(client);
    if (!connected) {
      return false;
    }
    
    // Check existing tables
    const existingTables = await checkExistingTables(client);
    if (existingTables.length > 0) {
      logWarning(`⚠️  Found existing tables: ${existingTables.join(", ")}`);
      logInfo("   The schema will use 'CREATE TABLE IF NOT EXISTS' so existing tables will be preserved.");
    }
    
    // Execute schema
    logInfo("\n📝 Executing schema SQL...");
    await client.query("BEGIN");
    
    try {
      await client.query(sql);
      await client.query("COMMIT");
      logSuccess("✅ Schema executed successfully");
      
      // Verify tables were created
      const tablesAfter = await checkExistingTables(client);
      logInfo(`\n📊 Tables in database: ${tablesAfter.length > 0 ? tablesAfter.join(", ") : "none found"}`);
      
      if (tablesAfter.length >= 3) {
        logSuccess("✅ All required tables are present");
      } else {
        logWarning(`⚠️  Expected 3 tables, found ${tablesAfter.length}`);
      }
      
      return true;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      throw error;
    }
  } catch (error) {
    const err = error as NodeJS.ErrnoException & { 
      code?: string; 
      hostname?: string; 
      address?: string; 
      port?: number;
      message?: string;
    };
    
    if (err.code === "ENOTFOUND") {
      logError(`❌ DNS lookup failed for host: ${err.hostname || err.address || "unknown"}`);
      logError(`   This usually means:`);
      logError(`   - The hostname is incorrect`);
      logError(`   - The network is unreachable`);
      logError(`   - DNS server is not responding`);
      logError(`   - The Supabase project might be paused`);
      logError(`\n   💡 Try:`);
      logError(`   1. Check your Supabase dashboard: https://app.supabase.com`);
      logError(`   2. Verify the project is active (not paused)`);
      logError(`   3. Get the correct connection strings from: Project Settings > Database`);
      logError(`   4. For pooler URL, use the "Connection pooling" section (format: aws-0-REGION.pooler.supabase.com)`);
    } else if (err.code === "EAI_AGAIN" || err.code === "ETIMEDOUT" || err.code === "ECONNREFUSED") {
      logError(`❌ Connection timeout/refused to ${err.address || err.hostname || "unknown"}:${err.port || 5432}`);
      logError(`   Check your network connection and firewall settings.`);
    } else if (err.code === "ENETUNREACH") {
      logError(`❌ Network unreachable: ${err.address || err.hostname || "unknown"}`);
      logError(`   This may be an IPv6 connectivity issue.`);
      logError(`   💡 The host resolves to IPv6 only. Try:`);
      logError(`   1. Use the connection pooler URL (SUPABASE_POOLER_DB_URL)`);
      logError(`   2. Enable IPv6 on your network, or`);
      logError(`   3. Use the Supabase SQL Editor in the dashboard to run the schema manually`);
    } else if (err.message?.includes("password authentication failed")) {
      logError(`❌ Authentication failed`);
      logError(`   Check your SUPABASE_DB_URL password in .env`);
    } else if (err.message?.includes("database") && err.message?.includes("does not exist")) {
      logError(`❌ Database does not exist`);
      logError(`   Verify the database name in your connection string.`);
    } else {
      logError(`❌ Error: ${err.message || String(error)}`);
      if (err.code) {
        logError(`   Error code: ${err.code}`);
      }
    }
    
    if (err.stack) {
      logError(`\nStack trace:\n${err.stack}`);
    }
    
    return false;
  } finally {
    await client.end();
    logInfo("🔌 Connection closed");
  }
}

/**
 * Main function
 */
async function main() {
  log("\n" + "=".repeat(60), "cyan");
  log("  Lean On Me - Supabase Schema Loader", "cyan");
  log("=".repeat(60) + "\n", "cyan");
  
  // Check for connection string
  const connectionString = normalizeConnectionString(
    process.env.SUPABASE_DB_URL ||
    process.env.SUPABASE_CONNECTION_STRING ||
    process.env.DATABASE_URL
  );
  
  if (!connectionString) {
    logError("❌ Missing Supabase connection string!");
    logError("\nPlease set one of the following in your .env file:");
    logError("  - SUPABASE_DB_URL (recommended)");
    logError("  - SUPABASE_CONNECTION_STRING");
    logError("  - DATABASE_URL");
    logError("\nExample:");
    logError('  SUPABASE_DB_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres?sslmode=require');
    process.exit(1);
  }
  
  // Mask password in logs
  const maskedUrl = connectionString.replace(/:([^:@]+)@/, ":****@");
  logInfo(`📡 Connection string: ${maskedUrl}`);
  
  // Try direct connection first
  logInfo("\n" + "-".repeat(60));
  const success = await loadSchema(connectionString, "direct");
  
  if (success) {
    logSuccess("\n" + "=".repeat(60));
    logSuccess("  ✅ Schema loaded successfully!");
    logSuccess("=".repeat(60) + "\n");
    process.exit(0);
  }
  
  // If direct connection failed, try pooler
  const poolerString = normalizeConnectionString(
    process.env.SUPABASE_POOLER_DB_URL ||
    process.env.SUPABASE_POOLER_CONNECTION_STRING ||
    process.env.SUPABASE_POOLER_URL
  );
  
  if (poolerString) {
    logWarning("\n⚠️  Direct connection failed. Trying connection pooler...");
    logInfo("\n" + "-".repeat(60));
    const poolerSuccess = await loadSchema(poolerString, "pooler");
    
    if (poolerSuccess) {
      logSuccess("\n" + "=".repeat(60));
      logSuccess("  ✅ Schema loaded successfully via pooler!");
      logSuccess("=".repeat(60) + "\n");
      process.exit(0);
    }
  } else {
    logWarning("\n⚠️  SUPABASE_POOLER_DB_URL not set. Cannot retry with pooler.");
  }
  
  logError("\n" + "=".repeat(60));
  logError("  ❌ Failed to load schema");
  logError("=".repeat(60));
  logError("\nTroubleshooting tips:");
  logError("1. Verify your connection strings in .env are correct");
  logError("2. Check that your Supabase project is active (not paused)");
  logError("3. Get correct connection strings from: Project Settings > Database");
  logError("4. For pooler URL, ensure it uses .com (not .net): aws-0-REGION.pooler.supabase.com");
  logError("5. Check your network connection and firewall settings");
  logError("\n💡 Alternative: Load schema manually using Supabase SQL Editor");
  logError("   See: backend/scripts/load-schema-manual.md for instructions\n");
  
  process.exit(1);
}

// Run the script
main().catch((error) => {
  logError(`\n❌ Unexpected error: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
  process.exit(1);
});

