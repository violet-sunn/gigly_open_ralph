import type { ReactNode } from "react";
import { Rail } from "../layout/Rail";

interface AppShellProps {
  /** Sidebar block (e.g. SidebarNav) — passed as a slot; not built here. */
  sidebar?: ReactNode;
  /** Topbar block (e.g. Topbar) — passed as a slot; not built here. */
  topbar?: ReactNode;
  /** Sidebar state: full list when expanded, icon-rail when collapsed. */
  collapsed?: boolean;
  /** Content region (the composed screen body). */
  children?: ReactNode;
}

/**
 * AppShell — authenticated app template (DESIGN_SYSTEM_SPEC §4.1).
 * Regions/slots: sidebar slot · topbar slot · content region.
 * States: sidebar expanded (full nav) and collapsed (icon-rail).
 *
 * Token-pure and presentational: it arranges slots; it does NOT build SidebarNav/
 * Topbar (those are domain-blocks) and is NOT wired into routes here
 * (compose-shell-cutover, Phase 2). Topbar height = size/control (h-10).
 */
export function AppShell({ sidebar, topbar, collapsed = false, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-surface-level-0 text-foreground" data-shell-state={collapsed ? "collapsed" : "expanded"}>
      {collapsed ? (
        <aside className="shrink-0 bg-surface-level-1 border-r border-border" aria-label="Sidebar">
          <Rail>{sidebar}</Rail>
        </aside>
      ) : (
        <aside className="w-64 shrink-0 bg-surface-level-1 border-r border-border" aria-label="Sidebar">
          {sidebar}
        </aside>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-10 shrink-0 items-center border-b border-border bg-surface-level-1 px-4">
          {topbar}
        </header>
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 p-6 focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
