#!/usr/bin/env bash
# Run every gate, then rebase and push to dev. Stops at the first failure.
# Written by conductor@ 2026-11-15 after a release where `leak-scan | tail` hid a failure.
# 2026-11-19, conductor.agenticcells-site@: added abp-check, check-commits and role-scope (gates added, none removed).
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -e board/HOLD.md ]; then echo "board/HOLD.md exists: no release" >&2; exit 1; fi
node build/build.mjs
node build/validate.js
node build/leak-scan.mjs
node build/abp-check.mjs >/dev/null
git fetch -q origin dev
node build/check-commits.mjs origin/dev HEAD
node build/role-scope.mjs origin/dev HEAD
for i in 1 2 3 4 5; do
  git fetch -q origin dev
  git rebase -q origin/dev
  node build/build.mjs >/dev/null && node build/validate.js >/dev/null && node build/leak-scan.mjs >/dev/null && node build/check-commits.mjs origin/dev HEAD >/dev/null && node build/role-scope.mjs origin/dev HEAD >/dev/null
  if git push -q origin HEAD:dev; then echo "released $(git rev-parse --short HEAD) to dev"; exit 0; fi
  sleep $((i * 3))
done
echo "release failed after 5 attempts" >&2; exit 1
