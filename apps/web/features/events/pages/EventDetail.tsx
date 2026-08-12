"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  AppHeader,
  cardHeaderRowStyle,
  cardStyle,
  color,
  DEFAULT_NAV_ITEMS,
  font,
  ProgressBar,
  radius,
  space,
  typography,
  type NavItem,
} from "@maisa/ui";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface EventHeaderInfo {
  /** e.g. "Private Event · September 2024" */
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface EventTab {
  id: string;
  label: string;
}

export interface GuestProgressData {
  confirmed: number;
  totalInvited: number;
  attending: number;
  declined: number;
  noResponse: number;
}

export interface BudgetCategoryData {
  id: string;
  label: string;
  amount: number;
  /** 0-100 */
  percentOfBudget: number;
}

export interface BudgetData {
  spentToDate: number;
  totalAllocation: number;
  categories: BudgetCategoryData[];
}

export type MilestoneStatus = "completed" | "current" | "upcoming";

export interface MilestoneData {
  id: string;
  date: string;
  title: string;
  description: string;
  status: MilestoneStatus;
}

export interface TaskItemData {
  id: string;
  label: string;
  dueLabel: string;
  /** Optional — real Task records (packages/database) have no category field, unlike this screen's original mock data. */
  category?: string;
  thumbnailSrc?: string;
  done?: boolean;
}

export interface VisionBoardData {
  imageSrc?: string;
  tag: string;
  title: string;
  quote: string;
  /** Hex swatch colors, shown left-to-right */
  swatches: string[];
}

export interface EventDetailProps {
  // Shared header
  navItems?: NavItem[];
  activeNavId?: string;
  onNavigate?: (id: string) => void;
  onSearch?: () => void;
  unreadNotifications?: number;
  onOpenNotifications?: () => void;
  avatarSrc?: string;
  directorName?: string;

  eventInfo?: EventHeaderInfo;
  onEditEvent?: () => void;
  onShareView?: () => void;

  tabs?: EventTab[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;

  guestProgress?: GuestProgressData;
  onViewGuestList?: () => void;

  budget?: BudgetData;
  onViewDetailedLedger?: () => void;

  milestones?: MilestoneData[];
  onAddMilestone?: () => void;

  tasks?: TaskItemData[];
  onToggleTask?: (id: string, done: boolean) => void;

  visionBoard?: VisionBoardData;
}

/* ------------------------------------------------------------------ */
/*  Default data — mirrors "The Sterling Wedding" reference mockup      */
/* ------------------------------------------------------------------ */

const DEFAULT_EVENT_INFO: EventHeaderInfo = {
  eyebrow: "Private Event · September 2024",
  title: "The Sterling Wedding",
  subtitle:
    "A sophisticated celebration of union at The Glass Pavilion. Orchestrating elegance through minimalist design and meticulous planning.",
};

const DEFAULT_TABS: EventTab[] = [
  { id: "timeline", label: "Timeline" },
  { id: "guests", label: "Guests" },
  { id: "budget", label: "Budget" },
  { id: "tasks", label: "Tasks" },
  { id: "vendors", label: "Vendors" },
];

const DEFAULT_GUEST_PROGRESS: GuestProgressData = {
  confirmed: 142,
  totalInvited: 180,
  attending: 142,
  declined: 12,
  noResponse: 26,
};

const DEFAULT_BUDGET: BudgetData = {
  spentToDate: 62450,
  totalAllocation: 85000,
  categories: [
    { id: "venue", label: "Venue & Catering", amount: 32000, percentOfBudget: 51 },
    { id: "florals", label: "Florals & Decor", amount: 18500, percentOfBudget: 29 },
    { id: "photography", label: "Photography", amount: 7200, percentOfBudget: 11 },
  ],
};

const DEFAULT_MILESTONES: MilestoneData[] = [
  {
    id: "venue-selection",
    date: "June 12",
    title: "Venue Selection",
    description: "The Glass Pavilion secured for the ceremony and reception.",
    status: "completed",
  },
  {
    id: "floral-design",
    date: "July 28",
    title: "Floral Design",
    description: "Finalizing the seasonal palette and botanical arrangements.",
    status: "current",
  },
  {
    id: "stationery",
    date: "Aug 15",
    title: "Stationery & Menus",
    description: "Finalize paper stock and printed menu design with the vendor.",
    status: "upcoming",
  },
  {
    id: "final-walkthrough",
    date: "Sep 5",
    title: "Final Walkthrough",
    description: "On-site run-through with the venue and catering leads.",
    status: "upcoming",
  },
];

const DEFAULT_TASKS: TaskItemData[] = [
  { id: "t1", label: "Finalize stationery paper stock with printer", dueLabel: "Due Tomorrow", category: "Stationery" },
  { id: "t2", label: "Confirm transportation for bridal party", dueLabel: "Due Aug 5", category: "Logistics" },
  { id: "t3", label: "Review lighting plot for reception hall", dueLabel: "Due Aug 12", category: "Decor" },
];

const DEFAULT_VISION_BOARD: VisionBoardData = {
  tag: "Vision Board",
  title: "The Glass Pavilion",
  quote:
    "The design focuses on the interplay of light and transparency, using a palette of ivory, sage, and muted gold to complement the natural surroundings.",
  swatches: ["#FFFFFF", color.softSage, color.mutedGold, color.deepEspresso],
};

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

const currency = (amount: number) => `$${amount.toLocaleString("en-US")}`;

/* ------------------------------------------------------------------ */
/*  Scoped CSS                                                          */
/* ------------------------------------------------------------------ */

const SCOPE = "maisa-event-detail";

const scopedCss = `
.${SCOPE} button { font-family: ${font.sans}; cursor: pointer; }
.${SCOPE} button:focus-visible { outline: 2px solid ${color.primary}; outline-offset: 2px; }
.${SCOPE} .btn-primary {
  border: none;
  border-radius: ${radius.DEFAULT};
  background: ${color.primary};
  color: ${color.onPrimary};
  transition: opacity 150ms ease;
}
.${SCOPE} .btn-primary:hover { opacity: 0.9; }
.${SCOPE} .btn-secondary {
  border: 1px solid ${color.primary};
  border-radius: ${radius.DEFAULT};
  background: transparent;
  color: ${color.primary};
  transition: background-color 150ms ease;
}
.${SCOPE} .btn-secondary:hover { background: ${color.surfaceContainerHigh}; }
.${SCOPE} .tab {
  background: none;
  border: none;
  padding: ${space(1.5)} 0;
  border-bottom: 2px solid transparent;
  color: ${color.onSurfaceVariant};
  transition: color 150ms ease, border-color 150ms ease;
}
.${SCOPE} .tab:hover { color: ${color.onSurface}; }
.${SCOPE} .tab.is-active { color: ${color.onSurface}; border-bottom-color: ${color.primary}; }
.${SCOPE} .link-btn { background: none; border: none; display: inline-flex; align-items: center; gap: ${space(0.5)}; color: ${color.onSurfaceVariant}; }
.${SCOPE} .link-btn:hover { color: ${color.onSurface}; }
.${SCOPE} .icon-sq-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${color.borderSubtle};
  border-radius: ${radius.sm};
  background: ${color.surfaceContainerLowest};
  color: ${color.onSurfaceVariant};
}
.${SCOPE} .icon-sq-btn:hover { background: ${color.surfaceContainerHigh}; }
.${SCOPE} .icon-sq-btn.dark { background: ${color.primary}; color: ${color.onPrimary}; border-color: ${color.primary}; }
.${SCOPE} .milestone-scroll {
  display: flex;
  gap: ${space(2)};
  overflow-x: auto;
  scroll-snap-type: x proximity;
  padding-bottom: ${space(0.5)};
}
.${SCOPE} .milestone-scroll::-webkit-scrollbar { height: 6px; }
.${SCOPE} .milestone-scroll::-webkit-scrollbar-thumb { background: ${color.outlineVariant}; border-radius: ${radius.full}; }
.${SCOPE} .milestone-card { scroll-snap-align: start; flex: 0 0 260px; }
.${SCOPE} .task-row input[type="checkbox"] { accent-color: ${color.primary}; width: 18px; height: 18px; }

@media (max-width: 980px) {
  .${SCOPE} .top-row { flex-direction: column; align-items: flex-start !important; }
  .${SCOPE} .split-row { grid-template-columns: 1fr !important; }
  .${SCOPE} .tab-list { overflow-x: auto; }
}
`;

/* ------------------------------------------------------------------ */
/*  Style objects                                                      */
/* ------------------------------------------------------------------ */

const styles: Record<string, CSSProperties> = {
  page: { background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" },
  main: { maxWidth: 1280, margin: "0 auto", padding: `${space(6)} ${space(8)} ${space(15)}` },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: space(3), marginBottom: space(3) },
  eyebrow: { ...typography.labelCaps, color: color.mutedGold, margin: 0, marginBottom: space(1) },
  h1: { ...typography.headlineLg, fontSize: "40px", margin: 0 },
  subtitle: { ...typography.bodyMd, color: color.onSurfaceVariant, maxWidth: 560, margin: `${space(1.5)} 0 0` },
  tabList: { display: "flex", gap: space(4), listStyle: "none", margin: 0, padding: 0, borderBottom: `1px solid ${color.borderSubtle}`, marginBottom: space(3) },
  splitRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: space(3), marginBottom: space(3) },
};

/* ------------------------------------------------------------------ */
/*  Subcomponents                                                       */
/* ------------------------------------------------------------------ */

function GuestProgressCard({ data, onViewGuestList }: { data: GuestProgressData; onViewGuestList?: () => void }) {
  const percent = data.totalInvited > 0 ? (data.confirmed / data.totalInvited) * 100 : 0;
  const rows: Array<{ label: string; value: number }> = [
    { label: "Attending", value: data.attending },
    { label: "Declined", value: data.declined },
    { label: "No Response", value: data.noResponse },
  ];
  return (
    <section style={cardStyle} aria-label="Guest progress">
      <div style={cardHeaderRowStyle}>
        <h2 style={{ ...typography.headlineMd, margin: 0 }}>Guest Progress</h2>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: space(1), marginBottom: space(1.5) }}>
        <span style={{ fontFamily: font.serif, fontSize: "40px" }}>{data.confirmed}</span>
        <span style={{ color: color.onSurfaceVariant, fontSize: "14px" }}>/ {data.totalInvited} Confirmed</span>
      </div>
      <ProgressBar progress={percent} tone="gold" />

      <ul style={{ listStyle: "none", margin: `${space(2.5)} 0 0`, padding: 0 }}>
        {rows.map((row, idx) => (
          <li
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: `${space(1.25)} 0`,
              borderTop: idx === 0 ? `1px solid ${color.borderSubtle}` : "none",
              borderBottom: `1px solid ${color.borderSubtle}`,
              fontSize: "14px",
            }}
          >
            <span style={{ color: color.onSurfaceVariant }}>{row.label}</span>
            <span style={{ fontWeight: 600 }}>{row.value}</span>
          </li>
        ))}
      </ul>

      {onViewGuestList && (
        <button
          className="btn-secondary"
          onClick={onViewGuestList}
          style={{ width: "100%", marginTop: space(2.5), padding: space(1.5) }}
        >
          <span style={{ ...typography.labelCaps, letterSpacing: "0.08em" }}>View Guest List</span>
        </button>
      )}
    </section>
  );
}

