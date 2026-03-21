import Link from 'next/link';

interface EmptyStateProps {
  icon: string;
  heading: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({
  icon,
  heading,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="border border-neutral-weak rounded-lg p-8 text-center bg-surface-level-1">
      <div className="flex flex-col items-center gap-4">
        <div className="text-5xl">{icon}</div>
        <h3 className="text-xl font-semibold text-white">{heading}</h3>
        <p className="text-neutral-default max-w-md">{description}</p>
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            {primaryAction && (
              <Link
                href={primaryAction.href}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-medium transition-colors"
              >
                {primaryAction.label}
              </Link>
            )}
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="text-blue-600 hover:text-blue-800 px-6 py-2 rounded font-medium underline transition-colors"
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
