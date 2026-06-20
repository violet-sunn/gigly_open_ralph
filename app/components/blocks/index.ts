/**
 * domain-blocks barrel — the domain phrase vocabulary (DESIGN_SYSTEM_SPEC §3.2).
 * 17 blocks, each typed by its §5 view-model, composed from ui-primitives + layout-grammar + tokens.
 * Screens (Phase 2) compose from here; the view-model types decouple the UI from the schema.
 */
export { GigCard } from "./GigCard";
export { GigHeader } from "./GigHeader";
export { Notice } from "./Notice";
export { ProfileCard } from "./ProfileCard";
export { ProfileHeader } from "./ProfileHeader";
export { SectionHeader } from "./SectionHeader";
export { JobExperienceCard } from "./JobExperienceCard";
export { TagList } from "./TagList";
export { CategoryTags } from "./CategoryTags";
export { ExperienceList } from "./ExperienceList";
export { ClientCard } from "./ClientCard";
export { BannerCard } from "./BannerCard";
export { CreateGigCTA } from "./CreateGigCTA";
export { OnboardingCard } from "./OnboardingCard";
export { AuthHeader } from "./AuthHeader";
export { StatPanel } from "./StatPanel";
export { LedgerTable } from "./LedgerTable";
export { DisputeList } from "./DisputeList";
export { DisputeDetail } from "./DisputeDetail";
export { RoleCards, type Role } from "./RoleCards";
export { ToggleList, type ToggleItem } from "./ToggleList";
export { DataTable, type DataRow } from "./DataTable";
export { RequirementCard } from "./RequirementCard";
export { CriteriaList } from "./CriteriaList";
export { CriteriaRow } from "./CriteriaRow";
export { TermsTabs } from "./TermsTabs";
export { ApplyPanel } from "./ApplyPanel";
export { MessageBubble } from "./MessageBubble";
export { Bio } from "./Bio";
export { ChatHeader } from "./ChatHeader";
export { ConversationItem } from "./ConversationItem";
export { NotificationItem } from "./NotificationItem";
export { AttentionCard } from "./AttentionCard";
export { ToggleField } from "./ToggleField";
export { CheckField } from "./CheckField";
export { SessionRow } from "./SessionRow";
export { FileChip } from "./FileChip";
export { MessagesPanel } from "./MessagesPanel";
export { SearchPanel } from "./SearchPanel";
export { ChatPanel } from "./ChatPanel";
export { SidebarNav } from "./SidebarNav";
export { SidebarNavLive } from "./SidebarNavLive";
export { Topbar } from "./Topbar";
export { TopbarLive } from "./TopbarLive";
export { FilterBar } from "./FilterBar";
export { ResultCount } from "./ResultCount";

// Typed view-model contracts (§5) — the data each block displays, schema-independent.
export * from "./view-models";
