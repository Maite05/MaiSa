"use client";

import { color, Modal, Spinner } from "@maisa/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatCurrency, formatDate } from "../../../lib/format";
import { useSession } from "../../authentication/store";
import { updateTask as updateTaskRequest } from "../../tasks/api";
import { useTasks } from "../../tasks/hooks";
import { summarizeBudget } from "../../budget/services";
import { useBudgetItems } from "../../budget/hooks";
import { summarizeGuests } from "../../guests/services";
import { useGuests } from "../../guests/hooks";
import { sortByStartTime } from "../../timeline/services";
import { useTimelineItems } from "../../timeline/hooks";
import { EventForm } from "../components/EventForm";
import { useEvent } from "../hooks";
import { EventDetail, type EventTab, type MilestoneData, type MilestoneStatus, type TaskItemData } from "./EventDetail";

const TABS: EventTab[] = [
  { id: "timeline", label: "Timeline" },
  { id: "guests", label: "Guests" },
  { id: "budget", label: "Budget" },
  { id: "tasks", label: "Tasks" },
  { id: "contracts", label: "Contracts" },
  { id: "documents", label: "Documents" },
  { id: "payments", label: "Payments" },
];

const TAB_PATH: Record<string, string> = {
  guests: "guests",
  budget: "budget",
  tasks: "tasks",
  timeline: "timeline",
  contracts: "contracts",
  documents: "documents",
  payments: "payments",
};

function deriveMilestoneStatus(startTime: string, endTime: string | null): MilestoneStatus {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : start;
  if (end < now) return "completed";
  if (start <= now && now <= end) return "current";
  return "upcoming";
}

/**
 * The real-data version of the "Sterling Wedding" reference screen: fetches
 * the event plus its guests/budget/tasks/timeline and maps them onto
 * EventDetail's props. Vision board stays static — there's no backend
 * concept for it (packages/database has no such model).
 */
export function EventOverviewPage({ eventId }: { eventId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = useSession();
  const [editOpen, setEditOpen] = useState(false);

  const { data: event, isLoading: eventLoading } = useEvent(eventId);
  const { data: guestsPage } = useGuests(eventId, { limit: 200 });
  const { data: budgetPage } = useBudgetItems(eventId, { limit: 200 });
  const { data: tasksPage } = useTasks(eventId, { limit: 200 });
  const { data: timelinePage } = useTimelineItems(eventId, { limit: 200 });

  if (eventLoading || !event) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Spinner />
      </div>
    );
  }

  const guests = guestsPage?.data ?? [];
  const guestSummary = summarizeGuests(guests);
  const attending = guests.filter((g) => g.rsvpStatus === "ATTENDING").length;
  const declined = guests.filter((g) => g.rsvpStatus === "DECLINED").length;

  const budgetItems = budgetPage?.data ?? [];
  const budgetTotals = summarizeBudget(budgetItems);

  const timelineItems = sortByStartTime(timelinePage?.data ?? []);
  const milestones: MilestoneData[] = timelineItems.slice(0, 6).map((item) => ({
    id: item.id,
    date: formatDate(item.startTime),
    title: item.title,
    description: item.notes ?? "",
    status: deriveMilestoneStatus(item.startTime, item.endTime),
  }));

  const tasks = tasksPage?.data ?? [];
  const priorityTasks: TaskItemData[] = tasks
    .filter((t) => t.status !== "DONE")
    .sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"))
    .slice(0, 5)
    .map((t) => ({
      id: t.id,
      label: t.title,
      dueLabel: t.dueDate ? `Due ${formatDate(t.dueDate)}` : "No due date",
      done: false,
    }));

  async function handleToggleTask(taskId: string, done: boolean) {
    await updateTaskRequest(eventId, taskId, { status: done ? "DONE" : "TODO" });
    queryClient.invalidateQueries({ queryKey: ["tasks", eventId] });
  }

  return (
    <>
      <EventDetail
        activeNavId="events"
        directorName={session?.name ?? session?.email ?? "Director"}
        onNavigate={(id) => router.push(id === "dashboard" ? "/" : `/${id}`)}
        eventInfo={{
          eyebrow: [event.type, event.eventDate ? formatDate(event.eventDate) : "Date TBD"].filter(Boolean).join(" · "),
          title: event.name,
          subtitle: event.venueName ? `Planned at ${event.venueName}.` : "Venue not yet set.",
        }}
        onEditEvent={() => setEditOpen(true)}
        onShareView={() => {
          navigator.clipboard?.writeText(window.location.href);
          window.alert("Link copied to clipboard.");
        }}
        tabs={TABS}
        activeTabId="timeline"
        onTabChange={(id) => {
          const path = TAB_PATH[id];
          if (path) router.push(`/events/${eventId}/${path}`);
        }}
        guestProgress={{
          confirmed: attending,
          totalInvited: guestSummary.totalGuests,
          attending,
          declined,
          noResponse: guestSummary.totalGuests - attending - declined,
        }}
        onViewGuestList={() => router.push(`/events/${eventId}/guests`)}
        budget={{
          spentToDate: budgetTotals.actual,
          totalAllocation: budgetTotals.estimated,
          categories: budgetTotals.categories.map((c) => ({
            id: c.category,
            label: c.category,
            amount: c.estimated,
            percentOfBudget: budgetTotals.estimated > 0 ? Math.round((c.estimated / budgetTotals.estimated) * 100) : 0,
          })),
        }}
        onViewDetailedLedger={() => router.push(`/events/${eventId}/budget`)}
        milestones={
          milestones.length > 0
            ? milestones
            : [{ id: "empty", date: "—", title: "No timeline items yet", description: "Add one from the Timeline tab.", status: "upcoming" }]
        }
        onAddMilestone={() => router.push(`/events/${eventId}/timeline`)}
        tasks={
          priorityTasks.length > 0
            ? priorityTasks
            : [{ id: "empty", label: "No open tasks", dueLabel: "Add tasks from the Tasks tab" }]
        }
        onToggleTask={handleToggleTask}
      />

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Event">
        <EventForm event={event} onDone={() => setEditOpen(false)} />
      </Modal>

      {/* Quick budget sanity readout for planners scanning past the cards above. */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: `0 32px 32px`, color: color.onSurfaceVariant, fontSize: "12px" }}>
        {formatCurrency(budgetTotals.remaining)} remaining against the estimated budget.
      </div>
    </>
  );
}

export default EventOverviewPage;
