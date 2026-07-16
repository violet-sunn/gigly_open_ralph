import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  CREATE_GIG_DRAFT_KEY,
  loadDraft,
  saveDraft,
  clearDraft,
  type GigDraft,
} from '@/lib/create-gig-draft'

// A minimal Map-backed sessionStorage stub (the node project has no DOM). Assigned to globalThis so the module's
// `typeof sessionStorage !== 'undefined'` guard picks it up.
function installStorage(impl?: Partial<Storage>): Map<string, string> {
  const map = new Map<string, string>()
  const base: Storage = {
    get length() { return map.size },
    clear: () => map.clear(),
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => { map.delete(k) },
    setItem: (k: string, v: string) => { map.set(k, String(v)) },
  }
  ;(globalThis as unknown as { sessionStorage: Storage }).sessionStorage = { ...base, ...impl }
  return map
}

const FULL: GigDraft = {
  title: 'Заголовок',
  category: 'backend',
  description: 'Достаточно длинное описание задачи для теста.',
  goal: 'Бизнес-результат',
  deliverables: 'PR + демо',
  constraints: 'Только TypeScript',
  budget: '150000',
  deadline: '14',
  tags: ['node', 'sqlite'],
  criteria: ['тесты зелёные', 'демо принято'],
}

describe('create-gig-draft persistence', () => {
  afterEach(() => {
    delete (globalThis as unknown as { sessionStorage?: Storage }).sessionStorage
  })

  it('round-trips a full draft through save → load', () => {
    installStorage()
    saveDraft(FULL)
    expect(loadDraft()).toEqual(FULL)
  })

  it('writes under the single shared key', () => {
    const map = installStorage()
    saveDraft(FULL)
    expect(map.has(CREATE_GIG_DRAFT_KEY)).toBe(true)
    expect(map.size).toBe(1)
  })

  it('clearDraft removes the saved draft', () => {
    installStorage()
    saveDraft(FULL)
    clearDraft()
    expect(loadDraft()).toBeNull()
  })

  it('loadDraft returns null when nothing is stored', () => {
    installStorage()
    expect(loadDraft()).toBeNull()
  })

  it('loadDraft returns null on corrupt JSON instead of throwing', () => {
    const map = installStorage()
    map.set(CREATE_GIG_DRAFT_KEY, '{not valid json')
    expect(() => loadDraft()).not.toThrow()
    expect(loadDraft()).toBeNull()
  })

  it('loadDraft filters non-string fields and non-string array members', () => {
    const map = installStorage()
    map.set(
      CREATE_GIG_DRAFT_KEY,
      JSON.stringify({ title: 'ok', budget: 123, tags: ['a', 5, null, 'b'], criteria: 'nope' }),
    )
    const d = loadDraft()
    expect(d).toEqual({ title: 'ok', tags: ['a', 'b'] }) // budget dropped (number), criteria dropped (not array)
  })

  it('is a silent no-op when storage is unavailable', () => {
    // No sessionStorage installed → all guards return early.
    expect(() => saveDraft(FULL)).not.toThrow()
    expect(() => clearDraft()).not.toThrow()
    expect(loadDraft()).toBeNull()
  })

  it('is a silent no-op when setItem throws (quota / disabled)', () => {
    installStorage({ setItem: () => { throw new Error('QuotaExceededError') } })
    expect(() => saveDraft(FULL)).not.toThrow()
  })
})
