#!/usr/bin/env node

/**
 * Design Token Parser
 *
 * Parses openspec/specs/ui/design-tokens.json and generates:
 * - scripts/generated-tokens.js (for Tailwind config)
 * - scripts/generated-tokens.css (for CSS variables)
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Parsing design tokens...\n');

// Read design tokens JSON
const tokensPath = path.join(__dirname, '..', 'openspec', 'specs', 'ui', 'design-tokens.json');
let tokens;

try {
  const tokensContent = fs.readFileSync(tokensPath, 'utf8');
  tokens = JSON.parse(tokensContent);
  console.log('✓ Loaded design-tokens.json');
} catch (error) {
  console.error('✗ Error reading design-tokens.json:', error.message);
  process.exit(1);
}

// Helper: Convert px to rem (16px = 1rem)
function pxToRem(px) {
  if (typeof px === 'number') {
    return `${(px / 16).toFixed(4)}rem`.replace(/\.?0+rem$/, 'rem');
  }
  return px;
}

// Helper: Resolve token references like {color-primitives.dark.gray.900}
function resolveTokenReference(value, allTokens) {
  if (typeof value !== 'string') return value;

  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;

  const path = match[1].split('.');
  let current = allTokens;

  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      console.warn(`⚠ Could not resolve token reference: ${value}`);
      return value;
    }
  }

  // If we found a token object with a value, return that value
  if (current && typeof current === 'object' && 'value' in current) {
    // Recursively resolve in case the value is also a reference
    return resolveTokenReference(current.value, allTokens);
  }

  return current;
}

// Helper: Convert hex color with alpha to rgba
function hexToRgba(hex) {
  if (!hex || typeof hex !== 'string') return hex;

  // Handle 8-digit hex (with alpha)
  if (hex.match(/^#[0-9a-f]{8}$/i)) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = parseInt(hex.slice(7, 9), 16) / 255;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  }

  return hex;
}

// Helper: Flatten nested object into dot-notation keys
function flattenObject(obj, prefix = '', result = {}) {
  for (const key in obj) {
    const newKey = prefix ? `${prefix}-${key}` : key;
    const value = obj[key];

    if (value && typeof value === 'object' && 'value' in value) {
      // This is a token leaf node
      result[newKey] = value;
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recurse into nested object
      flattenObject(value, newKey, result);
    }
  }

  return result;
}

console.log('📦 Extracting tokens...\n');

// Extract color tokens
const colorTokens = {};
if (tokens['color-semantic']) {
  const flatColors = flattenObject(tokens['color-semantic']);
  for (const [key, token] of Object.entries(flatColors)) {
    const resolvedValue = resolveTokenReference(token.value, tokens);
    const finalValue = hexToRgba(resolvedValue);
    colorTokens[key] = finalValue;
  }
  console.log(`✓ Extracted ${Object.keys(colorTokens).length} color tokens`);
}

// Extract typography tokens
const fontSizeTokens = {};
const lineHeightTokens = {};
const fontWeightTokens = {};

if (tokens.font && tokens.font.typography) {
  const flatTypography = flattenObject(tokens.font.typography);
  for (const [key, token] of Object.entries(flatTypography)) {
    if (token.value && typeof token.value === 'object') {
      if (token.value.fontSize) {
        fontSizeTokens[key] = pxToRem(token.value.fontSize);
      }
      if (token.value.lineHeight) {
        lineHeightTokens[key] = pxToRem(token.value.lineHeight);
      }
      if (token.value.fontWeight) {
        fontWeightTokens[key] = token.value.fontWeight.toString();
      }
    }
  }
  console.log(`✓ Extracted ${Object.keys(fontSizeTokens).length} font size tokens`);
  console.log(`✓ Extracted ${Object.keys(lineHeightTokens).length} line height tokens`);
  console.log(`✓ Extracted ${Object.keys(fontWeightTokens).length} font weight tokens`);
}

// Extract shadow tokens
const shadowTokens = {};
if (tokens.effect && tokens.effect.shadow) {
  const flatShadows = flattenObject(tokens.effect.shadow);
  for (const [key, token] of Object.entries(flatShadows)) {
    if (token.value && typeof token.value === 'object') {
      const { offsetX = 0, offsetY = 0, radius = 0, spread = 0, color = '#000000' } = token.value;
      const rgbaColor = hexToRgba(color);
      shadowTokens[key] = `${offsetX}px ${offsetY}px ${radius}px ${spread}px ${rgbaColor}`;
    }
  }
  console.log(`✓ Extracted ${Object.keys(shadowTokens).length} shadow tokens`);
}

// Extract spacing tokens (if they exist)
const spacingTokens = {};
// Note: spacing tokens might be in a different location in the JSON
// For now, we'll leave this empty and can expand later

// Extract border radius tokens (if they exist)
const borderRadiusTokens = {};
// Note: border radius tokens might be in a different location
// For now, we'll leave this empty and can expand later

console.log('\n📝 Generating output files...\n');

// Generate JavaScript file for Tailwind config
const jsOutput = `// Auto-generated design tokens
// Source: openspec/specs/ui/design-tokens.json
// Generated: ${new Date().toISOString()}
//
// To regenerate: node scripts/parse-design-tokens.js

module.exports = {
  colors: ${JSON.stringify(colorTokens, null, 2)},
  fontSize: ${JSON.stringify(fontSizeTokens, null, 2)},
  lineHeight: ${JSON.stringify(lineHeightTokens, null, 2)},
  fontWeight: ${JSON.stringify(fontWeightTokens, null, 2)},
  boxShadow: ${JSON.stringify(shadowTokens, null, 2)},
  spacing: ${JSON.stringify(spacingTokens, null, 2)},
  borderRadius: ${JSON.stringify(borderRadiusTokens, null, 2)},
};
`;

const jsPath = path.join(__dirname, 'generated-tokens.js');
fs.writeFileSync(jsPath, jsOutput, 'utf8');
console.log('✓ Generated scripts/generated-tokens.js');

// Generate CSS file for CSS variables
let cssOutput = `/* Auto-generated design tokens */
/* Source: openspec/specs/ui/design-tokens.json */
/* Generated: ${new Date().toISOString()} */
/* To regenerate: node scripts/parse-design-tokens.js */

