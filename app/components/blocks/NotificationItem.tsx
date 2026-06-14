import { Icon, ICON } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import { cx } from "@/app/components/layout/scale";
import type { NotificationItemVM, NotifType } from "./view-models";

/** Notification type → an exported icon (F4). Dedicated notif glyphs, if added, are a future residual. */
const NOTIF_ICON: Record<NotifType, keyof typeof ICON> = {
  application: "bell",
  status: "star",
  message: "chats",
};

/**
 * NotificationItem block (DESIGN_SYSTEM_SPEC §3.2) — type icon + body + timestamp, read/unread.
 * Token-pure; icon via the exported ICON registry.
 */
export function NotificationItem({ vm }: { vm: NotificationItemVM }) {
  return (
    <Stack axis="row" gap={3} align="center" className={cx("rounded-md px-3 py-2", !vm.read && "bg-surface-level-3")}>
      <Icon src={ICON[NOTIF_ICON[vm.type]]} />
      <Stack gap={1} className="flex-1">
        <span className={cx("text-body", vm.read ? "font-body text-muted" : "font-label text-strong")}>{vm.body}</span>
        <span className="text-caption font-caption text-subtle">{vm.timestamp}</span>
      </Stack>
    </Stack>
  );
}
