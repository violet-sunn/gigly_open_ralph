import { Icon } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import type { FileChipVM } from "./view-models";

/**
 * FileChip block (DESIGN_SYSTEM_SPEC §3.2) — Figma `file` (3600:5262): an attachment chip on the
 * `overlay/line` surface — file-type icon (optional; the file-earmark glyph is a residual routed to Figma
 * export) + filename + size. Family via the `sans` token (RC-S2). Token-pure.
 */
export function FileChip({ vm }: { vm: FileChipVM }) {
  return (
    <Stack axis="row" gap={3} align="center" className="w-fit rounded-md bg-overlay-line px-3 py-2">
      {vm.icon && <Icon src={vm.icon} className="h-icon-rail w-icon-rail" />}
      <Stack gap={1}>
        <span className="text-body font-body text-strong">{vm.name}</span>
        <span className="text-caption font-caption text-muted">{vm.size}</span>
      </Stack>
    </Stack>
  );
}
