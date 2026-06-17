import type { ReactNode } from "react";
import { Panel } from "@/app/components/layout/Panel";

export interface DataRow {
  id: string;
  cells: ReactNode[];
}

/**
 * DataTable block (prove-extensibility-admin — the ONE system gap the generativity proof surfaced, added on-system).
 * A generic, token-pure, SEMANTIC table: a header row of column labels + one `<tr>` per row, cells slotted as
 * ReactNode (so the screen passes `StatusBadge`/`Tag`/text/inline action forms). Empty state when there are no rows.
 * Composed from tokens + the Panel layout primitive — no new token/primitive, no off-token literal. Logged in
 * docs/DESIGN_SYSTEM_SPEC.md §3.2.
 */
export function DataTable({
  columns,
  rows,
  empty,
}: {
  columns: string[];
  rows: DataRow[];
  empty?: ReactNode;
}) {
  return (
    <Panel surface={1} radius="lg" padding={0} border>
      <table className="w-full text-body font-body text-strong">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 text-left text-caption font-caption text-subtle">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border">
              {r.cells.map((cell, i) => (
                <td key={i} className="px-4 py-3 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <span className="block px-4 py-6 text-body font-body text-muted">{empty ?? "Нет записей"}</span>
      )}
    </Panel>
  );
}
