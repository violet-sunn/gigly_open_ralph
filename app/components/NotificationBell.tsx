'use client';

import { useEffect, useState, useRef } from 'react';
import { getUnreadCount } from '@/app/actions/notification';
import { NotificationDropdown } from './NotificationDropdown';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUnreadCount() {
      try {
        const result = await getUnreadCount();
        setUnreadCount(result.count);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUnreadCount();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Refresh unread count after closing
    getUnreadCount().then((result) => setUnreadCount(result.count));
  };

  return (
    <div ref={bellRef} className="relative">
      <button
        onClick={handleToggle}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="relative p-2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-full transition-colors"
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
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none bg-destructive text-destructive-foreground rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && <NotificationDropdown isOpen={isOpen} onClose={handleClose} />}
    </div>
  );
}
