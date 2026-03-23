/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { Breadcrumb } from '@/app/components/Breadcrumb'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('Breadcrumb Component', () => {
  it('renders breadcrumb items correctly', () => {
    const items = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Profile', href: '/profile' },
      { label: 'Edit', current: true }
    ]

    render(<Breadcrumb items={items} />)

    // Verify nav element with aria-label
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(nav).toBeInTheDocument()

    // Verify all items are rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  it('renders links for non-current items', () => {
    const items = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Current Page', current: true }
    ]

    render(<Breadcrumb items={items} />)

    // Dashboard should be a link
    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' })
    expect(dashboardLink).toHaveAttribute('href', '/dashboard')

    // Current page should not be a link
    const currentPage = screen.getByText('Current Page')
    expect(currentPage).not.toHaveAttribute('href')
  })

  it('adds aria-current="page" to current item', () => {
    const items = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Current', current: true }
    ]

    render(<Breadcrumb items={items} />)

    const currentItem = screen.getByText('Current')
    expect(currentItem).toHaveAttribute('aria-current', 'page')
  })

  it('truncates long labels', () => {
    const longLabel = 'This is a very long label that should be truncated because it exceeds fifty characters'
    const items = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: longLabel, current: true }
    ]

    render(<Breadcrumb items={items} />)

    // Should show truncated version
    const truncatedText = screen.getByText(/This is a very long label that should be truncated/)
    expect(truncatedText.textContent).toContain('...')
    expect(truncatedText.textContent?.length).toBeLessThan(longLabel.length)

    // Should have title attribute with full text
    expect(truncatedText).toHaveAttribute('title', longLabel)
  })

  it('renders separators between items', () => {
    const items = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Profile', href: '/profile' },
      { label: 'Edit', current: true }
    ]

    const { container } = render(<Breadcrumb items={items} />)

    // Check for separator characters
    const separators = container.querySelectorAll('span.text-neutral-weak')
    expect(separators.length).toBeGreaterThan(0)
  })

  it('handles two-level breadcrumb', () => {
    const items = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Profile', current: true }
    ]

    render(<Breadcrumb items={items} />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('applies correct CSS classes for styling', () => {
    const items = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Current', current: true }
    ]

    render(<Breadcrumb items={items} />)

    const link = screen.getByRole('link', { name: 'Dashboard' })
    expect(link).toHaveClass('text-neutral-strong')
    expect(link).toHaveClass('hover:text-white')

    const currentItem = screen.getByText('Current')
    expect(currentItem).toHaveClass('text-neutral-weak')
  })
})
