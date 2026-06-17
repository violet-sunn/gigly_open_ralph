import type { ReactNode } from "react";
import { Panel } from "@/app/components/layout/Panel";
import { cx } from "@/app/components/layout/scale";

export type NoticeTone = "info" | "success" | "warning" | "error" | "muted";

const TONE: Record<NoticeTone, string> = {
  info: "text-brand-default",
  success: "text-status-completed",
  warning: "text-status-review",
  error: "text-status-rejected",
  muted: "text-muted",
};

/**
 * Notice block (compose-gig-detail-apply gap fill) — a token-styled informational/error message in a bounded Panel.
 * Lets composed screens render notices (apply states, lifecycle hints, errors, not-found) without raw styled markup
 * (F5). Token-pure (semantic foreground tokens only).
 */
export function Notice({ tone = "info", children }: { tone?: NoticeTone; children: ReactNode }) {
  return (
    <Panel surface={2} radius="md" padding={4} border>
      <span className={cx("text-body font-body", TONE[tone])}>{children}</span>
    </Panel>
  );
}
