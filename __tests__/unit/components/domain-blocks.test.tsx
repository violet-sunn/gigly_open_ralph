import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  GigCard,
  ProfileCard,
  ProfileHeader,
  ClientCard,
  BannerCard,
  StatPanel,
  DisputeList,
  DisputeDetail,
  ToggleList,
  DataTable,
  RequirementCard,
  CriteriaList,
  CriteriaRow,
  Bio,
  SectionHeader,
  JobExperienceCard,
  OnboardingCard,
  AuthHeader,
  TermsTabs,
  ConditionsPanel,
  GigHeader,
  ApplyPanel,
  MessageBubble,
  ConversationItem,
  ChatHeader,
  NotificationItem,
  AttentionCard,
  ToggleField,
  CheckField,
  SessionRow,
  FileChip,
  MessagesPanel,
  ChatPanel,
  SidebarNav,
  Topbar,
  FilterBar,
} from "@/app/components/blocks";
import {
  gigCardFixtures,
  profileCardFixture,
  profileHeaderFixture,
  clientCardFixture,
  bannerCardFixture,
  statPanelFixture,
  disputeListFixture,
  disputeListEmptyFixture,
  disputeDetailFixture,
  disputeDetailResolvedFixture,
  requirementCardFixture,
  criteriaListFixture,
  termsTabsFixture,
  conditionsPanelFixture,
  gigHeaderFixture,
  applyPanelFixture,
  messageBubbleFixtures,
  conversationItemFixtures,
  notificationItemFixtures,
  messagesPanelFixture,
  chatPanelFixture,
  sidebarNavClientExpanded,
  sidebarNavSpecialistCollapsed,
  topbarFixture,
  filterBarFixture,
  attentionCardFixtures,
  toggleFieldFixture,
  checkFieldFixture,
  sessionRowFixtures,
  fileChipFixtures,
  sectionHeaderFixture,
  jobExperienceCardFixtures,
  onboardingCardFixture,
  authHeaderFixtures,
  bioSpecialistFixture,
  bioCompanyFixture,
  bioGigFixture,
  chatHeaderFixture,
} from "@/app/components/blocks/fixtures";

// Every block renders every §3.2 variant from fixtures (F3), composed from primitives + tokens (F2/F5),
// using exported assets (F4). Typed-contract rejection (malformed VM fails tsc) is verified by the
// acceptance commands.

describe("domain-blocks / GigCard — 6 statuses × {grid, list}", () => {
  it("renders every status × layout with its accent, status badge and CTA", () => {
    expect(gigCardFixtures).toHaveLength(12);
    for (const vm of gigCardFixtures) {
      const { container, unmount } = render(<GigCard vm={vm} />);
      const panel = container.firstElementChild as HTMLElement;
      expect(panel.className).toContain(`border-t-status-${vm.status}`);
      expect(within(container).getByRole("button", { name: "К проекту" })).toBeInTheDocument();
      expect(container.querySelector(`.bg-status-${vm.status}`)).not.toBeNull(); // inline status dot
      unmount();
    }
  });
});

describe("domain-blocks / ProfileCard — {compact, full}", () => {
  it("compact renders identity", () => {
    render(<ProfileCard variant="compact" vm={profileCardFixture} />);
    expect(screen.getByText("Анна Смирнова")).toBeInTheDocument();
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
  });
  it("full renders header + StatPanel stats", () => {
    render(<ProfileCard variant="full" vm={profileHeaderFixture} />);
    expect(screen.getByText("Анна Смирнова")).toBeInTheDocument();
    expect(screen.getByText("Гигов выполнено")).toBeInTheDocument(); // from StatPanel
    expect(screen.getByText("47")).toBeInTheDocument();
  });
});

