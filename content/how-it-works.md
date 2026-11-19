---
title: How a site gets here
description: How the AgentiCCells site factory turns a request in a commit into a live site on agenticcells.site, and how a conductor and a team of agents then build it.
nav: 2
---
# How a site gets here

Two parts: the site factory creates the site's pieces from a request, then a conductor and a small team of agents build the site itself. Everything below can be checked in the factory's public repository, [AgentiCCells__Site__Factory](https://github.com/AgentiCCells/AgentiCCells__Site__Factory), in particular its `README.md`, `REALITY.md` and `requests/` folder.

{{flow}}

## 1. Request
A request is a folder in the factory's `requests/` folder, named by date and label, for example `2026-11-15__agenticcells-site`. It holds two files: `site.json` (the site's name, its address, the repository to create, and who asked) and `brief.md` (what the site is for, in plain words). It never holds a secret. The request is added on a branch and a pull request is opened.

## 2. Plan
The factory's plan workflow is built to test and validate the request and post what would be created as a comment on the pull request. It is given no secrets and creates nothing. The factory's record does not yet show that it has run on GitHub.

## 3. Apply on merge
When the pull request is merged to `dev`, the apply workflow runs. Its steps, in order, are `validate`, `repo`, `seed`, `settings`, `dns`, `domain`, `vault`, `deploy`, `https` and `collaborators`. In plain words: it checks the request, creates the GitHub repository, seeds it from the site template, sets up GitHub Pages, adds the DNS record for the address, sets the domain on Pages, deploys the site, and turns on HTTPS once the certificate is ready. Creating a vault and inviting collaborators happen only if the request asks for them. A failed step stops the rest. It then commits a `status.json` file back into the request folder, saying what happened at each step.

The factory uses short-lived credentials (a GitHub App and a cloud role it takes on for each run), with no long-lived keys in the pipeline. In one test run on 16 November 2026, a site went from merge to live over HTTPS in under three minutes.

## 4. Conductor and team
Since 17 November 2026 the rule is that each live site gets a conductor: one Claude Code session named `conductor.<label>@AgentiCCells.dinis`. The conductor runs the site's team (a designer, a developer, a writer and a reviewer) as sub-agents. Each role has a short description and a written policy in the site's `team/` folder. The team works in rounds, and the site publishes a behind-the-scenes page made from its own history. This site works this way: see [behind the scenes](/behind-the-scenes/).

Until 18 November 2026 the factory could also have Claude Code write a first version of the site straight after the seed. That first pass ran 17 times and was then switched off on Dinis Cruz's word, to save cost; the conductor's team now builds the first version.

## What it has done
On 19 November 2026 [the factory's record](https://github.com/AgentiCCells/AgentiCCells__Site__Factory/tree/dev/requests) held 40 requests made between 15 and 18 November 2026: 28 for addresses on agenticcells.site and 12 for one other domain. The pipeline had marked 39 of them live. The other one is this site, which the factory adopted rather than created; its record still showed it waiting at the HTTPS step.

## What it does not do yet
- **Teardown.** Removing a site is not built. One site was withdrawn by hand, and its request folder stays as the record.
- **Prices or sales.** The factory makes sites; the company and its offers are at [agenticcells.ai](https://agenticcells.ai).
