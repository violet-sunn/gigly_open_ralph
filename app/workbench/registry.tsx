/**
 * component-workbench catalog registry — the SSOT mapping every system entity to its all-states
 * story + reference baseline. The catalog pages render `Story`; the coverage test asserts coverage
 * and that every `reference` exists; `fidelity-harness` (#9) will iterate this registry to produce
 * per-entity crops + pixel-diffs (this change maps baselines, it does NOT diff).
 *
 * Token-pure: NO raw hex/px literals — swatches use token utility classes + token names.
 */
import type { ReactNode } from "react";
import * as P from "@/app/components/primitives";
import * as B from "@/app/components/blocks";
import * as F from "@/app/components/blocks/fixtures";
import { cx } from "@/app/components/layout/scale";
import { Stack } from "@/app/components/layout/Stack";
import { Grid } from "@/app/components/layout/Grid";
import { Split } from "@/app/components/layout/Split";
import { Section } from "@/app/components/layout/Section";
import { Panel } from "@/app/components/layout/Panel";
import { Rail } from "@/app/components/layout/Rail";
import { AppShell } from "@/app/components/templates/AppShell";
import { AuthLayout } from "@/app/components/templates/AuthLayout";

export type Kind = "token" | "primitive" | "block" | "template" | "layout";
export interface CatalogEntry {
  id: string;
  kind: Kind;
  title: string;
  /** Repo-root-relative path to the reference render (the fidelity baseline). */
  reference: string;
  Story: () => ReactNode;
}

const REF = {
  library: "docs/design-system/reference-renders/components/library-full.png",
  frames: "docs/design-system/reference-renders/components/components-frames-full.png",
  screenDash: "docs/design-system/reference-renders/frames/specialist-dashboard.lossy.jpg",
};

function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-4">{children}</div>;
}

// ---- tokens -------------------------------------------------------------
const COLORS: [string, string][] = [
  ["surface/level-0", "bg-surface-level-0"],
  ["surface/level-1", "bg-surface-level-1"],
  ["surface/level-2", "bg-surface-level-2"],
  ["surface/level-3", "bg-surface-level-3"],
  ["surface/level-3-hover", "bg-surface-level-3-hover"],
  ["text/strong", "bg-text-strong"],
  ["text/muted", "bg-text-muted"],
  ["text/subtle", "bg-text-subtle"],
  ["border/default", "bg-border-default"],
  ["brand/default", "bg-brand-default"],
  ["brand/hover", "bg-brand-hover"],
  ["brand/pressed", "bg-brand-pressed"],
  ["status/open", "bg-status-open"],
  ["status/review", "bg-status-review"],
  ["status/in-progress", "bg-status-in-progress"],
  ["status/verification", "bg-status-verification"],
  ["status/completed", "bg-status-completed"],
  ["status/rejected", "bg-status-rejected"],
  ["category/marketing", "bg-category-marketing"],
  ["category/design", "bg-category-design"],
  ["category/programming", "bg-category-programming"],
  ["category/development", "bg-category-development"],
  ["category/coding", "bg-category-coding"],
];
const RADII: [string, string][] = [
  ["radius/xs", "rounded-xs"],
  ["radius/sm", "rounded-sm"],
  ["radius/md", "rounded-md"],
  ["radius/lg", "rounded-lg"],
  ["radius/xl", "rounded-xl"],
  ["radius/pill", "rounded-pill"],
  ["radius/circular", "rounded-circular"],
];
const SPACES: [string, string][] = [
  ["space/1", "w-1"],
  ["space/2", "w-2"],
  ["space/3", "w-3"],
  ["space/4", "w-4"],
  ["space/5", "w-5"],
  ["space/6", "w-6"],
  ["space/8", "w-8"],
  ["space/10", "w-10"],
  ["space/12", "w-12"],
];
const TYPES: [string, string][] = [
  ["type/display", "text-display font-display"],
  ["type/h1", "text-h1 font-h1"],
  ["type/h2", "text-h2 font-h2"],
  ["type/title", "text-title font-title"],
  ["type/body", "text-body font-body"],
  ["type/label", "text-label font-label"],
  ["type/caption", "text-caption font-caption"],
  ["type/mono", "text-mono font-mono"],
  // grotesk = Manrope (Vremena Grotesk role): numbers / price / term, message bodies, job-experience.
  ["type/grotesk", "text-body font-grotesk"],
];
const SHADOWS: [string, string][] = [
  ["shadow/none", "shadow-none"],
  ["shadow/card", "shadow-card"],
  ["shadow/popover", "shadow-popover"],
];

