import { Avatar, Rating } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { initials } from "./util";
import type { ClientCardVM } from "./view-models";

/**
 * ClientCard block (DESIGN_SYSTEM_SPEC §3.2) — Avatar, name, Rating, meta.
 * Composed from primitives + layout primitives + tokens. Token-pure.
 */
export function ClientCard({ vm }: { vm: ClientCardVM }) {
  return (
    <Panel surface={2} radius="lg" padding={4}>
      <Stack gap={3}>
        <Stack axis="row" gap={3} align="center">
          <Avatar src={vm.avatar || undefined} initials={initials(vm.name)} size="sm" />
          <span className="text-title font-title text-strong">{vm.name}</span>
        </Stack>
        <Rating value={vm.rating.value} count={vm.rating.count} verified={vm.rating.verified} online={vm.rating.online} />
        {vm.meta && vm.meta.length > 0 && (
          <Stack gap={1}>
            {vm.meta.map((m, i) => (
              <Stack key={i} axis="row" gap={2} justify="between">
                <span className="text-caption font-caption text-muted">{m.key}</span>
                <span className="text-caption font-caption text-strong">{m.value}</span>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Panel>
  );
}
