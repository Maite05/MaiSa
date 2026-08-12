"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import {
  AppHeader,
  ArrowRightIcon,
  cardHeaderRowStyle,
  cardStyle,
  ClipboardIcon,
  ClockIcon,
  color,
  DEFAULT_NAV_ITEMS,
  FileTextIcon,
  font,
  ProgressBar,
  PlusIcon,
  radius,
  space,
  typography,
  UserPlusIcon,
  type NavItem,
} from "@maisa/ui";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ReleaseCardData {
  id: string;
  eyebrow: string;
  status: string;
  /** Maps status text to a badge treatment; falls back to "neutral". */
  statusTone?: "live" | "planning" | "neutral";
  title: string;
  date: string;
  location: string;
  /** 0-100 */
  progress: number;
  progressLabel: string;
}

export interface PipelineStageData {
  id: string;
  label: string;
  status: "completed" | "in-progress" | "pending";
  /** 0-100, drives the underline progress bar */
  progress: number;
}

export interface MoodboardImage {
  id: string;
  label: string;
  src?: string;
}

export interface CalendarDay {
  date: number;
  /** e.g. "MON" */
  dayOfWeek: string;
  isCurrentPeriod: boolean;
  tag?: string;
  /** Soft highlight, e.g. to flag "no availability" / focus days */
  highlighted?: boolean;
}

export interface ActivityItemData {
  id: string;
  actor: string;
  message: string;
  timestamp: string;
  dotTone: "sage" | "gold" | "primary";
  thumbnailSrc?: string;
}

