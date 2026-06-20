import { Logomark, AuthStepDots } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import type { AuthHeaderVM } from "./view-models";

/**
 * AuthHeader block (DESIGN_SYSTEM_SPEC §3.2) — the Figma auth-flow «HEADER» lockup that leads the
 * create-account/welcome nodes (3179:3179 / 3179:3863 / 3195:4564 / 3195:4282 / 3195:4704): an optional
 * Logomark → heading (`type/h1`) + subtitle (`type/body`, muted) → the AuthStepDots counter. Lets the composed
 * `/register` wizard stay composition-pure (no heading markup/className in the screen). Token-pure; composed
 * from primitives + layout + tokens.
 */
export function AuthHeader({ vm }: { vm: AuthHeaderVM }) {
  return (
    <Stack gap={4} align="center">
      {vm.showLogomark && <Logomark />}
      <Stack gap={1} align="center" className="text-center">
        <h1 className="text-h1 font-h1 text-strong">{vm.heading}</h1>
        {vm.subtitle && <p className="text-body font-body text-muted">{vm.subtitle}</p>}
      </Stack>
      <AuthStepDots count={vm.totalSteps} current={vm.step} />
    </Stack>
  );
}
