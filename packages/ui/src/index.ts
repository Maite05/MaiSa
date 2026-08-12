// Shared design-system layer only. Screen-level compositions (dashboards,
// event detail pages, ...) live per-app under apps/<app>/features/<feature>/pages
// and consume these building blocks — they're no longer exported from here.

export { AppHeader, DEFAULT_NAV_ITEMS } from "./components/AppHeader";
export type { AppHeaderProps, NavItem } from "./components/AppHeader";

export { ProgressBar, cardStyle, cardHeaderRowStyle } from "./components/primitives";
export type { ProgressTone } from "./components/primitives";

export {
  PlusIcon,
  SearchIcon,
  BellIcon,
  ArrowRightIcon,
  UserPlusIcon,
  ClockIcon,
  ClipboardIcon,
  FileTextIcon,
} from "./components/icons";

// Shared CRUD-screen kit — every feature's components/pages build on these
// instead of reimplementing buttons/inputs/tables/modals per module.
export { Button } from "./components/Button";
export type { ButtonProps, ButtonVariant } from "./components/Button";

export { TextField, TextAreaField, SelectField } from "./components/FormFields";
export type { TextFieldProps, TextAreaFieldProps, SelectFieldProps, SelectOption } from "./components/FormFields";

export { Table, tableIconButtonStyle } from "./components/Table";
export type { TableColumn, TableProps } from "./components/Table";

export { Modal } from "./components/Modal";
export type { ModalProps } from "./components/Modal";

export { StatusPill } from "./components/StatusPill";
export type { StatusPillProps, StatusTone } from "./components/StatusPill";

export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState";

export { Spinner } from "./components/Spinner";
export type { SpinnerProps } from "./components/Spinner";

export { color, font, typography, radius, space, shadow, tokens } from "./theme/tokens";
