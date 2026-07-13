import { describe, it, expect } from 'vitest'
import { TIMEZONES, TIMEZONE_LABELS, timezoneLabel, isTimezone } from '@/lib/profiles'

/** transport-settings — the «Часовой пояс» dataset: every zone is labelled, and the dropdown spans Russian zones +
 *  relocation hubs + major world hubs. `updateTimezone` validates against `isTimezone`, so the two must stay in sync. */
describe('timezone dataset', () => {
  it('every TIMEZONES entry has a (GMT…) label — no orphans', () => {
    for (const tz of TIMEZONES) {
      expect(TIMEZONE_LABELS[tz], `missing label for ${tz}`).toBeTruthy()
      expect(timezoneLabel(tz)).toMatch(/^\(GMT/)
    }
  })

  it('covers the 11 Russian zones + relocation hubs + major world hubs', () => {
    const must = [
      // Russian span
      'Europe/Kaliningrad', 'Europe/Moscow', 'Asia/Yekaterinburg', 'Asia/Vladivostok', 'Asia/Kamchatka',
      // relocation hubs
      'Asia/Tbilisi', 'Asia/Yerevan', 'Asia/Almaty', 'Europe/Belgrade', 'Europe/Istanbul', 'Asia/Dubai', 'Asia/Nicosia',
      'Europe/Lisbon', 'Asia/Bangkok', 'Asia/Makassar', 'Asia/Tashkent', 'Asia/Bishkek', 'America/Argentina/Buenos_Aires',
      // major world hubs
      'America/Los_Angeles', 'America/New_York', 'America/Chicago', 'America/Sao_Paulo', 'Europe/London',
      'Europe/Berlin', 'Asia/Kolkata', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney',
    ]
    for (const tz of must) expect(isTimezone(tz), `expected ${tz} in TIMEZONES`).toBe(true)
  })

  it('isTimezone rejects unknown zones', () => {
    expect(isTimezone('Mars/Olympus')).toBe(false)
    expect(isTimezone('')).toBe(false)
  })
})
