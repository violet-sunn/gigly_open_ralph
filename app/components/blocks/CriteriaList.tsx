import { Icon, ICON } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import { cx } from "@/app/components/layout/scale";
import type { CriteriaListVM } from "./view-models";

/**
 * CriteriaList block (DESIGN_SYSTEM_SPEC §3.2) — checklist rows (icon + text).
 * `met` → exported `verified` asset (F4); unmet → an empty token circle. Token-pure.
 * (A dedicated check glyph, if the design adds one, is a future asset residual.)
 */
export function CriteriaList({ vm }: { vm: CriteriaListVM }) {
  return (
    <Stack gap={2}>
      {vm.items.map((item, i) => (
        <Stack key={i} axis="row" gap={2} align="center">
          {item.met ? (
            <Icon src={ICON.verified} alt="Выполнено" />
          ) : (
            <span className="h-icon w-icon rounded-circular border border-border" aria-hidden="true" />
          )}
          <span className={cx("text-body font-body", item.met ? "text-strong" : "text-muted")}>{item.label}</span>
        </Stack>
      ))}
    </Stack>
  );
}
