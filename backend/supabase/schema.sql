-- Reputations table
create table if not exists reputations (
  wallet_address text primary key,
  score numeric not null default 60.0,
  tier text not null default 'C',
  last_updated timestamptz not null default now()
);

-- Loan requests
create table if not exists loan_requests (
  loan_id text primary key,
  borrower text not null,
  amount numeric not null,
  duration_days integer not null,
  purpose text not null,
  requested_at timestamptz not null,
  reputation_score_at_request numeric not null default 0,
  collateral_amount numeric not null default 0,
  status text not null check (status in ('pending','funded','cancelled'))
);

-- Loan agreements
create table if not exists loan_agreements (
  loan_id text primary key references loan_requests(loan_id) on delete cascade,
  borrower text not null,
  lender text not null,
  funded_at timestamptz not null,
  repayment_due timestamptz not null,
  amount_funded numeric not null,
  interest_rate numeric not null,
  repayment_amount numeric not null,
  status text not null check (status in ('active','repaid','defaulted'))
);

-- Attestations (optional)
create table if not exists attestations (
  attestation_id text primary key,
  issuer text not null,
  type text not null check (type in ('incomeProof','identity','peerTrust','employment')),
  value text not null,
  issued_at timestamptz not null,
  verified boolean not null default false
);


