// Shared shell for the public legal / help pages linked from the auth footer (/privacy, /terms, /help).
// Presentational only — token-pure via app/_design/tokens.css, matching the AuthDesign surface (Handjet wordmark,
// Manrope body). Scoped <style> lets the page bodies write plain semantic h2/p/ul without global CSS bleed.
import Link from "next/link";
import "./tokens.css";

const MONO = "'Handjet',monospace";
const GROTESK = "'Manrope',sans-serif";

export function LegalDoc({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "var(--surface-app)", color: "var(--text-1)" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 96px", boxSizing: "border-box" }}>
        <Link
          href="/"
          style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: "var(--text-1)", textDecoration: "none" }}
        >
          GIGLY
        </Link>

        <h1 style={{ fontFamily: MONO, fontWeight: 600, fontSize: 34, letterSpacing: 1, margin: "40px 0 6px" }}>{title}</h1>
        <p style={{ fontFamily: GROTESK, fontSize: 13, color: "var(--text-3)", margin: 0 }}>Обновлено: {updated}</p>

        <article className="legal-doc" style={{ fontFamily: GROTESK, marginTop: 32 }}>
          {children}
        </article>

        <div style={{ marginTop: 48 }}>
          <Link href="/login" style={{ fontFamily: MONO, fontSize: 15, color: "var(--om-accent)", textDecoration: "none" }}>
            ← Вернуться ко входу
          </Link>
        </div>
      </div>

      <style>{`
        .legal-doc h2 { font-family: ${MONO}; font-weight: 600; font-size: 20px; letter-spacing: .5px; margin: 34px 0 10px; color: var(--text-1); }
        .legal-doc p, .legal-doc li { font-size: 15px; line-height: 1.7; color: var(--text-2, var(--text-1)); }
        .legal-doc p { margin: 0 0 12px; }
        .legal-doc ul { list-style: disc outside; margin: 0 0 12px; padding-left: 22px; }
        .legal-doc li { display: list-item; }
        .legal-doc li { margin: 0 0 6px; }
        .legal-doc a { color: var(--om-accent); text-decoration: underline; }
        .legal-doc strong { color: var(--text-1); }
      `}</style>
    </div>
  );
}
