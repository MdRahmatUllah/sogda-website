# The Sogda website — brief

What to build and why. `CLAUDE.md` says how. Anything marked **(owner)** is a decision only the owner makes: ask, don't guess.

## 1. The product in one breath
**Sogda — the road to a new language.** A complete German course on your phone, from A1 to C2. It works fully offline: no account, no signal needed, and your progress stays on your phone. Every day it gives you a short plan: revise what is due, learn a few new words, practise a grammar topic and some sentences. Spaced repetition (FSRS) brings each word back just before you would forget it. Three mock exams per step show you're ready. Meanings come in English, Bangla, Russian or Polish: one language, or two shown together.

**Who it's for:** adults learning German to live and work in Germany, especially English and Bangla speakers (the first audience), and since the app's v1.1.0 Russian and Polish speakers. Many are studying for a Goethe or telc certificate.

**The feeling:** calm, clear, encouraging, a little playful. It is *not* a gamified slot machine. It is a trusted course that respects your time and your privacy.

## 2. What a visitor must take away (in this order)
1. It's a **complete German course, A1 → C2**, in one app.
2. **A clear plan every day**: you open it and know exactly what to do (≈ 10–20 minutes).
3. **It remembers for you**: spaced repetition shows each word at the right moment.
4. **You'll be ready for the exam**: three mock exams per step, graded by section.
5. **Offline and private**: no account, no ads *(owner: confirm "no ads")*, works on a plane.
6. **In your language**: meanings in English, Bangla, Russian or Polish, with a pronunciation guide in the meaning language.
7. **Get it on Google Play** (badge + QR code). iPhone is coming soon.

## 3. The page, section by section (the storyboard)
One long page with a sticky header (logo, section links, language switch, theme toggle, and a *Get the app* button that scrolls to the final CTA). Each section below has its **message**, **visual** and **motion**. Motion is always subtle and purposeful, never decoration for its own sake.

### 3.1 Hero
- **Message:** headline *"Learn German, one clear day at a time."* (from the store listing), with *"The road to a new language"* as the kicker. Subline: *"A complete, offline German course from A1 to C2, with meanings in English, Bangla, Russian or Polish."* (The Polish and Russian pages lead with their own language, as their listings do; the Bangla page keeps "English or Bangla", as its listing does.)
- **Visual:**
  - A phone in a generic CSS/SVG device frame (not an iPhone or Pixel likeness) showing the **Today** screen, with a second phone behind it at an angle showing a **study card**.
  - Background: Lagoon, with the brand's *Silk Road* route (Variant B) drawn as a dotted path across the section.
- **Motion:**
  - On load, the route draws itself (SVG stroke-dashoffset, ~1.2 s).
  - The front phone floats up into place, and its screen cross-fades Today → study card front → study card back (the meaning appears) → quiz, on a gentle ~3 s loop that pauses on hover or focus.
  - The Ä tile of the logo gives a small "flip" from a to Ä once.
- **CTA:**
  - The Google Play badge + QR code (desktop: QR beside the badge; phone: badge only, since a QR is useless on the same device), and the "Coming soon on iPhone" chip.
  - Before the Play link exists: *"Coming soon to Google Play"*, and a mailto *"Tell me when it's out"* only if the owner gives a contact address **(owner)**.

### 3.2 A day with Sogda (the core, "how it works")
- **Message:** *Open the app, see today's plan, do it, done.* Four beats:
  1. **Revise** what is due;
  2. **Learn** a few new words, each with pronunciation, examples and the article;
  3. **Grammar** of the week, with a short practice;
  4. **Practice sentences** from words you know.

  Then **Day complete** 🎉.
- **Visual:** a **sticky phone** on one side and four text beats scrolling on the other (they stack on mobile). The phone's screen changes as each beat enters: Today → study_front → study_back → grammar_practice → sentences → day_complete_confetti.
- **Motion:** scroll-linked. The screen swaps with a short slide or cross-fade, and Today's progress ring fills as the beats pass (an SVG overlay that is only decorative; the screenshot underneath is real). Reduced motion shows the beats as a static grid of the six screens.

### 3.3 It remembers for you (spaced repetition)
- **Message:** *"Each word comes back just before you'd forget it."* A plain-language line about FSRS; no maths on the page.
- **Visual:** an SVG **forgetting curve** that decays. Each review (a dot) resets it higher and flatter, and the gaps between reviews grow: the app's own schedule, Good after Good on each due day (4 days → 15 → 50 → 150 …, `facts.fsrs.good_days` from `content/facts.json`, #103).
- **Motion:** the curve draws as it scrolls into view, and each review dot pops in with a tiny *ding* shape (no sound). Next to it, a small card shows one German word (*der Termin*) flipping through its revisions.

