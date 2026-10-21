# Gigly — design directions, researched

20 October 2026. Research only: nothing in the code or the design folder was changed. Sources: the taste-skill study of 247 gallery sites (`references/research.md`), its direction library (twenty directions, each distilled from studied sites), six dealt direction sheets in `.taste-skill/research/*/sheet.md`, two dealt app-screen sheets, and searches of the open image collections.

## 1. Why the three earlier attempts were bad

All three skipped research and went straight to execution. In the study's own terms:

| Attempt | Engine it used | Why it failed |
|---|---|---|
| Pixel brand board | *One motif* + *colour chapters* | Both engines are already the landing page. It restated the incumbent identity; nothing was decided. |
| «Акт» with stamps | *The page is the object* (artefact) | Right engine, wrong artefact. The акт and the печать are the accountant's world, which engineers associate with bureaucracy, and Times New Roman made it a parody. |
| «Статусы» colour tiles | *Colour chapters* without an idea | Six colours and six words is the category default of loud posters; the study scores that as "no idea beyond the formula". |

The lesson from the study is blunt: high scores go with a concept taken from the subject, low scores with its absence. The centred headline over a screenshot (the old landing) is the weak sites' signature layout, and so is "clean and modern" as the idea.

## 2. What only Gigly has (the inventory)

1. **The unit:** гиг, a bounded task with acceptance criteria, a rouble budget and a deadline. Everything else is built on it.
2. **Two doors:** companies post, seniors take. Two audiences, one product, one lifecycle.
3. **The path:** Открыт → На рассмотрении → В работе → На проверке → Завершён → Оплачен. Six statuses, one gig.
4. **Acceptance criteria as a required field**, and acceptance *by* them. The product's whole promise is "what counts as done is written down first".
5. **The structured application:** approach, questions, estimate. No cover letters.
6. **The money rule:** 17,5% on top, shown before publishing; the senior receives the full budget.
7. **The audience's own artefacts:** ТЗ, pull request, Jira ticket, спецификация, ЕСКД drawing sheet with its title block (Разраб. / Пров. / Утв.), standups, "сдать в пятницу".
8. **The senior's situation:** a day job, a salary ceiling, evenings and weekends. A second shift.
9. **Russia, roubles, hosted in Russia.** Self-hosted fonts because Google is unreliable there.
10. **A real, working product** with a dark UI and a light theme, whose fragments can be shown truthfully.

## 3. The neighbours' visual worlds (from memory, verify before quoting)

Kwork is a green-and-yellow consumer bazaar of cards; FL.ru is an old blue portal; Habr Freelance is a grey newsy list; YouDo and Profi.ru are orange and red consumer services; Upwork is green lifestyle photography; Toptal is navy corporate stock. Two gaps are open: nobody in Russian freelance is **quiet**, and nobody speaks the **engineer's** visual language. The current Gigly look (dark screen, blue, pixel type) sits in the dev-tool-SaaS cluster, which is crowded but at least not the bazaar.

## 4. Five directions, tested

Each has the study's engine, the idea sentence with the competitor test, the dealt first screen, type and colour (with Cyrillic substitutes where the dealt face has none), the honest imagery available, the reference sites, and the risk. Sheets with every section blueprint: `.taste-skill/research/<id>/sheet.md`.

### 4.1 «Тихий сеньор» — the quiet instrument  ★ recommended

**Engine:** radical understatement. A headline barely larger than body text, one narrow column, tiny true demonstrations, a great deal of decided space. The restraint is the claim.

**Idea sentence:** On this page, *the senior's calm* becomes *the design*: a page that whispers while every Russian freelance marketplace shouts, and proves each claim with a small working piece of the product. Competitor test: Kwork, FL.ru and YouDo cannot whisper; Toptal is quiet only in the corporate way. The sentence holds.

**First screen (dealt hero "Two doors on a dark wall", seed 1832638635):** one flat field; two portrait pictures side by side at the centre, each a door to one half of the audience: «Компании» and «Специалисты». For Gigly the two pictures are the two real screens, the client's create-gig form with its criteria and the specialist's gig board, each at 3:4. A two-line headline above them at a modest 36–52px, the wordmark top-left, one link top-right. This is the one direction where the small headline is right.

**Type:** dealt Young Serif / Source Serif 4. Young Serif has no Cyrillic; use **Literata** or **Playfair Display** for display with **Source Serif 4** for text (both Cyrillic, OFL). A serif is itself a departure: every neighbour is a sans. **Colour:** dealt "Sheet and biro": paper white, ink, and ballpoint blue as the single accent, which keeps a thread to Gigly's blue without the dark screen.

