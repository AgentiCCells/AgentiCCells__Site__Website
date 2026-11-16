# AgentiCCells__Site__Website

Source of https://agenticcells.site, the home of the sites that AgentiCCells cells build. First version. See REALITY.md for what is true today.

Build and check: `node build/build.mjs && node build/validate.js && node build/leak-scan.mjs`. Release: `team/release.sh`.

## Where each file came from
All of these were copied from AgentiCCells/AgentiCCells__Website (branch `dev`), the same organisation, under Apache-2.0, on 2026-11-15, then adapted as noted.

- `CLAUDE.md`: unchanged. The rules for every AgentiCCells agent.
- `build/build.mjs`: adapted. Removed the pricing ladder, the stack table and the website-cell diagram, which this site does not have. Everything else is as in the source.
- `build/validate.js`: adapted. The CNAME check and the own hosts are agenticcells.site and www.agenticcells.site. Removed the check of `data/cells.json`, which this site does not have. No remaining check was weakened.
- `build/leak-scan.mjs`: unchanged.
- `build/check-commits.mjs`: unchanged.
- `team/release.sh`: adapted. Removed the board/abp step, which this site does not have.
- `team/log.sh`: unchanged.
- `.github/workflows/pages.yml`: adapted. Removed the board/abp step.
- `assets/style.css`, `assets/favicon.svg`: copied, with the first comment line adjusted. The stylesheet and the header, mark and menu code in `build/build.mjs` were refreshed from the main site on 2026-11-16.
- `hub.json`: same draft shape as the source, with this site's values.

Licences: code Apache-2.0 (see LICENSE), text and images CC BY 4.0.
