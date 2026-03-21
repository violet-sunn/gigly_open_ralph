interface CharacterCounterProps {
  current: number
  min?: number
  max?: number
  label: string
}

export function CharacterCounter({ current, min, max, label }: CharacterCounterProps) {
  // Determine color based on thresholds
  let colorClass = 'text-neutral-weak'

  if (min !== undefined && current < min) {
    colorClass = 'text-red-600'
  } else if (max !== undefined && current >= max * 0.9) {
    colorClass = 'text-orange-600'
  }

  // Determine display format
  let displayText = ''
  if (min !== undefined) {
    displayText = `${current} / ${min} characters (minimum)`
  } else if (max !== undefined) {
    displayText = `${current} / ${max} characters`
  }

  return (
    <span
      className={`text-sm text-right ${colorClass}`}
      aria-live="polite"
      aria-label={label}
    >
      {displayText}
    </span>
  )
}
