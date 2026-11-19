# Round 1 design proposal

By designer.agenticcells-site@AgentiCCells.dinis, 2026-11-19. **Status: proposal**, for the reviewer's verdict in `team/rounds/1/review/DESIGN.md`. Brief: `team/rounds/1.md`.

## What I read

- The live site, from the conductor's "before" screenshots `team/rounds/1/before/home-390.jpg` and `home-1366.jpg` (v0.1.6).
- https://hub.agenticcells.site, fetched and screenshotted at 390 and 1366 px on 2026-11-19 ~01:33 UTC. Its home lists 20 cells, 9 of them sites (source: the hub's "Kind" filter on that date). Its nav reads "Cells" and "Find and copy" (`/publish/`).
- `assets/style.css`, `build/build.mjs`, `content/index.md`, `REALITY.md`, `team/WORKFLOW.md`, the site factory's `README.md` (request folder with `site.json` and `brief.md`; plan on the pull request; apply on merge; `status.json` written back).

## How to read the mock-ups

- Each mock-up is a small HTML file in `mockups/` that links the real `assets/style.css` (relative path) and one extra file, `mockups/proposed.css`. **`proposed.css` is the whole stylesheet change**: the developer appends the parts that pass to `assets/style.css`. It adds no colour, font or image; every colour is an existing token, so the dark palette that `style.css` already has (`prefers-color-scheme: dark`) works without more rules.
- Text in **[square brackets]** is a placeholder. The writer writes the real words. Names such as "Site name 1" and addresses such as `site-1.agenticcells.site` are placeholders too.
- The grey "screenshots" in the site cards are drawn by a mock-up-only style block in `home.html`; the build uses the real `assets/sites/<id>.jpg`.
- Screenshots were taken with `mockups/shoot.cjs` (Playwright, Chromium, deviceScaleFactor 1, JPEG quality 70). The same script measures, per page and width, the page's scroll width and every link under 44 px tall.

Checks on the mock-ups (measured by `shoot.cjs`, 2026-11-19):

| Page | 390 px scroll width | Links under 44 px |
|---|---|---|
| Home | 390 (no horizontal scroll) | none |
| How it works | 390 | one link inside a sentence (allowed: inline links are exempt from the target size rule, WCAG 2.2 SC 2.5.8) |
| Behind the scenes | 390 | none at 390; one inline link at 1366 |

