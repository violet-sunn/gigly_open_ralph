'use client';

import { useEffect, useState } from 'react';

interface FirstTimeTooltipProps {
  storageKey: string;
  message: string;
  onDismiss?: () => void;
}

export default function FirstTimeTooltip({
  storageKey,
  message,
  onDismiss,
}: FirstTimeTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if tooltip has been seen before
    const hasSeenTooltip = localStorage.getItem(storageKey);
    if (!hasSeenTooltip) {
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative bg-blue-50 border border-blue-300 rounded-lg p-4 shadow-md mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm text-blue-900">{message}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-blue-600 hover:text-blue-800 font-bold text-lg leading-none"
          aria-label="Close tooltip"
        >
          ×
        </button>
      </div>
      <div className="mt-3">
        <button
          onClick={handleDismiss}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
