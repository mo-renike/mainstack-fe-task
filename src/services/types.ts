export interface UserResponse {
  first_name: string;
  last_name: string;
  email: string;
}

export interface WalletResponse {
  balance: number;
  total_payout: number;
  total_revenue: number;
  pending_payout: number;
  ledger_balance: number;
}

export interface TransactionMetadata {
  name?: string;
  type?: string;
  email?: string;
  quantity?: number;
  country?: string;
  product_name?: string;
}

export interface TransactionResponse {
  amount: number;
  metadata?: TransactionMetadata;
  payment_reference?: string;
  status: "successful" | "pending" | "failed";
  type: "deposit" | "withdrawal";
  date: string;
}
