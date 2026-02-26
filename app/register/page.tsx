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
      className="w-full flex justify-center py-3 px-6 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {pending ? 'Signing up...' : 'Sign up'}
    </button>
  )
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-card border border-border rounded-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign up to get started with Gigly
          </p>
        </div>
        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                I am a
              </label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="role" value="CLIENT" className="peer sr-only" required />
                  <div className="p-3 text-center border border-input rounded-md peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary hover:bg-accent transition-colors">
                    <span className="text-sm font-medium">Client</span>
                    <p className="text-xs text-muted-foreground mt-1">Post gigs, hire specialists</p>
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="role" value="SPECIALIST" className="peer sr-only" required />
                  <div className="p-3 text-center border border-input rounded-md peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary hover:bg-accent transition-colors">
                    <span className="text-sm font-medium">Specialist</span>
                    <p className="text-xs text-muted-foreground mt-1">Browse gigs, get hired</p>
                  </div>
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-4 py-3 bg-input border border-input text-foreground rounded-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-4 py-3 bg-input border border-input text-foreground rounded-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <div>
            <SubmitButton />
          </div>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary/90 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
