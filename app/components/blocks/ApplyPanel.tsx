import { Input, Button } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import type { ApplyPanelVM } from "./view-models";

interface ApplyPanelProps {
  vm: ApplyPanelVM;
  onSubmit?: () => void;
}

/**
 * ApplyPanel block (DESIGN_SYSTEM_SPEC §3.2) — Input(s) + Button + structured fields.
 * Multiline fields use a token-styled textarea (shares the Input visual). Token-pure.
 */
export function ApplyPanel({ vm, onSubmit }: ApplyPanelProps) {
  return (
    <Panel surface={2} radius="lg" padding={6}>
      <Stack gap={4}>
        {vm.fields.map((f) => (
          <Stack key={f.name} gap={2}>
            <label htmlFor={f.name} className="text-label font-label text-strong">
              {f.label}
              {f.required && <span className="text-status-rejected"> *</span>}
            </label>
            {f.multiline ? (
              <textarea
                id={f.name}
                name={f.name}
                rows={4}
                placeholder={f.placeholder}
                defaultValue={f.value}
                className="w-full rounded-md border border-border bg-surface-level-2 px-3 py-2 text-body font-body text-strong placeholder:text-muted focus-visible:border-brand-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default"
              />
            ) : (
              <Input id={f.name} name={f.name} placeholder={f.placeholder} defaultValue={f.value} />
            )}
          </Stack>
        ))}
        <Button type="submit" variant="primary" onClick={onSubmit}>
          {vm.submitLabel}
        </Button>
      </Stack>
    </Panel>
  );
}
