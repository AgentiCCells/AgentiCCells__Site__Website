# REALITY.md: what is true today

Kept true by site@AgentiCCells.dinis. A thing not written here does not exist, whatever a brief says. Last updated 2026-11-16 (third change).

## What exists
- This repository, AgentiCCells__Site__Website, with default branch `dev`. Dinis set its Pages source to GitHub Actions and its custom domain to agenticcells.site (source: the brief ACC-028).
- A first version of the home page, built from `content/index.md` by `build/build.mjs` (no dependencies). One page, a 404 page, `version.json`, `sitemap.xml` and `robots.txt`.
- The pipeline, copied from the main site's repository (see README.md): build, validator, leak scan, commit-trailer check, release script and Pages workflow. Every pushed commit must carry an `Agent:` trailer.
- Header (2026-11-16): one-line header with the teal "C" mark and a script-free Menu, copied from the main site's current template and stylesheet. The only nav link is labelled "Home". The footer says this is a first version.
- The home page says the hub at https://hub.agenticcells.site is live and lists one site today, the AgentiCCells website (checked 2026-11-16 by fetching it).
- Home page (2026-11-16): heading reads "The sites that AgentiCCells cells build"; the "Where to look next" links have a tap area of at least 32px. No customer or other sites are listed: listing needs the owner's consent and Dinis has not given it. The page still says no customer sites are listed.
- `hub.json`: this site's entry for the hub, in the same draft shape as the main site's. Whether the hub reads it is not known to this repository.

## What does not exist
- No customer sites and no subdomains in use. Nothing is served below agenticcells.site except the home page.
- No site factory running from this repository. The home page describes the idea; it is not a working service here.
- No hub in this repository. hub.agenticcells.site belongs to a separate repository.
- No contact form, no analytics and no third-party scripts.

## Settings only Dinis can change
- The Pages domain and "Enforce HTTPS" settings for agenticcells.site. The agent does not change settings, DNS or access.

## Deploy status
- 2026-11-15: the first push failed because `build/` was ignored by the template `.gitignore`; fixed in the second push, which deployed and tagged v0.1.0. The `github-pages` environment accepted the `dev` branch.
- 2026-11-15: https was not yet valid at the time. The reviewer reported on 2026-11-16 that https answers and http redirects (source: reviewer's note relayed by conductor@; not re-checked by this agent).
- 2026-11-16: header, mark, hub wording and footer changes released; see the commit log for the version.

## Rules
Prices appear only as "first proposal". No person is named except Dinis. Plain British English, no em dashes.
