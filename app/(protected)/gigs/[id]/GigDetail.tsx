/* @composed-screen */
"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/app/components/layout/Section";
import { Split } from "@/app/components/layout/Split";
import { Grid } from "@/app/components/layout/Grid";
import { Stack } from "@/app/components/layout/Stack";
import { Button } from "@/app/components/primitives";
import {
  GigHeader,
  SectionHeader,
  RequirementCard,
  CriteriaList,
  Bio,
  ConditionsPanel,
  ApplyPanel,
  ChatPanel,
  Notice,
} from "@/app/components/blocks";
import {
  applyToGig,
  withdrawApplication,
  submitWork,
  approveWork,
  markAsPaid,
  sendMessage,
} from "@/app/actions/gig";
import type { GigDetailData } from "@/lib/view-models";

// The server actions all follow the useActionState convention `(prevState, formData) => state`; this wrapper fixes the
// state typing (so `state?.error` is typed) and contains the cast in one place.
type ActionState = { error?: string } | null;
function useAction(fn: unknown) {
  return useActionState<ActionState, FormData>(fn as never, null);
}

/** SPECIALIST apply — ApplyPanel wired to applyToGig (its fields carry approach/questions/estimatedEffort). */
function ApplyAction({ gigId, vm }: { gigId: string; vm: GigDetailData["apply"] }) {
  const [state, action] = useAction(applyToGig);
  return (
    <form action={action}>
      <input type="hidden" name="gigId" value={gigId} />
      <ApplyPanel vm={vm} />
      {state?.error && <Notice tone="error">{state.error}</Notice>}
    </form>
  );
}

function WithdrawAction({ applicationId }: { applicationId: string }) {
  const [state, action] = useAction(withdrawApplication);
  return (
    <Stack gap={2}>
      <Notice tone="warning">Передумали? Вы можете отозвать отклик.</Notice>
      {state?.error && <Notice tone="error">{state.error}</Notice>}
      <form action={action}>
        <input type="hidden" name="applicationId" value={applicationId} />
        <Button type="submit" variant="secondary">
          Отозвать отклик
        </Button>
      </form>
    </Stack>
  );
}

/** Single-button gig action (submit-work / approve-work / mark-as-paid) — all take a hidden gigId. */
function GigAction({ gigId, action: act, label }: { gigId: string; action: unknown; label: string }) {
  const [state, action] = useAction(act);
  return (
    <form action={action}>
      <Stack gap={2}>
        <input type="hidden" name="gigId" value={gigId} />
        <Button type="submit" variant="primary">
          {label}
        </Button>
        {state?.error && <Notice tone="error">{state.error}</Notice>}
      </Stack>
    </form>
  );
}

/** Messaging — the real thread (ChatPanel) + its composer (name="content" + submit) wired to sendMessage. */
function MessageChat({ gigId, chat }: { gigId: string; chat: GigDetailData["chat"] }) {
  const [state, action] = useAction(sendMessage);
  return (
    <form action={action}>
      <Stack gap={2}>
        <input type="hidden" name="gigId" value={gigId} />
        <ChatPanel vm={chat} />
        {state?.error && <Notice tone="error">{state.error}</Notice>}
      </Stack>
    </form>
  );
}

/**
 * Gig detail — reconciled to the `gigly_full_design` prototype gigDetail route (reconcile-gig-detail-apply). A 2-column
 * composition inside the layout's AppShell: **col1** = the `main` GigHeader (title + tags + description) over the
 * «Технические требования» (2-col RequirementCard grid) and «Критерии успеха» (numbered CriteriaList) sections — NO
 * files section (the prototype has none). **col2 «УСЛОВИЯ»** = the company Bio + the ConditionsPanel (grotesk
 * срок/бюджет + the company fee breakdown) + the role action rail (apply/withdraw, owner applications + accept/reject,
 * lifecycle submit/approve/pay, open-dispute) + the «Сообщения» chat + the admin moderation history. Template +
 * slotted blocks + data only — no className/style; arranged via layout primitives. The (unchanged) server actions are
 * wired via useActionState + <form action>. NOTE: a «Вернуть на доработку» (REVIEW→IN_PROGRESS) action appears in the
 * prototype owner action set but has no coded server action yet — flagged for a follow-up (no lifecycle invented here).
 */
