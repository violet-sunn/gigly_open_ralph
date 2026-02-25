'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export function BackButton() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from')

  // Don't render if no navigation context
  if (!from) {
    return null
  }

  let href = '/dashboard'
  let text = '← Back to Dashboard'

  if (from === 'browse') {
    // Preserve all filter/pagination params when going back to browse
    const browseParams = new URLSearchParams()
    const search = searchParams.get('search')
    const tags = searchParams.get('tags')
    const minBudget = searchParams.get('minBudget')
    const maxBudget = searchParams.get('maxBudget')
    const sort = searchParams.get('sort')
    const page = searchParams.get('page')

    if (search) browseParams.set('search', search)
    if (tags) browseParams.set('tags', tags)
    if (minBudget) browseParams.set('minBudget', minBudget)
    if (maxBudget) browseParams.set('maxBudget', maxBudget)
    if (sort) browseParams.set('sort', sort)
    if (page) browseParams.set('page', page)

    const queryString = browseParams.toString()
    href = queryString ? `/dashboard/gigs?${queryString}` : '/dashboard/gigs'
    text = '← Back to Browse Gigs'
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
    >
      {text}
    </Link>
  )
}
