/**
 * ResultCount block (compose-gig-search gap fill) — the "Найдено N" results count for the search/browse screens.
 * A token-pure text label (caption type, muted) — a screen renders it instead of raw markup (F5). Token-pure.
 */
export function ResultCount({ count, label = "Найдено" }: { count: number; label?: string }) {
  return (
    <span className="text-caption font-caption text-muted">
      {label} {count}
    </span>
  );
}
