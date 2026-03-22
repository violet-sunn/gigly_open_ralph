/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthButton } from '@/components/auth/AuthButton';

describe('AuthButton', () => {
  it('renders primary variant correctly', () => {
    render(
      <AuthButton variant="primary">
        Click me
      </AuthButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Click me');
    expect(button.className).toContain('bg-[#0088FF]');
  });

  it('renders secondary variant correctly', () => {
    render(
      <AuthButton variant="secondary">
        Click me
      </AuthButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Click me');
    expect(button.className).toContain('bg-[rgba(0,136,255,0.24)]');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    let clicked = false;
    const handleClick = () => { clicked = true; };

    render(
      <AuthButton variant="primary" onClick={handleClick}>
        Click me
      </AuthButton>
    );

    await user.click(screen.getByRole('button'));
    expect(clicked).toBe(true);
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <AuthButton variant="primary" disabled={true}>
        Click me
      </AuthButton>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('has proper ARIA attributes when disabled', () => {
    render(
      <AuthButton variant="primary" disabled={true}>
        Click me
      </AuthButton>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('supports different button types', () => {
    const { rerender } = render(
      <AuthButton variant="primary" type="submit">
        Submit
      </AuthButton>
    );

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(
      <AuthButton variant="primary" type="reset">
        Reset
      </AuthButton>
    );

    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('defaults to button type', () => {
    render(
      <AuthButton variant="primary">
        Click me
      </AuthButton>
    );

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    let clicked = false;
    const handleClick = () => { clicked = true; };

    render(
      <AuthButton variant="primary" onClick={handleClick} disabled={true}>
        Click me
      </AuthButton>
    );

    await user.click(screen.getByRole('button'));
    expect(clicked).toBe(false);
  });
});
