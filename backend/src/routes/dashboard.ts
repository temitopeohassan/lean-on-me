import { Router } from "express";
import { supabase } from "../lib/supabase.js";

const router = Router();

const toNumber = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value === null || value === undefined) return 0;
  return Number(value);
};

router.get("/summary", async (req, res) => {
  try {
    const addressParam = typeof req.query.address === "string" ? req.query.address.toLowerCase() : undefined;

    const { data: loanRequests, error: loanRequestsError } = await supabase.from("loan_requests").select("*");
    if (loanRequestsError) return res.status(500).json({ error: loanRequestsError.message });

    const { data: loanAgreements, error: loanAgreementsError } = await supabase.from("loan_agreements").select("*");
    if (loanAgreementsError) return res.status(500).json({ error: loanAgreementsError.message });

    const borrowerLoans =
      addressParam && loanRequests
        ? loanRequests
            .filter((loan) => loan.borrower?.toLowerCase() === addressParam)
            .map((loan) => ({
              loanId: loan.loan_id,
              amount: toNumber(loan.amount),
              durationDays: loan.duration_days,
              purpose: loan.purpose,
              status: loan.status,
              requestedAt: loan.requested_at,
              reputationScoreAtRequest: toNumber(loan.reputation_score_at_request ?? 0),
            }))
        : [];

    const pendingOpportunities =
      loanRequests
        ?.filter((loan) => loan.status === "pending" && (!addressParam || loan.borrower?.toLowerCase() !== addressParam))
        .map((loan) => ({
          loanId: loan.loan_id,
          borrower: loan.borrower,
          amount: toNumber(loan.amount),
          durationDays: loan.duration_days,
          purpose: loan.purpose,
          interestRate: toNumber(loan.interest_rate ?? 0),
          reputationScoreAtRequest: toNumber(loan.reputation_score_at_request ?? 0),
          requestedAt: loan.requested_at,
        })) ?? [];

    const agreements = loanAgreements ?? [];
    const totalLiquidity = agreements.reduce((sum, agreement) => sum + toNumber(agreement.amount_funded), 0);
    const totalBorrowed = agreements.reduce((sum, agreement) => sum + toNumber(agreement.amount_funded), 0);
    const totalRepaid = agreements.reduce((sum, agreement) => sum + toNumber(agreement.repayment_amount), 0);

    const activeLoans = agreements.filter((agreement) => agreement.status === "active").length;
    const repaidLoans = agreements.filter((agreement) => agreement.status === "repaid").length;
    const defaultedLoans = agreements.filter((agreement) => agreement.status === "defaulted").length;

    const repaymentRate =
      repaidLoans + defaultedLoans > 0 ? repaidLoans / (repaidLoans + defaultedLoans) : null;

    const lenderAgreements = addressParam
      ? agreements.filter((agreement) => agreement.lender?.toLowerCase() === addressParam)
      : [];

    const yieldEarned = lenderAgreements.reduce(
      (sum, agreement) =>
        sum + (toNumber(agreement.repayment_amount) - toNumber(agreement.amount_funded)),
      0
    );

    const recentActivity = agreements
      .slice()
      .sort((a, b) => {
        const aDate = a.updated_at || a.funded_at || a.repayment_due;
        const bDate = b.updated_at || b.funded_at || b.repayment_due;
        return new Date(bDate ?? 0).getTime() - new Date(aDate ?? 0).getTime();
      })
      .slice(0, 6)
      .map((agreement) => ({
        loanId: agreement.loan_id,
        status: agreement.status,
        amountFunded: toNumber(agreement.amount_funded),
        repaymentAmount: toNumber(agreement.repayment_amount),
        borrower: agreement.borrower,
        lender: agreement.lender,
        fundedAt: agreement.funded_at,
        repaymentDue: agreement.repayment_due,
      }));

    const reputationFactors = (() => {
      const totalLoans = borrowerLoans.length;
      const completedLoans = agreements.filter(
        (agreement) => agreement.borrower?.toLowerCase() === addressParam && agreement.status === "repaid"
      ).length;
      const borrowerDefaulted = agreements.filter(
        (agreement) => agreement.borrower?.toLowerCase() === addressParam && agreement.status === "defaulted"
      ).length;

      const repaymentPerformance =
        totalLoans > 0 ? Math.max(40, Math.min(100, (completedLoans / totalLoans) * 100)) : 60;
      const defaultImpact =
        borrowerDefaulted === 0 ? 90 : Math.max(20, 90 - borrowerDefaulted * 20);

      return [
        { name: "Repayment History", value: Math.round(repaymentPerformance), weight: 30, verified: totalLoans > 0 },
        { name: "Loan Participation", value: Math.min(100, totalLoans * 20 + 40), weight: 20, verified: totalLoans > 0 },
        { name: "Collateral Ratio", value: 85, weight: 15, verified: true },
        { name: "Income Verification", value: 75, weight: 15, verified: true },
        { name: "Credit Stability", value: Math.round(defaultImpact), weight: 20, verified: borrowerDefaulted === 0 },
      ];
    })();

    res.json({
      metrics: {
        activeLoans,
        repaidLoans,
        defaultedLoans,
        totalBorrowed,
        totalLiquidity,
        totalRepaid,
        yieldEarned,
        repaymentRate,
      },
      borrowerLoans,
      lenderOpportunities: pendingOpportunities,
      recentActivity,
      reputationFactors,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    res.status(500).json({ error: message });
  }
});

export default router;


