'use client';

import { useEffect, useState } from 'react';

interface WelcomeModalProps {
  role: 'CLIENT' | 'SPECIALIST';
  onDismiss: () => void;
}

export default function WelcomeModal({ role, onDismiss }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if welcome screen has been seen before
    const hasSeenWelcome = localStorage.getItem('onboarding_welcome_seen');
    if (!hasSeenWelcome) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    // Handle Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        handleDismiss();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const handleDismiss = () => {
    localStorage.setItem('onboarding_welcome_seen', 'true');
    setIsVisible(false);
    onDismiss();
  };

  if (!isVisible) {
    return null;
  }

  const clientSteps = [
    { number: 1, text: 'Complete your profile', detail: 'Add company details' },
    { number: 2, text: 'Create your first gig', detail: 'Post work you need done' },
    { number: 3, text: 'Review applications from specialists', detail: 'Choose the best fit' },
  ];

  const specialistSteps = [
    { number: 1, text: 'Complete your profile', detail: 'Add skills and experience' },
    { number: 2, text: 'Browse available gigs', detail: 'Find projects that match your skills' },
    { number: 3, text: 'Apply to gigs', detail: 'Submit your proposals' },
  ];

  const steps = role === 'CLIENT' ? clientSteps : specialistSteps;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-surface-level-1 rounded-lg shadow-xl p-6 max-w-md w-[90vw] sm:w-full z-50 border border-neutral-weak"
      >
        <h2 id="modal-title" className="text-2xl font-bold text-white mb-4">
          Welcome to Gigly!
        </h2>

        <p className="text-neutral-default mb-6">
          Get started with these simple steps:
        </p>

        <ol className="space-y-4 mb-6">
          {steps.map((step) => (
            <li key={step.number} className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                {step.number}
              </div>
              <div>
                <p className="font-medium text-white">{step.text}</p>
                <p className="text-sm text-neutral-default">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDismiss}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-medium transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={handleDismiss}
            className="text-neutral-default hover:text-white px-6 py-2 rounded font-medium transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </>
  );
}
