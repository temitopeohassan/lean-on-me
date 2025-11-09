# Backend (Express + Supabase)

Routes implement the MCP flows from `mcp/mcp.json` using Supabase.

## Setup

```bash
cd backend
npm install
cp env.example .env
# edit .env with your Supabase creds (API + Postgres connection)
npm run supabase:sync   # optional, apply schema to Supabase (requires SUPABASE_DB_URL)
npm run dev
```

## Environment

- PORT (default 4000)
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_ANON_KEY
- SUPABASE_DB_URL (service-role Postgres connection string used at startup and by `npm run supabase:sync`, include `?sslmode=require` for Supabase)

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
