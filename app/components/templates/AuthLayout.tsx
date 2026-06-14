import type { ReactNode } from "react";
import { Panel } from "../layout/Panel";

interface AuthLayoutProps {
  /** The auth/register card body (composed from blocks/primitives). */
  children?: ReactNode;
  /** Optional footer content rendered over the checkerboard band. */
  footer?: ReactNode;
}

/**
 * AuthLayout — auth/register template (DESIGN_SYSTEM_SPEC §4.1).
 * A centered card region + a decorative checkerboard footer
 * (public/assets/design-system/patterns/checkerboard.svg). Used by
 * auth / reg / reg-customer / reg-specialist (Phase 2). Token-pure, presentational.
 */
export function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-level-0 text-foreground">
      <main className="flex flex-1 items-center justify-center p-6">
        <Panel surface={2} radius="lg" padding={8} border className="w-full max-w-md">
          {children}
        </Panel>
      </main>
      <footer className="w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/design-system/patterns/checkerboard.svg"
          alt=""
          aria-hidden="true"
          className="h-24 w-full object-cover"
        />
        {footer}
      </footer>
    </div>
  );
}
