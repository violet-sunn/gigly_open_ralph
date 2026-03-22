'use client'

import { useActionState, Suspense } from 'react'
import { useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loginUser } from '@/app/actions/auth'
import { Logo } from '@/lib/assets'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center py-3 px-6 rounded-md text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-surface-level-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {pending ? 'Signing in...' : 'Sign in'}
    </button>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') // 'SPECIALIST' | 'CLIENT' | null
  const [state, formAction] = useActionState(loginUser, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-level-0 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-surface-level-1 border border-neutral-weak rounded-lg shadow-md">
        <div>
          <div className="flex justify-center mb-6">
            <div className="bg-neutral-weak/50 px-3 py-2 rounded-lg">
              <Logo className="h-7" />
            </div>
          </div>
          <h2 className="text-center text-3xl font-bold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-strong">
            Welcome back to Gigly
          </p>
        </div>
        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4">
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
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-500 hover:text-blue-400 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface-level-0">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
