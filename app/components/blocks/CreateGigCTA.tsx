import Link from "next/link";
import { BUTTON_BASE, BUTTON_VARIANT, cx } from "@/app/components/primitives/tokens";

/**
 * CreateGigCTA block (DESIGN_SYSTEM_SPEC §3.3) — a primary action + label that navigates to `href`.
 * A `Link` styled with the primary Button tokens (a navigation CTA, not an onClick button). Token-pure.
 */
export function CreateGigCTA({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className={cx(BUTTON_BASE, BUTTON_VARIANT.primary)}>
      {label}
    </Link>
  );
}
