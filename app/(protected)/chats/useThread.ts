"use client";

// chat-realtime — the single client seam the chat thread subscribes through. Holds the live message list, sends
// optimistically (temp bubble → reconcile with the server echo), and receives via delta polling of `getMessagesSince`
// (open thread only, ~3s, paused while the tab is hidden, no timer when no thread is open). The transport is fully
// encapsulated here: swapping polling for SSE/a managed bus later changes only this file + `getMessagesSince`'s
// producer — `ChatsDesign` and the message VM never change.
//
// IMPORTANT: every `setMessages` updater is PURE (dedupe against `prev`, no external mutation). Mutating a ref inside an
// updater desyncs under React Strict Mode / concurrent rendering (updaters run twice / are discarded) — which made
// optimistic bubbles vanish until reload. The poll cursor is derived from a separately-mirrored ref, read outside any
// updater.

import { useCallback, useEffect, useRef, useState } from "react";
import { sendMessageLive, getMessagesSince } from "@/app/actions/messaging";
import type { MessageBubbleVM } from "@/app/components/blocks/view-models";

const POLL_MS = 3000;
const EPOCH = new Date(0).toISOString();

const ruTime = (d: Date) => d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
const ruDate = (d: Date) => d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

const isTemp = (id?: string) => !!id && id.startsWith("tmp-");

/** The poll cursor = newest CONFIRMED (server) message timestamp. Optimistic/temp bubbles are excluded so client-clock
 *  skew can never advance the cursor past an unseen inbound message. */
function cursorOf(list: MessageBubbleVM[]): string {
  let last = EPOCH;
  for (const m of list) {
    if (m.pending || isTemp(m.id) || !m.id || !m.createdAt) continue;
    if (m.createdAt > last) last = m.createdAt;
  }
  return last;
}

export function useThread(gigId: string | undefined, initial: MessageBubbleVM[]) {
  const [messages, setMessages] = useState<MessageBubbleVM[]>(initial);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mirror the latest messages into a ref via a clean effect (NOT inside an updater) so the async poll can read the
  // current cursor without re-subscribing.
  const messagesRef = useRef<MessageBubbleVM[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // (Re)seed when the open conversation changes. Keyed on gigId only (the `initial` array identity changes every
  // render); thereafter the hook owns the list.
  useEffect(() => {
    setMessages(initial);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gigId]);

  // Append only genuinely-new messages — pure dedupe against the current list (no external state).
  const merge = useCallback((incoming: MessageBubbleVM[]) => {
    if (incoming.length === 0) return;
    setMessages((prev) => {
      const have = new Set(prev.map((m) => m.id).filter(Boolean));
      const add = incoming.filter((m) => m.id && !have.has(m.id));
      return add.length ? [...prev, ...add] : prev;
    });
  }, []);

  // Delta polling for the open thread (paused when hidden; immediate catch-up on focus; nothing when no gig).
  useEffect(() => {
    if (!gigId) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const res = await getMessagesSince(gigId, cursorOf(messagesRef.current));
        if (active) merge(res.messages);
      } catch {
        // transient — try again next tick
      }
    };

    const tick = async () => {
      if (!active) return;
      if (typeof document === "undefined" || !document.hidden) {
        await poll();
      }
      if (active) timer = setTimeout(tick, POLL_MS);
    };

    timer = setTimeout(tick, POLL_MS);

    const onVisible = () => {
      if (active && typeof document !== "undefined" && !document.hidden) poll();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      active = false;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [gigId, merge]);

  // Optimistic send: show the bubble immediately, persist, then reconcile (or mark failed). All updaters pure.
  const send = useCallback(
    async (content: string) => {
      const text = content.trim();
      if (!gigId || !text) return;
      setError(null);

      const now = new Date();
      const tempId = `tmp-${now.getTime()}-${Math.random().toString(36).slice(2)}`;
      const optimistic: MessageBubbleVM = {
        id: tempId,
        direction: "out",
        author: "Вы",
        body: text,
        timestamp: ruTime(now),
        date: ruDate(now),
        createdAt: now.toISOString(),
        pending: true,
      };
      setMessages((prev) => [...prev, optimistic]);
      setSending(true);

      try {
        const res = await sendMessageLive(gigId, text);
        if ("error" in res) {
          setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, pending: false, failed: true } : m)));
          setError(res.error);
          return;
        }
        const real = res.message;
        // Replace the temp bubble with the persisted one; if a concurrent poll already merged it, just drop the temp.
        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m.id !== tempId);
          if (real.id && withoutTemp.some((m) => m.id === real.id)) return withoutTemp;
          return [...withoutTemp, real];
        });
      } catch {
        setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, pending: false, failed: true } : m)));
        setError("Не удалось отправить сообщение. Попробуйте ещё раз.");
      } finally {
        setSending(false);
      }
    },
    [gigId],
  );

  return { messages, send, sending, error };
}
