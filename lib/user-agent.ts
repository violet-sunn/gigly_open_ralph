/**
 * Tiny user-agent → «{browser} · {OS}» formatter (reconcile-settings) — no dependency. Used to label the «Активные
 * сессии» rows. Best-effort substring matching; an unrecognised UA falls back to «Браузер · Устройство».
 */
export function formatUserAgent(ua: string): string {
  if (!ua) return 'Браузер · Устройство'

  const browser =
    /\bEdg\b|Edge/i.test(ua) ? 'Edge'
    : /\bOPR\b|Opera/i.test(ua) ? 'Opera'
    : /Firefox/i.test(ua) ? 'Firefox'
    : /Chrome|Chromium|CriOS/i.test(ua) ? 'Chrome'
    : /Safari/i.test(ua) ? 'Safari'
    : 'Браузер'

  const os =
    /Windows/i.test(ua) ? 'Windows'
    : /iPhone|iPad|iPod|iOS/i.test(ua) ? 'iOS'
    : /Mac OS X|Macintosh/i.test(ua) ? 'macOS'
    : /Android/i.test(ua) ? 'Android'
    : /Linux/i.test(ua) ? 'Linux'
    : 'Устройство'

  return `${browser} · ${os}`
}
