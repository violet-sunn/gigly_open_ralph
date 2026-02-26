'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createGig } from '@/app/actions/gig'
import { CharacterCounter } from './character-counter'
import { AcceptanceCriteriaQualityWarning } from '@/app/components/AcceptanceCriteriaQualityWarning'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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

  // Character count state for textarea fields
  const [acceptanceCriteriaCount, setAcceptanceCriteriaCount] = useState(0)
  const [acHasInteracted, setAcHasInteracted] = useState(false)
  const [goalCount, setGoalCount] = useState(0)
  const [deliverablesCount, setDeliverablesCount] = useState(0)
  const [constraintsCount, setConstraintsCount] = useState(0)

  const budgetNum = Number(budget)
  const showPreview = budgetNum > 0 && Number.isFinite(budgetNum)
  const fee = showPreview ? Math.floor(budgetNum * 0.10) : 0
  const total = showPreview ? budgetNum + fee : 0

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
          <p className="text-sm text-destructive">{state.error}</p>
        </div>
      )}

      {/* Section 1: Basic Information */}
      <div className="bg-card border border-border rounded-lg p-8">
        <h3 className="text-xl font-semibold text-foreground mb-2">Basic Information</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Provide a clear title and overview of the work
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-muted-foreground">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm"
              placeholder="e.g. Build a React dashboard"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="mt-1 block w-full rounded-md border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm"
              placeholder="Describe the scope of work in detail..."
            />
          </div>
        </div>
      </div>

      {/* Section 2: Requirements & Success Criteria */}
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-foreground">Requirements &amp; Success Criteria</h3>
          <a
            href="/gigs/examples"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:text-primary/90 underline"
          >
            💡 View example gigs for inspiration
          </a>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Define what success looks like and help specialists understand your needs
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="acceptanceCriteria" className="block text-sm font-medium text-muted-foreground">
              Definition of Done (Acceptance Criteria) *
            </label>
            <textarea
              id="acceptanceCriteria"
              name="acceptanceCriteria"
              required
              rows={5}
              onChange={(e) => {
                setAcceptanceCriteriaCount(e.target.value.length)
                if (!acHasInteracted) {
                  setAcHasInteracted(true)
                }
              }}
              className="mt-1 block w-full rounded-md border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm"
              placeholder="What does 'done' look like? Be specific: deliverables, quality standards, success metrics. Example: 'API returns user data in JSON format with <200ms response time, includes unit tests with >80% coverage, deployed to staging environment.'"
            />
            <AcceptanceCriteriaQualityWarning
              characterCount={acceptanceCriteriaCount}
              hasInteracted={acHasInteracted}
            />
            <div className="mt-1 flex justify-between items-start">
              <p className="text-sm text-muted-foreground">
                Minimum 50 characters. Clear criteria prevent disputes and scope creep.
              </p>
              <CharacterCounter
                current={acceptanceCriteriaCount}
                min={50}
                label="Acceptance criteria character count"
              />
            </div>
          </div>

          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-muted-foreground">
              Goal / Desired Outcome
            </label>
            <textarea
              id="goal"
              name="goal"
              rows={3}
              onChange={(e) => setGoalCount(e.target.value.length)}
              className="mt-1 block w-full rounded-md border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm"
              placeholder="Example: We need to migrate our user authentication from custom solution to OAuth 2.0 to improve security and reduce maintenance burden."
            />
            <div className="mt-1 flex justify-between items-start">
              <p className="text-sm text-muted-foreground">
                Optional: Describe the business or technical problem you&apos;re solving. What does success look like?
              </p>
              <CharacterCounter
                current={goalCount}
                max={1000}
                label="Goal character count"
              />
            </div>
          </div>

          <div>
            <label htmlFor="deliverables" className="block text-sm font-medium text-muted-foreground">
              Specific Deliverables
            </label>
            <textarea
              id="deliverables"
              name="deliverables"
              rows={3}
              onChange={(e) => setDeliverablesCount(e.target.value.length)}
              className="mt-1 block w-full rounded-md border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm"
              placeholder="Example: 1. OAuth 2.0 integration with Google and GitHub&#10;2. Migration script for existing users&#10;3. Updated documentation&#10;4. Deployment to staging and production"
            />
            <div className="mt-1 flex justify-between items-start">
              <p className="text-sm text-muted-foreground">
                Optional: List concrete outputs you expect (features, documentation, deployments, etc.)
              </p>
              <CharacterCounter
                current={deliverablesCount}
                max={1000}
                label="Deliverables character count"
              />
            </div>
          </div>

          <div>
            <label htmlFor="constraints" className="block text-sm font-medium text-muted-foreground">
              Constraints &amp; Preferences
            </label>
            <textarea
              id="constraints"
              name="constraints"
              rows={3}
              onChange={(e) => setConstraintsCount(e.target.value.length)}
              className="mt-1 block w-full rounded-md border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm"
              placeholder="Example: Must maintain backward compatibility with existing API endpoints. Prefer using Passport.js library. Deadline: end of Q1 2026."
            />
            <div className="mt-1 flex justify-between items-start">
              <p className="text-sm text-muted-foreground">
                Optional: Technical preferences, timeline considerations, compatibility requirements, or other constraints.
              </p>
              <CharacterCounter
                current={constraintsCount}
                max={1000}
                label="Constraints character count"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Budget & Details */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Budget &amp; Details</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Set your budget and add tags to help specialists find your gig
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-muted-foreground">
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
              className="mt-1 block w-full rounded-md border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm"
              placeholder="100000"
            />
          </div>

          {showPreview && (
            <div className="rounded-md bg-background border border-border p-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget:</span>
                <span className="font-medium text-foreground">{formatRoubles(budgetNum)} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service fee (10%):</span>
                <span className="font-medium text-foreground">{formatRoubles(fee)} ₽</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1">
                <span className="text-foreground font-medium">Total:</span>
                <span className="font-bold text-foreground">{formatRoubles(total)} ₽</span>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-muted-foreground">
              Tags <span className="text-muted-foreground/60">(optional, comma-separated)</span>
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              className="mt-1 block w-full rounded-md border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring sm:text-sm"
              placeholder="React, TypeScript, Node.js"
            />
          </div>
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}
