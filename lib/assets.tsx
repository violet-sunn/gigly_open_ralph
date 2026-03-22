import React from 'react'

interface IconProps {
  className?: string
}

export function SpecialistIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-label="Specialist role icon"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="11" r="5" fill="currentColor" />
      <path
        d="M16 18c-6 0-10 3-10 7v2h20v-2c0-4-4-7-10-7z"
        fill="currentColor"
      />
    </svg>
  )
}

export function ClientIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-label="Client role icon"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26 10h-6V8c0-2.2-1.8-4-4-4s-4 1.8-4 4v2H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V12c0-1.1-.9-2-2-2zm-12-2c0-1.1.9-2 2-2s2 .9 2 2v2h-4V8zm12 18H6V12h20v14z"
        fill="currentColor"
      />
      <path d="M16 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor" />
    </svg>
  )
}

export function Logo({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 146 29"
      aria-label="Gigly logo"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="10"
        y="22"
        fontFamily="monospace"
        fontSize="24"
        fontWeight="bold"
        fill="white"
        letterSpacing="2"
      >
        GIGLY
      </text>
    </svg>
  )
}

export const BACKGROUND_PATTERN_PATH = '/assets/auth/background-pattern.svg'