export interface QuickActionData {
  id: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

export type { NavItem };

export interface ProductionOverviewProps {
  /** Shown as "Welcome back, {role}" */
  role?: string;
  directorName?: string;
  avatarSrc?: string;
  navItems?: NavItem[];
  activeNavId?: string;
  onNavigate?: (id: string) => void;
  onSearch?: () => void;
  unreadNotifications?: number;
  onOpenNotifications?: () => void;
  onCreateEvent?: () => void;
  releases?: ReleaseCardData[];
  quickActions?: QuickActionData[];
  pipelineStages?: PipelineStageData[];
  moodboardImages?: MoodboardImage[];
  onViewFullPipeline?: () => void;
  calendarWeeks?: CalendarDay[][];
  activityItems?: ActivityItemData[];
  newActivityCount?: number;
}

/* ------------------------------------------------------------------ */
/*  Default data — mirrors the reference mockup 1:1 so the component   */
/*  renders meaningfully with zero required props; override via props  */
/*  once real data is wired up.                                        */
/* ------------------------------------------------------------------ */

const DEFAULT_RELEASES: ReleaseCardData[] = [
  {
    id: "equinox",
    eyebrow: "Upcoming Release",
    status: "Live",
    statusTone: "live",
    title: "The Autumn Equinox Collection",
    date: "Oct 12",
    location: "Paris",
    progress: 75,
    progressLabel: "75% Production Complete",
  },
  {
    id: "lunar",
    eyebrow: "Editorial Shoot",
    status: "Planning",
    statusTone: "planning",
    title: "Lunar Minimalism Series",
    date: "Nov 04",
    location: "Studio A",
    progress: 25,
    progressLabel: "25% Logistics Arranged",
  },
];

const DEFAULT_PIPELINE: PipelineStageData[] = [
  { id: "concept", label: "Concept", status: "completed", progress: 100 },
  { id: "sourcing", label: "Sourcing", status: "completed", progress: 100 },
  { id: "production", label: "Production", status: "in-progress", progress: 55 },
  { id: "post-pro", label: "Post-Pro", status: "pending", progress: 0 },
  { id: "distribution", label: "Distribution", status: "pending", progress: 0 },
];

const DEFAULT_MOODBOARD: MoodboardImage[] = [
  { id: "moodboard", label: "Visual Moodboard" },
  { id: "detail", label: "Production Detail" },
  { id: "scheduling", label: "Studio Scheduling" },
];

const DEFAULT_CALENDAR: CalendarDay[][] = [
  [
    { date: 28, dayOfWeek: "MON", isCurrentPeriod: false },
    { date: 29, dayOfWeek: "TUE", isCurrentPeriod: false },
    { date: 30, dayOfWeek: "WED", isCurrentPeriod: false },
    { date: 1, dayOfWeek: "THU", isCurrentPeriod: true },
    { date: 2, dayOfWeek: "FRI", isCurrentPeriod: true, tag: "Fabric Delivery" },
    { date: 3, dayOfWeek: "SAT", isCurrentPeriod: true },
    { date: 4, dayOfWeek: "SUN", isCurrentPeriod: true },
  ],
  [
    { date: 5, dayOfWeek: "MON", isCurrentPeriod: true, highlighted: true },
    { date: 6, dayOfWeek: "TUE", isCurrentPeriod: true, highlighted: true },
    { date: 7, dayOfWeek: "WED", isCurrentPeriod: true, tag: "Studio Shoot" },
    { date: 8, dayOfWeek: "THU", isCurrentPeriod: true },
    { date: 9, dayOfWeek: "FRI", isCurrentPeriod: true },
    { date: 10, dayOfWeek: "SAT", isCurrentPeriod: true },
    { date: 11, dayOfWeek: "SUN", isCurrentPeriod: true },
  ],
];

const DEFAULT_ACTIVITY: ActivityItemData[] = [
  {
    id: "a1",
    actor: "Julianne V.",
    message: "approved the latest fabric samples for Equinox Collection.",
    timestamp: "12 minutes ago",
    dotTone: "sage",
  },
  {
    id: "a2",
    actor: "Marcus T.",
    message: "uploaded 12 new hi-res assets to Lunar Series gallery.",
    timestamp: "45 minutes ago",
    dotTone: "gold",
  },
  {
    id: "a3",
    actor: "System Notification",
    message: "Automated backup of all production files successful.",
    timestamp: "2 hours ago",
    dotTone: "primary",
  },
  {
    id: "a4",
    actor: "Elena G.",
    message: "finalized the vendor contract for Tokyo Pop-up Event.",
    timestamp: "Yesterday",
    dotTone: "sage",
  },
  {
    id: "a5",
    actor: "Design Team",
    message: "shared a new concept teaser.",
    timestamp: "Yesterday",
    dotTone: "gold",
  },
];

/* ------------------------------------------------------------------ */
/*  Scoped CSS — inline `style` objects can't express hover/focus/media */
/*  rules, so the handful that matter live here under one class scope.  */
/* ------------------------------------------------------------------ */

const SCOPE = "maisa-production-overview";

const scopedCss = `
.${SCOPE} button { font-family: ${font.sans}; cursor: pointer; }
.${SCOPE} button:focus-visible { outline: 2px solid ${color.primary}; outline-offset: 2px; }
.${SCOPE} .primary-btn {
  border: none;
  border-radius: ${radius.DEFAULT};
  background-color: ${color.primary};
  color: ${color.onPrimary};
  transition: opacity 150ms ease;
}
.${SCOPE} .primary-btn:hover { opacity: 0.9; }
.${SCOPE} .lift-on-hover { transition: box-shadow 200ms ease, transform 200ms ease; }
.${SCOPE} .lift-on-hover:hover { box-shadow: 0 20px 48px rgba(74, 55, 40, 0.08); transform: translateY(-2px); }
.${SCOPE} .quick-action {
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: ${radius.md};
  background: rgba(255,255,255,0.06);
  color: ${color.inverseOnSurface};
  transition: background-color 150ms ease;
}
.${SCOPE} .quick-action:hover { background: rgba(255,255,255,0.14); }
.${SCOPE} .link-btn { background: none; border: none; display: inline-flex; align-items: center; gap: ${space(0.5)}; color: ${color.onSurfaceVariant}; }
.${SCOPE} .link-btn:hover { color: ${color.onSurface}; }
.${SCOPE} .calendar-scroll { overflow-x: auto; }

@media (max-width: 980px) {
  .${SCOPE} .layout-grid { grid-template-columns: 1fr !important; }
  .${SCOPE} .release-row { grid-template-columns: 1fr !important; }
  .${SCOPE} .quick-action-grid { grid-template-columns: repeat(4, 1fr) !important; }
}
`;

/* ------------------------------------------------------------------ */
/*  Style objects                                                      */
/* ------------------------------------------------------------------ */

const styles: Record<string, CSSProperties> = {
  page: { background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" },
  main: { maxWidth: 1280, margin: "0 auto", padding: `${space(6)} ${space(8)} ${space(15)}` },
  topRow: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: space(5),
    gap: space(3),
    flexWrap: "wrap",
  },
  eyebrow: { ...typography.labelCaps, color: color.mutedGold, margin: 0, marginBottom: space(1) },
  h1: { ...typography.headlineXl, fontSize: "48px", margin: 0 },
  layoutGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: space(3), alignItems: "start" },
  leftCol: { display: "flex", flexDirection: "column", gap: space(3) },
  rightCol: { display: "flex", flexDirection: "column", gap: space(3) },
  releaseRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: space(3) },
};

