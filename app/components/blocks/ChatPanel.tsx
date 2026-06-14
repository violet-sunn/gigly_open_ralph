import { Input, Button, Icon, ICON } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import { MessageBubble } from "./MessageBubble";
import type { ChatPanelVM } from "./view-models";

interface ChatPanelProps {
  vm: ChatPanelVM;
  onSend?: () => void;
  onAttach?: () => void;
}

/**
 * ChatPanel block (DESIGN_SYSTEM_SPEC §3.2) — MessageBubble·thread + Composer (Input + send + attach).
 * The `attach` glyph is a residual (DESIGN_SPECS §7.5) → an accessible labelled fallback control, NOT
 * a redrawn glyph (routed to Figma). Composes the MessageBubble sub-block. Token-pure.
 */
export function ChatPanel({ vm, onSend, onAttach }: ChatPanelProps) {
  return (
    <Stack gap={4}>
      <Stack gap={2}>
        {vm.thread.map((m, i) => (
          <MessageBubble key={i} vm={m} />
        ))}
      </Stack>
      <Stack axis="row" gap={2} align="center">
        {vm.composer.canAttach && (
          <Button variant="ghost" onClick={onAttach} aria-label="Прикрепить файл">
            Файл
          </Button>
        )}
        <div className="flex-1">
          <Input placeholder="Сообщение…" aria-label="Сообщение" />
        </div>
        <Button variant="primary" onClick={onSend} aria-label="Отправить">
          <Icon src={ICON.send} alt="" />
        </Button>
      </Stack>
    </Stack>
  );
}
