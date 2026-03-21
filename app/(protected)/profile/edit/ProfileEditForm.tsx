'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { updateProfile } from '@/app/actions/profile'
import ProfileEditHeader from './ProfileEditHeader'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50 transition-colors duration-200 font-medium focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-navy-900"
    >
      {pending ? 'Saving...' : 'Save Profile'}
    </button>
  )
}

interface ProfileEditFormProps {
  role: string
  profile: any
  email: string
}

export default function ProfileEditForm({ role, profile, email }: ProfileEditFormProps) {
  const [state, formAction] = useActionState(updateProfile, null)

  // Determine display name for header
  const displayName = role === 'SPECIALIST'
    ? (profile?.displayName || null)
    : (profile?.companyName || null)

  if (role === 'SPECIALIST') {
    return (
      <div className="min-h-screen bg-[var(--bg-surface-level-0)] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <ProfileEditHeader
            displayName={displayName}
            email={email}
            role="SPECIALIST"
          />

          {/* Form */}
          <form action={formAction}>
            {state?.error && (
              <div className="bg-error-500/10 border border-error-500/20 text-error-500 rounded p-3 mb-6">
                {state.error}
              </div>
            )}

            {/* 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md space-y-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-neutral-strong">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    defaultValue={profile?.displayName || ''}
                    className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="techStack" className="block text-sm font-medium text-neutral-strong">
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    id="techStack"
                    name="techStack"
                    placeholder="React, TypeScript, Node.js"
                    defaultValue={profile?.techStack || ''}
                    className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-neutral-strong">
                    Experience Level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    defaultValue={profile?.experienceLevel || ''}
                    className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Not specified</option>
                    <option value="MIDDLE">Middle</option>
                    <option value="SENIOR">Senior</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md">
                <label htmlFor="bio" className="block text-sm font-medium text-neutral-strong">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={12}
                  defaultValue={profile?.bio || ''}
                  className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <SubmitButton />
              <Link
                href="/profile"
                className="px-4 py-2 text-neutral-weak hover:text-neutral-strong"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    )
  } else if (role === 'CLIENT') {
    return (
      <div className="min-h-screen bg-[var(--bg-surface-level-0)] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <ProfileEditHeader
            displayName={displayName}
            email={email}
            role="CLIENT"
          />

          {/* Form */}
          <form action={formAction}>
            {state?.error && (
              <div className="bg-error-500/10 border border-error-500/20 text-error-500 rounded p-3 mb-6">
                {state.error}
              </div>
            )}

            {/* 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md space-y-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-neutral-strong">
                    Company Name <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    defaultValue={profile?.companyName || ''}
                    className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="inn" className="block text-sm font-medium text-neutral-strong">
                    INN <span className="text-error-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="inn"
                    name="inn"
                    required
                    defaultValue={profile?.inn || ''}
                    className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="kpp" className="block text-sm font-medium text-neutral-strong">
                    KPP
                  </label>
                  <input
                    type="text"
                    id="kpp"
                    name="kpp"
                    defaultValue={profile?.kpp || ''}
                    className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="bg-surface-level-1 border border-neutral-weak rounded-lg p-6 shadow-md space-y-6">
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-neutral-strong">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    defaultValue={profile?.contactPerson || ''}
                    className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-strong">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    defaultValue={profile?.phoneNumber || ''}
                    className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-neutral-weak focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <SubmitButton />
              <Link
                href="/profile"
                className="px-4 py-2 text-neutral-weak hover:text-neutral-strong"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return <div>Unknown role</div>
}
