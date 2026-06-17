import { Toggle } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";

export interface ToggleItem {
  key: string;
  label: string;
  checked: boolean;
}

/**
 * ToggleList block (compose-settings gap fill, DESIGN_SYSTEM_SPEC §3.2) — a labelled toggle list: one row per item
 * (label + a Toggle), controlled via `{ items, onToggle }`. Composed from the Toggle primitive + layout primitives +
 * tokens (the Toggle is library-faithful; the block only arranges labelled rows). Token-pure.
 */
export function ToggleList({
  items,
  onToggle,
}: {
  items: ToggleItem[];
  onToggle: (key: string) => void;
}) {
  return (
    <Panel surface={1} radius="lg" padding={6}>
      <Stack gap={4}>
        {items.map((it) => (
          <Stack key={it.key} axis="row" gap={4} align="center" justify="between">
            <span className="text-body font-body text-strong">{it.label}</span>
            <Toggle checked={it.checked} onChange={() => onToggle(it.key)} aria-label={it.label} />
          </Stack>
        ))}
      </Stack>
    </Panel>
  );
}
