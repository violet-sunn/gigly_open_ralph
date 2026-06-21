"use client";

// «Чаты» rebuilt on the prototype's `chats` block (Gigly App.dc.html line 1187+): a two-pane inbox — LEFT the
// «Сообщения» conversation list (avatar + counterparty + status + unread, project + time, 2-line preview, live search)
// and RIGHT the selected thread (counterparty header + day-separated message bubbles + the composer wired to the
// existing sendMessage). Selection navigates to /chats?gig=<id>.

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "@/app/actions/gig";
import type { ConversationItemVM, ChatHeaderVM, ChatPanelVM } from "@/app/components/blocks/view-models";
import { avatarColor, PatchIcon, STATUS_RGB, STATUS_LABEL_RU } from "@/app/_design/util";
import "@/app/_design/tokens.css";

export function ChatsDesign({
  conversations,
  thread,
  selectedGigId,
}: {
  conversations: ConversationItemVM[];
  thread: { header: ChatHeaderVM; chat: ChatPanelVM } | null;
  selectedGigId?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sendState, sendAction] = useActionState(sendMessage, null);

  const q = query.toLowerCase();
  const shown = q
    ? conversations.filter((c) => `${c.name} ${c.subtitle ?? ""} ${c.preview}`.toLowerCase().includes(q))
    : conversations;

  const header = thread?.header;
  const bubbles = thread?.chat.thread ?? [];

  return (
    <div style={{ display: "flex", gap: 24, minHeight: "calc(100vh - 220px)", boxSizing: "border-box" }}>
      {/* LEFT: conversation list */}
      <div style={{ width: 360, flex: "none", borderRadius: 12, background: "var(--surface-deep)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "22px 20px 12px", display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 26, color: "var(--text-1)", whiteSpace: "nowrap", flex: "none" }}>Сообщения</h2>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 24, padding: "0 7px", borderRadius: 6, background: "var(--om-accent, #0088ff)", color: "#fff", fontFamily: "'Handjet',monospace", fontWeight: 700, fontSize: 15 }}>
            {conversations.length}
          </span>
        </div>
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 16px", borderRadius: 8, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--hairline-06)" }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ color: "var(--text-4)" }}>
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию или описанию"
              style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: "var(--text-1)", fontFamily: "'Handjet',monospace", fontSize: 14 }}
            />
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0 12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
          {shown.length > 0 ? (
            shown.map((c) => {
              const active = c.id === selectedGigId;
              const statusColor = c.status ? `rgb(${STATUS_RGB[c.status] ?? "138,143,153"})` : "var(--text-4)";
              return (
                <div
                  key={c.id}
                  onClick={() => router.push(`/chats?gig=${c.id}`)}
                  style={{ display: "flex", flexDirection: "column", gap: 8, padding: 14, borderRadius: 10, cursor: "pointer", background: active ? "var(--surface-secondary)" : "transparent", boxShadow: "inset 0 0 0 1px var(--hairline-05)" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 24, height: 24, flex: "none", borderRadius: "50%", background: avatarColor(c.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                      {c.name.slice(0, 1)}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)" }}>{c.name}</span>
                    <div style={{ flex: 1 }} />
                    {c.status && (
                      <span style={{ display: "flex", alignItems: "center", gap: 5, flex: "none", whiteSpace: "nowrap", fontFamily: "'Handjet',monospace", fontSize: 12, color: statusColor }}>
                        <span style={{ width: 7, height: 7, flex: "none", borderRadius: "50%", background: statusColor }} />
                        {STATUS_LABEL_RU[c.status] ?? c.status}
                      </span>
                    )}
                    {c.unread > 0 && (
                      <span style={{ display: "flex", flex: "none", alignItems: "center", justifyContent: "center", minWidth: 20, height: 20, padding: "0 6px", borderRadius: 6, background: "var(--om-accent, #0088ff)", color: "#fff", fontFamily: "'Handjet',monospace", fontWeight: 700, fontSize: 12 }}>
                        {c.unread}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>{c.subtitle}</span>
                    <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>{c.timestamp}</span>
                  </div>
                  <span style={{ fontSize: 13, lineHeight: "17px", color: "var(--text-3)", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" }}>{c.preview}</span>
                </div>
              );
            })
          ) : (
            <span style={{ padding: 14, fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-3)" }}>Чаты не найдены.</span>
          )}
        </div>
      </div>

      {/* RIGHT: thread */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {thread && header ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 8px 16px", borderBottom: "1px solid var(--hairline-08)" }}>
              <span style={{ width: 36, height: 36, flex: "none", borderRadius: "50%", background: avatarColor(header.name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                {header.name.slice(0, 1)}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-1)" }}>{header.name}</span>
                  {header.verified && (
                    <span style={{ color: "var(--om-accent, #0088ff)", display: "flex" }}>
                      <PatchIcon size={15} />
                    </span>
                  )}
                </div>
                <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-3)" }}>{header.presence ?? "был(-а) недавно"}</span>
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "24px 8px", display: "flex", flexDirection: "column", gap: 16 }}>
              {bubbles.map((m, i) => {
                const prev = bubbles[i - 1];
                const showDate = m.date && m.date !== prev?.date;
                const out = m.direction === "out";
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {showDate && (
                      <div style={{ alignSelf: "center", fontFamily: "'Handjet',monospace", fontSize: 13, color: "var(--text-4)" }}>{m.date}</div>
                    )}
                    <div style={{ display: "flex", flexDirection: out ? "row-reverse" : "row", alignItems: "flex-end", gap: 10 }}>
                      <span style={{ width: 32, height: 32, flex: "none", borderRadius: "50%", background: avatarColor(m.author), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                        {m.author.slice(0, 1)}
                      </span>
                      <div style={{ maxWidth: "60%", borderRadius: 14, background: out ? "var(--bubble-me)" : "var(--surface-them)", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ fontSize: 15, lineHeight: "20px", color: "var(--text-1)" }}>{m.body}</span>
                        <span style={{ alignSelf: "flex-end", fontFamily: "'Handjet',monospace", fontSize: 11, color: "var(--text-3)" }}>
                          {out ? (m.readState === "read" ? "✓✓ " : "✓ ") : ""}
                          {m.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <form action={sendAction} style={{ display: "flex", alignItems: "center", gap: 12, height: 56, padding: "0 18px", borderRadius: 12, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--hairline-06)" }}>
              <input type="hidden" name="gigId" value={selectedGigId} />
              <input
                name="content"
                placeholder="Сообщение..."
                aria-label="Сообщение"
                style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: "var(--text-1)", fontFamily: "'Handjet',monospace", fontSize: 15 }}
              />
              <button type="submit" aria-label="Отправить" style={{ width: 36, height: 36, flex: "none", border: "none", borderRadius: 8, background: "var(--om-accent, #0088ff)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                </svg>
              </button>
            </form>
            {sendState?.error && <span style={{ marginTop: 8, fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "#ef4444" }}>{sendState.error}</span>}
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, color: "var(--text-3)" }}>Выберите чат, чтобы открыть переписку.</span>
          </div>
        )}
      </div>
    </div>
  );
}
