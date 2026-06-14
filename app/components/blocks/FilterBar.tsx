import { SearchInput, Select, ViewToggle, type SelectOption } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import type { FilterBarVM } from "./view-models";

interface FilterBarProps {
  vm: FilterBarVM;
  variant?: "full" | "search-only";
  onViewChange?: (v: "grid" | "list") => void;
}

/**
 * FilterBar block (DESIGN_SYSTEM_SPEC §3.2) — {search-only, full}.
 * search-only = SearchInput; full = SearchInput + Filter/Select + ViewToggle.
 * Composed from primitives + layout primitives + tokens. Token-pure.
 */
export function FilterBar({ vm, variant = "full", onViewChange }: FilterBarProps) {
  const filterOptions: SelectOption[] = vm.filters.map((f) => ({ value: f.value, label: f.label }));
  return (
    <Stack axis="row" gap={3} align="center">
      <div className="flex-1">
        <SearchInput defaultValue={vm.query} placeholder="Поиск…" />
      </div>
      {variant === "full" && (
        <>
          <Select options={filterOptions} placeholder="Фильтры" />
          <ViewToggle view={vm.view} onChange={onViewChange} />
        </>
      )}
    </Stack>
  );
}
