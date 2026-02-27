import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import FirstTimeTooltip from '@/app/components/onboarding/FirstTimeTooltip'

describe('FirstTimeTooltip', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('renders when localStorage key is not set', () => {
    render(
      <FirstTimeTooltip
        storageKey="test_tooltip"
        message="Test message"
      />
    )

    expect(screen.getByText('Test message')).toBeInTheDocument()
    expect(screen.getByText('Got it')).toBeInTheDocument()
    expect(screen.getByLabelText('Close tooltip')).toBeInTheDocument()
  })

  it('does not render when localStorage key is set to true', () => {
    localStorage.setItem('test_tooltip', 'true')

    render(
      <FirstTimeTooltip
        storageKey="test_tooltip"
        message="Test message"
      />
    )

    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
  })

  it('sets localStorage and hides tooltip when "Got it" button is clicked', () => {
    render(
      <FirstTimeTooltip
        storageKey="test_tooltip"
        message="Test message"
      />
    )

    const gotItButton = screen.getByText('Got it')
    fireEvent.click(gotItButton)

    expect(localStorage.getItem('test_tooltip')).toBe('true')
    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
  })

  it('sets localStorage and hides tooltip when close button is clicked', () => {
    render(
      <FirstTimeTooltip
        storageKey="test_tooltip"
        message="Test message"
      />
    )

    const closeButton = screen.getByLabelText('Close tooltip')
    fireEvent.click(closeButton)

    expect(localStorage.getItem('test_tooltip')).toBe('true')
    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
  })

  it('calls onDismiss callback when provided', () => {
    const onDismiss = vi.fn()

    render(
      <FirstTimeTooltip
        storageKey="test_tooltip"
        message="Test message"
        onDismiss={onDismiss}
      />
    )

    const gotItButton = screen.getByText('Got it')
    fireEvent.click(gotItButton)

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('uses different storage keys for different tooltips', () => {
    const { rerender } = render(
      <FirstTimeTooltip
        storageKey="tooltip_1"
        message="Message 1"
      />
    )

    expect(screen.getByText('Message 1')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Got it'))
    expect(localStorage.getItem('tooltip_1')).toBe('true')

    rerender(
      <FirstTimeTooltip
        storageKey="tooltip_2"
        message="Message 2"
      />
    )

    // tooltip_2 should still be visible since it has a different key
    expect(screen.getByText('Message 2')).toBeInTheDocument()
    expect(localStorage.getItem('tooltip_2')).toBeNull()
  })
})
