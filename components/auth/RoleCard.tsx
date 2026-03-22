import React from 'react';

export interface RoleCardProps {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  'data-testid'?: string;
}

/**
 * RoleCard component for role selection (CLIENT/SPECIALIST)
 * Matches Figma design specs: nodes 4113:481, 4116:396
 *
 * @param icon - 32px icon element
 * @param label - Role label text (17px)
 * @param selected - Whether the card is selected (shows 2px blue border)
 * @param onClick - Click handler
 * @param disabled - Whether the card is disabled
 */
export function RoleCard({
  icon,
  label,
  selected = false,
  onClick,
  disabled = false,
  'data-testid': dataTestId,
}: RoleCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={label}
      data-testid={dataTestId}
      className={`
        w-full
        flex items-center gap-[24px]
        px-[20px] py-[20px]
        rounded-[20px]
        bg-surface-level-2
        transition-all duration-200
        ${selected ? 'border-2 border-border-brand-default' : 'border-2 border-transparent'}
        ${!disabled && !selected ? 'hover:border-border-neutral-weak' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-border-brand-default focus:ring-offset-2 focus:ring-offset-bg-surface-level-1
      `}
    >
      <div className="w-[32px] h-[32px] flex-shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[17px] leading-[32px] text-neutral-strong whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
