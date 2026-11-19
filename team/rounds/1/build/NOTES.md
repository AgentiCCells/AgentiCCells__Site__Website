# Round 1 build notes

By developer.agenticcells-site@AgentiCCells.dinis, 2026-11-19, about 01:52 to 02:00 UTC. Built from `team/rounds/1/design/PROPOSAL.md`, the verdict in `team/rounds/1/review/DESIGN.md` and the conductor's brief to the developer (same day). Nothing committed or pushed.

Built against the writer's files as committed at 89002a2 (content/, data/sites.json, data/ui.json). The writer's files were not touched.

## Gates (run locally, 2026-11-19 about 01:58 UTC)

- `node build/build.mjs`: built site/ (local, 4 pages)
- `node build/validate.js`: OK
- `node build/leak-scan.mjs`: OK (66 files, 39 binary skipped)
- No 40-character hex anywhere in site/ (checked with grep as well as the validator).

## Files changed

`build/build.mjs`, `build/pages/helpers/render.mjs` (new; renderers for the placeholders, not a page hook), `assets/style.css`, `assets/favicon.svg`, `assets/share.png` (new), `assets/sites/*.jpg` and `assets/sites/shots.json` (new), `scripts/refresh-sites.mjs`, `scripts/shots.mjs`, `scripts/share-card.mjs` (new), this file and `shots/`.

## Changes built (all 12 passed; each condition and how it is met)

