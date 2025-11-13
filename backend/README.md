# Backend (Express + Supabase)

Routes implement the MCP flows from `mcp/mcp.json` using Supabase.

## Setup

```bash
cd backend
npm install
cp env.example .env
# edit .env with your Supabase creds (API + Postgres connection)
npm run load-schema     # Load schema into Supabase (standalone script with detailed error messages)
npm run dev
```

### Loading Schema into Supabase

The schema can be loaded in two ways:

1. **Standalone script (recommended for troubleshooting):**
   ```bash
   npm run load-schema
   ```
   This script provides detailed error messages, connection testing, and automatically falls back to the pooler URL if the direct connection fails.

2. **Automatic sync (during build/startup):**
   - The schema is automatically synced when you run `npm run build` (via `prebuild` hook)
   - The schema is also synced when the server starts (via `ensureSupabaseSchema()` in `server.ts`)
   - Manual sync: `npm run supabase:sync`

## Environment

- PORT (default 4000)
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_ANON_KEY
- SUPABASE_DB_URL (service-role Postgres connection string used at startup and by `npm run supabase:sync`, include `?sslmode=require` for Supabase)
- SUPABASE_POOLER_DB_URL (optional – Supabase connection pooling URL; required if direct host is unreachable)

> `npm run build` triggers `npm run supabase:sync` automatically before compiling, ensuring the Supabase schema stays up to date during deployments.

> On startup the server automatically ensures the Supabase schema (from `supabase/schema.sql`) is applied. Set `SUPABASE_DB_URL` so the backend can connect with the service role credentials.

## Routes

- GET /health
- GET /api/reputation/:address
- POST /api/reputation/:address/update { deltaScore:number, isIncrease:boolean }
- POST /api/loans/request
- POST /api/loans/fund
- POST /api/loans/repay
- POST /api/loans/default

See `supabase/schema.sql` for table definitions.
