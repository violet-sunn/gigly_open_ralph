/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RoleCard } from '@/components/auth/RoleCard';

describe('RoleCard', () => {
  it('renders with icon and label', () => {
    render(
      <RoleCard
        icon={<span data-testid="test-icon">Icon</span>}
        label="Test Role"
      />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Test Role')).toBeInTheDocument();
  });

  it('shows selected state with border', () => {
    const { container } = render(
      <RoleCard
        icon={<span>Icon</span>}
        label="Test Role"
        selected={true}
      />
    );

    const button = container.querySelector('button');
    expect(button?.className).toContain('border-border-brand-default');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    let clicked = false;
    const handleClick = () => { clicked = true; };

    render(
      <RoleCard
        icon={<span>Icon</span>}
        label="Test Role"
        onClick={handleClick}
      />
    );

    await user.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });

  it('handles keyboard navigation with Enter key', async () => {
    const user = userEvent.setup();
    let clicked = false;
    const handleClick = () => { clicked = true; };

    render(
      <RoleCard
        icon={<span>Icon</span>}
        label="Test Role"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard('{Enter}');
    expect(clicked).toBe(true);
  });

  it('handles keyboard navigation with Space key', async () => {
    const user = userEvent.setup();
    let clicked = false;
    const handleClick = () => { clicked = true; };

    render(
      <RoleCard
        icon={<span>Icon</span>}
        label="Test Role"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard(' ');
    expect(clicked).toBe(true);
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <RoleCard
        icon={<span>Icon</span>}
        label="Test Role"
        disabled={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('has proper ARIA attributes', () => {
    render(
      <RoleCard
        icon={<span>Icon</span>}
        label="Test Role"
        selected={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-label', 'Test Role');
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    let clicked = false;
    const handleClick = () => { clicked = true; };

    render(
      <RoleCard
        icon={<span>Icon</span>}
        label="Test Role"
        onClick={handleClick}
        disabled={true}
      />
    );

    await user.click(screen.getByRole('button'));
    expect(clicked).toBe(false);
  });
});
