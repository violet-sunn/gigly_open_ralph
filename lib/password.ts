export function validatePassword(password: string): { valid: boolean; error?: string } {
  // Check character whitelist first (Latin letters, numbers, special characters only)
  // Rejects Unicode/Cyrillic characters to prevent encoding issues
  const allowedChars = /^[A-Za-z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
  if (!allowedChars.test(password)) {
    return { valid: false, error: 'Password can only contain Latin letters, numbers, and special characters.' }
  }

  // Check maximum length (bcrypt limit + DoS prevention)
  // Since we enforce ASCII-only, 1 character = 1 byte, making this perfectly safe
  if (password.length > 72) {
    return { valid: false, error: 'Password must not exceed 72 characters.' }
  }

  // Check minimum length (8 characters)
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' }
  }

  // Check for at least one uppercase letter (Latin only)
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter.' }
  }

  // Check for at least one lowercase letter (Latin only)
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter.' }
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number.' }
  }

  return { valid: true }
}
