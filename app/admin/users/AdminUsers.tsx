/* @composed-screen */
"use client";

import { useActionState, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Section } from "@/app/components/layout/Section";
import { Stack } from "@/app/components/layout/Stack";
import { Select, Button, StatusBadge, Tag } from "@/app/components/primitives";
import { DataTable, ApplyPanel, Notice } from "@/app/components/blocks";
import { suspendUser, unsuspendUser } from "@/app/actions/moderation";
import type { AdminUserRow } from "@/lib/view-models";

type ActionState = { error?: string } | null;
function useAction(fn: unknown) {
  return useActionState<ActionState, FormData>(fn as never, null);
}

const ROLE_OPTIONS = [
  { value: "", label: "Все роли" },
  { value: "CLIENT", label: "CLIENT" },
  { value: "SPECIALIST", label: "SPECIALIST" },
  { value: "ADMIN", label: "ADMIN" },
];
const STATUS_OPTIONS = [
  { value: "", label: "Все статусы" },
  { value: "active", label: "Активные" },
  { value: "suspended", label: "Заблокированные" },
];

/** Inline moderation action — a label button reveals an ApplyPanel reason field + a submit, wired to the kept action. */
function ModerationAction({
  field,
  value,
  reveal,
  submitLabel,
  action,
}: {
  field: string;
  value: string;
  reveal: string;
  submitLabel: string;
  action: unknown;
}) {
  const [state, formAction] = useAction(action);
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        {reveal}
      </Button>
    );
  }
  return (
    <form action={formAction}>
      <input type="hidden" name={field} value={value} />
      <ApplyPanel
        vm={{
          fields: [{ name: "reason", label: "Причина", multiline: true, required: true, placeholder: "Укажите причину" }],
          submitLabel,
        }}
      />
      {state?.error && <Notice tone="error">{state.error}</Notice>}
    </form>
  );
}

/**
 * AdminUsers — the /admin/users screen, composed purely from the kit (prove-extensibility-admin, the generativity
 * proof). Renders inside the admin AppShell. Role/status filters (Select → URL params) + a DataTable of users (Tag for
 * role, StatusBadge for active/suspended, inline suspend/unsuspend) over the kept moderation actions. Template + slotted
 * blocks/primitives only — no className/style/off-token literal. Pagination + the count live in the page (orchestration).
 */
export function AdminUsers({ rows }: { rows: AdminUserRow[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get("role") ?? "";
  const status = params.get("status") ?? "";
  const [open, setOpen] = useState<string | null>(null);

  const navigate = (next: { role?: string; status?: string }) => {
    const sp = new URLSearchParams();
    const r = next.role ?? role;
    const s = next.status ?? status;
    if (r) sp.set("role", r);
    if (s) sp.set("status", s);
    router.push(`/admin/users${sp.toString() ? `?${sp}` : ""}`);
  };

  const tableRows = rows.map((u) => ({
    id: u.id,
    cells: [
      u.email,
      <Tag key="role">{u.role}</Tag>,
      <StatusBadge key="status" variant="pill" status={u.suspended ? "rejected" : "completed"}>
        {u.suspended ? "Заблокирован" : "Активен"}
      </StatusBadge>,
      u.registered,
      u.suspended ? (
        <ModerationAction key="act" field="userId" value={u.id} reveal="Unsuspend" submitLabel="Unsuspend User" action={unsuspendUser} />
      ) : (
        <ModerationAction key="act" field="userId" value={u.id} reveal="Suspend" submitLabel="Suspend User" action={suspendUser} />
      ),
    ],
  }));

  return (
    <Section title="Пользователи" gap={6}>
      <Stack axis="row" gap={3}>
        <Select
          options={ROLE_OPTIONS}
          value={role}
          placeholder="Все роли"
          expanded={open === "role"}
          onToggle={() => setOpen((o) => (o === "role" ? null : "role"))}
          onSelect={(v) => {
            setOpen(null);
            navigate({ role: v });
          }}
          aria-label="Фильтр по роли"
        />
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
      </Stack>
      <DataTable
        columns={["Email", "Роль", "Статус", "Регистрация", "Действия"]}
        rows={tableRows}
        empty="Пользователи не найдены"
      />
    </Section>
  );
}
