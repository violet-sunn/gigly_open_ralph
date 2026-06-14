/**
 * domain-blocks barrel — the domain phrase vocabulary (DESIGN_SYSTEM_SPEC §3.2).
 * 17 blocks, each typed by its §5 view-model, composed from ui-primitives + layout-grammar + tokens.
 * Screens (Phase 2) compose from here; the view-model types decouple the UI from the schema.
 */
export { GigCard } from "./GigCard";
export { ProfileCard } from "./ProfileCard";
export { ClientCard } from "./ClientCard";
export { BannerCard } from "./BannerCard";
export { StatPanel } from "./StatPanel";
export { RequirementCard } from "./RequirementCard";
export { CriteriaList } from "./CriteriaList";
export { TermsTabs } from "./TermsTabs";
export { ApplyPanel } from "./ApplyPanel";
export { MessageBubble } from "./MessageBubble";
export { ConversationItem } from "./ConversationItem";
export { NotificationItem } from "./NotificationItem";
export { MessagesPanel } from "./MessagesPanel";
export { ChatPanel } from "./ChatPanel";
export { SidebarNav } from "./SidebarNav";
export { Topbar } from "./Topbar";
export { FilterBar } from "./FilterBar";

// Typed view-model contracts (§5) — the data each block displays, schema-independent.
export * from "./view-models";