describe("domain-blocks / ProfileHeader — ID block (SpecialtyTag + status pill)", () => {
  it("renders the specialty via SpecialtyTag (not a bordered pill) + the verify row", () => {
    render(<ProfileHeader vm={profileHeaderFixture} />);
    const specialty = screen.getByText("Senior Frontend Engineer");
    expect(specialty.className).toContain("bg-surface-inverse"); // SpecialtyTag white chip
    expect(specialty.className).toContain("text-brand-default"); // brand-blue mono
    expect(specialty.className).not.toContain("rounded-pill"); // not the old ad-hoc pill
    expect(screen.getByText("Номер телефона верифицирован")).toBeInTheDocument();
  });

  it("renders an offline availability pill when not online", () => {
    render(<ProfileHeader vm={profileHeaderFixture} />); // fixture has no `online`
    expect(screen.getByText("Не в сети")).toBeInTheDocument();
  });

  it("renders an online availability pill when online", () => {
    render(<ProfileHeader vm={{ ...profileHeaderFixture, online: true }} />);
    expect(screen.getByText("В сети")).toBeInTheDocument();
  });

  it("shows the owner edit affordance only when onEdit is provided", () => {
    const { rerender } = render(<ProfileHeader vm={profileHeaderFixture} />);
    expect(screen.queryByRole("button", { name: "Редактировать профиль" })).toBeNull();
    rerender(<ProfileHeader vm={profileHeaderFixture} onEdit={() => {}} />);
    expect(screen.getByRole("button", { name: "Редактировать профиль" })).toBeInTheDocument();
  });
});

describe("domain-blocks / ClientCard, StatPanel, BannerCard, RequirementCard, CriteriaList", () => {
  it("ClientCard renders name, rating and meta", () => {
    const { container } = render(<ClientCard vm={clientCardFixture} />);
    expect(screen.getByText("ООО Ромашка")).toBeInTheDocument();
    expect(screen.getByText("Гигов опубликовано")).toBeInTheDocument();
    expect(container.querySelectorAll('img[src*="star"]').length).toBe(5); // Rating
  });

  it("StatPanel renders tiles in single and grid", () => {
    const { unmount } = render(<StatPanel vm={statPanelFixture} variant="grid" />);
    expect(screen.getByText("Заработано")).toBeInTheDocument();
    expect(screen.getByText("1 240 000 ₽")).toBeInTheDocument();
    unmount();
    render(<StatPanel vm={statPanelFixture} variant="single" />);
    expect(screen.getByText("В работе")).toBeInTheDocument();
  });

  it("BannerCard renders headline, CTA and a token art placeholder when art is absent", () => {
    const { container } = render(<BannerCard vm={bannerCardFixture} />);
    expect(screen.getByText(bannerCardFixture.headline)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Создать гиг" })).toBeInTheDocument();
    expect(container.querySelector(".bg-brand-glow")).not.toBeNull();
    expect(container.querySelector("img")).toBeNull(); // residual: no redrawn raster
  });

  it("RequirementCard renders as a frame-stroke tile (title + body + optional icon)", () => {
    const { container } = render(<RequirementCard vm={requirementCardFixture} />);
    const tile = container.firstElementChild as HTMLElement;
    expect(tile.className).toContain("border-overlay-line-strong");
    expect(tile.className).toContain("rounded-md");
    expect(tile.className).toContain("justify-between");
    expect(screen.getByText("Определение готовности")).toBeInTheDocument();
  });

  it("CriteriaList renders numbered криterий rows (CriteriaRow), no met/unmet checklist", () => {
    const { container } = render(<CriteriaList vm={criteriaListFixture} />);
    // numbered 1..N, digit on the brand-accent block
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText(String(criteriaListFixture.items.length))).toBeInTheDocument();
    expect(container.querySelector(".bg-brand-default")).not.toBeNull();
    expect(container.querySelector('img[src*="verified"]')).toBeNull(); // no checklist asset anymore
    expect(screen.getByText(criteriaListFixture.items[0].label)).toBeInTheDocument();
  });
});

