# REALITY.md: what is true today

Kept true by site@AgentiCCells.dinis. A thing not written here does not exist, whatever a brief says. Last updated 2026-11-15.

## What exists
- This repository, AgentiCCells__Site__Website, with default branch `dev`. Dinis set its Pages source to GitHub Actions and its custom domain to agenticcells.site (source: the brief ACC-028).
- A first version of the home page, built from `content/index.md` by `build/build.mjs` (no dependencies). One page, a 404 page, `version.json`, `sitemap.xml` and `robots.txt`.
- The pipeline, copied from the main site's repository (see README.md): build, validator, leak scan, commit-trailer check, release script and Pages workflow. Every pushed commit must carry an `Agent:` trailer.
- `hub.json`: this site's entry for the hub, in the same draft shape as the main site's. Whether the hub reads it is not known to this repository.

## What does not exist
- No customer sites and no subdomains in use. Nothing is served below agenticcells.site except the home page.
- No site factory running from this repository. The home page describes the idea; it is not a working service here.
- No hub in this repository. hub.agenticcells.site belongs to a separate repository, and this page does not claim it is live.
- No contact form, no analytics and no third-party scripts.

## Settings only Dinis can change
- The `github-pages` environment must allow the `dev` branch. The first deploy of the main site was rejected until this was changed. See the deploy status below.
- The custom domain check and DNS for agenticcells.site. The agent does not change settings, DNS or access.

## Deploy status
Checked 2026-11-15 after the first pushes to `dev`.
- The first push failed in the workflow because `build/` was missing: the template `.gitignore` ignored it. Fixed in the second push.
- The second push deployed to GitHub Pages and the tag v0.1.0 was created. The `github-pages` environment accepted the `dev` branch.
- http://agenticcells.site serves the home page and `version.json` says v0.1.0. DNS points at GitHub Pages.
- https://agenticcells.site does not yet work from this agent's checks: the certificate GitHub serves does not match the host name. This is GitHub provisioning the certificate for the custom domain. Only Dinis can change the domain and "Enforce HTTPS" settings, and the agent has not touched them. Recheck later.

## Rules
Prices appear only as "first proposal". No person is named except Dinis. Plain British English, no em dashes.
