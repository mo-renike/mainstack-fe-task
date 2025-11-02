export function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.[0] ?? "O";
  const last = lastName?.[0] ?? "J";
  return `${first}${last}`.toUpperCase();
}

export const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const dateLabelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
});

export function formatCurrency(value?: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—";
  }
  return `USD ${currencyFormatter.format(value).replace("$", "").trim()}`;
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return dateFormatter.format(date);
}

export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function toTitleCase(value: string): string {
  return value
    .split(/[\s_]+/)
    .map((part) =>
      part.length > 0 ? part[0].toUpperCase() + part.slice(1) : part
    )
    .join(" ");
}

import type { TransactionResponse } from "../services/types";

export function getTransactionVisualType(
  transaction: TransactionResponse
): "deposit" | "withdrawal" | "pending" | "failed" {
  if (transaction.status === "pending") return "pending";
  if (transaction.status === "failed") return "failed";
  return transaction.type === "withdrawal" ? "withdrawal" : "deposit";
}

export function getTransactionTitle(transaction: TransactionResponse): string {
  if (transaction.metadata?.product_name) {
    return transaction.metadata.product_name;
  }
  if (transaction.type === "withdrawal") {
    return "Cash withdrawal";
  }
  if (transaction.metadata?.type) {
    return toTitleCase(transaction.metadata.type);
  }
  return toTitleCase(transaction.type);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong.";
}