Contrast of the pairs the new parts use (computed from the tokens in `style.css` with the WCAG formula): light accent on surface 7.0:1, muted on surface 6.7:1, white on accent (the band) 7.6:1, accent on white (the band's button) 7.6:1; dark accent on surface 8.4:1, muted on surface 7.5:1, dark text on accent 9.4:1. All are above 4.5:1.

## The changes

### 1. A wide layout for the three main pages

- **Problem seen.** At 1366 px the content sits in a 46rem column on the left half of the screen (before/home-1366.jpg); a grid of six site cards and a diagram beside its text need more room. The widening is tied to the class `home`, and the rule `.home main>*:not(.hero){max-width:42rem}` would squeeze any grid on the home page.
- **Change.** The body gets the class `wide` on Home, How it works and Behind the scenes (from a front-matter field such as `layout: wide`, or from the page hook). `wide` sets header, main and footer to 62rem. Running text keeps its 42rem measure through a `.prose` wrapper. Remove the two `.home ...` width rules; nothing else uses them.
- **Mock-up.** All three pages below use it.

### 2. The nav: Home, How it works, Behind the scenes, Hub

- **Problem seen.** The nav reads Home, Hub, Publish. "Publish" goes to the hub's `/publish/` page, which the hub itself calls "Find and copy", so the label promises something the page does not do. Two of three links leave the site without saying so, and the two new pages have no place.
- **Change.** Primary nav, in this order: **Home** (`/`), **How it works** (`/how-it-works/`), **Behind the scenes** (`/behind-the-scenes/`), **Hub** (https://hub.agenticcells.site) with a small arrow icon (inline SVG, `aria-hidden`) to show it leaves this site. Drop "Publish": the hub's own nav reaches it in one tap. At 390 px the existing script-free Menu holds the same four links. The developer updates `PRIMARY` and `EXTERNAL_NAV` in `build/build.mjs`.
- **Footer.** Replace "This is a first version of this site..." with one line from the writer saying what the site is, plus a link to agenticcells.ai; keep contact, licences and version.
- **Mock-up.** Header of every mock-up: `mockups/home-1366.jpg` (top), `mockups/home-390.jpg` (Menu).

### 3. Home: a first screen that says what the domain is, with two actions

- **Problem seen.** The heading says what the cells build, but not that this domain is where their sites are published, each on its own subdomain. The only button is an email address; the hub, the thing most visitors want, is a link in the third card.
- **Change.** The hero keeps its look (soft surface gradient, large heading) and gets two columns on wide screens:
  - left: the heading, a two-line lead, then the **primary button "[See every site on the hub]"** (to https://hub.agenticcells.site, with the leave-site arrow) and the **ghost button "[How it works]"** (to `/how-it-works/`). Both buttons are at least 44 px tall.
  - right (below the buttons at 390 px): an "address" picture made of HTML, not an image: a pill `site-name.agenticcells.site`, an arrow, and a dashed pill `site-name.example` labelled "[Later, if the owner wants]". It shows the subdomain-then-own-domain idea without words having to carry it.
  - At 390 px the heading, lead and both buttons fit in the first 844 px screen (measured on `home-390.jpg`).
- **Mock-up.** `mockups/home.html`; `mockups/home-1366.jpg`, `mockups/home-390.jpg`, and dark: `mockups/home-390-dark.jpg`.

### 4. Home: "sites made here", six cards with screenshots

- **Problem seen.** The page says "No customer sites are listed", while the hub lists 9 sites (source above). Nothing on this domain shows what a site made here looks like.
- **Change.** A section with a heading, a link "[All sites on the hub]" at its right (under it at 390 px), one line saying where the list and versions come from, and a grid of six cards: one column at 390 px, two around tablet width, three at 1366 px. Each card:
  - the screenshot `assets/sites/<id>.jpg` (1366x800 JPEG of the site's home), shown with `aspect-ratio:16/9; object-fit:cover; object-position:top`, so the top of the page shows; `width="1366" height="800"`, `loading="lazy"`, and alt text "Screenshot of the home page of <name>, taken <date>";
  - the site's name as the card's main link (to its live address); a stretched link makes the whole card open the site;
  - one line of what it is (writer);
  - the address in the mono face, which wraps on long names (tested with a 51-character address at 390 px);
  - the version as a small pill, then "checked <date>" (read from the site's `/version.json` at build time; the date is the build date of that read);
  - a second, separate link "On the hub" to the site's page on the hub (`https://hub.agenticcells.site/cells/<id>/`), raised above the stretched link.
- **Data.** The writer chooses the six and puts them in `data/sites.json` (id, name, line, address, hub page, registry source), naming only sites the hub registry lists as agreed. The developer's build reads that file, fetches each `/version.json` (with a short timeout; if a site does not answer, the card shows "version not read" and the last date, not a guess), and lays out the cards. Screenshots are taken by a script under `scripts/` (Playwright, run by a person or agent before a release, not by the Node-only build) and committed.
- **Mock-up.** Same files as change 3.

### 5. Home: "how a site gets here" in four steps

- **Problem seen.** The factory is described as "the idea", and its link points to the wrong repository (brief, round 1). There is no picture of the steps.
- **Change.** Four step cards in a row at 1366 px (a column at 390 px), each with a numbered badge in the accent colour and a top rule: **Request**, **Plan**, **Apply on merge**, **Build**, one line each. A link "[How it works, in full]" beside the heading. The steps match the diagram in change 8 so the two pages tell the same story.
- **Mock-up.** Same files as change 3.

### 6. Home: a band that sends people to the hub

- **Problem seen.** A visitor who has scrolled past six cards has no strong next step.
- **Change.** A full-width band in the accent colour with on-accent text: a heading "[Every site, in one list]", one line with the hub's count and its source, and a button "[Open the hub]" whose colours turn inside out (page background, accent text) so it stands out on the band. Two columns at 1366 px, stacked at 390 px.
- **Mock-up.** Same files as change 3.

### 7. Home: a short line to agenticcells.ai

- **Problem seen.** The company link sits in a list with a price ("a website for £500"), on a page whose job is the sites.
- **Change.** One line under a thin rule, after the band: "[The company behind the cells, and what it offers:] agenticcells.ai". No prices on this site (brief, item 6). The link has a 44 px tap area.
- **Mock-up.** Same files as change 3.

### 8. How it works: the site factory as a vertical diagram

- **Problem seen.** No page explains the flow; a horizontal flow chart would shrink to unreadable text at 390 px.
- **Change.** `/how-it-works/` has a heading and lead, then a framed inline SVG beside a numbered list of the same four steps (side by side from 56rem, stacked below). The SVG is drawn vertically (viewBox 340 wide) so its text stays at about 13 to 16 px on a phone:
  1. **Request**: `site.json` and `brief.md` in a folder under `requests/`, in a pull request;
  2. **Plan**: the factory comments what it will create (no secrets);
  - a diamond **Merge** gate;
  3. **Apply**: four chips in order, a Repository, b DNS, c Pages, d HTTPS, with arrows; "status.json is written back";
  4. **Build**: a conductor and a team of five roles, in rounds (five dots echo the team);
  - a filled pill `site-name.agenticcells.site`, then a dashed pill "[later, if the owner wants: its own domain]".
  
  The SVG has `role="img"`, a `<title>` and a `<desc>` that says the whole flow in words. Its colours are classes (`.dg-*` in `proposed.css`) that use the palette tokens, so it follows dark mode. Then a link to the factory's repository (https://github.com/AgentiCCells/AgentiCCells__Site__Factory) and a short "[Moving to its own domain]" section. The page is a hook in `build/pages/` (raw HTML) or Markdown plus an SVG include; either works.
- **Mock-up.** `mockups/how-it-works.html`; `mockups/how-it-works-1366.jpg`, `mockups/how-it-works-390.jpg`.

### 9. Behind the scenes: the team and the round loop

- **Problem seen.** The team and its rules exist only in the repository.
- **Change.** `/behind-the-scenes/`:
  - **The team**: five cards (conductor, designer, writer, reviewer, developer), each with a round badge, one line of what the role does (writer, from `team/<role>/ROLE.md`), "May change:" with the paths from `team/scopes.json` in the mono face, and a 44 px link "[Read the role]" to its ROLE.md on GitHub. Three columns at 1366 px, one at 390 px.
  - **The round loop**: a vertical inline SVG of the eight steps of `team/WORKFLOW.md`, each with the role that does it, a curved arrow from 7 back to 5 ("[fails: back to 5]") and a long arrow from 8 back to 1 ("[next round]"). Same `.dg-*` classes, `<title>` and `<desc>` as change 8. Beside it at 1366 px, a short paragraph and a link to WORKFLOW.md.
- **Mock-up.** `mockups/behind-the-scenes.html`; `mockups/behind-the-scenes-1366.jpg`, `mockups/behind-the-scenes-390.jpg`.

### 10. Behind the scenes: a commit timeline built at build time

- **Problem seen.** The brief asks for the history of the site in the open; today it is only on GitHub.
- **Change.** A timeline, newest first, grouped by day: a dot and the date on a left rule, then each commit as a 44 px link (its first line, to `https://github.com/AgentiCCells/AgentiCCells__Site__Website/commit/<sha>`), and below it the agent as a small pill and the short hash. A link "[All commits on GitHub]" beside the heading.
  - **Data**: the page hook runs `git log` with `node:child_process` (a Node built-in), for example `git log --date=short --format=%H%x1f%ad%x1f%s%x1f%(trailers:key=Agent,valueonly,separator=%x2c)%x1e`. The Pages workflow already checks out with `fetch-depth: 0`, so the full history is there.
  - **Agent pill**: the role part of the `Agent:` trailer (for `conductor.agenticcells-site@AgentiCCells.dinis`, "conductor"; for the older `site@AgentiCCells.dinis`, "site"), with the full trailer in a `title` attribute. A commit without the trailer (the initial commit) shows a dashed pill "no Agent: trailer", never a guessed name. Whether the full trailer is shown as text is for the reviewer.
  - Escape every message with the build's `esc()`. Show the latest 50 and say so.
- **Mock-up.** Same files as change 9 (the timeline uses placeholder messages; the hashes are this repository's real ones).

### 11. A share card for link previews

- **Problem seen.** Pages have `og:title` and `og:description` but no image, and `twitter:card` is `summary`, so a shared link shows no picture. The hub has a card; this site does not.
- **Change.** One 1200x630 PNG, `assets/og.png`: the brand row (the teal C mark at 128 px and "AgentiCCells"), one line in large type "[Where the sites AgentiCCells cells make are published]" (writer), and a footer row with `agenticcells.site` in the accent mono face and "[Every site: hub.agenticcells.site]". Accent rule on top, surface-to-white gradient like the hero. It uses the light palette only, because a preview image has no dark mode.
  - **How it is made**: from `mockups/share-card.html` (moved to `scripts/share-card.html` by the developer), shot at exactly 1200x630 with Playwright by a script under `scripts/`, and committed. The Node-only build does not render it; it only adds `og:image` (absolute URL), `og:image:width` 1200, `og:image:height` 630, `og:image:alt`, and changes `twitter:card` to `summary_large_image` on every page.
  - Mock-up PNG: 113,697 bytes (under 300 KB).
- **Mock-up.** `mockups/share-card.html`; `mockups/share-card.png`.

### 12. The favicon should be the C mark

- **Problem seen.** The header shows the teal two-arc C mark, but `assets/favicon.svg` is a white "A" on a teal square, so the browser tab does not match the site.
- **Change.** A favicon drawn from the same two arcs as the header mark, white on the teal `#0a5c6b` square with the same corner radius as today. Small and optional; the reviewer may drop it to keep the round short.
- **Mock-up.** None needed beyond the header mark in every mock-up.

## Left for others

- **Writer**: every bracketed text; the six sites and their lines in `data/sites.json`, each with its registry source; the hub count with its date.
- **Developer**: the body class (change 1), nav constants (2), the cards from `data/sites.json` and `/version.json` (4), the two page hooks (8 to 10), the screenshot and share card scripts under `scripts/` (4, 11), and the Open Graph lines (11). No JavaScript is needed on any page.
- **Reviewer**: whether full `Agent:` trailers appear as text (10); whether change 12 stays in this round.

## Files

- `team/rounds/1/design/PROPOSAL.md` (this file)
- `team/rounds/1/design/mockups/proposed.css` (the stylesheet addition)
- `team/rounds/1/design/mockups/home.html`, `home-390.jpg`, `home-1366.jpg`, `home-390-dark.jpg`
- `team/rounds/1/design/mockups/how-it-works.html`, `how-it-works-390.jpg`, `how-it-works-1366.jpg`
- `team/rounds/1/design/mockups/behind-the-scenes.html`, `behind-the-scenes-390.jpg`, `behind-the-scenes-1366.jpg`
- `team/rounds/1/design/mockups/share-card.html`, `share-card.png`
- `team/rounds/1/design/mockups/shoot.cjs` (takes the screenshots and runs the width and tap-target checks)

Licences: all mock-ups, CSS and images here are made by this team, under the repository's licences (code Apache-2.0; text and images CC BY 4.0). No third-party asset is used.
