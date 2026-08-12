import { TimelinePage } from "@/features/timeline/pages/TimelinePage";

export default async function EventTimelinePage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  return <TimelinePage eventId={eventId} />;
}