const tokenEntries: CatalogEntry[] = [
  {
    id: "color",
    kind: "token",
    title: "Colour",
    reference: REF.library,
    Story: () => (
      <Row>
        {COLORS.map(([name, cls]) => (
          <Stack key={name} gap={1} align="center">
            <div className={cx("h-10 w-10 rounded-md border border-border", cls)} />
            <span className="text-caption font-caption text-muted">{name}</span>
          </Stack>
        ))}
      </Row>
    ),
  },
  {
    id: "radius",
    kind: "token",
    title: "Radius",
    reference: REF.library,
    Story: () => (
      <Row>
        {RADII.map(([name, cls]) => (
          <Stack key={name} gap={1} align="center">
            <div className={cx("h-10 w-10 border border-border bg-surface-level-3", cls)} />
            <span className="text-caption font-caption text-muted">{name}</span>
          </Stack>
        ))}
      </Row>
    ),
  },
  {
    id: "spacing",
    kind: "token",
    title: "Spacing",
    reference: REF.library,
    Story: () => (
      <Stack gap={2}>
        {SPACES.map(([name, cls]) => (
          <Stack key={name} axis="row" gap={3} align="center">
            <span className="w-20 text-caption font-caption text-muted">{name}</span>
            <div className={cx("h-4 rounded-sm bg-brand-default", cls)} />
          </Stack>
        ))}
      </Stack>
    ),
  },
  {
    id: "type",
    kind: "token",
    title: "Type scale",
    reference: REF.library,
    Story: () => (
      <Stack gap={2}>
        {TYPES.map(([name, cls]) => (
          <span key={name} className={cx(cls, "text-strong")}>
            {name} — Gigly · Гигли 123
          </span>
        ))}
      </Stack>
    ),
  },
  {
    id: "shadow",
    kind: "token",
    title: "Shadow",
    reference: REF.library,
    Story: () => (
      <Row>
        {SHADOWS.map(([name, cls]) => (
          <Stack key={name} gap={1} align="center">
            <div className={cx("h-12 w-12 rounded-md bg-surface-level-2", cls)} />
            <span className="text-caption font-caption text-muted">{name}</span>
          </Stack>
        ))}
      </Row>
    ),
  },
];

