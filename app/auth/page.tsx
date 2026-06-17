/* @composed-screen */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Section } from "@/app/components/layout/Section";
import { Stack } from "@/app/components/layout/Stack";
import { AuthLayout } from "@/app/components/templates/AuthLayout";
import { Button } from "@/app/components/primitives";
import { RoleCards, type Role } from "@/app/components/blocks";

/**
 * /auth — the authentication entry, composed purely from the kit (compose-auth-onboarding, Phase 2). AuthLayout +
 * RoleCards + «Войти»/«Зарегистрироваться» buttons routing to /login?role= / /register?role= once a role is picked.
 * Replaces the pre-redesign hex-laden page. Token-pure (no className/style/hex).
 */
export default function AuthPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);

  return (
    <AuthLayout>
      <Section title="Вход" gap={6}>
        <RoleCards value={role} onSelect={setRole} />
        <Stack gap={3}>
          <Button
            type="button"
            variant="primary"
            disabled={!role}
            onClick={() => role && router.push(`/login?role=${role}`)}
          >
            Войти
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!role}
            onClick={() => role && router.push(`/register?role=${role}`)}
          >
            Зарегистрироваться
          </Button>
        </Stack>
      </Section>
    </AuthLayout>
  );
}