:root {
`;

// Add color variables
if (Object.keys(colorTokens).length > 0) {
  cssOutput += '\n  /* Design Tokens - Colors */\n';
  for (const [key, value] of Object.entries(colorTokens)) {
    cssOutput += `  --${key}: ${value};\n`;
  }
}

// Add typography variables
if (Object.keys(fontSizeTokens).length > 0) {
  cssOutput += '\n  /* Design Tokens - Typography (Font Sizes) */\n';
  for (const [key, value] of Object.entries(fontSizeTokens)) {
    cssOutput += `  --font-size-${key}: ${value};\n`;
  }
}

if (Object.keys(lineHeightTokens).length > 0) {
  cssOutput += '\n  /* Design Tokens - Typography (Line Heights) */\n';
  for (const [key, value] of Object.entries(lineHeightTokens)) {
    cssOutput += `  --line-height-${key}: ${value};\n`;
  }
}

if (Object.keys(fontWeightTokens).length > 0) {
  cssOutput += '\n  /* Design Tokens - Typography (Font Weights) */\n';
  for (const [key, value] of Object.entries(fontWeightTokens)) {
    cssOutput += `  --font-weight-${key}: ${value};\n`;
  }
}

// Add shadow variables
if (Object.keys(shadowTokens).length > 0) {
  cssOutput += '\n  /* Design Tokens - Effects (Shadows) */\n';
  for (const [key, value] of Object.entries(shadowTokens)) {
    cssOutput += `  --shadow-${key}: ${value};\n`;
  }
}

// Add spacing variables
if (Object.keys(spacingTokens).length > 0) {
  cssOutput += '\n  /* Design Tokens - Spacing */\n';
  for (const [key, value] of Object.entries(spacingTokens)) {
    cssOutput += `  --spacing-${key}: ${value};\n`;
  }
}

// Add border radius variables
if (Object.keys(borderRadiusTokens).length > 0) {
  cssOutput += '\n  /* Design Tokens - Border Radius */\n';
  for (const [key, value] of Object.entries(borderRadiusTokens)) {
    cssOutput += `  --radius-${key}: ${value};\n`;
  }
}

cssOutput += '}\n';

const cssPath = path.join(__dirname, 'generated-tokens.css');
fs.writeFileSync(cssPath, cssOutput, 'utf8');
console.log('✓ Generated scripts/generated-tokens.css');

console.log('\n✅ Token parsing complete!\n');
console.log('Summary:');
console.log(`  - ${Object.keys(colorTokens).length} color tokens`);
console.log(`  - ${Object.keys(fontSizeTokens).length} font size tokens`);
console.log(`  - ${Object.keys(lineHeightTokens).length} line height tokens`);
console.log(`  - ${Object.keys(fontWeightTokens).length} font weight tokens`);
console.log(`  - ${Object.keys(shadowTokens).length} shadow tokens`);
console.log(`  - ${Object.keys(spacingTokens).length} spacing tokens`);
console.log(`  - ${Object.keys(borderRadiusTokens).length} border radius tokens`);
console.log('');