export function GigDetail({ data }: { data: GigDetailData }) {
  const router = useRouter();
  const [tab, setTab] = useState<"client" | "proposed">("client");
  const va = data.viewerApplication;
  const specialistViewer = !data.isOwner && !data.isAssignedSpecialist;

  return (
    <Section gap={6}>
      {data.isExample && <Notice tone="info">Это пример гига. Откликаться на примеры нельзя.</Notice>}
      {data.closedByAdmin && (
        <Notice tone="error">Гиг закрыт администрацией{data.closedAt ? ` · ${data.closedAt}` : ""}.</Notice>
      )}
      {data.paidAt && <Notice tone="success">Оплата подтверждена · {data.paidAt}</Notice>}

      <Split ratio="2:1">
        {/* col1 — main + Технические требования + Критерии успеха (no files section) */}
        <Stack gap={6}>
          <GigHeader vm={data.header} />

          {data.requirements.length > 0 && (
            <Stack gap={4}>
              <SectionHeader vm={{ title: "Технические требования", count: data.requirements.length }} />
              <Grid columns={2} gap={4}>
                {data.requirements.map((r, i) => (
                  <RequirementCard key={i} vm={r} />
                ))}
              </Grid>
            </Stack>
          )}

          <Stack gap={4}>
            <SectionHeader vm={{ title: "Критерии успеха", count: data.criteria.items.length }} />
            <CriteriaList vm={data.criteria} />
          </Stack>
        </Stack>

        {/* col2 «УСЛОВИЯ» — bio + conditions panel + the role action rail + messaging */}
        <Stack gap={6}>
          <Bio vm={data.bio} />
          <ConditionsPanel vm={data.conditions} active={tab} onSelect={(t) => setTab(t as "client" | "proposed")} />

          {/* SPECIALIST apply + states */}
          {data.lifecycle.canApply && <ApplyAction gigId={data.gigId} vm={data.apply} />}
          {va?.status === "PENDING" && <WithdrawAction applicationId={va.id} />}
          {va?.status === "WITHDRAWN" && <Notice tone="muted">Ваш отклик отозван.</Notice>}
          {va?.status === "REJECTED" && <Notice tone="error">Ваш отклик отклонён.</Notice>}
          {specialistViewer && !va && !data.isExample && !data.lifecycle.canApply && data.status !== "OPEN" && (
            <Notice tone="muted">Гиг больше не принимает отклики.</Notice>
          )}

          {/* Assigned specialist + owner lifecycle */}
          {data.lifecycle.canSubmit && <GigAction gigId={data.gigId} action={submitWork} label="Отправить работу" />}
          {data.lifecycle.canApprove && <GigAction gigId={data.gigId} action={approveWork} label="Принять работу" />}
          {data.lifecycle.canPay && <GigAction gigId={data.gigId} action={markAsPaid} label="Отметить оплаченным" />}

          {/* Owner — link to the dedicated «Отклики» screen (build-applications-screen) */}
          {data.isOwner && (
            <Button type="button" variant="primary" onClick={() => router.push(`/gigs/${data.gigId}/applications`)}>
              Смотреть отклики ({data.applications.length})
            </Button>
          )}

          {/* Open-dispute entry — the «Открыть спор» link → the dedicated screen (reconcile-disputes-flow) */}
          {(data.isOwner || data.isAssignedSpecialist) && data.messaging.assigned && !data.isExample && (
            <Button type="button" variant="secondary" onClick={() => router.push(`/disputes/new?gig=${data.gigId}`)}>
              Открыть спор
            </Button>
          )}

          {/* Messaging */}
          {data.messaging.canView ? (
            <Stack gap={4}>
              <SectionHeader vm={{ title: "Сообщения" }} />
              {data.messaging.canSend ? <MessageChat gigId={data.gigId} chat={data.chat} /> : <ChatPanel vm={data.chat} />}
            </Stack>
          ) : (
            (data.isOwner || data.isAssignedSpecialist) && (
              <Notice tone="info">Сообщения станут доступны после назначения специалиста.</Notice>
            )
          )}

          {/* Admin moderation history */}
          {data.moderations.length > 0 && (
            <Stack gap={2}>
              {data.moderations.map((m) => (
                <Notice key={m.id} tone="muted">
                  {m.action}: {m.reason} — {m.by} · {m.at}
                </Notice>
              ))}
            </Stack>
          )}
        </Stack>
      </Split>
    </Section>
  );
}