// ---- primitives (all states) -------------------------------------------
const primitiveEntries: CatalogEntry[] = [
  {
    id: "Button",
    kind: "primitive",
    title: "Button",
    reference: REF.library,
    Story: () => (
      <Stack gap={3}>
        <Row>
          <P.Button variant="primary">Primary</P.Button>
          <P.Button variant="secondary">Secondary</P.Button>
          <P.Button variant="ghost">Ghost</P.Button>
          <P.Button variant="link">Link</P.Button>
          <P.Button variant="danger">Удалить аккаунт</P.Button>
          <P.Button variant="primary" disabled>
            Disabled
          </P.Button>
        </Row>
        <Row>
          <P.Button variant="primary" size="sm">
            Tetriary (sm)
          </P.Button>
          <P.Button variant="secondary" size="sm">
            sm
          </P.Button>
        </Row>
      </Stack>
    ),
  },
  {
    id: "IconButton",
    kind: "primitive",
    title: "IconButton (button_icon: bg no/yes + counter)",
    reference: REF.frames,
    Story: () => (
      <Row>
        <P.IconButton icon={P.ICON.gear} aria-label="bg no" bg="no" />
        <P.IconButton icon={P.ICON.gear} aria-label="bg yes" bg="yes" />
        <P.IconButton icon={P.ICON.bell} aria-label="with counter" bg="yes" counter={5} />
      </Row>
    ),
  },
  {
    id: "SpecialtyTag",
    kind: "primitive",
    title: "SpecialtyTag (Специальность: S / XS)",
    reference: REF.frames,
    Story: () => (
      <Row>
        <P.SpecialtyTag size="S">[Senior Frontend Engineer]</P.SpecialtyTag>
        <P.SpecialtyTag size="XS">[Senior Frontend Engineer]</P.SpecialtyTag>
      </Row>
    ),
  },
  {
    id: "Input",
    kind: "primitive",
    title: "Input",
    reference: REF.library,
    Story: () => (
      <Grid columns={2} gap={3}>
        <P.Input state="default" placeholder="default" />
        <P.Input state="focus" placeholder="focus" />
        <P.Input state="filled" defaultValue="filled" />
        <P.Input state="disabled" placeholder="disabled" />
        <P.Input state="error" defaultValue="error" />
      </Grid>
    ),
  },
  {
    id: "PasswordInput",
    kind: "primitive",
    title: "PasswordInput",
    reference: REF.library,
    Story: () => (
      <Stack gap={3}>
        <P.PasswordInput defaultValue="secret" />
        <P.PasswordInput defaultValue="secret" revealed />
      </Stack>
    ),
  },
  {
    id: "SearchInput",
    kind: "primitive",
    title: "SearchInput",
    reference: REF.library,
    Story: () => (
      <Stack gap={3}>
        <P.SearchInput placeholder="Поиск…" />
        <P.SearchInput defaultValue="react" placeholder="Поиск…" />
      </Stack>
    ),
  },
  {
    id: "Select",
    kind: "primitive",
    title: "Select",
    reference: REF.library,
    Story: () => (
      <Row>
        <P.Select options={[{ value: "new", label: "Сначала новые" }, { value: "budget", label: "По бюджету" }]} value="new" />
        <P.Select options={[{ value: "new", label: "Сначала новые" }]} disabled placeholder="disabled" />
        <P.Select options={[{ value: "new", label: "Сначала новые" }, { value: "budget", label: "По бюджету" }, { value: "soon", label: "Скоро (недоступно)", disabled: true }]} value="new" expanded />
      </Row>
    ),
  },
  {
    id: "Radio",
    kind: "primitive",
    title: "Radio",
    reference: REF.library,
    Story: () => (
      <Row>
        <P.Radio label="Off" />
        <P.Radio label="On" checked />
        <P.Radio label="Disabled" disabled />
      </Row>
    ),
  },
  {
    id: "Filter",
    kind: "primitive",
    title: "Filter (rows + expand group)",
    reference: REF.library,
    Story: () => (
      <Stack gap={3}>
        <Stack gap={2}>
          <P.Filter label="React" checked count={42} />
          <P.Filter label="Python" count={18} />
        </Stack>
        <P.FilterGroup label="Стек" expanded>
          <P.Filter label="React" checked count={42} />
          <P.Filter label="Python" count={18} />
        </P.FilterGroup>
        <P.FilterGroup label="Категория (свёрнуто)" />
      </Stack>
    ),
  },
  {
    id: "Tabs",
    kind: "primitive",
    title: "Tabs",
    reference: REF.library,
    Story: () => (
      <P.Tabs
        active="all"
        tabs={[
          { value: "all", label: "Все", count: 8 },
          { value: "apps", label: "Заявки", count: 3 },
          { value: "done", label: "Завершённые" },
        ]}
      />
    ),
  },
  {
    id: "Toggle",
    kind: "primitive",
    title: "Toggle",
    reference: REF.library,
    Story: () => (
      <Row>
        <P.Toggle aria-label="off" />
        <P.Toggle aria-label="on" checked />
        <P.Toggle aria-label="disabled" disabled />
      </Row>
    ),
  },
  {
    id: "Tag",
    kind: "primitive",
    title: "Tag",
    reference: REF.library,
    Story: () => (
      <Row>
        <P.Tag color="marketing">Marketing</P.Tag>
        <P.Tag color="design">Design</P.Tag>
        <P.Tag color="programming">Programming</P.Tag>
        <P.Tag color="development">Development</P.Tag>
        <P.Tag color="coding">Coding</P.Tag>
      </Row>
    ),
  },
  {
    id: "CategoryTag",
    kind: "primitive",
    title: "CategoryTag",
    reference: REF.library,
    Story: () => (
      <Row>
        <P.CategoryTag category="marketing">Маркетинг</P.CategoryTag>
        <P.CategoryTag category="design">Дизайн</P.CategoryTag>
        <P.CategoryTag category="programming">Программирование</P.CategoryTag>
        <P.CategoryTag category="development">Разработка</P.CategoryTag>
        <P.CategoryTag category="coding">Кодинг</P.CategoryTag>
      </Row>
    ),
  },
  {
    id: "StatusBadge",
    kind: "primitive",
    title: "StatusBadge / Dot",
    reference: REF.library,
    Story: () => (
      <Stack gap={3}>
        <Row>
          {(["open", "review", "in-progress", "verification", "completed", "rejected"] as const).map((s) => (
            <P.StatusBadge key={s} variant="pill" status={s}>
              {s}
            </P.StatusBadge>
          ))}
        </Row>
        <Row>
          <P.StatusBadge variant="inline-dot" status="completed">
            inline-dot
          </P.StatusBadge>
          <P.StatusBadge variant="current" />
        </Row>
      </Stack>
    ),
  },
  {
    id: "Avatar",
    kind: "primitive",
    title: "Avatar",
    reference: REF.library,
    Story: () => (
      <Row>
        <P.Avatar size="sm" initials="АС" />
        <P.Avatar size="lg" initials="АС" />
        <P.Avatar size="lg" initials="АС" online />
      </Row>
    ),
  },
  {
    id: "Rating",
    kind: "primitive",
    title: "Rating",
    reference: REF.library,
    Story: () => <P.Rating value={4} count={37} verified online avatarInitials="АС" experience="Senior Frontend" />,
  },
  {
    id: "ViewToggle",
    kind: "primitive",
    title: "ViewToggle",
    reference: REF.library,
    Story: () => (
      <Row>
        <P.ViewToggle view="grid" />
        <P.ViewToggle view="list" />
      </Row>
    ),
  },
  {
    id: "ProgressBar",
    kind: "primitive",
    title: "ProgressBar",
    reference: REF.library,
    Story: () => (
      <Stack gap={3}>
        <P.ProgressBar value={25} />
        <P.ProgressBar value={60} />
        <P.ProgressBar value={100} />
      </Stack>
    ),
  },
  {
    id: "Textarea",
    kind: "primitive",
    title: "Textarea (cover-letter field)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={3}>
        <P.Textarea placeholder="Кратко опишите ваш опыт…" />
        <P.Textarea defaultValue="Есть опыт миграции на Next.js 14 (App Router, RSC)." disabled />
      </Stack>
    ),
  },
  {
    id: "AuthStepDots",
    kind: "primitive",
    title: "AuthStepDots (auth counter)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={3}>
        <P.AuthStepDots count={3} current={0} />
        <P.AuthStepDots count={3} current={1} />
        <P.AuthStepDots count={3} current={2} />
      </Stack>
    ),
  },
  {
    id: "Logomark",
    kind: "primitive",
    title: "Logomark (mark + wordmark)",
    reference: REF.frames,
    Story: () => (
      <Row>
        <P.Logomark />
        <P.Logomark withWordmark />
      </Row>
    ),
  },
  {
    id: "StepIndicator",
    kind: "primitive",
    title: "StepIndicator",
    reference: REF.library,
    Story: () => (
      <Stack gap={3}>
        <P.StepIndicator steps={["Роль", "Доступ", "Профиль"]} current={0} />
        <P.StepIndicator steps={["Роль", "Доступ", "Профиль"]} current={1} />
        <P.StepIndicator steps={["Роль", "Доступ", "Профиль"]} current={2} />
      </Stack>
    ),
  },
];

