import { Input, Button, Icon, ICON } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import { MessageBubble } from "./MessageBubble";
import { ChatHeader } from "./ChatHeader";
import type { ChatPanelVM } from "./view-models";

interface ChatPanelProps {
  vm: ChatPanelVM;
  onSend?: () => void;
  onAttach?: () => void;
}

/**
 * ChatPanel block (DESIGN_SYSTEM_SPEC §3.2) — optional ChatHeader + MessageBubble·thread (with day
 * separators) + Composer (Input + send + attach). The `attach` glyph is a residual (DESIGN_SPECS §7.5)
 * → an accessible labelled fallback control, NOT a redrawn glyph (routed to Figma). The header + date
 * separators are additive: absent `vm.header` / `m.date` ⇒ renders exactly as before. Token-pure.
 */
export function ChatPanel({ vm, onSend, onAttach }: ChatPanelProps) {
  return (
    <Stack gap={4}>
      {vm.header && <ChatHeader vm={vm.header} />}
      <Stack gap={2}>
        {vm.thread.map((m, i) => {
          const showDate = m.date != null && m.date !== vm.thread[i - 1]?.date;
          return (
            <Stack key={i} gap={2}>
              {showDate && (
                <Stack axis="row" justify="center">
                  <span className="text-caption font-caption text-muted">{m.date}</span>
                </Stack>
              )}
              <MessageBubble vm={m} />
            </Stack>
          );
        })}
      </Stack>
      <Stack axis="row" gap={2} align="center">
        {vm.composer.canAttach && (
          <Button variant="ghost" onClick={onAttach} aria-label="Прикрепить файл">
            Файл
          </Button>
        )}
        <div className="flex-1">
          <Input name="content" placeholder="Сообщение…" aria-label="Сообщение" />
        </div>
        <Button type="submit" variant="primary" onClick={onSend} aria-label="Отправить">
          <Icon src={ICON.send} alt="" />
        </Button>
      </Stack>
    </Stack>
  );
}
