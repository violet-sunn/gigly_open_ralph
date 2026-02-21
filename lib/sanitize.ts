import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes user input by removing all HTML tags and dangerous content.
 *
 * This function strips ALL HTML tags, event handlers, and javascript: protocols,
 * returning pure plain text. Line breaks (\n) are preserved as-is.
 *
 * UI rendering should use CSS `white-space: pre-wrap` to display line breaks,
 * NOT `dangerouslySetInnerHTML`.
 *
 * @param input - The user input string to sanitize
 * @returns Sanitized plain text string (empty string if input is null/undefined)
 */
export function sanitizeInput(input: string | null | undefined): string {
  // Handle null, undefined, or empty string
  if (!input) {
    return '';
  }

  // Step 1: Sanitize with DOMPurify to remove dangerous content
  // This removes scripts, event handlers, javascript: protocols, etc.
  // But keeps safe HTML structure temporarily
  const sanitizedHtml = DOMPurify.sanitize(input);

  // Step 2: Extract text content from the sanitized HTML
  // Use RETURN_DOM_FRAGMENT to get a DocumentFragment we can query
  const fragment = DOMPurify.sanitize(input, { RETURN_DOM_FRAGMENT: true });

  // Extract text content (this removes all HTML tags but preserves text)
  const textContent = fragment.textContent || '';

  return textContent;
}
