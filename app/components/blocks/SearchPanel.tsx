"use client";

import { useState } from "react";
import { Stack } from "@/app/components/layout/Stack";
import { SearchInput } from "@/app/components/primitives/SearchInput";
import { Button } from "@/app/components/primitives";

interface SearchPanelProps {
  placeholder?: string;
  actionLabel?: string;
  /** Called with the current query on submit (Enter or the action button); the screen navigates. */
  onSubmit: (query: string) => void;
}

/**
 * SearchPanel block (compose-specialist-dashboard gap fill, DESIGN_SYSTEM_SPEC §3.2) — the dashboard
 * "Найти проект" entry point: the SearchInput primitive + a primary action. Presentational — it owns its
 * ephemeral query and calls onSubmit(query) (the composed screen routes to /gigs), the same callback
 * pattern as GigCard.onOpen. Token-pure; built from primitives + layout primitives.
 */
export function SearchPanel({ placeholder = "Найти проект", actionLabel = "Найти проект", onSubmit }: SearchPanelProps) {
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(q);
      }}
    >
      <Stack axis="row" gap={3} align="center">
        <SearchInput
          value={q}
          placeholder={placeholder}
          onChange={(e) => setQ(e.target.value)}
          onClear={() => setQ("")}
        />
        <Button type="submit" variant="primary">
          {actionLabel}
        </Button>
      </Stack>
    </form>
  );
}