### 3.4 The journey: A1 → C2
- **Message:** *"12 steps from your first 'Hallo' to C2."* 5,069 words, 182 grammar topics, three mock exams for every step.
- **Visual:** the Silk Road route as a winding path with **12 stations**: A1.1 A1.2 A2.1 A2.2 B1.1 B1.2 B2.1 B2.2 C1.1 C1.2 C2.1 C2.2. Each station shows a tiny badge. The route passes the six level names (A1 … C2) as milestones.
- **Motion:** a traveller dot (the Sun tile) moves along the path with scroll. The stations light up as it passes, and a counter ticks words learned. A placement check line: *"Already know some German? A short placement check starts you at the right step."*

### 3.5 Practise and test yourself
- **Message:** quizzes in every direction (German → English/Bangla, English → German, articles, listening, word forms), and **mock exams** with vocabulary, grammar, listening, writing and speaking, with a result by section.
- **Visual:** a 3-card fan of screens: `quiz_runner_articles`, `exam_runner_listening`, `exam_results`.
- **Motion:** the cards fan out on enter, and hovering or focusing a card lifts it. On mobile it's a horizontal snap carousel with dots.

### 3.6 Everything else, in a feature grid
Short title, one line and an icon each. A card animates in with a small stagger:
- **Offline, always:** no signal needed; works on the U-Bahn and on a plane.
- **Private by design:** no account; your progress stays on your phone *(owner: add "no ads, no tracking" if true)*.
- **Hear every word:** your phone's German voice, or the optional natural *Supertonic* voice (offline, ~400 MB, downloaded once over Wi-Fi).
- **Compare near-synonyms** side by side (*kennen* vs *wissen*).
- **Add your own words** from daily life.
- **Home-screen widget** with a word to hear.
- **A reminder** only when something is due; you choose your rest days.
- **Your pace:** a daily goal you set, with catch-up when you fall behind.

