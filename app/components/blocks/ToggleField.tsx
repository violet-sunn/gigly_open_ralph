import { Toggle } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import type { ToggleFieldVM } from "./view-models";

/**
 * ToggleField block (DESIGN_SYSTEM_SPEC §3.2) — Figma `toggle field` (3138:3199): a settings row with a
 * title + optional description and a trailing Toggle. Token-pure; composes the Toggle primitive.
 */
export function ToggleField({ vm, onChange }: { vm: ToggleFieldVM; onChange?: (checked: boolean) => void }) {
  return (
    <Stack axis="row" gap={4} align="center" justify="between" className="px-3 py-2">
      <Stack gap={1} className="flex-1">
        <span className="text-label font-label text-strong">{vm.title}</span>
        {vm.description && <span className="text-body font-body text-muted">{vm.description}</span>}
      </Stack>
      <Toggle checked={vm.checked} onChange={() => onChange?.(!vm.checked)} aria-label={vm.title} />
    </Stack>
  );
}
