/* @composed-screen */
"use client";

import { useActionState, useState } from "react";
import { Section } from "@/app/components/layout/Section";
import { Split } from "@/app/components/layout/Split";
import { Stack } from "@/app/components/layout/Stack";
import { Input, Textarea, Button } from "@/app/components/primitives";
import {
  SectionHeader,
  CheckField,
  CriteriaEditor,
  ReadinessMeter,
  FeePanel,
  Notice,
} from "@/app/components/blocks";
import { createGig } from "@/app/actions/gig";
import type { ReadinessMeterVM } from "@/app/components/blocks/view-models";

type ActionState = { error?: string } | null;

const CRITERIA_SUGGESTIONS = ["Есть тесты", "Передача исходников", "Документация"];
const rub = (n: number) => `${new Intl.NumberFormat("ru-RU").format(n)} ₽`;

/**
 * CreateGig — the «Создать гиг» guided-brief screen (reconcile-create-gig, Phase 3; reconciled to the gigly_full_design
 * `createGig` prototype). A two-column `Split` inside AppShell: the left Definition-of-Done form (Что нужно сделать? /
 * Как поймём, что готово? / Что важно учесть? / Условия) and the right feedback panel (ReadinessMeter + FeePanel). The
 * controlled fields both drive the live feedback AND submit via the (unchanged) `createGig` (which redirects to the
 * success screen). Template + slotted blocks/primitives + data only — no className/style; criteria + category ride via
 * hidden inputs.
 */
export function CreateGig({ categoryOptions }: { categoryOptions: { key: string; label: string }[] }) {
  const [state, action] = useActionState<ActionState, FormData>(createGig as never, null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [constraints, setConstraints] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tags, setTags] = useState("");
  const [criteria, setCriteria] = useState<string[]>([]);

  const budgetNum = Number(budget) || 0;
  const fee = budgetNum > 0 ? Math.floor(budgetNum * 0.1) : 0;

  // The 7-point «Готовность брифа» checklist (mirrors the prototype's checks).
  const checks = [
    { label: "Название", done: title.trim() !== "" },
    { label: "Категория", done: category !== "" },
    { label: "Описание", done: description.trim().length >= 20 },
    { label: "Цель", done: goal.trim() !== "" },
    { label: "Ожидаемый результат", done: deliverables.trim() !== "" },
    { label: "Критерии приёмки", done: criteria.length > 0 },
    { label: "Бюджет и срок", done: budgetNum > 0 && deadline.trim() !== "" },
  ];
  const done = checks.filter((c) => c.done).length;
  const firstGap = checks.find((c) => !c.done);
  const readiness: ReadinessMeterVM = {
    pct: Math.round((done / checks.length) * 100),
    tone: done >= 6 ? "green" : done >= 4 ? "brand" : "amber",
    checks,
    nudge: firstGap ? `Добавьте: ${firstGap.label}` : undefined,
  };

  return (
    <Section gap={6}>
      <SectionHeader vm={{ title: "Создать гиг" }} />
      <form action={action}>
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="acceptanceCriteria" value={criteria.join("\n")} />

        <Split ratio="2:1">
          {/* Left — the Definition-of-Done form */}
          <Stack gap={6}>
            <Stack gap={3}>
              <SectionHeader vm={{ title: "Что нужно сделать?" }} />
              <Input name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Название гига" aria-label="Название" />
              <CheckField vm={{ options: categoryOptions, value: category }} onChange={setCategory} />
              <Textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Опишите задачу подробно…" aria-label="Описание" />
            </Stack>

            <Stack gap={3}>
              <SectionHeader vm={{ title: "Как поймём, что готово?" }} />
              <Textarea name="goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Зачем это нужно — цель" aria-label="Цель" />
              <Textarea name="deliverables" value={deliverables} onChange={(e) => setDeliverables(e.target.value)} placeholder="Что заказчик получит на выходе" aria-label="Ожидаемый результат" />
              <CriteriaEditor
                vm={{ items: criteria, suggestions: CRITERIA_SUGGESTIONS }}
                onAdd={(t) => setCriteria((c) => (c.includes(t) ? c : [...c, t]))}
                onRemove={(i) => setCriteria((c) => c.filter((_, idx) => idx !== i))}
              />
            </Stack>

            <Stack gap={3}>
              <SectionHeader vm={{ title: "Что важно учесть?" }} />
              <Textarea name="constraints" value={constraints} onChange={(e) => setConstraints(e.target.value)} placeholder="Ограничения и пожелания (необязательно)" aria-label="Ограничения" />
              <Input name="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Теги через запятую: React, TypeScript" aria-label="Теги" />
            </Stack>

            <Stack gap={3}>
              <SectionHeader vm={{ title: "Условия" }} />
              <Input name="budget" type="number" min="1" step="1" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Бюджет, ₽ — специалист получит эту сумму полностью" aria-label="Бюджет" />
              <Input name="deadlineDays" type="number" min="1" step="1" value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="Срок, дней (напр. 14)" aria-label="Срок выполнения" />
            </Stack>
          </Stack>

          {/* Right — live feedback: readiness meter + fee panel */}
          <Stack gap={4}>
            <ReadinessMeter vm={readiness} />
            <FeePanel vm={{ budget: rub(budgetNum), fee: rub(fee), total: rub(budgetNum + fee) }}>
              <Button type="submit" variant="primary">
                Опубликовать гиг
              </Button>
              {state?.error && <Notice tone="error">{state.error}</Notice>}
            </FeePanel>
          </Stack>
        </Split>
      </form>
    </Section>
  );
}
