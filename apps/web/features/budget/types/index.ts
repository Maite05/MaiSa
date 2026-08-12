// Mirrors packages/database/prisma/schema.prisma's BudgetItem model.
// estimatedCost/actualCost are Prisma Decimal -> serialized as strings by
// the API (see lib/format.ts's parseDecimal for why).
export interface BudgetItem {
  id: string;
  eventId: string;
  category: string;
  description: string | null;
  estimatedCost: string;
  actualCost: string | null;
  createdAt: string;
  updatedAt: string;
}
