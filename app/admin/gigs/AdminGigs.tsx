/* @composed-screen */
"use client";

import { useActionState, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Section } from "@/app/components/layout/Section";
import { Stack } from "@/app/components/layout/Stack";
import { Select, Button, StatusBadge } from "@/app/components/primitives";
import { DataTable, ApplyPanel, Notice } from "@/app/components/blocks";
import { closeGig } from "@/app/actions/moderation";
import type { AdminGigRow } from "@/lib/view-models";
import type { Status } from "@/app/components/blocks/view-models";

type ActionState = { error?: string } | null;

const GIG_STATUS: Record<string, Status> = {
  OPEN: "open",
  IN_PROGRESS: "in-progress",
  REVIEW: "review",
  COMPLETED: "completed",
  PAID: "completed",
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

/** Inline close-gig action — a "Close" button reveals an ApplyPanel reason + "Close Gig" submit, over the kept action. */
function CloseAction({ gigId }: { gigId: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(closeGig as never, null);
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        Close
      </Button>
    );
  }
  return (
    <form action={formAction}>
      <input type="hidden" name="gigId" value={gigId} />
      <ApplyPanel
        vm={{
          fields: [{ name: "reason", label: "Причина", multiline: true, required: true, placeholder: "Укажите причину" }],
          submitLabel: "Close Gig",
        }}
      />
      {state?.error && <Notice tone="error">{state.error}</Notice>}
    </form>
  );
}

/**
 * AdminGigs — the /admin/gigs screen, composed purely from the kit (prove-extensibility-admin, the generativity proof).
 * Renders inside the admin AppShell. Status/closed filters (Select → URL params) + a DataTable of gigs (StatusBadge,
 * mono budget, inline close) over the kept `closeGig`. Template + slotted blocks/primitives only — no className/style/
 * off-token literal. Pagination + the count live in the page (orchestration).
 */
export function AdminGigs({ rows }: { rows: AdminGigRow[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get("status") ?? "";
  const closed = params.get("closed") ?? "";
  const [open, setOpen] = useState<string | null>(null);

  const navigate = (next: { status?: string; closed?: string }) => {
    const sp = new URLSearchParams();
    const s = next.status ?? status;
    const c = next.closed ?? closed;
    if (s) sp.set("status", s);
    if (c) sp.set("closed", c);
    router.push(`/admin/gigs${sp.toString() ? `?${sp}` : ""}`);
  };

  const tableRows = rows.map((g) => ({
    id: g.id,
    cells: [
      g.title,
      <StatusBadge key="status" variant="pill" status={g.closed ? "rejected" : GIG_STATUS[g.status] ?? "open"}>
        {g.closed ? "Закрыт" : g.status}
      </StatusBadge>,
      g.budget,
      g.created,
      g.closed ? "—" : <CloseAction key="act" gigId={g.id} />,
    ],
  }));

  return (
    <Section title="Гиги" gap={6}>
      <Stack axis="row" gap={3}>
        <Select
          options={STATUS_OPTIONS}
          value={status}
          placeholder="Все статусы"
          expanded={open === "status"}
          onToggle={() => setOpen((o) => (o === "status" ? null : "status"))}
          onSelect={(v) => {
            setOpen(null);
            navigate({ status: v });
          }}
          aria-label="Фильтр по статусу"
        />
        <Select
          options={CLOSED_OPTIONS}
          value={closed}
          placeholder="Все"
          expanded={open === "closed"}
          onToggle={() => setOpen((o) => (o === "closed" ? null : "closed"))}
          onSelect={(v) => {
            setOpen(null);
            navigate({ closed: v });
          }}
          aria-label="Фильтр по закрытию"
        />
      </Stack>
      <DataTable
        columns={["Гиг", "Статус", "Бюджет", "Создан", "Действия"]}
        rows={tableRows}
        empty="Гиги не найдены"
      />
    </Section>
  );
}
