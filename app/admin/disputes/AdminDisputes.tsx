"use client";

// /admin/disputes — the admin's dedicated «Споры» list: ALL disputes (open + resolved + rejected) with a status
// filter, in the console's row vocabulary. Each row opens /disputes/[id] (the resolve face for an OPEN dispute, the
// read-only detail otherwise). Distinct from the console's inline «Споры на модерации» queue (which shows OPEN only).

import { useRouter, useSearchParams } from "next/navigation";
import type { DisputeListVM } from "@/app/components/blocks/view-models";
import { STATUS_RGB, disputeLabel } from "@/app/_design/util";
import { cardBase, h2, rowBase, smallBtn, StatusDot, Avatar, FilterSelect } from "../_parts";
import "@/app/_design/tokens.css";

const STATUS_OPTIONS = [
  { value: "", label: "Все споры" },
  { value: "OPEN", label: "Открытые" },
  { value: "RESOLVED", label: "Разрешённые" },
  { value: "REJECTED", label: "Отклонённые" },
];

export function AdminDisputes({ rows }: { rows: DisputeListVM["disputes"] }) {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get("status") ?? "";
  const navigate = (s: string) => router.push(`/admin/disputes${s ? `?status=${s}` : ""}`);

  return (
    <div style={cardBase}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 style={h2}>Споры</h2>
        <span style={{ flex: 1 }} />
        <FilterSelect value={status} options={STATUS_OPTIONS} ariaLabel="Фильтр по статусу" onChange={navigate} />
      </div>
      {rows.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((d) => {
            const color = `rgb(${STATUS_RGB[d.status] ?? "138,143,153"})`;
            const open = () => router.push(`/disputes/${d.id}?from=${encodeURIComponent("/admin/disputes")}`);
            return (
              <div key={d.id} data-row="dispute" onClick={open} style={{ ...rowBase, cursor: "pointer" }}>
                <Avatar name={d.gig} />
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 14, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.gig}</span>
                  <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>{[d.reason, d.opener, d.created].filter(Boolean).join(" · ")}</span>
                </div>
                {d.amount && <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>{d.amount}</span>}
                <StatusDot color={color} label={disputeLabel(d.status)} />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); open(); }}
                  style={smallBtn("rgba(245,158,11,0.16)", "#f59e0b")}
                >
                  {d.status === "open" ? "Рассмотреть" : "Открыть"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-3)" }}>Споры не найдены.</span>
      )}
    </div>
  );
}
