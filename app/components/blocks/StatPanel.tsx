import { Rating } from "@/app/components/primitives";
import { Grid } from "@/app/components/layout/Grid";
import { Stack } from "@/app/components/layout/Stack";
import type { StatPanelVM, RatingVM } from "./view-models";

interface StatPanelProps {
  vm: StatPanelVM;
  variant?: "single" | "grid";
  rating?: RatingVM;
}

/**
 * StatPanel block (DESIGN_SYSTEM_SPEC §3.2) — stat tiles (label + value) + optional Rating.
 * variant: single (stacked) | grid. Composed from layout primitives + tokens. Token-pure.
 */
export function StatPanel({ vm, variant = "grid", rating }: StatPanelProps) {
  const tiles = vm.stats.map((s, i) => (
    <Stack key={i} gap={1}>
      <span className="text-caption font-caption text-muted">{s.label}</span>
      <span className="text-title font-title text-strong">{s.value}</span>
    </Stack>
  ));
  return (
    <Stack gap={4}>
      {variant === "grid" ? <Grid columns={3} gap={4}>{tiles}</Grid> : <Stack gap={3}>{tiles}</Stack>}
      {rating && (
        <Rating value={rating.value} count={rating.count} verified={rating.verified} online={rating.online} />
      )}
    </Stack>
  );
}
