/* @composed-screen */
import { Section } from "@/app/components/layout/Section";
import { DisputeList } from "@/app/components/blocks";
import type { DisputesData } from "@/lib/view-models";

/**
 * Disputes — the /disputes list screen, composed purely from the kit (compose-disputes, Phase 2). Renders inside the
 * layout's AppShell. Template + slotted block + data only — no styling/className/style; arranged via layout primitives.
 * Read-only: the scoped DisputeList (its empty state lives in the block). An ADMIN sees all disputes; a participant sees
 * only their own (scoping is done in getDisputes). No Споры mock exists → F1 flagged-missing (composed from blocks, F5
 * enforced).
 */
export function Disputes({ disputes }: DisputesData) {
  return (
    <Section title="Споры" gap={6}>
      <DisputeList vm={disputes} />
    </Section>
  );
}
