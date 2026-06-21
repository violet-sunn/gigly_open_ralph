"use client";

// «Модерация» console rebuilt on the prototype's `isAdminConsole` block (Gigly App.dc.html line 988+): stat tiles +
// the 2-col board — LEFT «Споры на модерации» (queue → /disputes/[id] to resolve), «Пользователи» (block/unblock),
// «Гиги» (close); RIGHT «Журнал модерации» (audit log). Wired to the existing moderation actions. The full paginated
// user/gig management remains at /admin/users · /admin/gigs (this console shows the top rows).

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { suspendUser, unsuspendUser, closeGig } from "@/app/actions/moderation";
import type { AdminDashboardData } from "@/lib/view-models";
import { avatarColor, STATUS_RGB, STATUS_LABEL_RU } from "@/app/_design/util";
import "@/app/_design/tokens.css";

const cardBase: React.CSSProperties = { borderRadius: 12, background: "var(--surface-card)", padding: 20, display: "flex", flexDirection: "column", gap: 14 };
const h2: React.CSSProperties = { margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 22, color: "var(--text-1)" };
const rowBase: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, background: "var(--surface-sunken)", boxShadow: "inset 0 0 0 1px var(--hairline-06)" };
const smallBtn = (bg: string, color: string): React.CSSProperties => ({ flex: "none", height: 32, padding: "0 14px", border: "none", borderRadius: 7, background: bg, color, fontSize: 12, cursor: "pointer" });

const GIG_RAW: Record<string, { label: string; tone: string }> = {
  OPEN: { label: "Открыт", tone: "open" },
  IN_PROGRESS: { label: "В работе", tone: "in-progress" },
  REVIEW: { label: "На проверке", tone: "verification" },
  COMPLETED: { label: "Завершён", tone: "completed" },
  PAID: { label: "Оплачен", tone: "completed" },
};

function StatusDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flex: "none", fontFamily: "'Handjet',monospace", fontSize: 12, color }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}
function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <span style={{ width: size, height: size, flex: "none", borderRadius: "50%", background: avatarColor(name || "?"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff" }}>
      {(name || "?").slice(0, 1).toUpperCase()}
    </span>
  );
}

function UserAction({ id, suspended }: { id: string; suspended: boolean }) {
  const [, suspend] = useActionState(suspendUser as never, null);
  const [, unsuspend] = useActionState(unsuspendUser as never, null);
  return (
    <form action={(suspended ? unsuspend : suspend) as never}>
      <input type="hidden" name="userId" value={id} />
      <input type="hidden" name="reason" value="Модерация из консоли" />
      <button type="submit" style={smallBtn(suspended ? "var(--surface-secondary)" : "rgba(239,68,68,0.14)", suspended ? "var(--text-2)" : "#ef4444")}>
        {suspended ? "Разблокировать" : "Заблокировать"}
      </button>
    </form>
  );
}
function GigCloseAction({ id }: { id: string }) {
  const [, close] = useActionState(closeGig as never, null);
  return (
    <form action={close as never}>
      <input type="hidden" name="gigId" value={id} />
      <input type="hidden" name="reason" value="Закрыт из консоли" />
      <button type="submit" style={smallBtn("rgba(239,68,68,0.14)", "#ef4444")}>Закрыть</button>
    </form>
  );
}

export function AdminConsoleDesign({ stats, disputes, log, users, gigs }: AdminDashboardData) {
  const router = useRouter();
  const queue = disputes.disputes;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* stat tiles */}
      <div style={{ display: "flex", gap: 16 }}>
        {stats.stats.map((s, i) => (
          <div key={i} style={{ flex: 1, borderRadius: 12, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-08)", padding: 18, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "'Handjet',monospace", fontSize: 13, color: "var(--text-3)" }}>{s.label}</span>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 26, color: "var(--text-1)" }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* LEFT */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Споры на модерации */}
          <div style={{ ...cardBase, boxShadow: "inset 0 0 0 1px rgba(245,158,11,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={h2}>Споры на модерации</h2>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 22, height: 22, padding: "0 7px", borderRadius: 6, background: "#f59e0b", color: "var(--surface-sidebar)", fontFamily: "'Handjet',monospace", fontWeight: 700, fontSize: 14 }}>
                {queue.length}
              </span>
            </div>
            {queue.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {queue.map((d) => (
                  <div key={d.id} style={rowBase}>
                    <Avatar name={d.gig} />
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 14, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.gig}</span>
                      <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>{[d.reason, d.amount].filter(Boolean).join(" · ")}</span>
                    </div>
                    <StatusDot color={`rgb(${STATUS_RGB[d.status] ?? "138,143,153"})`} label={STATUS_LABEL_RU[d.status] ?? d.status} />
                    <button type="button" onClick={() => router.push(`/disputes/${d.id}`)} style={smallBtn("rgba(245,158,11,0.16)", "#f59e0b")}>
                      Рассмотреть
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-3)" }}>Открытых споров нет.</span>
            )}
          </div>

          {/* Пользователи */}
          <div style={{ ...cardBase, boxShadow: "inset 0 0 0 1px var(--hairline-08)" }}>
            <h2 style={h2}>Пользователи</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {users.map((u) => (
                <div key={u.id} style={rowBase}>
                  <Avatar name={u.email} />
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 14, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</span>
                    <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>{u.role} · {u.registered}</span>
                  </div>
                  <StatusDot color={u.suspended ? "#ef4444" : "#34c759"} label={u.suspended ? "Заблокирован" : "Активен"} />
                  <UserAction id={u.id} suspended={u.suspended} />
                </div>
              ))}
            </div>
          </div>

          {/* Гиги */}
          <div style={{ ...cardBase, boxShadow: "inset 0 0 0 1px var(--hairline-08)" }}>
            <h2 style={h2}>Гиги</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {gigs.map((g) => {
                const meta = GIG_RAW[g.status] ?? { label: g.status, tone: "open" };
                const color = g.closed ? "#ef4444" : `rgb(${STATUS_RGB[meta.tone] ?? "138,143,153"})`;
                return (
                  <div key={g.id} style={rowBase}>
                    <Avatar name={g.title} />
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 14, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.title}</span>
                      <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>{g.budget} · {g.created}</span>
                    </div>
                    <StatusDot color={color} label={g.closed ? "Закрыт" : meta.label} />
                    {!g.closed && <GigCloseAction id={g.id} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Журнал модерации */}
        <div style={{ width: 340, flex: "none", ...cardBase, boxShadow: "inset 0 0 0 1px var(--hairline-08)" }}>
          <h2 style={h2}>Журнал модерации</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {log.length > 0 ? (
              log.map((e) => (
                <div key={e.id} style={{ display: "flex", flexDirection: "column", gap: 3, padding: "11px 0", borderBottom: "1px solid var(--hairline-06)" }}>
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, lineHeight: "18px", color: "var(--text-2)" }}>{e.action}</span>
                  <span style={{ fontFamily: "'Handjet',monospace", fontSize: 11, color: "var(--text-4)" }}>{e.actor} · {e.at}</span>
                </div>
              ))
            ) : (
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-3)" }}>Журнал пуст.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
