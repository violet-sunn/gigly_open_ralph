import { StatusBadge, CategoryTag, Tag, Rating, Button } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { cx } from "@/app/components/layout/scale";
import { STATUS_LABEL, CATEGORY_LABEL } from "./util";
import type { GigCardVM, Status } from "./view-models";

/** Status-coloured top accent (border-top width + per-status border colour). */
const STATUS_ACCENT: Record<Status, string> = {
  open: "border-t-4 border-t-status-open",
  review: "border-t-4 border-t-status-review",
  "in-progress": "border-t-4 border-t-status-in-progress",
  verification: "border-t-4 border-t-status-verification",
  completed: "border-t-4 border-t-status-completed",
  rejected: "border-t-4 border-t-status-rejected",
};

interface GigCardProps {
  vm: GigCardVM;
  onOpen?: () => void;
}

/**
 * GigCard block (DESIGN_SYSTEM_SPEC §3.2) — status ×6 × layout {grid, list}.
 * Composes StatusBadge, CategoryTag, Tag, Rating, budget (type/mono), deadline, "К проекту" Button.
 * Token-pure; built from primitives + layout primitives.
 */
export function GigCard({ vm, onOpen }: GigCardProps) {
  const statusRow = (
    <Stack axis="row" gap={2} align="center">
      <StatusBadge variant="inline-dot" status={vm.status}>
        {STATUS_LABEL[vm.status]}
      </StatusBadge>
      {vm.isCurrent && <StatusBadge variant="current" />}
    </Stack>
  );
  const tags = (
    <Stack axis="row" gap={2}>
      {vm.tags.map((t) => (
        <Tag key={t} color={vm.category}>
          {t}
        </Tag>
      ))}
    </Stack>
  );
  const budget = <span className="font-mono text-mono text-strong">{vm.budget}</span>;
  const deadline = <span className="text-caption font-caption text-muted">{vm.deadlineDays} дней</span>;
  const rating = <Rating value={vm.rating.value} count={vm.rating.count} verified={vm.rating.verified} />;
  const cta = (
    <Button variant="primary" onClick={onOpen}>
      К проекту
    </Button>
  );
  const title = <span className="text-title font-title text-strong">{vm.title}</span>;

  if (vm.layout === "list") {
    return (
      <Panel surface={2} radius="lg" padding={4} className={cx(STATUS_ACCENT[vm.status])}>
        <Stack axis="row" gap={4} align="center" justify="between">
          <Stack gap={2}>
            <Stack axis="row" gap={2} align="center" justify="between">
              {statusRow}
              <CategoryTag category={vm.category}>{CATEGORY_LABEL[vm.category]}</CategoryTag>
            </Stack>
            {title}
            {tags}
          </Stack>
          <Stack gap={2} align="end">
            {budget}
            {deadline}
            {rating}
            {cta}
          </Stack>
        </Stack>
      </Panel>
    );
  }

  // grid (default)
  return (
    <Panel surface={2} radius="lg" padding={4} className={cx(STATUS_ACCENT[vm.status])}>
      <Stack gap={3}>
        <Stack axis="row" gap={2} align="center" justify="between">
          {statusRow}
          <CategoryTag category={vm.category}>{CATEGORY_LABEL[vm.category]}</CategoryTag>
        </Stack>
        {title}
        {tags}
        {rating}
        <Stack axis="row" gap={2} align="center" justify="between">
          {budget}
          {deadline}
        </Stack>
        {cta}
      </Stack>
    </Panel>
  );
}
