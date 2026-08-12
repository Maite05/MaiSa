import { BudgetPage } from "@/features/budget/pages/BudgetPage";

export default async function EventBudgetPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <BudgetPage eventId={eventId} />;
}
