// No apps/api module exists yet — pre-client pipeline leads. Distinct from
// features/clients' Client model, which the backend does have (a lead
// "converts" to a Client once a real event is being planned with them).
export type LeadStage = "NEW" | "CONTACTED" | "QUALIFIED" | "WON" | "LOST";

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  stage: LeadStage;
}
