// No apps/api module exists yet — reusable event templates (a starting
// timeline/budget/checklist shape) planners can apply when creating a new
// event, per the "Custom event templates" line in the product feature spec.
export interface EventTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
}
