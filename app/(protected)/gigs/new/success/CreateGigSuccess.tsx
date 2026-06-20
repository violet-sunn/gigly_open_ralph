/* @composed-screen */
"use client";

import { useRouter } from "next/navigation";
import { Section } from "@/app/components/layout/Section";
import { Stack } from "@/app/components/layout/Stack";
import { Button } from "@/app/components/primitives";
import { SectionHeader, Notice } from "@/app/components/blocks";

/**
 * CreateGigSuccess — the «Гиг опубликован» success screen (reconcile-create-gig). Shown after `createGig` redirects
 * here on a successful publish. Renders inside AppShell: the confirmation + «К моим гигам» (→ /my-gigs) and «Создать
 * ещё» (→ /gigs/new). Template + slotted blocks/primitives + data only — no className/style.
 */
export function CreateGigSuccess() {
  const router = useRouter();
  return (
    <Section gap={6}>
      <SectionHeader vm={{ title: "Гиг опубликован" }} />
      <Notice tone="success">Специалисты увидят его в поиске. Отклики придут в раздел «Мои гиги».</Notice>
      <Stack axis="row" gap={3}>
        <Button type="button" variant="primary" onClick={() => router.push("/my-gigs")}>
          К моим гигам
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/gigs/new")}>
          Создать ещё
        </Button>
      </Stack>
    </Section>
  );
}
