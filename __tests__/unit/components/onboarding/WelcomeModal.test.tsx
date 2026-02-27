import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import WelcomeModal from '@/app/components/onboarding/WelcomeModal'

describe('WelcomeModal', () => {
  beforeEach(() => {
    localStorage.clear()
    document.body.style.overflow = 'unset'
  })

  it('renders when localStorage key is not set', () => {
    const onDismiss = vi.fn()
    render(<WelcomeModal role="CLIENT" onDismiss={onDismiss} />)

    expect(screen.getByText('Welcome to Gigly!')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
    expect(screen.getByText('Skip for now')).toBeInTheDocument()
  })

  it('does not render when localStorage key is set', () => {
    localStorage.setItem('onboarding_welcome_seen', 'true')
    const onDismiss = vi.fn()

    render(<WelcomeModal role="CLIENT" onDismiss={onDismiss} />)

    expect(screen.queryByText('Welcome to Gigly!')).not.toBeInTheDocument()
  })

  it('shows CLIENT-specific steps', () => {
    const onDismiss = vi.fn()
    render(<WelcomeModal role="CLIENT" onDismiss={onDismiss} />)

    expect(screen.getByText('Complete your profile')).toBeInTheDocument()
    expect(screen.getByText('Add company details')).toBeInTheDocument()
    expect(screen.getByText('Create your first gig')).toBeInTheDocument()
    expect(screen.getByText('Post work you need done')).toBeInTheDocument()
    expect(screen.getByText('Review applications from specialists')).toBeInTheDocument()
  })

  it('shows SPECIALIST-specific steps', () => {
    const onDismiss = vi.fn()
    render(<WelcomeModal role="SPECIALIST" onDismiss={onDismiss} />)

    expect(screen.getByText('Complete your profile')).toBeInTheDocument()
    expect(screen.getByText('Add skills and experience')).toBeInTheDocument()
    expect(screen.getByText('Browse available gigs')).toBeInTheDocument()
    expect(screen.getByText('Find projects that match your skills')).toBeInTheDocument()
    expect(screen.getByText('Apply to gigs')).toBeInTheDocument()
    expect(screen.getByText('Submit your proposals')).toBeInTheDocument()
  })

  it('sets localStorage and calls onDismiss when "Get Started" is clicked', () => {
    const onDismiss = vi.fn()
    render(<WelcomeModal role="CLIENT" onDismiss={onDismiss} />)

    const getStartedButton = screen.getByText('Get Started')
    fireEvent.click(getStartedButton)

    expect(localStorage.getItem('onboarding_welcome_seen')).toBe('true')
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('sets localStorage and calls onDismiss when "Skip for now" is clicked', () => {
    const onDismiss = vi.fn()
    render(<WelcomeModal role="CLIENT" onDismiss={onDismiss} />)

    const skipButton = screen.getByText('Skip for now')
    fireEvent.click(skipButton)

    expect(localStorage.getItem('onboarding_welcome_seen')).toBe('true')
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('dismisses modal when Escape key is pressed', () => {
    const onDismiss = vi.fn()
    render(<WelcomeModal role="CLIENT" onDismiss={onDismiss} />)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(localStorage.getItem('onboarding_welcome_seen')).toBe('true')
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('dismisses modal when backdrop is clicked', () => {
    const onDismiss = vi.fn()
    render(<WelcomeModal role="CLIENT" onDismiss={onDismiss} />)

    const backdrop = screen.getByRole('dialog').previousSibling as HTMLElement
    fireEvent.click(backdrop)

    expect(localStorage.getItem('onboarding_welcome_seen')).toBe('true')
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('has proper ARIA attributes', () => {
    const onDismiss = vi.fn()
    render(<WelcomeModal role="CLIENT" onDismiss={onDismiss} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
  })

  it('prevents body scroll when modal is open', () => {
    const onDismiss = vi.fn()
    render(<WelcomeModal role="CLIENT" onDismiss={onDismiss} />)

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body scroll when modal is dismissed', () => {
    const onDismiss = vi.fn()
    const { unmount } = render(<WelcomeModal role="CLIENT" onDismiss={onDismiss} />)

    unmount()

    expect(document.body.style.overflow).toBe('unset')
  })
})
