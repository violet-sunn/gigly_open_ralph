'use client';

import { ReactNode, useState } from 'react';

interface HelpBannerProps {
  title?: string;
  children: ReactNode;
  onDismiss: () => void;
}

export function HelpBanner({ title, children, onDismiss }: HelpBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for fade-out animation to complete before calling onDismiss
    setTimeout(() => {
      onDismiss();
    }, 200);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Help information"
      className={`relative rounded-lg border border-blue-200 bg-blue-50 p-4 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        maxWidth: '100%',
      }}
    >
      <button
        onClick={handleDismiss}
        aria-label="Dismiss help"
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded hover:bg-blue-100 transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-blue-600"
        >
          <path
            d="M1 1L13 13M1 13L13 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="pr-8">
        {title && (
          <h3 className="mb-2 text-base font-semibold text-blue-900">
            {title}
          </h3>
        )}
        <div className="text-sm text-blue-800">{children}</div>
      </div>
    </div>
  );
}
