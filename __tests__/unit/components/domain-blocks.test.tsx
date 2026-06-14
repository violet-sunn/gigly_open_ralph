import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  GigCard,
  ProfileCard,
  ClientCard,
  BannerCard,
  StatPanel,
  RequirementCard,
  CriteriaList,
  TermsTabs,
  ApplyPanel,
  MessageBubble,
  ConversationItem,
  NotificationItem,
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
  requirementCardFixture,
  criteriaListFixture,
  termsTabsFixture,
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

  it("RequirementCard renders title, body and an exported icon", () => {
    const { container } = render(<RequirementCard vm={requirementCardFixture} />);
    expect(screen.getByText("Определение готовности")).toBeInTheDocument();
    expect(container.querySelector('img[src*="verified"]')).not.toBeNull();
  });

  it("CriteriaList marks met (verified asset) vs unmet (token circle)", () => {
    const { container } = render(<CriteriaList vm={criteriaListFixture} />);
    expect(container.querySelectorAll('img[src*="verified"]').length).toBe(2); // 2 met
    expect(container.querySelectorAll('.rounded-circular.border').length).toBe(1); // 1 unmet
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
    expect(bubbleOut.className).toContain("bg-brand-default/10");
  });

  it("ConversationItem shows an unread badge only when unread", () => {
    const { container: unread } = render(<ConversationItem vm={conversationItemFixtures[0]} />);
    expect(within(unread.firstElementChild as HTMLElement).getByText("2")).toBeInTheDocument();

    const { container: read } = render(<ConversationItem vm={conversationItemFixtures[1]} />);
    expect(within(read.firstElementChild as HTMLElement).queryByText("0")).toBeNull();
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

  it("FilterBar full renders search, select and view toggle; search-only hides the rest", () => {
    const { container: full } = render(<FilterBar vm={filterBarFixture} variant="full" />);
    expect(full.querySelector('input[type="search"]')).not.toBeNull();
    expect(full.querySelector('[aria-haspopup="listbox"]')).not.toBeNull(); // Select
    expect(full.querySelector('[aria-pressed]')).not.toBeNull(); // ViewToggle segment

    const { container: searchOnly } = render(<FilterBar vm={filterBarFixture} variant="search-only" />);
    expect(searchOnly.querySelector('input[type="search"]')).not.toBeNull();
    expect(searchOnly.querySelector('[aria-haspopup="listbox"]')).toBeNull();
  });
});
