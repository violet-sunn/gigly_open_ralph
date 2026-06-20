import { cx } from "./tokens";

const LOGO_SRC = "/assets/design-system/brand/gigly-logo.svg";

interface LogomarkProps {
  /** Size/spacing utility classes for the mark (default 64px). The Figma mark is 75px — pass a class to override. */
  className?: string;
  /** Render the «Gigly» wordmark next to the mark (the auth-screen lockup). */
  withWordmark?: boolean;
}

/**
 * Logomark primitive (DESIGN_SYSTEM_SPEC §3.1) — the Gigly brand mark, rendering the EXPORTED asset
 * (`public/assets/design-system/brand/gigly-logo.svg`, Figma 3179:3571), never a redrawn glyph (F4). Optional
 * «Gigly» wordmark lockup. Token-pure.
 */
export function Logomark({ className, withWordmark = false }: LogomarkProps) {
  return (
    <span className="inline-flex items-center gap-3">
      {/* The exported mark is a white glyph; the logo-plate backing is transparent on dark (the page is dark) and a
          dark island on light (ТЗ §5) so the white mark always reads. Token-pure; themes via [data-theme]. */}
      <span className="inline-flex rounded-md bg-surface-logo-plate p-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_SRC} alt="Gigly" className={cx("inline-block h-16 w-16", className)} />
      </span>
      {withWordmark && <span className="text-h1 font-h1 text-strong">Gigly</span>}
    </span>
  );
}
