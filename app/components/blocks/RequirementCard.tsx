import { Icon, ICON } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import type { RequirementCardVM } from "./view-models";

/**
 * RequirementCard block (DESIGN_SYSTEM_SPEC §3.2) — title, body, optional icon in a radius/lg Panel.
 * Composed from primitives + layout primitives + tokens. Token-pure.
 */
export function RequirementCard({ vm }: { vm: RequirementCardVM }) {
  const iconSrc = vm.icon ? (ICON as Record<string, string>)[vm.icon] ?? vm.icon : undefined;
  return (
    <Panel surface={2} radius="lg" padding={4}>
      <Stack gap={2}>
        <Stack axis="row" gap={2} align="center">
          {iconSrc && <Icon src={iconSrc} />}
          <span className="text-title font-title text-strong">{vm.title}</span>
        </Stack>
        <span className="text-body font-body text-muted">{vm.body}</span>
      </Stack>
    </Panel>
  );
}
