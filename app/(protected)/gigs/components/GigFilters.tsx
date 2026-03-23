'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, forwardRef } from 'react'

interface FilterState {
  search: string
  tags: string[]
  minBudget: string
  maxBudget: string
  sort: string
}

const AVAILABLE_TAGS = [
  'React',
  'Python',
  'TypeScript',
  'Node.js',
  'Go',
  'Rust',
  'Docker',
  'Kubernetes',
]

const GigFilters = forwardRef<HTMLInputElement>((props, ref) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tags: [],
    minBudget: '',
    maxBudget: '',
    sort: 'newest',
  })

  // Initialize state from URL parameters
  useEffect(() => {
    const search = searchParams.get('search') || ''
    const tagsParam = searchParams.get('tags') || ''
    const tags = tagsParam ? tagsParam.split(',').map(t => t.trim()).filter(Boolean) : []
    const minBudget = searchParams.get('minBudget') || ''
    const maxBudget = searchParams.get('maxBudget') || ''
    const sort = searchParams.get('sort') || 'newest'

    setFilters({ search, tags, minBudget, maxBudget, sort })
  }, [searchParams])

  const handleApplyFilters = () => {
    const params = new URLSearchParams()

    if (filters.search.trim()) {
      params.set('search', filters.search.trim())
    }

    if (filters.tags.length > 0) {
      params.set('tags', filters.tags.join(','))
    }

    if (filters.minBudget.trim()) {
      params.set('minBudget', filters.minBudget.trim())
    }

    if (filters.maxBudget.trim()) {
      params.set('maxBudget', filters.maxBudget.trim())
    }

    if (filters.sort && filters.sort !== 'newest') {
      params.set('sort', filters.sort)
    }

    const queryString = params.toString()
    router.push(`/dashboard/gigs${queryString ? '?' + queryString : ''}`)
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      tags: [],
      minBudget: '',
      maxBudget: '',
      sort: 'newest',
    })
    router.push('/dashboard/gigs')
  }

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  return (
    <div className="bg-surface-level-1 rounded-lg shadow-md p-6 mb-6 border border-neutral-weak">
      <h3 className="text-lg font-medium text-white mb-4">Filter Gigs</h3>

      {/* Search Input */}
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-neutral-strong mb-1">
          Search
        </label>
        <input
          ref={ref}
          type="text"
          id="search"
          placeholder="Search gigs..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="w-full px-3 py-2 border border-neutral-weak rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-surface-level-0 text-white placeholder:text-neutral-weak"
        />
      </div>

      {/* Tags */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-strong mb-2">
          Tags
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AVAILABLE_TAGS.map(tag => (
            <label key={tag} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.tags.includes(tag)}
                onChange={() => handleTagToggle(tag)}
                className="rounded border-neutral-weak text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-neutral-default">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="minBudget" className="block text-sm font-medium text-neutral-strong mb-1">
            Min Budget (₽)
          </label>
          <input
            type="number"
            id="minBudget"
            placeholder="Min budget (₽)"
            value={filters.minBudget}
            onChange={(e) => setFilters(prev => ({ ...prev, minBudget: e.target.value }))}
            min="0"
            className="w-full px-3 py-2 border border-neutral-weak rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-surface-level-0 text-white placeholder:text-neutral-weak"
          />
        </div>
        <div>
          <label htmlFor="maxBudget" className="block text-sm font-medium text-neutral-strong mb-1">
            Max Budget (₽)
          </label>
          <input
            type="number"
            id="maxBudget"
            placeholder="Max budget (₽)"
            value={filters.maxBudget}
            onChange={(e) => setFilters(prev => ({ ...prev, maxBudget: e.target.value }))}
            min="0"
            className="w-full px-3 py-2 border border-neutral-weak rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-surface-level-0 text-white placeholder:text-neutral-weak"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="mb-4">
        <label htmlFor="sort" className="block text-sm font-medium text-neutral-strong mb-1">
          Sort By
        </label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
          className="w-full px-3 py-2 border border-neutral-weak rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-surface-level-0 text-white"
        >
          <option value="newest">Newest First</option>
          <option value="budget-desc">Highest Budget</option>
          <option value="budget-asc">Lowest Budget</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleApplyFilters}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleClearFilters}
          className="flex-1 bg-surface-level-2 text-neutral-default px-4 py-2 rounded-md hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
})

GigFilters.displayName = 'GigFilters'

export default GigFilters
