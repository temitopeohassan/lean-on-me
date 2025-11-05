# Backend (Express + Supabase)

Routes implement the MCP flows from `mcp/mcp.json` using Supabase.

## Setup

```bash
cd backend
npm install
cp env.example .env
# edit .env with your Supabase creds
npm run dev
```

## Environment

- PORT (default 4000)
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY (preferred) or SUPABASE_ANON_KEY

## Routes

- GET /health
- GET /api/reputation/:address
- POST /api/reputation/:address/update { deltaScore:number, isIncrease:boolean }
- POST /api/loans/request
- POST /api/loans/fund
- POST /api/loans/repay
- POST /api/loans/default

See `supabase/schema.sql` for table definitions.
