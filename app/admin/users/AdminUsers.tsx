"use client";

// /admin/users — the full paginated user management, transported to the console's row vocabulary (dashboard.admin has
// no own table screen; its «Пользователи» rows ARE the target). Role/status filters (token selects → URL params) +
// console-style rows (avatar · email · role·registration · status · block-via-confirm / unblock) over the kept
// suspendUser/unsuspendUser actions. Pagination + count live in the page.

import { useActionState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { suspendUser, unsuspendUser } from "@/app/actions/moderation";
import type { AdminUserRow } from "@/lib/view-models";
import { ConfirmAction } from "@/app/_design/ConfirmDialog";
import { cardBase, h2, rowBase, smallBtn, StatusDot, Avatar, FilterSelect } from "../_parts";
import "@/app/_design/tokens.css";

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

function UserAction({ id, name, suspended }: { id: string; name: string; suspended: boolean }) {
  const [, unsuspend] = useActionState(unsuspendUser as never, null);
  if (suspended) {
    return (
      <form action={unsuspend as never}>
        <input type="hidden" name="userId" value={id} />
        <input type="hidden" name="reason" value="Модерация" />
        <button type="submit" style={smallBtn("var(--surface-secondary)", "var(--text-2)")}>Разблокировать</button>
      </form>
    );
  }
  return (
    <ConfirmAction
      action={suspendUser}
      hidden={{ userId: id, reason: "Модерация" }}
      buttonLabel="Заблокировать"
      buttonStyle={smallBtn("rgba(239,68,68,0.14)", "#ef4444")}
      title="Заблокировать пользователя?"
      body={`«${name}» не сможет войти на платформу. Действие обратимо.`}
      confirmLabel="Заблокировать"
    />
  );
}

export function AdminUsers({ rows }: { rows: AdminUserRow[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const role = params.get("role") ?? "";
  const status = params.get("status") ?? "";

  const navigate = (next: { role?: string; status?: string }) => {
    const sp = new URLSearchParams();
    const r = next.role ?? role;
    const s = next.status ?? status;
    if (r) sp.set("role", r);
    if (s) sp.set("status", s);
    router.push(`/admin/users${sp.toString() ? `?${sp}` : ""}`);
  };

  return (
    <div style={cardBase}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <h2 style={h2}>Пользователи</h2>
        <span style={{ flex: 1 }} />
        <FilterSelect value={role} options={ROLE_OPTIONS} ariaLabel="Фильтр по роли" onChange={(v) => navigate({ role: v })} />
        <FilterSelect value={status} options={STATUS_OPTIONS} ariaLabel="Фильтр по статусу" onChange={(v) => navigate({ status: v })} />
      </div>
      {rows.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map((u) => (
            <div key={u.id} data-row="user" style={rowBase}>
              <Avatar name={u.email} />
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Moderation needs the person behind the row: without this the console could ban an account but never
                    look at it. ADMIN rows stay plain text — admins have no public profile, so a link would dead-end. */}
                {u.role === "ADMIN" ? (
                  <span style={{ fontSize: 14, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</span>
                ) : (
                  <Link
                    href={`/profile/${u.id}`}
                    title="Открыть профиль"
                    style={{ fontSize: 14, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textDecoration: "underline", textDecorationColor: "var(--hairline-12)" }}
                  >
                    {u.email}
                  </Link>
                )}
                <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>{u.role} · {u.registered}</span>
              </div>
              <StatusDot color={u.suspended ? "#ef4444" : "#34c759"} label={u.suspended ? "Заблокирован" : "Активен"} />
              <UserAction id={u.id} name={u.email} suspended={u.suspended} />
            </div>
          ))}
        </div>
      ) : (
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-3)" }}>Пользователи не найдены.</span>
      )}
    </div>
  );
}
