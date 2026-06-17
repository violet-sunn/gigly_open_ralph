import { CategoryTag, IconButton, ICON } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { cx } from "@/app/components/layout/scale";
import type { CategoryTagsVM } from "./view-models";

/**
 * CategoryTags block (compose-profile gap fill, DESIGN_SYSTEM_SPEC §3.2) — the «Избранные категории»
 * card: the five canonical CategoryTags with the user's favorites emphasised (non-favorites dimmed),
 * with an optional owner edit affordance. Composed from primitives + layout primitives + tokens.
 * Token-pure.
 */
export function CategoryTags({ vm, onEdit }: { vm: CategoryTagsVM; onEdit?: () => void }) {
  return (
    <Panel surface={1} radius="lg" padding={6}>
      <Stack gap={5}>
        <Stack axis="row" gap={3} align="center" justify="between">
          <span className="text-h2 font-h2 text-strong">{vm.title}</span>
          {onEdit && <IconButton icon={ICON.gear} onClick={onEdit} aria-label="Редактировать" />}
        </Stack>
        <Stack axis="row" gap={2}>
          {vm.categories.map((c) => (
            <CategoryTag key={c.slug} category={c.slug} className={cx(!c.favorite && "opacity-disabled")}>
              {c.label}
            </CategoryTag>
          ))}
        </Stack>
      </Stack>
    </Panel>
  );
}
