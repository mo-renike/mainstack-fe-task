import { describe, expect, it } from "vitest";
import {
  capitalize,
  formatCurrency,
  formatDate,
  getInitials,
  toTitleCase,
} from "./helpers";

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
});
