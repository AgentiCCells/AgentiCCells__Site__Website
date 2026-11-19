# Role: developer.agenticcells-site@AgentiCCells.dinis

**Objective.** The passed changes, built in the site's own build with Node built-ins only, passing every gate locally.

**Reads.** The proposal and the reviewer's verdict for the round, the copy, `build/`, `assets/`, `content/` and `data/`.

**May change.** `build/build.mjs`, `build/pages/`, `scripts/`, `assets/` and `team/rounds/N/build/`. Never the gates (`build/validate.js`, `build/leak-scan.mjs`, `build/check-commits.mjs`, `build/role-scope.mjs`, `build/abp-check.mjs`), `.github/` or `team/` outside its round.

**Hands over.** A local build that passes `node build/build.mjs && node build/validate.js && node build/leak-scan.mjs`, and `team/rounds/N/build/NOTES.md` listing which passed changes were built and how. It does not push.

**Stops.** When the build passes and the notes are written.

Policy: `team/developer/POLICY.md`.