// ---- blocks (all variants, from fixtures) ------------------------------
const gridGigs = F.gigCardFixtures.filter((g) => g.layout === "grid");
const listGigs = F.gigCardFixtures.filter((g) => g.layout === "list");

const blockEntries: CatalogEntry[] = [
  {
    id: "GigCard",
    kind: "block",
    title: "GigCard (6 statuses × grid/list)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={4}>
        <Grid columns={3} gap={4}>
          {gridGigs.map((vm) => (
            <B.GigCard key={vm.id} vm={vm} />
          ))}
        </Grid>
        <Stack gap={3}>
          {listGigs.slice(0, 2).map((vm) => (
            <B.GigCard key={vm.id} vm={vm} />
          ))}
        </Stack>
      </Stack>
    ),
  },
  {
    id: "ProfileCard",
    kind: "block",
    title: "ProfileCard (compact / full)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={4}>
        <B.ProfileCard variant="compact" vm={F.profileCardFixture} />
        <B.ProfileCard variant="full" vm={F.profileHeaderFixture} />
      </Stack>
    ),
  },
  {
    id: "ProfileHeader",
    kind: "block",
    title: "ProfileHeader (ID block — SpecialtyTag + status pill)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={4}>
        <B.ProfileHeader vm={F.profileHeaderFixture} />
        <B.ProfileHeader vm={{ ...F.profileHeaderFixture, online: true }} onEdit={() => {}} />
      </Stack>
    ),
  },
  { id: "ClientCard", kind: "block", title: "ClientCard", reference: REF.frames, Story: () => <B.ClientCard vm={F.clientCardFixture} /> },
  { id: "BannerCard", kind: "block", title: "BannerCard", reference: REF.frames, Story: () => <B.BannerCard vm={F.bannerCardFixture} /> },
  {
    id: "OnboardingCard",
    kind: "block",
    title: "OnboardingCard (welcome 'pic')",
    reference: REF.frames,
    Story: () => (
      <Grid columns={2} gap={4}>
        {F.onboardingCardFixtures.map((vm, i) => (
          <B.OnboardingCard key={i} vm={vm} />
        ))}
      </Grid>
    ),
  },
  {
    id: "AuthHeader",
    kind: "block",
    title: "AuthHeader (auth HEADER lockup)",
    reference: REF.frames,
    Story: () => (
      <Grid columns={3} gap={4}>
        {F.authHeaderFixtures.map((vm, i) => (
          <B.AuthHeader key={i} vm={vm} />
        ))}
      </Grid>
    ),
  },
  {
    id: "StatPanel",
    kind: "block",
    title: "StatPanel (grid / single)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={4}>
        <B.StatPanel vm={F.statPanelFixture} variant="grid" />
        <B.StatPanel vm={F.statPanelFixture} variant="single" />
      </Stack>
    ),
  },
  { id: "SectionHeader", kind: "block", title: "SectionHeader (H/H1/BLOCK)", reference: REF.frames, Story: () => <B.SectionHeader vm={F.sectionHeaderFixture} /> },
  {
    id: "JobExperienceCard",
    kind: "block",
    title: "JobExperienceCard",
    reference: REF.frames,
    Story: () => (
      <Stack gap={3}>
        {F.jobExperienceCardFixtures.map((vm, i) => (
          <B.JobExperienceCard key={i} vm={vm} />
        ))}
      </Stack>
    ),
  },
  { id: "RequirementCard", kind: "block", title: "RequirementCard (требование tile)", reference: REF.frames, Story: () => <B.RequirementCard vm={F.requirementCardFixture} /> },
  { id: "CriteriaList", kind: "block", title: "CriteriaList", reference: REF.frames, Story: () => <B.CriteriaList vm={F.criteriaListFixture} /> },
  { id: "DataTable", kind: "block", title: "DataTable (generativity-proof addition)", reference: REF.library, Story: () => <B.DataTable columns={F.dataTableFixture.columns} rows={F.dataTableFixture.rows} /> },
  {
    id: "TermsTabs",
    kind: "block",
    title: "TermsTabs (proposed / client)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={4}>
        <B.TermsTabs vm={F.termsTabsFixture} active="proposed" />
        <B.TermsTabs vm={F.termsTabsFixture} active="client" />
      </Stack>
    ),
  },
  {
    id: "ConditionsPanel",
    kind: "block",
    title: "ConditionsPanel (gig-detail УСЛОВИЯ — grotesk срок/бюджет + company fee)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={4}>
        <B.ConditionsPanel vm={F.conditionsPanelFixture} active="client" />
        <B.ConditionsPanel vm={F.conditionsPanelFixture} active="proposed" />
      </Stack>
    ),
  },
  { id: "ApplyPanel", kind: "block", title: "ApplyPanel", reference: REF.frames, Story: () => <B.ApplyPanel vm={F.applyPanelFixture} /> },
  {
    id: "MessageBubble",
    kind: "block",
    title: "MessageBubble (in / out)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={2}>
        {F.messageBubbleFixtures.map((vm, i) => (
          <B.MessageBubble key={i} vm={vm} />
        ))}
      </Stack>
    ),
  },
  {
    id: "ConversationItem",
    kind: "block",
    title: "ConversationItem (unread / read)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={1}>
        {F.conversationItemFixtures.map((vm) => (
          <B.ConversationItem key={vm.id} vm={vm} />
        ))}
      </Stack>
    ),
  },
  {
    id: "NotificationItem",
    kind: "block",
    title: "NotificationItem (type icons)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={1}>
        {F.notificationItemFixtures.map((vm) => (
          <B.NotificationItem key={vm.id} vm={vm} />
        ))}
      </Stack>
    ),
  },
  {
    id: "AttentionCard",
    kind: "block",
    title: "AttentionCard (6 notification types)",
    reference: REF.frames,
    Story: () => (
      <Grid columns={3} gap={4}>
        {F.attentionCardFixtures.map((vm) => (
          <B.AttentionCard key={vm.type} vm={vm} />
        ))}
      </Grid>
    ),
  },
  {
    id: "ToggleField",
    kind: "block",
    title: "ToggleField (settings row)",
    reference: REF.frames,
    Story: () => <B.ToggleField vm={F.toggleFieldFixture} />,
  },
  {
    id: "CheckField",
    kind: "block",
    title: "CheckField (single-select)",
    reference: REF.frames,
    Story: () => <B.CheckField vm={F.checkFieldFixture} />,
  },
  {
    id: "SessionRow",
    kind: "block",
    title: "SessionRow (Default / active / delete)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={2}>
        {F.sessionRowFixtures.map((vm) => (
          <B.SessionRow key={vm.state} vm={vm} />
        ))}
      </Stack>
    ),
  },
  {
    id: "FileChip",
    kind: "block",
    title: "FileChip (attachment)",
    reference: REF.frames,
    Story: () => (
      <Row>
        {F.fileChipFixtures.map((vm) => (
          <B.FileChip key={vm.name} vm={vm} />
        ))}
      </Row>
    ),
  },
  { id: "MessagesPanel", kind: "block", title: "MessagesPanel", reference: REF.frames, Story: () => <B.MessagesPanel vm={F.messagesPanelFixture} /> },
  { id: "ChatPanel", kind: "block", title: "ChatPanel", reference: REF.frames, Story: () => <B.ChatPanel vm={F.chatPanelFixture} /> },
  {
    id: "SidebarNav",
    kind: "block",
    title: "SidebarNav (expanded / collapsed)",
    reference: REF.frames,
    Story: () => (
      <Row>
        <B.SidebarNav vm={F.sidebarNavClientExpanded} />
        <B.SidebarNav vm={F.sidebarNavSpecialistCollapsed} />
      </Row>
    ),
  },
  { id: "Topbar", kind: "block", title: "Topbar", reference: REF.frames, Story: () => <B.Topbar vm={F.topbarFixture} /> },
  {
    id: "FilterBar",
    kind: "block",
    title: "FilterBar (full / search-only)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={4}>
        <B.FilterBar vm={F.filterBarFixture} variant="full" />
        <B.FilterBar vm={F.filterBarFixture} variant="search-only" />
      </Stack>
    ),
  },
];