/* ------------------------------------------------------------------ */
/*  Subcomponents                                                       */
/* ------------------------------------------------------------------ */

function StatusBadge({ status, tone = "neutral" }: { status: string; tone?: "live" | "planning" | "neutral" }) {
  const toneStyles: Record<string, CSSProperties> = {
    live: { background: color.secondaryContainer, color: color.onSecondaryContainer },
    planning: { background: "rgba(197, 160, 89, 0.18)", color: "#8a6a2f" },
    neutral: { background: color.surfaceContainerHigh, color: color.onSurfaceVariant },
  };
  return (
    <span
      style={{
        ...typography.labelCaps,
        ...toneStyles[tone],
        padding: `${space(0.5)} ${space(1.25)}`,
        borderRadius: radius.full,
        letterSpacing: "0.08em",
      }}
    >
      {status}
    </span>
  );
}

function ReleaseCard({ data }: { data: ReleaseCardData }) {
  return (
    <article className="lift-on-hover" style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p style={{ ...typography.labelCaps, color: color.onSurfaceVariant, margin: 0 }}>{data.eyebrow}</p>
        <StatusBadge status={data.status} tone={data.statusTone} />
      </div>
      <h3 style={{ fontFamily: font.serif, fontSize: "24px", fontWeight: 400, margin: `${space(1)} 0 ${space(2)}` }}>
        {data.title}
      </h3>
      <div style={{ display: "flex", gap: space(2), color: color.onSurfaceVariant, fontSize: "14px", marginBottom: space(3) }}>
        <span>📅 {data.date}</span>
        <span>📍 {data.location}</span>
      </div>
      <ProgressBar progress={data.progress} />
      <p style={{ fontSize: "13px", color: color.onSurfaceVariant, marginTop: space(1) }}>{data.progressLabel}</p>
    </article>
  );
}

