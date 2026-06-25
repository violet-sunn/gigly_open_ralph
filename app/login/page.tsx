import { AuthDesign } from '@/app/_design/AuthDesign'

// /login — the design's «ВХОД В GIGLY» view (Auth.dc.html), rebuilt on app/_design. Role-agnostic; «Создать аккаунт»
// switches in-surface to the onboarding flow. Middleware redirects already-authenticated users to /dashboard.
export default function LoginPage() {
  return <AuthDesign initialView="login" />
}
