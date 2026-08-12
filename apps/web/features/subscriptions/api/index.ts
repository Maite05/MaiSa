import type { ChangePlanFormValues } from "../schemas";
import type { SubscriptionInfo, PlanTier } from "../types";

const LATENCY_MS = 150;
function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));
}

let subscription: SubscriptionInfo = {
  plan: "Studio",
  status: "ACTIVE",
  renewsAt: new Date(Date.now() + 21 * 86400000).toISOString(),
  seats: 8,
};

export async function getSubscription(): Promise<SubscriptionInfo> {
  return delay({ ...subscription });
}

export async function changePlan(input: ChangePlanFormValues): Promise<SubscriptionInfo> {
  subscription = { ...subscription, plan: input.plan as PlanTier };
  return delay({ ...subscription });
}
