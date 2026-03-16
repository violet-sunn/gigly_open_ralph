import fs from 'node:fs'
import path from 'node:path'

const TOKENS_PATH = path.join(process.cwd(), 'openspec', 'specs', 'ui', 'design-tokens.json')

/**
 * Minimal deterministic validator for the Specialist Profile pilot.
 * Ensures the subset of semantic tokens used by /profile resolves to concrete hex colors.
 */
const subset = [
  'color-semantic.bg.surface.level-0',
  'color-semantic.bg.surface.level-1',
  'color-semantic.bg.surface.level-2',
  'color-semantic.border.brand.default',
  'color-semantic.border.neutral.weak',
  'color-semantic.border.neutral.strong',
  'color-semantic.text.neutral.strong',
  'color-semantic.text.neutral.weak',
  'color-semantic.text.neutral.inverted',
  'color-semantic.text.brand.default',
]

const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'))

function getByPath(obj, dotPath) {
  return dotPath.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}

function resolveValue(v, depth = 0) {
  if (depth > 20) throw new Error('Token reference chain too deep')
  if (typeof v === 'string' && v.startsWith('{') && v.endsWith('}')) {
    const ref = v.slice(1, -1)
    const node = getByPath(tokens, ref)
    if (!node) throw new Error(`Unresolved token reference: ${ref}`)
    const next = typeof node === 'object' && node && 'value' in node ? node.value : node
    return resolveValue(next, depth + 1)
  }
  return v
}

function getResolvedToken(path) {
  const node = getByPath(tokens, path)
  if (!node) throw new Error(`Missing token: ${path}`)
  const raw = typeof node === 'object' && node && 'value' in node ? node.value : node
  return resolveValue(raw)
}

for (const p of subset) {
  const val = getResolvedToken(p)
  if (typeof val !== 'string' || !val.startsWith('#')) {
    throw new Error(`Token did not resolve to hex string: ${p} -> ${JSON.stringify(val)}`)
  }
}

console.log('OK: Specialist Profile token subset resolves')
