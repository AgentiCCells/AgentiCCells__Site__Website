# Round 1 copy: facts and sources

Writer: writer.agenticcells-site@AgentiCCells.dinis, 2026-11-19 (UTC). Files written: `content/index.md`, `content/how-it-works.md`, `content/behind-the-scenes.md`, `data/sites.json`, `data/ui.json`, this file. Revised the same day after the review in `team/rounds/1/review/DESIGN.md` (see "Changes after the review" at the end).

## Sources and when they were read

| Source | What | Read (UTC) |
|---|---|---|
| Hub registry, `data/cells-registry.json` in AgentiCCells__Website at 12afa0c (copy `refs/registry-12afa0c.json`) | who may be named, ids, "what", repositories, consent | 2026-11-19 ~01:33 |
| AgentiCCells__Site__Factory, `dev` at a42d467 (2026-11-18 23:35 UTC) | README.md, REALITY.md, requests/README.md, every `requests/*/site.json` and `status.json`, `.github/workflows/plan.yml` and `apply.yml`, `build/validate.mjs` | 2026-11-19 ~01:35 |
| Live `/version.json` of each listed site | versions | 2026-11-19 01:34:12 to 01:34:15 |
| https://hub.agenticcells.site | number of cells listed | 2026-11-19 01:34:22 |
| Live page titles of the listed sites | names as the sites name themselves | 2026-11-19 ~01:34:25 |
| https://agenticcells.ai (home page; `/version.json` said v0.1.269) | what the company offers | 2026-11-19 01:34:30 |
| This repository: REALITY.md, team/WORKFLOW.md, team/scopes.json, team/rounds/1.md | the team, the loop, the role-scope check | 2026-11-19 ~01:33 |

The registry on AgentiCCells__Website `dev` had merge-conflict markers (not valid JSON) per the brief, so names come from the pinned copy only.

## Facts used

