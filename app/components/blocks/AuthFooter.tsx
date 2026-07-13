import { Stack } from "@/app/components/layout/Stack";

/**
 * AuthFooter block (add-onboarding-screen, DESIGN_SYSTEM_SPEC §3.2) — the onboarding/auth legal footer links
 * («Политика конфиденциальности» · «Условия пользования» · «Помощь»), rendered over the AuthLayout checkerboard band.
 * Token-pure; links point to the public legal/help pages (app/privacy, app/terms, app/help).
 */
const LINKS = [
  { label: "Политика конфиденциальности", href: "/privacy" },
  { label: "Условия пользования", href: "/terms" },
  { label: "Помощь", href: "/help" },
];

export function AuthFooter() {
  return (
    <Stack axis="row" gap={4} align="center" justify="between" className="px-8 py-5">
      {LINKS.map((l) => (
        <a key={l.label} href={l.href} className="text-caption font-caption text-muted underline">
          {l.label}
        </a>
      ))}
    </Stack>
  );
}
