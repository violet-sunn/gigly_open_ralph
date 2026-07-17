"use client";

// App shell rebuilt DIRECTLY on the gigly_full_design prototype's own markup (Gigly App.dc.html — the <aside> sidebar
// lines 21-76 + the <header> zone lines 82-118). Inline styles ported verbatim so the design's tokens/fonts resolve
// exactly (app/_design/tokens.css). Wired to real data: nav via lib/nav (buildSidebarNav + markActive over usePathname),
// the live NotificationBell, the logoutUser action, and the «Вид» button toggling the real theme. The «ПРОЕКТ»-style
// page title is derived per-route. Replaces the old AppShell + SidebarNavLive + TopbarLive in the protected layout.

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/app/components/primitives";
import { ICON } from "@/app/components/primitives/tokens";
import { NotificationBell } from "@/app/components/NotificationBell";
import { logoutUser } from "@/app/actions/auth";
import { buildSidebarNav, buildAdminNav, markActive, type NavRole, type NavCounts } from "@/lib/nav";
import { getStoredTheme, applyTheme, type Theme } from "@/lib/theme";
import { CATEGORIES } from "@/lib/categories";
import { SettingsModal } from "@/app/(protected)/settings/SettingsModal";
import { Heartbeat } from "./Heartbeat";
import { useIsNarrow } from "./useIsNarrow";
import { useLiveCounts } from "./useLiveCounts";
import "./tokens.css";

// The prototype's header filter cluster (data-dc-tpl="51", beside the search field) on every list screen. Option sets
// transported from the prototype's FILTERS array; wired to the browse query's URL params (category / minBudget+maxBudget
// / sort / minRating). Budget is a range → two params.
const CATEGORY_OPTS = [{ value: "", label: "Все категории" }, ...CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))];
const BUDGET_RANGES = [
  { value: "", label: "Любой", min: "", max: "" },
  { value: "0-50000", label: "до 50 000 ₽", min: "", max: "50000" },
  { value: "50000-150000", label: "50 000–150 000 ₽", min: "50000", max: "150000" },
  { value: "150000-", label: "от 150 000 ₽", min: "150000", max: "" },
];
const SORT_OPTS = [
  { value: "newest", label: "По новизне" },
  { value: "budget-desc", label: "Сначала дороже" },
  { value: "budget-asc", label: "Сначала дешевле" },
];
const RATING_OPTS = [
  { value: "", label: "Любой рейтинг" },
  { value: "4", label: "4★ и выше" },
  { value: "3", label: "3★ и выше" },
];

// pathname → the design's uppercase RU page title (Gigly App.dc.html TITLES). Most-specific prefix first.
function pageTitle(pathname: string): string {
  if (pathname === "/admin") return "МОДЕРАЦИЯ";
  if (pathname.startsWith("/admin/disputes")) return "СПОРЫ";
  if (pathname.startsWith("/admin/users")) return "ПОЛЬЗОВАТЕЛИ";
  if (pathname.startsWith("/admin/gigs")) return "ГИГИ";
  if (pathname === "/dashboard") return "ДАШБОРД";
  if (pathname === "/gigs/new") return "СОЗДАТЬ ГИГ";
  if (/^\/gigs\/[^/]+\/applications/.test(pathname)) return "ОТКЛИКИ";
  if (/^\/gigs\/[^/]+/.test(pathname)) return "ПРОЕКТ";
  if (pathname === "/gigs") return "ПОИСК ГИГОВ";
  if (pathname.startsWith("/my-gigs")) return "МОИ ГИГИ";
  if (pathname.startsWith("/chats")) return "ЧАТЫ";
  if (pathname.startsWith("/finances")) return "ФИНАНСЫ";
  if (pathname === "/disputes/new") return "ОТКРЫТЬ СПОР";
  if (/^\/disputes\/[^/]+\/resolve/.test(pathname)) return "РЕШЕНИЕ СПОРА";
  if (/^\/disputes\/[^/]+/.test(pathname)) return "СПОР";
  if (pathname.startsWith("/disputes")) return "СПОРЫ";
  if (pathname.startsWith("/settings")) return "НАСТРОЙКИ";
  if (pathname.startsWith("/profile")) return "ПРОФИЛЬ";
  if (pathname.startsWith("/guide")) return "КАК ЭТО РАБОТАЕТ";
  return "GIGLY";
}
// The design shows the search bar only on the list screens (dashboard / browse / my-gigs).
const showSearch = (pathname: string) => ["/dashboard", "/gigs", "/my-gigs"].includes(pathname);

