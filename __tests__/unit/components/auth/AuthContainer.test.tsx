/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthContainer } from '@/components/auth/AuthContainer';

describe('AuthContainer', () => {
  it('renders children correctly', () => {
    render(
      <AuthContainer>
        <div data-testid="child-content">Test Content</div>
      </AuthContainer>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <AuthContainer className="custom-class">
        <div>Content</div>
      </AuthContainer>
    );

    const innerDiv = container.querySelector('.custom-class');
    expect(innerDiv).toBeInTheDocument();
  });

  it('has correct dimensions', () => {
    const { container } = render(
      <AuthContainer>
        <div>Content</div>
      </AuthContainer>
    );

    const innerDiv = container.querySelector('.w-\\[418px\\]');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv?.className).toContain('h-[540px]');
    expect(innerDiv?.className).toContain('rounded-[25px]');
  });

  it('uses design tokens for styling', () => {
    const { container } = render(
      <AuthContainer>
        <div>Content</div>
      </AuthContainer>
    );

    const outerDiv = container.querySelector('.bg-surface-level-0');
    expect(outerDiv).toBeInTheDocument();

    const innerDiv = container.querySelector('.bg-surface-level-1');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv?.className).toContain('border-border-neutral-strong');
  });

  it('centers content', () => {
    const { container } = render(
      <AuthContainer>
        <div>Content</div>
      </AuthContainer>
    );

    const outerDiv = container.querySelector('.min-h-screen');
    expect(outerDiv?.className).toContain('flex');
    expect(outerDiv?.className).toContain('items-center');
    expect(outerDiv?.className).toContain('justify-center');
  });
});