1. **Wide layout.** `body class="wide"` on Home, How it works and Behind the scenes (set by `WIDE` in build.mjs). The two `.home ...` width rules are removed. The build cuts each Markdown page at `<h2>` into sections and wraps running text in `.prose` (review 1: by the build, not by hand in content/).
2. **Nav and footer.** Nav: Home, How it works, Behind the scenes, Hub with the outgoing arrow (`aria-hidden`); Publish dropped. `PRIMARY` holds the two new pages, so the footer "More" group is empty (2.2). Labels come from `nav_labels` in data/ui.json keyed by path, so "How it works" shows while the page title stays "How a site gets here" (2.1); a content page in the nav with no label stops the build. Footer: `footer_line`, then `company_line` (both the writer's; "behind the scenes" and "agenticcells.ai" are linked by the build), contact, links to llms.txt and the home page as Markdown, licences, version. Every footer link is at least 44 px tall (2.3; measured). No "every site" (2.4).
3. **Hero.** H1 and the first paragraph (class `lead`), buttons `hero_primary` (to the hub, with the arrow) and `hero_secondary` (to /how-it-works/), and the address picture (two pills, an arrow) with `address_caption` (the writer's true version, 3.3). The two "[First]"/"[Later]" labels are shown only if the writer adds `address_first`/`address_later`; today they are not shown. First screen at 390 px with the real copy: the buttons end at 653 px, inside 844 px (3.4).
4. **Site cards.** Cards for the entries of data/sites.json without `"role": "band"` (six today; 4.2). No fetch at build time; `version` and `checked` come from the file (F2, 4.1). Mapping as 4.3: line is `what`, address is `live` without `https://`, hub page `https://hub.agenticcells.site/cells/<id>/`. Screenshot `assets/sites/<id>.jpg` with alt from `screenshot_alt`, whose `{date}` is the time recorded by scripts/shots.mjs in `assets/sites/shots.json` (4.3). The whole card opens the live site (stretched link); "On the hub" is a separate link whose accessible name is "On the hub: <site name>" (visually hidden part; 4.5). Dates as "19 November 2026" (4.6). The refresh script writes data/sites.json but is not run by the developer (4.4).
5. **Steps.** The writer's numbered list on the home page is shown as the row of four step cards (Request, Plan, Apply on merge, Conductor and team; the writer's words, 5.1 and 5.2).
6. **Hub band.** The home section that links the hub ("The hub") becomes the band: its heading, then `band_text` and `band_button` from ui.json (20 cells, from the writer, 6.2). The paragraph under "## The hub" in content/index.md is not shown in the HTML (band_text replaces it) but stays in /index.md.
7. **Company line.** The home section that links agenticcells.ai shows its heading and `company_line`, under a thin rule, link 44 px tall. No price.
8. **How it works diagram.** `{{flow}}` renders the SVG only (8.3), framed, beside the writer's four numbered sections (side by side from 56rem). Apply chips in the factory's order: repository, seed, Pages settings, DNS record, domain, deploy, HTTPS (8.1); the `<desc>` says the same. Plan is "built to post", matching the writer's sourced wording. The "own domain later" pill and section are left out (8.2). `role="img"`, `<title>`, `<desc>`.
9. **Team and loop.** `{{team}}`: five cards in the order conductor, designer, writer, reviewer, developer; objective from each `team/<role>/ROLE.md`, "May change" from `team/scopes.json` (conductor shown as "any file", 9.2), the full agent name once (9.4), and "Read the <role>'s role" as distinct link text (9.3). `{{loop}}`: the eight steps and their roles read from `team/WORKFLOW.md` (the build fails if there are not eight), 7 back to 5 and 8 back to 1.
10. **Timeline.** `{{timeline}}`: the latest 50 commits from `git log`, UTC days (`TZ=UTC`, `format-local`), newest first, subject line only, escaped (10.2, 10.3). The pill shows the role for `<role>.agenticcells-site@AgentiCCells.dinis`, any other trailer in full (for example `site@AgentiCCells.dinis`), and a dashed "no Agent: trailer" pill when there is none. The 7-character hash links to `.../commit/<short>` (10.1); its accessible name is "Commit <hash>". The heading and the line above are the writer's ("The latest commits", "The latest 50 ... a claim, not a checked signature", 10.4 and 10.5); "All commits on GitHub" sits beside the heading.
11. **Share card.** `assets/share.png`, 1200x630, 113,518 bytes (under 300 KB), from `share_title` and `share_line` (no "every site", 11.1). Every page, the 404 included, has `og:image` `https://agenticcells.site/assets/share.png`, `og:image:width` 1200, `og:image:height` 630, `og:image:alt`, and `twitter:card` `summary_large_image` (11.2). The file is `share.png`, as the conductor's brief says; the review wrote `og.png`.
12. **Favicon.** The two-arc C mark in white on the teal `#0a5c6b` square, same corner radius, same path `assets/favicon.svg`.

Also built (from the brief): `/llms.txt` (what the site is, the pages, the six sites with versions and checked dates, links) and `/index.md` (content/index.md with `{{sites}}` written out as a list, links made absolute). Both are linked from the footer; the home page also has `<link rel="alternate" type="text/markdown" href="/index.md">`. sitemap.xml and robots.txt are unchanged. `site/version.json` is unchanged (`{"version": ...}` only).

## Contract with the writer

- A `{{...}}` left in a page fails the build ("placeholder {{sites}} left unreplaced"), as does an unknown one ("unknown placeholder {{nope}}"). A missing or empty ui.json key fails it too ("data/ui.json: missing or empty \"band_button\""), and so does a missing data file, screenshot or share card. All three messages were tested on a scratch copy.
- `sites_heading` and `timeline_heading`/`timeline_note` are used only when the page has no `## ` heading or no intro above the placeholder; today the writer's own headings are used.

## Scripts (not run by CI)

- `scripts/shots.mjs`: Playwright Chromium, 1366x800, deviceScaleFactor 1, top of each card site's home, JPEG quality 60 and lower if needed to stay under 120 KB. Run 2026-11-19 about 01:55 UTC: five at quality 60 (61 to 96 KB); the orange grower needed quality 44 (121,373 bytes, just under 120 KiB).
- `scripts/share-card.mjs`: run once, result above.
- `scripts/refresh-sites.mjs`: fetches each site's `/version.json`, updates `version` and `checked`, prints what changed, keeps the old values if a site does not answer; `--dry-run` writes nothing. **Not run**: it writes data/, which the conductor or writer runs and commits (review 4.4).

## Layout checks (Playwright, Chromium, 2026-11-19 about 01:57 UTC)

At 390x844 and 1366x800, light and dark, on all four pages: no horizontal scroll; one H1 and no skipped heading level on each page. Every link, button and summary is at least 44 px tall, except links inside running sentences (for example "its record", "REALITY.md", "team folder"), which the inline exemption of WCAG 2.2 SC 2.5.8 covers. Screenshots in `shots/` (home 390 light and dark, home 1366, how-it-works 390 and 1366, behind-the-scenes 390 light and dark, 1366).

## For the conductor

1. **`.gitignore` hides this folder.** The Python template line `build/` ignores `team/rounds/1/build/` (this NOTES.md and shots/): commit them with `git add -f`, or change .gitignore (not mine to change). For the same reason the helper folder is `build/pages/helpers/`: the template also ignores `lib/` and `parts/`.
2. **Commit 89002a2 ("fixup! Round 1 copy ...") has no `Agent:` trailer.** It shows on the timeline as "no Agent: trailer", and check-commits / role-scope may refuse it. Squash or amend it before release.
3. The band text and the hub count date are fixed words in ui.json ("20 on 19 November 2026"); the build does not fill them from `hub_count`.