### 3.7 Three looks (themes)
- **Message:** light, dark and *glass*; text up to 200 %; works with a screen reader.
- **Visual and motion:** one phone with a **three-way toggle**. Switching cross-fades the same screen (Today) between `today_light_phone`, `today_dark_phone` and `today_glass_phone`. A 200 % text badge shows `word_detail` at large text *(use the app's `_200` goldens if present)*.

### 3.8 In your language
- **Message:** meanings in **English, Bangla, Russian or Polish**, one language or two shown together, with the pronunciation guide in the meaning language; in Russian and Polish, the examples and grammar rules too (app v1.1.0, #34).
- **Visual:** one word card (*der Termin*) whose four meanings, each with its pronunciation, arrive one after another: English → বাংলা → Русский → Polski.
- Any Bangla on the page is set with `lang="bn"` and Noto Sans Bengali.

### 3.9 Screens gallery
A horizontal, snap-scrolling gallery of 8–10 real screens (phone), with a tablet view on large screens. Each shot has a caption and alt text in every locale. Keyboard: arrow keys, and visible prev/next buttons.

### 3.10 FAQ
Accordion. Answers only from *Facts* or the owner:
- Is it free? **(owner)**
- Do I need internet? (No; the optional voice download needs Wi-Fi once.)
- Which Android version? (Android 8.0 or newer.)
- iPhone? (Coming soon.)
- Is my data shared? (No account; progress stays on the phone.)
- Which exams does it prepare for? (Goethe/telc levels A1–C2; each step's three mock exams test listening, writing and speaking, like those exams, plus vocabulary and grammar, with a result by section. No reading-comprehension part. Not official papers: don't claim official endorsement.)

### 3.11 Final CTA + footer
- **Final CTA:** a big Lagoon band with the lockup, *"Start your road to German today"*, the Google Play badge + QR code, and the iPhone *coming soon* chip.
- **Footer:** Impressum · Datenschutz · contact **(owner)** · language switch · "Google Play and the Google Play logo are trademarks of Google LLC." · © Sogda.

## 4. Facts you may use (verified against the app, 2026-09)
Source: the app repo's `docs/05-dev-guide/store-listing.md`. Update these if the listing changes.
- **Course:**
  - A complete German course, **12 steps from A1.1 to C2.2**, built around the exams.
  - **5,069 words**, each with examples, its article and forms where it has them, and a pronunciation guide in your meaning language: Bangla, Russian or Polish letters, or an English respelling.
  - **182 grammar topics**, each with its rule and a short practice.
  - Meanings in **English, Bangla, Russian or Polish**: one language, or two shown together.
  - In Russian and Polish, the example sentences and grammar rules too.
  - Not a feature: Russian and Polish interference tips (they cover only some words).
- **Daily study:**
  - A **daily plan**: revise what is due, learn new words, practise a grammar topic and sentences.
  - **Spaced revision (FSRS)**.
  - Rest days you choose, and a reminder only when something is due.
  - A **home-screen widget**.
- **Practice and exams:**
  - **Quizzes** in every direction: German to your languages and back, articles, listening and word forms.
  - **Three mock exams per step**: vocabulary, grammar, listening, writing and speaking, with a result by section.
  - Compare near-synonyms; add your own words.
- **Voice:** your phone's German voice; optional **Supertonic** voice, offline, ~400 MB over Wi-Fi, downloaded once.
- **Setup and access:**
  - A placement check.
  - **Light, dark and glass** themes, text up to **200 %**, and screen-reader support.
  - The app in English, Bangla, Polish or Russian.
- **Privacy and platform:**
  - **Fully offline**, with **no account**, and progress stays on the phone.
  - Android 8.0+ (minSdk 26).
  - Package `de.sogda.app`.
  - iPhone: coming soon.
- **Not allowed without the owner:** price, "free", "no ads", user numbers, ratings, reviews, testimonials, "official Goethe partner", or any claim not listed here.

## 5. Brand (from the app repo's `docs/sogda-brand-kit/README.md`; copy the files with `pnpm sync:brand`)
- **Name:** always **Sogda** (one word, capital S). Tagline: *The road to a new language*. Domain `sogda.de`.
- **The mark:** two letter tiles, the letter you know (a) behind and the new language's letter (Ä) in front. It stands for the Sogdians, the interpreters of the Silk Road.
  - Variant A (tiles) is the main logo.
  - Variant B (tiles + dotted Silk Road route) is for **large marketing use only**, e.g. the hero, never below 48 px.
- **Colours:**

  | Token | Hex | Use |
  |---|---|---|
  | Lagoon | `#00C2B2` | ground, the hero, primary buttons (with Ink text) |
  | Sun | `#FFC61A` | the front tile, highlights, the traveller dot |
  | Ink | `#15121F` | text, outlines, the app's signature 2 px ink borders and hard offset shadows |
  | Paper | `#FFF8EE` | light background |
  | Night | `#13111D` | dark background |
- **Type:** Inter (ExtraBold 800 for display, SemiBold for the tagline, Regular/Medium for body) and Noto Sans Bengali for Bangla. Both are self-hosted.
- **Look:** echo the app's own style: rounded cards with a 2 px Ink outline and a hard offset shadow, Lagoon and Sun accents on Paper or Night, and generous whitespace. See the screenshots.
- **Rules:**
  - Clear space around the mark equals the height of the Ä's dots.
  - Never recolour the tiles, add gradients, or stretch the mark.
  - On photos, the mark sits on its Lagoon square.
- **Favicons and icons:** generate from `svg/icon-tiles-full.svg` (favicon.svg, 32/180/192/512 PNG, `manifest.webmanifest` with `theme_color #00C2B2`, `background_color #FFF8EE`).

## 6. Screenshots (the real app, never redrawn)
- **Source:** the app repo's golden images at `app/test/golden/goldens/*.png` in `MdRahmatUllah/DeutschPlan` (public).
  - They are pixel-exact renders of every screen: phone 1170 × 2532, and tablet sizes.
  - Each comes in `_light_`, `_dark_` and `_glass_` variants.
  - They carry no status bar and use realistic sample data.
- **Pipeline:**
  - `content/screenshots.json` lists each shot: `id`, the golden file name, the **app git ref** (pin a tag or commit, e.g. `v1.1.0`, so the site doesn't change by accident), and alt text per locale.
  - `scripts/sync-screenshots.mjs` downloads exactly those files from `raw.githubusercontent.com/MdRahmatUllah/DeutschPlan/<ref>/app/test/golden/goldens/<file>`. With `sharp`, it writes AVIF + WebP at 360/540/720/1080 px wide into `public/screens/`, with a small blur placeholder. The outputs are committed.
- **Suggested set** (light unless noted):
  - `today` (+ `today_dark`, `today_glass`), `study_front`, `study_back`;
  - `grammar_practice`, `sentences`, `day_complete_confetti`;
  - `quiz_runner_articles`, `quiz_runner_listening`;
  - `exam_runner_listening`, `exam_results`;
  - `learn`, `step_detail`, `progress`, `word_detail`, `compare`, `search`, `placement`, `onboarding_welcome`.
- **Device frame:** a generic rounded CSS/SVG frame (Ink bezel, Lagoon shadow). No Apple or Google device renders.
- **Updates:** when the app ships a new version, bump the ref in `screenshots.json` and run `pnpm sync:screens`. For a screen the goldens don't have (a real phone shot, the home-screen widget, a notification), file a `website:` issue in the app repo.

## 7. Languages of the website
The owner decided (2026-09-29, and 2026-09-30 for the list):
- **The website speaks five languages: English (`/en`), German (`/de`), Polish (`/pl`), Russian (`/ru`) and Bangla (`/bn`)** (the owner, 2026-09-30; website #36–#38). German is there for visitors in Germany, although the app has no German interface: its screenshots stay the app's English UI, described in German. Polish and Russian follow the app's own wording (`app_pl.arb`, `app_ru.arb`).
- **The visitor's own language first, English by default.** `/` picks the locale from the browser's language (`navigator.languages`, a small client redirect, with a `<noscript>` link list). When none of the site's languages matches, it uses English.
- **The visitor can always change it.** The header's language switch lists every locale in its own name (English, Deutsch, Polski, Русский, বাংলা), and the choice is remembered (`localStorage`, wrapped in try/catch) over the browser's language.
- All copy lives in `messages/*.json`, translated from the English. Keep each language consistent with the app's wording (the app repo's `app/lib/l10n/app_<code>.arb` and `docs/00-product/glossary.md`). A native speaker checks them before launch **(owner)**.
- Add `hreflang` alternates for every locale, and `x-default` → `/en`.

## 8. Legal (Germany; required before sogda.de goes live)
- **Impressum** (§ 5 DDG): the name and postal address of the person responsible, contact email (and phone or another fast contact), and VAT ID if any **(owner supplies all of it; placeholders until then; never invent)**.
- **Datenschutzerklärung** (GDPR), plain and short, since the site collects nothing:
  - static pages, no cookies, no analytics, no third-party requests (fonts self-hosted);
  - Vercel as the host, which processes IP addresses in server logs, with its data processing terms.

  If the owner later adds Vercel Web Analytics (cookieless), update it.
- No cookie banner is needed as long as there are no cookies or trackers. Keep it that way unless the owner decides otherwise.
- The legal pages exist in German (binding) and English (translation, marked as such).

## 9. SEO and sharing
*Beyond this section, the plan for search and AI answers is `docs/MASTER-PLAN.md` (2026-09-30). Its W1-b (#59) changes the titles below, and W1-c (#60) the JSON-LD.*

- **Per-locale metadata:**
  - title *"Sogda — Learn German offline, A1 to C2"*;
  - description from the store listing's short description;
  - canonical `https://www.sogda.de/<locale>` (the primary host in Vercel; `sogda.de` redirects to it).
- **Open Graph and Twitter images:** 1200 × 630, generated at build (logo + headline + a phone), per locale.
- `sitemap.xml`, `robots.txt`.
- **JSON-LD:** `MobileApplication` (name, operatingSystem `ANDROID`, applicationCategory `EducationalApplication`, the Play URL once live). No ratings or offers unless the owner gives them.

## 10. Owner decisions (ask; don't guess)
| # | Question | Default until answered |
|---|---|---|
| 1 | The Google Play link (for the badge, QR and JSON-LD) | "Coming soon to Google Play", no QR |
| 2 | ~~Price / "free" / "no ads" wording~~ **Decided 2026-09-30:** left out; the site says nothing about price or ads | — |
| 3 | ~~The website's languages~~ **Decided 2026-09-29, list 2026-09-30:** English, German, Polish, Russian and Bangla; the visitor's language first, English by default, with a switch (§7) | — |
| 4 | The Impressum details and a contact email: **the owner fills `content/legal.json` (2026-09-30)** | Placeholders; **don't launch on the domain without them** (a production build refuses: `pnpm check:launch`) |
| 5 | ~~Analytics (none, or cookieless Vercel Web Analytics)~~ **Decided 2026-09-30:** none | — |
| 6 | ~~Announce Russian/Polish meanings as "coming soon"?~~ **Moot since the app's v1.1.0 (#34):** they are in the listing, so the site states them | — |
| 7 | A pre-launch "notify me" (mailto only; no form backend) | None |

## 11. Definition of done (launch)
- [ ] Every section above, in every launch locale, with the real screenshots and the motion described (and still fallbacks).
- [ ] The CLAUDE.md quality gate is green on the production build. Lighthouse runs against the live `https://sogda.de`.
- [ ] Impressum and Datenschutz are complete, with the owner's details.
- [ ] `sogda.de` and `www.sogda.de` both serve over HTTPS on one canonical host.
- [ ] The Google Play badge + QR code point at the live listing (once the owner shares it), and the iPhone "coming soon" chip is shown.
- [ ] Checked by hand on a real Android phone, an iPhone (Safari), an iPad, and desktop Chrome, Firefox and Safari.
