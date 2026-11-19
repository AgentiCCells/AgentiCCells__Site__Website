// Role scope gate: every non-merge commit whose Agent: trailer names a role of this cell
// (role.agenticcells-site@AgentiCCells.dinis) may touch only
// the paths team/scopes.json gives that role.
// A commit by an identity of this cell that is not in team/scopes.json fails.
// Commits older than team/scopes.json are skipped (history is not rewritten).
// Usage: node build/role-scope.mjs <before> <after>   Prints OK or each breach, exits 1 on any.
// Written by conductor.marc-noah@AgentiCCells.dinis, 2026-11-17 (Apache-2.0), for AgentiCCells__Site__Marc-Noah;
// copied here unchanged in logic by conductor.agenticcells-site@AgentiCCells.dinis on 2026-11-19.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const git = (...a) => execFileSync('git', a, { encoding: 'utf8' }).trim();
const tryGit = (...a) => { try { return git(...a); } catch { return null; } };
const lines = s => (s ? s.split('\n').filter(Boolean) : []);
const [beforeArg, afterArg] = process.argv.slice(2);
const after = afterArg || 'HEAD';
const scopes = JSON.parse(readFileSync('team/scopes.json', 'utf8'));
const team = scopes.team.toLowerCase();
const suffix = (scopes.suffix || '').toLowerCase();
const legacy = (scopes.legacy_team || '').toLowerCase();
const glob = g => new RegExp('^' + g.split('**').map(p => p.split('*').map(x => x.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*')).join('.*') + '$');
const rules = Object.fromEntries(Object.entries(scopes.roles).map(([r, gs]) => [r, gs.map(glob)]));
const first = lines(git('log', '--format=%H', '--diff-filter=A', '--reverse', after, '--', 'team/scopes.json'))[0];
if (!first) { console.error('role-scope: team/scopes.json was never committed'); process.exit(1); }
const zero = /^0+$/;
const before = beforeArg && !zero.test(beforeArg) && tryGit('rev-parse', '--verify', '--quiet', `${beforeArg}^{commit}`);
const inScope = new Set([first, ...lines(git('rev-list', '--ancestry-path', `${first}..${after}`))]);
const commits = lines(git('rev-list', '--no-merges', ...(before ? [`${before}..${after}`] : [after]))).filter(c => inScope.has(c));
const problems = [];
for (const c of commits) {
  const agents = lines(git('log', '-1', '--format=%(trailers:key=Agent,valueonly)', c)).map(s => s.trim().toLowerCase());
  for (const a of agents) {
    const [local, host] = a.split('@');
    let role;
    if (host === team && suffix && local.endsWith(suffix)) role = local.slice(0, -suffix.length);
    else if (legacy && host === legacy) role = local;
    else continue;
    if (!rules[role]) { problems.push(`${c.slice(0, 7)}: ${a} is not a role in team/scopes.json`); continue; }
    for (const f of lines(git('diff-tree', '--no-commit-id', '--name-only', '-r', '--root', c)))
      if (!rules[role].some(r => r.test(f))) problems.push(`${c.slice(0, 7)}: ${role} may not change ${f}`);
  }
}
if (problems.length) { console.error(problems.join('\n')); console.error(`FAILED: ${problems.length} path(s) outside a role's scope`); process.exit(1); }
console.log(`OK (${commits.length} commit(s) checked against team/scopes.json)`);
