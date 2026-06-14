import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { GenerativityProbe } from "@/app/workbench/screens/GenerativityProbe";

// Generativity: a novel screen assembles purely from the kit (fixtures), proving the vocabulary
// generalises beyond the reference screens. (Zero-off-system is enforced by `lint:generativity`.)

describe("fidelity-harness / generativity probe", () => {
  it("assembles a novel screen from the kit", () => {
    render(<GenerativityProbe />);
    expect(screen.getByText("Сводка")).toBeInTheDocument(); // Section title
    expect(screen.getAllByText("К проекту").length).toBeGreaterThan(0); // GigCard CTAs
    expect(screen.getByText("Заработано")).toBeInTheDocument(); // StatPanel stat
  });
});
