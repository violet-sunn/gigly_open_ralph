/* @composed-screen */
"use client";

import { useActionState, useState } from "react";
import { Section } from "@/app/components/layout/Section";
import { Split } from "@/app/components/layout/Split";
import { Grid } from "@/app/components/layout/Grid";
import { Stack } from "@/app/components/layout/Stack";
import { Button, StatusBadge } from "@/app/components/primitives";
import {
  GigHeader,
  SectionHeader,
  RequirementCard,
  CriteriaList,
  Bio,
  ConditionsPanel,
  ApplyPanel,
  ChatPanel,
  ProfileCard,
  Notice,
} from "@/app/components/blocks";
import {
  applyToGig,
  withdrawApplication,
  acceptApplication,
  rejectApplication,
  submitWork,
  approveWork,
  markAsPaid,
  sendMessage,
} from "@/app/actions/gig";
import { openDispute } from "@/app/actions/dispute";
import type { GigDetailData, GigDetailApplication } from "@/lib/view-models";
import type { Status } from "@/app/components/blocks/view-models";

// The server actions all follow the useActionState convention `(prevState, formData) => state`; this wrapper fixes the
// state typing (so `state?.error` is typed) and contains the cast in one place.
type ActionState = { error?: string } | null;
function useAction(fn: unknown) {
  return useActionState<ActionState, FormData>(fn as never, null);
}

const APP_STATUS: Record<string, { label: string; status: Status }> = {
  PENDING: { label: "На рассмотрении", status: "review" },
  ACCEPTED: { label: "Принята", status: "completed" },
  REJECTED: { label: "Отклонена", status: "rejected" },
  WITHDRAWN: { label: "Отозвана", status: "rejected" },
};

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

function AcceptRejectActions({ applicationId }: { applicationId: string }) {
  const [aState, aAction] = useAction(acceptApplication);
  const [rState, rAction] = useAction(rejectApplication);
  return (
    <Stack gap={2}>
      <Stack axis="row" gap={2}>
        <form action={aAction}>
          <input type="hidden" name="applicationId" value={applicationId} />
          <Button type="submit" variant="primary">
            Принять
          </Button>
        </form>
        <form action={rAction}>
          <input type="hidden" name="applicationId" value={applicationId} />
          <Button type="submit" variant="secondary">
            Отклонить
          </Button>
        </form>
      </Stack>
      {(aState?.error || rState?.error) && <Notice tone="error">{aState?.error || rState?.error}</Notice>}
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

/**
 * Open-dispute entry from a gig — inline client wiring over the EXISTING `openDispute` action (no new action), reusing
 * ApplyPanel for the required reason. Surfaced for a participant (owner or assigned specialist) once a specialist is
 * assigned; the action redirects back to the gig on success and validates participant/duplicate/example server-side.
 */
function OpenDisputeAction({ gigId }: { gigId: string }) {
  const [state, action] = useAction(openDispute);
  return (
    <form action={action}>
      <Stack gap={2}>
        <input type="hidden" name="gigId" value={gigId} />
        <ApplyPanel
          vm={{
            fields: [
              {
                name: "reason",
                label: "Открыть спор",
                multiline: true,
                required: true,
                placeholder: "Опишите суть разногласия по гигу",
              },
            ],
            submitLabel: "Открыть спор",
          }}
        />
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

/** Owner's view of one application — ProfileCard + structured fields (RequirementCard) + status + accept/reject. */
function ApplicationEntry({ app, gigStatus }: { app: GigDetailApplication; gigStatus: string }) {
  const s = APP_STATUS[app.status] ?? { label: app.status, status: "open" as Status };
  return (
    <Stack gap={3}>
      <Stack axis="row" gap={2} align="center" justify="between">
        <ProfileCard vm={{ avatar: "", name: app.name, roleTag: app.level, rating: app.rating }} />
        <StatusBadge variant="pill" status={s.status}>
          {s.label}
        </StatusBadge>
      </Stack>
      {app.approach && <RequirementCard vm={{ title: "Технический подход", body: app.approach }} />}
      {app.questions && <RequirementCard vm={{ title: "Уточняющие вопросы", body: app.questions }} />}
      {app.estimate && <RequirementCard vm={{ title: "Оценка трудозатрат", body: app.estimate }} />}
      {!app.approach && app.coverLetter && (
        <RequirementCard vm={{ title: "Сопроводительное письмо", body: app.coverLetter }} />
      )}
      {app.status === "PENDING" && gigStatus === "OPEN" && <AcceptRejectActions applicationId={app.id} />}
    </Stack>
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

          {/* Owner applications */}
          {data.isOwner && (
            <Stack gap={4}>
              <Notice tone="muted">Отклики: {data.applications.length}</Notice>
              {data.applications.map((app) => (
                <ApplicationEntry key={app.id} app={app} gigStatus={data.status} />
              ))}
            </Stack>
          )}

          {/* Open-dispute entry — participant (owner or assigned specialist), once a specialist is assigned */}
          {(data.isOwner || data.isAssignedSpecialist) && data.messaging.assigned && !data.isExample && (
            <OpenDisputeAction gigId={data.gigId} />
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
