import { Icon, ICON } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import type { SectionHeaderVM } from "./view-models";

/**
 * SectionHeader block (DESIGN_SYSTEM_SPEC §3.2) — Figma `H/H1/BLOCK` (3371:5248): the «БЛОК» section
 * heading. Title at the `type/h1` role (Figma H2 = 24px, mono family) with an optional trailing icon and
 * count. Token-pure; composed from primitives + layout + tokens.
 */
export function SectionHeader({ vm }: { vm: SectionHeaderVM }) {
  const iconSrc = vm.icon ? (ICON as Record<string, string>)[vm.icon] ?? vm.icon : undefined;
  // Padding is the layout context's job (Panel/Section) — the heading itself is padding-free, flex-1 so a
  // sibling affordance (e.g. an edit IconButton) right-aligns in the row.
  return (
    <Stack axis="row" gap={2} align="center" justify="between" className="flex-1">
      <Stack axis="row" gap={2} align="center">
        <span className="text-h1 font-h1 text-strong">{vm.title}</span>
        {vm.count != null && <span className="text-label font-label text-muted">{vm.count}</span>}
      </Stack>
      {iconSrc && <Icon src={iconSrc} className="h-icon-rail w-icon-rail" />}
    </Stack>
  );
}
