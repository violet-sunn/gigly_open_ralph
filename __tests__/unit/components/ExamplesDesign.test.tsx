/**
 * @vitest-environment jsdom
 *
 * «Примеры гигов» (examples-for-clients) — the re-grounded example-gigs screen.
 *
 * The empty branch is the reason this suite exists: the seeded database always has example gigs, so a live
 * click-through can never render it. These assert the localization and the card return-path contract that the
 * live pass covers only for the populated branch.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ExamplesDesign, type ExampleGigVM } from '@/app/(protected)/gigs/examples/ExamplesDesign'
import '@testing-library/jest-dom/vitest'

const gig = (over: Partial<ExampleGigVM> = {}): ExampleGigVM => ({
  id: 'example-gig-backend-api',
  title: 'REST API для системы управления пользователями',
  description: 'Нужно спроектировать и реализовать REST API.',
  budget: '190 000 ₽',
  tags: ['Node.js', 'PostgreSQL'],
  created: '01.07.2026',
  ...over,
})

describe('ExamplesDesign', () => {
  describe('Empty state (no example gigs)', () => {
    it('renders the Russian empty state with the ✨ icon', () => {
      render(<ExamplesDesign gigs={[]} />)

      expect(screen.getByRole('heading', { name: 'Примеров пока нет' })).toBeInTheDocument()
      expect(screen.getByText(/Образцовые гиги ещё не добавлены/)).toBeInTheDocument()
      expect(screen.getByText('✨')).toBeInTheDocument()
    })

    it('does not display the superseded English empty-state strings', () => {
      const { container } = render(<ExamplesDesign gigs={[]} />)

      expect(container.textContent).not.toContain('No Example Gigs Available')
      expect(container.textContent).not.toContain("Example gigs haven't been set up yet")
    })

    it('does not render the kit EmptyState component (its classes are not token-pure)', () => {
      const { container } = render(<ExamplesDesign gigs={[]} />)

      // The kit EmptyState ships these; the re-grounded empty state must not reintroduce them.
      expect(container.querySelector('.bg-surface-level-1')).toBeNull()
      expect(container.querySelector('.border-neutral-weak')).toBeNull()
    })

    it('omits the count badge when there is nothing to count', () => {
      render(<ExamplesDesign gigs={[]} />)

      expect(screen.getByRole('heading', { name: 'Примеры гигов' })).toBeInTheDocument()
      expect(screen.queryByText('0')).not.toBeInTheDocument()
    })
  })

  describe('Populated list', () => {
    it('renders the Russian heading, intro and count', () => {
      render(<ExamplesDesign gigs={[gig(), gig({ id: 'b', title: 'Второй пример' })]} />)

      expect(screen.getByRole('heading', { name: 'Примеры гигов' })).toBeInTheDocument()
      expect(screen.getByText(/Так выглядит хорошо составленный бриф/)).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('links every card to the gig detail with ?from=examples, so the detail can return here', () => {
      render(<ExamplesDesign gigs={[gig(), gig({ id: 'second-example', title: 'Второй пример' })]} />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(2)
      expect(links[0]).toHaveAttribute('href', '/gigs/example-gig-backend-api?from=examples')
      expect(links[1]).toHaveAttribute('href', '/gigs/second-example?from=examples')
    })

    it('renders the Russian «пример» badge, not the English one', () => {
      const { container } = render(<ExamplesDesign gigs={[gig()]} />)

      expect(screen.getByText('✨ пример')).toBeInTheDocument()
      expect(container.textContent).not.toContain('✨ Example')
      expect(container.textContent).not.toContain('Example Gigs')
    })

    it('renders the gig figures and tags it was given', () => {
      render(<ExamplesDesign gigs={[gig()]} />)

      expect(screen.getByText('REST API для системы управления пользователями')).toBeInTheDocument()
      expect(screen.getByText('190 000 ₽')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
      expect(screen.getByText('01.07.2026')).toBeInTheDocument()
    })

    it('tolerates a gig with no tags', () => {
      render(<ExamplesDesign gigs={[gig({ tags: [] })]} />)

      expect(screen.getByRole('link')).toHaveAttribute('href', '/gigs/example-gig-backend-api?from=examples')
    })
  })
})
