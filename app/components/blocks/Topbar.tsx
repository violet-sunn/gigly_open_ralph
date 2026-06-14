import { Icon, ICON } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import { ProfileCard } from "./ProfileCard";
import type { TopbarVM } from "./view-models";

/**
 * Topbar block (DESIGN_SYSTEM_SPEC §3.2) — ProfileCard (avatar) + bell + gear.
 * Composes the ProfileCard sub-block + exported icons. Token-pure.
 */
export function Topbar({ vm }: { vm: TopbarVM }) {
  return (
    <Stack axis="row" gap={4} align="center" justify="between" className="bg-surface-level-1 px-4 py-2">
      <ProfileCard variant="compact" vm={vm.profile} />
      <Stack axis="row" gap={3} align="center">
        <span className="relative inline-flex">
          <Icon src={ICON.bell} alt="Уведомления" />
          {vm.unreadNotifications > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex h-4 items-center justify-center rounded-pill bg-brand-default px-1 text-caption font-caption text-inverse">
              {vm.unreadNotifications}
            </span>
          )}
        </span>
        <Icon src={ICON.gear} alt="Настройки" />
      </Stack>
    </Stack>
  );
}