describe("domain-blocks / SectionHeader, JobExperienceCard, CriteriaRow (profile + gig-detail)", () => {
  it("SectionHeader renders the title at the h1 (24 mono) role + optional count", () => {
    const { container } = render(<SectionHeader vm={sectionHeaderFixture} />);
    const title = screen.getByText("Стек");
    expect(title.className).toContain("text-h1");
    expect(title.className).toContain("font-h1");
    expect(screen.getByText("6")).toBeInTheDocument(); // count
  });

  it("JobExperienceCard renders company/period/role (brand-default) + description on a frame-stroke card", () => {
    const vm = jobExperienceCardFixtures[0];
    const { container } = render(<JobExperienceCard vm={vm} />);
    expect((container.firstElementChild as HTMLElement).className).toContain("border-overlay-line-strong");
    expect(screen.getByText(vm.company)).toBeInTheDocument();
    expect(screen.getByText(vm.period)).toBeInTheDocument();
    const role = screen.getByText(vm.title!);
    expect(role.className).toContain("text-brand-default"); // RC-S1: #006ccb → brand/default
  });

  it("CriteriaRow renders an on-accent digit + title + description", () => {
    const { container } = render(<CriteriaRow index={3} title="Data Fetching" description="RSC first" />);
    const digit = screen.getByText("3");
    expect(digit.className).toContain("bg-brand-default");
    expect(digit.className).toContain("text-surface-level-0"); // on-accent dark digit
    expect(screen.getByText("Data Fetching")).toBeInTheDocument();
    expect(screen.getByText("RSC first")).toBeInTheDocument();
  });

  it("OnboardingCard composes ProgressBar + secondary Button on an overlay scrim", () => {
    const { container } = render(<OnboardingCard vm={onboardingCardFixture} />);
    expect((container.firstElementChild as HTMLElement).className).toContain("rounded-lg");
    expect(container.querySelector(".bg-overlay-fill")).not.toBeNull(); // scrim
    const title = screen.getByText(onboardingCardFixture.title);
    expect(title.className).toContain("text-h2"); // type/h3 role
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", String(onboardingCardFixture.progress));
    const cta = screen.getByRole("button", { name: onboardingCardFixture.cta.label });
    expect(cta.className).toContain("border-border"); // secondary variant
  });

  it("AuthHeader composes Logomark + heading/subtitle + AuthStepDots, marking the current step", () => {
    const vm = authHeaderFixtures[1]; // step 2 (index 1), showLogomark
    render(<AuthHeader vm={vm} />);
    // Logomark (steps 1–2) renders the exported asset
    expect(screen.getByAltText("Gigly")).toBeInTheDocument();
    // heading at the h1/mono role + muted subtitle
    const heading = screen.getByRole("heading", { name: vm.heading });
    expect(heading.className).toContain("text-h1");
    expect(screen.getByText(vm.subtitle!).className).toContain("text-muted");
    // the dot counter reflects the current step (1-based of total)
    const dots = screen.getByRole("progressbar");
    expect(dots).toHaveAttribute("aria-valuenow", String(vm.step + 1));
    expect(dots).toHaveAttribute("aria-valuemax", String(vm.totalSteps));
  });

  it("AuthHeader omits the Logomark on the welcome step", () => {
    render(<AuthHeader vm={authHeaderFixtures[2]} />); // step 3, no logomark
    expect(screen.queryByAltText("Gigly")).toBeNull();
  });
});

describe("domain-blocks / DisputeList + DisputeDetail", () => {
  it("DisputeList renders a row per dispute (gig · opener · status), each linking to the detail", () => {
    const { container } = render(<DisputeList vm={disputeListFixture} />);
    expect(screen.getByText("Лендинг для финтех-стартапа")).toBeInTheDocument();
    expect(screen.getByText("Иван Петров")).toBeInTheDocument();
    const links = container.querySelectorAll('a[href^="/disputes/"]');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute("href")).toBe("/disputes/d1");
  });

  it("DisputeList renders an empty state when there are no disputes", () => {
    render(<DisputeList vm={disputeListEmptyFixture} />);
    expect(screen.getByText("Споров нет")).toBeInTheDocument();
  });

  it("DisputeDetail renders gig, opener (ClientCard), reason and status; resolution only when resolved", () => {
    const { unmount } = render(<DisputeDetail vm={disputeDetailFixture} />);
    expect(screen.getByText("Лендинг для финтех-стартапа")).toBeInTheDocument();
    expect(screen.getByText("Иван Петров")).toBeInTheDocument(); // opener via ClientCard
    expect(screen.getByText("Причина")).toBeInTheDocument();
    expect(screen.queryByText("Решение")).toBeNull(); // open → no resolution shown
    unmount();

    render(<DisputeDetail vm={disputeDetailResolvedFixture} />);
    expect(screen.getByText("Решение")).toBeInTheDocument();
    expect(screen.getByText(/Спор разрешён в пользу заказчика/)).toBeInTheDocument();
  });
});

