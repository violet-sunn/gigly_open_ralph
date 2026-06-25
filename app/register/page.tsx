import { AuthDesign } from '@/app/_design/AuthDesign'

// /register — the design's 3-step onboarding (Auth.dc.html): role select → credentials (account created here,
// «Зарегистрироваться») → role-specific profile setup («Продолжить»). Rebuilt on app/_design. Role is chosen at
// step 1, so no ?role= query is used. Middleware allows authenticated users here (step-3 runs post-account-creation).
export default function RegisterPage() {
  return <AuthDesign initialView="onboarding" />
}
