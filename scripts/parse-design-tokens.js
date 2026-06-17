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
const letterSpacingTokens = {};
const typographyFamilyAlias = {}; // role -> 'sans' | 'mono'; resolved to a stack after font.family is read

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
      // letterSpacing in px — use typeof so a 0 value is not silently dropped.
      if (typeof token.value.letterSpacing === 'number') {
        letterSpacingTokens[key] = `${token.value.letterSpacing}px`;
      }
      // Remember which family alias (sans/mono) this role uses; resolved to a stack below.
      if (typeof token.value.family === 'string') {
        typographyFamilyAlias[key] = token.value.family;
      }
    }
  }
  console.log(`✓ Extracted ${Object.keys(fontSizeTokens).length} font size tokens`);
  console.log(`✓ Extracted ${Object.keys(lineHeightTokens).length} line height tokens`);
  console.log(`✓ Extracted ${Object.keys(fontWeightTokens).length} font weight tokens`);
  console.log(`✓ Extracted ${Object.keys(letterSpacingTokens).length} letter spacing tokens`);
}

// Extract font family tokens (typography-system binds these to the type roles)
const fontFamilyTokens = {};
if (tokens.font && tokens.font.family) {
  const flatFamily = flattenObject(tokens.font.family);
  for (const [key, token] of Object.entries(flatFamily)) {
    if (typeof token.value === 'string') fontFamilyTokens[key] = token.value;
  }
  // Map each type role to its family stack so `font-<role>` resolves (e.g. font-display -> mono).
  for (const [role, alias] of Object.entries(typographyFamilyAlias)) {
    if (fontFamilyTokens[alias] && !fontFamilyTokens[role]) {
      fontFamilyTokens[role] = fontFamilyTokens[alias];
    }
  }
  console.log(`✓ Extracted ${Object.keys(fontFamilyTokens).length} font family tokens`);
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

// Extract spacing tokens
const spacingTokens = {};
if (tokens.numbers && tokens.numbers.spacing) {
  const flatSpacing = flattenObject(tokens.numbers.spacing);
  for (const [key, token] of Object.entries(flatSpacing)) {
    // NOTE: use typeof (not truthiness) so a 0 value is not silently dropped.
    if (typeof token.value === 'number') {
      spacingTokens[key] = `${token.value}px`;
    }
  }
  console.log(`✓ Extracted ${Object.keys(spacingTokens).length} spacing tokens`);
}

// Extract border radius tokens from numbers.corner (tolerates string values like "50%")
const borderRadiusTokens = {};
if (tokens.numbers && tokens.numbers.corner) {
  const flatRadius = flattenObject(tokens.numbers.corner);
  for (const [key, token] of Object.entries(flatRadius)) {
    if (typeof token.value === 'number') {
      borderRadiusTokens[key] = `${token.value}px`;
    } else if (typeof token.value === 'string') {
      borderRadiusTokens[key] = token.value; // e.g. circular: "50%", or "9999px"
    }
  }
  console.log(`✓ Extracted ${Object.keys(borderRadiusTokens).length} border radius tokens`);
}

// Extract size tokens (fixed dimensions — control/icon/avatar)
const sizeTokens = {};
if (tokens.numbers && tokens.numbers.size) {
  const flatSize = flattenObject(tokens.numbers.size);
  for (const [key, token] of Object.entries(flatSize)) {
    if (typeof token.value === 'number') sizeTokens[key] = `${token.value}px`;
    else if (typeof token.value === 'string') sizeTokens[key] = token.value;
  }
  console.log(`✓ Extracted ${Object.keys(sizeTokens).length} size tokens`);
}

// Extract z-index tokens (unitless integers)
const zIndexTokens = {};
if (tokens.numbers && tokens.numbers.zIndex) {
  const flatZ = flattenObject(tokens.numbers.zIndex);
  for (const [key, token] of Object.entries(flatZ)) {
    if (typeof token.value === 'number') zIndexTokens[key] = `${token.value}`;
  }
  console.log(`✓ Extracted ${Object.keys(zIndexTokens).length} z-index tokens`);
}

// Extract opacity tokens (unitless 0..1)
const opacityTokens = {};
if (tokens.numbers && tokens.numbers.opacity) {
  const flatOpacity = flattenObject(tokens.numbers.opacity);
  for (const [key, token] of Object.entries(flatOpacity)) {
    if (typeof token.value === 'number') opacityTokens[key] = `${token.value}`;
  }
  console.log(`✓ Extracted ${Object.keys(opacityTokens).length} opacity tokens`);
}

// Extract gradient tokens (CSS gradient/recipe strings)
const gradientTokens = {};
if (tokens.gradient) {
  const flatGradient = flattenObject(tokens.gradient);
  for (const [key, token] of Object.entries(flatGradient)) {
    if (typeof token.value === 'string') gradientTokens[key] = token.value;
  }
  console.log(`✓ Extracted ${Object.keys(gradientTokens).length} gradient tokens`);
}

console.log('\n📝 Generating output files...\n');

// Generate JavaScript file for Tailwind config
const jsOutput = `// Auto-generated design tokens
// Source: openspec/specs/ui/design-tokens.json
// Generated: ${new Date().toISOString()}
//
// To regenerate: node scripts/parse-design-tokens.js

module.exports = {
  colors: ${JSON.stringify(colorTokens, null, 2)},
  fontFamily: ${JSON.stringify(fontFamilyTokens, null, 2)},
  fontSize: ${JSON.stringify(fontSizeTokens, null, 2)},
  lineHeight: ${JSON.stringify(lineHeightTokens, null, 2)},
  fontWeight: ${JSON.stringify(fontWeightTokens, null, 2)},
  letterSpacing: ${JSON.stringify(letterSpacingTokens, null, 2)},
  boxShadow: ${JSON.stringify(shadowTokens, null, 2)},
  spacing: ${JSON.stringify(spacingTokens, null, 2)},
  borderRadius: ${JSON.stringify(borderRadiusTokens, null, 2)},
  size: ${JSON.stringify(sizeTokens, null, 2)},
  zIndex: ${JSON.stringify(zIndexTokens, null, 2)},
  opacity: ${JSON.stringify(opacityTokens, null, 2)},
  gradient: ${JSON.stringify(gradientTokens, null, 2)},
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

// Add font family variables
if (Object.keys(fontFamilyTokens).length > 0) {
  cssOutput += '\n  /* Design Tokens - Typography (Font Families) */\n';
  for (const [key, value] of Object.entries(fontFamilyTokens)) {
    cssOutput += `  --font-family-${key}: ${value};\n`;
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

// Add letter spacing variables
if (Object.keys(letterSpacingTokens).length > 0) {
  cssOutput += '\n  /* Design Tokens - Typography (Letter Spacing) */\n';
  for (const [key, value] of Object.entries(letterSpacingTokens)) {
    cssOutput += `  --tracking-${key}: ${value};\n`;
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

// Add size variables
if (Object.keys(sizeTokens).length > 0) {
  cssOutput += '\n  /* Design Tokens - Sizes */\n';
  for (const [key, value] of Object.entries(sizeTokens)) {
    cssOutput += `  --size-${key}: ${value};\n`;
  }
}

// Add z-index variables
if (Object.keys(zIndexTokens).length > 0) {
  cssOutput += '\n  /* Design Tokens - Z-Index */\n';
  for (const [key, value] of Object.entries(zIndexTokens)) {
    cssOutput += `  --z-${key}: ${value};\n`;
  }
}

// Add opacity variables
if (Object.keys(opacityTokens).length > 0) {
  cssOutput += '\n  /* Design Tokens - Opacity */\n';
  for (const [key, value] of Object.entries(opacityTokens)) {
    cssOutput += `  --opacity-${key}: ${value};\n`;
  }
}

// Add gradient variables
if (Object.keys(gradientTokens).length > 0) {
  cssOutput += '\n  /* Design Tokens - Gradients */\n';
  for (const [key, value] of Object.entries(gradientTokens)) {
    cssOutput += `  --gradient-${key}: ${value};\n`;
  }
}

cssOutput += '}\n';

const cssPath = path.join(__dirname, 'generated-tokens.css');
fs.writeFileSync(cssPath, cssOutput, 'utf8');
console.log('✓ Generated scripts/generated-tokens.css');

console.log('\n✅ Token parsing complete!\n');
console.log('Summary:');
console.log(`  - ${Object.keys(colorTokens).length} color tokens`);
console.log(`  - ${Object.keys(fontFamilyTokens).length} font family tokens`);
console.log(`  - ${Object.keys(fontSizeTokens).length} font size tokens`);
console.log(`  - ${Object.keys(lineHeightTokens).length} line height tokens`);
console.log(`  - ${Object.keys(fontWeightTokens).length} font weight tokens`);
console.log(`  - ${Object.keys(letterSpacingTokens).length} letter spacing tokens`);
console.log(`  - ${Object.keys(shadowTokens).length} shadow tokens`);
console.log(`  - ${Object.keys(spacingTokens).length} spacing tokens`);
console.log(`  - ${Object.keys(borderRadiusTokens).length} border radius tokens`);
console.log(`  - ${Object.keys(sizeTokens).length} size tokens`);
console.log(`  - ${Object.keys(zIndexTokens).length} z-index tokens`);
console.log(`  - ${Object.keys(opacityTokens).length} opacity tokens`);
console.log(`  - ${Object.keys(gradientTokens).length} gradient tokens`);
console.log('');