describe("domain-blocks / DataTable", () => {
  it("renders a semantic table (header + a row per record) with slotted cells", () => {
    const { container } = render(
      <DataTable
        columns={["Email", "Роль"]}
        rows={[
          { id: "a", cells: ["ivan@example.com", "SPECIALIST"] },
          { id: "b", cells: ["ooo@example.com", "CLIENT"] },
        ]}
      />,
    );
    expect(container.querySelector("table")).not.toBeNull();
    expect(container.querySelectorAll("thead th").length).toBe(2);
    expect(container.querySelectorAll("tbody tr").length).toBe(2);
    expect(screen.getByText("ivan@example.com")).toBeInTheDocument();
  });

  it("renders an empty state when there are no rows", () => {
    render(<DataTable columns={["Email"]} rows={[]} empty="Нет записей" />);
    expect(screen.getByText("Нет записей")).toBeInTheDocument();
  });
});

describe("domain-blocks / ToggleList", () => {
  it("renders a labelled toggle row per item with its on/off state and fires onToggle", () => {
    const items = [
      { key: "a", label: "Отклики", checked: true },
      { key: "b", label: "Сообщения", checked: false },
    ];
    const onToggle = vi.fn();
    const { container } = render(<ToggleList items={items} onToggle={onToggle} />);
    expect(screen.getByText("Отклики")).toBeInTheDocument();
    expect(screen.getByText("Сообщения")).toBeInTheDocument();
    const switches = container.querySelectorAll('[role="switch"]');
    expect(switches.length).toBe(2);
    expect(switches[0].getAttribute("aria-checked")).toBe("true");
    expect(switches[1].getAttribute("aria-checked")).toBe("false");
    (switches[1] as HTMLButtonElement).click();
    expect(onToggle).toHaveBeenCalledWith("b");
  });
});

describe("domain-blocks / TermsTabs + ApplyPanel", () => {
  it("TermsTabs shows proposed by default and client when active", () => {
    const { rerender } = render(<TermsTabs vm={termsTabsFixture} active="proposed" />);
    expect(screen.getByText("300 400 ₽")).toBeInTheDocument(); // proposed budget
    rerender(<TermsTabs vm={termsTabsFixture} active="client" />);
    expect(screen.getByText("280 000 ₽")).toBeInTheDocument(); // client budget
    expect(screen.getByRole("tab", { name: "От заказчика" })).toHaveAttribute("aria-selected", "true");
  });

  it("ApplyPanel renders fields (textarea for multiline) and the submit label", () => {
    const { container } = render(<ApplyPanel vm={applyPanelFixture} />);
    expect(screen.getByText("Технический подход")).toBeInTheDocument();
    expect(container.querySelectorAll("textarea").length).toBe(2); // 2 multiline fields
    expect(screen.getByRole("button", { name: "Откликнуться" })).toBeInTheDocument();
  });
});

