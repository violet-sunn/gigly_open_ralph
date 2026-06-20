import { IconButton, ICON } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { SectionHeader } from "./SectionHeader";
import { JobExperienceCard } from "./JobExperienceCard";
import type { ExperienceListVM } from "./view-models";

/**
 * ExperienceList block (compose-profile gap fill, DESIGN_SYSTEM_SPEC §3.2) — the «Опыт» card: the bio
 * paragraph + the work-experience entries (company · title · period · description), with an optional
 * owner edit affordance. Composed from primitives + layout primitives + tokens. Token-pure.
 */
export function ExperienceList({ vm, onEdit }: { vm: ExperienceListVM; onEdit?: () => void }) {
  return (
    <Panel surface={1} radius="lg" padding={6}>
      <Stack gap={5}>
        <Stack axis="row" gap={3} align="center" justify="between">
          <SectionHeader vm={{ title: vm.title }} />
          {onEdit && <IconButton icon={ICON.gear} onClick={onEdit} aria-label="Редактировать" />}
        </Stack>
        {vm.bio && <span className="text-body font-body text-muted whitespace-pre-wrap">{vm.bio}</span>}
        {vm.entries.length > 0 && (
          <Stack gap={4}>
            {vm.entries.map((e, i) => (
              <JobExperienceCard key={i} vm={e} />
            ))}
          </Stack>
        )}
      </Stack>
    </Panel>
  );
}
