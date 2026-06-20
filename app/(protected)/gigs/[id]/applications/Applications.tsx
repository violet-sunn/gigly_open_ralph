/* @composed-screen */
"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/app/components/layout/Section";
import { Stack } from "@/app/components/layout/Stack";
import { Button } from "@/app/components/primitives";
import { SectionHeader, ApplicantCard, Notice } from "@/app/components/blocks";
import { acceptApplication, rejectApplication } from "@/app/actions/gig";
import type { GigApplicationsData } from "@/lib/view-models";

type ActionState = { error?: string } | null;
function useAction(fn: unknown) {
  return useActionState<ActionState, FormData>(fn as never, null);
}

/** Принять / Отклонить over the EXISTING acceptApplication / rejectApplication (reused verbatim; both redirect to the gig). */
function AcceptReject({ applicationId }: { applicationId: string }) {
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

/**
 * Applications — the company «Отклики» screen (build-applications-screen, Phase 3; reconciled to the gigly_full_design
 * `applications` prototype). Gig-scoped, owner-only (the page gates access). Renders inside the layout's AppShell:
 * a «← Назад к проекту» link, a `SectionHeader` «Отклики» (count) + the «на проект «{title}»» subtitle, a derived
 * success notice when the gig is assigned, and the `ApplicantCard` list (Принять/Отклонить on pending applicants).
 * Template + slotted blocks + data only — no className/style; the (unchanged) accept/reject actions are inlined.
 */
export function Applications({ data }: { data: GigApplicationsData }) {
  const router = useRouter();
  return (
    <Section gap={6}>
      <Button type="button" variant="ghost" onClick={() => router.push(`/gigs/${data.gigId}`)}>
        ← Назад к проекту
      </Button>

      <Stack gap={2}>
        <SectionHeader vm={{ title: "Отклики", count: data.count }} />
        <Notice tone="muted">на проект «{data.title}»</Notice>
      </Stack>

      {data.assignedName && (
        <Notice tone="success">
          Назначен {data.assignedName} — гиг переходит «В работу». Остальные отклики отклонены автоматически.
        </Notice>
      )}

      {data.applicants.length > 0 ? (
        <Stack gap={4}>
          {data.applicants.map((a) => (
            <ApplicantCard key={a.id} vm={a}>
              {a.pending && !data.assignedName && <AcceptReject applicationId={a.id} />}
            </ApplicantCard>
          ))}
        </Stack>
      ) : (
        <Notice tone="muted">Откликов пока нет.</Notice>
      )}
    </Section>
  );
}
