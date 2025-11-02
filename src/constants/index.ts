import type { CheckboxOption } from "../components/ui/checkbox-dropdown";

export const presetDates = [
  { label: "Today", days: 0 },
  { label: "Last 7 days", days: 7 },
  { label: "This month", days: 30 },
  { label: "Last 3 months", days: 90 },
];

export const transactionTypeOptions: CheckboxOption[] = [
  { value: "deposit", label: "Deposits" },
  { value: "withdrawal", label: "Withdrawals" },
];

export const transactionStatusOptions: CheckboxOption[] = [
  { value: "successful", label: "Successful" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];
