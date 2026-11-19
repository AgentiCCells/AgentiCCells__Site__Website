// Renders the link-preview card (round 1, change 11) to assets/share.png at 1200x630.
// Not run by CI: a person or agent runs it when share_title or share_line in data/ui.json change, and commits the PNG.
// Needs Playwright (require('playwright'), Chromium). Usage: node scripts/share-card.mjs
// developer.agenticcells-site@AgentiCCells.dinis, 2026-11-19. Design: team/rounds/1/design/mockups/share-card.html.
import { readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = createRequire(import.meta.url)('playwright');
const ui = JSON.parse(readFileSync(join(root, 'data', 'ui.json'), 'utf8'));
for (const k of ['share_title', 'share_line']) if (typeof ui[k] !== 'string' || !ui[k].trim()) throw new Error(`data/ui.json: missing "${k}"`);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const css = readFileSync(join(root, 'assets', 'style.css'), 'utf8');

// Light palette only: a preview image has no dark mode.
const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><style>${css}
:root{color-scheme:light;--bg:#ffffff;--surface:#f4f6f6;--fg:#16191d;--muted:#4f5861;--accent:#0a5c6b;--on-accent:#ffffff;--line:#d5dbdf}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:var(--bg)}
.card{box-sizing:border-box;width:1200px;height:630px;padding:64px 84px 0;display:grid;grid-template-rows:auto 1fr auto;
  background:linear-gradient(180deg,var(--surface),var(--bg) 70%);border-top:16px solid var(--accent);font-family:var(--font);color:var(--fg)}
.top{display:flex;align-items:center;gap:28px;color:var(--accent)}
.top b{font-size:60px;letter-spacing:-.02em;color:var(--fg)}
.top svg{width:112px;height:112px}
h1{margin:44px 0 0;font-size:66px;line-height:1.1;letter-spacing:-.025em;max-width:1030px}
.foot{border-top:2px solid var(--line);padding:24px 0 32px;font:400 28px/1.35 var(--font);color:var(--muted)}
.foot b{font:600 28px var(--mono);color:var(--accent)}
</style></head><body><div class="card">
<div class="top"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M17 6.5A10.5 10.5 0 1 0 17 25.5" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" opacity=".45"/><path d="M25 9.5A10.5 10.5 0 1 0 25 22.5" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg><b>AgentiCCells</b></div>
<h1>${esc(ui.share_title)}</h1>
<div class="foot">${esc(ui.share_line).replace(/^agenticcells\.site/, '<b>agenticcells.site</b>')}</div>
</div></body></html>`;

const out = join(root, 'assets', 'share.png');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, colorScheme: 'light' });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
} finally { await browser.close(); }
const size = statSync(out).size;
console.log(`assets/share.png: 1200x630, ${size} bytes`);
if (size > 300 * 1024) { console.error('share.png is over 300 KB'); process.exit(1); }
