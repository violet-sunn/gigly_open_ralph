import { ICON, cx, type View } from "./tokens";
import { Icon } from "./Icon";

interface ViewToggleProps {
  /** Active view — drives grid-active / list-active state. */
  view?: View;
  onChange?: (view: View) => void;
  className?: string;
  "aria-label"?: string;
}

/**
 * ViewToggle primitive (DESIGN_SYSTEM_SPEC §3.1) — grid / list, 60×32 (§5).
 * state: grid-active | list-active (active segment on surface/level-3). Uses the exported
 * grid/list assets (F4). Controlled/presentational. Token-pure.
 */
export function ViewToggle({ view = "grid", onChange, className, ...rest }: ViewToggleProps) {
  return (
    <div className={cx("inline-flex gap-1 rounded-md bg-surface-level-2 p-1", className)} role="group" {...rest}>
      {(["grid", "list"] as const).map((v) => {
        const isActive = v === view;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={isActive}
            aria-label={v === "grid" ? "Сетка" : "Список"}
            onClick={() => onChange?.(v)}
            className={cx(
              "inline-flex h-6 w-6 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default",
              isActive ? "bg-surface-level-3" : "bg-transparent",
            )}
          >
            <Icon src={ICON[v]} className={cx("h-5 w-5", !isActive && "opacity-disabled")} />
          </button>
        );
      })}
    </div>
  );
}