**Imagery:** the product's fragments at true size (criteria editor, application form, applicant list, the card at four statuses, the fee panel; all already extractable from the app). Two real screens as the doors. One or two archival pictures of the senior's craft: the 1960s drafting table (CC BY 4.0) or the IBM System/370 (CC0), used large and once.

**References:** Rows (rows.gg, studied 7.5: a 27px headline, 12px copy, a column of tiny live demos); Illoca (8.2); Plastic (7.1).

**Risk:** thin if under-built. The study's blind tests: the quiet version lost every time it was quiet everywhere; it must still carry every piece of content, in full ink, at 16px or more, with the fragments doing the convincing. Needs flawless typesetting.

### 4.2 «Гиг у вас на глазах» — the product performs  ★ recommended as the partner of 4.1

**Engine:** software is most convincing doing its job in front of you. Small, true, working fragments of the product, not descriptions.

**Idea sentence:** On this page, *the gig itself* becomes *the page*: the visitor assembles a sample gig as they scroll (criteria, budget, application, acceptance) and watches it reach «Оплачен». Competitor test: Kwork can show a card; it cannot show acceptance by criteria, because it has none.

**First screen (dealt hero "Controls on the sentence", seed 1939399089):** a two-line sentence at 9vw is the demonstration; three live chips from the product sit on it and change it. For Gigly the sentence is a gig («Чат-бот поддержки за 150 000 ₽ к 4 ноября») and the chips are the real controls: budget (the figure in the sentence moves, the fee with it), deadline, number of criteria. The live thing is the headline.

**Type:** dealt Hanken Grotesk, no Cyrillic; use **Golos Text** (the face the newer Figma file already used) or **Onest**, both Cyrillic-native, OFL. **Colour:** dealt "Stone and blueprint": warm stone ground, blueprint blue as the one accent.

**Imagery:** the fragments are the imagery; two or three real pictures of the customer's world around them (an office at night in Moscow, CC0, is honest for the senior's evening).

**References:** Rows (7.5); Vessa (7.8: the real product embedded under the hero copy, not a screenshot); Shelf (7.1: the key interaction enlarged over the product window).

**Risk:** engineering, and fakery. The sheet's warning: a fake interface of grey bars is the worst outcome; every fragment must work. Gigly can afford this because the real components exist.

**Why 4.1 and 4.2 together:** Rows, the strongest reference for both, is both at once: quiet page, working fragments. For Gigly, 4.1 sets the voice and the frame, 4.2 supplies the proof.

### 4.3 «Чертёж» — dressed as an engineering drawing

**Engine:** art-direct the subject as a different, more vivid category, chosen by the feeling the audience is missing. CTOs and seniors are missing engineer-to-engineer precision in a market of sales talk.

**Idea sentence:** On this page, *the ЕСКД drawing sheet and its title block* (Разраб. / Пров. / Утв.) become *the structure*: each screen is a sheet of the gig's drawing, and the page closes on the title block that Gigly's lifecycle fills in: the specialist develops, the client checks, acceptance approves. Competitor test: no freelance marketplace draws itself as an engineering drawing; the language belongs to engineers, which is exactly the audience.

**First screen (dealt hero "Shouted headline, rising photograph", seed 608915290):** a two-line condensed uppercase headline across the top, and directly under it one tall picture rising and cropped by the bottom edge. For Gigly the picture is a real archival technical drawing (a 1935 hospital block drawing, CC0, found in the collections) or the gig itself drawn as a sheet.

**Type:** dealt Archivo at its narrowest; no Cyrillic. **Oswald** or **Roboto Condensed** (Cyrillic, OFL) carry the same condensed engineering-lettering feel; Bahnschrift does too but ships only with Windows. **Colour:** the dealt "Bottle green, gold" fights the subject; take the subject's own: drawing paper, graphite black, one revision red or the blueprint blue.

**Imagery:** archival technical drawings (found), the product's fragments placed as "views" on the sheet, the title block built as a real table (tables keep their rules; this is the one place lines are honest).

**References:** Illoca (8.2: software for architects sold as a drafting table in two inks); Juggle (8.0); Vero New York (8.1).

**Risk:** this is the engine behind the rejected «Акт», so it must be the engineer's sheet and never the accountant's: no stamps, no Times New Roman, no bureaucracy. Nostalgia for Soviet drafting is a real reading; keep it contemporary (ISO-style sheet, not a museum).

### 4.4 «Вторая смена» — the dark room

**Engine:** one dark field and lit things, a slow walk through a dim room.

**Idea sentence:** On this page, *the senior's second shift* (the evening after the day job) becomes *the room*: a dark page where the only lit things are gigs and the city outside the window. Competitor test: specific to Gigly's specialist persona; nobody else sells the senior's evening.

