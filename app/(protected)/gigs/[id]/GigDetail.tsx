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
  RequirementCard,
  CriteriaList,
  ClientCard,
  TermsTabs,
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
 * Gig detail — composed purely from the kit (compose-gig-detail-apply, Phase 2). Renders inside the layout's AppShell.
 * Template + slotted blocks + data only — no styling/className/style; arranged via layout primitives. Wires the
 * (unchanged) server actions via useActionState + <form action>. Multi-role: the SPECIALIST apply/withdraw view (the
 * design mock), the owner's applications + accept/reject + lifecycle (submit/approve/pay), gig-scoped messaging, and the
 * admin moderation history — all preserved.
 */
export function GigDetail({ data }: { data: GigDetailData }) {
  const [tab, setTab] = useState<"proposed" | "client">("proposed");
  const va = data.viewerApplication;
  const specialistViewer = !data.isOwner && !data.isAssignedSpecialist;

  return (
    <Section gap={6}>
      <GigHeader vm={data.header} />

      {data.isExample && <Notice tone="info">Это пример гига. Откликаться на примеры нельзя.</Notice>}
      {data.closedByAdmin && (
        <Notice tone="error">Гиг закрыт администрацией{data.closedAt ? ` · ${data.closedAt}` : ""}.</Notice>
      )}
      {data.paidAt && <Notice tone="success">Оплата подтверждена · {data.paidAt}</Notice>}

      <Split ratio="2:1">
        <Stack gap={6}>
          {data.requirements.length > 0 && (
            <Grid columns={2} gap={4}>
              {data.requirements.map((r, i) => (
                <RequirementCard key={i} vm={r} />
              ))}
            </Grid>
          )}

          <CriteriaList vm={data.criteria} />

          <TermsTabs vm={data.terms} active={tab} onSelect={(t) => setTab(t as "proposed" | "client")} />

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

          {/* Messaging */}
          {data.messaging.canView ? (
            data.messaging.canSend ? (
              <MessageChat gigId={data.gigId} chat={data.chat} />
            ) : (
              <ChatPanel vm={data.chat} />
            )
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

          {/* Open-dispute entry — participant (owner or assigned specialist), once a specialist is assigned */}
          {(data.isOwner || data.isAssignedSpecialist) && data.messaging.assigned && !data.isExample && (
            <OpenDisputeAction gigId={data.gigId} />
          )}
        </Stack>

        <Stack gap={6}>
          <ClientCard vm={data.client} />
        </Stack>
      </Split>
    </Section>
  );
}
