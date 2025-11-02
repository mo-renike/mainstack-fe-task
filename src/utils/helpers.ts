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
