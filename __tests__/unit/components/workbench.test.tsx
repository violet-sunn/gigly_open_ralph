import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import fs from "node:fs";
import path from "node:path";

import { CATALOG, byKind } from "@/app/workbench/registry";
import { SpecialistDashboardComposition } from "@/app/workbench/screens/SpecialistDashboardComposition";

// The 16 primitives, 17 blocks, 2 templates, 6 layout primitives, and token groups MUST each have
// a catalog story; every entry MUST map to a reference render that exists; the sample screen MUST
// compose from fixtures.

const PRIMITIVES = [
  "Button", "Input", "PasswordInput", "SearchInput", "Select", "Radio", "Filter", "Tabs", "Toggle",
  "Tag", "CategoryTag", "StatusBadge", "Avatar", "Rating", "ViewToggle", "ProgressBar",
];
const BLOCKS = [
  "GigCard", "ProfileCard", "ClientCard", "BannerCard", "StatPanel", "RequirementCard", "CriteriaList",
  "TermsTabs", "ApplyPanel", "MessageBubble", "ConversationItem", "NotificationItem", "MessagesPanel",
  "ChatPanel", "SidebarNav", "Topbar", "FilterBar",
];
const TEMPLATES = ["AppShell", "AuthLayout"];
const LAYOUTS = ["Stack", "Grid", "Split", "Section", "Panel", "Rail"];

describe("component-workbench / coverage", () => {
  it("covers all 16 primitives", () => {
    const ids = byKind("primitive").map((e) => e.id);
    for (const p of PRIMITIVES) expect(ids, `missing primitive story: ${p}`).toContain(p);
  });

  it("covers all 17 blocks", () => {
    const ids = byKind("block").map((e) => e.id);
    for (const b of BLOCKS) expect(ids, `missing block story: ${b}`).toContain(b);
  });

  it("covers 2 templates, 6 layout primitives, and ≥5 token groups", () => {
    expect(byKind("template").map((e) => e.id)).toEqual(expect.arrayContaining(TEMPLATES));
    expect(byKind("layout").map((e) => e.id)).toEqual(expect.arrayContaining(LAYOUTS));
    expect(byKind("token").length).toBeGreaterThanOrEqual(5);
  });

  it("maps every entry to a reference render that exists on disk", () => {
    expect(CATALOG.length).toBeGreaterThan(0);
    for (const e of CATALOG) {
      const abs = path.join(process.cwd(), e.reference);
      expect(fs.existsSync(abs), `${e.kind}/${e.id} -> missing reference ${e.reference}`).toBe(true);
    }
  });
});

describe("component-workbench / sample composed screen", () => {
  it("renders from fixtures (AppShell + blocks)", () => {
    render(<SpecialistDashboardComposition />);
    expect(screen.getByText(/Найдите сильного специалиста/)).toBeInTheDocument(); // BannerCard
    expect(screen.getAllByText("К проекту").length).toBeGreaterThan(0); // GigCard CTAs
    expect(screen.getByText("Финансы")).toBeInTheDocument(); // SidebarNav item
  });
});
