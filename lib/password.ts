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
  // Check character whitelist first (Latin letters, numbers, special characters only)
  // Rejects Unicode/Cyrillic characters to prevent encoding issues
  const allowedChars = /^[A-Za-z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
  if (!allowedChars.test(password)) {
    return { valid: false, error: 'Пароль может содержать только латинские буквы, цифры и спецсимволы.' }
  }

  // Check maximum length (bcrypt limit + DoS prevention)
  // Since we enforce ASCII-only, 1 character = 1 byte, making this perfectly safe
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
