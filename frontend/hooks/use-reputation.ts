import { useReadContract } from "wagmi"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { REPUTATION_ENGINE_ADDRESS, REPUTATION_ENGINE_ABI } from "@/lib/contracts"
import { api } from "@/lib/api"
import type { Address } from "viem"

export function useReputation(address: Address | undefined) {
  const queryClient = useQueryClient()

  // Fetch from backend API
  const {
    data: apiReputation,
    isLoading: isLoadingApi,
    error: apiError,
  } = useQuery({
    queryKey: ["reputation", address],
    queryFn: () => api.getReputation(address!),
    enabled: !!address,
  })

  // Fetch from onchain contract
  const {
    data: onchainReputation,
    isLoading: isLoadingOnchain,
    error: onchainError,
  } = useReadContract({
    address: REPUTATION_ENGINE_ADDRESS,
    abi: REPUTATION_ENGINE_ABI,
    functionName: "getReputation",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Update reputation mutation
  const updateMutation = useMutation({
    mutationFn: ({ deltaScore, isIncrease }: { deltaScore: number; isIncrease: boolean }) =>
      api.updateReputation(address!, deltaScore, isIncrease),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reputation", address] })
    },
  })

  // Use API data as primary source, fallback to onchain
  const reputation = apiReputation || (onchainReputation
    ? {
        walletAddress: address || "",
        score: Number(onchainReputation[1]) / 100, // Convert from scaled value
        tier: ["D", "C", "B", "A"][Number(onchainReputation[2])] as "A" | "B" | "C" | "D",
        lastUpdated: new Date(Number(onchainReputation[3]) * 1000).toISOString(),
      }
    : undefined)

  return {
    reputation,
    isLoading: isLoadingApi || isLoadingOnchain,
    error: apiError || onchainError,
    updateReputation: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  }
}

