'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createGig } from '@/app/actions/gig'
import { dismissGuidance } from '@/app/actions/user'
import { CharacterCounter } from './character-counter'
import { AcceptanceCriteriaQualityWarning } from '@/app/components/AcceptanceCriteriaQualityWarning'
import FirstTimeTooltip from '@/app/components/onboarding/FirstTimeTooltip'
import { HelpBanner } from '@/app/components/ui/HelpBanner'
import { Tooltip } from '@/app/components/ui/Tooltip'
import { InfoIcon } from '@/app/components/ui/InfoIcon'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {pending ? 'Posting gig...' : 'Post Gig'}
    </button>
  )
}

function formatRoubles(amount: number): string {
  return new Intl.NumberFormat('ru-RU').format(amount)
}

interface GigFormProps {
  showGuidance: boolean
}

export function GigForm({ showGuidance }: GigFormProps) {
  const [state, formAction] = useActionState(createGig, null)
  const [budget, setBudget] = useState('')
  const [guidanceVisible, setGuidanceVisible] = useState(showGuidance)

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

  const handleDismissGuidance = async () => {
    setGuidanceVisible(false)
    await dismissGuidance('gigCreation')
  }

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="rounded-md bg-error-500/10 border border-error-500/20 p-4">
          <p className="text-sm text-error-500">{state.error}</p>
        </div>
      )}

      {guidanceVisible && (
        <HelpBanner onDismiss={handleDismissGuidance}>
          Creating your first gig? Clear requirements lead to better applications. Define what success looks like, provide context, and check out{' '}
          <a
            href="/gigs/examples"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline hover:text-blue-800"
          >
            example gigs
          </a>{' '}
          for inspiration.
        </HelpBanner>
      )}

      <FirstTimeTooltip
        storageKey="onboarding_gig_creation_seen"
        message="💡 Tip: Be specific about your requirements and Definition of Done to attract quality specialists. Check out example gigs for inspiration!"
      />

      {/* Section 1: Basic Information */}
      <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-8 shadow-md">
        <h3 className="text-xl font-semibold text-white mb-2">Basic Information</h3>
        <p className="text-sm text-neutral-strong mb-4">
          Provide a clear title and overview of the work
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-neutral-weak px-4 py-3 bg-surface-level-1 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g. Build a React dashboard"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="mt-1 block w-full rounded-md border border-neutral-weak px-4 py-3 bg-surface-level-1 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="Describe the scope of work in detail..."
            />
          </div>
        </div>
      </div>

      {/* Section 2: Requirements & Success Criteria */}
      <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-8 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-white">Requirements &amp; Success Criteria</h3>
          <a
            href="/gigs/examples?from=dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-400 underline"
          >
            💡 View example gigs for inspiration
          </a>
        </div>
        <p className="text-sm text-neutral-strong mb-4">
          Define what success looks like and help specialists understand your needs
        </p>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <label htmlFor="acceptanceCriteria" className="block text-sm font-medium text-white">
                Definition of Done (Acceptance Criteria) *
              </label>
              <Tooltip content="Specific, measurable criteria that define when the work is complete. Example: 'API returns user data in JSON format with <200ms response time.'">
                <InfoIcon />
              </Tooltip>
            </div>
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
              className="mt-1 block w-full rounded-md border border-neutral-weak px-4 py-3 bg-surface-level-1 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="What does 'done' look like? Be specific: deliverables, quality standards, success metrics. Example: 'API returns user data in JSON format with <200ms response time, includes unit tests with >80% coverage, deployed to staging environment.'"
            />
            <AcceptanceCriteriaQualityWarning
              characterCount={acceptanceCriteriaCount}
              hasInteracted={acHasInteracted}
            />
            <div className="mt-1 flex justify-between items-start">
              <p className="text-sm text-neutral-strong">
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
            <div className="flex items-center gap-2">
              <label htmlFor="goal" className="block text-sm font-medium text-white">
                Goal / Desired Outcome
              </label>
              <Tooltip content="What problem are you solving? Why does this work matter? Helps specialists understand the bigger picture.">
                <InfoIcon />
              </Tooltip>
            </div>
            <textarea
              id="goal"
              name="goal"
              rows={3}
              onChange={(e) => setGoalCount(e.target.value.length)}
              className="mt-1 block w-full rounded-md border border-neutral-weak px-4 py-3 bg-surface-level-1 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="Example: We need to migrate our user authentication from custom solution to OAuth 2.0 to improve security and reduce maintenance burden."
            />
            <div className="mt-1 flex justify-between items-start">
              <p className="text-sm text-neutral-strong">
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
            <div className="flex items-center gap-2">
              <label htmlFor="deliverables" className="block text-sm font-medium text-white">
                Specific Deliverables
              </label>
              <Tooltip content="What specific outputs do you expect? (e.g., 'Working API endpoint', 'Updated documentation', 'Test coverage report')">
                <InfoIcon />
              </Tooltip>
            </div>
            <textarea
              id="deliverables"
              name="deliverables"
              rows={3}
              onChange={(e) => setDeliverablesCount(e.target.value.length)}
              className="mt-1 block w-full rounded-md border border-neutral-weak px-4 py-3 bg-surface-level-1 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="Example: 1. OAuth 2.0 integration with Google and GitHub&#10;2. Migration script for existing users&#10;3. Updated documentation&#10;4. Deployment to staging and production"
            />
            <div className="mt-1 flex justify-between items-start">
              <p className="text-sm text-neutral-strong">
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
            <div className="flex items-center gap-2">
              <label htmlFor="constraints" className="block text-sm font-medium text-white">
                Constraints &amp; Preferences
              </label>
              <Tooltip content="Any technical preferences, deadlines, or limitations? (e.g., 'Must use TypeScript', 'Deadline: 2 weeks', 'No external dependencies')">
                <InfoIcon />
              </Tooltip>
            </div>
            <textarea
              id="constraints"
              name="constraints"
              rows={3}
              onChange={(e) => setConstraintsCount(e.target.value.length)}
              className="mt-1 block w-full rounded-md border border-neutral-weak px-4 py-3 bg-surface-level-1 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="Example: Must maintain backward compatibility with existing API endpoints. Prefer using Passport.js library. Deadline: end of Q1 2026."
            />
            <div className="mt-1 flex justify-between items-start">
              <p className="text-sm text-neutral-strong">
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
      <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-white mb-2">Budget &amp; Details</h3>
        <p className="text-sm text-neutral-strong mb-4">
          Set your budget and add tags to help specialists find your gig
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-white">
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
              className="mt-1 block w-full rounded-md border border-neutral-weak px-4 py-3 bg-surface-level-1 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="100000"
            />
          </div>

          {showPreview && (
            <div className="rounded-md bg-surface-level-1 border border-neutral-weak p-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-strong">Budget:</span>
                <span className="font-medium text-white">{formatRoubles(budgetNum)} ₽</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-strong">Service fee (10%):</span>
                  <Tooltip content="Gigly charges a 10% service fee on top of your budget. You pay budget + 10%, the specialist receives the full budget amount.">
                    <InfoIcon />
                  </Tooltip>
                </div>
                <span className="font-medium text-white">{formatRoubles(fee)} ₽</span>
              </div>
              <div className="flex justify-between border-t border-neutral-weak pt-1">
                <span className="text-white font-medium">Total:</span>
                <span className="font-bold text-white">{formatRoubles(total)} ₽</span>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-white">
              Tags <span className="text-neutral-weak">(optional, comma-separated)</span>
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              className="mt-1 block w-full rounded-md border border-neutral-weak px-4 py-3 bg-surface-level-1 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="React, TypeScript, Node.js"
            />
          </div>
        </div>
      </div>

      <SubmitButton />
    </form>
  )
}
