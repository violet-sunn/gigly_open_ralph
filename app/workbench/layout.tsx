import { notFound } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Workbench layout — gates the whole catalog to a DEV surface. In production the workbench
 * is not shipped UI: every /workbench route returns 404.
 */
export default function WorkbenchLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return <div className="min-h-screen bg-surface-level-0 p-6 text-foreground">{children}</div>;
}
