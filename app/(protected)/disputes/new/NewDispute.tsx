/* @composed-screen */
"use client";

import { useActionState, useState } from "react";
import { Section } from "@/app/components/layout/Section";
import { Stack } from "@/app/components/layout/Stack";
import { Textarea, Button } from "@/app/components/primitives";
import { SectionHeader, CheckField, Notice } from "@/app/components/blocks";
import { openDispute } from "@/app/actions/dispute";

type ActionState = { error?: string } | null;

// The six DATA-MODEL dispute reasons (the CheckField options; the key === the enum value openDispute expects).
const REASON_OPTIONS = [
  "Оплата не поступила",
  "Результат не соответствует ТЗ",
  "Заказчик не выходит на связь",
  "Исполнитель не выходит на связь",
  "Просрочен срок выполнения",
  "Другое",
].map((r) => ({ key: r, label: r }));

/**
 * NewDispute — the «Открыть спор» screen (reconcile-disputes-flow, Phase 3; reconciled to the gigly_full_design
 * `disputeNew` prototype). Gig-scoped, participant-only (the page gates access). Renders inside the layout's AppShell:
 * a `SectionHeader` «Открыть спор» + the gig context, a reason `CheckField` (the 6 enum values) + a description
 * `Textarea`, wired to the (unchanged) `openDispute`. Template + slotted blocks/primitives + data only — no
 * className/style; the reason rides via a hidden input (the DisputeView/GigDetail pattern).
 */
export function NewDispute({ gigId, gigTitle }: { gigId: string; gigTitle: string }) {
  const [state, action] = useActionState<ActionState, FormData>(openDispute as never, null);
  const [reason, setReason] = useState(REASON_OPTIONS[0].key);

  return (
    <Section gap={6}>
      <Stack gap={2}>
        <SectionHeader vm={{ title: "Открыть спор" }} />
        <Notice tone="muted">по проекту «{gigTitle}»</Notice>
      </Stack>

      <form action={action}>
        <Stack gap={4}>
          <input type="hidden" name="gigId" value={gigId} />
          <input type="hidden" name="reason" value={reason} />

          <Stack gap={2}>
            <SectionHeader vm={{ title: "Причина" }} />
            <CheckField vm={{ options: REASON_OPTIONS, value: reason }} onChange={setReason} />
          </Stack>

          <Stack gap={2}>
            <SectionHeader vm={{ title: "Описание" }} />
            <Textarea name="description" placeholder="Опишите суть разногласия по гигу" />
          </Stack>

          <Button type="submit" variant="primary">
            Открыть спор
          </Button>
          {state?.error && <Notice tone="error">{state.error}</Notice>}
        </Stack>
      </form>
    </Section>
  );
}
