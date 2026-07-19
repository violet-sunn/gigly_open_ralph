"use client";

// /admin/gigs — the full paginated gig management, transported to the console's «Гиги» row vocabulary (dashboard.admin
// has no own table screen). Status/closed filters (token selects → URL params) + console-style rows (avatar · title ·
// client·budget · status · close-via-confirm) over the kept closeGig action. Pagination + count live in the page.

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { closeGig, deleteGig, getGigDeletionImpact, type GigDeletionImpact } from "@/app/actions/moderation";
import type { AdminGigRow } from "@/lib/view-models";
import { ConfirmAction, DeletePreviewAction } from "@/app/_design/ConfirmDialog";
import { STATUS_RGB } from "@/app/_design/util";
import { cardBase, h2, rowBase, smallBtn, StatusDot, Avatar, FilterSelect } from "../_parts";
import "@/app/_design/tokens.css";

const GIG_RAW: Record<string, { label: string; tone: string }> = {
  OPEN: { label: "Открыт", tone: "open" },
  IN_PROGRESS: { label: "В работе", tone: "in-progress" },
  REVIEW: { label: "На проверке", tone: "verification" },
  COMPLETED: { label: "Завершён", tone: "completed" },
  PAID: { label: "Оплачен", tone: "completed" },
};

const STATUS_OPTIONS = [
  { value: "", label: "Все статусы" },
  { value: "OPEN", label: "OPEN" },
  { value: "IN_PROGRESS", label: "IN_PROGRESS" },
  { value: "REVIEW", label: "REVIEW" },
  { value: "COMPLETED", label: "COMPLETED" },
  { value: "PAID", label: "PAID" },
];
const CLOSED_OPTIONS = [
  { value: "", label: "Все" },
  { value: "false", label: "Открытые" },
  { value: "true", label: "Закрытые" },
];

function GigCloseAction({ id, title }: { id: string; title: string }) {
  return (
    <ConfirmAction
      action={closeGig}
      hidden={{ gigId: id, reason: "Закрыт модератором" }}
      buttonLabel="Закрыть"
      buttonStyle={smallBtn("rgba(239,68,68,0.14)", "#ef4444")}
      title="Закрыть гиг?"
      body={`Гиг «${title}» будет снят с публикации. Действие обратимо.`}
      confirmLabel="Закрыть"
    />
  );
}

const gigImpactBody = (title: string) => (i: GigDeletionImpact) =>
  `Гиг «${title}» и все связанные данные будут удалены безвозвратно: откликов — ${i.applications}, сообщений — ${i.messages}, отзывов — ${i.reviews}, споров — ${i.disputes}. Действие необратимо.`;

function GigDeleteAction({ id, title }: { id: string; title: string }) {
  return (
    <DeletePreviewAction<GigDeletionImpact>
      id={id}
      hiddenKey="gigId"
      deleteAction={deleteGig}
      loadImpact={getGigDeletionImpact}
      reason="Удалён модератором"
      title="Удалить гиг?"
      formatBody={gigImpactBody(title)}
      // Mirror the server guard: an open dispute must be resolved before the gig can be purged.
      blockReason={(i) => (i.hasOpenDispute ? "По гигу открыт спор — сначала решите его, затем удаляйте." : null)}
    />
  );
}

export function AdminGigs({ rows }: { rows: AdminGigRow[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get("status") ?? "";
  const closed = params.get("closed") ?? "";

  const navigate = (next: { status?: string; closed?: string }) => {
    const sp = new URLSearchParams();
    const s = next.status ?? status;
    const c = next.closed ?? closed;
    if (s) sp.set("status", s);
    if (c) sp.set("closed", c);
    router.push(`/admin/gigs${sp.toString() ? `?${sp}` : ""}`);
  };

  return (
    <div style={cardBase}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 style={h2}>Гиги</h2>
        <span style={{ flex: 1 }} />
        <FilterSelect value={status} options={STATUS_OPTIONS} ariaLabel="Фильтр по статусу" onChange={(v) => navigate({ status: v })} />
        <FilterSelect value={closed} options={CLOSED_OPTIONS} ariaLabel="Фильтр по закрытию" onChange={(v) => navigate({ closed: v })} />
      </div>
      {rows.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((g) => {
            const meta = GIG_RAW[g.status] ?? { label: g.status, tone: "open" };
            const color = g.closed ? "#ef4444" : `rgb(${STATUS_RGB[meta.tone] ?? "138,143,153"})`;
            const sub = [g.client, g.budget].filter(Boolean).join(" · ");
            return (
              <div key={g.id} data-row="gig" style={rowBase}>
                <Avatar name={g.title} />
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* The console could close a gig without ever reading it; the title now opens it (and, from there,
                      its correspondence) so a moderator can look before acting. */}
                  <Link
                    href={`/gigs/${g.id}`}
                    title="Открыть гиг"
                    style={{ fontSize: 14, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textDecoration: "underline", textDecorationColor: "var(--hairline-12)" }}
                  >
                    {g.title}
                  </Link>
                  <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>{sub}</span>
                </div>
                <StatusDot color={color} label={g.closed ? "Закрыт" : meta.label} />
                {!g.closed && <GigCloseAction id={g.id} title={g.title} />}
                <GigDeleteAction id={g.id} title={g.title} />
              </div>
            );
          })}
        </div>
      ) : (
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-3)" }}>Гиги не найдены.</span>
      )}
    </div>
  );
}
