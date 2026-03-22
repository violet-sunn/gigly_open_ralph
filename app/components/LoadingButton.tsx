'use client'

import { useFormStatus } from 'react-dom'

interface LoadingButtonProps {
  loadingText: string
  defaultText: string
  variant?: 'primary' | 'secondary' | 'danger'
  className?: string
}

export function LoadingButton({
  loadingText,
  defaultText,
  variant = 'primary',
  className = ''
}: LoadingButtonProps) {
  const { pending } = useFormStatus()

  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-surface-level-1 hover:bg-surface-level-2 text-white border border-neutral-weak',
    danger: 'bg-error-500 hover:bg-error-600 text-white'
  }

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full flex justify-center py-3 px-6 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${variantClasses[variant]} ${className}`}
    >
      {pending ? loadingText : defaultText}
    </button>
  )
}
