"use client";

// «Модерация» console rebuilt on the prototype's `isAdminConsole` block (dashboard.admin): stat tiles (with caption
// lines) + the 2-col board — LEFT «Споры на модерации» (queue → /disputes/[id] to resolve), «Пользователи» (block via
// the captured confirm dialog / unblock), «Гиги» (close via confirm); RIGHT «Журнал модерации» (audit log). Wired to the
// existing moderation actions. The full paginated user/gig management remains at /admin/users · /admin/gigs (top rows here).

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { suspendUser, unsuspendUser, closeGig } from "@/app/actions/moderation";
import type { AdminDashboardData } from "@/lib/view-models";
import { STATUS_RGB, disputeLabel } from "@/app/_design/util";
import { ConfirmAction } from "@/app/_design/ConfirmDialog";
import { cardBase, h2, rowBase, smallBtn, StatusDot, Avatar } from "./_parts";
import "@/app/_design/tokens.css";

// Stat-tile static copy (Method §2): labels + caption lines are verbatim design copy; only the value binds (by index,
// matching getAdminDashboard's fixed order: users · gigs · suspended · closed).
const STAT_META = [
  { label: "Пользователи", caption: "на платформе" },
  { label: "Гиги", caption: "всего опубликовано" },
  { label: "Заблокировано", caption: "пользователей" },
  { label: "Закрыто гигов", caption: "модерацией" },
];

const GIG_RAW: Record<string, { label: string; tone: string }> = {
  OPEN: { label: "Открыт", tone: "open" },
  IN_PROGRESS: { label: "В работе", tone: "in-progress" },
  REVIEW: { label: "На проверке", tone: "verification" },
  COMPLETED: { label: "Завершён", tone: "completed" },
  PAID: { label: "Оплачен", tone: "completed" },
};

function UserAction({ id, name, suspended }: { id: string; name: string; suspended: boolean }) {
  const [, unsuspend] = useActionState(unsuspendUser as never, null);
  if (suspended) {
    // Unblock is reversible/non-destructive — fires directly, no confirm gate.
    return (
      <form action={unsuspend as never}>
        <input type="hidden" name="userId" value={id} />
        <input type="hidden" name="reason" value="Модерация из консоли" />
        <button type="submit" style={smallBtn("var(--surface-secondary)", "var(--text-2)")}>Разблокировать</button>
      </form>
    );
  }
  return (
    <ConfirmAction
      action={suspendUser}
      hidden={{ userId: id, reason: "Модерация из консоли" }}
      buttonLabel="Заблокировать"
      buttonStyle={smallBtn("rgba(239,68,68,0.14)", "#ef4444")}
      title="Заблокировать пользователя?"
      body={`«${name}» не сможет войти на платформу. Действие обратимо.`}
      confirmLabel="Заблокировать"
    />
  );
}

function GigCloseAction({ id, title }: { id: string; title: string }) {
  return (
    <ConfirmAction
      action={closeGig}
      hidden={{ gigId: id, reason: "Закрыт из консоли" }}
      buttonLabel="Закрыть"
      buttonStyle={smallBtn("rgba(239,68,68,0.14)", "#ef4444")}
      title="Закрыть гиг?"
      body={`Гиг «${title}» будет снят с публикации. Действие обратимо.`}
      confirmLabel="Закрыть"
    />
  );
}

export function AdminConsoleDesign({ stats, disputes, log, users, gigs }: AdminDashboardData) {
  const router = useRouter();
  const queue = disputes.disputes;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* stat tiles */}
      <div style={{ display: "flex", gap: 16 }}>
        {STAT_META.map((m, i) => (
          <div key={i} style={{ flex: 1, borderRadius: 12, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-08)", padding: 18, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "'Handjet',monospace", fontSize: 13, color: "var(--text-3)" }}>{m.label}</span>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 26, color: "var(--text-1)" }}>{stats.stats[i]?.value ?? 0}</span>
            <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>{m.caption}</span>
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
                    <StatusDot color={`rgb(${STATUS_RGB[d.status] ?? "138,143,153"})`} label={disputeLabel(d.status)} />
                    <button type="button" onClick={() => router.push(`/disputes/${d.id}?from=${encodeURIComponent("/admin")}`)} style={smallBtn("rgba(245,158,11,0.16)", "#f59e0b")}>
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
          <div style={cardBase}>
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
                  <UserAction id={u.id} name={u.email} suspended={u.suspended} />
                </div>
              ))}
            </div>
          </div>

          {/* Гиги */}
          <div style={cardBase}>
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
                      <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>{g.client || g.budget}</span>
                    </div>
                    <StatusDot color={color} label={g.closed ? "Закрыт" : meta.label} />
                    {!g.closed && <GigCloseAction id={g.id} title={g.title} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — Журнал модерации */}
        <div style={{ width: 340, flex: "none", ...cardBase }}>
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
