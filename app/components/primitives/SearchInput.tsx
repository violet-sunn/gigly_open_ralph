import type { InputHTMLAttributes } from "react";
import { ICON, INPUT_BASE, INPUT_STATE, cx, type InputState } from "./tokens";
import { Icon } from "./Icon";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  state?: "default" | "focus" | "filled";
  /** Clear (✕) handler; the clear control shows only when there is a value. */
  onClear?: () => void;
}

/**
 * SearchInput primitive (DESIGN_SYSTEM_SPEC §3.1) = Input + search-icon inset (icon 16 @ 12 left)
 * + clear ✕ (16×16 right), per docs/DESIGN_SPECS.md §5. state: default | focus | filled.
 * Uses the exported search/clear assets (F4). Shares INPUT_BASE. Token-pure.
 */
export function SearchInput({ state = "default", value, onClear, className, ...rest }: SearchInputProps) {
  const hasValue = value != null && value !== "";
  return (
    <div className="relative w-full">
      <Icon src={ICON.search} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="search"
        value={value}
        className={cx(INPUT_BASE, "pl-8 pr-8", INPUT_STATE[state as InputState], className)}
        {...rest}
      />
      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Очистить"
          className="absolute right-3 top-1/2 -translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default"
        >
          <Icon src={ICON.clear} />
        </button>
      )}
    </div>
  );
}
