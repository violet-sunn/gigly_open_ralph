import { IconButton, ICON } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
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
          <span className="text-h2 font-h2 text-strong">{vm.title}</span>
          {onEdit && <IconButton icon={ICON.gear} onClick={onEdit} aria-label="Редактировать" />}
        </Stack>
        {vm.bio && <span className="text-body font-body text-muted whitespace-pre-wrap">{vm.bio}</span>}
        {vm.entries.length > 0 && (
          <Stack gap={4}>
            {vm.entries.map((e, i) => (
              <Panel key={i} surface={2} radius="md" padding={4}>
                <Stack gap={2}>
                  <Stack axis="row" gap={3} align="center" justify="between">
                    <span className="text-title font-title text-strong">{e.company}</span>
                    <span className="text-caption font-caption text-muted">{e.period}</span>
                  </Stack>
                  {e.title && <span className="text-label font-label text-muted">{e.title}</span>}
                  {e.description && (
                    <span className="text-body font-body text-muted whitespace-pre-wrap">{e.description}</span>
                  )}
                </Stack>
              </Panel>
            ))}
          </Stack>
        )}
      </Stack>
    </Panel>
  );
}
