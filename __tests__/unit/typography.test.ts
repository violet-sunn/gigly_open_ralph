import { describe, it, expect } from "vitest";
import tokens from "../../openspec/specs/ui/design-tokens.json";
// CommonJS generated tokens (Tailwind source of truth)
import gen from "../../scripts/generated-tokens.js";

const family = (tokens as Record<string, any>).font.family;

describe("typography-system", () => {
  it("defines font.family tokens (sans + mono) on the --font-* contract", () => {
    expect(family.sans.value).toContain("--font-sans");
    expect(family.mono.value).toContain("--font-mono");
  });

  it("emits a fontFamily group into the generated tokens (sans != mono)", () => {
    expect(gen.fontFamily?.sans).toBeTruthy();
    expect(gen.fontFamily?.mono).toBeTruthy();
    expect(gen.fontFamily.sans).not.toEqual(gen.fontFamily.mono);
    expect(gen.fontFamily.sans).toContain("--font-sans");
    expect(gen.fontFamily.mono).toContain("--font-mono");
  });

  it("binds family + size + weight + line-height for every type role", () => {
    for (const role of ["display", "h1", "h2", "title", "body", "label", "caption", "mono"]) {
      expect(gen.fontSize[role], `fontSize.${role}`).toBeTruthy();
      expect(gen.lineHeight[role], `lineHeight.${role}`).toBeTruthy();
      expect(gen.fontWeight[role], `fontWeight.${role}`).toBeTruthy();
    }
  });

  it("keeps the measurable anchor: h1 == 22px (1.375rem)", () => {
    // 22px / 16 = 1.375rem — the auth-heading anchor from DESIGN_SYSTEM_SPEC §1.4
    expect(gen.fontSize.h1).toBe("1.375rem");
  });

  it("mono family resolves to monospace, text family to sans-serif", () => {
    expect(gen.fontFamily.mono).toContain("monospace");
    expect(gen.fontFamily.sans).toContain("sans-serif");
  });
});
