"use client";
import { byKind, type Kind } from "./registry";

/**
 * Renders all catalog entries of a kind with their all-states Story + reference path.
 * Client component: the kit's interactive primitives (Toggle/Tabs/Radio/ViewToggle/Select)
 * attach event handlers, so the catalog needs a client boundary to render them.
 */
export function CatalogSection({ kind }: { kind: Kind }) {
  const entries = byKind(kind);
  return (
    <div className="flex flex-col gap-8">
      {entries.map((e) => (
        <section key={e.id} className="flex flex-col gap-3 rounded-lg border border-border bg-surface-level-1 p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-h2 font-h2 text-strong">{e.title}</h2>
            <span className="text-caption font-caption text-subtle">ref: {e.reference}</span>
          </div>
          <div className="rounded-md bg-surface-level-0 p-4">{e.Story()}</div>
        </section>
      ))}
    </div>
  );
}
