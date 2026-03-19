'use client'

interface AcceptanceCriteriaQualityWarningProps {
  characterCount: number;
  hasInteracted: boolean;
}

export function AcceptanceCriteriaQualityWarning({
  characterCount,
  hasInteracted
}: AcceptanceCriteriaQualityWarningProps) {
  const shouldShow = characterCount >= 50 && characterCount < 150 && hasInteracted;

  if (!shouldShow) return null;

  return (
    <div
      className="bg-warning-500/10 border border-warning-500/20 text-warning-200 rounded-md p-3 mb-2 transition-opacity duration-200"
      aria-live="polite"
      role="status"
    >
      💡 Consider adding more detail to prevent disputes. What specific deliverables, quality standards, or success metrics define &apos;done&apos;?
    </div>
  );
}
