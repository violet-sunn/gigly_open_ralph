import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { AppShell } from "@/app/components/templates/AppShell";
import { AuthLayout } from "@/app/components/templates/AuthLayout";
import { Stack } from "@/app/components/layout/Stack";
import { Grid } from "@/app/components/layout/Grid";
import { Split } from "@/app/components/layout/Split";
import { Section } from "@/app/components/layout/Section";
import { Panel } from "@/app/components/layout/Panel";
import { Rail } from "@/app/components/layout/Rail";

describe("layout-grammar / AppShell template", () => {
  it("renders sidebar, topbar and content slots (expanded by default)", () => {
    const { container } = render(
      <AppShell sidebar={<>SIDEBAR_SLOT</>} topbar={<>TOPBAR_SLOT</>}>
        CONTENT_REGION
      </AppShell>,
    );
    expect(screen.getByText("SIDEBAR_SLOT")).toBeInTheDocument();
    expect(screen.getByText("TOPBAR_SLOT")).toBeInTheDocument();
    expect(screen.getByText("CONTENT_REGION")).toBeInTheDocument();
    expect(container.querySelector('[data-shell-state="expanded"]')).not.toBeNull();
  });

  it("supports the collapsed (icon-rail) sidebar state", () => {
    const { container } = render(
      <AppShell sidebar={<>RAIL_ICON</>} topbar={<>T</>} collapsed>
        BODY
      </AppShell>,
    );
    expect(container.querySelector('[data-shell-state="collapsed"]')).not.toBeNull();
    expect(screen.getByText("RAIL_ICON")).toBeInTheDocument();
  });
});

describe("layout-grammar / AuthLayout template", () => {
  it("renders a centered card + checkerboard footer", () => {
    const { container } = render(<AuthLayout>AUTH_CARD</AuthLayout>);
    expect(screen.getByText("AUTH_CARD")).toBeInTheDocument();
    expect(container.querySelector('img[src*="checkerboard"]')).not.toBeNull();
  });
});

describe("layout-grammar / content layout primitives", () => {
  it("Stack renders children with a token gap class", () => {
    const { container } = render(<Stack gap={4}>STACK_CHILD</Stack>);
    expect(screen.getByText("STACK_CHILD")).toBeInTheDocument();
    expect(container.firstElementChild?.className).toContain("gap-4");
  });

  it("Grid renders children with token columns + gap", () => {
    const { container } = render(<Grid columns={3} gap={6}>GRID_CHILD</Grid>);
    expect(screen.getByText("GRID_CHILD")).toBeInTheDocument();
    expect(container.firstElementChild?.className).toContain("grid-cols-3");
    expect(container.firstElementChild?.className).toContain("gap-6");
  });

  it("Split renders two panes at a ratio", () => {
    render(
      <Split ratio="1:2">
        <div>PANE_A</div>
        <div>PANE_B</div>
      </Split>,
    );
    expect(screen.getByText("PANE_A")).toBeInTheDocument();
    expect(screen.getByText("PANE_B")).toBeInTheDocument();
  });

  it("Section renders its title and children", () => {
    render(<Section title="SECTION_TITLE">SECTION_BODY</Section>);
    expect(screen.getByText("SECTION_TITLE")).toBeInTheDocument();
    expect(screen.getByText("SECTION_BODY")).toBeInTheDocument();
  });

  it("Panel renders a token surface container", () => {
    const { container } = render(<Panel surface={2} radius="md" padding={4}>PANEL_BODY</Panel>);
    expect(screen.getByText("PANEL_BODY")).toBeInTheDocument();
    const cls = container.firstElementChild?.className ?? "";
    expect(cls).toContain("bg-surface-level-2");
    expect(cls).toContain("rounded-md");
    expect(cls).toContain("p-4");
  });

  it("Rail renders a narrow icon column", () => {
    const { container } = render(<Rail aria-label="Sidebar">RAIL_BODY</Rail>);
    expect(screen.getByText("RAIL_BODY")).toBeInTheDocument();
    expect(container.firstElementChild?.className).toContain("w-12");
  });
});