describe("domain-blocks / GigHeader + ConditionsPanel (gig-detail prototype)", () => {
  it("GigHeader renders the title + description (no budget/deadline/posted meta row)", () => {
    const { container } = render(<GigHeader vm={gigHeaderFixture} />);
    expect(screen.getByText(gigHeaderFixture.title)).toBeInTheDocument();
    expect(screen.getByText(gigHeaderFixture.description!)).toBeInTheDocument();
    // the срок/бюджет/posted meta row is dropped — those live in the conditions panel
    expect(container.textContent).not.toContain("300 400 ₽");
    expect(container.textContent).not.toContain("12 июня 2026");
    expect(container.textContent).not.toMatch(/Срок\s+14/);
  });

  it("ConditionsPanel shows grotesk Срок/Бюджет per tab + the company fee breakdown", () => {
    const { container, rerender } = render(<ConditionsPanel vm={conditionsPanelFixture} active="client" />);
    // tabs reflect the prototype labels
    expect(screen.getByRole("tab", { name: "Условия Acme Corp" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("280 000 ₽")).toBeInTheDocument(); // client budget
    expect(screen.getByText("10 дней")).toBeInTheDocument(); // client deadline
    expect(screen.getByText("фикс. цена")).toBeInTheDocument();
    // company-only fee breakdown
    expect(screen.getByText("Сервисный сбор (10%)")).toBeInTheDocument();
    expect(screen.getByText("Итого к оплате")).toBeInTheDocument();
    // срок/бюджет numerics use the grotesk (Manrope) face
    const grotesk = Array.from(container.querySelectorAll("span")).filter((s) => s.className.includes("font-grotesk"));
    expect(grotesk.length).toBeGreaterThan(0);
    // switching to «Мои условия» surfaces the specialist's counter figures
    rerender(<ConditionsPanel vm={conditionsPanelFixture} active="proposed" />);
    expect(screen.getByText("300 400 ₽")).toBeInTheDocument();
    expect(screen.getByText("14 дней")).toBeInTheDocument();
  });
});

describe("domain-blocks / messaging — MessageBubble, ConversationItem, NotificationItem", () => {
  it("MessageBubble aligns + tints by direction", () => {
    const inVm = messageBubbleFixtures[0];
    const outVm = messageBubbleFixtures[1];
    const { container: cIn } = render(<MessageBubble vm={inVm} />);
    expect(cIn.firstElementChild?.className).toContain("justify-start");
    const bubbleIn = cIn.firstElementChild?.firstElementChild as HTMLElement;
    expect(bubbleIn.className).toContain("bg-surface-level-2");

    const { container: cOut } = render(<MessageBubble vm={outVm} />);
    expect(cOut.firstElementChild?.className).toContain("justify-end");
    const bubbleOut = cOut.firstElementChild?.firstElementChild as HTMLElement;
    expect(bubbleOut.className).toContain("bg-tint-brand");
  });

  it("ConversationItem shows an unread badge only when unread", () => {
    const { container: unread } = render(<ConversationItem vm={conversationItemFixtures[0]} />);
    expect(within(unread.firstElementChild as HTMLElement).getByText("2")).toBeInTheDocument();

    const { container: read } = render(<ConversationItem vm={conversationItemFixtures[1]} />);
    expect(within(read.firstElementChild as HTMLElement).queryByText("0")).toBeNull();
  });

  it("ConversationItem shows the gig status badge (reconcile-chats)", () => {
    render(<ConversationItem vm={conversationItemFixtures[0]} />);
    expect(screen.getByText("В работе")).toBeInTheDocument(); // status: 'in-progress'
  });

  it("ChatHeader adopts Bio: specialist counterparty shows Специальность, company collapses it", () => {
    const { unmount } = render(<ChatHeader vm={chatHeaderFixture} />);
    expect(screen.getByText("Vercel")).toBeInTheDocument();
    expect(screen.getByText("[Senior Frontend Engineer]")).toBeInTheDocument();
    unmount();

    render(<ChatHeader vm={{ ...chatHeaderFixture, counterparty: "company", specialty: undefined }} />);
    expect(screen.queryByText("[Senior Frontend Engineer]")).toBeNull();
  });

  it("NotificationItem maps each type to an exported icon", () => {
    const { container } = render(
      <>
        {notificationItemFixtures.map((n) => (
          <NotificationItem key={n.id} vm={n} />
        ))}
      </>,
    );
    expect(container.querySelector('img[src*="bell"]')).not.toBeNull(); // application
    expect(container.querySelector('img[src*="star"]')).not.toBeNull(); // status
    expect(container.querySelector('img[src*="chats"]')).not.toBeNull(); // message
  });
});

describe("domain-blocks / panels — MessagesPanel + ChatPanel", () => {
  it("MessagesPanel composes ConversationItem rows", () => {
    render(<MessagesPanel vm={messagesPanelFixture} />);
    expect(screen.getByText("ООО Ромашка")).toBeInTheDocument();
    expect(screen.getByText("Иван Петров")).toBeInTheDocument();
  });

  it("ChatPanel renders the thread + composer with attach fallback", () => {
    const { container } = render(<ChatPanel vm={chatPanelFixture} />);
    expect(screen.getByText("Привет! Готова начать завтра.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Прикрепить файл" })).toBeInTheDocument(); // attach residual fallback
    expect(container.querySelector('img[src*="send"]')).not.toBeNull();
    expect(container.querySelector("input")).not.toBeNull(); // composer input
  });
});

describe("domain-blocks / shell — SidebarNav, Topbar, FilterBar", () => {
  it("SidebarNav expanded (client) renders labels, logo, profile and logout", () => {
    const { container } = render(<SidebarNav vm={sidebarNavClientExpanded} />);
    expect(screen.getByText("Финансы")).toBeInTheDocument();
    expect(screen.getByText("Споры")).toBeInTheDocument();
    expect(screen.getByText("Выйти")).toBeInTheDocument();
    expect(container.querySelector('img[alt="Gigly"]')).not.toBeNull();
  });

  it("SidebarNav collapsed (specialist) uses the icon rail with aria-labelled icons", () => {
    const { container } = render(<SidebarNav vm={sidebarNavSpecialistCollapsed} />);
    expect(container.querySelector(".w-12")).not.toBeNull(); // Rail
    expect(screen.getByLabelText("Поиск")).toBeInTheDocument(); // specialist-only nav item, icon-only
  });

  it("Topbar renders profile, bell + gear and unread badge", () => {
    const { container } = render(<Topbar vm={topbarFixture} />);
    expect(screen.getByText("Анна Смирнова")).toBeInTheDocument();
    expect(container.querySelector('img[src*="bell"]')).not.toBeNull();
    expect(container.querySelector('img[src*="gear"]')).not.toBeNull();
    expect(screen.getByText("3")).toBeInTheDocument(); // unread count
  });

  it("FilterBar full renders search, select and (only when wired) the view toggle; search-only hides the rest", () => {
    const { container: full } = render(<FilterBar vm={filterBarFixture} variant="full" />);
    expect(full.querySelector('input[type="search"]')).not.toBeNull();
    expect(full.querySelector('[aria-haspopup="listbox"]')).not.toBeNull(); // Select
    // reconcile-gig-browse (RC-S11): the switcher renders ONLY when `onViewChange` is wired (it now lives in the
    // gig-browse SectionHeader header row). With no handler the filter bar shows no ViewToggle.
    expect(full.querySelector('[aria-pressed]')).toBeNull();

    const { container: wired } = render(
      <FilterBar vm={filterBarFixture} variant="full" onViewChange={() => {}} />,
    );
    expect(wired.querySelector('[aria-pressed]')).not.toBeNull(); // ViewToggle segment

    const { container: searchOnly } = render(<FilterBar vm={filterBarFixture} variant="search-only" />);
    expect(searchOnly.querySelector('input[type="search"]')).not.toBeNull();
    expect(searchOnly.querySelector('[aria-haspopup="listbox"]')).toBeNull();
  });
});

describe("domain-blocks / AttentionCard — 6 types, data-driven accent (one component)", () => {
  it("each type drives marker/accent/glow/CTA from its attention token", () => {
    expect(attentionCardFixtures).toHaveLength(6);
    for (const vm of attentionCardFixtures) {
      const { container, unmount } = render(<AttentionCard vm={vm} />);
      const panel = container.firstElementChild as HTMLElement;
      // left inset accent + glow keyed to the type token
      expect(panel.className).toContain(`border-l-attention-${vm.type}`);
      expect(container.querySelector(`.bg-attention-${vm.type}-glow`)).not.toBeNull();
      // marker fill + CTA fill from the same token
      expect(container.querySelector(`.bg-attention-${vm.type}`)).not.toBeNull();
      // CTA present (getAll: status-change's "К проекту" also matches the embedded GigCard CTA — collision is by design)
      expect(within(container).getAllByRole("button", { name: vm.cta }).length).toBeGreaterThanOrEqual(1);
      unmount();
    }
  });

  it("embedded gig keeps its OWN gig-status styling (independent of the attention accent)", () => {
    const rejected = attentionCardFixtures.find((v) => v.type === "rejected")!;
    const { container } = render(<AttentionCard vm={rejected} />);
    // outer accent is the neutral attention/rejected; the embedded GigCard carries its gig-status accent
    expect(container.querySelector(".border-t-status-rejected")).not.toBeNull();
  });

  it("the message type embeds a message preview, not a gig", () => {
    const msg = attentionCardFixtures.find((v) => v.type === "message")!;
    render(<AttentionCard vm={msg} />);
    expect(screen.getByText("Кристина")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "К проекту" })).toBeNull(); // no embedded GigCard CTA
  });
});

