import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  Button,
  IconButton,
  Input,
  Textarea,
  AuthStepDots,
  Logomark,
  PasswordInput,
  SearchInput,
  Select,
  Radio,
  Filter,
  FilterGroup,
  Tabs,
  Toggle,
  Tag,
  SpecialtyTag,
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

  it("renders the danger variant token-pure (status-rejected, no raw hex)", () => {
    const { container } = render(<Button variant="danger">Удалить</Button>);
    const btn = container.firstElementChild as HTMLButtonElement;
    expect(btn.className).toContain("text-status-rejected");
    expect(btn.className).toContain("bg-tint-danger");
    expect(btn.className).not.toMatch(/#[0-9a-f]{3,6}/i);
  });

  it("honours the size axis: md = 40h (h-control), sm = 32h (Tetriary)", () => {
    const { container: md } = render(<Button size="md">md</Button>);
    expect((md.firstElementChild as HTMLElement).className).toContain("h-control");
    const { container: sm } = render(<Button size="sm">sm</Button>);
    const smCls = (sm.firstElementChild as HTMLElement).className;
    expect(smCls).toContain("h-8");
    expect(smCls).not.toContain("h-control");
  });
});

describe("ui-primitives / IconButton — button_icon (bg no/yes, counter, a11y)", () => {
  it("renders square control geometry with the bg axis", () => {
    const { container: no } = render(<IconButton icon="/x.svg" aria-label="no" bg="no" />);
    const bNo = no.firstElementChild as HTMLButtonElement;
    expect(bNo.className).toContain("h-control");
    expect(bNo.className).toContain("w-control");
    expect(bNo.className).toContain("rounded-sm");
    expect(bNo.className).toContain("bg-transparent");

    const { container: yes } = render(<IconButton icon="/x.svg" aria-label="yes" bg="yes" />);
    expect((yes.firstElementChild as HTMLElement).className).toContain("bg-surface-level-2");
  });

  it("shows a brand counter badge only when counter is set; requires an accessible name", () => {
    const { container: none } = render(<IconButton icon="/x.svg" aria-label="bell" />);
    expect(screen.getByRole("button", { name: "bell" })).toBeInTheDocument();
    expect(none.querySelector("span")).toBeNull();

    const { container: badge } = render(<IconButton icon="/x.svg" aria-label="bell" counter={5} />);
    const span = badge.querySelector("span")!;
    expect(span.className).toContain("bg-brand-default");
    expect(span.textContent).toBe("5");
  });

  it("fires onClick", () => {
    let clicked = false;
    render(<IconButton icon="/x.svg" aria-label="go" onClick={() => (clicked = true)} />);
    screen.getByRole("button", { name: "go" }).click();
    expect(clicked).toBe(true);
  });
});

describe("ui-primitives / SpecialtyTag — Специальность (S / XS, tokened white fill)", () => {
  it("renders brand-blue mono text on the surface/inverse token fill", () => {
    const { container } = render(<SpecialtyTag>[Senior Frontend]</SpecialtyTag>);
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain("text-brand-default");
    expect(cls).toContain("bg-surface-inverse"); // tokened white, not #ffffff
    expect(cls).toContain("font-mono");
    expect(cls).not.toMatch(/#[0-9a-f]{3,6}/i);
  });

  it("S uses type/data, XS uses type/data-small", () => {
    const { container: s } = render(<SpecialtyTag size="S">x</SpecialtyTag>);
    expect((s.firstElementChild as HTMLElement).className).toContain("text-mono");
    const { container: xs } = render(<SpecialtyTag size="XS">x</SpecialtyTag>);
    expect((xs.firstElementChild as HTMLElement).className).toContain("text-mono-small");
  });
});

describe("ui-primitives / FilterGroup — expand/collapse axis", () => {
  it("expanded shows option rows; collapsed hides them; header reflects aria-expanded", () => {
    const { rerender } = render(
      <FilterGroup label="Стек" expanded>
        <Filter label="React" checked />
      </FilterGroup>,
    );
    expect(screen.getByRole("button", { name: /Стек/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("radio", { name: /React/ })).toBeInTheDocument();

    rerender(
      <FilterGroup label="Стек" expanded={false}>
        <Filter label="React" checked />
      </FilterGroup>,
    );
    expect(screen.getByRole("button", { name: /Стек/ })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("radio")).toBeNull();
  });

  it("fires onToggle when the header is activated", () => {
    let toggled = false;
    render(<FilterGroup label="Стек" onToggle={() => (toggled = true)}><Filter label="React" /></FilterGroup>);
    screen.getByRole("button", { name: /Стек/ }).click();
    expect(toggled).toBe(true);
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
    expect(selected.className).toContain("bg-tint-brand");
  });

  it("disabled trigger does not open", () => {
    render(<Select options={options} expanded disabled />);
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("a disabled option is aria-disabled, de-emphasised, and non-selectable", () => {
    let picked: string | null = null;
    const opts = [
      { value: "new", label: "Сначала новые" },
      { value: "soon", label: "Скоро", disabled: true },
    ];
    render(<Select options={opts} value="new" expanded onSelect={(v) => (picked = v)} />);
    const disabledOpt = screen.getByRole("option", { name: "Скоро" });
    expect(disabledOpt).toHaveAttribute("aria-disabled", "true");
    expect(disabledOpt.className).toContain("opacity-disabled");
    disabledOpt.click();
    expect(picked).toBeNull();
    // an enabled option still selects
    screen.getByRole("option", { name: "Сначала новые" }).click();
    expect(picked).toBe("new");
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
    expect(cur.firstElementChild?.className).toContain("bg-tint-brand");
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

describe("ui-primitives / Textarea — multi-line cover-letter field", () => {
  it("renders a textarea on the overlay/fill token surface, token-pure", () => {
    const { container } = render(<Textarea placeholder="Опишите опыт…" />);
    const ta = container.querySelector("textarea")!;
    expect(ta).toBeInTheDocument();
    expect(ta.className).toContain("bg-overlay-fill");
    expect(ta.className).toContain("border-border");
    expect(ta.className).toContain("rounded-md");
    expect(ta.className).not.toMatch(/#[0-9a-f]{3,6}/i);
  });

  it("disables via the opacity token", () => {
    const { container } = render(<Textarea disabled />);
    const ta = container.querySelector("textarea")!;
    expect(ta).toBeDisabled();
    expect(ta.className).toContain("disabled:opacity-disabled");
  });
});

describe("ui-primitives / AuthStepDots — Figma counter dots", () => {
  it("marks the active step (larger, brand) among count dots, with an accessible label", () => {
    const { container } = render(<AuthStepDots count={3} current={1} />);
    const dots = container.querySelectorAll('[role="progressbar"] > span');
    expect(dots).toHaveLength(3);
    expect(dots[1].className).toContain("bg-brand-default");
    expect(dots[1].className).toContain("h-2"); // active is larger
    expect(dots[0].className).toContain("opacity-disabled"); // inactive dimmed
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Шаг 2 из 3");
  });
});

describe("ui-primitives / Logomark — exported brand asset (F4)", () => {
  it("renders the exported gigly-logo asset with an accessible name", () => {
    const { container } = render(<Logomark />);
    const img = container.querySelector("img")!;
    expect(img.getAttribute("src")).toContain("gigly-logo");
    expect(img).toHaveAttribute("alt", "Gigly");
  });

  it("optionally renders the wordmark", () => {
    render(<Logomark withWordmark />);
    expect(screen.getByText("Gigly")).toBeInTheDocument();
  });
});