// ---- templates ----------------------------------------------------------
const templateEntries: CatalogEntry[] = [
  {
    id: "AppShell",
    kind: "template",
    title: "AppShell (expanded / collapsed)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={6}>
        <AppShell sidebar={<B.SidebarNav vm={F.sidebarNavClientExpanded} />} topbar={<B.Topbar vm={F.topbarFixture} />}>
          <Panel surface={1} radius="lg" padding={6}>
            <span className="text-body font-body text-muted">content region (expanded)</span>
          </Panel>
        </AppShell>
        <AppShell sidebar={<B.SidebarNav vm={F.sidebarNavSpecialistCollapsed} />} topbar={<B.Topbar vm={F.topbarFixture} />} collapsed>
          <Panel surface={1} radius="lg" padding={6}>
            <span className="text-body font-body text-muted">content region (collapsed)</span>
          </Panel>
        </AppShell>
      </Stack>
    ),
  },
  {
    id: "AuthLayout",
    kind: "template",
    title: "AuthLayout",
    reference: REF.frames,
    Story: () => (
      <AuthLayout>
        <Stack gap={3}>
          <span className="text-h2 font-h2 text-strong">Вход</span>
          <P.Input placeholder="Email" />
          <P.PasswordInput placeholder="Пароль" />
          <P.Button variant="primary">Войти</P.Button>
        </Stack>
      </AuthLayout>
    ),
  },
];

