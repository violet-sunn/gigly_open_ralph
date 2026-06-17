import type { ButtonHTMLAttributes } from "react";
import { ICON_BUTTON_BASE, ICON_BUTTON_BG, cx, type IconButtonBg } from "./tokens";
import { Icon } from "./Icon";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Exported asset path (use the ICON registry in tokens.ts). */
  icon: string;
  /** Accessible name — REQUIRED (icon-only control). */
  "aria-label": string;
  /** Background axis (Figma button_icon BG): yes = surface fill · no = transparent. */
  bg?: IconButtonBg;
  /** Optional unread/count badge (top-right). */
  counter?: number;
}

/**
 * IconButton primitive (DESIGN_SYSTEM_SPEC §3.1) — Figma `button_icon`: square size/control (40×40),
 * radius/sm, a size/icon-rail (20) glyph; `bg` axis no|yes; state default/hover/active (CSS
 * pseudo-classes) + disabled (prop); optional counter badge (brand/default). Token-pure; uses an
 * exported asset (F4). Icon-only ⇒ an `aria-label` is required by the type.
 */
export function IconButton({ icon, bg = "no", counter, className, type = "button", ...rest }: IconButtonProps) {
  return (
    <button type={type} className={cx(ICON_BUTTON_BASE, ICON_BUTTON_BG[bg], className)} {...rest}>
      <Icon src={icon} className="h-icon-rail w-icon-rail" />
      {counter != null && (
        <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-default text-caption font-caption text-inverse">
          {counter}
        </span>
      )}
    </button>
  );
}
