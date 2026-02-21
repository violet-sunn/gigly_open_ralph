import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '../../lib/sanitize';

describe('sanitizeInput', () => {
  describe('XSS payload neutralization', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("XSS")</script>';
      const result = sanitizeInput(input);
      expect(result).toBe('');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should remove script tags with text content', () => {
      const input = '<script>alert("XSS")</script>Test Gig';
      const result = sanitizeInput(input);
      expect(result).toBe('Test Gig');
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should remove img tags with onerror handlers', () => {
      const input = '<img src=x onerror="alert(\'XSS\')">';
      const result = sanitizeInput(input);
      expect(result).toBe('');
      expect(result).not.toContain('<img');
      expect(result).not.toContain('onerror');
    });

    it('should remove svg tags with onload handlers', () => {
      const input = '<svg onload="alert(\'XSS\')">';
      const result = sanitizeInput(input);
      expect(result).toBe('');
      expect(result).not.toContain('<svg');
      expect(result).not.toContain('onload');
    });

    it('should remove iframe tags with javascript protocol', () => {
      const input = '<iframe src="javascript:alert(\'XSS\')"></iframe>';
      const result = sanitizeInput(input);
      expect(result).toBe('');
      expect(result).not.toContain('<iframe');
      expect(result).not.toContain('javascript:');
    });

    it('should remove anchor tags but keep text content', () => {
      const input = '<a href="javascript:alert(\'XSS\')">click</a>';
      const result = sanitizeInput(input);
      expect(result).toBe('click');
      expect(result).not.toContain('<a');
      expect(result).not.toContain('href');
      expect(result).not.toContain('javascript:');
    });

    it('should remove input tags with onfocus handlers', () => {
      const input = '<input onfocus="alert(\'XSS\')" autofocus>';
      const result = sanitizeInput(input);
      expect(result).toBe('');
      expect(result).not.toContain('<input');
      expect(result).not.toContain('onfocus');
    });

    it('should remove body tags with onload handlers', () => {
      const input = '<body onload="alert(\'XSS\')">';
      const result = sanitizeInput(input);
      expect(result).toBe('');
      expect(result).not.toContain('<body');
      expect(result).not.toContain('onload');
    });

    it('should remove div tags with dangerous styles but keep text', () => {
      const input = '<div style="background:url(\'javascript:alert(1)\')">text</div>';
      const result = sanitizeInput(input);
      expect(result).toBe('text');
      expect(result).not.toContain('<div');
      expect(result).not.toContain('style');
      expect(result).not.toContain('javascript:');
    });

    it('should remove object tags', () => {
      const input = '<object data="javascript:alert(\'XSS\')"></object>';
      const result = sanitizeInput(input);
      expect(result).toBe('');
      expect(result).not.toContain('<object');
    });

    it('should remove embed tags', () => {
      const input = '<embed src="javascript:alert(\'XSS\')">';
      const result = sanitizeInput(input);
      expect(result).toBe('');
      expect(result).not.toContain('<embed');
    });
  });

  describe('Safe content preservation', () => {
    it('should preserve plain text unchanged', () => {
      const input = 'Hello, world!';
      const result = sanitizeInput(input);
      expect(result).toBe('Hello, world!');
    });

    it('should preserve line breaks', () => {
      const input = 'Line 1\nLine 2\nLine 3';
      const result = sanitizeInput(input);
      expect(result).toBe('Line 1\nLine 2\nLine 3');
      expect(result).toContain('\n');
    });

    it('should preserve special characters', () => {
      const input = 'Price: $100, Discount: 20%, Email: test@example.com';
      const result = sanitizeInput(input);
      expect(result).toBe('Price: $100, Discount: 20%, Email: test@example.com');
    });

    it('should preserve unicode characters', () => {
      const input = 'Привет мир! 你好世界';
      const result = sanitizeInput(input);
      expect(result).toBe('Привет мир! 你好世界');
    });
  });

  describe('Edge cases', () => {
    it('should return empty string for null input', () => {
      const result = sanitizeInput(null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined input', () => {
      const result = sanitizeInput(undefined);
      expect(result).toBe('');
    });

    it('should return empty string for empty string input', () => {
      const result = sanitizeInput('');
      expect(result).toBe('');
    });

    it('should handle whitespace-only input', () => {
      const result = sanitizeInput('   \n\t  ');
      expect(result).toBe('   \n\t  ');
    });

    it('should handle very long strings (2000 chars)', () => {
      const longText = 'a'.repeat(2000);
      const result = sanitizeInput(longText);
      expect(result).toBe(longText);
      expect(result.length).toBe(2000);
    });

    it('should handle mixed content with HTML and text', () => {
      const input = 'Safe text <script>alert("XSS")</script> more safe text';
      const result = sanitizeInput(input);
      expect(result).toBe('Safe text  more safe text');
      expect(result).not.toContain('<script>');
    });
  });

  describe('Complex XSS scenarios', () => {
    it('should handle nested tags', () => {
      const input = '<div><script>alert("XSS")</script></div>';
      const result = sanitizeInput(input);
      expect(result).toBe('');
      expect(result).not.toContain('<div');
      expect(result).not.toContain('<script>');
    });

    it('should handle multiple XSS attempts in one string', () => {
      const input = '<script>alert(1)</script>Text<img onerror="alert(2)"><a href="javascript:alert(3)">link</a>';
      const result = sanitizeInput(input);
      expect(result).toBe('Textlink');
      expect(result).not.toContain('<');
      expect(result).not.toContain('alert');
      expect(result).not.toContain('javascript:');
    });

    it('should decode HTML entities to plain text', () => {
      const input = '&lt;script&gt;alert("XSS")&lt;/script&gt;';
      const result = sanitizeInput(input);
      // HTML entities get decoded by textContent, which is safe
      // The decoded text doesn't contain actual script tags, just the text representation
      expect(result).toBe('<script>alert("XSS")</script>');
      // This is safe because it's plain text, not executable HTML
    });
  });
});