describe("domain-blocks / settings + chat composites", () => {
  it("ToggleField shows title + description + Toggle and fires onChange", () => {
    const onChange = vi.fn();
    render(<ToggleField vm={toggleFieldFixture} onChange={onChange} />);
    expect(screen.getByText("Категория уведомлений")).toBeInTheDocument();
    expect(screen.getByText(toggleFieldFixture.description!)).toBeInTheDocument();
    screen.getByRole("switch").click();
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("CheckField marks the selected row and fires onChange with its key", () => {
    const onChange = vi.fn();
    render(<CheckField vm={checkFieldFixture} onChange={onChange} />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
    const selected = radios.find((r) => r.getAttribute("aria-checked") === "true")!;
    expect(selected).toHaveAccessibleName(/важные/);
    screen.getByRole("radio", { name: /Все уведомления/ }).click();
    expect(onChange).toHaveBeenCalledWith("all");
  });

  it("SessionRow renders the right primitive per state", () => {
    const { container: def } = render(<SessionRow vm={sessionRowFixtures[0]} />);
    expect(within(def).getByRole("button", { name: "Удалить сессию" })).toBeInTheDocument(); // IconButton close

    render(<SessionRow vm={sessionRowFixtures[1]} />);
    expect(screen.getByText("Текущий")).toBeInTheDocument(); // StatusBadge variant="current"

    const { container: del } = render(<SessionRow vm={sessionRowFixtures[2]} />);
    const danger = del.querySelector("button")!;
    expect(danger.className).toContain("text-status-rejected"); // Button variant="danger"
  });

  it("FileChip shows name + size on the overlay/line token surface", () => {
    const { container } = render(<FileChip vm={fileChipFixtures[0]} />);
    expect(screen.getByText("ТЗ.doc")).toBeInTheDocument();
    expect(screen.getByText("15 MB")).toBeInTheDocument();
    expect((container.firstElementChild as HTMLElement).className).toContain("bg-overlay-line");
  });
});

describe("domain-blocks / Bio — bio (2931:2365) + bio/message/COMPANY (2931:2366) → one block (user axis)", () => {
  it("specialist acc-bio shows name + verify-patch + rating + Специальность", () => {
    const { container } = render(<Bio vm={bioSpecialistFixture} />);
    expect(screen.getByText("Тимур Камальтдинов")).toBeInTheDocument();
    expect(screen.getByText("[Senior Frontend Engineer]")).toBeInTheDocument(); // SpecialtyTag
    expect(container.querySelector('img[src*="verified"]')).not.toBeNull(); // verify-patch (F4)
    expect(container.querySelectorAll('img[src*="star"]').length).toBeGreaterThan(0); // Rating stars
  });

  it("company variant omits Специальность (covers bio/message/COMPANY)", () => {
    render(<Bio vm={bioCompanyFixture} />);
    expect(screen.getByText("ООО Ромашка")).toBeInTheDocument();
    expect(screen.queryByText(/Senior|\[/)).toBeNull(); // no specialty chip for a company
  });

  it("gig sizeFor renders the compact variant (no crash, name present)", () => {
    render(<Bio vm={bioGigFixture} />);
    expect(screen.getByText("Иван Петров")).toBeInTheDocument();
    expect(screen.getByText("[Backend]")).toBeInTheDocument();
  });

  it("renders the optional description line under the identity row (conditions-bio)", () => {
    render(<Bio vm={{ ...bioCompanyFixture, description: "Делаем платёжные сервисы с 2015 года." }} />);
    expect(screen.getByText("Делаем платёжные сервисы с 2015 года.")).toBeInTheDocument();
  });
});
