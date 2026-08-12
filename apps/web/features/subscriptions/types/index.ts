// No apps/api module exists yet — packages/payments (Stripe) exists as a
// stub for when real billing is wired up; this is a placeholder shape for
// the org's current plan.
export type PlanTier = "Starter" | "Studio" | "Agency";
export type SubscriptionStatus = "ACTIVE" | "PAST_DUE" | "CANCELED";

export interface SubscriptionInfo {
  plan: PlanTier;
  status: SubscriptionStatus;
  renewsAt: string;
  seats: number;
}
