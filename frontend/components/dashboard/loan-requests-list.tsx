"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { type Address } from "viem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateLoanRequest } from "@/hooks/use-loan-contract";
import type { BorrowerLoan } from "@/hooks/use-dashboard-summary";

interface LoanRequestsListProps {
  loans: BorrowerLoan[];
  onCreateRequest?: () => void | Promise<void>;
  isLoading?: boolean;
}

interface LoanRequestFormState {
  loanId: string;
  amount: string;
  durationDays: string;
  purpose: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const generateLoanId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `loan-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
  }
  return `loan-${Math.random().toString(36).slice(2, 12)}`;
};

const initialFormState = (): LoanRequestFormState => ({
  loanId: generateLoanId(),
  amount: "",
  durationDays: "30",
  purpose: "",
});

export default function LoanRequestsList({ loans, onCreateRequest, isLoading }: LoanRequestsListProps) {
  const { toast } = useToast();
  const { address } = useAppKitAccount();
  const walletAddress = address as Address | undefined;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState<LoanRequestFormState>(() => initialFormState());
  const [formError, setFormError] = useState<string | null>(null);

  const { createLoanRequest, isPending } = useCreateLoanRequest();

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      setFormState(initialFormState());
      setFormError(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!walletAddress) {
      toast({
        variant: "destructive",
        title: "Wallet required",
        description: "Connect your wallet before creating a loan request.",
      });
      return;
    }

    const { loanId, amount, durationDays, purpose } = formState;
    if (!loanId.trim()) {
      setFormError("Loan ID is required.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setFormError("Loan amount must be greater than zero.");
      return;
    }
    const parsedDuration = Number.parseInt(durationDays, 10);
    if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
      setFormError("Duration must be a positive number of days.");
      return;
    }

    try {
      await createLoanRequest({
        loanId,
        amount,
        durationDays: parsedDuration,
        purpose: purpose.trim(),
        borrower: walletAddress,
      });

      toast({
        title: "Loan request submitted",
        description: "Your loan request has been sent onchain. It may take a few moments to confirm.",
      });

      setIsDialogOpen(false);
      setFormState(initialFormState());
      setFormError(null);
      await onCreateRequest?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create loan request.";
      setFormError(message);
      toast({
        variant: "destructive",
        title: "Request failed",
        description: message,
      });
    }
  };

  const hasLoans = useMemo(() => loans.length > 0, [loans]);

  return (
    <div className="space-y-6">
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle>Create New Loan Request</CardTitle>
          <CardDescription>Request a loan based on your reputation score</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="btn-primary" disabled={isLoading || isPending}>
                + New Loan Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Submit loan request</DialogTitle>
                <DialogDescription>
                  Provide the loan details and submit the request. You&apos;ll sign a transaction to publish the request
                  onchain.
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="loan-id">Loan ID</Label>
                  <Input
                    id="loan-id"
                    name="loanId"
                    value={formState.loanId}
                    placeholder="loan-1234"
                    required
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loan-amount">Loan amount (ETH)</Label>
                  <Input
                    id="loan-amount"
                    name="amount"
                    type="number"
                    min={0}
                    step="0.01"
                    value={formState.amount}
                    onChange={(event) => setFormState((prev) => ({ ...prev, amount: event.target.value }))}
                    placeholder="1.50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration-days">Duration (days)</Label>
                  <Input
                    id="duration-days"
                    name="durationDays"
                    type="number"
                    min={1}
                    step={1}
                    value={formState.durationDays}
                    onChange={(event) => setFormState((prev) => ({ ...prev, durationDays: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea
                    id="purpose"
                    name="purpose"
                    value={formState.purpose}
                    onChange={(event) => setFormState((prev) => ({ ...prev, purpose: event.target.value }))}
                    placeholder="Explain how you will use the loan"
                    rows={4}
                  />
                </div>
                {formError && <p className="text-sm text-destructive">{formError}</p>}
                <DialogFooter className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} disabled={isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" className="btn-primary" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit request"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Loan Requests</h3>
        {isLoading && <p className="text-sm text-muted">Loading your loan requests...</p>}
        {!isLoading && !hasLoans && (
          <Card className="bg-surface border-dashed border-border">
            <CardContent className="py-6">
              <p className="text-sm text-muted">You don&apos;t have any loan requests yet.</p>
            </CardContent>
          </Card>
        )}

        {loans.map((loan) => (
          <Card key={loan.loanId} className="bg-surface border-border hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-lg">{formatCurrency(loan.amount)}</h4>
                    <Badge variant={loan.status === "pending" ? "secondary" : "default"} className="capitalize">
                      {loan.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted">{loan.purpose ?? "No purpose provided"}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted">
                    <span>{loan.durationDays} days</span>
                    {typeof loan.reputationScoreAtRequest === "number" && (
                      <span>Reputation: {loan.reputationScoreAtRequest}</span>
                    )}
                    {loan.requestedAt && (
                      <span>
                        Requested:{" "}
                        {new Date(loan.requestedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
                <Button className="btn-secondary" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