// ---- layout primitives --------------------------------------------------
function Box({ label }: { label: string }) {
  return (
    <div className="rounded-md bg-surface-level-3 p-4 text-caption font-caption text-muted">{label}</div>
  );
}

const layoutEntries: CatalogEntry[] = [
  {
    id: "Stack",
    kind: "layout",
    title: "Stack (row / column)",
    reference: REF.frames,
    Story: () => (
      <Stack gap={4}>
        <Stack axis="row" gap={2}>
          <Box label="row a" />
          <Box label="row b" />
        </Stack>
        <Stack gap={2}>
          <Box label="col a" />
          <Box label="col b" />
        </Stack>
      </Stack>
    ),
  },
  {
    id: "Grid",
    kind: "layout",
    title: "Grid",
    reference: REF.frames,
    Story: () => (
      <Grid columns={3} gap={3}>
        <Box label="1" />
        <Box label="2" />
        <Box label="3" />
      </Grid>
    ),
  },
  {
    id: "Split",
    kind: "layout",
    title: "Split",
    reference: REF.frames,
    Story: () => (
      <Split ratio="1:2" gap={3}>
        <Box label="1fr" />
        <Box label="2fr" />
      </Split>
    ),
  },
  {
    id: "Section",
    kind: "layout",
    title: "Section",
    reference: REF.frames,
    Story: () => (
      <Section title="Раздел" gap={3}>
        <Box label="section body" />
      </Section>
    ),
  },
  {
    id: "Panel",
    kind: "layout",
    title: "Panel",
    reference: REF.frames,
    Story: () => (
      <Panel surface={2} radius="lg" padding={4} border>
        <Box label="panel body" />
      </Panel>
    ),
  },
  {
    id: "Rail",
    kind: "layout",
    title: "Rail",
    reference: REF.frames,
    Story: () => (
      <Rail gap={2} aria-label="Rail demo">
        <P.Avatar size="sm" initials="A" />
        <P.Avatar size="sm" initials="B" />
      </Rail>
    ),
  },
];

export const CATALOG: CatalogEntry[] = [
  ...tokenEntries,
  ...primitiveEntries,
  ...blockEntries,
  ...templateEntries,
  ...layoutEntries,
];

export const KINDS: Kind[] = ["token", "primitive", "block", "template", "layout"];
export const byKind = (kind: Kind): CatalogEntry[] => CATALOG.filter((e) => e.kind === kind);
