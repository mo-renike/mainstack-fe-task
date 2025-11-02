import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./api-client";
import type {
  TransactionResponse,
  UserResponse,
  WalletResponse,
} from "./types";

const queryKeys = {
  user: ["user"] as const,
  wallet: ["wallet"] as const,
  transactions: ["transactions"] as const,
};

export const useUserQuery = () =>
  useQuery({
    queryKey: queryKeys.user,
    queryFn: ({ signal }) => apiGet<UserResponse>("/user", { signal }),
  });

export const useWalletQuery = () =>
  useQuery({
    queryKey: queryKeys.wallet,
    queryFn: ({ signal }) => apiGet<WalletResponse>("/wallet", { signal }),
  });

export const useTransactionsQuery = () =>
  useQuery({
    queryKey: queryKeys.transactions,
    queryFn: ({ signal }) =>
      apiGet<TransactionResponse[]>("/transactions", { signal }),
    select: (transactions) =>
      transactions.sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
  });
