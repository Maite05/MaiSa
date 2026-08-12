import type { SVGProps } from "react";

/**
 * Minimal inline icon set (stroke-based, 24px viewbox) so this component
 * has zero icon-library dependency. Swap for @maisa/icons or lucide-react
 * later without changing call sites — every icon shares the IconProps shape.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const PlusIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const SearchIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </svg>
);

export const BellIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 9a6 6 0 1 1 12 0c0 3.4.8 5 1.6 6H4.4C5.2 14 6 12.4 6 9Z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const UserPlusIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19c.7-3 3-4.6 5.5-4.6s4.8 1.6 5.5 4.6M18 8v5M15.5 10.5h5" />
  </svg>
);

export const ClockIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const ClipboardIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="6" y="4.5" width="12" height="16" rx="1.5" />
    <path d="M9 4.5V3.8A1.3 1.3 0 0 1 10.3 2.5h3.4A1.3 1.3 0 0 1 15 3.8v.7M9 10h6M9 14h6M9 18h3.5" />
  </svg>
);

export const FileTextIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M7 3h7l4 4v14H7Z" />
    <path d="M14 3v4h4M9.5 12h5M9.5 15.5h5" />
  </svg>
);
