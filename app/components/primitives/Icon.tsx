import { cx } from "./tokens";

interface IconProps {
  /** Path to an exported asset (use the ICON registry in tokens.ts). */
  src: string;
  /** Accessible label; empty string (default) renders a decorative, aria-hidden icon. */
  alt?: string;
  /** Size/spacing utility classes (default = size/icon, i.e. 16). */
  className?: string;
}

/**
 * Icon — renders an exported design-system SVG asset (F4: real assets, never redrawn).
 * Uses a plain <img> (the assets are standalone optimized SVGs); centralizes the
 * @next/next/no-img-element exception so the primitives stay clean.
 */
export function Icon({ src, alt = "", className }: IconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      className={cx("inline-block h-icon w-icon", className)}
    />
  );
}