### Names (data/sites.json and pages)
- Everyone and everything named is in the registry at 12afa0c, whose `_decision` reads: "Dinis, 2026-11-16 ~18:10 UTC: everything listed here may be public. One client cell is excluded ...". The excluded client cell is not named anywhere.
- José Bota, Silvio Switha, Yiheng Wang: each has a `consent` field in the registry ("agreed to be named (Dinis, relayed by cells@AgentiCCells.dinis on 2026-11-16 ~22:45 UTC); request 2026-11-16__<label>"), copied into `consent`.
- Yiheng Wang's name is taken from the registry, not from the live page title, which differs.
- Gabriel DaCruz is listed in the registry without a consent field; left out of the selection to keep to sites with consent recorded or no person named. Sites, people and companies not in the registry are not named; the factory's 12 requests under a domain other than agenticcells.site are counted as "one other domain".
- Names of non-personal sites are their own page titles: "RiskMandate at Web Summit Lisbon 2026", "Quinta do Sol Laranja (example site)" (the registry calls it a made-up orange grower), "Specialist: Writing". The hub's page title is "AgentiCCells hub: find the cells we have made"; I used "AgentiCCells hub".
- Dinis Cruz is named as the person who instructs (this repository's REALITY.md: "No person is named except Dinis").
- GitHub and Claude Code are named as tools the factory uses (factory README.md and REALITY.md). No cloud provider is named; it is "a cloud role".

### Versions (data/sites.json)
| Site | Version | Read |
|---|---|---|
| jose-bota.agenticcells.site | v0.1.24 | 01:34:13 |
| yiheng-wang.agenticcells.site | v0.1.22 | 01:34:14 |
| silvio-switha.agenticcells.site | v0.1.5 | 01:34:13 |
| riskmandate-at-websummit.agenticcells.site | v0.1.6 | 01:34:12 |
| algarve-orange-grower.agenticcells.site | v0.1.4 | 01:34:13 |
| specialist-writing.agenticcells.site | v0.1.13 | 01:34:14 |
| hub.agenticcells.site | v0.1.17 | 01:34:12 |
| agenticcells.site (not in the selection) | v0.1.6, no commit field (the reviewer read v0.1.7 at 01:43) | 01:34:12 |

Commit ids from the sites' version.json files are not copied into data/ (the validator refuses 40-character hex).

### Numbers
- **20 cells on the hub:** 20 distinct `/cells/<id>/` links on https://hub.agenticcells.site, 2026-11-19 01:34:22 UTC. Matches the 20 cells in the registry at 12afa0c.
- **Six specialists:** registry entries of kind `specialist` with a live address: abp, design, writing, security, code, ux.
- **40 requests, 28 and 12, 39 live:** 40 dated request folders in the factory's `requests/` at a42d467 (2026-11-15 to 2026-11-18). By `site.json` domain: 28 under agenticcells.site, 12 under the other domain. By `status.json`: 39 `live`, 1 `applying` (2026-11-15__agenticcells-site, updated 2026-11-18T22:45:26Z). All 40 have mode `real`.
- **27 of 28 live on agenticcells.site:** the 28 agenticcells.site requests minus this site's (applying). One of the 27, an earlier request, was withdrawn by hand; its status.json still says live because teardown is not built (factory REALITY.md). The pages say "marked live" for that reason.
- **First pass ran 17 times, switched off 2026-11-18:** factory REALITY.md ("It ran 17 times between 2026-11-16 and 2026-11-18 ... at Dinis's word ~14:45 UTC: 'that was an experiment to see how it worked and it is costing us money'"); `FIRST_PASS_ON = false` in `build/validate.mjs` line 34.
- **Under three minutes from merge to live:** factory REALITY.md, QA-2 on 2026-11-16 ("from merge (03:07:59) to live with a first pass in under three minutes").

### The flow (content/how-it-works.md)
- Request folder, `site.json` and `brief.md`, no secret: factory `requests/README.md`.
- Plan on the pull request, no secrets, creates nothing: `.github/workflows/plan.yml` header and steps (tests, validate, leak scan, plan comment). The factory REALITY.md entry for plan.yml (2026-11-15) still says "Written, not yet run on GitHub", and no source read shows a plan comment on a factory pull request. So the pages say the workflow "is built to" do this, and how-it-works says the record does not yet show it has run.
- Apply on merge to `dev`: `.github/workflows/apply.yml` (`on: push: branches: [dev], paths: ['requests/**']`). The factory git log shows 20 "Write back request status (real)" commits (and 6 "(first pass)"), each just after a merge.
- Step names in order: factory `requests/README.md` line 49 (validate, repo, seed, settings, dns, domain, vault, deploy, https, collaborators, first-pass), and the order of `steps` in every `status.json`; first-pass left out of the page's list because it is switched off. Vault and collaborators run only when the request asks (`requests/README.md` field table: `vault` and `collaborators` are optional). Plain-words order on the pages: repository, seed, settings (Pages), DNS, domain, deploy, HTTPS.
- Short-lived credentials, no long-lived keys: factory README.md (Dinis's words) and REALITY.md (GitHub App token about an hour; AWS role through OIDC, "No AWS key is stored anywhere").
- Teardown not built: factory REALITY.md (FAC-006).
- This site adopted, not seeded: this repository's REALITY.md and the factory status.json. "Its record still showed it waiting at the HTTPS step": `requests/2026-11-15__agenticcells-site/status.json`, state `applying`, https `pending`, updated 2026-11-18T22:45:26Z; the site itself answers over HTTPS.
- Conductor per live site, named `conductor.<label>@AgentiCCells.dinis`, team as sub-agents, ROLE.md and policy per role, rounds, behind-the-scenes page: factory `requests/README.md`, "After a request goes live: a conductor", quoting Dinis 2026-11-17 ~23:00 UTC. This is a rule, not a record that every live site has one, so the pages say "the rule is".

### The company (content/index.md)
- agenticcells.ai describes the website cell, what you give and what you get, and shows prices. No price is quoted or mentioned on this site; the page and `company_line` send visitors to agenticcells.ai for the company and its offers.
- "A cell is a small team of AI agents that works under written policies": agenticcells.ai ("A conductor and three agents, each with its own key and working under written policies").

### Behind the scenes
- Five roles, Dinis instructs, ROLE.md and POLICY.md per role, role-scope check in the release: team/WORKFLOW.md, team/scopes.json, REALITY.md (Gates, 2026-11-19).
- The loop's eight steps: team/WORKFLOW.md, "The loop (one round)".

## Specialist material applied (team/rounds/1.md)
- "The factory runs, so say so": done, with the counts above (checked in the factory REALITY.md and status files first).
- "Lists one site today" is wrong: replaced with the hub's count, 20, and its date.
- Factory link pointed to AgentiCCells__Website: now https://github.com/AgentiCCells/AgentiCCells__Site__Factory.
- "Until it moves to its own domain": used in the opening paragraph and the description.
- A "last checked" date by the version: each site in data/sites.json has `checked`; the home page line before {{sites}} says the versions are as last checked.

## For the developer
- Placeholders, each on its own line: `{{sites}}` (content/index.md, now before the steps), `{{flow}}` (content/how-it-works.md, the diagram only; the four step sections are the text), `{{team}}`, `{{loop}}`, `{{timeline}}` (content/behind-the-scenes.md).
- Links to `/how-it-works/` and `/behind-the-scenes/` assume those paths for the new pages.
- `hub_count` in data/sites.json is an object (cells, how, checked), not a bare number, so the date travels with the number.
- `data/ui.json` holds the short interface texts (buttons, captions, band, footer, share card, nav labels, timeline heading, alt pattern). `card_hub_label` is "On the hub"; append the site name in visually hidden text for the accessible name. `band_text` repeats the count and date in `hub_count`; if `hub_count` changes, change `band_text` with it. `timeline_heading` matches the heading in content/behind-the-scenes.md; render one, not both. `timeline_note` is extra, for use if the developer shows no line from the Markdown.
- In data/sites.json, `role` is `card` for the six cards and `band` for the hub entry, which feeds the band and is not a card.

## Changes after the review (2026-11-19)
- F1: no text claims the hub has a complete list. index.md section "The hub", the hub's `what` and `_about` in data/sites.json, and `band_text` say the hub lists the cells AgentiCCells has made and agreed to show, 20 on 19 November 2026 (`hub_count`), and that some newer factory sites are not on it. Source for the gap: the reviewer's check at 01:43 UTC (13 factory sites answer over HTTPS with no hub entry).
- index.md: sites section before the steps; steps renamed Request, Plan, Apply on merge, Conductor and team, matching how-it-works; "its record" links to the factory's `requests/` folder; the opening says a site starts on its own subdomain here and can move to its own domain if its owner wants (team/rounds/1.md, item 1); the company line no longer mentions prices.
- how-it-works.md: step headings match the home steps; plan "is built to"; apply steps in the factory's order with domain and deploy added; HTTPS-step wording now about the record; conductor per site stated as the rule; second link to the factory's `requests/` folder.
- behind-the-scenes.md: "Every commit" is now "The latest commits", with the limit of 50 and the note that the `Agent:` line is self-asserted (review 10.4 and 10.5).
- data/sites.json: RiskMandate is "An early site made by the site factory from a request file" (two factory test requests went live before it on 2026-11-16, factory status files); `role` added.
- data/ui.json written.
- These notes: removed the name of the person whose site is not in the registry, the unregistered company and its domain, the nickname from one live page title, and the label of the withdrawn request.
