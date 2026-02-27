import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ProfileCompletionCard from '@/app/components/onboarding/ProfileCompletionCard'

describe('ProfileCompletionCard', () => {
  describe('CLIENT role', () => {
    it('shows 0% when no fields are filled', () => {
      render(
        <ProfileCompletionCard
          role="CLIENT"
          profile={{ companyName: '', inn: '', kpp: '', contactPerson: '', phoneNumber: '' }}
        />
      )

      expect(screen.getByText('0% complete')).toBeInTheDocument()
      expect(screen.getByText('Complete Your Profile')).toBeInTheDocument()
    })

    it('shows 50% when 1 of 2 required fields is filled', () => {
      render(
        <ProfileCompletionCard
          role="CLIENT"
          profile={{ companyName: 'Test Company', inn: '', kpp: '', contactPerson: '', phoneNumber: '' }}
        />
      )

      expect(screen.getByText('50% complete')).toBeInTheDocument()
    })

    it('returns null when profile is 100% complete', () => {
      const { container } = render(
        <ProfileCompletionCard
          role="CLIENT"
          profile={{ companyName: 'Test Company', inn: '1234567890', kpp: '', contactPerson: '', phoneNumber: '' }}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('treats whitespace-only fields as empty', () => {
      render(
        <ProfileCompletionCard
          role="CLIENT"
          profile={{ companyName: '   ', inn: '', kpp: '', contactPerson: '', phoneNumber: '' }}
        />
      )

      expect(screen.getByText('0% complete')).toBeInTheDocument()
    })

    it('handles null profile', () => {
      render(
        <ProfileCompletionCard
          role="CLIENT"
          profile={null}
        />
      )

      expect(screen.getByText('0% complete')).toBeInTheDocument()
    })
  })

  describe('SPECIALIST role', () => {
    it('shows 0% when no fields are filled', () => {
      render(
        <ProfileCompletionCard
          role="SPECIALIST"
          profile={{ displayName: '', techStack: '', experienceLevel: '', bio: '', hourlyRate: 0 }}
        />
      )

      expect(screen.getByText('0% complete')).toBeInTheDocument()
    })

    it('shows 25% when 1 of 4 fields is filled', () => {
      render(
        <ProfileCompletionCard
          role="SPECIALIST"
          profile={{ displayName: 'John Doe', techStack: '', experienceLevel: '', bio: '', hourlyRate: 0 }}
        />
      )

      expect(screen.getByText('25% complete')).toBeInTheDocument()
    })

    it('shows 50% when 2 of 4 fields are filled', () => {
      render(
        <ProfileCompletionCard
          role="SPECIALIST"
          profile={{ displayName: 'John Doe', techStack: 'React, Node.js', experienceLevel: '', bio: '', hourlyRate: 0 }}
        />
      )

      expect(screen.getByText('50% complete')).toBeInTheDocument()
    })

    it('shows 75% when 3 of 4 fields are filled', () => {
      render(
        <ProfileCompletionCard
          role="SPECIALIST"
          profile={{ displayName: 'John Doe', techStack: 'React', experienceLevel: 'SENIOR', bio: '', hourlyRate: 0 }}
        />
      )

      expect(screen.getByText('75% complete')).toBeInTheDocument()
    })

    it('returns null when profile is 100% complete', () => {
      const { container } = render(
        <ProfileCompletionCard
          role="SPECIALIST"
          profile={{ displayName: 'John Doe', techStack: 'React', experienceLevel: 'SENIOR', bio: 'Bio text', hourlyRate: 5000 }}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('handles null profile', () => {
      render(
        <ProfileCompletionCard
          role="SPECIALIST"
          profile={null}
        />
      )

      expect(screen.getByText('0% complete')).toBeInTheDocument()
    })
  })

  describe('Progress bar color coding', () => {
    it('shows red color for 0-33%', () => {
      const { container } = render(
        <ProfileCompletionCard
          role="SPECIALIST"
          profile={{ displayName: 'John', techStack: '', experienceLevel: '', bio: '', hourlyRate: 0 }}
        />
      )

      const progressBar = container.querySelector('.bg-red-500')
      expect(progressBar).toBeInTheDocument()
    })

    it('shows yellow color for 34-66%', () => {
      const { container } = render(
        <ProfileCompletionCard
          role="SPECIALIST"
          profile={{ displayName: 'John', techStack: 'React', experienceLevel: '', bio: '', hourlyRate: 0 }}
        />
      )

      const progressBar = container.querySelector('.bg-yellow-500')
      expect(progressBar).toBeInTheDocument()
    })

    it('shows blue color for 67-99%', () => {
      const { container } = render(
        <ProfileCompletionCard
          role="SPECIALIST"
          profile={{ displayName: 'John', techStack: 'React', experienceLevel: 'SENIOR', bio: '', hourlyRate: 0 }}
        />
      )

      const progressBar = container.querySelector('.bg-blue-500')
      expect(progressBar).toBeInTheDocument()
    })
  })

  describe('Complete Profile link', () => {
    it('links to /profile/edit', () => {
      render(
        <ProfileCompletionCard
          role="CLIENT"
          profile={{ companyName: '', inn: '', kpp: '', contactPerson: '', phoneNumber: '' }}
        />
      )

      const link = screen.getByRole('link', { name: 'Complete Profile' })
      expect(link).toHaveAttribute('href', '/profile/edit')
    })
  })
})
