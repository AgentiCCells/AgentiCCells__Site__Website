# REALITY.md: what is true today

Kept true by conductor.agenticcells-site@AgentiCCells.dinis (before 2026-11-19, by site@AgentiCCells.dinis). A thing not written here does not exist, whatever a brief says. Last updated 2026-11-19 ~02:15 UTC.

## What exists
- This repository, AgentiCCells__Site__Website, default branch `dev`. Pages source GitHub Actions, custom domain agenticcells.site (source: the brief ACC-028; settings since confirmed by the site factory, below).
- The live site at https://agenticcells.site, v0.1.8 (commit ce630b9, released 2026-11-19 ~01:57 UTC; checked by the reviewer at ~02:00 UTC). Three pages built from `content/*.md` by `build/build.mjs` (Node built-ins only, no network at build time): Home, How it works (`/how-it-works/`) and Behind the scenes (`/behind-the-scenes/`), plus a 404 page, `version.json`, `sitemap.xml`, `robots.txt`, `llms.txt` and `/index.md`.
- Header nav: Home, How it works, Behind the scenes, Hub (https://hub.agenticcells.site, marked as leaving the site). The home page is a page, not a redirect.
- Home page: what the domain is; six site cards (screenshots in `assets/sites/`, taken 2026-11-19 by `scripts/shots.mjs`); four steps; a band leading to the hub; a line to https://agenticcells.ai. The six sites and their versions come from `data/sites.json`, checked 2026-11-19 ~01:34 UTC and refreshed only when `scripts/refresh-sites.mjs` is run and committed.
- People named on the site: José Bota, Yiheng Wang and Silvio Switha (each with consent recorded in the hub registry, `data/cells-registry.json` in AgentiCCells__Website at commit 12afa0c, which the hub pins), and Dinis Cruz. The company RiskMandate is named through its Web Summit site, which the registry lists. No one else is named.
- Behind the scenes: the five roles, the round loop, and the latest 50 commits read from git log at build time (subject line, role from the `Agent:` trailer, short commit id).
- Link previews: Open Graph tags on every page, with `assets/share.png` (1200x630, 113,518 bytes, made by `scripts/share-card.mjs`).
- The team (2026-11-19): five roles named `<role>.agenticcells-site@AgentiCCells.dinis` (conductor, designer, developer, writer, reviewer), each with `team/<role>/ROLE.md` and an Agent Behaviour Policy `team/<role>/POLICY.md` (status: proposal, until Dinis approves). The loop is `team/WORKFLOW.md`; rounds are in `team/rounds/`. The roles run as sub-agents in one Claude Code session; there are no other sessions or scheduled tasks.
- Gates: build, `build/validate.js`, `build/leak-scan.mjs`, `build/check-commits.mjs` (accepts dotted roles since 2026-11-19, from Template commit f7438ad), `build/role-scope.mjs` with `team/scopes.json`, `build/abp-check.mjs`, and a stop while `board/HOLD.md` exists. All run in `team/release.sh` and in the Pages workflow.
- The site factory adopted this repository (request `2026-11-15__agenticcells-site` in AgentiCCells__Site__Factory, pull request #17): repository adopted, not seeded, apex left as set by Dinis, Pages settings set. Its record said `applying` at 2026-11-18 22:45 UTC, waiting at the https step for `/version.json` to carry commit c4f487c.
- `hub.json`: this site's entry for the hub, in the draft shape of the main site's.

## What does not exist
- `version.json` has no `commit` field. Adding the full commit id needs a decision by Dinis on the validator's key-shape rule (see team/HANDOVER.md). Even with it, the factory's re-check looks for c4f487c, which is no longer the deployed commit.
- No site has moved from a subdomain of agenticcells.site to its own domain; the factory does not move sites.
- No hub in this repository; hub.agenticcells.site belongs to AgentiCCells__Site__Hub.
- No contact form, no analytics, no third-party scripts, fonts or stylesheets.

## Settings only Dinis can change
- The Pages domain and "Enforce HTTPS" settings, branch protection on `dev`, and access. The agents do not change settings, DNS or access.

## Deploy status
- 2026-11-15: first deploy v0.1.0. 2026-11-16: header, hub wording and layout releases up to v0.1.4. 2026-11-17: v0.1.5 by the factory's dispatch of the Pages workflow.
- 2026-11-19: v0.1.6 (team), v0.1.7 (round 1 brief), v0.1.8 (round 1 build). Every run passed its gates.

## Rules
Prices appear only as "first proposal", and only as agenticcells.ai publishes them; the site quotes none. Names only as the hub registry lists them. Plain British English, no em dashes.
