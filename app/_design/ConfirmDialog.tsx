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
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
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
            onClick={onConfirm}
            style={{ flex: 1, height: 44, border: "none", borderRadius: 9, background: danger ? "#ef4444" : "var(--om-accent, #0088ff)", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
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
