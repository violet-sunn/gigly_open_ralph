import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  Button,
  Input,
  PasswordInput,
  SearchInput,
  Select,
  Radio,
  Filter,
  Tabs,
  Toggle,
  Tag,
  CategoryTag,
  StatusBadge,
  Avatar,
  Rating,
  ViewToggle,
  ProgressBar,
} from "@/app/components/primitives";

// Every primitive renders every variant/state/size from the library (F3), token-pure (F2),
// using exported assets (F4). The typed-API rejection (off-system values fail tsc) is verified
// by the acceptance commands (planted value + `tsc --noEmit`), not at runtime.

describe("ui-primitives / Button — all variants + states", () => {
  const variants = [
    ["primary", "bg-brand-default"],
    ["secondary", "border-border"],
    ["ghost", "bg-transparent"],
    ["link", "text-brand-default"],
  ] as const;

  it("renders each variant with its canonical token", () => {
    for (const [variant, cls] of variants) {
      const { container, unmount } = render(<Button variant={variant}>{variant}</Button>);
      expect(container.firstElementChild?.className).toContain(cls);
      unmount();
    }
  });

  it("encodes hover/pressed states and a disabled state", () => {
    const { container } = render(<Button variant="primary" disabled>X</Button>);
    const btn = container.firstElementChild as HTMLButtonElement;
    expect(btn.className).toContain("hover:bg-brand-hover");
    expect(btn.className).toContain("active:bg-brand-pressed");
    expect(btn.className).toContain("disabled:opacity-disabled");
    expect(btn).toBeDisabled();
    expect(btn.className).toContain("h-control"); // size/control geometry
  });
});

describe("ui-primitives / Input — all states", () => {
  const states = [
    ["default", "border-border"],
    ["focus", "ring-brand-default"],
    ["filled", "border-border"],
    ["disabled", "opacity-disabled"],
    ["error", "border-status-rejected"],
  ] as const;

  it("renders each state with its canonical token + control geometry", () => {
    for (const [state, cls] of states) {
      const { container, unmount } = render(<Input state={state} />);
      const input = container.querySelector("input")!;
      expect(input.className).toContain(cls);
      expect(input.className).toContain("h-control");
      unmount();
    }
  });

  it("reflects disabled/error in the DOM", () => {
    const { container: d } = render(<Input state="disabled" />);
    expect(d.querySelector("input")).toBeDisabled();
    const { container: e } = render(<Input state="error" />);
    expect(e.querySelector("input")).toHaveAttribute("aria-invalid", "true");
  });
});

describe("ui-primitives / PasswordInput — adds revealed state", () => {
  it("masks by default and reveals via the accessible text fallback", () => {
    const { container, rerender } = render(<PasswordInput />);
    expect(container.querySelector("input")).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "Показать" })).toHaveAttribute("aria-pressed", "false");

    rerender(<PasswordInput revealed />);
    expect(container.querySelector("input")).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Скрыть" })).toHaveAttribute("aria-pressed", "true");
  });
});

describe("ui-primitives / SearchInput — uses exported search/clear assets (F4)", () => {
  it("shows the search icon; clear appears only with a value", () => {
    const { container, rerender } = render(<SearchInput value="" onChange={() => {}} />);
    expect(container.querySelector('img[src*="search"]')).not.toBeNull();
    expect(container.querySelector('img[src*="clear"]')).toBeNull();

    rerender(<SearchInput value="react" onChange={() => {}} onClear={() => {}} />);
    expect(container.querySelector('img[src*="clear"]')).not.toBeNull();
  });
});

