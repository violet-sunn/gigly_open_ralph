import { Stack } from "@/app/components/layout/Stack";
import { CriteriaRow } from "./CriteriaRow";
import type { CriteriaListVM } from "./view-models";

/**
 * CriteriaList block (DESIGN_SYSTEM_SPEC §3.2) — Figma `критерии успеха`: NUMBERED `критерий` rows
 * (title + optional description), reconciled from the prior met/unmet checklist. Maps items → CriteriaRow
 * (index 1..N). Token-pure; composed from the CriteriaRow item + layout + tokens.
 */
export function CriteriaList({ vm }: { vm: CriteriaListVM }) {
  return (
    <Stack gap={2}>
      {vm.items.map((item, i) => (
        <CriteriaRow key={i} index={i + 1} title={item.label} description={item.description} />
      ))}
    </Stack>
  );
}
