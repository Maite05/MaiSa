"use client";

import { Button, color, font, space, Spinner, typography } from "@maisa/ui";
import { AppShellHeader } from "@/components/AppShellHeader";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "../hooks";
import { countUnread } from "../services";

export function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const unread = countUnread(notifications);

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <AppShellHeader activeNavId="notifications" />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: `${space(6)} ${space(8)} ${space(15)}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: space(3) }}>
          <div>
            <p style={{ ...typography.labelCaps, color: color.mutedGold, margin: 0, marginBottom: space(1) }}>{unread} Unread</p>
            <h1 style={{ ...typography.headlineLg, fontSize: "36px", margin: 0 }}>Notifications</h1>
          </div>
          {unread > 0 && (
            <Button variant="ghost" onClick={() => markAllRead.mutate()}>
              Mark All Read
            </Button>
          )}
        </div>

        {isLoading ? (
          <Spinner />
        ) : notifications.length === 0 ? (
          <p style={{ color: color.onSurfaceVariant }}>You're all caught up.</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {notifications.map((n) => (
              <li
                key={n.id}
                style={{
                  display: "flex",
                  gap: space(1.5),
                  padding: `${space(2)} 0`,
                  borderBottom: `1px solid ${color.borderSubtle}`,
                  opacity: n.read ? 0.6 : 1,
                }}
              >
                <span
                  aria-hidden
                  style={{ marginTop: 6, width: 8, height: 8, borderRadius: "9999px", background: n.read ? color.outlineVariant : color.mutedGold, flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "14px" }}>{n.message}</p>
                  <p style={{ margin: `${space(0.5)} 0 0`, fontSize: "12px", color: color.onSurfaceVariant }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markRead.mutate(n.id)}
                    style={{ background: "none", border: "none", color: color.primary, fontSize: "12px", cursor: "pointer", alignSelf: "flex-start" }}
                  >
                    Mark read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default NotificationsPage;
