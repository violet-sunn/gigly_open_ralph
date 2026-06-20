import { Stack } from "@/app/components/layout/Stack";
import { cx } from "@/app/components/layout/scale";
import type { MessageBubbleVM } from "./view-models";

/**
 * MessageBubble block (DESIGN_SYSTEM_SPEC §3.2) — direction {in, out} + text, timestamp, read-state.
 * in = left/surface; out = right/brand-tint. Token-pure (composed from layout primitives + tokens).
 */
export function MessageBubble({ vm }: { vm: MessageBubbleVM }) {
  const out = vm.direction === "out";
  return (
    <Stack axis="row" justify={out ? "end" : "start"}>
      <div className={cx("max-w-md rounded-lg px-3 py-2", out ? "bg-tint-brand" : "bg-surface-level-2")}>
        <span className="block text-body font-body text-strong">{vm.body}</span>
        <span className="mt-1 block text-caption font-caption text-muted">
          {vm.timestamp}
          {vm.readState ? ` · ${vm.readState === "read" ? "прочитано" : "отправлено"}` : ""}
        </span>
      </div>
    </Stack>
  );
}
