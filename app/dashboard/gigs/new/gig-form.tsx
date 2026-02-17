'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createGig } from '@/app/actions/gig'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Posting...' : 'Post Gig'}
    </button>
  )
}

function formatRoubles(amount: number): string {
  return new Intl.NumberFormat('ru-RU').format(amount)
}

export function GigForm() {
  const [state, formAction] = useActionState(createGig, null)
  const [budget, setBudget] = useState('')

  const budgetNum = Number(budget)
  const showPreview = budgetNum > 0 && Number.isFinite(budgetNum)
  const fee = showPreview ? Math.floor(budgetNum * 0.20) : 0
  const total = showPreview ? budgetNum + fee : 0

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          placeholder="e.g. Build a React dashboard"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          placeholder="Describe the scope of work in detail..."
        />
      </div>

      <div>
        <label htmlFor="acceptanceCriteria" className="block text-sm font-medium text-gray-700">
          Definition of Done (Acceptance Criteria) *
        </label>
        <textarea
          id="acceptanceCriteria"
          name="acceptanceCriteria"
          required
          rows={5}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          placeholder="What does 'done' look like? Be specific: deliverables, quality standards, success metrics. Example: 'API returns user data in JSON format with <200ms response time, includes unit tests with >80% coverage, deployed to staging environment.'"
        />
        <p className="mt-1 text-sm text-gray-500">
          Minimum 50 characters. Clear criteria prevent disputes and scope creep.
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-base font-medium text-gray-900 mb-4">Additional Details (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Help specialists understand your needs better by providing more context.
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
              Goal / Desired Outcome
            </label>
            <textarea
              id="goal"
              name="goal"
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="Example: We need to migrate our user authentication from custom solution to OAuth 2.0 to improve security and reduce maintenance burden."
            />
            <p className="mt-1 text-sm text-gray-500">
              Optional: Describe the business or technical problem you&apos;re solving. What does success look like?
            </p>
          </div>

          <div>
            <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700">
              Specific Deliverables
            </label>
            <textarea
              id="deliverables"
              name="deliverables"
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="Example: 1. OAuth 2.0 integration with Google and GitHub&#10;2. Migration script for existing users&#10;3. Updated documentation&#10;4. Deployment to staging and production"
            />
            <p className="mt-1 text-sm text-gray-500">
              Optional: List concrete outputs you expect (features, documentation, deployments, etc.)
            </p>
          </div>

          <div>
            <label htmlFor="constraints" className="block text-sm font-medium text-gray-700">
              Constraints & Preferences
            </label>
            <textarea
              id="constraints"
              name="constraints"
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="Example: Must maintain backward compatibility with existing API endpoints. Prefer using Passport.js library. Deadline: end of Q1 2026."
            />
            <p className="mt-1 text-sm text-gray-500">
              Optional: Technical preferences, timeline considerations, compatibility requirements, or other constraints.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
          Budget (₽)
        </label>
        <input
          id="budget"
          name="budget"
          type="number"
          required
          min="1"
          step="1"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          placeholder="100000"
        />
      </div>

      {showPreview && (
        <div className="rounded-md bg-gray-50 p-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Budget:</span>
            <span className="font-medium">{formatRoubles(budgetNum)} ₽</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service fee (20%):</span>
            <span className="font-medium">{formatRoubles(fee)} ₽</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-1">
            <span className="text-gray-900 font-medium">Total:</span>
            <span className="font-bold">{formatRoubles(total)} ₽</span>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags <span className="text-gray-400">(optional, comma-separated)</span>
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          placeholder="React, TypeScript, Node.js"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
