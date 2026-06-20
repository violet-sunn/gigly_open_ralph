import { Button, ProgressBar } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import type { OnboardingCardVM } from "./view-models";

/**
 * OnboardingCard block (DESIGN_SYSTEM_SPEC §3.2) — Figma welcome "pic" (3082:3820): a dashboard onboarding
 * tile with an `overlay/fill` scrim, an optional bleed image (residual — exported or omitted, not redrawn), a
 * `type/h3` title + `type/body` subtitle, an inline `ProgressBar`, and a secondary `Button`. Distinct from
 * `BannerCard`. Token-pure; composed from primitives + layout + tokens.
 */
export function OnboardingCard({ vm, onCta }: { vm: OnboardingCardVM; onCta?: () => void }) {
  return (
    <Panel surface={2} radius="lg" padding={6} className="relative overflow-hidden">
      {vm.art && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={vm.art} alt="" aria-hidden="true" className="absolute right-0 top-0 h-full object-cover mix-blend-color-dodge" />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-overlay-fill" />
      <Stack gap={4} className="relative">
        <Stack gap={2}>
          <span className="text-h2 font-h2 text-strong">{vm.title}</span>
          {vm.subtitle && <span className="text-body font-body text-muted">{vm.subtitle}</span>}
        </Stack>
        <ProgressBar value={vm.progress} aria-label={vm.title} />
        <Button variant="secondary" onClick={onCta}>
          {vm.cta.label}
        </Button>
      </Stack>
    </Panel>
  );
}
