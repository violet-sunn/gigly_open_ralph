/**
 * Domain-block view-model contracts — DESIGN_SYSTEM_SPEC.md §5, verbatim.
 *
 * Each block declares a typed, SCHEMA-INDEPENDENT view-model: the shape of the data it *displays*,
 * never a Prisma table. Blocks render from fixtures (app/components/blocks/fixtures.ts) before Phase 1
 * models exist; later Phase 1 changes (ratings-reviews-model, category-taxonomy, …) *fulfill* these
 * contracts without this layer depending on them.
 */
import type { Status, Category } from "@/app/components/primitives";

// Re-export the shared enums so blocks/fixtures import everything from one place.
export type { Status, Category };

// ---- scalar / enum aliases (schema-independent) -------------------------
export type DateISO = string; // ISO timestamp, formatted for display by the block
export type ImageRef = string; // asset path / URL (Avatar src etc.)
export type IconRef = string; // an ICON registry key or asset path
export type Money = string; // pre-formatted display value, e.g. "300 400 ₽"
export type NotifType = "application" | "status" | "message";

export interface RatingVM {
  value: number;
  count: number;
  verified: boolean;
  online?: boolean;
}
export interface StatVM {
  label: string;
  value: string | number;
}
export interface KeyVal {
  key: string;
  value: string;
}
export interface FilterOptVM {
  value: string;
  label: string;
  active?: boolean;
  count?: number;
}
export interface FieldVM {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  value?: string;
}
export interface TermRow {
  label: string;
  value: string;
}

// ---- Cards & profile ----------------------------------------------------
export interface GigCardVM {
  id: string;
  title: string;
  category: Category;
  tags: string[];
  status: Status;
  budget: Money;
  deadlineDays: number;
  rating: { value: number; count: number; verified: boolean };
  clientName?: string;
  isCurrent?: boolean;
  layout: "grid" | "list";
}
export interface ProfileHeaderVM {
  avatar: ImageRef;
  name: string;
  roleTag: string;
  verified: boolean;
  memberSince: DateISO;
  location?: string;
  stats: StatVM[];
}
export interface ProfileCardVM {
  avatar: ImageRef;
  name: string;
  roleTag?: string;
  rating?: RatingVM;
}
export interface ClientCardVM {
  avatar: ImageRef;
  name: string;
  rating: RatingVM;
  meta?: KeyVal[];
}
export interface StatPanelVM {
  stats: StatVM[];
}

// ---- Navigation & shell -------------------------------------------------
export interface SidebarNavItemVM {
  icon: IconRef;
  label: string;
  href: string;
  count?: number;
  active: boolean;
}
export interface SidebarNavVM {
  role: "client" | "specialist";
  items: SidebarNavItemVM[];
  collapsed: boolean;
  profile: ProfileCardVM;
}
export interface TopbarVM {
  profile: ProfileCardVM;
  unreadNotifications: number;
}
export interface FilterBarVM {
  query?: string;
  filters: FilterOptVM[];
  view: "grid" | "list";
}

// ---- Messaging ----------------------------------------------------------
export interface MessageBubbleVM {
  direction: "in" | "out";
  author: string;
  timestamp: DateISO;
  body: string;
  readState?: "sent" | "read";
}
export interface ConversationItemVM {
  id: string;
  avatar: ImageRef;
  name: string;
  preview: string;
  timestamp: DateISO;
  unread: number;
}
export interface NotificationItemVM {
  id: string;
  type: NotifType;
  body: string;
  timestamp: DateISO;
  read: boolean;
}
export interface MessagesPanelVM {
  conversations: ConversationItemVM[];
}
export interface ChatPanelVM {
  thread: MessageBubbleVM[];
  composer: { canAttach: boolean };
}

// ---- Gig detail & onboarding -------------------------------------------
export interface RequirementCardVM {
  title: string;
  body: string;
  icon?: IconRef;
}
export interface CriteriaListVM {
  items: { label: string; met?: boolean }[];
}
export interface TermsTabsVM {
  proposed: TermRow[];
  client: TermRow[];
}
export interface ApplyPanelVM {
  fields: FieldVM[];
  submitLabel: string;
}
export interface BannerCardVM {
  headline: string;
  body?: string;
  cta?: { label: string; href: string };
  art?: ImageRef;
}
