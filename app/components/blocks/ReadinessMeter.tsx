import { ProgressBar } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { cx } from "@/app/components/layout/scale";
import { SectionHeader } from "./SectionHeader";
import { Notice } from "./Notice";
import type { ReadinessMeterVM } from "./view-models";

/**
 * ReadinessMeter block (reconcile-create-gig, DESIGN_SYSTEM_SPEC §3.2) — the create-gig «Готовность брифа» panel: a
 * `ProgressBar` (tone-coded by completeness) over the 7-point checklist (each ✓/○ + label) + a nudge for the first gap.
 * Presentational (the screen computes the checks). Composed from the ProgressBar primitive + layout + tokens. Token-pure.
 */
export function ReadinessMeter({ vm }: { vm: ReadinessMeterVM }) {
  return (
    <Panel surface={1} radius="lg" padding={6}>
      <Stack gap={4}>
        <SectionHeader vm={{ title: "Готовность брифа" }} />
        <ProgressBar value={vm.pct} tone={vm.tone} aria-label="Готовность брифа" />
        <Stack gap={2}>
          {vm.checks.map((c) => (
            <Stack key={c.label} axis="row" gap={2} align="center">
              <span className={cx("text-label font-label", c.done ? "text-status-completed" : "text-muted")}>
                {c.done ? "✓" : "○"}
              </span>
              <span className={cx("text-body font-body", c.done ? "text-strong" : "text-muted")}>{c.label}</span>
            </Stack>
          ))}
        </Stack>
        {vm.nudge && <Notice tone="info">{vm.nudge}</Notice>}
      </Stack>
    </Panel>
  );
}
