import { Stack } from "@/app/components/layout/Stack";

interface CriteriaRowProps {
  index: number;
  title: string;
  description?: string;
}

/**
 * CriteriaRow item (DESIGN_SYSTEM_SPEC §3.2) — Figma `критерий` (2932:7224): a numbered left block in the
 * brand accent (on-accent digit) + title + optional description. The item `CriteriaList` maps over (not a
 * parallel list). Token-pure; composed from layout primitives + tokens.
 */
export function CriteriaRow({ index, title, description }: CriteriaRowProps) {
  return (
    <Stack axis="row" gap={3} align="stretch" className="overflow-hidden rounded-md border-y border-r border-brand-default">
      <span className="flex shrink-0 items-center justify-center self-stretch bg-brand-default px-2 text-mono font-mono text-surface-level-0">
        {index}
      </span>
      <Stack gap={1} className="py-3 pr-3">
        <span className="text-body font-body text-strong">{title}</span>
        {description && <span className="text-body font-body text-muted">{description}</span>}
      </Stack>
    </Stack>
  );
}
