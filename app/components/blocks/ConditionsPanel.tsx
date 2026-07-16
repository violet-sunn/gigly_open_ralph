import { Tabs, StatusBadge } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import type { ConditionsPanelVM, ConditionsTermsVM } from "./view-models";
import { NOT_PROPOSED } from "@/lib/terms-display";
import { SERVICE_FEE_PCT_LABEL } from "@/lib/pricing";

interface ConditionsPanelProps {
  vm: ConditionsPanelVM;
  /** Which terms tab is shown — `client` = «Условия {company}» (the prototype default) · `proposed` = «Мои условия». */
  active?: "client" | "proposed";
  onSelect?: (tab: string) => void;
}

/**
 * ConditionsPanel block (DESIGN_SYSTEM_SPEC §3.2) — the prototype gig-detail «УСЛОВИЯ» sunken panel
 * (Gigly App.dc.html gigDetail col2): the two-tab toggle («Условия {company}» / «Мои условия») over a Статус row and
 * the Срок выполнения / Бюджет проекта figures as large `grotesk` (Manrope) numerics with the «[N этап]» / «фикс.
 * цена» sublabels; the company viewer additionally sees the Сервисный сбор ({SERVICE_FEE_PCT_LABEL}) / Итого к оплате breakdown (`fee`).
 * Controlled (active/onSelect) like TermsTabs. Composed from primitives + layout + tokens. Token-pure.
 */
export function ConditionsPanel({ vm, active = "client", onSelect }: ConditionsPanelProps) {
  const terms: ConditionsTermsVM = active === "proposed" ? vm.proposed : vm.client;
  const deadline = terms.deadline ?? NOT_PROPOSED;
  const budget = terms.budget ?? NOT_PROPOSED;
  return (
    <Stack gap={4}>
      <Tabs
        active={active}
        onSelect={onSelect}
        tabs={[
          { value: "client", label: `Условия ${vm.company}` },
          { value: "proposed", label: "Мои условия" },
        ]}
      />

      <Stack axis="row" gap={2} align="center">
        <span className="text-mono font-mono text-subtle">Статус</span>
        <StatusBadge variant="inline-dot" status={vm.status.tone}>
          {vm.status.label}
        </StatusBadge>
      </Stack>

      <Stack gap={1}>
        <span className="text-mono font-mono text-strong">Срок выполнения</span>
        <Stack axis="row" gap={2} align="end" justify="between">
          <span className="text-display font-grotesk text-strong">{deadline}</span>
          {vm.deadlineNote && <span className="text-caption font-mono text-muted">{vm.deadlineNote}</span>}
        </Stack>
      </Stack>

      <Stack gap={1}>
        <span className="text-mono font-mono text-strong">Бюджет проекта</span>
        <Stack axis="row" gap={2} align="end" justify="between">
          <span className="text-display font-grotesk text-strong">{budget}</span>
          {vm.budgetNote && <span className="text-caption font-mono text-muted">{vm.budgetNote}</span>}
        </Stack>
        {vm.fee && (
          <Stack gap={1}>
            <Stack axis="row" gap={2} justify="between">
              <span className="text-caption font-mono text-muted">Сервисный сбор ({SERVICE_FEE_PCT_LABEL})</span>
              <span className="text-caption font-mono text-muted">{vm.fee.service}</span>
            </Stack>
            <Stack axis="row" gap={2} justify="between">
              <span className="text-caption font-mono text-strong">Итого к оплате</span>
              <span className="text-caption font-mono text-strong">{vm.fee.total}</span>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
