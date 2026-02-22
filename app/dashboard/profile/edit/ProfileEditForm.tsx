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
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
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
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              defaultValue={profile?.displayName || ''}
              className="mt-1 block w-full rounded border-gray-300 border p-2"
            />
          </div>

          <div>
            <label htmlFor="techStack" className="block text-sm font-medium text-gray-700">
              Tech Stack
            </label>
            <input
              type="text"
              id="techStack"
              name="techStack"
              placeholder="React, TypeScript, Node.js"
              defaultValue={profile?.techStack || ''}
              className="mt-1 block w-full rounded border-gray-300 border p-2"
            />
          </div>

          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
              Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              defaultValue={profile?.experienceLevel || ''}
              className="mt-1 block w-full rounded border-gray-300 border p-2"
            >
              <option value="">Not specified</option>
              <option value="MIDDLE">Middle</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={profile?.bio || ''}
              className="mt-1 block w-full rounded border-gray-300 border p-2"
            />
          </div>

          <div className="flex gap-4">
            <SubmitButton />
            <Link
              href="/dashboard/profile"
              className="px-4 py-2 text-gray-700 hover:underline"
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
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded p-3">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              required
              defaultValue={profile?.companyName || ''}
              className="mt-1 block w-full rounded border-gray-300 border p-2"
            />
          </div>

          <div>
            <label htmlFor="inn" className="block text-sm font-medium text-gray-700">
              INN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="inn"
              name="inn"
              required
              defaultValue={profile?.inn || ''}
              className="mt-1 block w-full rounded border-gray-300 border p-2"
            />
          </div>

          <div>
            <label htmlFor="kpp" className="block text-sm font-medium text-gray-700">
              KPP
            </label>
            <input
              type="text"
              id="kpp"
              name="kpp"
              defaultValue={profile?.kpp || ''}
              className="mt-1 block w-full rounded border-gray-300 border p-2"
            />
          </div>

          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
              Contact Person
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              defaultValue={profile?.contactPerson || ''}
              className="mt-1 block w-full rounded border-gray-300 border p-2"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              defaultValue={profile?.phoneNumber || ''}
              className="mt-1 block w-full rounded border-gray-300 border p-2"
            />
          </div>

          <div className="flex gap-4">
            <SubmitButton />
            <Link
              href="/dashboard/profile"
              className="px-4 py-2 text-gray-700 hover:underline"
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
