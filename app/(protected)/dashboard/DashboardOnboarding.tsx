'use client';

import WelcomeModal from '@/app/components/onboarding/WelcomeModal';

interface DashboardOnboardingProps {
  role: 'CLIENT' | 'SPECIALIST';
}

export function DashboardOnboarding({ role }: DashboardOnboardingProps) {
  return <WelcomeModal role={role} onDismiss={() => {}} />;
}
