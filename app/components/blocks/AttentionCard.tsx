import { Avatar } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { cx } from "@/app/components/layout/scale";
import { GigCard } from "./GigCard";
import type { AttentionCardVM, AttentionType } from "./view-models";

/**
 * Per-type token map — ONE source of truth (no per-variant copies). Each notification type drives the
 * marker fill, the left 4px accent, the ambient glow, and the CTA fill, all from its `attention/*` token.
 */
const ATTENTION: Record<AttentionType, { marker: string; accent: string; glow: string; cta: string }> = {
  "status-change": { marker: "bg-attention-status-change", accent: "border-l-attention-status-change", glow: "bg-attention-status-change-glow", cta: "bg-attention-status-change" },
  message: { marker: "bg-attention-message", accent: "border-l-attention-message", glow: "bg-attention-message-glow", cta: "bg-attention-message" },
  deadline: { marker: "bg-attention-deadline", accent: "border-l-attention-deadline", glow: "bg-attention-deadline-glow", cta: "bg-attention-deadline" },
  accepted: { marker: "bg-attention-accepted", accent: "border-l-attention-accepted", glow: "bg-attention-accepted-glow", cta: "bg-attention-accepted" },
  rejected: { marker: "bg-attention-rejected", accent: "border-l-attention-rejected", glow: "bg-attention-rejected-glow", cta: "bg-attention-rejected" },
  payment: { marker: "bg-attention-payment", accent: "border-l-attention-payment", glow: "bg-attention-payment-glow", cta: "bg-attention-payment" },
};

/**
 * AttentionCard block (DESIGN_SYSTEM_SPEC §3.2) — Figma `attention card` (3367:3916), data-driven by
 * notification `type`: the type accent (an `attention/*` token) drives marker + left inset accent + glow +
 * CTA fill, while the EMBEDDED block (a GigCard, or a message preview) keeps its own gig-status styling.
 * Token-pure; composed from primitives + layout + tokens.
 */
export function AttentionCard({ vm }: { vm: AttentionCardVM }) {
  const a = ATTENTION[vm.type];
  return (
    <Panel surface={2} radius="xl" padding={4} border className={cx("relative overflow-hidden border-l-4", a.accent)}>
      {/* ambient glow keyed to the type accent (token-based background-image) */}
      <div aria-hidden className={cx("pointer-events-none absolute inset-0 opacity-disabled", a.glow)} />
      <Stack gap={3} className="relative">
        <Stack axis="row" gap={3} align="center">
          <span
            aria-hidden
            className={cx("flex h-control w-control shrink-0 items-center justify-center rounded-md text-h2", a.marker)}
          >
            {vm.marker}
          </span>
          <span className="flex-1 text-title font-title text-strong">{vm.title}</span>
          <span className="text-caption font-caption text-subtle">{vm.date}</span>
        </Stack>

        {vm.embed.kind === "gig" ? (
          <GigCard vm={vm.embed.gig} />
        ) : (
          <Panel surface={3} radius="md" padding={3}>
            <Stack gap={2}>
              <Stack axis="row" gap={2} align="center" justify="between">
                <Stack axis="row" gap={2} align="center">
                  <Avatar size="sm" initials={vm.embed.name.slice(0, 1)} />
                  <span className="text-label font-label text-strong">{vm.embed.name}</span>
                </Stack>
                {vm.embed.unread > 0 && (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-default px-1 text-caption font-caption text-inverse">
                    {vm.embed.unread}
                  </span>
                )}
              </Stack>
              <span className="line-clamp-2 text-body font-body text-muted">{vm.embed.preview}</span>
            </Stack>
          </Panel>
        )}

        <button
          type="button"
          className={cx(
            "inline-flex h-control items-center justify-center rounded-md px-4 text-label font-label text-inverse",
            a.cta,
          )}
        >
          {vm.cta}
        </button>
      </Stack>
    </Panel>
  );
}
