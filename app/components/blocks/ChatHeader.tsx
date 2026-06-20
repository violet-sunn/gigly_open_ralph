import { Bio } from "./Bio";
import type { ChatHeaderVM } from "./view-models";

/**
 * ChatHeader block (DESIGN_SYSTEM_SPEC §3.2) — the chat thread header. Adopts the `Bio` block (acc-bio): Avatar +
 * name + verify-patch + Rating + presence + the counterparty `Специальность` (add-bio-block). Maps the stable
 * `ChatHeaderVM` contract onto `BioVM`; token-pure (the styling lives in `Bio`). The `user` axis is driven by the
 * counterparty's role (reconcile-chats): a company counterparty collapses `Специальность`, a specialist shows it.
 */
export function ChatHeader({ vm }: { vm: ChatHeaderVM }) {
  return (
    <Bio
      vm={{
        avatar: vm.avatar,
        name: vm.name,
        verified: vm.verified,
        rating: vm.rating,
        presence: vm.presence,
        specialty: vm.specialty,
        sizeFor: "acc-bio",
        user: vm.counterparty === "company" ? "company" : "specialist",
      }}
    />
  );
}
