import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, type Address } from "viem"
import { LOAN_CONTRACT_ADDRESS, LOAN_CONTRACT_ABI } from "@/lib/contracts"
import { api } from "@/lib/api"

export function useCreateLoanRequest() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const createLoanRequest = async (params: {
    loanId: string
    amount: string
    durationDays: number
    purpose: string
    borrower: Address
  }) => {
    const { loanId, amount, durationDays, purpose, borrower } = params
    try {
      if (!borrower) {
        throw new Error("Borrower wallet address is required")
      }

      const parsedAmount = Number(amount)

      if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Loan amount must be greater than zero")
      }

      if (!Number.isFinite(durationDays) || durationDays <= 0) {
        throw new Error("Duration must be greater than zero")
      }

      // First, create the request in the backend
      await api.createLoanRequest({
        loanId,
        borrower,
        amount: parsedAmount,
        durationDays,
        purpose,
        collateralAmount: 0,
      })

      // Then, create the onchain request
      await writeContract({
        address: LOAN_CONTRACT_ADDRESS,
        abi: LOAN_CONTRACT_ABI,
        functionName: "createLoanRequest",
        args: [loanId, parseEther(amount), BigInt(durationDays), purpose, parseEther("0")],
        value: parseEther("0"),
      })
    } catch (err) {
      console.error("Error creating loan request:", err)
      throw err
    }
  }

  return {
    createLoanRequest,
    isPending: isPending || isConfirming,
    isSuccess: isConfirmed,
    error,
    hash,
  }
}

export function useFundLoan() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const fundLoan = async (loanId: string, lender: Address, amountFunded: string, interestRate: number) => {
    try {
      // First, fund onchain
      await writeContract({
        address: LOAN_CONTRACT_ADDRESS,
        abi: LOAN_CONTRACT_ABI,
        functionName: "fundLoan",
        args: [loanId, BigInt(interestRate * 100)], // Convert to bps
        value: parseEther(amountFunded),
      })

      // Then, update backend
      await api.fundLoan(loanId, lender, parseFloat(amountFunded), interestRate)
    } catch (err) {
      console.error("Error funding loan:", err)
      throw err
    }
  }

  return {
    fundLoan,
    isPending: isPending || isConfirming,
    isSuccess: isConfirmed,
    error,
    hash,
  }
}

export function useRepayLoan() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const repayLoan = async (loanId: string, repaymentAmount: string) => {
    try {
      // First, repay onchain
      await writeContract({
        address: LOAN_CONTRACT_ADDRESS,
        abi: LOAN_CONTRACT_ABI,
        functionName: "repayLoan",
        args: [loanId],
        value: parseEther(repaymentAmount),
      })

      // Then, update backend
      await api.repayLoan(loanId, parseFloat(repaymentAmount))
    } catch (err) {
      console.error("Error repaying loan:", err)
      throw err
    }
  }

  return {
    repayLoan,
    isPending: isPending || isConfirming,
    isSuccess: isConfirmed,
    error,
    hash,
  }
}

export function useLoanRequest(loanId: string | undefined) {
  const { data, isLoading, error } = useReadContract({
    address: LOAN_CONTRACT_ADDRESS,
    abi: LOAN_CONTRACT_ABI,
    functionName: "loanIdToRequest",
    args: loanId ? [loanId] : undefined,
    query: {
      enabled: !!loanId,
    },
  })

  return {
    request: data,
    isLoading,
    error,
  }
}

