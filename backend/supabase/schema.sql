-- Lean On Me Supabase schema

-- Reputation profiles
create table if not exists public.reputations (
  wallet_address text primary key,
  score numeric not null default 60.0,
  tier text not null default 'C' check (tier in ('A','B','C','D')),
  last_updated timestamptz default timezone('utc', now()) not null
);

-- Borrower loan requests
create table if not exists public.loan_requests (
  loan_id text primary key,
  borrower text not null,
  amount numeric not null,
  duration_days integer not null,
  purpose text not null,
  requested_at timestamptz default timezone('utc', now()) not null,
  status text not null check (status in ('pending','funded','cancelled')),
  reputation_score_at_request numeric,
  collateral_amount numeric default 0
);

create index if not exists loan_requests_borrower_idx on public.loan_requests (lower(borrower));

-- Agreements created when requests are funded
create table if not exists public.loan_agreements (
  loan_id text primary key references public.loan_requests (loan_id) on delete cascade,
  borrower text not null,
  lender text not null,
  funded_at timestamptz not null,
  repayment_due timestamptz not null,
  amount_funded numeric not null,
  interest_rate numeric not null,
  repayment_amount numeric not null,
  status text not null check (status in ('active','repaid','defaulted'))
);

create index if not exists loan_agreements_borrower_idx on public.loan_agreements (lower(borrower));
create index if not exists loan_agreements_lender_idx   on public.loan_agreements (lower(lender));

-- Helper function used when upserting reputations
create or replace function public.upsert_reputation(
  p_wallet_address text,
  p_score numeric,
  p_tier text
) returns void as $$
begin
  insert into public.reputations (wallet_address, score, tier, last_updated)
  values (lower(p_wallet_address), p_score, p_tier, timezone('utc', now()))
  on conflict (wallet_address)
  do update set score = excluded.score,
                tier = excluded.tier,
                last_updated = timezone('utc', now());
end;
$$ language plpgsql;