export function AppShellDesign({
  profile,
  role,
  counts,
  admin = false,
  adminOpenDisputes,
  children,
}: {
  profile: { name: string; sub: string };
  role: NavRole;
  counts: NavCounts;
  admin?: boolean;
  /** OPEN-dispute count for the admin «Споры» nav badge (server-seeded; the admin shell does not poll). */
  adminOpenDisputes?: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const params = useSearchParams();

  // The shell is persistent — it does not re-mount on client-side navigation — so the server-rendered `counts` would
  // otherwise stay frozen for the life of the tab (Round-3 «счётчики не работают»). Seed from the SSR values (no
  // flash to zero on first paint), then keep them live. One poll here feeds the sidebar badges AND the bell; the
  // admin shell renders no counts, so it does not poll.
  const live = useLiveCounts(counts, !admin);
  const liveCounts: NavCounts = admin ? counts : { gigs: live.gigs, chats: live.chats };

  const items = markActive(admin ? buildAdminNav(adminOpenDisputes) : buildSidebarNav(role, liveCounts), pathname);
  const title = pageTitle(pathname);

  // Header filters refine the CURRENT route's query in place (no redirect): preserve existing params, set/clear the one
  // filter, drop pagination. On /gigs this drives the browse query; on other list screens the params are simply carried.
  const navFilter = (mut: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams(params?.toString() ?? "");
    mut(p);
    p.delete("page");
    router.push(`${pathname}?${p.toString()}`);
  };
  const setParam = (key: string, value: string, clearWhen = "") =>
    navFilter((p) => (value && value !== clearWhen ? p.set(key, value) : p.delete(key)));
  const curBudget = BUDGET_RANGES.find((b) => b.min === (params?.get("minBudget") ?? "") && b.max === (params?.get("maxBudget") ?? ""))?.value ?? "";
  const onBudget = (v: string) => {
    const r = BUDGET_RANGES.find((b) => b.value === v);
    navFilter((p) => {
      if (r && r.min) p.set("minBudget", r.min);
      else p.delete("minBudget");
      if (r && r.max) p.set("maxBudget", r.max);
      else p.delete("maxBudget");
    });
  };

  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => setTheme(getStoredTheme()), []);
  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  // «« sidebar collapse (Спец #7): a real toggle, persisted in localStorage and restored on load. Default expanded on
  // first visit. Collapsed → an icon-only rail (labels/counts/profile text/support copy hidden; icons remain).
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  useEffect(() => {
    try {
      setDesktopCollapsed(window.localStorage.getItem("gigly.sidebar.collapsed") === "1");
    } catch {}
  }, []);
  const toggleCollapsed = () =>
    setDesktopCollapsed((c) => {
      const next = !c;
      try {
        window.localStorage.setItem("gigly.sidebar.collapsed", next ? "1" : "0");
      } catch {}
      return next;
    });

  // Phone-width reflow (responsive-my-gigs / Гигли баги #5): below 1024px the row-shell + fixed 283px sidebar overflow
  // horizontally. At narrow widths the sidebar becomes an off-canvas DRAWER (position:fixed, out of flow → main takes
  // the full viewport width) toggled by a header hamburger; it's always shown EXPANDED there (the icon-rail collapse is
  // a desktop-only affordance). Everything below branches on the effective `collapsed` — false whenever narrow.
  const isNarrow = useIsNarrow();
  const collapsed = isNarrow ? false : desktopCollapsed;
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  // Close the drawer whenever the route changes (a nav tap navigates) or we leave narrow widths.
  useEffect(() => setMobileNavOpen(false), [pathname]);
  useEffect(() => {
    if (!isNarrow) setMobileNavOpen(false);
  }, [isNarrow]);

  // The GIGLY wordmark + collapse-expand icon rail route home for the current shell (Спец #14).
  const home = admin ? "/admin" : "/dashboard";

  const [q, setQ] = useState("");
  const onSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") router.push(q.trim() ? `/gigs?search=${encodeURIComponent(q.trim())}` : "/gigs");
  };

  // The gear opens the «Настройки» popup over the current page (query-param driven — SettingsModal renders on ?settings=1).
  const openSettings = () => {
    const p = new URLSearchParams(params?.toString() ?? "");
    p.set("settings", "1");
    router.push(`${pathname}?${p.toString()}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        background: "var(--surface-app)",
        color: "var(--text-1)",
        fontFamily: "'SF Compact',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      }}
    >
      <Heartbeat />
      <a
        href="#main-content"
        style={{ position: "absolute", left: -9999, top: 0 }}
        onFocus={(e) => Object.assign(e.currentTarget.style, { left: "16px", top: "16px", zIndex: 50 })}
        onBlur={(e) => Object.assign(e.currentTarget.style, { left: "-9999px" })}
      >
        Перейти к основному содержимому
      </a>

      {/* ░░ mobile drawer backdrop — closes the off-canvas sidebar on tap (narrow widths only) ░░ */}
      {isNarrow && mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
          style={{ position: "fixed", inset: 0, zIndex: 55, background: "rgba(1,3,14,0.55)" }}
        />
      )}

      {/* ░░ SIDEBAR ░░ */}
      <aside
        style={{
          width: collapsed ? 76 : 283,
          flex: "none",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: collapsed ? "24px 14px" : "24px 20px",
          boxSizing: "border-box",
          gap: 24,
          transition: "width 160ms ease",
          ...(isNarrow
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                height: "100dvh",
                minHeight: "100dvh",
                zIndex: 60,
                background: "var(--surface-app)",
                boxShadow: "2px 0 24px rgba(0,0,0,0.4)",
                overflowY: "auto",
                transform: mobileNavOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 200ms ease",
              }
            : null),
        }}
        aria-hidden={isNarrow && !mobileNavOpen ? true : undefined}
        aria-label="Навигация"
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", padding: "4px 4px 0" }}>
          {!collapsed && (
            <Link
              href={home}
              aria-label="На главную"
              style={{ fontFamily: "'Handjet',monospace", fontWeight: 700, fontSize: 30, letterSpacing: 2, color: "var(--text-1)", lineHeight: 1, textDecoration: "none" }}
            >
              GIGLY
            </Link>
          )}
          <button
            type="button"
            onClick={isNarrow ? () => setMobileNavOpen(false) : toggleCollapsed}
            aria-label={isNarrow ? "Закрыть меню" : collapsed ? "Развернуть меню" : "Свернуть меню"}
            aria-expanded={isNarrow ? mobileNavOpen : !collapsed}
            style={{ color: "var(--text-4)", fontSize: 22, cursor: "pointer", lineHeight: 1, background: "none", border: "none", padding: 0 }}
          >
            {isNarrow ? "×" : collapsed ? "»" : "«"}
          </button>
        </div>

        {/* profile card (avatar + name/role + bell + gear) */}
        <div
          style={{
            display: "flex",
            flexDirection: collapsed ? "column" : "row",
            alignItems: "center",
            gap: 10,
            padding: 12,
            borderRadius: 12,
            boxShadow: "inset 0 0 0 1px var(--hairline-08)",
          }}
        >
          {/* avatar + name/role → /profile (the bell/gear column stays outside this link — no nested interactives) */}
          <Link
            href="/profile"
            aria-label="Профиль"
            style={{ flex: collapsed ? "none" : 1, minWidth: 0, display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}
          >
            <span
              style={{
                width: 40,
                height: 40,
                flex: "none",
                borderRadius: "50%",
                background: "var(--surface-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 15,
                color: "var(--text-3)",
              }}
            >
              {profile.name.slice(0, 1).toUpperCase()}
            </span>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--text-1)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {profile.name}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>{profile.sub}</span>
              </div>
            )}
          </Link>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "var(--text-3)" }}>
            {/* Driven by the shell's single poll — the bell does not open its own. */}
            <NotificationBell count={live.notifications} loaded={live.loaded} onRefresh={live.refresh} />
            <button
              type="button"
              onClick={openSettings}
              aria-label="Настройки"
              style={{ color: "var(--text-3)", display: "flex", background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              <GearIcon />
            </button>
          </div>
        </div>

        {/* nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: collapsed ? 0 : 12,
                height: 44,
                padding: collapsed ? 0 : "0 12px",
                borderRadius: 8,
                textDecoration: "none",
                background: item.active ? "var(--hairline-06)" : "transparent",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: item.active ? 1 : 0.7,
                }}
              >
                <Icon src={(ICON as Record<string, string>)[item.icon] ?? item.icon} />
              </span>
              {!collapsed && (
                <span style={{ flex: 1, fontSize: 16, color: item.active ? "var(--text-1)" : "var(--text-3)" }}>{item.label}</span>
              )}
              {!collapsed && item.count != null && (
                <span style={{ fontFamily: "'Handjet',monospace", fontSize: 16, color: item.active ? "var(--text-1)" : "var(--text-4)" }}>
                  {item.count}
                </span>
              )}
              {item.active && (
                <div style={{ position: "absolute", right: -20, top: 8, width: 3, height: 28, borderRadius: 3, background: "var(--om-accent)" }} />
              )}
            </Link>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* support card — the prototype's «Поддержка» block (copy transported verbatim). The «Что случилось?» control
            is wired to the in-app /help support page (mailto + FAQ) — Спец #2. Collapsed → a single icon link to /help. */}
        {collapsed ? (
          <Link
            href="/help"
            title="Поддержка"
            aria-label="Поддержка — что случилось?"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 44,
              borderRadius: 8,
              background: "var(--surface-card)",
              boxShadow: "inset 0 0 0 1px var(--hairline-08)",
              color: "var(--text-3)",
              textDecoration: "none",
            }}
          >
            <QuestionIcon />
          </Link>
        ) : (
          <div
            style={{
              borderRadius: 12,
              background: "var(--surface-card)",
              boxShadow: "inset 0 0 0 1px var(--hairline-08)",
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "var(--text-3)", display: "flex" }}>
                <QuestionIcon />
              </span>
              <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 18, color: "var(--text-1)" }}>Поддержка</span>
            </div>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, lineHeight: "16px", color: "var(--text-3)" }}>
              Привет! Вы на ранней версии платформы. Если что-то пошло не так — напишите. Мы рядом и поможем разобраться.
            </span>
            <Link
              href="/help"
              aria-label="Что случилось?"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 40,
                padding: "0 12px",
                borderRadius: 8,
                background: "var(--surface-sunken)",
                boxShadow: "inset 0 0 0 1px var(--hairline-06)",
                border: "none",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <span style={{ flex: 1, textAlign: "left", color: "var(--text-3)", fontFamily: "'Handjet',monospace", fontSize: 14 }}>Что случилось?</span>
              <span style={{ color: "var(--text-3)", display: "flex" }}>
                <SendIcon />
              </span>
            </Link>
          </div>
        )}

        <form action={logoutUser}>
          <button
            type="submit"
            title="Выйти"
            aria-label="Выйти"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 10,
              width: "100%",
              height: 44,
              padding: collapsed ? 0 : "0 12px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "var(--text-3)",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            <LogoutIcon />
            {!collapsed && "Выйти"}
          </button>
        </form>
      </aside>

      {/* ░░ MAIN ░░ */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header style={{ padding: isNarrow ? "16px 16px 0 16px" : "40px 48px 0 24px", display: "flex", flexDirection: "column", gap: isNarrow ? 16 : 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
              {isNarrow && (
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(true)}
                  aria-label="Открыть меню"
                  aria-expanded={mobileNavOpen}
                  style={{ flex: "none", width: 40, height: 40, borderRadius: 8, background: "var(--surface-sunken)", color: "var(--text-2)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M2 4.5h12a.5.5 0 0 0 0-1H2a.5.5 0 0 0 0 1zm0 4h12a.5.5 0 0 0 0-1H2a.5.5 0 0 0 0 1zm0 4h12a.5.5 0 0 0 0-1H2a.5.5 0 0 0 0 1z" />
                  </svg>
                </button>
              )}
              <div style={{ width: 4, height: 30, borderRadius: 4, background: "var(--om-accent)", flex: "none" }} />
              <h1
                style={{
                  margin: 0,
                  fontFamily: "'Handjet',monospace",
                  fontWeight: 700,
                  fontSize: isNarrow ? 24 : 34,
                  letterSpacing: 1,
                  color: "var(--text-1)",
                  whiteSpace: isNarrow ? "normal" : "nowrap",
                  overflowWrap: "anywhere",
                  minWidth: 0,
                }}
              >
                {title}
              </h1>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              title="Вид"
              aria-label="Переключить тему"
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                background: "var(--surface-sunken)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-3)",
                border: "none",
              }}
            >
              <ViewIcon />
            </button>
          </div>

          {showSearch(pathname) && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: isNarrow ? "wrap" : "nowrap" }}>
              <div
                style={{
                  flex: 1,
                  minWidth: isNarrow ? "100%" : 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 48,
                  padding: "0 18px",
                  borderRadius: 8,
                  background: "var(--surface-sunken)",
                  boxShadow: "inset 0 0 0 1px var(--hairline-06)",
                }}
              >
                <span style={{ color: "var(--text-4)", display: "flex" }}>
                  <SearchIcon />
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={onSearch}
                  placeholder="Поиск чего угодно..."
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "var(--text-1)",
                    fontFamily: "'Handjet',monospace",
                    fontSize: 16,
                  }}
                />
              </div>
              <HeaderFilter label="Категория" value={params?.get("category") ?? ""} options={CATEGORY_OPTS} onChange={(v) => setParam("category", v)} />
              <HeaderFilter label="Бюджет" value={curBudget} options={BUDGET_RANGES} onChange={onBudget} />
              <HeaderFilter label="Сортировка" value={params?.get("sort") ?? "newest"} defaultValue="newest" options={SORT_OPTS} onChange={(v) => setParam("sort", v, "newest")} />
              <HeaderFilter label="Рейтинг" value={params?.get("minRating") ?? ""} options={RATING_OPTS} onChange={(v) => setParam("minRating", v)} />
            </div>
          )}
        </header>

        {/* The design's standard content padding (--om-content-pad) lives here so each screen doesn't repeat it; the
            header's pad-bottom is 0, so content starts right below the title. */}
        <div id="main-content" tabIndex={-1} style={{ minWidth: 0, flex: 1, outline: "none", padding: isNarrow ? "16px 16px 32px 16px" : "24px 48px 48px 24px" }}>
          {children}
        </div>
      </main>

      {/* «Настройки» popup — overlays the current page when ?settings=1 is set (opened by the sidebar gear). */}
      <SettingsModal />
    </div>
  );
}

// Header filter chip (prototype data-dc-tpl="57"): funnel + fixed label + «⌄», with a full-bleed transparent native
// <select> overlaid for real dropdown behaviour + a11y. The chip border tints accent when a non-default value is set.
function HeaderFilter({
  label,
  value,
  defaultValue = "",
  options,
  onChange,
}: {
  label: string;
  value: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const active = value !== defaultValue;
  return (
    <div
      style={{
        position: "relative",
        flex: "none",
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: 48,
        padding: "0 16px",
        borderRadius: 8,
        background: "var(--surface-sunken)",
        boxShadow: active ? "inset 0 0 0 1px var(--om-accent)" : "inset 0 0 0 1px var(--hairline-06)",
        whiteSpace: "nowrap",
      }}
    >
      <FilterFunnelIcon />
      <span style={{ fontFamily: "'Handjet',monospace", fontSize: 16, color: active ? "var(--text-1)" : "var(--text-3)" }}>{label}</span>
      <span style={{ color: "var(--text-4)", fontSize: 13 }}>⌄</span>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", border: "none", appearance: "none", WebkitAppearance: "none" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "var(--surface-card)", color: "var(--text-1)" }}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
function FilterFunnelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "var(--text-3)", flex: "none" }}>
      <path d="M2.5 3.5h11l-4.2 5v4l-2.6-1.3v-2.7z" />
    </svg>
  );
}

// ── inline icons (design header view icon + sidebar gear/logout/search) ──
function ViewIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2.5" y="3.5" width="13" height="11" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <line x1="11" y1="3.5" x2="11" y2="14.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.376l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.318z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
      <path d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
    </svg>
  );
}
function QuestionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
    </svg>
  );
}
