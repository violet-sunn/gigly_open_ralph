'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUnreadNotifications } from '@/app/actions/notification';

interface Notification {
  gigId: string;
  gigTitle: string;
  lastMessageSender: string;
  lastMessageTime: Date;
  unreadCount: number;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  async function fetchNotifications() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getUnreadNotifications();
      setNotifications(result);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }

  const handleRetry = () => {
    fetchNotifications();
  };

  const handleNotificationClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      role="menu"
      aria-label="Notifications menu"
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading && (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-sm text-gray-600">Loading notifications...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="p-8 text-center">
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && notifications.length === 0 && (
          <div className="p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 mx-auto text-gray-400 mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-gray-600">No new messages</p>
          </div>
        )}

        {!isLoading && !error && notifications.length > 0 && (
          <ul className="divide-y divide-gray-200">
            {notifications.slice(0, 10).map((notification) => (
              <li key={notification.gigId}>
                <Link
                  href={`/gigs/${notification.gigId}`}
                  onClick={handleNotificationClick}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.gigTitle.length > 50
                          ? `${notification.gigTitle.substring(0, 50)}...`
                          : notification.gigTitle}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.lastMessageSender}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(new Date(notification.lastMessageTime))}
                      </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-2 h-2 bg-blue-600 rounded-full"></span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
