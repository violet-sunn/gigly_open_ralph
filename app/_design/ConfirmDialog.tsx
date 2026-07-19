"use client";

// Destructive-confirm dialog transported from the prototype's `confirm.destructive` overlay (Gigly App.dc.html): a
// centred modal over a dimmed surface — title + body naming the target + «Отмена» (secondary) + a red confirm button.
// `ConfirmAction` wraps a server-action form behind the dialog so the action fires only on confirm (used by the admin
// console + the /admin/users · /admin/gigs tables for block/close). The dialog itself is reusable across the app.

import { useRef, useState } from "react";
import { useActionState } from "react";
import "@/app/_design/tokens.css";

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  cancelLabel = "Отмена",
  danger = true,
  confirmDisabled = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  /** When true the confirm button is inert (e.g. a delete blocked by a guard — the reason is shown in `body`). */
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      onClick={onCancel}
      style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ width: 400, maxWidth: "100%", borderRadius: 14, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-10)", padding: 24, display: "flex", flexDirection: "column", gap: 12 }}
      >
        <h3 style={{ margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 19, color: "var(--text-1)" }}>{title}</h3>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "19px", color: "var(--text-3)" }}>{body}</span>
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{ flex: 1, height: 44, border: "none", borderRadius: 9, background: "var(--surface-secondary)", color: "var(--text-2)", fontSize: 14, cursor: "pointer" }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={confirmDisabled}
            onClick={onConfirm}
            style={{ flex: 1, height: 44, border: "none", borderRadius: 9, background: confirmDisabled ? "var(--surface-secondary)" : danger ? "#ef4444" : "var(--om-accent, #0088ff)", color: confirmDisabled ? "var(--text-4)" : "#fff", fontSize: 14, fontWeight: 500, cursor: confirmDisabled ? "not-allowed" : "pointer" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmAction({
  action,
  hidden,
  buttonLabel,
  buttonStyle,
  title,
  body,
  confirmLabel,
  danger = true,
}: {
  action: unknown;
  hidden: Record<string, string>;
  buttonLabel: string;
  buttonStyle: React.CSSProperties;
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
}) {
  const [, formAction] = useActionState(action as never, null);
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} style={buttonStyle}>
        {buttonLabel}
      </button>
      <form ref={formRef} action={formAction as never} style={{ display: "none" }}>
        {Object.entries(hidden).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
      </form>
      {open && (
        <ConfirmDialog
          title={title}
          body={body}
          confirmLabel={confirmLabel}
          danger={danger}
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            setOpen(false);
            formRef.current?.requestSubmit();
          }}
        />
      )}
    </>
  );
}

// A destructive confirm that fetches a blast-radius PREVIEW when opened (how many dependents the delete will purge) and
// refuses to confirm when the entity is guarded. Used by /admin for the hard `deleteGig` / `deleteUser` actions —
// unlike `ConfirmAction` the body isn't static, it's the live impact. `loadImpact`/`deleteAction` are server actions;
// `formatBody`/`blockReason` are client fns supplied by the (client) admin tables, so passing them here is client→client.
export function DeletePreviewAction<TImpact>({
  id,
  hiddenKey,
  deleteAction,
  loadImpact,
  reason,
  title,
  buttonLabel = "Удалить",
  confirmLabel = "Удалить",
  formatBody,
  blockReason,
  disabledUpfront,
}: {
  id: string;
  hiddenKey: "gigId" | "userId";
  deleteAction: unknown;
  loadImpact: (id: string) => Promise<TImpact | null>;
  reason: string;
  title: string;
  buttonLabel?: string;
  confirmLabel?: string;
  /** Human sentence describing what will be purged, from the fetched impact. */
  formatBody: (impact: TImpact) => string;
  /** Non-null → the entity is guarded: shown in the dialog and the confirm is disabled. */
  blockReason: (impact: TImpact) => string | null;
  /** Non-null → the button is disabled without even opening (cheap, row-known guards: admin row / self). */
  disabledUpfront?: string | null;
}) {
  const [, formAction] = useActionState(deleteAction as never, null);
  const [open, setOpen] = useState(false);
  const [impact, setImpact] = useState<TImpact | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const redBtn: React.CSSProperties = {
    flex: "none",
    height: 32,
    padding: "0 14px",
    border: "none",
    borderRadius: 7,
    background: disabledUpfront ? "var(--surface-secondary)" : "rgba(239,68,68,0.14)",
    color: disabledUpfront ? "var(--text-4)" : "#ef4444",
    fontSize: 12,
    cursor: disabledUpfront ? "not-allowed" : "pointer",
  };

  const openDialog = async () => {
    setOpen(true);
    setLoading(true);
    setImpact(null);
    try {
      setImpact(await loadImpact(id));
    } finally {
      setLoading(false);
    }
  };

  const blocked = impact ? blockReason(impact) : null;
  const body = loading
    ? "Загрузка сведений об удалении…"
    : impact === null
      ? "Не удалось загрузить сведения. Обновите страницу и попробуйте снова."
      : blocked
        ? blocked
        : formatBody(impact);

  return (
    <>
      <button
        type="button"
        disabled={!!disabledUpfront}
        title={disabledUpfront ?? undefined}
        onClick={openDialog}
        style={redBtn}
      >
        {buttonLabel}
      </button>
      <form ref={formRef} action={formAction as never} style={{ display: "none" }}>
        <input type="hidden" name={hiddenKey} value={id} />
        <input type="hidden" name="reason" value={reason} />
      </form>
      {open && (
        <ConfirmDialog
          title={title}
          body={body}
          confirmLabel={confirmLabel}
          danger
          confirmDisabled={loading || impact === null || blocked !== null}
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            setOpen(false);
            formRef.current?.requestSubmit();
          }}
        />
      )}
    </>
  );
}
