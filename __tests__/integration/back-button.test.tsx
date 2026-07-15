/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BackButton } from '@/app/components/BackButton'
import { ReadonlyURLSearchParams } from 'next/navigation'
import '@testing-library/jest-dom/vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}))

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>
  }
}))

const { useSearchParams } = await import('next/navigation')

describe('BackButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  describe('Context Handling', () => {
    it('renders back to profile link for from=profile', () => {
      const mockSearchParams = new URLSearchParams({ from: 'profile' })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      render(<BackButton />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/dashboard/profile')
      expect(link).toHaveTextContent('← Back to Profile')
    })

    it('renders back to dashboard link for from=dashboard', () => {
      const mockSearchParams = new URLSearchParams({ from: 'dashboard' })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      render(<BackButton />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/dashboard')
      expect(link).toHaveTextContent('← Back to Dashboard')
    })

    it('renders back to admin dashboard link for from=admin-dashboard', () => {
      const mockSearchParams = new URLSearchParams({ from: 'admin-dashboard' })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      render(<BackButton />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/admin')
      expect(link).toHaveTextContent('← Back to Admin Dashboard')
    })

    // Flipped 2026-07-15 (examples-for-clients): this asserted '/dashboard/gigs/examples', which is not a route —
    // the test was locking in a 404. The examples page lives at /gigs/examples.
    it('renders back to examples link for from=examples', () => {
      const mockSearchParams = new URLSearchParams({ from: 'examples' })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      render(<BackButton />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/gigs/examples')
      expect(link).toHaveTextContent('← Back to Examples')
    })

    it('renders back to gig creation link for from=new', () => {
      const mockSearchParams = new URLSearchParams({ from: 'new' })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      render(<BackButton />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/gigs/new')
      expect(link).toHaveTextContent('← Назад к созданию гига')
    })

    it('renders back to browse gigs link for from=browse', () => {
      const mockSearchParams = new URLSearchParams({ from: 'browse' })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      render(<BackButton />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/gigs')
      expect(link).toHaveTextContent('← Back to Browse Gigs')
    })
  })

  describe('Browse Context with Query Parameters', () => {
    it('preserves search parameter when from=browse', () => {
      const mockSearchParams = new URLSearchParams({ from: 'browse', search: 'react' })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      render(<BackButton />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/gigs?search=react')
    })

    it('preserves tags parameter when from=browse', () => {
      const mockSearchParams = new URLSearchParams({ from: 'browse', tags: 'React,TypeScript' })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      render(<BackButton />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/gigs?tags=React%2CTypeScript')
    })

    it('preserves budget parameters when from=browse', () => {
      const mockSearchParams = new URLSearchParams({
        from: 'browse',
        minBudget: '50000',
        maxBudget: '150000'
      })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      render(<BackButton />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/gigs?minBudget=50000&maxBudget=150000')
    })

    it('preserves sort parameter when from=browse', () => {
      const mockSearchParams = new URLSearchParams({ from: 'browse', sort: 'budget-high' })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      render(<BackButton />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/gigs?sort=budget-high')
    })

    it('preserves page parameter when from=browse', () => {
      const mockSearchParams = new URLSearchParams({ from: 'browse', page: '3' })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      render(<BackButton />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/gigs?page=3')
    })

    it('preserves all filter parameters when from=browse', () => {
      const mockSearchParams = new URLSearchParams({
        from: 'browse',
        search: 'react',
        tags: 'React,TypeScript',
        minBudget: '50000',
        maxBudget: '150000',
        sort: 'budget-high',
        page: '2'
      })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      render(<BackButton />)

      const link = screen.getByRole('link')
      const href = link.getAttribute('href')
      expect(href).toContain('/gigs?')
      expect(href).toContain('search=react')
      expect(href).toContain('tags=React%2CTypeScript')
      expect(href).toContain('minBudget=50000')
      expect(href).toContain('maxBudget=150000')
      expect(href).toContain('sort=budget-high')
      expect(href).toContain('page=2')
    })
  })

  describe('Edge Cases', () => {
    it('returns null when from parameter is missing', () => {
      const mockSearchParams = new URLSearchParams({})
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      const { container } = render(<BackButton />)

      expect(container.firstChild).toBeNull()
    })

    it('returns null for unknown context', () => {
      const mockSearchParams = new URLSearchParams({ from: 'unknown-context' })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      const { container } = render(<BackButton />)

      expect(container.firstChild).toBeNull()
    })

    it('returns null for invalid context', () => {
      const mockSearchParams = new URLSearchParams({ from: 'invalid' })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      const { container } = render(<BackButton />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Styling', () => {
    it('applies consistent styling classes', () => {
      const mockSearchParams = new URLSearchParams({ from: 'dashboard' })
      vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as unknown as ReadonlyURLSearchParams)

      render(<BackButton />)

      const link = screen.getByRole('link')
      expect(link).toHaveClass('inline-flex')
      expect(link).toHaveClass('items-center')
      expect(link).toHaveClass('gap-1')
      expect(link).toHaveClass('text-sm')
      expect(link).toHaveClass('text-blue-600')
      expect(link).toHaveClass('hover:text-blue-800')
      expect(link).toHaveClass('transition-colors')
    })
  })
})
