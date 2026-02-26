'use client'

import { useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalCount: number
}

export default function PaginationControls({
  currentPage,
  totalPages,
  totalCount
}: PaginationControlsProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Build URL for a specific page while preserving other query params
  const buildPageUrl = (page: number): string => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }
    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  // Calculate page numbers to display with ellipsis logic
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis')[] = []

    // Always show first page
    pages.push(1)

    // Calculate range around current page
    const start = Math.max(2, currentPage - 2)
    const end = Math.min(totalPages - 1, currentPage + 2)

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('ellipsis')
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('ellipsis')
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <nav role="navigation" aria-label="Pagination" className="flex flex-col items-center gap-4">
      {/* Page number buttons */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        {hasPrevious ? (
          <Link
            href={buildPageUrl(currentPage - 1)}
            aria-label="Previous page"
            className="px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Previous
          </Link>
        ) : (
          <span
            aria-disabled="true"
            aria-label="Previous page"
            className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted border border-border rounded-md cursor-not-allowed opacity-50 pointer-events-none"
          >
            Previous
          </span>
        )}

        {/* Page numbers */}
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-muted-foreground"
                aria-hidden="true"
              >
                ...
              </span>
            )
          }

          const isCurrentPage = pageNum === currentPage

          if (isCurrentPage) {
            return (
              <span
                key={pageNum}
                aria-current="page"
                aria-label={`Current page, page ${pageNum}`}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-primary rounded-md"
              >
                {pageNum}
              </span>
            )
          }

          return (
            <Link
              key={pageNum}
              href={buildPageUrl(pageNum)}
              aria-label={`Go to page ${pageNum}`}
              className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {pageNum}
            </Link>
          )
        })}

        {/* Next button */}
        {hasNext ? (
          <Link
            href={buildPageUrl(currentPage + 1)}
            aria-label="Next page"
            className="px-3 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Next
          </Link>
        ) : (
          <span
            aria-disabled="true"
            aria-label="Next page"
            className="px-3 py-2 text-sm font-medium text-muted-foreground bg-muted border border-border rounded-md cursor-not-allowed opacity-50 pointer-events-none"
          >
            Next
          </span>
        )}
      </div>
    </nav>
  )
}
