// «Примеры гигов» rebuilt on the prototype's list idiom (header + intro + cards), matching the sibling
// re-grounded screens (DisputesDesign / MyGigsDesign). Reached from the gig-creation screen while writing a
// brief, so the copy is about what makes the example worth copying — not about the gig being for sale.
//
// Server component on purpose: the rows are plain links, so nothing here needs the client bundle. The
// BackButton (a client kit component) is mounted by the page inside its own Suspense boundary.

import Link from "next/link";
import "@/app/_design/tokens.css";

export interface ExampleGigVM {
  id: string;
  title: string;
  description: string;
  budget: string;
  tags: string[];
  created: string;
}

const card: React.CSSProperties = {
  borderRadius: 12,
  background: "var(--surface-card)",
  boxShadow: "inset 0 0 0 1px var(--hairline-08)",
  padding: "18px 20px",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  textDecoration: "none",
};

export function ExamplesDesign({ gigs }: { gigs: ExampleGigVM[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 880 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h2 style={{ margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 24, color: "var(--text-1)", whiteSpace: "nowrap" }}>
          Примеры гигов
        </h2>
        {gigs.length > 0 && (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 24, padding: "0 7px", borderRadius: 6, background: "var(--om-accent, #0088ff)", color: "#fff", fontFamily: "'Handjet',monospace", fontWeight: 700, fontSize: 15 }}>
            {gigs.length}
          </span>
        )}
      </div>
      <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, lineHeight: "18px", color: "var(--text-4)", maxWidth: 560 }}>
        Так выглядит хорошо составленный бриф: понятная задача, измеримые критерии приёмки и честные условия.
        Посмотрите, как сформулированы эти гиги, и опишите свой так же — чем точнее бриф, тем сильнее отклики.
      </span>

      {gigs.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {gigs.map((gig) => (
            <Link key={gig.id} href={`/gigs/${gig.id}?from=examples`} style={card}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 15, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {gig.title}
                  </span>
                  <span style={{ flex: "none", fontFamily: "'Handjet',monospace", fontSize: 11, color: "var(--om-accent, #0088ff)", background: "rgba(0,136,255,0.12)", borderRadius: 5, padding: "3px 8px" }}>
                    ✨ пример
                  </span>
                </div>
                <span style={{ flex: "none", fontFamily: "'Manrope',sans-serif", fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>
                  {gig.budget}
                </span>
              </div>
              <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 13, lineHeight: "18px", color: "var(--text-3)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {gig.description}
              </span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {gig.tags.map((tag) => (
                    <span key={tag} style={{ fontFamily: "'Manrope',sans-serif", fontSize: 12, color: "#4ea3ff", background: "rgba(0,136,255,0.1)", borderRadius: 6, padding: "4px 10px" }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <span style={{ flex: "none", fontFamily: "'Handjet',monospace", fontSize: 12, color: "var(--text-4)" }}>{gig.created}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 340 }}>
          <div style={{ width: 440, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--hairline-05)", boxShadow: "inset 0 0 0 1px var(--hairline-10)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
              ✨
            </div>
            <h2 style={{ margin: 0, fontFamily: "'Handjet',monospace", fontWeight: 600, fontSize: 24, color: "var(--text-1)" }}>Примеров пока нет</h2>
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: 14, lineHeight: "20px", color: "var(--text-3)" }}>
              Образцовые гиги ещё не добавлены. Пока ориентируйтесь на панель «Готовность брифа» — она подскажет, чего не хватает вашему описанию.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
