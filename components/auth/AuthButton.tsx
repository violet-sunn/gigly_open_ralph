import React from 'react';

export interface AuthButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * AuthButton component - primary and secondary button variants
 * Matches Figma design specs: 50px height, 10px border-radius
 * Primary: #0088FF background
 * Secondary: rgba(0,136,255,0.24) background
 *
 * @param variant - Button style variant ('primary' or 'secondary')
 * @param children - Button content
 * @param onClick - Click handler
 * @param disabled - Whether the button is disabled
 * @param type - Button type attribute
 */
export function AuthButton({
  variant,
  children,
  onClick,
  disabled = false,
  type = 'button',
}: AuthButtonProps) {
  const baseClasses = `
    w-full h-[50px]
    rounded-[10px]
    font-bold text-[19px]
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: `
      bg-[#0088FF]
      text-white
      hover:bg-[#0077ee]
      active:bg-[#0066dd]
      focus:ring-border-brand-default
      focus:ring-offset-bg-surface-level-1
    `,
    secondary: `
      bg-[rgba(0,136,255,0.24)]
      text-brand-default
      hover:bg-[rgba(0,136,255,0.32)]
      active:bg-[rgba(0,136,255,0.40)]
      focus:ring-border-brand-default
      focus:ring-offset-bg-surface-level-1
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
