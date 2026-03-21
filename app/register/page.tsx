'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { registerUser } from '@/app/actions/auth'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-3 px-6 rounded-md text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {pending ? 'Signing up...' : 'Sign up'}
    </button>
  )
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-level-0 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-strong">
            Sign up to get started with Gigly
          </p>
        </div>
        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                I am a
              </label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="role" value="CLIENT" className="peer sr-only" required />
                  <div className="p-3 text-center border border-neutral-weak rounded-md peer-checked:border-blue-500 peer-checked:bg-blue-500/10 peer-checked:text-blue-500 hover:bg-navy-700 transition-colors">
                    <span className="text-sm font-medium">Client</span>
                    <p className="text-xs text-neutral-weak mt-1">Post gigs, hire specialists</p>
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="role" value="SPECIALIST" className="peer sr-only" required />
                  <div className="p-3 text-center border border-neutral-weak rounded-md peer-checked:border-blue-500 peer-checked:bg-blue-500/10 peer-checked:text-blue-500 hover:bg-navy-700 transition-colors">
                    <span className="text-sm font-medium">Specialist</span>
                    <p className="text-xs text-neutral-weak mt-1">Browse gigs, get hired</p>
                  </div>
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-4 py-3 bg-surface-level-1 border border-neutral-weak text-white rounded-md placeholder:text-neutral-weak focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-4 py-3 bg-surface-level-1 border border-neutral-weak text-white rounded-md placeholder:text-neutral-weak focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          {state?.error && (
            <p className="text-sm text-error-500">{state.error}</p>
          )}
          <div>
            <SubmitButton />
          </div>
        </form>
        <p className="text-center text-sm text-neutral-strong">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
