import { ClientIcon, SpecialistIcon } from "@/lib/assets";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { cx } from "@/app/components/layout/scale";

export type Role = "CLIENT" | "SPECIALIST";

interface RoleCardsProps {
  /** The currently selected role (controlled). */
  value: Role | null;
  /** Selection handler. */
  onSelect: (role: Role) => void;
}

const ROLES: { role: Role; label: string; Icon: typeof ClientIcon }[] = [
  { role: "CLIENT", label: "Профиль Компании", Icon: ClientIcon },
  { role: "SPECIALIST", label: "Профиль специалиста", Icon: SpecialistIcon },
];

/**
 * RoleCards block (compose-auth-onboarding gap fill, DESIGN_SYSTEM_SPEC §3.2) — the onboarding role selector: two cards
 * («Профиль Компании» / «Профиль специалиста») with their role icon + label and a selected border state. A controlled
 * block (`{ value, onSelect }`) — mirrors the interactive-block pattern (FilterBar/Select). Replaces the legacy hex
 * RoleCard. Token-pure.
 */
export function RoleCards({ value, onSelect }: RoleCardsProps) {
  return (
    <Stack gap={3}>
      {ROLES.map(({ role, label, Icon }) => {
        const selected = value === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onSelect(role)}
            aria-pressed={selected}
            data-testid={`role-${role.toLowerCase()}`}
            className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default rounded-lg"
          >
            <Panel
              surface={2}
              radius="lg"
              padding={4}
              border
              className={cx(selected ? "border-brand-default" : "border-border")}
            >
              <Stack axis="row" gap={3} align="center">
                <Icon className={cx("h-8 w-8 shrink-0", selected ? "text-brand-default" : "text-muted")} />
                <span className="text-body font-body text-strong">{label}</span>
              </Stack>
            </Panel>
          </button>
        );
      })}
    </Stack>
  );
}
