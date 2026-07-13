"use client";

// Dashboard rebuilt DIRECTLY on the prototype's own markup (Gigly App.dc.html DASHBOARD block, line 120+): WELCOME
// (two onboarding tiles with the bleed images) + BOARD («Мои гиги» feed with tabs + the role panel «Найти новый
// гиг»/«Создайте первый гиг» + «Сообщения») + «Требует внимания» (specialist). Wired to a normalized DashboardVM
// (built in page.tsx from getClientDashboard/getSpecialistDashboard); the gig feed uses the reusable design GigCard.

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { GigCardVM, OnboardingCardVM, AttentionCardVM, ConversationItemVM } from "@/app/components/blocks/view-models";
import { GigCard } from "@/app/_design/GigCard";
import { AttentionCardDesign } from "@/app/_design/AttentionCardDesign";
import { avatarColor, applyGigFilters } from "@/app/_design/util";
import "@/app/_design/tokens.css";

export type DashboardVM = {
  role: "CLIENT" | "SPECIALIST";
  completion: number;
  onboarding: OnboardingCardVM[];
  gigCards: (GigCardVM & { filterKey: string })[];
  tabs: { value: string; label: string; count?: number }[];
  attention: AttentionCardVM[];
  messages: ConversationItemVM[];
};

const h2: React.CSSProperties = {
  margin: 0,
  fontFamily: "'Handjet',monospace",
  fontWeight: 600,
  fontSize: 26,
  color: "var(--text-1)",
  whiteSpace: "nowrap",
  flex: "none",
};
const countBadge: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 24,
  height: 24,
  padding: "0 7px",
  borderRadius: 6,
  background: "var(--om-accent, #0088ff)",
  color: "#fff",
  fontFamily: "'Handjet',monospace",
  fontWeight: 700,
  fontSize: 15,
};

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
    </svg>
  );
}

function OnboardingTile({
  card,
  img,
  imgStyle,
  onAction,
  titleFontSize = 22,
  titleLineHeight = "23px",
  actionIcon,
}: {
  card: OnboardingCardVM;
  img: string;
  imgStyle: React.CSSProperties;
  onAction: () => void;
  titleFontSize?: number;
  titleLineHeight?: string;
  actionIcon?: React.ReactNode;
}) {
  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        borderRadius: 12,
        background: "var(--surface-card)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          transform: "scaleX(-1)",
          mixBlendMode: "color-dodge",
          background: `url(${img}) center/cover no-repeat`,
          ...imgStyle,
        }}
      />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: titleFontSize, lineHeight: titleLineHeight, color: "var(--text-1)" }}>
          {card.title}
        </span>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "16px", color: "var(--text-3)" }}>{card.subtitle}</span>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 6, background: "var(--hairline-10)", overflow: "hidden" }}>
          <div style={{ width: `${card.progress}%`, height: "100%", background: "var(--om-accent, #0088ff)", borderRadius: 6 }} />
        </div>
        <span style={{ fontFamily: "'Handjet',monospace", fontSize: 13, color: "var(--text-3)" }}>{card.progress}%</span>
      </div>
      <button
        type="button"
        onClick={onAction}
        style={{
          position: "relative",
          zIndex: 1,
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 40,
          padding: "0 16px",
          border: "none",
          borderRadius: 8,
          background: "var(--surface-secondary)",
          color: "var(--text-1)",
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        {card.cta.label}
        {actionIcon}
      </button>
    </div>
  );
}