function QuickActionsPanel({ actions }: { actions: QuickActionData[] }) {
  return (
    <section style={{ ...cardStyle, background: color.primary, border: "none" }} aria-label="Quick actions">
      <h2 style={{ ...typography.headlineMd, color: color.inverseOnSurface, margin: `0 0 ${space(2.5)}` }}>
        Quick Actions
      </h2>
      <div className="quick-action-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: space(1.5) }}>
        {actions.map((action) => (
          <button
            key={action.id}
            className="quick-action"
            onClick={action.onClick}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space(1), padding: `${space(2)} ${space(1)}` }}
          >
            {action.icon}
            <span style={{ ...typography.labelCaps, letterSpacing: "0.06em" }}>{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function PipelineStageColumn({ stage }: { stage: PipelineStageData }) {
  const statusCopy: Record<PipelineStageData["status"], string> = {
    completed: "Completed",
    "in-progress": "In Progress",
    pending: "Pending",
  };
  const statusColor: Record<PipelineStageData["status"], string> = {
    completed: color.secondary,
    "in-progress": color.mutedGold,
    pending: color.outline,
  };
  return (
    <div style={{ flex: 1, minWidth: 90 }}>
      <p style={{ ...typography.labelCaps, margin: `0 0 ${space(1)}` }}>{stage.label}</p>
      <ProgressBar
        progress={stage.progress}
        tone={stage.status === "completed" ? "primary" : stage.status === "in-progress" ? "gold" : "muted"}
      />
      <p style={{ fontSize: "12px", marginTop: space(1), color: statusColor[stage.status] }}>{statusCopy[stage.status]}</p>
    </div>
  );
}

function ImageThumb({ image }: { image: MoodboardImage }) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "4 / 3",
        borderRadius: radius.DEFAULT,
        overflow: "hidden",
        background: image.src ? undefined : `linear-gradient(135deg, ${color.surfaceContainerHigh}, ${color.surfaceDim})`,
      }}
    >
      {image.src && (
        // eslint-disable-next-line @next/next/no-img-element -- plain <img>, no framework assumed
        <img src={image.src} alt={image.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(74,55,40,0.55), transparent 55%)" }} />
      <span style={{ ...typography.labelCaps, position: "absolute", left: space(1.5), bottom: space(1.5), color: "#fff", letterSpacing: "0.08em" }}>
        {image.label}
      </span>
    </div>
  );
}

function ProductionProgressCard({
  stages,
  images,
  onViewFullPipeline,
}: {
  stages: PipelineStageData[];
  images: MoodboardImage[];
  onViewFullPipeline?: () => void;
}) {
  return (
    <section style={cardStyle} aria-label="Production progress">
      <div style={cardHeaderRowStyle}>
        <h2 style={{ ...typography.headlineMd, margin: 0 }}>Production Progress</h2>
        <button className="link-btn" onClick={onViewFullPipeline}>
          <span style={{ ...typography.labelCaps, letterSpacing: "0.08em" }}>View Full Pipeline</span>
          <ArrowRightIcon width={14} height={14} />
        </button>
      </div>
      <div style={{ display: "flex", gap: space(2), marginBottom: space(3), flexWrap: "wrap" }}>
        {stages.map((stage) => (
          <PipelineStageColumn key={stage.id} stage={stage} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: space(2) }}>
        {images.map((image) => (
          <ImageThumb key={image.id} image={image} />
        ))}
      </div>
    </section>
  );
}

function ProductionCalendarCard({ weeks }: { weeks: CalendarDay[][] }) {
  return (
    <section style={cardStyle} aria-label="Production calendar">
      <h2 style={{ ...typography.headlineMd, marginBottom: space(2.5), marginTop: 0 }}>Production Calendar</h2>
      <div className="calendar-scroll">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
          <thead>
            <tr>
              {weeks[0]?.map((day) => (
                <th
                  key={day.dayOfWeek}
                  scope="col"
                  style={{ ...typography.labelCaps, textAlign: "left", color: color.onSurfaceVariant, fontWeight: 600, padding: space(1), borderBottom: `1px solid ${color.borderSubtle}` }}
                >
                  {day.dayOfWeek}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIdx) => (
              <tr key={weekIdx}>
                {week.map((day) => (
                  <td
                    key={`${weekIdx}-${day.dayOfWeek}`}
                    style={{
                      verticalAlign: "top",
                      padding: space(1),
                      height: 72,
                      borderBottom: `1px solid ${color.borderSubtle}`,
                      background: day.highlighted ? "rgba(186, 26, 26, 0.05)" : "transparent",
                    }}
                  >
                    <span style={{ fontSize: "14px", color: day.isCurrentPeriod ? color.onSurface : color.outline, fontWeight: day.highlighted ? 700 : 400 }}>
                      {day.date}
                    </span>
                    {day.tag && (
                      <div
                        style={{
                          ...typography.labelCaps,
                          marginTop: space(1),
                          padding: `${space(0.5)} ${space(1)}`,
                          background: color.surfaceContainerHigh,
                          color: color.onSurfaceVariant,
                          borderRadius: radius.sm,
                          letterSpacing: "0.02em",
                          textTransform: "none",
                          fontSize: "11px",
                          fontWeight: 500,
                          width: "fit-content",
                        }}
                      >
                        {day.tag}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const DOT_COLOR: Record<ActivityItemData["dotTone"], string> = {
  sage: color.secondary,
  gold: color.mutedGold,
  primary: color.primary,
};

function TeamActivityPanel({ items, newCount }: { items: ActivityItemData[]; newCount: number }) {
  return (
    <section style={cardStyle} aria-label="Team activity">
      <div style={cardHeaderRowStyle}>
        <h2 style={{ ...typography.headlineMd, margin: 0 }}>Team Activity</h2>
        {newCount > 0 && (
          <span style={{ ...typography.labelCaps, background: color.surfaceContainerHigh, color: color.onSurfaceVariant, padding: `${space(0.5)} ${space(1)}`, borderRadius: radius.sm }}>
            New ({newCount})
          </span>
        )}
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((item, idx) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              gap: space(1.5),
              paddingBottom: space(2.5),
              marginBottom: space(2.5),
              borderBottom: idx < items.length - 1 ? `1px solid ${color.borderSubtle}` : "none",
            }}
          >
            <span aria-hidden style={{ marginTop: 6, width: 8, height: 8, borderRadius: radius.full, background: DOT_COLOR[item.dotTone], flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.5 }}>
                <strong style={{ fontWeight: 600 }}>{item.actor}</strong> {item.message}
              </p>
              <p style={{ margin: `${space(0.5)} 0 0`, fontSize: "12px", color: color.onSurfaceVariant }}>{item.timestamp}</p>
              {item.thumbnailSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.thumbnailSrc} alt="" style={{ width: "100%", borderRadius: radius.sm, marginTop: space(1) }} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Root component                                                     */
/* ------------------------------------------------------------------ */

export function ProductionOverview({
  role = "Director",
  directorName,
  avatarSrc,
  navItems = DEFAULT_NAV_ITEMS,
  activeNavId,
  onNavigate,
  onSearch,
  unreadNotifications = 0,
  onOpenNotifications,
  onCreateEvent,
  releases = DEFAULT_RELEASES,
  quickActions,
  pipelineStages = DEFAULT_PIPELINE,
  moodboardImages = DEFAULT_MOODBOARD,
  onViewFullPipeline,
  calendarWeeks = DEFAULT_CALENDAR,
  activityItems = DEFAULT_ACTIVITY,
  newActivityCount = 4,
}: ProductionOverviewProps) {
  const [internalActiveNav, setInternalActiveNav] = useState(activeNavId ?? navItems[0]?.id);
  const activeNav = activeNavId ?? internalActiveNav;

  const resolvedQuickActions: QuickActionData[] =
    quickActions ?? [
      { id: "add-vendor", label: "Add Vendor", icon: <UserPlusIcon color={color.inverseOnSurface} /> },
      { id: "log-hours", label: "Log Hours", icon: <ClockIcon color={color.inverseOnSurface} /> },
      { id: "resources", label: "Resources", icon: <ClipboardIcon color={color.inverseOnSurface} /> },
      { id: "reports", label: "Reports", icon: <FileTextIcon color={color.inverseOnSurface} /> },
    ];

  function handleNavClick(id: string) {
    setInternalActiveNav(id);
    onNavigate?.(id);
  }

  return (
    <div className={SCOPE} style={styles.page}>
      {/* eslint-disable-next-line react/no-danger -- scoped, static, build-time-known CSS string */}
      <style dangerouslySetInnerHTML={{ __html: scopedCss }} />

      <AppHeader
        navItems={navItems}
        activeNavId={activeNav}
        onNavigate={handleNavClick}
        onSearch={onSearch}
        unreadNotifications={unreadNotifications}
        onOpenNotifications={onOpenNotifications}
        avatarSrc={avatarSrc}
        displayName={directorName ?? role}
      />

      <main style={styles.main}>
        <div style={styles.topRow}>
          <div>
            <p style={styles.eyebrow}>Welcome back, {role}</p>
            <h1 style={styles.h1}>Production Overview</h1>
          </div>
          <button className="primary-btn" onClick={onCreateEvent} style={{ display: "flex", alignItems: "center", gap: space(1), padding: `${space(1.5)} ${space(2.5)}` }}>
            <PlusIcon color={color.onPrimary} width={16} height={16} />
            <span style={{ ...typography.labelCaps, letterSpacing: "0.08em" }}>Create New Event</span>
          </button>
        </div>

        <div className="layout-grid" style={styles.layoutGrid}>
          <div style={styles.leftCol}>
            <div className="release-row" style={styles.releaseRow}>
              {releases.map((release) => (
                <ReleaseCard key={release.id} data={release} />
              ))}
            </div>

            <ProductionProgressCard stages={pipelineStages} images={moodboardImages} onViewFullPipeline={onViewFullPipeline} />

            <ProductionCalendarCard weeks={calendarWeeks} />
          </div>

          <div style={styles.rightCol}>
            <QuickActionsPanel actions={resolvedQuickActions} />
            <TeamActivityPanel items={activityItems} newCount={newActivityCount} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductionOverview;
