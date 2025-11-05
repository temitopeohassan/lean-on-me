import { z } from "zod";

export const AddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/);

export const LoanRequestSchema = z.object({
  loanId: z.string(),
  borrower: AddressSchema,
  amount: z.number().positive(),
  durationDays: z.number().int().positive(),
  purpose: z.string().min(1),
  collateralAmount: z.number().min(0)
});

export const FundLoanSchema = z.object({
  loanId: z.string(),
  lender: AddressSchema,
  amountFunded: z.number().positive(),
  interestRate: z.number().min(0)
});

export const RepayLoanSchema = z.object({
  loanId: z.string(),
  repaymentAmount: z.number().positive()
});

export const ReputationUpdateSchema = z.object({
  deltaScore: z.number(),
  isIncrease: z.boolean()
});


