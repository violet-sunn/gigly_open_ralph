"use client";

// «Профиль» rebuilt on the prototype's profile blocks (Gigly App.dc.html line 309+ specialist, 407+ company): the ID
// card (avatar + name + role + verified/since OR company реквизиты) then, for a SPECIALIST, the 2-col BLOCK — Стек,
// Опыт (bio + experience), Избранные категории, Реализованные проекты (design GigCards). Owner edit pencils →
// /profile/edit (the existing edit form). The shell header supplies the «ПРОФИЛЬ» title.

import { useRouter } from "next/navigation";
import type { ProfileData } from "@/lib/view-models";
import { GigCard } from "@/app/_design/GigCard";
import { CAT_RGB, PatchIcon } from "@/app/_design/util";
import "@/app/_design/tokens.css";

const card: React.CSSProperties = { borderRadius: 8, background: "var(--surface-card)", padding: 20, display: "flex", flexDirection: "column", gap: 16 };
const blockH2: React.CSSProperties = { fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 22, color: "var(--text-1)" };

function Pencil({ onClick }: { onClick?: () => void }) {
  if (!onClick) return null;
  return (
    <span onClick={onClick} style={{ color: "var(--text-3)", display: "flex", cursor: "pointer" }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
      </svg>
    </span>
  );
}

export function ProfileDesign({ data }: { data: ProfileData }) {
  const router = useRouter();
  const edit = data.isOwner ? () => router.push("/profile/edit?from=profile") : undefined;
  const h = data.header;
  const initials = h.name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {/* ID card */}
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ width: 196, flex: "none", borderRadius: 12, background: "radial-gradient(330px 1175px at 0% 100%, rgba(0,136,255,0.21) 0%, rgba(255,255,255,0) 100%), var(--hairline-05)", boxShadow: "inset 0 0 0 1px var(--hairline-10)", display: "flex", flexDirection: "column", gap: 18, padding: 24, boxSizing: "border-box" }}>
          <div
            style={{
              width: 148,
              height: 170,
              borderRadius: 12,
              background: h.avatar ? `url(${h.avatar}) center/cover no-repeat` : "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Handjet',monospace",
              fontWeight: 700,
              fontSize: 64,
              color: "#0a0a0a",
            }}
          >
            {!h.avatar && initials}
          </div>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 6, padding: "3px 12px", borderRadius: 666, background: "var(--hairline-05)" }}>
            <span style={{ width: 6, height: 6, flex: "none", borderRadius: "50%", background: "#9fa0a4" }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "#9fa0a4" }}>offline</span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0, display: "flex", gap: 24, alignItems: "stretch", padding: "12px 0" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 32, lineHeight: "36px", color: "var(--text-1)" }}>{h.name}</span>
              <Pencil onClick={edit} />
            </div>
            <span style={{ alignSelf: "flex-start", fontFamily: "'Handjet',monospace", fontSize: 16, background: "#fff", color: "#0066cc", padding: "1px 6px", whiteSpace: "nowrap" }}>{h.roleTag}</span>
            {data.role === "SPECIALIST" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                {h.verified && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "var(--om-accent, #0088ff)", display: "flex", flex: "none" }}>
                      <PatchIcon size={16} />
                    </span>
                    <span style={{ fontFamily: "'Handjet',monospace", fontSize: 13, color: "#9fa0a4" }}>Номер телефона верифицирован</span>
                  </div>
                )}
                <span style={{ fontFamily: "'Handjet',monospace", fontSize: 13, color: "#9fa0a4" }}>На платформе с {h.memberSince}</span>
              </div>
            )}
          </div>

          {data.role === "SPECIALIST" ? (
            <div style={{ flex: 1, borderRadius: 12, background: "radial-gradient(380px 475px at 50% 50%, rgba(0,136,255,0.3) 0%, rgba(255,255,255,0) 100%), var(--hairline-05)", boxShadow: "inset 0 0 0 1px var(--hairline-10)", display: "flex", flexDirection: "column", gap: 12, justifyContent: "center", alignItems: "center", padding: 24, textAlign: "center" }}>
              <span style={{ fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 22, color: "var(--text-1)" }}>Здесь будет ваша статистика</span>
              <span style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: "#7b8995" }}>Окно находится на стадии разработки</span>
            </div>
          ) : (
            <div style={{ flex: 1, borderRadius: 12, background: "var(--surface-card)", boxShadow: "inset 0 0 0 1px var(--hairline-10)", display: "flex", flexDirection: "column", gap: 16, justifyContent: "center", padding: 24 }}>
              <span style={{ fontFamily: "'Handjet',monospace", fontSize: 13, color: "var(--text-4)" }}>Реквизиты</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>ИНН</span>
                <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 18, color: "var(--text-1)" }}>{data.company?.inn || "—"}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>КПП</span>
                <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 18, color: "var(--text-1)" }}>{data.company?.kpp || "—"}</span>
              </div>
              <span style={{ fontFamily: "'Handjet',monospace", fontSize: 11, color: "var(--text-4)" }}>Проверка ИНН/КПП — на этапе пострелиза (MVP).</span>
            </div>
          )}
        </div>
      </div>

      {/* BLOCK — specialist only */}
      {data.role === "SPECIALIST" && data.stack && data.categories && data.experience && (
        <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={blockH2}>Стек</span>
                <Pencil onClick={edit} />
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {data.stack.tags.length > 0 ? (
                  data.stack.tags.map((t, i) => (
                    <span key={i} style={{ fontSize: 13, color: "#4ea3ff", background: "rgba(0,136,255,0.1)", borderRadius: 6, padding: "5px 12px" }}>{t.label}</span>
                  ))
                ) : (
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-4)" }}>Стек не указан.</span>
                )}
              </div>
            </div>

            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={blockH2}>Опыт</span>
                <Pencil onClick={edit} />
              </div>
              {data.experience.bio && (
                <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "18px", color: "var(--text-3)", whiteSpace: "pre-line" }}>{data.experience.bio}</span>
              )}
              {data.experience.entries.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {data.experience.entries.map((e, i) => (
                    <div key={i} style={{ borderRadius: 12, boxShadow: "inset 0 0 0 1px var(--hairline-12)", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 500, fontSize: 16, color: "var(--text-1)" }}>{e.company}</span>
                        <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "var(--text-3)", flex: "none" }}>{e.period}</span>
                      </div>
                      {e.title && <span style={{ fontFamily: "'Handjet',monospace", fontSize: 14, color: "#4ea3ff" }}>{e.title}</span>}
                      {e.description && <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "18px", color: "var(--text-3)" }}>{e.description}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={blockH2}>Избранные категории</span>
                <Pencil onClick={edit} />
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {data.categories.categories.filter((c) => c.favorite).length > 0 ? (
                  data.categories.categories
                    .filter((c) => c.favorite)
                    .map((c) => (
                      <span key={c.slug} style={{ fontSize: 14, color: `rgb(${CAT_RGB[c.slug] ?? "0,136,255"})` }}>[ {c.label} ]</span>
                    ))
                ) : (
                  <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-4)" }}>Категории не выбраны.</span>
                )}
              </div>
            </div>

            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={blockH2}>Реализованные проекты</span>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 22, height: 22, padding: "0 7px", borderRadius: 6, background: "var(--om-accent, #0088ff)", color: "#fff", fontFamily: "'Handjet',monospace", fontWeight: 700, fontSize: 14 }}>
                  {data.realized.length}
                </span>
              </div>
              {data.realized.length > 0 ? (
                data.realized.map((g) => <GigCard key={g.id} vm={g} full />)
              ) : (
                <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, color: "var(--text-4)" }}>Пока нет завершённых проектов.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
