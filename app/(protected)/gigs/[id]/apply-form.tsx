'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { applyToGig } from '@/app/actions/gig'
import FirstTimeTooltip from '@/app/components/onboarding/FirstTimeTooltip'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-3 px-6 rounded-md text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {pending ? 'Submitting application...' : 'Submit Application'}
    </button>
  )
}

export function ApplyForm({ gigId }: { gigId: string }) {
  const [state, formAction] = useActionState(applyToGig, null)
  const [approachCount, setApproachCount] = useState(0)
  const [questionsCount, setQuestionsCount] = useState(0)
  const [effortCount, setEffortCount] = useState(0)

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="gigId" value={gigId} />
      {state?.error && (
        <div className="rounded-md bg-error-500/10 border border-error-500/20 p-4">
          <p className="text-sm text-error-400">{state.error}</p>
        </div>
      )}

      <FirstTimeTooltip
        storageKey="onboarding_application_seen"
        message="💡 Tip: Focus on your technical approach and ask clarifying questions. Clients value substance over sales pitches!"
      />

      {/* Technical Approach */}
      <div>
        <label htmlFor="approach" className="block text-sm font-medium text-white">
          Technical Approach / Methodology <span className="text-error-400">*</span>
        </label>
        <p className="text-xs text-neutral-strong mt-1 leading-relaxed">
          How will you approach this work? What methodology, tools, or architecture will you use? Be specific about your technical plan.
        </p>
        <textarea
          id="approach"
          name="approach"
          rows={6}
          minLength={100}
          maxLength={2000}
          required
          onChange={(e) => setApproachCount(e.target.value.length)}
          className="mt-2 block w-full rounded-md bg-surface-level-1 border border-neutral-weak text-white px-4 py-3 placeholder:text-neutral-weak focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
          placeholder="How will you approach this work? What methodology, tools, or architecture will you use? Be specific about your technical plan."
        />
        <p className="text-xs text-neutral-strong mt-1">
          {approachCount} / 2000 characters (minimum 100)
        </p>
      </div>

      {/* Clarifying Questions */}
      <div>
        <label htmlFor="questions" className="block text-sm font-medium text-white">
          Clarifying Questions <span className="text-error-400">*</span>
        </label>
        <p className="text-xs text-neutral-strong mt-1 leading-relaxed">
          What questions do you have about the requirements? What needs clarification before you can provide an accurate estimate?
        </p>
        <textarea
          id="questions"
          name="questions"
          rows={4}
          minLength={50}
          maxLength={1000}
          required
          onChange={(e) => setQuestionsCount(e.target.value.length)}
          className="mt-2 block w-full rounded-md bg-surface-level-1 border border-neutral-weak text-white px-4 py-3 placeholder:text-neutral-weak focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
          placeholder="What questions do you have about the requirements? What needs clarification before you can provide an accurate estimate?"
        />
        <p className="text-xs text-neutral-strong mt-1">
          {questionsCount} / 1000 characters (minimum 50)
        </p>
      </div>

      {/* Estimated Effort */}
      <div>
        <label htmlFor="estimatedEffort" className="block text-sm font-medium text-white">
          Estimated Effort <span className="text-neutral-strong">(optional)</span>
        </label>
        <p className="text-xs text-neutral-strong mt-1 leading-relaxed">
          How long do you estimate this will take?
        </p>
        <textarea
          id="estimatedEffort"
          name="estimatedEffort"
          rows={2}
          maxLength={200}
          onChange={(e) => setEffortCount(e.target.value.length)}
          className="mt-2 block w-full rounded-md bg-surface-level-1 border border-neutral-weak text-white px-4 py-3 placeholder:text-neutral-weak focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
          placeholder="e.g., '2-3 weeks', '40 hours', 'depends on answers to questions above'"
        />
        <p className="text-xs text-neutral-strong mt-1">
          {effortCount} / 200 characters
        </p>
      </div>

      <SubmitButton />
    </form>
  )
}
