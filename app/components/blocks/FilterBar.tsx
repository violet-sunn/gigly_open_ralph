import { SearchInput, Select, ViewToggle, type SelectOption } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import type { FilterBarVM } from "./view-models";

interface FilterBarProps {
  vm: FilterBarVM;
  variant?: "full" | "search-only";
  onViewChange?: (v: "grid" | "list") => void;
  /** Controlled search submit (Enter) — reads the `search`-named input. */
  onSearch?: (query: string) => void;
  /** Category filter Select (the five categories). */
  categories?: SelectOption[];
  categoryValue?: string;
  onCategory?: (slug: string) => void;
  /** Sort Select. */
  sortOptions?: SelectOption[];
  sortValue?: string;
  onSort?: (sort: string) => void;
  /** Рейтинг (min-rating) Select. */
  ratingOptions?: SelectOption[];
  ratingValue?: string;
  onRating?: (min: string) => void;
  /** Which Select is open (the Select primitive is controlled); the screen owns this state. */
  openSelect?: string | null;
  onToggleSelect?: (key: string | null) => void;
}

/**
 * FilterBar block (DESIGN_SYSTEM_SPEC §3.2) — {search-only, full}.
 * search-only = SearchInput; full = SearchInput + Filter/Select(s) + ViewToggle.
 *
 * compose-gig-search made it FUNCTIONAL: the optional `on*` callbacks + Select option arrays let a screen DRIVE the
 * filter/search UI (search on Enter; category/sort/Рейтинг Selects; grid⇄list). All additive — passing only `vm` +
 * `variant` (workbench/fixtures) keeps the original presentational behaviour. Composed from primitives + layout
 * primitives + tokens. Token-pure.
 *
 * reconcile-gig-browse (RC-S11): the grid/list `ViewToggle` renders ONLY when wired (`onViewChange` present). The
 * gig-browse screen hoists the switcher into its `SectionHeader` header row per node `2860:2056`, so it passes no
 * `onViewChange` here and the filter bar shows no switcher.
 */
export function FilterBar({
  vm,
  variant = "full",
  onViewChange,
  onSearch,
  categories,
  categoryValue,
  onCategory,
  sortOptions,
  sortValue,
  onSort,
  ratingOptions,
  ratingValue,
  onRating,
  openSelect = null,
  onToggleSelect,
}: FilterBarProps) {
  const legacyFilters: SelectOption[] = vm.filters.map((f) => ({ value: f.value, label: f.label }));
  const toggle = (key: string) => onToggleSelect?.(openSelect === key ? null : key);
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.(String(new FormData(e.currentTarget).get("search") ?? ""));
      }}
    >
      <Stack axis="row" gap={3} align="center">
        <div className="flex-1">
          <SearchInput name="search" defaultValue={vm.query} placeholder="Поиск…" />
        </div>
        {variant === "full" && (
          <>
            {legacyFilters.length > 0 && <Select options={legacyFilters} placeholder="Фильтры" />}
            {categories && categories.length > 0 && (
              <Select
                options={categories}
                value={categoryValue}
                placeholder="Категория"
                expanded={openSelect === "category"}
                onToggle={() => toggle("category")}
                onSelect={(v) => {
                  onCategory?.(v);
                  onToggleSelect?.(null);
                }}
              />
            )}
            {sortOptions && sortOptions.length > 0 && (
              <Select
                options={sortOptions}
                value={sortValue}
                placeholder="Сортировка"
                expanded={openSelect === "sort"}
                onToggle={() => toggle("sort")}
                onSelect={(v) => {
                  onSort?.(v);
                  onToggleSelect?.(null);
                }}
              />
            )}
            {ratingOptions && ratingOptions.length > 0 && (
              <Select
                options={ratingOptions}
                value={ratingValue}
                placeholder="Рейтинг"
                expanded={openSelect === "rating"}
                onToggle={() => toggle("rating")}
                onSelect={(v) => {
                  onRating?.(v);
                  onToggleSelect?.(null);
                }}
              />
            )}
            {onViewChange && <ViewToggle view={vm.view} onChange={onViewChange} />}
          </>
        )}
      </Stack>
    </form>
  );
}
