import { Stack } from "@/app/components/layout/Stack";
import { ConversationItem } from "./ConversationItem";
import type { MessagesPanelVM } from "./view-models";

/**
 * MessagesPanel block (DESIGN_SYSTEM_SPEC §3.2) — {preview, full}; ConversationItem·list.
 * preview caps the list; full shows all. Composes the ConversationItem sub-block. Token-pure.
 */
export function MessagesPanel({ vm, variant = "full" }: { vm: MessagesPanelVM; variant?: "preview" | "full" }) {
  const items = variant === "preview" ? vm.conversations.slice(0, 3) : vm.conversations;
  return (
    <Stack gap={1}>
      {items.map((c) => (
        <ConversationItem key={c.id} vm={c} />
      ))}
    </Stack>
  );
}
