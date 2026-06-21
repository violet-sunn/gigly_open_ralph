"use client";

// App shell rebuilt DIRECTLY on the gigly_full_design prototype's own markup (Gigly App.dc.html — the <aside> sidebar
// lines 21-76 + the <header> zone lines 82-118). Inline styles ported verbatim so the design's tokens/fonts resolve
// exactly (app/_design/tokens.css). Wired to real data: nav via lib/nav (buildSidebarNav + markActive over usePathname),
// the live NotificationBell, the logoutUser action, and the «Вид» button toggling the real theme. The «ПРОЕКТ»-style
// page title is derived per-route. Replaces the old AppShell + SidebarNavLive + TopbarLive in the protected layout.

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/app/components/primitives";
import { ICON } from "@/app/components/primitives/tokens";
import { NotificationBell } from "@/app/components/NotificationBell";
import { logoutUser } from "@/app/actions/auth";
import { buildSidebarNav, markActive, type NavRole, type NavCounts } from "@/lib/nav";
import { getStoredTheme, applyTheme, type Theme } from "@/lib/theme";
import "./tokens.css";

// pathname → the design's uppercase RU page title (Gigly App.dc.html TITLES). Most-specific prefix first.
function pageTitle(pathname: string): string {
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
  return "GIGLY";
}
// The design shows the search bar only on the list screens (dashboard / browse / my-gigs).
const showSearch = (pathname: string) => ["/dashboard", "/gigs", "/my-gigs"].includes(pathname);

export function AppShellDesign({
  profile,
  role,
  counts,
  children,
}: {
  profile: { name: string; sub: string };
  role: NavRole;
  counts: NavCounts;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const items = markActive(buildSidebarNav(role, counts), pathname);
  const title = pageTitle(pathname);

  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => setTheme(getStoredTheme()), []);
  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  };

  const [q, setQ] = useState("");
  const onSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") router.push(q.trim() ? `/gigs?search=${encodeURIComponent(q.trim())}` : "/gigs");
  };

  const roleSegs: [string, boolean][] =
    role === "SPECIALIST"
      ? [["Специалист", true], ["Компания", false]]
      : [["Специалист", false], ["Компания", true]];

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
      <a
        href="#main-content"
        style={{ position: "absolute", left: -9999, top: 0 }}
        onFocus={(e) => Object.assign(e.currentTarget.style, { left: "16px", top: "16px", zIndex: 50 })}
        onBlur={(e) => Object.assign(e.currentTarget.style, { left: "-9999px" })}
      >
        Перейти к основному содержимому
      </a>

      {/* ░░ SIDEBAR ░░ */}
      <aside
        style={{
          width: 283,
          flex: "none",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "24px 20px",
          boxSizing: "border-box",
          gap: 24,
        }}
        aria-label="Навигация"
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 4px 0" }}>
          <div style={{ fontFamily: "'Handjet',monospace", fontWeight: 700, fontSize: 30, letterSpacing: 2, color: "var(--text-1)", lineHeight: 1 }}>
            GIGLY
          </div>
          <div style={{ color: "var(--text-4)", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>«</div>
        </div>

        {/* profile card (avatar + name/role + bell + gear) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: 12,
            borderRadius: 12,
            boxShadow: "inset 0 0 0 1px var(--hairline-08)",
          }}
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "var(--text-3)" }}>
            <NotificationBell />
            <Link href="/settings" aria-label="Настройки" style={{ color: "var(--text-3)", display: "flex" }}>
              <GearIcon />
            </Link>
          </div>
        </div>

        {/* role indicator (the prototype's role switcher — a single-role app shows the active side, non-interactive) */}
        <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 10, background: "var(--surface-deep)", marginTop: -12 }}>
          {roleSegs.map(([label, active]) => (
            <div
              key={label}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 0",
                borderRadius: 7,
                fontSize: 12,
                whiteSpace: "nowrap",
                background: active ? "rgba(255,255,255,0.06)" : "transparent",
                color: active ? "var(--text-1)" : "var(--text-4)",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 12,
                height: 44,
                padding: "0 12px",
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
              <span style={{ flex: 1, fontSize: 16, color: item.active ? "var(--text-1)" : "var(--text-3)" }}>{item.label}</span>
              {item.count != null && (
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

        {/* help box (the prototype's «Нужна помощь?» Massage card) */}
        <div
          style={{
            borderRadius: 12,
            background: "var(--surface-card)",
            boxShadow: "inset 0 0 0 1px var(--hairline-08)",
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>Нужна помощь?</span>
          <textarea
            placeholder="Опишите вопрос…"
            aria-label="Поддержка"
            style={{
              height: 60,
              resize: "none",
              borderRadius: 8,
              background: "var(--hairline-05)",
              boxShadow: "inset 0 0 0 1px var(--hairline-08)",
              border: "none",
              outline: "none",
              padding: 10,
              color: "var(--text-1)",
              fontFamily: "'Manrope',sans-serif",
              fontSize: 13,
            }}
          />
          <button
            type="button"
            style={{
              height: 36,
              border: "none",
              borderRadius: 8,
              background: "var(--surface-secondary)",
              color: "var(--text-2)",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Отправить
          </button>
        </div>

        <form action={logoutUser}>
          <button
            type="submit"
            title="Выйти"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              height: 44,
              padding: "0 12px",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "var(--text-3)",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            <LogoutIcon /> Выйти
          </button>
        </form>
      </aside>

      {/* ░░ MAIN ░░ */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header style={{ padding: "40px 48px 0 24px", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 4, height: 30, borderRadius: 4, background: "var(--om-accent)" }} />
              <h1
                style={{
                  margin: 0,
                  fontFamily: "'Handjet',monospace",
                  fontWeight: 700,
                  fontSize: 34,
                  letterSpacing: 1,
                  color: "var(--text-1)",
                  whiteSpace: "nowrap",
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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  flex: 1,
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
            </div>
          )}
        </header>

        {/* The design's standard content padding (--om-content-pad) lives here so each screen doesn't repeat it; the
            header's pad-bottom is 0, so content starts right below the title. */}
        <div id="main-content" tabIndex={-1} style={{ minWidth: 0, flex: 1, outline: "none", padding: "24px 48px 48px 24px" }}>
          {children}
        </div>
      </main>
    </div>
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
