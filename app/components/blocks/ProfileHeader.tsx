import { Avatar, Icon, IconButton, ICON } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { initials } from "./util";
import type { ProfileHeaderVM } from "./view-models";

/**
 * ProfileHeader block (compose-profile gap fill, DESIGN_SYSTEM_SPEC §3.2) — the profile hero:
 * Avatar (lg, online dot) + name (display) + role tag + a phone-verified badge + member-since +
 * inline stat tiles, with an optional owner edit affordance. Composed from primitives + layout
 * primitives + tokens. Token-pure.
 */
export function ProfileHeader({ vm, onEdit }: { vm: ProfileHeaderVM; onEdit?: () => void }) {
  return (
    <Panel surface={1} radius="lg" padding={6}>
      <Stack axis="row" gap={5} align="start">
        <Avatar src={vm.avatar || undefined} initials={initials(vm.name)} size="lg" online={vm.online} />
        <Stack gap={3} className="flex-1">
          <Stack axis="row" gap={3} align="center" justify="between">
            <span className="text-display font-display text-strong">{vm.name}</span>
            {onEdit && <IconButton icon={ICON.gear} onClick={onEdit} aria-label="Редактировать профиль" />}
          </Stack>
          <span className="inline-flex w-fit items-center rounded-pill border border-border px-3 py-1 text-label font-label text-strong">
            {vm.roleTag}
          </span>
          <Stack axis="row" gap={2} align="center">
            {vm.verified && <Icon src={ICON.verified} alt="" />}
            <span className="text-caption font-caption text-muted">
              {vm.verified ? "Номер телефона верифицирован" : "Номер телефона не подтверждён"}
            </span>
          </Stack>
          <span className="text-caption font-caption text-muted">с {vm.memberSince}</span>
          {vm.stats.length > 0 && (
            <Stack axis="row" gap={6}>
              {vm.stats.map((s, i) => (
                <Stack key={i} gap={1}>
                  <span className="text-caption font-caption text-muted">{s.label}</span>
                  <span className="text-title font-title text-strong">{s.value}</span>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Panel>
  );
}
