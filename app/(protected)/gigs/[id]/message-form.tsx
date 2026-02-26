'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { sendMessage } from '@/app/actions/gig'

interface MessageFormProps {
  gigId: string
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  )
}

export function MessageForm({ gigId }: MessageFormProps) {
  const [state, formAction] = useActionState(sendMessage, null)

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="gigId" value={gigId} />

      {state?.error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{state.error}</p>
        </div>
      )}

      <textarea
        name="content"
        required
        maxLength={2000}
        rows={3}
        placeholder="Type your message..."
        className="w-full px-4 py-3 bg-input border border-input text-foreground rounded-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
      />

      <SubmitButton />
    </form>
  )
}
