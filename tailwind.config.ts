import type { Config } from "tailwindcss";

// Auto-generated design tokens from openspec/specs/ui/design-tokens.json
// To regenerate: node scripts/parse-design-tokens.js
const tokens = require('./scripts/generated-tokens.js');

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Canonical design tokens from design-tokens.json (auto-generated).
        // Names follow the DESIGN_SYSTEM_SPEC taxonomy: surface-*, text-*, border-*,
        // brand-*, status-*, category-*.
        ...tokens.colors,

        // Token-backed base layer consumed by globals.css @apply (border-border,
        // bg-background, text-foreground). NOT a parody palette — these point at
        // canonical tokens so the @apply base layer compiles. The legacy navy/blue/
        // gray/success/warning/error palettes were removed (parody; Phase 2 recomposes).
        background: tokens.colors["surface-level-0"],
        foreground: tokens.colors["text-strong"],
        border: tokens.colors["border-default"],
      },
      borderRadius: {
        // Canonical radius scale (xs/sm/md/lg/xl/pill/circular)
        ...tokens.borderRadius,
      },
      spacing: {
        // Canonical spacing scale + fixed size tokens (control/icon/avatar)
        ...tokens.spacing,
        ...tokens.size,
      },
      zIndex: {
        ...tokens.zIndex,
      },
      opacity: {
        ...tokens.opacity,
      },
      backgroundImage: {
        // Token-based gradient/"glow" recipes
        ...tokens.gradient,
      },
      fontFamily: {
        // Bound by typography-system: font-sans -> --font-sans (Inter / SF Compact
        // substitute), font-mono -> --font-mono (JetBrains Mono / NKDy Mono substitute)
        ...tokens.fontFamily,
      },
      fontSize: {
        // Design tokens from design-tokens.json (auto-generated)
        ...tokens.fontSize,

        // Manual font sizes (backward compatibility)
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },
      fontWeight: {
        // Design tokens from design-tokens.json (auto-generated)
        ...tokens.fontWeight,

        // Manual font weights (backward compatibility)
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      letterSpacing: {
        // Per-role tracking from design-tokens.json (auto-generated): tracking-display, -h1, etc.
        ...tokens.letterSpacing,
      },
      boxShadow: {
        // Design tokens from design-tokens.json (auto-generated)
        ...tokens.boxShadow,

        // Manual shadows (backward compatibility)
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
