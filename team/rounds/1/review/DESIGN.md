# Round 1 review: design proposal and copy

Reviewer: reviewer.agenticcells-site@AgentiCCells.dinis, 2026-11-19, about 01:40 to 01:50 UTC. Brief: `team/rounds/1.md`.
Reviewed: `team/rounds/1/design/PROPOSAL.md` (changes 1 to 12) with its mock-ups, and the writer's `content/index.md`, `content/how-it-works.md`, `content/behind-the-scenes.md`, `data/sites.json` and `team/rounds/1/copy/NOTES.md` (all as committed at 86df786).

Verdicts: **pass**, **pass with changes** (the conditions are listed and each must be met in the build; the reviewer checks them again in `LIVE.md`), or **reject**. No change is rejected.

## What I checked, and how

| Source | What it gave | Read (UTC) |
|---|---|---|
| Mock-ups, re-shot with Playwright (Chromium, deviceScaleFactor 1) at 390 and 1366 px, light and dark; script measures scroll width, links under 44 px, heading order, duplicate link names, and focus outline on the first six Tab stops | layout, accessibility | 01:44 |
| Contrast, recomputed from the tokens in `assets/style.css` with the WCAG formula | accent/surface 7.02, muted/surface 6.67, white/accent 7.62; dark: accent/surface 8.39, muted/surface 7.47, on-accent 9.36. The designer's figures hold. | 01:45 |
| Factory clone `refs/AgentiCCells__Site__Factory` at a42d467 (2026-11-18 23:35 UTC): every `requests/*/site.json` and `status.json`, `REALITY.md`, `README.md`, `requests/README.md` | the counts and the flow | 01:41 |
| `refs/registry-12afa0c.json` (the hub registry as the hub pins it) | names, ids, "what", consent | 01:41 |
| Live `/version.json` and `<title>` of the seven sites in `data/sites.json`; `https://hub.agenticcells.site/cells/<id>/` for each | versions, names, hub pages | 01:42:58 |
| https://hub.agenticcells.site home page | 20 distinct `/cells/<id>/` links; Kind filter "Site (9)" | 01:43 |
| Every `*.agenticcells.site` address in the factory requests, fetched over HTTPS and looked for on the hub | which factory sites the hub lists | 01:43 |
| https://agenticcells.ai home page | "working under written policies", "What you give", "What you get", prices | 01:43 |
| This repository: `build/build.mjs`, `build/validate.js`, `.github/workflows/pages.yml`, `team/scopes.json`, `git log` (11 commits, each with a `gpgsig` header) | what the build and gates will do | 01:45 |

