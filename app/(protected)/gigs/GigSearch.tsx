/* @composed-screen */
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Section } from "@/app/components/layout/Section";
import { Grid } from "@/app/components/layout/Grid";
import { Stack } from "@/app/components/layout/Stack";
import { FilterBar, GigCard, ResultCount } from "@/app/components/blocks";
import type { SelectOption } from "@/app/components/primitives";
import type { GigSearchData } from "@/lib/view-models";

/**
 * SPECIALIST gig search/browse — composed purely from the kit (compose-gig-search, Phase 2). Renders inside the
 * layout's AppShell. Template + slotted blocks + data only — no styling/className/style; arranged via layout
 * primitives. Client: owns the filter/view URL state (all of search/category/sort/minRating/view are URL params, so
 * pagination preserves them and views are shareable); the FilterBar/ViewToggle/GigCard callbacks push URL changes.
 * The page owns the actual query + pagination (PaginationControls renders beneath this screen).
 */
export function GigSearch({
  data,
  categoryOptions,
  sortOptions,
  ratingOptions,
}: {
  data: GigSearchData;
  categoryOptions: SelectOption[];
  sortOptions: SelectOption[];
  ratingOptions: SelectOption[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState<string | null>(null);

  // Push a mutated query (filters reset pagination by dropping `page`).
  const nav = (mut: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(params.toString());
    mut(p);
    p.delete("page");
    router.push(`/gigs?${p.toString()}`);
  };
  const set = (key: string, value: string, clearWhen?: string) =>
    nav((p) => (value && value !== clearWhen ? p.set(key, value) : p.delete(key)));

  const cards = data.gigCards;

  return (
    <Section title="Поиск гигов" gap={6}>
      <FilterBar
        vm={data.filterBar}
        onSearch={(q) => set("search", q.trim())}
        categories={categoryOptions}
        categoryValue={params.get("category") ?? ""}
        onCategory={(c) => set("category", c)}
        sortOptions={sortOptions}
        sortValue={params.get("sort") ?? "newest"}
        onSort={(s) => set("sort", s, "newest")}
        ratingOptions={ratingOptions}
        ratingValue={params.get("minRating") ?? ""}
        onRating={(r) => set("minRating", r)}
        onViewChange={(v) => set("view", v, "grid")}
        openSelect={open}
        onToggleSelect={setOpen}
      />
      <ResultCount count={data.count} />
      {data.view === "list" ? (
        <Stack gap={4}>
          {cards.map((vm) => (
            <GigCard
              key={vm.id}
              vm={vm}
              onOpen={() => router.push(`/gigs/${vm.id}?from=browse&${params.toString()}`)}
            />
          ))}
        </Stack>
      ) : (
        <Grid columns={3} gap={4}>
          {cards.map((vm) => (
            <GigCard
              key={vm.id}
              vm={vm}
              onOpen={() => router.push(`/gigs/${vm.id}?from=browse&${params.toString()}`)}
            />
          ))}
        </Grid>
      )}
    </Section>
  );
}
