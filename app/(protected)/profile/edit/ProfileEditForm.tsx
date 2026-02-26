'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { updateProfile } from '@/app/actions/profile'

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
}

export default function ProfileEditForm({ role, profile }: ProfileEditFormProps) {
  const [state, formAction] = useActionState(updateProfile, null)

  if (role === 'SPECIALIST') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-8 leading-tight">Edit Profile</h1>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-error-500/10 border border-error-500/20 text-error-500 rounded p-3">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-white">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              defaultValue={profile?.displayName || ''}
              className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="techStack" className="block text-sm font-medium text-white">
              Tech Stack
            </label>
            <input
              type="text"
              id="techStack"
              name="techStack"
              placeholder="React, TypeScript, Node.js"
              defaultValue={profile?.techStack || ''}
              className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-white">
              Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              defaultValue={profile?.experienceLevel || ''}
              className="mt-1 block w-full rounded border border-gray-600 p-2 bg-navy-800 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Not specified</option>
              <option value="MIDDLE">Middle</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-white">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={profile?.bio || ''}
              className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <SubmitButton />
            <Link
              href="/profile"
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    )
  } else if (role === 'CLIENT') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-8 leading-tight">Edit Profile</h1>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-error-500/10 border border-error-500/20 text-error-500 rounded p-3">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-white">
              Company Name <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              required
              defaultValue={profile?.companyName || ''}
              className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="inn" className="block text-sm font-medium text-white">
              INN <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              id="inn"
              name="inn"
              required
              defaultValue={profile?.inn || ''}
              className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="kpp" className="block text-sm font-medium text-white">
              KPP
            </label>
            <input
              type="text"
              id="kpp"
              name="kpp"
              defaultValue={profile?.kpp || ''}
              className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium text-white">
              Contact Person
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              defaultValue={profile?.contactPerson || ''}
              className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-white">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              defaultValue={profile?.phoneNumber || ''}
              className="mt-1 block w-full rounded border border-gray-600 px-4 py-3 bg-navy-800 text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <SubmitButton />
            <Link
              href="/profile"
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    )
  }

  return <div>Unknown role</div>
}
