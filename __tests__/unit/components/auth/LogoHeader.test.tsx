/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LogoHeader } from '@/components/auth/LogoHeader';

describe('LogoHeader', () => {
  it('renders logo image when logoSrc is provided', () => {
    render(<LogoHeader logoSrc="/logo.png" logoAlt="Company Logo" />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/logo.png');
    expect(img).toHaveAttribute('alt', 'Company Logo');
  });

  it('uses default alt text when not provided', () => {
    render(<LogoHeader logoSrc="/logo.png" />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Logo');
  });

  it('renders fallback text when logoSrc is not provided', () => {
    render(<LogoHeader />);

    expect(screen.getByText('GIGLY')).toBeInTheDocument();
  });

  it('has correct styling', () => {
    const { container } = render(<LogoHeader logoSrc="/logo.png" />);

    const wrapper = container.querySelector('.bg-\\[rgba\\(49\\,54\\,67\\,0\\.5\\)\\]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.className).toContain('rounded-[10px]');
    expect(wrapper?.className).toContain('px-[9px]');
    expect(wrapper?.className).toContain('py-[7px]');
  });

  it('logo image has correct height', () => {
    render(<LogoHeader logoSrc="/logo.png" />);

    const img = screen.getByRole('img');
    expect(img.className).toContain('h-[29px]');
  });
});
