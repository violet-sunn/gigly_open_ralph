import { pluralRu } from "@/lib/utils/plural";

interface CharacterCounterProps {
  current: number;
  min?: number;
  max?: number;
  /** Accessible label (Russian), e.g. «Счётчик символов описания». */
  label: string;
}

/**
 * Live, Russian-localized character counter for the gig create/edit forms. Rendered under the description and
 * acceptance-criteria fields (min) and any max-bounded field. Skinned with gigly_full_design tokens (inline styles,
 * Manrope, right-aligned) to match CreateGigDesign — NOT the old kit classes. Advisory only; the server
 * (parseGigForm) remains the source of truth.
 */
export function CharacterCounter({ current, min, max, label }: CharacterCounterProps) {
  const belowMin = min !== undefined && current < min;
  const nearMax = max !== undefined && current >= max * 0.9;
  const color = belowMin || nearMax ? "#f59e0b" : "var(--text-4)";

  const ref = min ?? max ?? 0;
  const noun = pluralRu(ref, ["символ", "символа", "символов"]);
  let text = "";
  if (min !== undefined) {
    text = `${current} / ${min} ${noun}`;
  } else if (max !== undefined) {
    text = `${current} / ${max} ${noun}`;
  }

  return (
    <span
      aria-live="polite"
      aria-label={label}
      style={{
        fontFamily: "'Manrope',sans-serif",
        fontSize: 12,
        lineHeight: "16px",
        textAlign: "right",
        color,
      }}
    >
      {text}
    </span>
  );
}
