// Shared formatting helpers — feature-level utils/ barrels re-export from
// here plus anything genuinely feature-specific, instead of each feature
// reimplementing currency/date formatting.

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

/**
 * apps/api serializes Prisma `Decimal` fields (budget/invoice/payment
 * amounts) as strings — Decimal.toJSON() returns a string, and Fastify's
 * default JSON serializer (no response schema is declared on these routes)
 * calls it. Parse before doing math or formatting as currency.
 */
export function parseDecimal(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return typeof value === "number" ? value : Number.parseFloat(value) || 0;
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

export function formatTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(date);
}

/** "Jane Doe" -> "JD" — used for avatar fallbacks across features. */
export function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
