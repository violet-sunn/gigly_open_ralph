import { Tabs } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import type { TermsTabsVM, TermRow } from "./view-models";

interface TermsTabsProps {
  vm: TermsTabsVM;
  active?: "proposed" | "client";
  onSelect?: (tab: string) => void;
}

/**
 * TermsTabs block (DESIGN_SYSTEM_SPEC §3.2) — {proposed, client} via Tabs + structured term rows.
 * Controlled (active/onSelect). Composed from the Tabs primitive + layout primitives + tokens.
 */
export function TermsTabs({ vm, active = "proposed", onSelect }: TermsTabsProps) {
  const rows: TermRow[] = active === "client" ? vm.client : vm.proposed;
  return (
    <Stack gap={4}>
      <Tabs
        active={active}
        onSelect={onSelect}
        tabs={[
          { value: "proposed", label: "Предложено" },
          { value: "client", label: "От заказчика" },
        ]}
      />
      <Stack gap={2}>
        {rows.map((r, i) => (
          <Stack key={i} axis="row" gap={2} justify="between">
            <span className="text-label font-label text-muted">{r.label}</span>
            <span className="text-label font-label text-strong">{r.value}</span>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
