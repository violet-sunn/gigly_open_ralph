import { Icon, ICON } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import type { RequirementCardVM } from "./view-models";

/**
 * RequirementCard block (DESIGN_SYSTEM_SPEC §3.2) — Figma `требование` tile (2932:7177): a frame-stroke
 * hairline tile at radius/md, a justify-between column with a minimum height, an 18px (sans) title and a
 * muted description. View-model unchanged (GigDetail.tsx unaffected). Token-pure.
 */
export function RequirementCard({ vm }: { vm: RequirementCardVM }) {
  const iconSrc = vm.icon ? (ICON as Record<string, string>)[vm.icon] ?? vm.icon : undefined;
  return (
    <div className="flex h-full flex-col justify-between gap-3 rounded-md border border-overlay-line-strong p-3">
      <Stack axis="row" gap={2} align="center">
        {iconSrc && <Icon src={iconSrc} />}
        <span className="text-h2 font-h2 text-strong">{vm.title}</span>
      </Stack>
      <span className="text-body font-body text-muted">{vm.body}</span>
    </div>
  );
}
