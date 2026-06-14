import { ICON, cx } from "./tokens";
import { Icon } from "./Icon";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  /** Expanded (open) state — controlled/presentational. */
  expanded?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onToggle?: () => void;
  onSelect?: (value: string) => void;
  className?: string;
  "aria-label"?: string;
}

/**
 * Select / FilterDropdown primitive (DESIGN_SYSTEM_SPEC §3.1).
 * state: collapsed | expanded | disabled · option: default | hover | selected.
 * 106×40 trigger (size/control, radius/md); popover on surface/level-3. Controlled. Token-pure.
 */
export function Select({
  options,
  value,
  expanded = false,
  disabled = false,
  placeholder = "Выбрать",
  onToggle,
  onSelect,
  className,
  ...rest
}: SelectProps) {
  const selected = options.find((o) => o.value === value);
  return (
    <div className={cx("relative", disabled && "opacity-disabled", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={expanded}
        disabled={disabled}
        onClick={onToggle}
        className="inline-flex h-control w-full items-center justify-between gap-2 rounded-md border border-border bg-surface-level-2 px-3 text-label font-label text-strong disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default"
        {...rest}
      >
        <span className={cx(!selected && "text-muted")}>{selected ? selected.label : placeholder}</span>
        <Icon src={ICON.collapse} />
      </button>
      {expanded && !disabled && (
        <ul
          role="listbox"
          className="absolute z-dropdown mt-1 w-full overflow-hidden rounded-md border border-border bg-surface-level-3 shadow-popover"
        >
          {options.map((o) => {
            const isSelected = o.value === value;
            return (
              <li
                key={o.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => onSelect?.(o.value)}
                className={cx(
                  "cursor-pointer px-3 py-2 text-label font-label",
                  isSelected ? "bg-brand-default/10 text-brand-default" : "text-strong hover:bg-surface-level-3-hover",
                )}
              >
                {o.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
