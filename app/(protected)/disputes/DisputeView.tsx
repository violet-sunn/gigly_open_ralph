/* @composed-screen */
"use client";

import { useActionState, useState } from "react";
import { Section } from "@/app/components/layout/Section";
import { Stack } from "@/app/components/layout/Stack";
import { Select } from "@/app/components/primitives";
import { DisputeDetail, ApplyPanel, CheckField, Notice } from "@/app/components/blocks";
import { resolveDispute } from "@/app/actions/dispute";
import type { DisputeDetailVM } from "@/app/components/blocks/view-models";

type ActionState = { error?: string } | null;

const STATUS_OPTIONS = [
  { value: "RESOLVED", label: "Удовлетворить" },
  { value: "REJECTED", label: "Отклонить" },
];

// The moderator verdict (DATA-MODEL) — submitted as `verdict`; resolveDispute prefixes it onto the resolution.
const VERDICT_OPTIONS = [
  { key: "specialist", label: "В пользу специалиста" },
  { key: "company", label: "В пользу заказчика" },
  { key: "split_50", label: "Частичный возврат 50%" },
];

/**
 * Admin resolve view — the inline client wiring over the EXISTING `resolveDispute` action (no new action), reusing
 * ApplyPanel for the resolution note + the Select primitive for the outcome (carried via a hidden input). Mirrors the
 * GigDetail action-wiring pattern (F5: <form action> + hidden inputs + blocks/primitives only — no className/style).
 */
function ResolveAction({ disputeId }: { disputeId: string }) {
  const [state, action] = useActionState<ActionState, FormData>(resolveDispute as never, null);
  const [status, setStatus] = useState("RESOLVED");
  const [verdict, setVerdict] = useState("specialist");
  const [open, setOpen] = useState(false);
  return (
    <form action={action}>
      <Stack gap={3}>
        <input type="hidden" name="disputeId" value={disputeId} />
        <input type="hidden" name="status" value={status} />
        <input type="hidden" name="verdict" value={verdict} />
        <CheckField vm={{ options: VERDICT_OPTIONS, value: verdict }} onChange={setVerdict} />
        <Select
          options={STATUS_OPTIONS}
          value={status}
          expanded={open}
          onToggle={() => setOpen((o) => !o)}
          onSelect={(v) => {
            setStatus(v);
            setOpen(false);
          }}
          aria-label="Решение по спору"
        />
        <ApplyPanel
          vm={{
            fields: [
              {
                name: "resolution",
                label: "Комментарий",
                multiline: true,
                required: true,
                placeholder: "Опишите принятое решение по спору",
              },
            ],
            submitLabel: "Разрешить спор",
          }}
        />
        {state?.error && <Notice tone="error">{state.error}</Notice>}
      </Stack>
    </form>
  );
}

/**
 * DisputeView — the /disputes/[id] detail screen, composed purely from the kit (compose-disputes, Phase 2). Renders
 * inside the layout's AppShell. The DisputeDetail block (read-only: gig · status · opener · reason · resolution) plus,
 * for an ADMIN viewer on an OPEN dispute, the inline resolve action (wired to the unchanged `resolveDispute`).
 * Participants see read-only status with no resolve control. No Споры mock → F1 flagged-missing (F5 enforced).
 */
export function DisputeView({ dispute, isAdmin }: { dispute: DisputeDetailVM; isAdmin: boolean }) {
  const canResolve = isAdmin && dispute.status === "open";
  return (
    <Section title="Спор" gap={6}>
      <DisputeDetail vm={dispute} />
      {canResolve && <ResolveAction disputeId={dispute.id} />}
    </Section>
  );
}
