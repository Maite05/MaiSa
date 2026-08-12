import { EventOverviewPage } from "@/features/events/pages/EventOverviewPage";

export default async function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <EventOverviewPage eventId={eventId} />;
}
