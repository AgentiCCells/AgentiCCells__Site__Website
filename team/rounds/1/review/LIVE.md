# Round 1 review: the live site after release

Reviewer: reviewer.agenticcells-site@AgentiCCells.dinis, 2026-11-19, about 01:58 to 02:06 UTC. Checked: https://agenticcells.site as served (not the local build), which answered `{"version":"v0.1.8"}` at `/version.json`; branch dev at ce630b9. `board/HOLD.md` did not exist. Conditions come from `team/rounds/1/review/DESIGN.md`.

## What I checked, and how

| Check | How | Time (UTC) |
|---|---|---|
| Layout, headings, accessible names, tap targets, focus, images | Playwright, Chromium, deviceScaleFactor 1, 390x844 and 1366x800, colorScheme light and dark, on `/`, `/how-it-works/`, `/behind-the-scenes/` and `/nope-404-check/` (a 404). Script measures scroll width, elements past the viewport, heading order, one H1, links and controls under 44 px, links with no name, one name used for two addresses, image `alt` and load, `<title>` and `<desc>` on `role="img"` SVGs, outline on the first eight Tab stops; at 390 px it opens the Menu | 02:01 |
| Contrast | computed text colour against the nearest opaque background on every text node, both schemes | 02:05 |
| Every link answers | every `href` and `src` on the four pages, plus every URL in `/llms.txt` and `/index.md` (56 addresses), fetched with `curl -L` | 02:03 |
| Open Graph | `<meta property="og:*">` and `twitter:card` read from each page's HTML | 01:59 |
| Share image | `/assets/share.png` fetched: 113,518 bytes, PNG 1200x630; looked at | 01:59 |
| `/llms.txt`, `/index.md`, `/robots.txt`, `/sitemap.xml` | fetched and read | 01:59 |
| Wording | rendered text of the four pages, raw HTML, `/llms.txt`, `/index.md`: em and en dashes, the validator's hype words plus a wider list, prices (`£ $ €` with a number, or a number with EUR, GBP, USD, euro, pound), US spellings, "every site / every cell / all sites" (F1) | 02:04 |
| Names | every name on the pages and in the card screenshots against `refs/registry-12afa0c.json` | 02:04 |
| Versions and hub count still true | each card site's `/version.json`; distinct `/cells/<id>/` links on https://hub.agenticcells.site | 02:04 |
| Gates | `node build/role-scope.mjs` (OK, 8 commits); `git show --stat ce630b9` (the developer's commit touches no `content/` or `data/` file) | 02:05 |

Screenshots in `team/rounds/1/review/after/` (full page unless named "first-screen"; JPEG, quality 70 for short pages and lowered to 40 to 60 for long ones so each stays under 250 KB; largest 244,681 bytes):
`home-390.jpg`, `home-390-dark.jpg`, `home-390-first-screen.jpg`, `home-390-menu-open.jpg`, `home-1366.jpg`, `home-1366-dark.jpg`, `how-it-works-390.jpg`, `how-it-works-390-dark.jpg`, `how-it-works-390-first-screen.jpg`, `how-it-works-1366.jpg`, `how-it-works-1366-dark.jpg`, `behind-the-scenes-390.jpg`, `behind-the-scenes-390-dark.jpg`, `behind-the-scenes-390-first-screen.jpg`, `behind-the-scenes-1366.jpg`, `behind-the-scenes-1366-dark.jpg`, `404-390.jpg`, `404-390-dark.jpg`, `404-1366.jpg`, `404-1366-dark.jpg`.

## Measured results

- **Horizontal scroll:** none. `scrollWidth` equals the viewport (390 or 1366) on all four pages, both schemes; no element past the right edge.
- **Headings:** one H1 per page; no skipped level (home H1, H2, H3 in cards; how-it-works H1, H2; behind-the-scenes H1, H2, H3 for roles and dates; 404 H1).
- **Tap targets:** every nav link, Menu, button, card link, "On the hub" link, "Read the ... role" link, "All commits on GitHub" and every footer link is at least 44 px high and wide. The Menu summary is 93x44; the four Menu links 358x44. The only links under 44 px are inside running sentences ("its record", "REALITY.md", "behind the scenes", "the repository", "team folder", "home page", "AgentiCCells__Site__Factory", "agenticcells.ai" in the "What it does not do yet" list), which the inline exemption covers.
- **Accessible names:** no link or control without a name; no name used for two addresses. "On the hub" links carry a hidden ": <site name>"; role links read "Read the conductor's role" and so on; commit links read "Commit ce630b9". Both SVGs have `<title>` and `<desc>`. All six card images load and have `alt`; the `alt` date comes from `assets/sites/shots.json`.
- **Focus:** a 3 px solid outline on every Tab stop tried. The card title link has no outline of its own, but the card's `:focus-within` outline shows.
- **Contrast:** all text at least 4.5:1 in both schemes. The only flagged nodes were SVG numbers on the teal dots and the hidden SVG `<title>`/`<desc>`, which the script measured against the page rather than the dot; on the screenshots they are white on teal.
- **First screen at 390 px (home):** H1 ends at 236 px, lead at 522 px, the two buttons at 592 and 653 px, all inside 844 px.
- **Links:** 54 of 56 answer 200 (the other is the mailto). The two factory links, `https://github.com/AgentiCCells/AgentiCCells__Site__Factory` and `.../tree/dev/requests`, got 403 **from this session's proxy** ("GitHub access to this repository is not enabled for this session"), not from GitHub. `git ls-remote` on the repository answers (HEAD a42d467), so it exists; I did not ask for wider access. Someone with an ordinary browser should open the two links once. Not counted as a failure.
- **Open Graph:** every page, the 404 included, has `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` (absolute, `https://agenticcells.site/assets/share.png`), `og:image:width` 1200, `og:image:height` 630, `og:image:alt`, and `twitter:card` `summary_large_image`. The image path is `share.png`, not the `og.png` DESIGN.md 11.2 gave as an example; `/assets/og.png` is a 404, which is fine because nothing refers to it.
- **Share image:** 113,518 bytes, 1200x630, under 300 KB. Main line "Where the sites made by AgentiCCells cells live", the same words as the home H1; second line "agenticcells.site: each site on its own subdomain, with the hub at hub.agenticcells.site." No "every site".
- **`/llms.txt`** (200, text/plain) and **`/index.md`** (200, text/markdown): present, linked from the footer and (index.md) by `<link rel="alternate">`. Versions and dates agree with the HTML. But see finding L2: `/index.md` and the home page say different things in two sections.
- **Wording:** no em or en dash, no hype word, no price, no US spelling, and no "every site / every cell / all sites" anywhere checked. "the prices are invented" (the orange grower card) names no price.
- **Names:** every name in the text is in the registry at 12afa0c: José Bota, Yiheng Wang, Silvio Switha (each with a `consent` field), RiskMandate at Web Summit Lisbon 2026, Quinta do Sol Laranja (an invented example), Specialist: Writing, and Dinis Cruz as the person who instructs. The contact address in the footer is the one Dinis gave on 2026-11-15 (quoted in `build/build.mjs`). The excluded client cell and the person whose site is not in the registry appear nowhere. Card screenshots: see "The Yiheng Wang screenshot" below.
- **Facts still true at 02:04:** all six card versions match the live `/version.json` (v0.1.24, v0.1.22, v0.1.5, v0.1.6, v0.1.4, v0.1.13); the hub still has 20 distinct `/cells/<id>/` links; all six hub pages answer 200.

## DESIGN.md conditions: met or not met

### 2. Nav and footer
1. Nav label "How it works", page title "How a site gets here": **met**.
2. `/how-it-works/` and `/behind-the-scenes/` in the primary nav, not repeated in a footer "More" group: **met** (the footer has no "More" group).
3. Footer links at least 44 px: **met** (none measured under 44 px in either dimension, at either width).
4. Footer line does not say "every site": **met** ("Kept by a team of AI agents, in the open. See behind the scenes.").

### 3. Home hero
1. Button not "See every site on the hub": **met** ("See the sites on the hub").
2. Lead not "The hub lists them all": **met**.
3. Caption dropped or made true: **met**. The "day one" claim is gone; the caption now reads "A site starts on its own subdomain here. It can move to its own domain if its owner wants." The move is the brief's intent (`team/rounds/1.md` item 1), which 8.2 allows; no site has moved and the factory does not move sites, so "can move" reads as more than intent (round 2 candidate 6).
4. First screen at 390 px holds heading, lead and both buttons: **met** (buttons end at 653 px of 844).

### 4. Site cards
1. Versions and dates from `data/sites.json`, no fetch, line says "when we last checked": **met**.
2. Six cards, the hub entry not a card: **met**.
3. Field mapping, and a recorded screenshot date: **met** (`what`, `live` without `https://`, `/cells/<id>/`; the `alt` date comes from `assets/sites/shots.json`).
4. The developer did not commit `data/`: **met** (ce630b9 touches no `data/` file; role-scope OK).
5. Distinct names for "On the hub": **met**.
6. Dates as "19 November 2026": **met**.

### 5. Home steps
1. Same four steps as `/how-it-works/` (Request, Plan, Apply on merge, Conductor and team): **met**.
2. Factory order, no wrong "in that order": **met** ("sets up its Pages, address and deploy, turns on HTTPS").

### 6. Hub band
1. Heading not "Every site, in one list": **met** ("The hub").
2. 20 cells, not sites, with its date, from `hub_count`: **met in what it says, not met in how**. The page reads "20 on 19 November 2026" and calls them cells, which is true. But the words are fixed text in `data/ui.json` `band_text`; the build only checks that `hub_count` exists (`build/build.mjs` lines 41 to 42) and prints `band_text` as written (line 269). `/llms.txt` does fill its count from `hub_count` (line 401). The next refresh of `hub_count` will not change the band. Not a failure today; round 2 candidate 3.

### 8. How it works
1. Apply chips in factory order, `<desc>` the same: **met** (Repository, Seed, Pages settings, DNS record, Domain on Pages, Deploy, HTTPS).
2. No "moving to its own domain" section: **met**.
3. `{{flow}}` renders the SVG only, the writer's sections are the text: **met**.

### 9. Behind the scenes
1. No "signed commit" claim implying a key per role: **met** (the lead does not say "signed"; the timeline note says the `Agent:` line is "a claim, not a checked signature").
2. Conductor shown as "any file", others from `team/scopes.json`: **met** (all five match the file).
3. Distinct names for "Read the role": **met**.
4. Full name once per card: **met**.
5. Loop matches `team/WORKFLOW.md`: **met** (eight steps, 7 back to 5, 8 back to 1).

### 10. Commit timeline
1. Short hashes only: **met** (7 hex).
2. Subject only, escaped: **met**.
3. Dates in UTC: **met**.
4. Heading and limit agree: **met** ("The latest commits", "The latest 50 commits (or all of them, while there are fewer)"; 15 shown).
5. Line says the agent comes from a self-written `Agent:` line: **met**.
6. Subjects under the wording rules: **met** (no breaks found).
Designer's question: role only in the pill for dotted trailers, `site@AgentiCCells.dinis` in full, dashed "no Agent: trailer" for the initial commit: **met**.

### 11. Share card
1. Footer line no longer "Every site: hub.agenticcells.site": **met** (no such line).
2. Absolute `og:image` with width, height, alt on every page including 404, `twitter:card` `summary_large_image`, under 300 KB: **met** (path `share.png`; 113,518 bytes).
3. Main line matches the home H1: **met** (same words).

### 12. Favicon
`/assets/favicon.svg` answers 200, the C mark: **met**.

### Copy conditions
- index.md 1 (no "every cell"), 2 (steps), 3 ("its record" linked), 4 (sites before steps), 5 ("This site" after the company line): **met**.
- how-it-works.md 1 ("is built to test"; "The factory's record does not yet show that it has run on GitHub"), 2 ("its record still showed it waiting at the HTTPS step"), 3 ("the rule is that each live site gets a conductor"), 4: **met**.
- behind-the-scenes.md 1, 2: **met**.
- data/sites.json 1 (hub `what`), 2 (RiskMandate "An early site made by the site factory from a request file"), 3: **met**.
- NOTES.md (names removed): **met** (lines 24 and 91 refer to "one live page title" without the nickname).

Every DESIGN.md condition is met on the live site, with 6.2 met in its words but not in its mechanism.

## The conductor's three observations

**(a) The company line appears both as a section and in the footer: confirmed.** On the home page, "For the company and what it offers, see agenticcells.ai." is the whole "The company" section and, word for word, a footer line about 300 px lower (`home-1366.jpg`). DESIGN.md change 7 asked for one line. Keep it in one place: the footer is enough, as it is on every page; or keep the section and drop the footer line on the home page only.

**(b) The "This site" section repeats the footer: confirmed, in part.** Both say a team of agents keeps the site in the open and link to behind the scenes. The section adds two links the footer lacks (the repository and REALITY.md). Suggestion: move those two links into the footer line ("Kept by a team of AI agents, in the open: behind the scenes, the repository, REALITY.md.") and drop the section, which also ends the home page on the hub band, the action we want. Do not do this until REALITY.md is true (L1).

**(c) The hub band count is fixed text in `data/ui.json`: confirmed.** See 6.2. The developer also recorded it (`team/rounds/1/build/NOTES.md`, issue 3). Fix: `band_text` takes `{count}` and `{date}` placeholders (the build already supports placeholders in ui texts, `build/build.mjs` line 36) filled from `hub_count.cells` and `hub_count.checked`, as `/llms.txt` already does. The `_about` in `data/ui.json` says the count "comes from hub_count", which is not true today.

## The Yiheng Wang screenshot: acceptable, do not re-crop

The card image (`assets/sites/yiheng-wang.jpg`, 1366x800) shows her live home page, whose header, H1 and `<title>` show her name with the nickname she uses on that site (not repeated here, as for NOTES.md). Our text uses the registry name "Yiheng Wang" (NOTES.md line 24). My view:

- She agreed to be named and to have her site listed (registry `consent`, Dinis, 2026-11-16 ~22:45 UTC). The nickname is part of her own name as she presents it on that consented site; it names no new person.
- The hub, which Dinis approved for public use (registry `_decision`), shows a screenshot of the same page (`https://hub.agenticcells.site/cells/yiheng-wang/`, "taken 2026-11-16").
- A crop that hides the nickname would show her page other than it is, and the H1 is the main subject of the shot.
- My round 1 request to remove the nickname from NOTES.md was about our own words repeating it; that still holds for text.

The same reasoning covers the José Bota screenshot, which shows the names of three of his own ventures (on his consented site, not in the registry), and the RiskMandate and Silvio Switha screenshots. Record this reading in the writer's NOTES.md as the reviewer's view and ask Dinis to confirm it, because POLICY N4 read strictly ("every name on the site appears in data/sites.json") could be taken to cover text inside images.

## My own findings

**L1. REALITY.md is not true, and the home page links to it as "which says what is true today".** At ce630b9 it still says: the live site answered v0.1.5; one page; the nav has Home, Hub and Publish; "No customer sites ... No other sites are named or linked"; "Nothing is served below agenticcells.site except the home page"; and under Rules "No person is named except Dinis". The live site is v0.1.8, has three pages, a different nav, six named sites and three named people (with consent). CLAUDE.md: "Keep REALITY.md true". This is the conductor's file. **Must be fixed before round 2.**

**L2. `/index.md` and the home page disagree in two sections.** The build replaces the writer's "The hub" and "The company" paragraphs with `data/ui.json` texts in the HTML, but `/index.md` ships the writer's paragraphs. HTML: "The hub lists the cells AgentiCCells has made and agreed to show: 20 on 19 November 2026." Markdown: "... with previews and how to copy one. It listed 20 on 19 November 2026. Some newer sites made by the factory are not on it." HTML company line: "For the company and what it offers, see agenticcells.ai."; Markdown: "agenticcells.ai is the company: what a website cell is, what you give and what you get." Both are true, but a page and its Markdown copy should say the same, and the HTML band lost the F1 caveat ("Some newer sites made by the factory are not on it"). One source for each text.

**L3. Unused and stale keys in `data/ui.json`.** `timeline_note` ("Up to the latest 50 commits, from the repository's git log at build time.") is not rendered; the page shows the writer's paragraph from `content/behind-the-scenes.md`. `_about` claims the band count is filled from `hub_count` (see c). Remove or wire them, so the file says what the page shows.

**L4. The factory links could not be opened from this session** (proxy 403, above). Not a site fault; confirm once in a browser.

**L5. Team card order.** Cards run Conductor, Designer, Writer, Reviewer, Developer; the lead names "a designer, a developer, a writer and a reviewer" and the loop runs designer, reviewer, writer, developer. Pick one order (the loop's is the natural one).

**L6. "can move to its own domain".** Used in the hero lead, the caption, the description, `og:description` and `/llms.txt`. It is the brief's intent; nothing has moved and the factory does not do it. "may later move" or "the plan is that it can move" says no more than the source.

**L7. Developer's build screenshot over the size the team uses.** `team/rounds/1/build/shots/behind-the-scenes-1366.jpg` is 282,717 bytes. Minor; no rule names a limit for build shots.

## Verdict

**Pass** for the live site: every DESIGN.md condition is met at v0.1.8 (6.2 in its words, not its mechanism), with no horizontal scroll, no tap target under 44 px outside running text, headings in order, every control named, contrast at least 4.5:1, Open Graph on every page, a 113,518-byte 1200x630 share image, and every link answering (two factory links unverifiable from this session only).

**Must be fixed before round 2 starts:**
1. L1: make REALITY.md true (conductor). The home page points readers to it as the record of what is true.

## Round 2 candidates, most important first

1. REALITY.md brought up to date (L1), if not done before the round starts.
2. One source per text: the home page and `/index.md` say the same in "The hub" and "The company" (L2), and the band gets back the caveat that some newer factory sites are not on the hub.
3. Fill the band count and date from `hub_count` (c), and remove or wire the stale `data/ui.json` keys (L3).
4. Say the company line once on the home page (a).
5. Fold the "This site" links into the footer and drop the section, so the home page ends on the hub band (b).
6. "can move to its own domain" worded as intent (L6).
7. Record the screenshot reading (Yiheng Wang, José Bota) in NOTES.md and ask Dinis to confirm it.
8. One role order across the behind-the-scenes lead, cards and loop (L5).
9. Confirm the two factory links in a browser (L4).
10. Keep build screenshots under 250 KB like the review ones (L7).
