import { color, font, radius, space, typography } from "../theme/tokens";
import { BellIcon, SearchIcon } from "./icons";

export interface NavItem {
  id: string;
  label: string;
}

export interface AppHeaderProps {
  navItems?: NavItem[];
  /** Controlled active nav id; falls back to the first item if omitted. */
  activeNavId?: string;
  onNavigate?: (id: string) => void;
  onSearch?: () => void;
  unreadNotifications?: number;
  onOpenNotifications?: () => void;
  avatarSrc?: string;
  /** Used for the avatar alt text and initials fallback (e.g. "Sarah Chen"). */
  displayName?: string;
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "events", label: "Events" },
  { id: "vendors", label: "Vendors" },
  { id: "team", label: "Team" },
];

const SCOPE = "maisa-app-header";

const scopedCss = `
.${SCOPE} button { font-family: ${font.sans}; cursor: pointer; }
.${SCOPE} button:focus-visible { outline: 2px solid ${color.primary}; outline-offset: 2px; }
.${SCOPE} .nav-link {
  background: none;
  border: none;
  padding: ${space(1)} 0;
  border-bottom: 2px solid transparent;
  color: ${color.onSurfaceVariant};
  transition: color 150ms ease, border-color 150ms ease;
}
.${SCOPE} .nav-link:hover { color: ${color.onSurface}; }
.${SCOPE} .nav-link.is-active { color: ${color.onSurface}; border-bottom-color: ${color.primary}; }
.${SCOPE} .icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${radius.full};
  border: none;
  background: transparent;
  color: ${color.onSurfaceVariant};
  transition: background-color 150ms ease;
}
.${SCOPE} .icon-btn:hover { background-color: ${color.surfaceContainerHigh}; }
@media (max-width: 980px) {
  .${SCOPE} .primary-nav { display: none !important; }
}
`;

/** Top app bar shared by every authenticated screen: wordmark, primary nav, search/notifications/avatar. */
export function AppHeader({
  navItems = DEFAULT_NAV_ITEMS,
  activeNavId,
  onNavigate,
  onSearch,
  unreadNotifications = 0,
  onOpenNotifications,
  avatarSrc,
  displayName = "Director",
}: AppHeaderProps) {
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className={SCOPE}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `${space(2.5)} ${space(8)}`,
        borderBottom: `1px solid ${color.borderSubtle}`,
      }}
    >
      {/* eslint-disable-next-line react/no-danger -- scoped, static, build-time-known CSS string */}
      <style dangerouslySetInnerHTML={{ __html: scopedCss }} />

      <p style={{ fontFamily: font.serif, fontSize: "24px", letterSpacing: "-0.01em", margin: 0 }}>MaiSa</p>

      <nav className="primary-nav" aria-label="Primary">
        <ul style={{ display: "flex", gap: space(4), listStyle: "none", margin: 0, padding: 0 }}>
          {navItems.map((item) => {
            const isActive = item.id === (activeNavId ?? navItems[0]?.id);
            return (
              <li key={item.id}>
                <button
                  className={`nav-link${isActive ? " is-active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onNavigate?.(item.id)}
                >
                  <span style={{ ...typography.labelCaps }}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: space(1) }}>
        <button className="icon-btn" aria-label="Search" onClick={onSearch}>
          <SearchIcon />
        </button>
        <button
          className="icon-btn"
          aria-label={`Notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ""}`}
          onClick={onOpenNotifications}
          style={{ position: "relative" }}
        >
          <BellIcon />
          {unreadNotifications > 0 && (
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 7,
                height: 7,
                borderRadius: radius.full,
                background: color.error,
              }}
            />
          )}
        </button>
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- plain <img>, no framework assumed
          <img
            src={avatarSrc}
            alt={displayName}
            style={{
              width: 36,
              height: 36,
              borderRadius: radius.full,
              objectFit: "cover",
              marginLeft: space(1),
              border: `1px solid ${color.borderSubtle}`,
            }}
          />
        ) : (
          <span
            aria-hidden
            style={{
              width: 36,
              height: 36,
              borderRadius: radius.full,
              marginLeft: space(1),
              background: color.primaryContainer,
              color: color.inverseOnSurface,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: font.sans,
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {initials}
          </span>
        )}
      </div>
    </header>
  );
}

export default AppHeader;
