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
        // Design tokens from design-tokens.json (auto-generated)
        ...tokens.colors,

        // Manual design system colors (backward compatibility)
        navy: {
          900: "#0A0E27", // Primary background
          800: "#141937", // Card background (slightly lighter)
          700: "#1E2447", // Hover states
          600: "#2A3158", // Borders
        },
        blue: {
          400: "#38BDF8", // Lighter accent
          500: "#0EA5E9", // Primary accent
          600: "#0284C7", // Hover state
        },
        gray: {
          300: "#D1D5DB", // Light text
          400: "#9CA3AF", // Placeholder text
          500: "#6B7280", // Secondary text
          600: "#4B5563", // Borders
          700: "#374151", // Subtle borders
          800: "#1F2937", // Dark elements
        },
        // Status colors
        success: {
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
        },
        warning: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        error: {
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
        },
        // Legacy colors (keep for backward compatibility)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
