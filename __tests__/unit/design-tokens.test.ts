import { describe, it, expect } from "vitest";
// CommonJS validator (integrity + drift). Replaces the deleted profile-tokens test.
import { validateTokens } from "../../scripts/design-system/validate-tokens.js";
import tokens from "../../openspec/specs/ui/design-tokens.json";

const cs = (tokens as Record<string, any>)["color-semantic"];
const jsonText = JSON.stringify(tokens).toLowerCase();

describe("design-token engine", () => {
  it("passes integrity + drift validation (JSON shaped to taxonomy, generated outputs in sync)", () => {
    const { pass, errors } = validateTokens();
    expect(errors).toEqual([]);
    expect(pass).toBe(true);
  });

  it("defines every required taxonomy namespace", () => {
    for (const ns of ["surface", "text", "border", "brand", "status", "category"]) {
      expect(cs[ns], `color-semantic.${ns}`).toBeTruthy();
    }
    expect((tokens as any).font?.typography).toBeTruthy();
    expect((tokens as any).effect?.shadow).toBeTruthy();
    expect((tokens as any).gradient).toBeTruthy();
    for (const g of ["spacing", "corner", "size", "zIndex", "opacity"]) {
      expect((tokens as any).numbers?.[g], `numbers.${g}`).toBeTruthy();
    }
  });

  it("names all 6 gig statuses and 5 categories", () => {
    for (const s of ["open", "review", "in-progress", "verification", "completed", "rejected"]) {
      expect(cs.status[s], `status/${s}`).toBeTruthy();
    }
    for (const c of ["marketing", "design", "programming", "development", "coding"]) {
      expect(cs.category[c], `category/${c}`).toBeTruthy();
    }
  });

  it("contains canonical SVG-derived values, not pre-redesign parody values", () => {
    // canonical (trace to the SVGs)
    for (const hex of ["#0088ff", "#10b981", "#f59e0b", "#f45fb1", "#3b82f6"]) {
      expect(jsonText, `canonical ${hex}`).toContain(hex);
    }
    // parody (must be gone for good)
    for (const parody of ["#0a0e27", "#0ea5e9", "#141937", "#1e2447"]) {
      expect(jsonText, `parody ${parody}`).not.toContain(parody);
    }
  });

  it("uses meaning-based names, never raw-value names", () => {
    const keys = Object.keys(cs.status).concat(Object.keys(cs.category), Object.keys(cs.surface));
    for (const k of keys) {
      expect(k).not.toMatch(/^#|[0-9a-f]{6}/i);
    }
  });
});
