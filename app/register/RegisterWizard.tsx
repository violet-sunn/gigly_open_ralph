/* @composed-screen */
"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/app/components/layout/Section";
import { Stack } from "@/app/components/layout/Stack";
import { AuthLayout } from "@/app/components/templates/AuthLayout";
import { Input, PasswordInput, Select, StepIndicator, Button } from "@/app/components/primitives";
import { RoleCards, Notice, type Role } from "@/app/components/blocks";
import { registerUser } from "@/app/actions/auth";
import { SPECIALIZATIONS, EXPERIENCE_LEVELS, TIMEZONES } from "@/lib/profiles";

type ActionState = { error?: string } | null;
const STEPS = ["Роль", "Доступ", "Профиль"];
const opts = (xs: readonly string[]) => xs.map((v) => ({ value: v, label: v }));

/**
 * RegisterWizard — the /register 3-step onboarding wizard, composed purely from the kit (compose-auth-onboarding,
 * Phase 2). AuthLayout + StepIndicator + RoleCards + form primitives. Step 1 role (preselected from ?role=), step 2
 * credentials (email + password + confirm-password, client-side match check), step 3 the role-specific profile (the
 * reg-customer company fields vs the reg-specialist fields with dataset-bound dropdowns). Submitting posts the full
 * FormData to the (kept) registerUser, which persists the profile. Token-pure (no className/style); inputs stay mounted
 * across steps via the `hidden` attribute so the single form submits every field. Mirrors the GigDetail/DisputeView
 * inline-client pattern.
 */
export function RegisterWizard({ role: initialRole }: { role?: Role | null }) {
  const router = useRouter();
  const [state, action] = useActionState<ActionState, FormData>(registerUser as never, null);
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(initialRole ?? null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [reveal, setReveal] = useState(false);
  // specialist dropdowns (controlled → hidden inputs carry them; Select is presentational)
  const [specialization, setSpecialization] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [timezone, setTimezone] = useState("");
  const [openSel, setOpenSel] = useState<string | null>(null);

  const mismatch = confirm.length > 0 && password !== confirm;
  const canCredentials = password.length > 0 && confirm.length > 0 && !mismatch;

  return (
    <AuthLayout>
      <Section title="Регистрация" gap={6}>
        <StepIndicator steps={STEPS} current={step} />

        <form action={action}>
          <Stack gap={5}>
            {/* hidden carriers — submitted regardless of the visible step */}
            <input type="hidden" name="role" value={role ?? ""} />
            <input type="hidden" name="specialization" value={specialization} />
            <input type="hidden" name="experienceLevel" value={experienceLevel} />
            <input type="hidden" name="timezone" value={timezone} />

            {/* Step 1 — role */}
            <div hidden={step !== 0}>
              <RoleCards value={role} onSelect={setRole} />
            </div>

            {/* Step 2 — credentials */}
            <div hidden={step !== 1}>
              <Stack gap={4}>
                <Input name="email" type="email" placeholder="you@example.com" autoComplete="email" />
                <PasswordInput
                  name="password"
                  placeholder="Пароль"
                  autoComplete="new-password"
                  revealed={reveal}
                  onToggleReveal={() => setReveal((r) => !r)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordInput
                  name="confirmPassword"
                  placeholder="Повторите пароль"
                  autoComplete="new-password"
                  revealed={reveal}
                  onToggleReveal={() => setReveal((r) => !r)}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  state={mismatch ? "error" : "default"}
                />
                {mismatch && <Notice tone="error">Пароли не совпадают.</Notice>}
              </Stack>
            </div>

            {/* Step 3 — role-specific profile */}
            <div hidden={step !== 2}>
              {role === "CLIENT" ? (
                <Stack gap={4}>
                  <Input name="companyName" placeholder="Название компании" />
                  <Input name="inn" placeholder="ИНН" />
                  <Input name="contactPerson" placeholder="Контактное лицо" />
                  <Input name="phoneNumber" placeholder="Телефон" />
                </Stack>
              ) : (
                <Stack gap={4}>
                  <Input name="displayName" placeholder="Имя" />
                  <Input name="position" placeholder="Должность" />
                  <Input name="techStack" placeholder="Стек технологий" />
                  <Select
                    options={opts(SPECIALIZATIONS)}
                    value={specialization}
                    placeholder="Специализация"
                    expanded={openSel === "spec"}
                    onToggle={() => setOpenSel((s) => (s === "spec" ? null : "spec"))}
                    onSelect={(v) => {
                      setSpecialization(v);
                      setOpenSel(null);
                    }}
                    aria-label="Специализация"
                  />
                  <Select
                    options={opts(EXPERIENCE_LEVELS)}
                    value={experienceLevel}
                    placeholder="Уровень"
                    expanded={openSel === "level"}
                    onToggle={() => setOpenSel((s) => (s === "level" ? null : "level"))}
                    onSelect={(v) => {
                      setExperienceLevel(v);
                      setOpenSel(null);
                    }}
                    aria-label="Уровень"
                  />
                  <Select
                    options={opts(TIMEZONES)}
                    value={timezone}
                    placeholder="Часовой пояс"
                    expanded={openSel === "tz"}
                    onToggle={() => setOpenSel((s) => (s === "tz" ? null : "tz"))}
                    onSelect={(v) => {
                      setTimezone(v);
                      setOpenSel(null);
                    }}
                    aria-label="Часовой пояс"
                  />
                </Stack>
              )}
            </div>

            {state?.error && <Notice tone="error">{state.error}</Notice>}

            {/* Navigation */}
            <Stack axis="row" gap={3} justify="between">
              {step > 0 ? (
                <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>
                  Назад
                </Button>
              ) : (
                <Button type="button" variant="secondary" onClick={() => router.push("/login")}>
                  Войти
                </Button>
              )}

              {step === 0 && (
                <Button type="button" variant="primary" disabled={!role} onClick={() => setStep(1)}>
                  Далее
                </Button>
              )}
              {step === 1 && (
                <Button type="button" variant="primary" disabled={!canCredentials} onClick={() => setStep(2)}>
                  Далее
                </Button>
              )}
              {step === 2 && (
                <Button type="submit" variant="primary">
                  Зарегистрироваться
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </Section>
    </AuthLayout>
  );
}
