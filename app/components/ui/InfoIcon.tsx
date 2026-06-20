'use client';

import { KeyboardEvent } from 'react';

interface InfoIconProps {
  className?: string;
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLSpanElement>) => void;
}

export function InfoIcon({ className = '', onClick, onKeyDown }: InfoIconProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
    onKeyDown?.(e);
  };

  return (
    <span
      className={`inline-flex items-center justify-center cursor-pointer transition-colors min-w-[44px] min-h-[44px] ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="More information"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-500 hover:text-gray-700 transition-colors"
      >
        <circle
          cx="8"
          cy="8"
          r="7"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M8 7V11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle
          cx="8"
          cy="5"
          r="0.75"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
