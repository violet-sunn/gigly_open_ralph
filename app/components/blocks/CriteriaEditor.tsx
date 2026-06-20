"use client";

import { useState } from "react";
import { Input, Button, IconButton, ICON } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import type { CriteriaEditorVM } from "./view-models";

/**
 * CriteriaEditor block (reconcile-create-gig, DESIGN_SYSTEM_SPEC §3.2) — the create-gig «Готово, когда…» acceptance-
 * criteria editor: an input + «Добавить», suggestion pills (common criteria), and the removable criterion rows. The
 * list itself lives in the screen (via `onAdd`/`onRemove`); a local draft holds the in-progress input. Composed from
 * primitives + layout + tokens. Token-pure.
 */
export function CriteriaEditor({
  vm,
  onAdd,
  onRemove,
}: {
  vm: CriteriaEditorVM;
  onAdd: (text: string) => void;
  onRemove: (index: number) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (t) {
      onAdd(t);
      setDraft("");
    }
  };

  return (
    <Stack gap={3}>
      <Stack axis="row" gap={2} align="center">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Готово, когда…"
          aria-label="Критерий приёмки"
        />
        <Button type="button" variant="secondary" onClick={add}>
          Добавить
        </Button>
      </Stack>

      {vm.suggestions.length > 0 && (
        <Stack axis="row" gap={2}>
          {vm.suggestions.map((s) => (
            <Button key={s} type="button" variant="ghost" onClick={() => onAdd(s)}>
              {s}
            </Button>
          ))}
        </Stack>
      )}

      {vm.items.length > 0 && (
        <Stack gap={1}>
          {vm.items.map((item, i) => (
            <Stack key={`${item}-${i}`} axis="row" gap={2} align="center" justify="between">
              <span className="text-body font-body text-strong">✓ {item}</span>
              <IconButton icon={ICON.clear} aria-label="Удалить критерий" onClick={() => onRemove(i)} />
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
