import { Avatar, Rating, Icon, ICON } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import { initials } from "./util";
import type { ChatHeaderVM } from "./view-models";

/**
 * ChatHeader block (compose-chats gap fill, DESIGN_SYSTEM_SPEC §3.2) — the thread header: Avatar +
 * counterparty name + verified mark + Rating + presence text («был(-а) недавно»). Composed from
 * primitives + layout primitives + tokens. Token-pure.
 */
export function ChatHeader({ vm }: { vm: ChatHeaderVM }) {
  return (
    <Stack axis="row" gap={3} align="center">
      <Avatar src={vm.avatar || undefined} initials={initials(vm.name)} size="sm" />
      <Stack gap={1}>
        <Stack axis="row" gap={2} align="center">
          <span className="text-title font-title text-strong">{vm.name}</span>
          {vm.verified && <Icon src={ICON.verified} alt="Подтверждён" />}
          {vm.rating && <Rating value={vm.rating.value} count={vm.rating.count} verified={false} />}
        </Stack>
        {vm.presence && <span className="text-caption font-caption text-muted">{vm.presence}</span>}
      </Stack>
    </Stack>
  );
}
