// Refreshes "version" and "checked" in data/sites.json from each site's live /version.json (review F2:
// the build fetches nothing; this script does, and the conductor or writer runs it and commits data/sites.json,
// which is the writer's file: review 4.4). Not run by CI. Node built-ins only (global fetch, Node 18+).
// Usage: node scripts/refresh-sites.mjs [--dry-run]
// developer.agenticcells-site@AgentiCCells.dinis, 2026-11-19.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = join(root, 'data', 'sites.json');
const dry = process.argv.includes('--dry-run');
const data = JSON.parse(readFileSync(file, 'utf8'));
const now = () => new Date().toISOString().replace(/\.\d+Z$/, 'Z');

let changed = 0, failed = 0;
for (const s of data.sites) {
  const url = `${s.live.replace(/\/$/, '')}/version.json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000), headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const v = (await res.json()).version;
    if (typeof v !== 'string' || !/^v?\d+(\.\d+)*$/.test(v)) throw new Error(`no usable "version" (${JSON.stringify(v)})`);
    const at = now();
    console.log(`${s.id}: ${s.version === v ? `${v} (same)` : `${s.version} -> ${v}`}, checked ${at}`);
    if (s.version !== v) changed++;
    s.version = v;
    s.checked = at;
  } catch (e) {
    failed++;
    // Keep the last version and date: never a guess (review F2).
    console.error(`${s.id}: not read (${e.message}); kept ${s.version} checked ${s.checked}`);
  }
}
if (!failed) data.checked = now();
if (dry) console.log(`dry run: ${changed} version(s) would change; data/sites.json not written`);
else { writeFileSync(file, JSON.stringify(data, null, 2) + '\n'); console.log(`data/sites.json written: ${changed} version(s) changed, ${failed} not read`); }
if (failed) process.exitCode = 1;
