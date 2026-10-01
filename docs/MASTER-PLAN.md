# sogda.de: the master plan

**Tracking:** decisions [#56](https://github.com/MdRahmatUllah/sogda-website/issues/56) · this plan [#57](https://github.com/MdRahmatUllah/sogda-website/issues/57) · milestones *W1 · Foundations*, *W2 · Screens*, *W3 · Content pages*, *W4 · Play launch* · each task's issue is in its row · the full discussion is archived in [`docs/research/2026-09-30-website-review.md`](research/2026-09-30-website-review.md).

*Written by agent-0 from the team's research and discussion in [#55](https://github.com/MdRahmatUllah/sogda-website/issues/55), 2026-09-30:*
- *agents 0–4;*
- *33 competitor sites and apps, and 5 audits of sogda.de;*
- *a discussion in which every point below was agreed by all five, or is marked as the owner's decision.*

*The evidence for every claim is in [#55](https://github.com/MdRahmatUllah/sogda-website/issues/55). BRIEF.md stays the source for facts and the owner's decisions; where this plan changes BRIEF, it says so.*

## Status (2026-10-01)
The team worked the plan as a pull board ([#94](https://github.com/MdRahmatUllah/sogda-website/issues/94)): each agent picked the oldest ready issue, built it, merged it into `dev`, and picked again.

| Milestone | State |
|---|---|
| **W1 · Foundations** | Done, except two items. [#103](https://github.com/MdRahmatUllah/sogda-website/issues/103) (the home page's review gaps from the app's FSRS facts) is in review. [#56](https://github.com/MdRahmatUllah/sogda-website/issues/56) waits on the owner: O1, verifying the site in Search Console, Bing and Yandex by DNS (the checklist is on #56). |
| **W2 · Screens** | Done (4 of 4): the app's own store screenshots per locale, Bangla's included, and share cards from them. |
| **W3 · Content pages** | Done (13 of 13): Sogda in brief, the 12 level pages, mock exams, spaced repetition, the Bangla and the pl/ru audience pages, and two fair comparisons, in every page's locales. |
| **W4 · Play launch** | Waits on the Play listing, which waits on the owner's 1.1.0 upload ([DeutschPlan#1123](https://github.com/MdRahmatUllah/DeutschPlan/issues/1123)). [#45](https://github.com/MdRahmatUllah/sogda-website/issues/45) is the link, [#77](https://github.com/MdRahmatUllah/sogda-website/issues/77) the ratings, and [#76](https://github.com/MdRahmatUllah/sogda-website/issues/76) the outreach, whose pitches are drafted in all five languages, ready to send. |

`dev` → `main` is the owner's release: [#128](https://github.com/MdRahmatUllah/sogda-website/pull/128). Measuring runs monthly on [#65](https://github.com/MdRahmatUllah/sogda-website/issues/65), the routine the owner agreed.

## 1. The goal
- **People should want Sogda at first sight**, on the page and in a search result.
- **sogda.de should be the first answer** in Google, Bing and Yandex, and in ChatGPT, Gemini, Claude and Perplexity, for the questions Sogda answers best:
  - learning German **offline**, from **A1 to C2**, with **mock exams**;
  - learning German **from Bangla, Russian or Polish**.
- **We don't aim to outrank Duolingo on "learn German".** We aim to be the obvious, cited answer in the space nobody owns, then widen it.

## 2. Where we stand

| | sogda.de today | The best of 33 competitors |
|---|---|---|
| **Engineering** | **Best in the review:** 221 KB and 3 KB of JS; Lighthouse 98–100, axe 0 violations in 105 runs, full hreflang, static HTML every crawler reads, strict security headers | Duolingo, Babbel and Busuu weigh 2.0–2.8 MB with 1.1–1.9 MB of JS. Several big-brand German pages are thin or broken: an SPA shell, an error H1, a canonical pointing at `/`, three H1s |
| **Findability** | **In no index.** "Sogda" returns our GitHub issues (and an AI summary quoted our backlog), plus Sogdia, a beetle genus and a seafood supplier | Babbel ranks with 3,000-word question pages; Lingoda has ~3,900 URLs; BO 11,928; SagaDeutsch a level page per exam |
| **Content** | One page per locale (≈ 750–870 words), 5 FAQs, 15 URLs | Pages per level, exam, audience and question; comparison pages; fact sheets |
| **Action** | Every call to action is "Coming soon" | Store badges, trials, a live demo in the hero |
| **AI answers** | Every AI crawler is allowed (good); thin `MobileApplication` JSON-LD; no fact page | Babbel, DW and Rosetta Stone **block** the AI crawlers. Memrise, Viobean and WortGo publish fact sheets, FAQs and a full schema graph |
| **Our edge** | **A combination no rival has:** offline, no account, A1.1–C2.2 in 12 steps, 5,069 words, 182 grammar topics, 36 mock exams (3 per step, with speaking and writing), FSRS, a pronunciation guide in the learner's own script, two meaning languages at once, an offline neural voice. It sits buried in sections 2–7 | Each rival has two or three of these |
| **Audiences** | bn/pl/ru pages exist; the screenshots are the English app; the hero greets "Maruf" | Bangla has 500-word apps, books and schools. Polish tops out at A1–B1. Russian goes through roundups and Yandex answers. **Exam queries in bn, pl and ru are nearly empty** |

## 3. The strategy in six moves
1. **Get indexed and own the name.** Nothing else counts until search engines have the site, and "Sogda" means a German course app to them.
2. **Say one thing, the same way, everywhere.** One positioning sentence and one fact source, used by the page, the FAQ, the JSON-LD, `llms.txt`, the Play listing and every new page. That makes AI answers repeat us accurately, and it keeps five languages from drifting.
3. **Show the product in the first screen.** Facts, the real app in the visitor's language, and a card you can try, not a slogan and two "coming soon" chips.
4. **Answer the questions, few pages and deep ones.** Audience, exam, level, method and comparison pages, built from the course's own data, each opening with the answer. Start with Bangla, where nobody competes.
5. **Make the visit actionable.** A notify link now; the Play badge, QR code and referrer at launch.
6. **Be cited where AI reads.** The roundup articles, Reddit, YouTube, Wikidata, and the Play listing itself, all saying the same sentence, after launch.

**What we keep as it is:** the speed (JS budget 130 KB, and we use 2.8), static HTML, no analytics or cookies, allowing every crawler, the facts-only rule, and the honest "not official Goethe or telc papers" line.

## 4. The positioning sentence (draft; agent-1 localises, the owner approves)
> **Sogda is an offline German course app for Android: A1 to C2 in 12 steps, with 5,069 words, 182 grammar topics and 36 mock exams, and meanings and a pronunciation guide in English, Bangla, Russian or Polish, no account needed.**

- **Where it goes:**
  - the hero subline;
  - the JSON-LD `description`;
  - the first FAQ answer;
  - "Sogda in brief";
  - `llms.txt`;
  - the Play listing's full description.
- **Every number comes from `facts.json`** (5.2).
- **The name pattern everywhere:**
  - `name` "Sogda", with `alternateName` "Sogda: German A1–C2";
  - titles are "Sogda: …" plus the phrase people search in that language;
  - never the bare word "Sogda" alone as a heading or link text.

## 5. The work

Sizes: **S** is under an hour, **M** about half a day, **L** days. The website PRs go into `dev` and merge on a green gate (the owner's rule: no review needed). agent-3's live sweep and agent-1's native review are welcome but **non-blocking**, except that copy in pl, ru and bn waits for its native review.

### Wave 1: this week, with no owner decision needed

| # | What | Who | Size |
|---|---|---|---|
| **W1-a** [#58](https://github.com/MdRahmatUllah/sogda-website/issues/58) | **Technical fixes in one PR:** `favicon.ico`; sitemap `lastmod` + `x-default`; drop `Host:` from robots.txt; a branded 404 with a title and links to all five locales; the legal pages (their own descriptions, canonical to `/de/…`, out of the sitemap); footer links ≥ 24 px; the Russian 320 px overflow (`min-w-0`); the Play trademark line shown only with the badge | agent-4 | S |
| **W1-b** [#59](https://github.com/MdRahmatUllah/sogda-website/issues/59) | **Copy:** agent-1's two German errors, the calques in ru/pl/de, the bn items (after a native check); the **keyword eyebrow** above the H1, e.g. "Offline German course app · A1–C2 · 36 mock exams"; localised titles carrying *app / offline / A1–C2 / mock exams* (never Goethe or telc); the German description ≤ 155 chars. **agent-1 opens it, agent-4 merges** | agent-1 → agent-4 | S |
| **W1-c** [#60](https://github.com/MdRahmatUllah/sogda-website/issues/60) | **One JSON-LD `@graph`**, with stable `@id`s (`/#org`, `/#website`, `/#app`, `/<locale>#faq`): Organization → WebSite → MobileApplication (`alternateName`, `featureList`, `availableLanguage`, `softwareVersion`, `screenshot`, `inLanguage`) + FAQPage from the visible FAQ. `publisher` once O5 is answered; `installUrl` at launch; **no offers or ratings until real** | agent-4 | S |
| **W1-d** [#61](https://github.com/MdRahmatUllah/sogda-website/issues/61) · [app #1174](https://github.com/MdRahmatUllah/DeutschPlan/issues/1174) | **One fact source:** `pnpm sync:facts` writes `content/facts.json` at a **pinned app ref**, committed like the screenshots. It holds `store-listing.md` + BRIEF §4 plus the counts that agent-2's app-repo tool exports from `content.db`: totals, and per step the words, grammar-topic names, mock-exam sections and a seeded sample of words with every meaning and guide. The messages take numbers as ICU arguments. **A drift test** fails when rendered text disagrees with it, or when BRIEF and the listing disagree. `llms.txt` is generated from it (no `llms-full.txt` until there's a hub) | agent-2 (export) → agent-4 (sync, ICU, `llms.txt`) + agent-3 (drift test) | M |
| **W1-e** [#62](https://github.com/MdRahmatUllah/sogda-website/issues/62) | **The first screen:** a **fact row** under the headline (5,069 words · 182 grammar topics · 12 steps · 36 mock exams · offline · no account), the product visible on phones before the first scroll, and the *der Termin* card moved up and localised. Plain JS only if it earns its bytes; the hero image stays the LCP, measured before merging | agent-4 | S–M |
| **W1-f** [#63](https://github.com/MdRahmatUllah/sogda-website/issues/63) | **The root `/`:** an indexable **language chooser** (x-default; absolute hreflang, a real title and description, five real `<a hreflang lang>` links, the positioning sentence). Plus a `vercel.json` redirect for browsers: `"permanent": false` (307), each regex anchored to the **first** `Accept-Language` tag, landing on `/<lang>?from=root`, where `site.js` honours a remembered pick. Crawlers get the chooser | agent-4 | S–M |
| **W1-g** [#64](https://github.com/MdRahmatUllah/sogda-website/issues/64) | **`/bn` performance:** A/B a Noto Sans Bengali preload live, median of 3 each; ship only if LCP improves. The LCP is the hero image, not the font (agent-4's trace) | agent-4 | S |
| **W1-h** [app #1177](https://github.com/MdRahmatUllah/DeutschPlan/issues/1177) | **Our GitHub, today's only indexed source:** both repos get a description, topics and homepage `https://www.sogda.de`, and the app README's languages line is corrected. **Whether the backlog stays public is the owner's call (O11)** | agent-0 | S |

### Wave 2: the screens (after v1.1.0's store sets are on the app's `main`)

| # | What | Who | Size |
|---|---|---|---|
| **W2-a** [app #1175](https://github.com/MdRahmatUllah/DeutschPlan/issues/1175) | **The Bangla store set:** six bn phone screens shot like the pl/ru sets (release APK, wiped emulator, 1080 × 2160, demo bar, the app and its meanings in Bangla), for Play's bn-BD listing and `/bn` | agent-1 (app side) | M |
| **W2-b** [#66](https://github.com/MdRahmatUllah/sogda-website/issues/66) | **The site's screenshots from the store sets, per locale:** a store capture where one exists, the golden otherwise. This removes "Maruf", the English-only screens and the 540/538 drift at once, and keeps them out at every release. **Hashed file names**, then `immutable` caching for `/screens`, `/og` and `/brand` | agent-4 | M |
| **W2-c** [#67](https://github.com/MdRahmatUllah/sogda-website/issues/67) | **OG cards per locale** from the same screens, plus a fact strip ("A1 → C2 · offline · 36 mock exams", localised) | agent-4 | S |

### Wave 3: the pages (after O2 and O3)
Every page:
- **opens with its answer:** two self-contained sentences with our numbers from `facts.json`;
- **closes with a short FAQ**, marked up in the graph;
- uses real content from the course. **No page per word** (Google's scaled-content-abuse policy); each page must stand on its value;
- **five locales where the audience exists**, with a native review per locale (agent-1) and a fact check against the app (agent-0).

| # | Page | Why | Size |
|---|---|---|---|
| **W3-0** [#68](https://github.com/MdRahmatUllah/sogda-website/issues/68) | The page template (metadata, OG, hreflang, graph and sitemap patterns already exist) | Done once, it makes every page copy-bound | M once |
| **W3-1** [#69](https://github.com/MdRahmatUllah/sogda-website/issues/69) | **"Learn German in Bangla" (bn first, then en):** Bangla meanings, the guide in Bangla letters, 5,069 words to C2, the exam path, the Germany angle (Anmeldung, Ausbildung) | The least-served audience; exam queries in bn are empty | M |
| **W3-2** [#70](https://github.com/MdRahmatUllah/sogda-website/issues/70) | **"Sogda in brief" (About):** the positioning sentence, the facts, the method, who makes it (O5), what's not official, and "not Sogdia or Sogda Limited" | The fact page AI engines can actually cite | S–M |
| **W3-3** [#71](https://github.com/MdRahmatUllah/sogda-website/issues/71) | **Mock exams:** what Goethe and telc exams ask per level, and how Sogda's 3 papers per step compare: they share listening, writing and speaking, add vocabulary, grammar, articles and word forms, and have no reading part (#81). Always with the independence line | Exam queries in bn, pl and ru are nearly empty (agent-2's list) | M |
| **W3-4** [#72](https://github.com/MdRahmatUllah/sogda-website/issues/72) | **12 level pages, A1.1 … C2.2:** what the level means, the word count, the grammar topics by name, the mock-exam sections, and a sample of 20–30 words (O3) with article, plural, the guide in the reader's letters and the meaning in the page's language | "Goethe A1 Wortliste mit Bangla/Russian/Polish meaning" style searches, owned today by PDFs and Scribd | L (copy) |
| **W3-5** [#73](https://github.com/MdRahmatUllah/sogda-website/issues/73) | **How Sogda remembers:** spaced repetition and FSRS explained properly | Anki and AlgoApp prove the demand; rivals only name it | S–M |
| **W3-6** [#74](https://github.com/MdRahmatUllah/sogda-website/issues/74) | **2–3 fair comparisons** in "Choose X if…" form, features only: Sogda or an Anki deck; Sogda or Duolingo; Sogda or a Goethe prep app | Roundups and AI answers repeat exactly this kind of page | M |
| **W3-7** [#75](https://github.com/MdRahmatUllah/sogda-website/issues/75) | pl and ru versions of W3-1 ("niemiecki od podstaw", «немецкий с нуля»), with the exam angle | The same gap as bn, one step behind | M each |

### Wave 4: at the Play launch ([#45](https://github.com/MdRahmatUllah/sogda-website/issues/45), after [app #1123](https://github.com/MdRahmatUllah/DeutschPlan/issues/1123))

| # | What | Who |
|---|---|---|
| **W4-a** [#45](https://github.com/MdRahmatUllah/sogda-website/issues/45) | **The Play badge:** above the fold and in a sticky bar on phones, deep-linked with `&referrer=utm_source%3Dsogda.de%26utm_medium%3D<section>`. Plus the QR code on desktop and the graph's `installUrl` | agent-4 |
| **W4-b** [app #1176](https://github.com/MdRahmatUllah/DeutschPlan/issues/1176) | **The Play listing, ASO:** each locale's title "Sogda: <the phrase people search> A1–C2" within 30 characters («Sogda: Learn German A1–C2», «Sogda: জার্মান ভাষা শিক্ষা A1–C2», «Sogda: немецкий с нуля до C2», «Sogda: niemiecki od podstaw C2»), with the positioning sentence in the short and full description. **The owner approves** | agent-1 (`store-listing.md`) |
| **W4-c** [#76](https://github.com/MdRahmatUllah/sogda-website/issues/76) | **Outreach (O7):** the roundup authors found in [#55](https://github.com/MdRahmatUllah/sogda-website/issues/55) (en, pl, ru, bn), AlternativeTo, honest participation in r/German and r/learngerman, real-app demo videos. **Wikidata only once independent sources exist** | the owner, with drafts from agent-0 |
| **W4-d** [#77](https://github.com/MdRahmatUllah/sogda-website/issues/77) | **Ratings in the graph** (`aggregateRating`) only once there are real Play ratings | agent-4 |

## 6. Measuring, without analytics (BRIEF §10 #5 stands) · [#65](https://github.com/MdRahmatUllah/sogda-website/issues/65)

| Signal | Source | Target |
|---|---|---|
| Indexed URLs, impressions and queries per locale | Google Search Console, Bing Webmaster Tools, Yandex Webmaster (O1) | **Every URL indexed within 4 weeks** of verification |
| The brand | GSC query "Sogda German" / "Sogda app" | **sogda.de first** for "Sogda German", above our GitHub |
| The niche | GSC/BWT positions for agent-2's bn/pl/ru exam queries and "learn German in Bangla" | **Top 3 within a quarter** |
| AI answers | GSC's Generative AI report, BWT's AI Performance report, and **a fixed panel of 10 prompts** (the [#55](https://github.com/MdRahmatUllah/sogda-website/issues/55) queries plus "is Sogda a good app to learn German") run monthly in ChatGPT, Gemini, Claude and Perplexity. Answers and citations are pasted into an issue, and agent-3 scores each against `facts.json` | Cited, and correct, in **half the panel within 3 months** of launch |
| Installs from the site | Play Console acquisition by the `referrer` | Rising month on month after launch |
| Quality | Lighthouse ≥ 95, LCP ≤ 2.0 s, CLS ≤ 0.05, TBT ≤ 150 ms, JS ≤ 130 KB, axe 0; agent-3's live sweep before each `dev → main` | Never regress |

## 7. What the owner decides · [#56](https://github.com/MdRahmatUllah/sogda-website/issues/56) (answer there)

| # | Question | The team's recommendation |
|---|---|---|
| **O1** | Create **Google Search Console, Bing Webmaster Tools and Yandex Webmaster** for sogda.de (DNS TXT, or give agent-4 a meta-tag token), then the sitemap and IndexNow | **Yes, first.** It blocks every metric |
| **O2** | The content pages (Wave 3): yes, and how far? | **Yes, few and deep,** in the W3 order |
| **O3** | Word samples from the course on level pages | **20–30 words per step,** not full lists |
| **O4** | Before Play: what can a convinced visitor do? (BRIEF §10 #7) | **A `mailto:` "tell me when it's out" now.** Play pre-registration only if its conditions fit (a release track, launch within 90 days, the testing requirement for personal accounts created after 13 Nov 2023). The testing link isn't public |
| **O5** | Who makes it: a publisher name for the graph and a one-line maker on "Sogda in brief" (the Impressum keeps the legal details) | **Yes** |
| **O7** | Outreach after launch (W4-c) | **Yes, after Play** |
| **O9** | A domain mailbox (e.g. hello@sogda.de, MX records) in place of the personal Gmail on the page | **Yes** |
| **O10** | The name pattern "Sogda: German A1–C2" everywhere, and the localised Play titles (W4-b) | **Yes** |
| **O11** | Our GitHub backlog is public and currently what search shows for "Sogda": keep it public (and point the repos at sogda.de, W1-h), or make the website repo private? | **Keep public, point at sogda.de.** The indexed site will overtake it |
| **O12** *(optional)* | "Coming soon on iPhone" (BRIEF §4) is open-ended while iOS is on the app's *Later* list. Keep it, or say "Android now; iPhone later"? | The team leans to the second, as more honest; the owner decides |

**Already decided, and unchanged:** no price or "free" wording (BRIEF §10 #2); no analytics (§10 #5); the five site languages (§10 #3).

## 8. Who does what (assigned 2026-09-30; every agent builds the site, CLAUDE.md "Team mode")

| Agent | Issues |
|---|---|
| **agent-4** (the site's owner) | [#68](https://github.com/MdRahmatUllah/sogda-website/issues/68) the page template **first** (all of W3 waits on it); [#58](https://github.com/MdRahmatUllah/sogda-website/issues/58) small fixes; [#60](https://github.com/MdRahmatUllah/sogda-website/issues/60) the JSON-LD graph; [#63](https://github.com/MdRahmatUllah/sogda-website/issues/63) the root chooser; [#64](https://github.com/MdRahmatUllah/sogda-website/issues/64) the /bn A/B; [#66](https://github.com/MdRahmatUllah/sogda-website/issues/66) localised screens; [#67](https://github.com/MdRahmatUllah/sogda-website/issues/67) OG cards; [#45](https://github.com/MdRahmatUllah/sogda-website/issues/45) the Play badge (at launch); [#77](https://github.com/MdRahmatUllah/sogda-website/issues/77) real ratings (after launch) |
| **agent-1** | [#59](https://github.com/MdRahmatUllah/sogda-website/issues/59) copy, eyebrows and titles; [#69](https://github.com/MdRahmatUllah/sogda-website/issues/69) "Learn German in Bangla"; [#75](https://github.com/MdRahmatUllah/sogda-website/issues/75) the pl/ru pages; [app #1175](https://github.com/MdRahmatUllah/DeutschPlan/issues/1175) the bn store set; [app #1176](https://github.com/MdRahmatUllah/DeutschPlan/issues/1176) the Play listing's ASO; the native pl/ru (and bn) review of every PR with copy |
| **agent-2** | [app #1174](https://github.com/MdRahmatUllah/DeutschPlan/issues/1174) the facts export (schema first); [#61](https://github.com/MdRahmatUllah/sogda-website/issues/61) `sync:facts`, ICU numbers and `llms.txt` (with agent-3's drift test); [#72](https://github.com/MdRahmatUllah/sogda-website/issues/72) the 12 level pages; [#73](https://github.com/MdRahmatUllah/sogda-website/issues/73) the FSRS page |
| **agent-3** | [#65](https://github.com/MdRahmatUllah/sogda-website/issues/65) measuring (the baseline now, then monthly); the drift test in [#61](https://github.com/MdRahmatUllah/sogda-website/issues/61); [#71](https://github.com/MdRahmatUllah/sogda-website/issues/71) the mock-exams page; live sweeps of `dev` and S24 checks |
| **agent-0** | [#62](https://github.com/MdRahmatUllah/sogda-website/issues/62) the first screen (fact row, the product before the scroll, der Termin up, the mailto notify); [#70](https://github.com/MdRahmatUllah/sogda-website/issues/70) "Sogda in brief"; [#74](https://github.com/MdRahmatUllah/sogda-website/issues/74) the comparisons; [#76](https://github.com/MdRahmatUllah/sogda-website/issues/76) outreach drafts; [app #1177](https://github.com/MdRahmatUllah/DeutschPlan/issues/1177) the repos point at sogda.de; [#79](https://github.com/MdRahmatUllah/sogda-website/issues/79) team mode; the owner's decisions ([#56](https://github.com/MdRahmatUllah/sogda-website/issues/56)) and a fact check of every page |

**The owner decided (#56, 2026-09-30):**
- O2: all of W3;
- O3: 20–30 words per step;
- O4: a mailto notify;
- O5: the publisher is the brand "Sogda".

**Still the owner's:** O1 (Search Console, Bing and Yandex), O7 (outreach), O9 (the mailbox).

## 9. Order and dependencies
```
now      W1-a  W1-b  W1-c  W1-e  W1-f  W1-g  W1-h   (no owner decision)
         W1-d  ← agent-2's export
owner    O1 → indexing & measurement start     O2/O3 → Wave 3     O5 → publisher, W3-2
v1.1.0   store sets on the app's main → W2-a, W2-b, W2-c
Play     [#45](https://github.com/MdRahmatUllah/sogda-website/issues/45) → W4-a, W4-b, W4-c, W4-d
```
Wave 3 starts with **W3-1 (Bangla)** and **W3-2 (Sogda in brief)** as soon as O2 is answered. They need no screens and no Play link.

## 10. Guardrails
- **Facts only** from `facts.json` (store listing + BRIEF §4 + course counts). No invented numbers, ratings, reviews or testimonials, and no "official Goethe/telc" wording.
- **Never block an AI crawler.** Allow-all is our edge over Babbel, DW and Rosetta Stone.
- **Budgets hold** (§6). Every page is static HTML; no client framework.
- **Five languages, native quality.** A sentence added is five sentences, reviewed.
- **Honest timing:** a page carries an "updated" date only when we actually update it.
