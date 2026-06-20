import type { ReactNode } from "react";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { SectionHeader } from "./SectionHeader";
import type { FeePanelVM } from "./view-models";

/**
 * FeePanel block (reconcile-create-gig, DESIGN_SYSTEM_SPEC §3.2) — the create-gig «Сводка (комиссия)» summary: Бюджет →
 * Сервисный сбор (10%) → Итого к оплате (brand), with an actions slot (`children`) for the «Опубликовать гиг» submit.
 * Figures arrive pre-formatted (the screen computes the live 10%). Composed from layout + tokens. Token-pure.
 */
export function FeePanel({ vm, children }: { vm: FeePanelVM; children?: ReactNode }) {
  return (
    <Panel surface={1} radius="lg" padding={6}>
      <Stack gap={3}>
        <SectionHeader vm={{ title: "Сводка (комиссия)" }} />
        <Stack axis="row" gap={2} align="center" justify="between">
          <span className="text-body font-body text-muted">Бюджет</span>
          <span className="text-label font-grotesk text-strong">{vm.budget}</span>
        </Stack>
        <Stack axis="row" gap={2} align="center" justify="between">
          <span className="text-body font-body text-muted">Сервисный сбор (10%)</span>
          <span className="text-label font-grotesk text-strong">{vm.fee}</span>
        </Stack>
        <Stack axis="row" gap={2} align="center" justify="between">
          <span className="text-label font-label text-strong">Итого к оплате</span>
          <span className="text-title font-grotesk text-brand-default">{vm.total}</span>
        </Stack>
        {children}
      </Stack>
    </Panel>
  );
}
