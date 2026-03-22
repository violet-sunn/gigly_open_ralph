/**
 * @vitest-environment jsdom
 */
import { describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SpecialistIcon, ClientIcon, Logo } from '@/lib/assets'

describe('Auth Asset Components', () => {
  describe('SpecialistIcon', () => {
    test('renders with default props', () => {
      const { container } = render(<SpecialistIcon />)
      const svg = container.querySelector('svg')
      expect(svg).not.toBeNull()
      expect(svg?.getAttribute('viewBox')).toBe('0 0 32 32')
      expect(svg?.getAttribute('aria-label')).toBe('Specialist role icon')
    })

    test('accepts className prop', () => {
      const { container } = render(<SpecialistIcon className="w-8 h-8 text-blue-500" />)
      const svg = container.querySelector('svg')
      const classAttr = svg?.getAttribute('class') || ''
      expect(classAttr).toContain('w-8')
      expect(classAttr).toContain('h-8')
      expect(classAttr).toContain('text-blue-500')
    })

    test('renders SVG elements', () => {
      const { container } = render(<SpecialistIcon />)
      const circle = container.querySelector('circle')
      const path = container.querySelector('path')
      expect(circle).not.toBeNull()
      expect(path).not.toBeNull()
    })
  })

  describe('ClientIcon', () => {
    test('renders with default props', () => {
      const { container } = render(<ClientIcon />)
      const svg = container.querySelector('svg')
      expect(svg).not.toBeNull()
      expect(svg?.getAttribute('viewBox')).toBe('0 0 32 32')
      expect(svg?.getAttribute('aria-label')).toBe('Client role icon')
    })

    test('accepts className prop', () => {
      const { container } = render(<ClientIcon className="w-10 h-10 text-green-500" />)
      const svg = container.querySelector('svg')
      const classAttr = svg?.getAttribute('class') || ''
      expect(classAttr).toContain('w-10')
      expect(classAttr).toContain('h-10')
      expect(classAttr).toContain('text-green-500')
    })

    test('renders SVG path elements', () => {
      const { container } = render(<ClientIcon />)
      const paths = container.querySelectorAll('path')
      expect(paths.length).toBeGreaterThan(0)
    })
  })

  describe('Logo', () => {
    test('renders with default props', () => {
      const { container } = render(<Logo />)
      const svg = container.querySelector('svg')
      expect(svg).not.toBeNull()
      expect(svg?.getAttribute('viewBox')).toBe('0 0 146 29')
      expect(svg?.getAttribute('aria-label')).toBe('Gigly logo')
    })

    test('accepts className prop', () => {
      const { container } = render(<Logo className="h-7" />)
      const svg = container.querySelector('svg')
      const classAttr = svg?.getAttribute('class') || ''
      expect(classAttr).toContain('h-7')
    })

    test('renders text element', () => {
      const { container } = render(<Logo />)
      const text = container.querySelector('text')
      expect(text).not.toBeNull()
      expect(text?.textContent).toBe('GIGLY')
    })
  })
})
