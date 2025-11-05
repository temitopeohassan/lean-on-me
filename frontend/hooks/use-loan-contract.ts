import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, formatEther, type Address } from "viem"
import { LOAN_CONTRACT_ADDRESS, LOAN_CONTRACT_ABI } from "@/lib/contracts"
import { api } from "@/lib/api"

export function useCreateLoanRequest() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const createLoanRequest = async (
    loanId: string,
    amount: string, // in ETH
    durationDays: number,
    purpose: string,
    collateralAmount: string // in ETH
  ) => {
    try {
      // First, create the request in the backend
      await api.createLoanRequest({
        loanId,
        borrower: "", // Will be set from wallet
        amount: parseFloat(amount),
        durationDays,
        purpose,
        collateralAmount: parseFloat(collateralAmount),
      })

      // Then, create the onchain request
      await writeContract({
        address: LOAN_CONTRACT_ADDRESS,
        abi: LOAN_CONTRACT_ABI,
        functionName: "createLoanRequest",
        args: [loanId, parseEther(amount), BigInt(durationDays), purpose, parseEther(collateralAmount)],
        value: parseEther(collateralAmount),
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

