'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUnreadNotifications } from '@/app/actions/notification';

interface Notification {
  gigId: string;
  gigTitle: string;
  displayText: string;
  icon: string;
  timestamp: Date;
  unreadCount: number;
  type: string;
  eventType: string | null;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

// RU plural for «обновление» (updates): 1 → обновление, 2–4 → обновления, 0/5–20 → обновлений.
function pluralizeUpdates(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'обновление';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'обновления';
  return 'обновлений';
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return 'только что';
  if (diffMinutes < 60) return `${diffMinutes} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) return `${diffDays} дн назад`;
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
      setError('Не удалось загрузить уведомления');
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
      // The bell lives in the left-hand sidebar, so the panel opens toward the content area (rightward, top-aligned
      // to the bell) instead of `right-0` — which anchored a 320px panel to the bell's right edge and pushed it off
      // the left of the viewport (Спец #13). max-h keeps it within the viewport height with internal scroll.
      className="absolute left-full top-0 ml-3 w-80 max-w-[calc(100vw-2rem)] bg-surface-level-1 rounded-lg shadow-lg border border-neutral-weak z-50"
      role="menu"
      aria-label="Меню уведомлений"
    >
      <div className="p-6 border-b border-neutral-weak">
        <h3 className="text-xl font-semibold text-white">Уведомления</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading && (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-sm text-neutral-strong">Загрузка уведомлений…</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="p-8 text-center">
            <p className="text-sm text-error-500 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Повторить
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
              className="w-12 h-12 mx-auto text-neutral-weak mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-neutral-strong">Нет новых уведомлений</p>
            <p className="text-xs text-neutral-weak mt-1">Вы всё просмотрели</p>
          </div>
        )}

        {!isLoading && !error && notifications.length > 0 && (
          <ul className="divide-y divide-gray-700">
            {notifications.slice(0, 10).map((notification) => {
              // Determine border color based on notification type
              const borderColorClass =
                notification.type === 'APPLICATION'
                  ? 'border-l-blue-500'
                  : notification.type === 'STATUS_CHANGE'
                  ? 'border-l-green-500'
                  : 'border-l-purple-500';

              return (
                <li key={notification.gigId}>
                  <Link
                    href={`/gigs/${notification.gigId}`}
                    onClick={handleNotificationClick}
                    className={`block p-6 hover:bg-navy-700 transition-colors duration-200 border-l-4 ${borderColorClass}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1 min-w-0">
                        <span className="text-2xl mr-3 flex-shrink-0" aria-hidden="true">
                          {notification.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {notification.gigTitle.length > 50
                              ? `${notification.gigTitle.substring(0, 50)}...`
                              : notification.gigTitle}
                          </p>
                          <p className="text-sm text-neutral-strong mt-1">
                            {notification.displayText}
                          </p>
                          <p className="text-xs text-neutral-weak mt-1">
                            {formatRelativeTime(new Date(notification.timestamp))}
                            {notification.unreadCount > 1 && (
                              <span className="ml-2 text-blue-400 font-medium">
                                ({notification.unreadCount} {pluralizeUpdates(notification.unreadCount)})
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-2 h-2 bg-blue-500 rounded-full"></span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
