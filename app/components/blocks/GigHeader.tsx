import { StatusBadge, CategoryTag, Tag } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { STATUS_LABEL, CATEGORY_LABEL } from "./util";
import type { GigHeaderVM } from "./view-models";

/**
 * GigHeader block (DESIGN_SYSTEM_SPEC §3.2) — the prototype gig-detail `main` block: status + category, the title
 * (display type), category tags, and the gig **description**. Срок/бюджет are NOT shown here — they live in the
 * conditions panel (ConditionsPanel) per the prototype — so this block carries the brief body, not a meta row.
 * Composed from primitives + layout primitives + tokens. Token-pure.
 */
export function GigHeader({ vm }: { vm: GigHeaderVM }) {
  return (
    <Panel surface={2} radius="lg" padding={6}>
      <Stack gap={3}>
        <Stack axis="row" gap={2} align="center" justify="between">
          <StatusBadge variant="inline-dot" status={vm.status}>
            {STATUS_LABEL[vm.status]}
          </StatusBadge>
          <CategoryTag category={vm.category}>{CATEGORY_LABEL[vm.category]}</CategoryTag>
        </Stack>
        <span className="text-display font-display text-strong">{vm.title}</span>
        {vm.tags.length > 0 && (
          <Stack axis="row" gap={2}>
            {vm.tags.map((t) => (
              <Tag key={t} color={vm.category}>
                {t}
              </Tag>
            ))}
          </Stack>
        )}
        {vm.description && <span className="text-body font-grotesk text-muted">{vm.description}</span>}
      </Stack>
    </Panel>
  );
}
