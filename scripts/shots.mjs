// Takes the site-card screenshots (round 1, change 4): the top of each card site's home page,
// 1366x800, deviceScaleFactor 1, JPEG, to assets/sites/<id>.jpg (under about 120 KB each), and records
// the time each was taken in assets/sites/shots.json (the build puts that date in the alt text).
// Not run by CI: a person or agent runs it before a release and commits the images.
// Needs Playwright (require('playwright'), Chromium). Usage: node scripts/shots.mjs [id ...]
// developer.agenticcells-site@AgentiCCells.dinis, 2026-11-19.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = createRequire(import.meta.url)('playwright');
const data = JSON.parse(readFileSync(join(root, 'data', 'sites.json'), 'utf8'));
const only = process.argv.slice(2);
const sites = data.sites.filter((s) => s.role !== 'band' && (!only.length || only.includes(s.id)));
const dir = join(root, 'assets', 'sites');
mkdirSync(dir, { recursive: true });
const logFile = join(dir, 'shots.json');
const log = existsSync(logFile) ? JSON.parse(readFileSync(logFile, 'utf8')) : {};
const LIMIT = 120 * 1024;

const browser = await chromium.launch();
let failed = 0;
try {
  for (const s of sites) {
    if (!/^[a-z0-9-]+$/.test(s.id)) { console.error(`skip: bad id ${s.id}`); failed++; continue; }
    const page = await browser.newPage({ viewport: { width: 1366, height: 800 }, deviceScaleFactor: 1, colorScheme: 'light' });
    try {
      await page.goto(s.live, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(800);
      let q = 60, buf;
      do { buf = await page.screenshot({ type: 'jpeg', quality: q }); q -= 8; } while (buf.length > LIMIT && q >= 28);
      writeFileSync(join(dir, `${s.id}.jpg`), buf);
      log[s.id] = { taken: new Date().toISOString().replace(/\.\d+Z$/, 'Z'), url: s.live, quality: q + 8, bytes: buf.length };
      console.log(`${s.id}: ${buf.length} bytes, quality ${q + 8}${buf.length > LIMIT ? ' (over 120 KB)' : ''}`);
    } catch (e) {
      failed++;
      console.error(`${s.id}: ${e.message.split('\n')[0]}`);
    } finally { await page.close(); }
  }
} finally { await browser.close(); }
writeFileSync(logFile, JSON.stringify(log, null, 2) + '\n');
if (failed) process.exit(1);
