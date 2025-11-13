# Manual Schema Loading Instructions

If the automated schema loading script fails due to network/DNS issues, you can load the schema manually using the Supabase dashboard.

## Method 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Select your project: `jjjxhabzcchtfdwztnwt`
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `backend/supabase/schema.sql`
6. Paste it into the SQL editor
7. Click **Run** (or press Ctrl+Enter)

The schema will be applied immediately.

## Method 2: Get Correct Connection Strings

If you want to fix the connection strings:

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** > **Database**
3. Find the **Connection string** section
4. Copy the **Connection pooling** URL (it should look like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```
   Note: It should be `.com` not `.net`, and the region format might be different.

5. Update your `.env` file:
   ```env
   SUPABASE_POOLER_DB_URL=postgresql://postgres:pass234xyz0987@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require
   ```

## Method 3: Verify Direct Connection String

1. In **Project Settings** > **Database**
2. Find the **Connection string** section
3. Select **URI** format
4. Copy the connection string
5. It should match the format in your `.env`:
   ```env
   SUPABASE_DB_URL=postgresql://postgres:pass234xyz0987@db.jjjxhabzcchtfdwztnwt.supabase.co:5432/postgres?sslmode=require
   ```

## Troubleshooting DNS Issues

If you're experiencing DNS resolution issues:

1. **Check if project is paused**: Go to project settings and ensure the project is active
2. **Verify hostnames**: The direct host should be `db.jjjxhabzcchtfdwztnwt.supabase.co`
3. **Check network**: Try accessing `https://jjjxhabzcchtfdwztnwt.supabase.co` in a browser
4. **IPv6 issues**: If your network doesn't support IPv6, use the pooler URL (which typically has IPv4)

## After Manual Loading

Once the schema is loaded (via SQL Editor or fixed connection strings), you can verify it worked by:

1. Going to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - `reputations`
   - `loan_requests`
   - `loan_agreements`

Or run this query in SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('reputations', 'loan_requests', 'loan_agreements');
```