**First screen (dealt hero, seed 420594664):** a tall photograph inset on the left, sticky for the whole visit; the name in lowercase running along the bottom edge. The picture: "Illuminated offices in Moscow" (CC0) or "GES-2 at night" (CC BY 4.0), both found.

**Type:** dealt Zodiak hairline serif / Hanken Grotesk, no Cyrillic; **Playfair Display** light with **Golos Text**. **Colour:** dealt "Plum-black and pink": the pink is not the subject's; keep the dark ground, take the lit colour from the photograph.

**References:** weak for this subject: Deeo Studio (7.0), IZANAMI (7.0), Juggle (8.0 only for the field idea).

**Risk:** it is dark again, which you may read as "the same"; the references are the weakest of the five; and clients may hear "moonlighting". A strong idea for a specialist-facing campaign, a doubtful one for the whole brand.

### 4.5 «Прямая речь» — type and nothing else

**Engine:** the first screen is words, colour and space; pictures arrive later, large and few.

**Idea sentence:** On this page, *the senior's way of speaking* (short, exact, no sales) becomes *the only material*. Competitor test: weak. "Blunt copy, big type" is a voice, and a voice belongs to whoever writes best; the engine is the category's.

**First screen (dealt hero, seed 2018479022):** a two-line statement stepping from the left margin to the right margin across the full width; a sentence bottom-left, one square action bottom-right.

**Type:** dealt Big Shoulders / Public Sans, no Cyrillic; **Oswald** / **Inter**. **Colour:** dealt "Tobacco and olive" is not the subject's; paper and ink with the blue.

**References:** NOTHIN' (7.4), bleibtgleich'26 (7.5), Vessa (7.8).

**Risk:** without pictures, weak copy has nowhere to hide, and four screens of big heading plus paragraph is a document, not a design. This is the brag video's register; as a whole site it is the least ownable of the five.

## 5. Engines not to use again

*Colour chapters* and *one motif* (the current landing and the pixel board), *the page is the object* with a bureaucratic artefact (the акт), and any variant of the centred headline over a screenshot.

## 6. The product itself (app screens)

The app follows its own study (23 real product screens). Two dealt styles fit:

- **Achromatic ledger** (dealt for the finance screens; Geist, no Cyrillic, so **Golos Text** or **Inter**): no brand colour in the chrome, money and counts in ink, one chart hue on the main data element, a small signal only where a figure changed. This is the product counterpart of 4.1 and 4.2: a light, ink-first product where blue appears on one thing per screen. The app already has a light theme to grow this from.
- **Editorial greeting** (dealt for the workspace home; Instrument Sans + Serif): the dashboard opens with a typeset greeting as its h1 in a centred column, numbers at regular weight on tonal panels, accent under 2%. Pairs with the serif of 4.1.
- The current dark product is closest to the library's **true-black flat**; keep it only if the brand goes the dark-room way (4.4).

Sheets: `.taste-skill/research/app-workspace/sheet.md`, `.taste-skill/research/app-finance/sheet.md`.

## 7. Honest pictures found so far (licensed for commercial use)

| Picture | Licence | For |
|---|---|---|
| Proposed new hospital block at Port Pirie, technical drawing (c. 1935), State Government Photographer | CC0 | 4.3 hero |
| Illuminated offices in Moscow, Mike Kononov | CC0 | 4.4 hero, 4.2 atmosphere |
| GES-2 at night, Moscow, Юрий Д.К. | CC BY 4.0 | 4.4 |
| 1960s drafting table (Domkraft AB), R. Henrik Nilsson | CC BY 4.0 | 4.1 / 4.3 |
| IBM System/370 model 145 | CC0 | 4.1 |

Openverse timed out on every query, so Flickr and the museum aggregators were not searched; Wikimedia Commons was. Nothing from the design folder's welcome renders should be used: they are glowing blue-and-orange generated images.

## 8. Recommendation

1. **Build 4.1 with 4.2 inside it**: the quiet, serif-led page whose proof is the working product. It is the only pairing that is both ownable (the senior's calm) and true (real fragments), and its best reference scores highest among the five. It also gives the product a direction (achromatic ledger) rather than leaving the app and the site in two worlds.
2. **Keep 4.3 as the bold alternative** if you want a visual world people remember at a glance. It is the riskier one because of the акт history, but the engineer's sheet is a different artefact from the accountant's stamp.
3. Drop 4.4 and 4.5 for the brand; 4.4 could return as a specialist-recruiting campaign.

## 9. Next step

Pick one (or both to compare). I then run the full taste-skill build on a copy of the landing, not the live code: hero exactly as the dealt blueprint, every section from its sheet with the real content, the live thing, the imagery above, the inspector at three widths, three look-and-fix rounds, and the written critique with scores, before anything touches `app/`.