function MessageRow({ m }: { m: ConversationItemVM }) {
  return (
    <Link
      href={`/chats?gig=${m.id}`}
      style={{ display: "flex", flexDirection: "column", gap: 16, padding: "16px 12px 12px", borderRadius: 8, background: "var(--surface-card)", textDecoration: "none" }}
    >
      {/* header: avatar + name pill, unread count */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            width: 26,
            height: 26,
            flex: "none",
            borderRadius: 999,
            background: avatarColor(m.name || "?"),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {(m.name || "?").slice(0, 1)}
        </span>
        <span style={{ flex: 1, minWidth: 0, fontFamily: "'Manrope',sans-serif", fontSize: 13, fontWeight: 600, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {m.name}
        </span>
        {m.unread > 0 && (
          <span
            style={{
              width: 22,
              height: 22,
              flex: "none",
              borderRadius: 999,
              background: "var(--om-accent, #0088ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Handjet',monospace",
              fontSize: 12,
              color: "#fff",
            }}
          >
            {m.unread}
          </span>
        )}
      </div>
      {/* 3-line preview */}
      <span
        style={{
          fontFamily: "'Manrope',sans-serif",
          fontSize: 14,
          lineHeight: "100%",
          color: "var(--text-3)",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 3,
          overflow: "hidden",
        }}
      >
        {m.preview}
      </span>
      {/* footer: subtitle (e.g. gig title) + relative time */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <span style={{ flex: 1, minWidth: 0, fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {m.subtitle ?? ""}
        </span>
        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "var(--text-3)", flex: "none" }}>{m.timestamp}</span>
      </div>
    </Link>
  );
}

export function DashboardDesign({ vm }: { vm: DashboardVM }) {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const isCompany = vm.role === "CLIENT";
  const isSpecialist = vm.role === "SPECIALIST";
  const tabbed = tab === "all" ? vm.gigCards : vm.gigCards.filter((g) => g.filterKey === tab);
  const feed = applyGigFilters(tabbed, params); // header chips (category/budget/rating/sort) filter this feed too

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* WELCOME */}
      <div style={{ display: "flex", gap: 32, padding: 24, borderRadius: 12, background: "var(--surface-sunken)", boxSizing: "border-box" }}>
        <div style={{ width: 317, flex: "none", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 24 }}>
          <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 18, color: "var(--om-accent, #0088ff)" }}>Добро пожаловать в Gigly!</span>
          <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 24, lineHeight: "26px", color: "var(--text-1)" }}>Вот что важно знать на старте</span>
        </div>
        <div style={{ flex: 1, display: "flex", gap: 16 }}>
          {vm.onboarding[0] && (
            <OnboardingTile
              card={vm.onboarding[0]}
              img="/assets/design-system/welcome/welcome-person.png"
              imgStyle={{ right: -30, top: -12, width: 179, height: 240 }}
              onAction={() => router.push("/profile")}
              actionIcon={<PencilIcon />}
            />
          )}
          {vm.onboarding[1] && (
            <OnboardingTile
              card={vm.onboarding[1]}
              img="/assets/design-system/welcome/welcome-sheets.png"
              imgStyle={{ right: -20, top: -19, width: 226, height: 303 }}
              onAction={() => router.push("/guide")}
              titleFontSize={18}
              titleLineHeight="normal"
            />
          )}
        </div>
      </div>

      {/* BOARD */}
      <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
        {/* col 1 — Мои гиги */}
        <div style={{ flex: 1, minWidth: 0, borderRadius: 12, background: "var(--surface-sunken)", overflow: "hidden" }}>
          <div style={{ padding: "24px 24px 16px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={h2}>Мои гиги</h2>
              <span style={countBadge}>{vm.gigCards.length}</span>
              <div style={{ flex: 1 }} />
              {isCompany && (
                <Link
                  href="/gigs/new"
                  aria-label="Создать гиг"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "var(--om-accent, #0088ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 22,
                    lineHeight: 1,
                    textDecoration: "none",
                  }}
                >
                  +
                </Link>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {vm.tabs.map((t) => {
                const active = tab === t.value;
                return (
                  <div
                    key={t.value}
                    onClick={() => setTab(t.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      height: 36,
                      padding: "0 14px",
                      borderRadius: 8,
                      cursor: "pointer",
                      background: active ? "var(--surface-secondary)" : "transparent",
                      boxShadow: active ? "inset 0 0 0 1px var(--hairline-08)" : "inset 0 0 0 1px transparent",
                    }}
                  >
                    <span style={{ fontSize: 14, color: active ? "var(--switch-active-fg, var(--text-1))" : "var(--text-3)" }}>{t.label}</span>
                    <span style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: active ? "var(--om-accent, #0088ff)" : "var(--text-4)" }}>{t.count ?? 0}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ padding: "0 16px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {feed.length > 0 ? (
              feed.map((g) => <GigCard key={g.id} vm={g} />)
            ) : (
              <div style={{ gridColumn: "1 / -1", padding: 24, borderRadius: 12, background: "var(--surface-card)", color: "var(--text-3)", fontFamily: "'Manrope',sans-serif", fontSize: 14 }}>
                Здесь пока пусто.
              </div>
            )}
          </div>
        </div>

        {/* col 2 */}
        <div style={{ width: 400, flex: "none", display: "flex", flexDirection: "column", gap: 6 }}>
          {isSpecialist && (
            <div
              style={{
                borderRadius: 12,
                background: "linear-gradient(248deg, rgba(0,136,255,0.08) 50%, rgba(0,136,255,0.14) 94%), var(--surface-sunken)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <h2 style={h2}>Найти новый гиг</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  height: 48,
                  padding: "0 18px",
                  borderRadius: 8,
                  background: "rgba(1,3,14,0.5)",
                  boxShadow: "inset 0 0 0 1px var(--hairline-08)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ color: "var(--text-4)" }}>
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") router.push(q.trim() ? `/gigs?search=${encodeURIComponent(q.trim())}` : "/gigs");
                  }}
                  placeholder="Поиск по стеку или категории"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--text-1)", fontFamily: "'Handjet',monospace", fontSize: 15 }}
                />
              </div>
            </div>
          )}
          {isCompany && (
            <div
              style={{
                borderRadius: 12,
                background: "linear-gradient(248deg, rgba(0,136,255,0.12) 50%, rgba(0,136,255,0.2) 94%), var(--surface-sunken)",
                boxShadow: "inset 0 0 0 1px rgba(0,136,255,0.35)",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <h2 style={h2}>Создайте первый гиг</h2>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "18px", color: "var(--text-3)" }}>Опишите бюджет, сроки и точный результат.</span>
              <Link
                href="/gigs/new"
                style={{
                  height: 48,
                  borderRadius: 8,
                  background: "var(--om-accent, #0088ff)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  textDecoration: "none",
                }}
              >
                Создать гиг +
              </Link>
            </div>
          )}

          <div style={{ borderRadius: 12, background: "var(--surface-sunken)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "24px 24px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={h2}>Сообщения</h2>
              <span style={countBadge}>{vm.messages.length}</span>
            </div>
            <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              {vm.messages.length > 0 ? (
                vm.messages.map((m, i) => <MessageRow key={i} m={m} />)
              ) : (
                <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-3)" }}>Сообщений пока нет.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ТРЕБУЕТ ВНИМАНИЯ */}
      {vm.attention.length > 0 && (
        <div style={{ borderRadius: 12, background: "var(--surface-card)", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={h2}>Требует внимания</h2>
            <span style={countBadge}>{vm.attention.length}</span>
          </div>
          <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 4 }}>
            {vm.attention.map((a, i) => (
              <AttentionCardDesign key={i} vm={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
