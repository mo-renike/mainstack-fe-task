import { describe, expect, it } from "vitest";
import {
  capitalize,
  formatCurrency,
  formatDate,
  getInitials,
  toTitleCase,
  getTransactionVisualType,
  getTransactionTitle,
  getErrorMessage,
  deriveOptionsFromTransactions,
} from "./helpers";
import type { TransactionResponse } from "../services/types";

describe("helpers", () => {
  it("generates initials when names are provided", () => {
    expect(getInitials("Jane", "Doe")).toBe("JD");
  });

  it("falls back to default initials when names are missing", () => {
    expect(getInitials()).toBe("OJ");
  });

  it("formats valid numbers as USD currency", () => {
    expect(formatCurrency(1234.56)).toBe("USD 1,234.56");
  });

  it("returns an em dash for invalid currency values", () => {
    expect(formatCurrency(undefined)).toBe("—");
    expect(formatCurrency(Number.NaN)).toBe("—");
  });

  it("formats ISO dates and preserves invalid input", () => {
    expect(formatDate("2024-01-15")).toBe("Jan 15, 2024");
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("capitalizes the first letter of a word", () => {
    expect(capitalize("pending")).toBe("Pending");
  });

  it("converts strings with spaces or underscores to title case", () => {
    expect(toTitleCase("cash_withdrawal")).toBe("Cash Withdrawal");
    expect(toTitleCase("bank transfer")).toBe("Bank Transfer");
  });

  // Transaction-related helpers
  it("determines visual type for pending and failed statuses", () => {
    expect(
      getTransactionVisualType({
        status: "pending",
        type: "deposit",
      } as unknown as TransactionResponse)
    ).toBe("pending");
    expect(
      getTransactionVisualType({
        status: "failed",
        type: "deposit",
      } as unknown as TransactionResponse)
    ).toBe("failed");
  });

  it("returns withdrawal or deposit based on type when status is not pending/failed", () => {
    expect(
      getTransactionVisualType({
        status: "completed",
        type: "withdrawal",
      } as unknown as TransactionResponse)
    ).toBe("withdrawal");
    expect(
      getTransactionVisualType({
        status: "completed",
        type: "deposit",
      } as unknown as TransactionResponse)
    ).toBe("deposit");
  });

  it("builds transaction titles from product_name, metadata.type, or type fallback", () => {
    expect(
      getTransactionTitle({
        metadata: { product_name: "PayLater" },
        type: "deposit",
      } as unknown as TransactionResponse)
    ).toBe("PayLater");

    expect(
      getTransactionTitle({
        type: "withdrawal",
      } as unknown as TransactionResponse)
    ).toBe("Cash withdrawal");

    expect(
      getTransactionTitle({
        metadata: { type: "bank_transfer" },
        type: "deposit",
      } as unknown as TransactionResponse)
    ).toBe("Bank Transfer");

    expect(
      getTransactionTitle({ type: "refund" } as unknown as TransactionResponse)
    ).toBe("Refund");
  });

  it("returns error.message for Error instances and a fallback for other errors", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
    expect(getErrorMessage(123)).toBe("Something went wrong.");
  });

  it("derives checkbox options from transactions and sorts/labels them correctly", () => {
    const txs = [
      { type: "cash_withdrawal", status: "pending" },
      { type: "bank_transfer", status: "failed" },
      { type: "cash_withdrawal", status: "failed" },
    ];

    const typeOptions = deriveOptionsFromTransactions(
      txs as unknown as TransactionResponse[],
      "type"
    );
    expect(typeOptions).toEqual([
      { value: "bank_transfer", label: "Bank Transfer" },
      { value: "cash_withdrawal", label: "Cash Withdrawal" },
    ]);

    const statusOptions = deriveOptionsFromTransactions(
      txs as unknown as TransactionResponse[],
      "status"
    );
    expect(statusOptions).toEqual([
      { value: "failed", label: "Failed" },
      { value: "pending", label: "Pending" },
    ]);

    expect(deriveOptionsFromTransactions([], "type")).toEqual([]);
  });
});