function BudgetAnalysisCard({ data, onViewDetailedLedger }: { data: BudgetData; onViewDetailedLedger?: () => void }) {
  return (
    <section style={cardStyle} aria-label="Budget analysis">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: space(2.5) }}>
        <div>
          <h2 style={{ ...typography.headlineMd, margin: 0 }}>Budget Analysis</h2>
          <p style={{ fontSize: "13px", color: color.onSurfaceVariant, margin: `${space(0.5)} 0 0` }}>
            Total Allocation: {currency(data.totalAllocation)}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontFamily: font.serif, fontSize: "28px", display: "block" }}>{currency(data.spentToDate)}</span>
          <span style={{ ...typography.labelCaps, color: color.mutedGold }}>Spent to Date</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${data.categories.length}, 1fr)`, gap: space(1.5) }}>
        {data.categories.map((cat) => (
          <div key={cat.id} style={{ background: color.surfaceContainerHigh, borderRadius: radius.sm, padding: space(2) }}>
            <p style={{ ...typography.labelCaps, color: color.onSurfaceVariant, margin: 0 }}>{cat.label}</p>
            <p style={{ fontFamily: font.serif, fontSize: "20px", margin: `${space(1)} 0 ${space(0.5)}` }}>{currency(cat.amount)}</p>
            <p style={{ fontSize: "12px", color: color.onSurfaceVariant, margin: 0 }}>{cat.percentOfBudget}% of budget</p>
          </div>
        ))}
      </div>

      {onViewDetailedLedger && (
        <button className="link-btn" onClick={onViewDetailedLedger} style={{ marginTop: space(2.5) }}>
          <span style={{ ...typography.labelCaps, letterSpacing: "0.08em" }}>View Detailed Ledger →</span>
        </button>
      )}
    </section>
  );
}

const MILESTONE_BADGE: Record<MilestoneStatus, { label: string; bg: string; fg: string }> = {
  completed: { label: "Completed", bg: color.secondaryContainer, fg: color.onSecondaryContainer },
  current: { label: "Current", bg: "rgba(197, 160, 89, 0.18)", fg: "#8a6a2f" },
  upcoming: { label: "Upcoming", bg: color.surfaceContainerHigh, fg: color.onSurfaceVariant },
};

function KeyMilestonesCard({
  milestones,
  onAddMilestone,
}: {
  milestones: MilestoneData[];
  onAddMilestone?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(dir: 1 | -1) {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  }

  return (
    <section style={cardStyle} aria-label="Key milestones">
      <div style={cardHeaderRowStyle}>
        <h2 style={{ ...typography.headlineMd, margin: 0 }}>Key Milestones</h2>
        <div style={{ display: "flex", gap: space(1) }}>
          <button className="icon-sq-btn" aria-label="Scroll milestones left" onClick={() => scrollByAmount(-1)}>
            ‹
          </button>
          <button className="icon-sq-btn" aria-label="Scroll milestones right" onClick={() => scrollByAmount(1)}>
            ›
          </button>
          {onAddMilestone && (
            <button className="icon-sq-btn dark" aria-label="Add milestone" onClick={onAddMilestone}>
              +
            </button>
          )}
        </div>
      </div>

      <div className="milestone-scroll" ref={scrollRef}>
        {milestones.map((m) => {
          const badge = MILESTONE_BADGE[m.status];
          return (
            <article
              key={m.id}
              className="milestone-card"
              style={{ border: `1px solid ${color.borderSubtle}`, borderRadius: radius.sm, padding: space(2) }}
            >
              <span
                style={{
                  ...typography.labelCaps,
                  background: badge.bg,
                  color: badge.fg,
                  padding: `${space(0.5)} ${space(1)}`,
                  borderRadius: radius.full,
                  letterSpacing: "0.08em",
                }}
              >
                {badge.label}
              </span>
              <p style={{ ...typography.labelCaps, color: color.onSurfaceVariant, margin: `${space(1.5)} 0 ${space(0.5)}` }}>{m.date}</p>
              <h3 style={{ fontFamily: font.serif, fontSize: "20px", fontWeight: 400, margin: `0 0 ${space(1)}` }}>{m.title}</h3>
              <p style={{ fontSize: "13px", color: color.onSurfaceVariant, margin: 0, lineHeight: 1.5 }}>{m.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PriorityTasksCard({
  tasks,
  onToggleTask,
}: {
  tasks: TaskItemData[];
  onToggleTask?: (id: string, done: boolean) => void;
}) {
  const [doneMap, setDoneMap] = useState<Record<string, boolean>>(
    Object.fromEntries(tasks.map((t) => [t.id, Boolean(t.done)])),
  );

  function toggle(task: TaskItemData) {
    const next = !doneMap[task.id];
    setDoneMap((prev) => ({ ...prev, [task.id]: next }));
    onToggleTask?.(task.id, next);
  }

  return (
    <section style={cardStyle} aria-label="Priority tasks">
      <h2 style={{ ...typography.headlineMd, margin: `0 0 ${space(2)}` }}>Priority Tasks</h2>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {tasks.map((task, idx) => {
          const done = doneMap[task.id];
          return (
            <li
              key={task.id}
              className="task-row"
              style={{
                display: "flex",
                alignItems: "center",
                gap: space(1.5),
                padding: `${space(1.5)} 0`,
                borderTop: idx === 0 ? `1px solid ${color.borderSubtle}` : "none",
                borderBottom: `1px solid ${color.borderSubtle}`,
              }}
            >
              <input
                type="checkbox"
                checked={done}
                onChange={() => toggle(task)}
                aria-label={`Mark "${task.label}" as done`}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "14px", textDecoration: done ? "line-through" : "none", color: done ? color.onSurfaceVariant : color.onSurface }}>
                  {task.label}
                </p>
                <p style={{ ...typography.labelCaps, margin: `${space(0.5)} 0 0`, color: color.onSurfaceVariant, letterSpacing: "0.04em" }}>
                  {task.category ? `${task.dueLabel} · ${task.category}` : task.dueLabel}
                </p>
              </div>
              {task.thumbnailSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={task.thumbnailSrc} alt="" style={{ width: 36, height: 36, borderRadius: radius.sm, objectFit: "cover", flexShrink: 0 }} />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function VisionBoardCard({ data }: { data: VisionBoardData }) {
  return (
    <section style={cardStyle} aria-label="Vision board">
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 10",
          borderRadius: radius.DEFAULT,
          overflow: "hidden",
          marginBottom: space(2),
          background: data.imageSrc ? undefined : `linear-gradient(135deg, ${color.surfaceContainerHigh}, ${color.surfaceDim})`,
        }}
      >
        {data.imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.imageSrc} alt={data.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <span
          style={{
            ...typography.labelCaps,
            position: "absolute",
            top: space(1.5),
            left: space(1.5),
            background: color.mutedGold,
            color: "#fff",
            padding: `${space(0.5)} ${space(1.25)}`,
            borderRadius: radius.full,
            letterSpacing: "0.08em",
          }}
        >
          {data.tag}
        </span>
      </div>
      <h3 style={{ fontFamily: font.serif, fontSize: "22px", fontWeight: 400, margin: `0 0 ${space(1.5)}` }}>{data.title}</h3>
      <p style={{ fontStyle: "italic", fontSize: "14px", color: color.onSurfaceVariant, lineHeight: 1.6, margin: `0 0 ${space(2)}` }}>
        “{data.quote}”
      </p>
      <div style={{ display: "flex", gap: space(1) }}>
        {data.swatches.map((hex, idx) => (
          <span
            key={`${hex}-${idx}`}
            aria-hidden
            style={{ width: 24, height: 24, borderRadius: radius.full, background: hex, border: `1px solid ${color.borderSubtle}` }}
          />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Root component                                                      */
/* ------------------------------------------------------------------ */

export function EventDetail({
  navItems = DEFAULT_NAV_ITEMS,
  activeNavId = "events",
  onNavigate,
  onSearch,
  unreadNotifications = 0,
  onOpenNotifications,
  avatarSrc,
  directorName = "Director",

  eventInfo = DEFAULT_EVENT_INFO,
  onEditEvent,
  onShareView,

  tabs = DEFAULT_TABS,
  activeTabId,
  onTabChange,

  guestProgress = DEFAULT_GUEST_PROGRESS,
  onViewGuestList,

  budget = DEFAULT_BUDGET,
  onViewDetailedLedger,

  milestones = DEFAULT_MILESTONES,
  onAddMilestone,

  tasks = DEFAULT_TASKS,
  onToggleTask,

  visionBoard = DEFAULT_VISION_BOARD,
}: EventDetailProps) {
  const [internalTab, setInternalTab] = useState(activeTabId ?? tabs[0]?.id);
  const activeTab = activeTabId ?? internalTab;

  function handleTabClick(id: string) {
    setInternalTab(id);
    onTabChange?.(id);
  }

  return (
    <div className={SCOPE} style={styles.page}>
      {/* eslint-disable-next-line react/no-danger -- scoped, static, build-time-known CSS string */}
      <style dangerouslySetInnerHTML={{ __html: scopedCss }} />

      <AppHeader
        navItems={navItems}
        activeNavId={activeNavId}
        onNavigate={onNavigate}
        onSearch={onSearch}
        unreadNotifications={unreadNotifications}
        onOpenNotifications={onOpenNotifications}
        avatarSrc={avatarSrc}
        displayName={directorName}
      />

      <main style={styles.main}>
        <div className="top-row" style={styles.topRow}>
          <div>
            <p style={styles.eyebrow}>{eventInfo.eyebrow}</p>
            <h1 style={styles.h1}>{eventInfo.title}</h1>
            <p style={styles.subtitle}>{eventInfo.subtitle}</p>
          </div>
          <div style={{ display: "flex", gap: space(1.5), flexShrink: 0 }}>
            <button className="btn-primary" onClick={onEditEvent} style={{ padding: `${space(1.5)} ${space(2.5)}` }}>
              <span style={{ ...typography.labelCaps, letterSpacing: "0.08em" }}>Edit Event</span>
            </button>
            <button className="btn-secondary" onClick={onShareView} style={{ padding: `${space(1.5)} ${space(2.5)}` }}>
              <span style={{ ...typography.labelCaps, letterSpacing: "0.08em" }}>Share View</span>
            </button>
          </div>
        </div>

        <nav aria-label="Event sections">
          <ul className="tab-list" style={styles.tabList}>
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`tab${tab.id === activeTab ? " is-active" : ""}`}
                  aria-current={tab.id === activeTab ? "page" : undefined}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <span style={{ ...typography.labelCaps, letterSpacing: "0.08em" }}>{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/*
          NOTE: the reference mockup only specifies content for the "Timeline"
          tab — Guests/Budget/Tasks/Vendors presumably drill into a focused
          view of their respective card below. Tabs are fully wired for
          interaction/visual state; swap this static section render for a
          per-tab layout once those designs exist.
        */}
        <div className="split-row" style={styles.splitRow}>
          <GuestProgressCard data={guestProgress} onViewGuestList={onViewGuestList} />
          <BudgetAnalysisCard data={budget} onViewDetailedLedger={onViewDetailedLedger} />
        </div>

        <div style={{ marginBottom: space(3) }}>
          <KeyMilestonesCard milestones={milestones} onAddMilestone={onAddMilestone} />
        </div>

        <div className="split-row" style={{ ...styles.splitRow, gridTemplateColumns: "1.4fr 1fr", marginBottom: 0 }}>
          <PriorityTasksCard tasks={tasks} onToggleTask={onToggleTask} />
          <VisionBoardCard data={visionBoard} />
        </div>
      </main>
    </div>
  );
}

export default EventDetail;
