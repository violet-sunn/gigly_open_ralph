"use client";

// The landing page's one live thing: move the budget, read the real figures. Every number comes from the
// fee SSOT (lib/pricing.ts), so the page can never disagree with what the server charges. Server-renders
// with the default budget, so the figures are there without JavaScript; the slider only changes them.

import { useState } from "react";
import Link from "next/link";
import { SERVICE_FEE_PCT_LABEL, serviceFeeRoubles } from "@/lib/pricing";

const DEFAULT_BUDGET = 150_000;
const MIN_BUDGET = 10_000; // the product's minimum gig size
const MAX_BUDGET = 1_000_000;

const rub = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
export const money = (n: number) => `${rub.format(n)} ₽`;

/** The product's own fee panel, as it appears on create-gig. A cropped interface fragment, so `data-ui`. */
export function FeeFragment({ budget = DEFAULT_BUDGET }: { budget?: number }) {
  const fee = serviceFeeRoubles(budget);
  const row = (label: string, value: string, strong = false) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
      <span style={{ fontSize: 12, color: strong ? "var(--text-1)" : "var(--text-3)", fontWeight: strong ? 600 : 400 }}>{label}</span>
      <span style={{ fontFamily: "'Handjet',monospace", fontSize: strong ? 20 : 16, color: "var(--text-1)", whiteSpace: "nowrap" }}>{value}</span>
    </div>
  );
  return (
    <div
      data-ui
      style={{
        borderRadius: 16,
        background: "var(--surface-card)",
        boxShadow: "inset 0 0 0 1px var(--hairline-08)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontFamily: "'Manrope',sans-serif",
        color: "var(--text-1)",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600 }}>Стоимость</span>
      {row("Бюджет", money(budget))}
      {row(`Сервисный сбор (${SERVICE_FEE_PCT_LABEL})`, money(fee))}
      <div style={{ height: 1, background: "var(--hairline-10)" }} />
      {row("Итого к оплате", money(budget + fee), true)}
      <span style={{ fontSize: 11, color: "var(--text-3)", lineHeight: "15px" }}>Специалист получает бюджет целиком</span>
      <span style={{ fontSize: 11, color: "var(--text-3)", lineHeight: "15px" }}>Оплата отмечается после приёмки работы</span>
    </div>
  );
}

export function LandingFee({ session }: { session: boolean }) {
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const fee = serviceFeeRoubles(budget);
  const total = budget + fee;

  return (
    <div className="figure-wrap" data-reveal>
      <p className="figure num" data-i style={{ "--i": 0 } as React.CSSProperties} aria-live="polite">
        <span>{rub.format(total)}</span>
        <span className="cur">₽</span>
      </p>
      <div className="overlap" data-i style={{ "--i": 2 } as React.CSSProperties}>
        <FeeFragment budget={budget} />
      </div>
      <div className="lines" data-i style={{ "--i": 1 } as React.CSSProperties}>
        <span>Бюджет гига {money(budget)}</span>
        <span>Сервисный сбор {SERVICE_FEE_PCT_LABEL}: {money(fee)}</span>
        <span>Заказчик платит {money(total)}</span>
        <span>Специалист получает {money(budget)}</span>
      </div>
      <div className="range" data-i style={{ "--i": 3 } as React.CSSProperties}>
        <label htmlFor="lp-budget">
          <span>Передвиньте бюджет</span>
          <span className="num">{money(budget)}</span>
        </label>
        <input
          id="lp-budget"
          type="range"
          min={MIN_BUDGET}
          max={MAX_BUDGET}
          step={5_000}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
      </div>
      <div className="cta" data-i style={{ "--i": 4 } as React.CSSProperties}>
        <Link className="lp-btn" href={session ? "/gigs/new" : "/register"}>
          {session ? "Создать гиг" : "Создать аккаунт"}
        </Link>
      </div>
    </div>
  );
}
