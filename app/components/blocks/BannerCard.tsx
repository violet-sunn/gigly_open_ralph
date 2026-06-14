import { Button } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import type { BannerCardVM } from "./view-models";

/**
 * BannerCard block (DESIGN_SYSTEM_SPEC §3.2) — headline (type/display) + body + CTA Button + art slot.
 * The cosmic raster `art` is a residual (DESIGN_SPECS §7.2): rendered as the exported ImageRef when
 * provided, else a token glow placeholder (bg-brand-glow). NOT redrawn — the real raster comes from
 * Figma. Token-pure.
 */
export function BannerCard({ vm }: { vm: BannerCardVM }) {
  return (
    <Panel surface={2} radius="lg" padding={8} className="relative overflow-hidden">
      {vm.art ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={vm.art} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-brand-glow" />
      )}
      <Stack gap={4} className="relative">
        <span className="text-display font-display text-strong">{vm.headline}</span>
        {vm.body && <span className="text-body font-body text-muted">{vm.body}</span>}
        {vm.cta && <Button variant="primary">{vm.cta.label}</Button>}
      </Stack>
    </Panel>
  );
}
