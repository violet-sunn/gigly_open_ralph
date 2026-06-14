import { Avatar } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { StatPanel } from "./StatPanel";
import { initials } from "./util";
import type { ProfileCardVM, ProfileHeaderVM } from "./view-models";

type ProfileCardProps =
  | { variant?: "compact"; vm: ProfileCardVM }
  | { variant: "full"; vm: ProfileHeaderVM };

/**
 * ProfileCard block (DESIGN_SYSTEM_SPEC §3.2) — role × {full, compact}.
 * compact = Avatar + name + roleTag (+ rating); full (= ProfileHeader) = Avatar(lg) + identity +
 * StatPanel. Composed from primitives + layout primitives + tokens. Token-pure.
 */
export function ProfileCard(props: ProfileCardProps) {
  if (props.variant === "full") {
    const vm = props.vm;
    return (
      <Panel surface={2} radius="lg" padding={6}>
        <Stack gap={4}>
          <Stack axis="row" gap={4} align="center">
            <Avatar src={vm.avatar || undefined} initials={initials(vm.name)} size="lg" online={vm.verified} />
            <Stack gap={1}>
              <span className="text-h2 font-h2 text-strong">{vm.name}</span>
              <span className="text-label font-label text-muted">{vm.roleTag}</span>
              <span className="text-caption font-caption text-subtle">
                На платформе с {vm.memberSince}
                {vm.location ? ` · ${vm.location}` : ""}
              </span>
            </Stack>
          </Stack>
          <StatPanel vm={{ stats: vm.stats }} variant="grid" />
        </Stack>
      </Panel>
    );
  }

  const vm = props.vm;
  return (
    <Stack axis="row" gap={3} align="center">
      <Avatar src={vm.avatar || undefined} initials={initials(vm.name)} size="sm" online={vm.rating?.online} />
      <Stack gap={1}>
        <span className="text-label font-label text-strong">{vm.name}</span>
        {vm.roleTag && <span className="text-caption font-caption text-muted">{vm.roleTag}</span>}
      </Stack>
    </Stack>
  );
}
