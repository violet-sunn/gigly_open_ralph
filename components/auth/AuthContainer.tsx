import React from 'react';

export interface AuthContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * AuthContainer component - centered container for auth forms
 * Matches Figma design specs: 418px width, 540px height, 25px border-radius
 * Background: #060813, Border: #242935
 *
 * @param children - Content to render inside the container
 * @param className - Additional CSS classes
 */
export function AuthContainer({ children, className = '' }: AuthContainerProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface-level-0">
      <div
        className={`
          w-[418px] h-[540px]
          rounded-[25px]
          bg-surface-level-1
          border border-border-neutral-strong
          flex flex-col items-center justify-center
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
}
