'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { sendMessage } from '@/app/actions/gig'
import FirstTimeTooltip from '@/app/components/onboarding/FirstTimeTooltip'

interface MessageFormProps {
  gigId: string
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-3 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {pending ? 'Sending message...' : 'Send Message'}
    </button>
  )
}

export function MessageForm({ gigId }: MessageFormProps) {
  const [state, formAction] = useActionState(sendMessage, null)

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="gigId" value={gigId} />

      {state?.error && (
        <div className="p-3 bg-error-500/10 border border-error-500/20 rounded-md">
          <p className="text-sm text-error-400">{state.error}</p>
        </div>
      )}

      <FirstTimeTooltip
        storageKey="onboarding_messaging_seen"
        message="💡 Tip: Keep communication professional and on-topic. All messages are visible to both parties and may be reviewed in disputes."
      />

      <textarea
        name="content"
        required
        maxLength={2000}
        rows={3}
        placeholder="Type your message..."
        className="w-full px-4 py-3 bg-surface-level-1 border border-neutral-weak text-white rounded-md placeholder:text-neutral-weak focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />

      <SubmitButton />
    </form>
  )
}
