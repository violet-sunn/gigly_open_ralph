import { Radio } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import type { CheckFieldVM } from "./view-models";

/**
 * CheckField block (DESIGN_SYSTEM_SPEC §3.2) — Figma `check field` (3138:3148): a single-select list.
 * The Figma circle / check-circle indicators map to the exported radio-off / radio-on assets (single-select
 * semantics), so this composes the Radio primitive — no redrawn glyphs. Token-pure.
 */
export function CheckField({ vm, onChange }: { vm: CheckFieldVM; onChange?: (key: string) => void }) {
  return (
    <Stack gap={1}>
      {vm.options.map((o) => (
        <Radio
          key={o.key}
          label={o.label}
          checked={o.key === vm.value}
          onChange={() => onChange?.(o.key)}
          className="px-3 py-2"
        />
      ))}
    </Stack>
  );
}