describe("ui-primitives / Select — collapsed / expanded / disabled + option states", () => {
  const options = [
    { value: "new", label: "Сначала новые" },
    { value: "budget", label: "По бюджету" },
  ];

  it("collapsed shows no listbox; expanded shows options with a selected state", () => {
    const { rerender } = render(<Select options={options} value="new" expanded={false} />);
    expect(screen.queryByRole("listbox")).toBeNull();

    rerender(<Select options={options} value="new" expanded />);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    const opts = screen.getAllByRole("option");
    expect(opts).toHaveLength(2);
    const selected = opts.find((o) => o.getAttribute("aria-selected") === "true")!;
    expect(selected.className).toContain("bg-brand-default/10");
  });

  it("disabled trigger does not open", () => {
    render(<Select options={options} expanded disabled />);
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("ui-primitives / Radio + Filter — off/hover/on/disabled (exported assets)", () => {
  it("swaps radio-off/radio-on by state and disables", () => {
    const { container: off } = render(<Radio checked={false} label="A" />);
    expect(off.querySelector('img[src*="radio-off"]')).not.toBeNull();

    const { container: on } = render(<Radio checked label="A" />);
    expect(on.querySelector('img[src*="radio-on"]')).not.toBeNull();
    expect(on.querySelector('[role="radio"]')).toHaveAttribute("aria-checked", "true");

    const { container: dis } = render(<Radio disabled label="A" />);
    expect(dis.querySelector('[role="radio"]')).toBeDisabled();
    expect(dis.firstElementChild?.className).toContain("disabled:opacity-disabled");
  });

  it("Filter composes Radio and shows a count", () => {
    render(<Filter label="React" checked count={12} />);
    expect(screen.getByRole("radio")).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});

describe("ui-primitives / Toggle — off / on / disabled", () => {
  it("reflects on/off via token bg + knob translate", () => {
    const { container: off } = render(<Toggle checked={false} aria-label="t" />);
    expect(off.firstElementChild?.className).toContain("bg-surface-level-3");
    expect(off.querySelector("span")?.className).toContain("translate-x-0");

    const { container: on } = render(<Toggle checked aria-label="t" />);
    expect(on.firstElementChild?.className).toContain("bg-brand-default");
    expect(on.querySelector("span")?.className).toContain("translate-x-4");

    const { container: dis } = render(<Toggle disabled aria-label="t" />);
    expect(dis.querySelector('[role="switch"]')).toBeDisabled();
  });
});

describe("ui-primitives / Tabs — default / active + count badge", () => {
  const tabs = [
    { value: "all", label: "Все", count: 8 },
    { value: "apps", label: "Заявки" },
  ];

  it("marks the active tab with the brand underline and renders counts", () => {
    render(<Tabs tabs={tabs} active="all" />);
    const all = screen.getByRole("tab", { name: /Все/ });
    const apps = screen.getByRole("tab", { name: "Заявки" });
    expect(all).toHaveAttribute("aria-selected", "true");
    expect(all.className).toContain("border-brand-default");
    expect(apps.className).toContain("text-muted");
    expect(screen.getByText("8")).toBeInTheDocument();
  });
});

describe("ui-primitives / Tag — 5 category colours", () => {
  const colors = ["marketing", "design", "programming", "development", "coding"] as const;
  it("renders each colour variant from a category token", () => {
    for (const color of colors) {
      const { container, unmount } = render(<Tag color={color}>{color}</Tag>);
      expect(container.firstElementChild?.className).toContain(`bg-category-${color}`);
      unmount();
    }
  });
});

describe("ui-primitives / CategoryTag — 5 left-accent variants", () => {
  const cats = ["marketing", "design", "programming", "development", "coding"] as const;
  it("renders each category with its left-accent border token", () => {
    for (const cat of cats) {
      const { container, unmount } = render(<CategoryTag category={cat}>{cat}</CategoryTag>);
      expect(container.firstElementChild?.className).toContain(`border-category-${cat}`);
      expect(container.firstElementChild?.className).toContain("border-l-4");
      unmount();
    }
  });
});

describe("ui-primitives / StatusBadge — 6 statuses × pill/inline-dot/current", () => {
  const statuses = ["open", "review", "in-progress", "verification", "completed", "rejected"] as const;

  it("renders the pill for every status with a token-coloured dot", () => {
    for (const status of statuses) {
      const { container, unmount } = render(<StatusBadge variant="pill" status={status}>{status}</StatusBadge>);
      expect(container.firstElementChild?.className).toContain(`text-status-${status}`);
      expect(container.querySelector('[aria-hidden="true"]')?.className).toContain(`bg-status-${status}`);
      unmount();
    }
  });

  it("renders inline-dot and the current badge", () => {
    const { container: dot } = render(<StatusBadge variant="inline-dot" status="completed">Готово</StatusBadge>);
    expect(dot.querySelector('[aria-hidden="true"]')?.className).toContain("bg-status-completed");

    const { container: cur } = render(<StatusBadge variant="current" />);
    expect(cur.firstElementChild?.className).toContain("bg-brand-default/10");
    expect(screen.getByText("Текущий")).toBeInTheDocument();
  });
});

describe("ui-primitives / Avatar — sm / lg + online", () => {
  it("applies the size token and online indicator", () => {
    const { container: sm } = render(<Avatar size="sm" initials="AB" />);
    expect(sm.firstElementChild?.className).toContain("w-avatar-sm");

    const { container: lg } = render(<Avatar size="lg" src="/x.png" alt="x" online />);
    expect(lg.firstElementChild?.className).toContain("w-avatar-lg");
    expect(lg.querySelector("img")).toHaveAttribute("src", "/x.png");
    expect(lg.querySelector('[aria-label="В сети"]')?.className).toContain("bg-status-completed");
  });
});

describe("ui-primitives / Rating — avatar + verified + ★×5 + count + experience", () => {
  it("renders 5 stars (empty dimmed), verified, count and the experience tag", () => {
    const { container } = render(
      <Rating value={4} count={37} verified online avatarInitials="AB" experience="Senior Frontend" />,
    );
    expect(container.querySelectorAll('img[src*="star"]')).toHaveLength(5);
    expect(container.querySelector('img[src*="verified"]')).not.toBeNull();
    expect(screen.getByText("(37)")).toBeInTheDocument();
    expect(screen.getByText("Senior Frontend")).toBeInTheDocument();
    // empty stars (index 4) dim via opacity/disabled
    const dimmed = Array.from(container.querySelectorAll('img[src*="star"]')).filter((s) =>
      s.className.includes("opacity-disabled"),
    );
    expect(dimmed.length).toBe(1);
  });
});

describe("ui-primitives / ViewToggle — grid-active / list-active (exported assets)", () => {
  it("highlights the active segment", () => {
    const { container: g } = render(<ViewToggle view="grid" />);
    const gButtons = g.querySelectorAll("button");
    expect(gButtons[0].className).toContain("bg-surface-level-3"); // grid active
    expect(g.querySelector('img[src*="grid"]')).not.toBeNull();
    expect(g.querySelector('img[src*="list"]')).not.toBeNull();

    const { container: l } = render(<ViewToggle view="list" />);
    expect(l.querySelectorAll("button")[1].className).toContain("bg-surface-level-3"); // list active
  });
});

describe("ui-primitives / ProgressBar — token track/fill, percentage width", () => {
  it("renders an accessible bar with a brand fill at the bound value", () => {
    const { container } = render(<ProgressBar value={50} aria-label="Progress" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "50");
    expect(bar.className).toContain("bg-text-subtle"); // track
    const fill = bar.firstElementChild as HTMLElement;
    expect(fill.className).toContain("bg-brand-default"); // fill
    expect(fill.style.width).toBe("50%");
  });

  it("clamps out-of-range values", () => {
    const { container } = render(<ProgressBar value={140} />);
    expect((container.querySelector("[role=progressbar] > div") as HTMLElement).style.width).toBe("100%");
  });
});
