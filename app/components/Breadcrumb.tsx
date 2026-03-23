'use client'

import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const truncateLabel = (label: string) => {
    if (label.length > 50) {
      return label.substring(0, 50) + '...'
    }
    return label
  }

  const shouldCollapse = items.length >= 3

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap text-sm">
        {items.map((item, index) => {
          const isFirst = index === 0
          const isLast = index === items.length - 1
          const isMiddle = !isFirst && !isLast
          const truncatedLabel = truncateLabel(item.label)

          return (
            <li key={index} className="flex items-center">
              {/* Separator (except before first item) */}
              {!isFirst && (
                <span className={`mx-2 text-neutral-weak ${isMiddle && shouldCollapse ? 'hidden md:inline' : ''}`}>
                  /
                </span>
              )}

              {/* Item content */}
              {item.current ? (
                <span
                  className={`text-neutral-weak ${isMiddle && shouldCollapse ? 'hidden md:inline' : ''}`}
                  aria-current="page"
                  title={item.label !== truncatedLabel ? item.label : undefined}
                >
                  {truncatedLabel}
                </span>
              ) : (
                <Link
                  href={item.href!}
                  className={`text-neutral-strong hover:text-white transition-colors ${isMiddle && shouldCollapse ? 'hidden md:inline' : ''}`}
                  title={item.label !== truncatedLabel ? item.label : undefined}
                >
                  {truncatedLabel}
                </Link>
              )}

              {/* Ellipsis for mobile (show after first item) */}
              {isFirst && shouldCollapse && (
                <>
                  <span className="md:hidden mx-2 text-neutral-weak">/</span>
                  <span className="md:hidden text-neutral-weak">...</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
