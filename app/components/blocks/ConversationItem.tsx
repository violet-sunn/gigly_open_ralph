import { Avatar, StatusBadge } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import { cx } from "@/app/components/layout/scale";
import { initials, STATUS_LABEL } from "./util";
import type { ConversationItemVM } from "./view-models";

/**
 * ConversationItem block (DESIGN_SYSTEM_SPEC §3.2) — {read, unread}.
 * Avatar + name (+ optional gig status badge) + gig subtitle + preview + timestamp + unread count (brand pill).
 * Token-pure.
 */
export function ConversationItem({ vm, onOpen }: { vm: ConversationItemVM; onOpen?: () => void }) {
  const unread = vm.unread > 0;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-surface-level-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default"
    >
      <Avatar src={vm.avatar || undefined} initials={initials(vm.name)} size="sm" />
      <Stack gap={1} className="min-w-0 flex-1">
        <Stack axis="row" gap={2} align="center" className="min-w-0">
          <span className={cx("truncate text-label text-strong", unread ? "font-h2" : "font-label")}>{vm.name}</span>
          {vm.status && (
            <StatusBadge variant="inline-dot" status={vm.status}>
              {STATUS_LABEL[vm.status]}
            </StatusBadge>
          )}
        </Stack>
        {vm.subtitle && <span className="truncate text-caption font-caption text-subtle">{vm.subtitle}</span>}
        <span className="truncate text-caption font-caption text-muted">{vm.preview}</span>
      </Stack>
      <Stack gap={1} align="end">
        <span className="text-caption font-caption text-subtle">{vm.timestamp}</span>
        {unread && (
          <span className="inline-flex h-4 items-center justify-center rounded-pill bg-brand-default px-1 text-caption font-caption text-inverse">
            {vm.unread}
          </span>
        )}
      </Stack>
    </button>
  );
}
