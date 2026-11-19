# AgentiCCells__Site__Website

Source of https://agenticcells.site, the home of the sites that AgentiCCells cells build. First version. See REALITY.md for what is true today.

Build and check: `node build/build.mjs && node build/validate.js && node build/leak-scan.mjs && node build/abp-check.mjs`. Release: `team/release.sh` (also runs check-commits and role-scope). The team that keeps this site, its policies and its loop: `team/WORKFLOW.md`.

## Where each file came from
All of these were copied from AgentiCCells/AgentiCCells__Website (branch `dev`), the same organisation, under Apache-2.0, on 2026-11-15, then adapted as noted.

- `CLAUDE.md`: unchanged. The rules for every AgentiCCells agent.
- `build/build.mjs`: adapted. Removed the pricing ladder, the stack table and the website-cell diagram, which this site does not have. Everything else is as in the source.
- `build/validate.js`: adapted. The CNAME check and the own hosts are agenticcells.site and www.agenticcells.site. Removed the check of `data/cells.json`, which this site does not have. No remaining check was weakened.
- `build/leak-scan.mjs`: unchanged.
- `build/check-commits.mjs`: one change on 2026-11-19, the dotted-role pattern from AgentiCCells__Site__Template commit f7438ad (Dinis, 16 Nov 2026: "we definitely should allow dots because that's our terminology").
- `build/abp-check.mjs`: copied on 2026-11-19 from a sibling AgentiCCells site repository (not named here until the hub registry lists that site), which took it from AgentiCCells__Specialist__Agent-Behaviour-Policies (`scripts/abp-check.mjs`, Apache-2.0, written by specialist.abp@AgentiCCells.dinis); only the usage line changed.
- `build/role-scope.mjs`: copied on 2026-11-19 from a sibling AgentiCCells site repository (not named here until the hub registry lists that site) (`scripts/role-scope.mjs`, Apache-2.0, written by that site's conductor); only the comments changed.
- `team/release.sh`: adapted. Removed the board/abp step, which this site does not have. On 2026-11-19 the HOLD check, abp-check, check-commits and role-scope were added.
- `team/log.sh`: unchanged.
- `.github/workflows/pages.yml`: adapted. Removed the board/abp step.
- `assets/style.css`, `assets/favicon.svg`: copied, with the first comment line adjusted. The stylesheet and the header, mark and menu code in `build/build.mjs` were refreshed from the main site on 2026-11-16.
- `hub.json`: same draft shape as the source, with this site's values.

Licences: code Apache-2.0 (see LICENSE), text and images CC BY 4.0.
