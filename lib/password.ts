export interface PasswordRule {
  label: string
  ok: boolean
}

/**
 * Client-mirrorable, rule-by-rule view of the SAME requirements `validatePassword` enforces below — used to render a
 * live requirements checklist under the password field during onboarding so a user learns the rules AS THEY TYPE,
 * instead of only after submitting. The server (`validatePassword`) stays the source of truth; this is UX feedback.
 */
export function checkPasswordRules(password: string): PasswordRule[] {
  return [
    { label: 'Не короче 8 символов', ok: password.length >= 8 },
    { label: 'Заглавная латинская буква (A–Z)', ok: /[A-Z]/.test(password) },
    { label: 'Строчная латинская буква (a–z)', ok: /[a-z]/.test(password) },
    { label: 'Хотя бы одна цифра (0–9)', ok: /[0-9]/.test(password) },
  ]
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  // Character whitelist first: printable ASCII only, space excluded (0x21 '!' … 0x7E '~').
  //
  // The range is deliberately expressed as raw ASCII rather than a hand-listed set of punctuation, because the byte
  // check below depends on it: `\x21-\x7E` is exactly the set where 1 character == 1 UTF-8 byte, which is what makes
  // the 72 limit line up with bcrypt's hard 72-BYTE truncation.
  //
  // Whitespace is rejected outright — `\s` used to be in this class and quietly admitted NON-ASCII blanks (U+00A0
  // NBSP, U+3000 ideographic space, U+FEFF zero-width NBSP). Those broke the byte assumption (72 ideographic spaces =
  // 210 bytes) and, worse, let an invisible character into a password: registration succeeds, the user retypes it by
  // hand, and login fails forever. Password recovery here is manual, so that lands on a human. Passphrases aren't lost
  // by this — the upper/lower/digit rules below already make space-separated word phrases invalid anyway.
  //
  // Empty stays allowed HERE (note the `*`) so it falls through to the friendlier min-length error below.
  const allowedChars = /^[\x21-\x7E]*$/
  if (!allowedChars.test(password)) {
    return {
      valid: false,
      error: 'Пароль может содержать только латинские буквы, цифры и спецсимволы — без пробелов.',
    }
  }

  // Maximum length (bcrypt truncates at 72 bytes; also caps hashing work). Safe as a character count only because the
  // whitelist above guarantees ASCII, so 1 character == 1 byte.
  if (password.length > 72) {
    return { valid: false, error: 'Пароль не должен превышать 72 символа.' }
  }

  // Check minimum length (8 characters)
  if (password.length < 8) {
    return { valid: false, error: 'Пароль должен быть не короче 8 символов.' }
  }

  // Check for at least one uppercase letter (Latin only)
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Пароль должен содержать хотя бы одну заглавную букву.' }
  }

  // Check for at least one lowercase letter (Latin only)
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Пароль должен содержать хотя бы одну строчную букву.' }
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Пароль должен содержать хотя бы одну цифру.' }
  }

  return { valid: true }
}
