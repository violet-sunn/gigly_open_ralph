'use client';

import { useEffect, useState, useRef } from 'react';
import { NotificationDropdown } from './NotificationDropdown';
import { useLiveCounts } from '@/app/_design/useLiveCounts';

/**
 * The bell previously fetched its count in `useEffect(…, [])` — once, on mount — while living in the persistent
 * protected shell, which never re-mounts on client-side navigation. The count was therefore frozen for the life of
 * the tab: the Round-3 «счётчики не работают» report.
 *
 * It now refreshes on navigation / tab focus / a ~30s poll. When the shell drives it (`count` passed), the shell's
 * single `getLiveCounts()` poll feeds every counter; when mounted standalone (MainNav, TopbarLive) it drives itself
 * off the same hook, so those surfaces get the same freshness.
 */
export function NotificationBell({
  count,
  loaded,
  onRefresh,
}: {
  count?: number;
  loaded?: boolean;
  onRefresh?: () => void;
} = {}) {
  const controlled = count !== undefined;
  // `enabled` is false when controlled, so a shell-driven bell does not open a second poll.
  const live = useLiveCounts({}, !controlled);

  const unreadCount = controlled ? count : live.notifications;
  const isLoading = controlled ? loaded === false : !live.loaded;
  const refresh = controlled ? onRefresh : live.refresh;

  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        // Return focus to the bell button
        const button = bellRef.current?.querySelector('button');
        button?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Opening a notification marks it read, so re-read the count once the dropdown closes.
    refresh?.();
  };

  return (
    <div ref={bellRef} className="relative">
      <button
        onClick={handleToggle}
        aria-label="Уведомления"
        aria-expanded={isOpen}
        className="relative p-2 text-neutral-strong hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-colors"
      >
        {/* Bell Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>

        {/* Badge */}
        {!isLoading && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none bg-error-500 text-white rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && <NotificationDropdown isOpen={isOpen} onClose={handleClose} />}
    </div>
  );
}
