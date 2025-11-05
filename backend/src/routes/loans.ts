import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { FundLoanSchema, LoanRequestSchema, RepayLoanSchema } from "../types/schemas.js";
import { z } from "zod";

const router = Router();

router.post("/request", async (req, res) => {
  const parse = LoanRequestSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const payload = parse.data;

  const { data: existing, error: existErr } = await supabase
    .from("loan_requests")
    .select("loan_id")
    .eq("loan_id", payload.loanId)
    .maybeSingle();
  if (existErr) return res.status(500).json({ error: existErr.message });
  if (existing) return res.status(409).json({ error: "loanId exists" });

  const requestedAt = new Date().toISOString();

  const { error } = await supabase.from("loan_requests").insert({
    loan_id: payload.loanId,
    borrower: payload.borrower.toLowerCase(),
    amount: payload.amount,
    duration_days: payload.durationDays,
    purpose: payload.purpose,
    requested_at: requestedAt,
    reputation_score_at_request: 0,
    collateral_amount: payload.collateralAmount,
    status: "pending"
  });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ loanId: payload.loanId, requestedAt });
});

router.post("/fund", async (req, res) => {
  const parse = FundLoanSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const payload = parse.data;

  const { data: request, error: reqErr } = await supabase
    .from("loan_requests")
    .select("loan_id, borrower, amount, duration_days, status")
    .eq("loan_id", payload.loanId)
    .maybeSingle();
  if (reqErr) return res.status(500).json({ error: reqErr.message });
  if (!request) return res.status(404).json({ error: "request not found" });
  if (request.status !== "pending") return res.status(409).json({ error: "request not pending" });
  if (payload.amountFunded !== request.amount) return res.status(400).json({ error: "amount mismatch" });

  const fundedAt = new Date();
  const repaymentDue = new Date(fundedAt.getTime() + request.duration_days * 24 * 60 * 60 * 1000);
  const repaymentAmount = payload.amountFunded + (payload.amountFunded * payload.interestRate) / 100;

  const { error: insErr } = await supabase.from("loan_agreements").insert({
    loan_id: payload.loanId,
    borrower: request.borrower,
    lender: payload.lender.toLowerCase(),
    funded_at: fundedAt.toISOString(),
    repayment_due: repaymentDue.toISOString(),
    amount_funded: payload.amountFunded,
    interest_rate: payload.interestRate,
    repayment_amount: repaymentAmount,
    status: "active"
  });
  if (insErr) return res.status(500).json({ error: insErr.message });

  const { error: updReqErr } = await supabase
    .from("loan_requests")
    .update({ status: "funded" })
    .eq("loan_id", payload.loanId);
  if (updReqErr) return res.status(500).json({ error: updReqErr.message });

  return res.status(201).json({ loanId: payload.loanId, fundedAt: fundedAt.toISOString() });
});

router.post("/repay", async (req, res) => {
  const parse = RepayLoanSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const payload = parse.data;

  const { data: agreement, error: agrErr } = await supabase
    .from("loan_agreements")
    .select("loan_id, borrower, lender, repayment_amount, status")
    .eq("loan_id", payload.loanId)
    .maybeSingle();
  if (agrErr) return res.status(500).json({ error: agrErr.message });
  if (!agreement) return res.status(404).json({ error: "agreement not found" });
  if (agreement.status !== "active") return res.status(409).json({ error: "not active" });
  if (payload.repaymentAmount !== agreement.repayment_amount) return res.status(400).json({ error: "repayment mismatch" });

  const { error: updAgrErr } = await supabase
    .from("loan_agreements")
    .update({ status: "repaid" })
    .eq("loan_id", payload.loanId);
  if (updAgrErr) return res.status(500).json({ error: updAgrErr.message });

  return res.json({ loanId: payload.loanId, status: "repaid" });
});

router.post("/default", async (req, res) => {
  const parse = z.object({ loanId: z.string() }).safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { loanId } = parse.data;

  const { data: agreement, error: agrErr } = await supabase
    .from("loan_agreements")
    .select("loan_id, status, repayment_due")
    .eq("loan_id", loanId)
    .maybeSingle();
  if (agrErr) return res.status(500).json({ error: agrErr.message });
  if (!agreement) return res.status(404).json({ error: "agreement not found" });
  if (agreement.status !== "active") return res.status(409).json({ error: "not active" });
  if (new Date().toISOString() <= agreement.repayment_due) return res.status(400).json({ error: "not due yet" });

  const { error: updAgrErr } = await supabase
    .from("loan_agreements")
    .update({ status: "defaulted" })
    .eq("loan_id", loanId);
  if (updAgrErr) return res.status(500).json({ error: updAgrErr.message });

  return res.json({ loanId, status: "defaulted" });
});

export default router;


