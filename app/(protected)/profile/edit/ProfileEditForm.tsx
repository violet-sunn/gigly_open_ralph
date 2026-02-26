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
      className="bg-primary text-primary-foreground px-6 py-3 rounded hover:bg-primary/90 disabled:opacity-50 transition-colors duration-200"
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
        <h1 className="text-3xl font-bold text-foreground mb-8 leading-tight">Edit Profile</h1>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded p-3">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-muted-foreground">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              defaultValue={profile?.displayName || ''}
              className="mt-1 block w-full rounded border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="techStack" className="block text-sm font-medium text-muted-foreground">
              Tech Stack
            </label>
            <input
              type="text"
              id="techStack"
              name="techStack"
              placeholder="React, TypeScript, Node.js"
              defaultValue={profile?.techStack || ''}
              className="mt-1 block w-full rounded border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-muted-foreground">
              Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              defaultValue={profile?.experienceLevel || ''}
              className="mt-1 block w-full rounded border border-input p-2 bg-input text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Not specified</option>
              <option value="MIDDLE">Middle</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-muted-foreground">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={profile?.bio || ''}
              className="mt-1 block w-full rounded border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex gap-4">
            <SubmitButton />
            <Link
              href="/profile"
              className="px-4 py-2 text-muted-foreground hover:text-foreground"
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
        <h1 className="text-3xl font-bold text-foreground mb-8 leading-tight">Edit Profile</h1>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded p-3">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-muted-foreground">
              Company Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              required
              defaultValue={profile?.companyName || ''}
              className="mt-1 block w-full rounded border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="inn" className="block text-sm font-medium text-muted-foreground">
              INN <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="inn"
              name="inn"
              required
              defaultValue={profile?.inn || ''}
              className="mt-1 block w-full rounded border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="kpp" className="block text-sm font-medium text-muted-foreground">
              KPP
            </label>
            <input
              type="text"
              id="kpp"
              name="kpp"
              defaultValue={profile?.kpp || ''}
              className="mt-1 block w-full rounded border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium text-muted-foreground">
              Contact Person
            </label>
            <input
              type="text"
              id="contactPerson"
              name="contactPerson"
              defaultValue={profile?.contactPerson || ''}
              className="mt-1 block w-full rounded border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-muted-foreground">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              defaultValue={profile?.phoneNumber || ''}
              className="mt-1 block w-full rounded border border-input px-4 py-3 bg-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex gap-4">
            <SubmitButton />
            <Link
              href="/profile"
              className="px-4 py-2 text-muted-foreground hover:text-foreground"
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