Screenshots beside this file (all of the designer's mock-ups, re-shot by me): `home-390.jpg`, `home-390-dark.jpg`, `home-390-first-screen.jpg`, `home-1366.jpg`, `home-1366-dark.jpg`, `how-it-works-390.jpg`, `how-it-works-390-dark.jpg`, `how-it-works-390-first-screen.jpg`, `how-it-works-1366.jpg`, `how-it-works-1366-dark.jpg`, `behind-the-scenes-390.jpg`, `behind-the-scenes-390-dark.jpg`, `behind-the-scenes-390-first-screen.jpg`, `behind-the-scenes-1366.jpg`, `behind-the-scenes-1366-dark.jpg`. These are mock-ups with placeholder text; the built pages are checked again in `LIVE.md`.

Measured on the mock-ups: no horizontal scroll at 390 px on any page; headings in order on every page (H1, H2, H3, no skips); every `role="img"` SVG has `<title>` and `<desc>`; focus outline 3 px solid on every Tab stop tried (the site-card title link hides its own outline but the card's `:focus-within` outline shows, so focus is visible). Found: footer links 17 px tall on every page; "On the hub" used as the name of six links and "[Read the role]" of five.

## Two findings that change several items

**F1. The hub does not list every site.** The mock-ups and the copy say "See every site on the hub", "All sites on the hub", "Every site, in one list", "Every site: hub.agenticcells.site", "The hub lists them all", and "lists every cell AgentiCCells has made". On 2026-11-19 01:43 UTC, of the 27 factory requests under agenticcells.site marked live, 26 answered over HTTPS; the hub lists 13 of those (10 by the same label, 3 under a different id), and **13 answer but have no entry on the hub**. The registry also leaves out one client cell by design. The hub's own words are "The cells AgentiCCells has made". So no text on this site may say the hub lists every site or every cell. Acceptable shapes: "See the sites on the hub", "Find a site on the hub", "The hub lists the cells AgentiCCells may name in public". (I do not name the 13 here: most are not in the registry.)

**F2. Versions are not fetched at build time (conductor decision).** The build fetches nothing over the network. Versions and their "checked" times come from `data/sites.json`, which a script under `scripts/` refreshes. Every place the proposal says "the build reads each site's /version.json" (changes 4 and the line above the cards) is replaced by this. The "version not read" fallback goes; the card shows the version and the date from the file.

## A. Design proposal

### 1. Wide layout: **pass**
Measured: 1366 px pages use the width; 390 px has no horizontal scroll. Developer note: the Markdown pages need the `.prose` wrapper from the build, not by hand in `content/`.

### 2. Nav (Home, How it works, Behind the scenes, Hub) and footer: **pass with changes**
1. The nav label for `/how-it-works/` must read "How it works" although the page title is "How a site gets here". The build takes nav labels from `title`, so either the writer adds a nav label field in the front matter (writer's file) or the build maps it; do not change the page title.
2. Add `/how-it-works/` and `/behind-the-scenes/` to `PRIMARY` in `build/build.mjs`, or they also appear in the footer "More" group.
3. Footer links must have a 44 px tap area (ROLE check 5). Measured 17 px tall today (agenticcells.ai and the contact address are each the only link on their line, so the inline exemption does not fit them).
4. The footer line is the writer's, and must not say "every site" (F1).

### 3. Home hero with two actions and the address picture: **pass with changes**
1. Button text: not "See every site on the hub" (F1). For example "See the sites on the hub".
2. Lead: not "The hub lists them all" (F1).
3. Caption "[Every site gets an address here on day one.]": drop it, or make it true. The factory gave 12 of its 40 requests an address under another domain, and this site is the apex, not a subdomain. A true version: "A site made by the factory for AgentiCCells starts on a subdomain here."
4. Re-measure the first screen at 390 px with the real copy: the writer's opening paragraph is about 60 words, longer than the placeholder, and the mock-up's claim (heading, lead and both buttons in the first 844 px) must still hold or the lead must be shortened.

### 4. Six site cards with screenshots: **pass with changes**
1. F2: the build reads `version` and `checked` from `data/sites.json`; no fetch; no "version not read" state. The line above the cards says the versions are as last checked, with the date (the writer's line already does).
2. `data/sites.json` has seven entries, the seventh being the hub. Six cards: the first six entries; the hub entry is not a card (it serves the band, change 6). If the conductor wants seven, say so and re-check the grid.
3. Field mapping: card "line" is `what`; the address is `live` without `https://`; the hub page is `https://hub.agenticcells.site/cells/<id>/` (all seven return 200 at 01:43 UTC). There is no screenshot date in the file: either the alt text drops "taken <date>", or the screenshot script records the date where the build can read it.
4. Role scope: a refresh script that writes `data/sites.json` cannot be committed by the developer (`data/**` is the writer's in `team/scopes.json`). The writer (or the conductor) runs it and commits the data; do not widen the developer's scope for this.
5. Give each "On the hub" link a distinct accessible name (for example visually hidden "On the hub: <site name>").
6. Show the date as "19 November 2026" (British, as the copy writes dates), from the ISO time in the file.

### 5. Home: four steps: **pass with changes**
1. The home steps must use the same four steps as `/how-it-works/`: Request, Plan, Apply on merge, Conductor and team (the writer's home list today is "A request, The factory, A conductor and a team, Live" and has no Plan step). Writer rewrites the four lines.
2. Step 3 order: the factory's order is repository, seed, settings (Pages), dns, domain, vault, deploy, https (`requests/README.md`; every `status.json`). "Repository, DNS, Pages and HTTPS, in that order" is wrong: Pages settings come before DNS. Write "Repository, Pages, address, HTTPS", or drop "in that order".

### 6. Band to the hub: **pass with changes**
1. Heading: not "Every site, in one list" (F1).
2. The count is 20 **cells** (not sites), from `hub_count` in `data/sites.json`, with its date. The hub's "Site (9)" is a different number; do not mix them.

### 7. One line to agenticcells.ai: **pass**
No price on this site: checked, none in the copy or mock-ups (agenticcells.ai shows prices; the copy points there). The writer gave a "The company" heading plus a sentence; either shape meets the change.

### 8. How it works: vertical diagram: **pass with changes**
1. Apply chips in the factory's order: Repository, Pages, DNS (address), HTTPS (see 5.2). The SVG `<desc>` must say the same.
2. The "[Moving to its own domain]" section and "its subdomain here keeps pointing to it": no source. Nothing in the factory moves a site or redirects a subdomain, and no site has moved. Drop the section this round (the writer did not write it), or state only the intent, sourced to the brief.
3. The numbered list beside the SVG duplicates the writer's four prose sections. `{{flow}}` should render the SVG only, with the writer's sections as the text; or the designer and writer agree one list.

### 9. Behind the scenes: team cards and round loop: **pass with changes**
1. The lead placeholder "every change is a signed commit you can read": the commits are signed (each has a `gpgsig` header), but by one session identity, not one key per role (POLICY gap G1). Say "signed commits" only without implying each role signs with its own key.
2. Conductor "May change: `**`" must be shown in words ("any file"), with the scopes from `team/scopes.json` for the others.
3. Each "[Read the role]" link needs a distinct accessible name (for example "Read the conductor's role").
4. Each card should show the role's full name once, `<role>.agenticcells-site@AgentiCCells.dinis` (see the answer under change 10).
5. The loop SVG matches `team/WORKFLOW.md` (eight steps, roles, 7 back to 5, 8 back to 1): checked.

### 10. Commit timeline from git log: **pass with changes**
1. **Validator:** `build/validate.js` fails any 40-character hex string in `site/`. Commit links must use the short hash (`/commit/<7 to 12 hex>`; GitHub resolves it). Do not weaken the check.
2. Show the subject line only, never the body (one existing body names a site that is not in the registry). Escape with `esc()`.
3. Dates in UTC (for example `TZ=UTC git log --date=format-local:%Y-%m-%d`), so a build anywhere gives the same page.
4. The copy heading "Every commit" and the description "every commit that made the site" conflict with "show the latest 50". Either show all commits (11 today), or the heading and description say "the latest 50". Pick one; the writer and developer must agree.
5. The line above the list must say the agent comes from each commit's `Agent:` trailer, which the committing agent writes itself (G1), so it is a claim, not a verified signature.
6. Subjects become page text, so they fall under the wording and names rules from now on (the validator already fails em dashes, hype words, prices and key shapes in `site/`; it will fail a build on a bad subject).

**Designer's question, full trailer or role only:** the pill shows the **role only** as visible text, for trailers of the form `<role>.agenticcells-site@AgentiCCells.dinis`. Do not rely on `title` for the full trailer (not reachable by touch or keyboard); the full names appear once each in the team cards (9.4). A trailer of any other form (the older `site@AgentiCCells.dinis`) is shown in full as text, because "site" is not one of the five roles and would mislead. No trailer: the dashed "no Agent: trailer" pill, as proposed.

### 11. Share card: **pass with changes**
1. The footer line "[Every site: hub.agenticcells.site]" must change (F1), for example "The hub: hub.agenticcells.site".
2. `og:image` as the absolute URL `https://agenticcells.site/assets/og.png`, with width, height and alt, on every page including 404; `twitter:card` `summary_large_image`. The committed PNG must stay under 300 KB (mock-up 113,697 bytes).
3. The card's main line is the writer's; it must match the home H1 in substance.

### 12. Favicon as the C mark: **pass** (stays in this round)
It is one SVG with no words, facts or names, and it fixes a visible mismatch. Keep the path `assets/favicon.svg` (the validator requires it). If it slows the round, it may move to round 2 without a new review.

## B. Copy

### Numbers recounted (factory at a42d467)
| Claim | My count | Result |
|---|---|---|
| 40 request folders, 2026-11-15 to 2026-11-18 | 40 | matches |
| 28 under agenticcells.site, 12 under one other domain | 28 and 12 | matches |
| 39 `live`, 1 `applying` (this site, updated 2026-11-18T22:45:26Z, https `pending`) | 39 and 1 | matches |
| All 40 mode `real` | 40 | matches |
| 27 of 28 agenticcells.site requests marked live | 27 | matches; one of the 27 was withdrawn by hand (factory REALITY.md), which "marked live" covers |
| First pass ran 17 times, off since 2026-11-18 | factory REALITY.md line 38 | matches |
| Under three minutes from merge to live over HTTPS (one test, 2026-11-16) | factory REALITY.md line 29 | matches |
| 20 cells on the hub | 20 distinct `/cells/<id>/` links at 01:43; 20 in the registry | matches |
| Six specialists with their own site | 6 in the registry with a live address; hub "Specialist (6)" | matches |
| Versions of the seven sites | identical at 01:42:58 | matches |

### Names
Every name in `content/` and `data/` is in the registry at 12afa0c. The three people named have a `consent` field. The registry entry without one is left out (cautious, allowed). No unregistered person, no unregistered company or domain, and not the excluded client cell, appears in `content/` or `data/`. Dinis Cruz is named as the person who instructs (REALITY.md).

### Wording
No em or en dashes in `content/`, `data/`, `NOTES.md`, `PROPOSAL.md` or the mock-ups. No hype words. British spelling throughout. No price in the copy.

### `content/index.md`: **pass with changes**
1. "lists every cell AgentiCCells has made" (section "Every site: the hub"), and the heading "Every site: the hub": change (F1). A true version: "The hub lists the cells AgentiCCells may name in public, with previews and how to copy one. It listed 20 on 19 November 2026. Some newer sites made by the factory are not on it."
2. The four steps: align with change 5 (Request, Plan, Apply on merge, Conductor and team).
3. "its record held 28 requests ... marked 27 of them live": link "its record" to `https://github.com/AgentiCCells/AgentiCCells__Site__Factory/tree/dev/requests` so the number carries its source on the page.
4. Section order: the copy has steps before the sites; the design has the sites first. Follow the design's order (the sites are what most visitors come for), or the conductor decides; the writer's file and the build must agree.
5. The "This site" section has no place in the mock-up: the developer puts it after the company line.

### `content/how-it-works.md`: **pass with changes**
1. "The factory's plan workflow tests and validates the request and posts what would be created as a comment": the factory REALITY.md still says plan.yml is "Written, not yet run on GitHub", and I could not read the Actions runs either (the API is not open to this session; the public Actions page answered 403). Either record a source in NOTES.md that a plan comment was posted on a factory pull request, or say "is built to test ... and post".
2. "it was still waiting at the HTTPS step": the site answers over HTTPS. Write "its record still showed it waiting at the HTTPS step".
3. "Since 17 November 2026, each live site gets a conductor": the source (`requests/README.md`) is a rule from Dinis's words, not a record that every live site has one. Write "Since 17 November 2026 the rule is that each live site gets a conductor".
4. Nav label, see 2.1.

### `content/behind-the-scenes.md`: **pass with changes**
1. "Every commit" and the description: see 10.4.
2. "a check stops a release if a role changes a file outside its part": true (role-scope runs in `team/release.sh` and in the Pages workflow before deploy). Keep.

### `data/sites.json`: **pass with changes**
1. The hub entry's `what`, "lists every cell AgentiCCells has made": change (F1), as in index.md.
2. RiskMandate, "The first site the site factory made from a request file": that is the registry's wording, but the factory record shows two pipeline test requests (QA-1 at 03:07 and QA-2 at 03:10 UTC on 2026-11-16) live before it (03:46 UTC). Write "The first site, after two test runs, that the site factory made from a request file", or "An early site made by the site factory from a request file".
3. Six cards out of seven entries: see 4.2.

### `team/rounds/1/copy/NOTES.md`: **pass with changes**
The notes are in a public repository and so fall under the names rule. Remove from them: the name of the person whose site is not in the registry, the unregistered company and its domain, the nickname from one person's live page title, and the label of the withdrawn request (which carries that nickname). Refer to them as "a site not in the registry", "the other domain", "the earlier request". The facts and counts in the notes are correct.

## For the developer: what to reconcile

1. **Placeholders:** `{{sites}}` (index.md) renders the six cards, the line above them is the writer's; `{{flow}}` renders the SVG only (8.3); `{{team}}` the five cards, with the role lines taken from each `team/<role>/ROLE.md` objective unless the writer supplies them; `{{loop}}` the loop SVG; `{{timeline}}` the list. Each placeholder is on its own line, so the Markdown renderer must not wrap it in `<p>`.
2. **Bracketed text with no copy yet:** hero buttons and caption, "All sites on the hub" link, the band heading, line and button, the "How it works, in full" link, the footer line, the share card line, the alt text pattern, the team role lines, the loop paragraph and its WORKFLOW.md link, the timeline line. The writer supplies them, within F1.
3. **Nav:** order Home, How it works, Behind the scenes, Hub (front matter `nav: 1, 2, 3` matches); label "How it works" (2.1); `PRIMARY` (2.2); drop "Publish".
4. **Links:** `/how-it-works/` and `/behind-the-scenes/` are used by the copy and the mock-ups; the page files must build to those paths, or the validator's link check fails.
5. **Data refresh:** script under `scripts/`, writes `data/sites.json`, run and committed by the writer or conductor (4.4); no network in the build (F2).
6. **Timeline:** short hashes, subjects only, UTC, heading versus limit, trailer rule (10).
7. **Home order and steps:** 4 and 5 above.
8. **Not mine to change, for the conductor:** `team/WORKFLOW.md` ("at least two rounds, as for ...") and the factory's `requests/README.md` example both name the person whose site is not in the registry; the first is in this repository. The live site answered v0.1.7 at 01:43 UTC, while `team/rounds/1.md` and NOTES.md say v0.1.6.

## Verdicts

| Item | Verdict |
|---|---|
| 1 Wide layout | pass |
| 2 Nav and footer | pass with changes |
| 3 Home hero | pass with changes |
| 4 Site cards | pass with changes |
| 5 Four steps | pass with changes |
| 6 Hub band | pass with changes |
| 7 Line to agenticcells.ai | pass |
| 8 How it works diagram | pass with changes |
| 9 Team and loop | pass with changes |
| 10 Commit timeline (role only in the pill) | pass with changes |
| 11 Share card | pass with changes |
| 12 Favicon (stays in this round) | pass |
| content/index.md | pass with changes |
| content/how-it-works.md | pass with changes |
| content/behind-the-scenes.md | pass with changes |
| data/sites.json | pass with changes |
| copy/NOTES.md | pass with changes |
