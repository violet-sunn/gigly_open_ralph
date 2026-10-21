---
version: 1
slug: "brand-visuals-work-cyberluxe-html"
primary_target: "brand-visuals/work/cyberluxe.html"
related_targets: []
---

# Landing (brand-visuals/work/cyberluxe.html) — surface brief

> **Superseded (2026-10-21).** This brief predates `DESIGN.md`. Where they disagree, `DESIGN.md` wins:
> chamfer instead of the 14px radius; scene hue derived from the season (no fixed `#0d0b24` ground);
> the primary action is the L0 spectrum element, not a fixed orange; the six status colours are kept
> as L2 signal tokens (`--status-*`). The hand-and-prism hero composition remains a valid MVP direction.

Scope: the public landing page, Persuade mode. Audience: CTO/tech lead/founder at a Russian IT company who has one bounded piece of work to hand off, and a Middle+/Senior engineer with a day job who wants a well-paid bounded gig. Job: understand what a гиг is and start one (companies) or go to the gig list (specialists). Proof on hand: the product's own interface fragments and its real mechanics (acceptance criteria, RUB budget, 17,5 % fee on top, the specialist receives the full budget, five lifecycle statuses plus the derived «На рассмотрении»). Constraints: Russian only, no customers/testimonials/numbers may be invented, no payment-gateway claims, desktop-first but phone must work, `gigly_full_design/` stays binding for the app itself (this landing is the first surface of a new brand world, type and colour depart from the app's Handjet/Manrope on purpose).

## Direction contract

THESIS: One object, large: a raised hand pinches a cube of dichroic glass; white light enters it and leaves as the six colours of a gig's statuses. The page refuses the category default (centred headline over a screenshot, three feature cards) and the "quiet luxury" opposite; it is loud luxury (cyber-luxe), rich in material and light, dark ground.

OWN-WORLD: ground #0d0b24, ink #f6f3ff, lavender #c9b3ff as the soft ink, one action colour #ff6a3d; status fields cyan #22d3ee, blue #3d7bff, violet #7b5cff, magenta #ff5fd2, lime #cfff04. Unbounded 800 uppercase for the headline, Golos for text. One radius 14px, one button shape. Materials: dark glossy iridescent hand, rounded glass cube with dispersion, additive light beams, glass panels only where they hold the product. Taste-skill house rules on glow/violet/gradient are consciously overridden by this brief.

STORY: the visitor sees the gig as a crystal that turns light into statuses, understands in one screen that this is a bounded task with acceptance criteria done by seniors, scrolls through the six statuses, sees both sides' real forms, and creates an account.

FIRST VIEWPORT: wordmark top-left, «Войти» top-right, nothing else in the bar (on a phone «Войти» joins the action row under the lead: the taste-skill inspector reads a small link right above the headline as an eyebrow). Headline «Сделано сеньорами.» at 10vw in two lines from the left margin, lines at 34–65 % of the height; the hand (object, 60 % of the viewport, breaking the bottom edge) stands over the ends of both lines, hiding two or three letters (the taste-skill inspector's `covered-text` rule is consciously allowed for this page: the direction's own §2 prescribes the overlap, and the words stay recoverable). The cube sits at 66 % width, 32 % height; the white beam enters from the left edge above the headline, one pale lavender fan exits right. Under the headline: one supporting sentence at 22px and the primary action «Создать аккаунт» (orange, 14px radius) with the text link «Как идёт гиг». The scene holds three screens as a fixed stage: the headline stays, the forearm turns, the copy beneath swaps to «Один гиг. Шесть состояний.», and the fan splits into six status colours that reach six labels at the right.

FORM: the taste-skill direction «The object, large» (hero-object), dealt seed 212103881 with palette and type kept; hero blueprint replaced by the direction's own §2 composition (headline hidden behind the object) because the brief pins the hand-and-cube hero; signature motion replaced by the scroll-driven turn of the forearm (brief-pinned) instead of the dealt crossfade; the proof section dropped (no honest names); «Tiles that grow» carries the status word on each tile's colour field (the status pill inside the cards read as an icon-card row on the phone). The one moving picture is the page's own render as a muted loop in the footer. The action tile keeps the blueprint's flat colour flank (dealt, not filler); the panels' second actions go to the product's guides. Status colours, decided: cyan Открыт, violet На рассмотрении, blue В работе, magenta На проверке, lime Завершён, orange Оплачен (the action colour and the paid state share the orange on purpose: the action leads to the paid outcome). seed: none (direction pinned by the user's brief: raised hand, dichroic cube, cyber-luxe; the concept-seed roll was not run, per new-work.md's rule that a brief-pinned direction beats the roll)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

Unresolved: whether this world later replaces the app's Handjet/glows (product screens stay as designed until decided); exact status colour assignment against `gigly_full_design` tokens.
