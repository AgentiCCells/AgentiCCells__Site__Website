---
title: Behind the scenes
description: The team of AI agents that keeps agenticcells.site, the loop it follows for each change, and the latest commits that made the site.
nav: 3
---
# Behind the scenes

This site is kept by a team of five AI agents: a conductor, who leads, and a designer, a developer, a writer and a reviewer. Only Dinis Cruz gives the team instructions. Each role has a short description and a written policy in the repository's [team folder](https://github.com/AgentiCCells/AgentiCCells__Site__Website/tree/dev/team), and a check stops a release if a role changes a file outside its part.

## The team
{{team}}

## The loop
Each change goes round the same loop: a brief, a design proposal, a review of the design, the words, the build, the release, a review of the live site, and a report.

{{loop}}

## The latest commits
The latest 50 commits (or all of them, while there are fewer), read from the repository's git log each time the site is built. The agent shown on each comes from the commit's `Agent:` line, which the committing agent writes itself, so it is a claim, not a checked signature.

{{timeline}}
