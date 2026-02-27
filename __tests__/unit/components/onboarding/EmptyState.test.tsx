import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import EmptyState from '@/app/components/onboarding/EmptyState'

describe('EmptyState', () => {
  it('renders with all props provided', () => {
    render(
      <EmptyState
        icon="📋"
        heading="Test Heading"
        description="Test description text"
        primaryAction={{ label: "Primary Action", href: "/primary" }}
        secondaryAction={{ label: "Secondary Action", href: "/secondary" }}
      />
    )

    expect(screen.getByText('📋')).toBeInTheDocument()
    expect(screen.getByText('Test Heading')).toBeInTheDocument()
    expect(screen.getByText('Test description text')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Primary Action' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Secondary Action' })).toBeInTheDocument()
  })

  it('renders without optional actions', () => {
    render(
      <EmptyState
        icon="💬"
        heading="No Messages"
        description="Start the conversation"
      />
    )

    expect(screen.getByText('💬')).toBeInTheDocument()
    expect(screen.getByText('No Messages')).toBeInTheDocument()
    expect(screen.getByText('Start the conversation')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('primary action link has correct href', () => {
    render(
      <EmptyState
        icon="📋"
        heading="Test"
        description="Test"
        primaryAction={{ label: "Create Gig", href: "/gigs/new" }}
      />
    )

    const link = screen.getByRole('link', { name: 'Create Gig' })
    expect(link).toHaveAttribute('href', '/gigs/new')
  })

  it('secondary action link has correct href', () => {
    render(
      <EmptyState
        icon="📋"
        heading="Test"
        description="Test"
        secondaryAction={{ label: "View Examples", href: "/gigs/examples" }}
      />
    )

    const link = screen.getByRole('link', { name: 'View Examples' })
    expect(link).toHaveAttribute('href', '/gigs/examples')
  })

  it('renders only primary action when secondary is not provided', () => {
    render(
      <EmptyState
        icon="📋"
        heading="Test"
        description="Test"
        primaryAction={{ label: "Primary", href: "/primary" }}
      />
    )

    expect(screen.getByRole('link', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Secondary' })).not.toBeInTheDocument()
  })

  it('renders only secondary action when primary is not provided', () => {
    render(
      <EmptyState
        icon="📋"
        heading="Test"
        description="Test"
        secondaryAction={{ label: "Secondary", href: "/secondary" }}
      />
    )

    expect(screen.getByRole('link', { name: 'Secondary' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Primary' })).not.toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = render(
      <EmptyState
        icon="📋"
        heading="Test"
        description="Test"
      />
    )

    const card = container.firstChild
    expect(card).toHaveClass('border', 'border-gray-200', 'rounded-lg', 'p-8', 'text-center', 'bg-gray-50')
  })
})
