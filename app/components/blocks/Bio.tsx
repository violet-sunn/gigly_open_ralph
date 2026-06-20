import { Avatar, Rating, SpecialtyTag, Icon, ICON } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import { initials } from "./util";
import type { BioVM } from "./view-models";

/**
 * Bio block (DESIGN_SYSTEM_SPEC §3.2) — Figma `bio` (2931:2365) + `bio/message/COMPANY` (2931:2366) collapsed into
 * one block with a `user` axis. The identity row: Avatar + name + verify-patch (the exported `verified` asset, F4) +
 * Rating stars + the `Специальность` SpecialtyTag (specialists only) + an optional presence line. Variant axes:
 * `sizeFor` (acc-bio = larger thread/conditions header · gig = compact) and `user` (company omits `Специальность`).
 * Composed from primitives + layout + tokens. Token-pure.
 */
export function Bio({ vm }: { vm: BioVM }) {
  const accBio = (vm.sizeFor ?? "acc-bio") === "acc-bio";
  const showSpecialty = vm.user !== "company" && !!vm.specialty;
  return (
    <Stack axis="row" gap={3} align="center">
      <Avatar src={vm.avatar || undefined} initials={initials(vm.name)} size={accBio ? "lg" : "sm"} online={vm.rating?.online} />
      <Stack gap={1}>
        <Stack axis="row" gap={2} align="center">
          <span className={accBio ? "text-title font-title text-strong" : "text-label font-label text-strong"}>{vm.name}</span>
          {vm.verified && <Icon src={ICON.verified} alt="Подтверждён" />}
          {showSpecialty && <SpecialtyTag size={accBio ? "S" : "XS"}>{vm.specialty}</SpecialtyTag>}
        </Stack>
        {vm.rating && <Rating value={vm.rating.value} count={vm.rating.count} verified={false} />}
        {vm.presence && <span className="text-caption font-caption text-muted">{vm.presence}</span>}
      </Stack>
    </Stack>
  );
}
