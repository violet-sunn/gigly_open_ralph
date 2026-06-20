import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import type { JobExperienceCardVM } from "./view-models";

/**
 * JobExperienceCard block (DESIGN_SYSTEM_SPEC §3.2) — Figma `job experience` (3088:3896): a frame-stroke
 * card with company + period, a role line, and a description. The role line is `brand/default` (RC-S1 —
 * the Figma role-blue normalised to brand/default). Token-pure; composed from layout primitives + tokens.
 */
export function JobExperienceCard({ vm }: { vm: JobExperienceCardVM }) {
  return (
    <Panel surface={1} radius="lg" padding={5} className="border border-overlay-line-strong">
      <Stack gap={3}>
        <Stack gap={2}>
          <Stack axis="row" gap={3} align="center" justify="between">
            <span className="text-title font-title text-strong">{vm.company}</span>
            <span className="text-caption font-caption text-muted">{vm.period}</span>
          </Stack>
          {vm.title && <span className="text-label font-label text-brand-default">{vm.title}</span>}
        </Stack>
        {vm.description && <span className="text-body font-body text-muted whitespace-pre-wrap">{vm.description}</span>}
      </Stack>
    </Panel>
  );
}
