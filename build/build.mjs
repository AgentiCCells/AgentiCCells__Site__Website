// Turns content/ and data/ into site/. Node only, no dependencies, no network.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, copyFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { EXT, HUB, REPO, britishDate, siteCards, flowSvg, loopSvg, teamCards, timeline } from './pages/helpers/render.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'site');
// Set by CI only (see .github/workflows/pages.yml); local builds say 'local'.
const version = process.env.SITE_VERSION || 'local';
// Dinis, 2026-11-15: "The contact address for the team is going to be, for now, agent@riskmandate.ai".
const contact = 'agent@riskmandate.ai';

// The site's address comes from CNAME, so a domain change needs no edit here.
const origin = existsSync(join(root, 'CNAME')) ? `https://${readFileSync(join(root, 'CNAME'), 'utf8').trim()}` : '';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fail = (m) => { throw new Error(m); };

// Interface texts (data/ui.json) and the sites selection (data/sites.json), both the writer's.
// A missing file or key stops the build with a clear message rather than printing an empty space.
function readJson(rel) {
  const f = join(root, rel);
  if (!existsSync(f)) fail(`${rel} missing (the writer's file): the build needs it`);
  try { return JSON.parse(readFileSync(f, 'utf8')); } catch (e) { fail(`${rel}: not valid JSON (${e.message})`); }
}
const UI_KEYS = ['hero_primary', 'hero_secondary', 'address_caption', 'sites_heading', 'sites_more_label', 'card_hub_label', 'band_text', 'band_button',
  'company_line', 'footer_line', 'share_title', 'share_line', 'nav_labels', 'timeline_heading', 'screenshot_alt'];
const ui = readJson('data/ui.json');
for (const k of UI_KEYS) {
  const v = ui[k];
  if (k === 'nav_labels' ? (typeof v !== 'object' || v === null || Array.isArray(v)) : (typeof v !== 'string' || !v.trim())) fail(`data/ui.json: missing or empty "${k}"`);
}
// "{name}"-style slots in a ui text; a slot with no value is an error, not an empty string.
function fill(text, values, key) {
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in values ? String(values[k]) : fail(`data/ui.json: "${key}" uses {${k}}, which the build does not supply`)));
}
const sitesData = readJson('data/sites.json');
if (!Array.isArray(sitesData.sites)) fail('data/sites.json: no "sites" array');
const cardSites = sitesData.sites.filter((s) => s.role !== 'band');
const hubCount = sitesData.hub_count || {};
if (!Number.isFinite(hubCount.cells) || !hubCount.checked) fail('data/sites.json: hub_count needs "cells" and "checked"');

// Known names in ui texts become links: the writer writes plain words, the build adds the address.
const AUTO_LINKS = [['agenticcells.ai', 'https://agenticcells.ai'], ['behind the scenes', '/behind-the-scenes/'], ['hub.agenticcells.site', HUB]];
function linkify(text) {
  let html = esc(text);
  for (const [words, href] of AUTO_LINKS) {
    const i = html.toLowerCase().indexOf(words.toLowerCase());
    if (i >= 0) html = `${html.slice(0, i)}<a href="${href}">${html.slice(i, i + words.length)}</a>${html.slice(i + words.length)}`;
  }
  return html;
}

function frontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: m[2] };
}

function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdown(body) {
  const lines = body.split('\n');
  const html = [];
  let para = [], list = [], olist = [];
  const flush = () => {
    if (para.length) html.push(`<p>${inline(para.join(' '))}</p>`);
    if (olist.length) html.push(`<ol class="steps">${olist.map((l) => `<li>${inline(l)}</li>`).join('')}</ol>`);
    // A list whose every item starts with a **bold lead** is a set of points: shown as cards (D2).
    if (list.length) html.push(`<ul${list.every((l) => /^\*\*[^*]+\*\*/.test(l)) ? ' class="points"' : ''}>${list.map((l) => `<li>${inline(l)}</li>`).join('')}</ul>`);
    para = []; list = []; olist = [];
  };
  for (const line of lines) {
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) { flush(); html.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`); }
    // A {{name}} line is a placeholder the build fills (round 1); never wrapped in a paragraph.
    else if ((m = line.match(/^\s*\{\{\s*([a-z]+)\s*\}\}\s*$/))) { flush(); html.push(`<!--ph:${m[1]}-->`); }
    else if ((m = line.match(/^[-*]\s+(.*)$/))) { if (para.length || olist.length) flush(); list.push(m[1]); }
    // Numbered steps ("1. ...") become an ordered list (D2).
    else if ((m = line.match(/^\d+\.\s+(.*)$/))) { if (para.length || list.length) flush(); olist.push(m[1]); }
    else if (line.trim() === '') flush();
    else { if (list.length || olist.length) flush(); para.push(line.trim()); }
  }
  flush();
  return html.join('\n');
}

// The site nav (change 2): Home, How it works, Behind the scenes, Hub. Labels from data/ui.json nav_labels
// (keyed by path), so a page title such as "How a site gets here" can keep a short nav label (review 2.1).
// Primary links (in this order); every other nav page goes to the footer "More" group.
const PRIMARY = ['/', '/how-it-works/', '/behind-the-scenes/', HUB];
const EXTERNAL_NAV = [{ url: HUB, title: 'Hub', ext: true }];
const WIDE = new Set(['/', '/how-it-works/', '/behind-the-scenes/']);
const MARK = '<svg class="mark" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" focusable="false"><path d="M17 6.5A10.5 10.5 0 1 0 17 25.5" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" opacity=".45"/><path d="M25 9.5A10.5 10.5 0 1 0 25 22.5" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>';
function navLabel(n) {
  if (ui.nav_labels[n.url]) return ui.nav_labels[n.url];
  if (n.url === '/') return 'Home';
  if (n.ext) return n.title;
  return fail(`data/ui.json: nav_labels has no label for "${n.url}"`);
}
function primaryNav(nav) {
  return PRIMARY.map((u) => nav.find((n) => n.url === u)).filter(Boolean);
}
function navList(items, current) {
  return items.map((n) => `<li><a href="${esc(n.url)}"${n.url === current ? ' aria-current="page"' : ''}>${esc(navLabel(n))}${n.ext ? EXT : ''}</a></li>`).join('');
}
function navHtml(nav, current) {
  if (!nav.length) return '';
  const items = navList(primaryNav(nav), current);
  return `<nav class="wide" aria-label="Site"><ul>${items}</ul></nav><details class="menu"><summary>Menu</summary><nav aria-label="Site (menu)"><ul>${items}</ul></nav></details>`;
}
function moreHtml(nav, current) {
  const rest = nav.filter((n) => !PRIMARY.includes(n.url));
  if (!rest.length) return '';
  return `<nav class="more" aria-label="More"><ul>${navList(rest, current)}</ul></nav>`;
}

// Open Graph image (change 11): made by scripts/share-card.mjs, committed as assets/share.png.
const SHARE = { path: '/assets/share.png', width: 1200, height: 630 };
if (!existsSync(join(root, 'assets', 'share.png'))) fail('assets/share.png missing: run node scripts/share-card.mjs');
const shareAlt = `AgentiCCells: ${ui.share_title}. ${ui.share_line}`;

function page(meta, content, nav = [], current = '') {
  const shareUrl = `${origin || 'https://agenticcells.site'}${SHARE.path}`;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title || '')}</title>
<meta name="description" content="${esc(meta.description || '')}">
<link rel="stylesheet" href="/assets/style.css">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
${current === '/' ? '<link rel="alternate" type="text/markdown" href="/index.md" title="This page as Markdown">\n' : ''}${meta.noindex ? '<meta name="robots" content="noindex">\n' : ''}${origin && !meta.noindex ? `<link rel="canonical" href="${esc(origin + current)}">\n` : ''}<meta property="og:type" content="website">
<meta property="og:site_name" content="AgentiCCells">
<meta property="og:title" content="${esc(meta.title || '')}">
<meta property="og:description" content="${esc(meta.description || '')}">
${origin ? `<meta property="og:url" content="${esc(origin + current)}">\n` : ''}<meta property="og:image" content="${esc(shareUrl)}">
<meta property="og:image:width" content="${SHARE.width}">
<meta property="og:image:height" content="${SHARE.height}">
<meta property="og:image:alt" content="${esc(shareAlt)}">
<meta name="twitter:card" content="summary_large_image">
</head>
<body${WIDE.has(current) ? ' class="wide"' : ''}>
<header><a class="brand" href="/">${MARK}<span>AgentiCCells</span></a>${navHtml(nav, current)}</header>
<main>
${content}
</main>
<footer>${moreHtml(nav, current)}<p>${linkify(ui.footer_line)}</p><p>${linkify(ui.company_line)}</p><p>Contact: <a href="mailto:${contact}">${contact}</a></p><p>For AI tools: <a href="/llms.txt">llms.txt</a> and <a href="/index.md">the home page as Markdown</a>.</p><p>Code under Apache-2.0. Text and images under CC BY 4.0.</p><p class="version">Version ${esc(version)}</p></footer>
</body>
</html>
`;
}

// A site path such as "/", "/console/" or "/console/2026-11-15/" (or "/x.html")
// becomes a file under site/. A path that would leave site/ is refused.
function fileFor(path) {
  if (typeof path !== 'string' || !path.startsWith('/')) throw new Error(`page path must start with "/": ${path}`);
  let f = path.slice(1);
  if (f === '' || f.endsWith('/')) f += 'index.html';
  else if (!f.endsWith('.html')) f += '/index.html';
  if (f.split(/[\\/]/).some((part) => part === '..' || part === '.')) throw new Error(`page path leaves site/: ${path}`);
  return normalize(f);
}
const urlFor = (file) => '/' + file.replace(/(^|\/)index\.html$/, '$1');

// ---- Page layout (round 1, changes 1 and 3 to 10) ----
// A Markdown page is cut at each <h2> into sections. Running text sits in a .prose column (change 1);
// placeholders, cards, diagrams and the band use the full width.
const PH = /<!--ph:([a-z]+)-->/;
const H2 = /^<h2>([\s\S]*?)<\/h2>\n?/;
function chunks(html) {
  const parts = html.split(/(?=<h2>)/);
  return parts.map((p) => p.trim()).filter(Boolean);
}
const prose = (h) => (h.trim() ? `<div class="prose">\n${h.trim()}\n</div>` : '');
function renderPlaceholder(name, page) {
  switch (name) {
    case 'sites': return siteCards({ sites: cardSites, ui, root, fill });
    case 'flow': return flowSvg();
    case 'loop': return loopSvg(root);
    case 'team': return teamCards(root, inline);
    case 'timeline': return timeline(root);
    default: return fail(`${page.source}: unknown placeholder {{${name}}}`);
  }
}
// A section whose heading and intro sit above a placeholder: the heading gets a link at its right (sec-head).
function secHead(chunk, link, fallbackHeading, fallbackIntro) {
  const m = chunk.match(H2);
  const heading = m ? m[1] : esc(fallbackHeading);
  const rest = m ? chunk.slice(m[0].length) : chunk;
  const intro = rest.trim() || (fallbackIntro ? `<p>${esc(fallbackIntro)}</p>` : '');
  return `<div class="sec-head"><h2>${heading}</h2>${link}</div>\n${prose(intro)}`;
}
function layout(p) {
  const isHome = p.path === '/';
  const cs = chunks(p.html);
  const outParts = [];
  for (let i = 0; i < cs.length; i++) {
    let c = cs[i];
    const ph = c.match(PH);
    // Home first screen (change 3): heading, lead, two buttons, and the address picture.
    if (isHome && i === 0 && /^<h1>/.test(c)) {
      const m = c.match(/^(<h1>[\s\S]*?<\/h1>)\n?(<p>[\s\S]*?<\/p>)?([\s\S]*)$/);
      const lead = m[2] ? m[2].replace('<p>', '<p class="lead">') : '';
      outParts.push(`<section class="hero split">
<div class="hero-text">
${m[1]}
${lead}${m[3].trim() ? '\n' + m[3].trim() : ''}
<p class="cta"><a class="button" href="${HUB}">${esc(ui.hero_primary)}${EXT}</a><a class="button ghost" href="/how-it-works/">${esc(ui.hero_secondary)}</a></p>
</div>
<figure class="addr-fig">
${ui.address_first ? `<p class="step">${esc(ui.address_first)}</p>\n` : ''}<p class="url">site-name.agenticcells.site</p>
<svg class="arrow" viewBox="0 0 20 24" aria-hidden="true"><path d="M10 2v18M4 14l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
${ui.address_later ? `<p class="step">${esc(ui.address_later)}</p>\n` : ''}<p class="url later">site-name.example</p>
<figcaption>${esc(ui.address_caption)}</figcaption>
</figure>
</section>`);
      continue;
    }
    if (ph) {
      const name = ph[1];
      const [before, after] = c.split(ph[0]);
      if (after.match(PH)) fail(`${p.source}: put each placeholder in its own section`);
      const body = renderPlaceholder(name, p);
      if (name === 'sites') {
        outParts.push(`<section>\n${secHead(before, `<a href="${HUB}">${esc(ui.sites_more_label)}${EXT}</a>`, ui.sites_heading)}\n${body}\n${prose(after)}\n</section>`);
      } else if (name === 'timeline') {
        outParts.push(`<section class="prose">\n${secHead(before, `<a href="${REPO}/commits/dev">All commits on GitHub</a>`, ui.timeline_heading, ui.timeline_note)}\n${body}\n${after.trim()}\n</section>`);
      } else if (name === 'flow' || name === 'loop') {
        // A diagram sits beside its explanation (changes 8 and 9): the numbered sections that follow it
        // ("## 1. ..."), or else the text above it in its own section.
        const first = i === 0;
        let side = '';
        while (cs[i + 1] && /^<h2>\d/.test(cs[i + 1]) && !PH.test(cs[i + 1])) side += cs[++i] + '\n';
        const m = before.match(H2);
        const h2 = m ? m[0].trim() : '';
        let above = m ? before.slice(m[0].length) : before;
        if (!side) { side = above; above = ''; }
        if (first) above = above.replace(/(<\/h1>\n?)<p>/, '$1<p class="lead">');
        const split = `<div class="split-2">\n${body}\n<div class="prose">\n${side.trim()}\n</div>\n</div>`;
        outParts.push(h2 ? `<section>\n${prose(h2 + '\n' + above)}\n${split}\n${prose(after)}\n</section>` : `${prose(above)}\n${split}\n${prose(after)}`);
      } else {
        outParts.push(`<section>\n${prose(before)}\n${body}\n${prose(after)}\n</section>`);
      }
      continue;
    }
    if (isHome && /<ol class="steps">/.test(c)) {
      // Change 5: the four steps as cards in a row.
      c = c.replace(/<ol class="steps">([\s\S]*?)<\/ol>/, (m, items) => `</div>\n<ol class="flow-steps">${items.replace(/<li><strong>([\s\S]*?)\.?<\/strong>\s*([\s\S]*?)<\/li>/g, '<li><strong>$1</strong><p>$2</p></li>')}</ol>\n<div class="prose">`);
      outParts.push(`<section>\n${prose(c)}\n</section>`.replace(/<div class="prose">\s*<\/div>/g, ''));
      continue;
    }
    if (isHome && i > 0 && c.includes(`href="${HUB}"`)) {
      // Change 6: the hub section becomes the band (heading from the page, text and button from ui.json).
      const m = c.match(H2);
      outParts.push(`<section class="band">
<div><h2>${m ? m[1] : 'The hub'}</h2><p>${esc(ui.band_text)}</p></div>
<a class="button" href="${HUB}">${esc(ui.band_button)}${EXT}</a>
</section>`);
      continue;
    }
    if (isHome && i > 0 && c.includes('href="https://agenticcells.ai"')) {
      // Change 7: one line to the company, under a thin rule.
      const m = c.match(H2);
      outParts.push(`<section class="company prose">\n${m ? m[0] : ''}<p>${linkify(ui.company_line)}</p>\n</section>`);
      continue;
    }
    // Plain text. The first paragraph under the h1 of a wide page is its lead.
    if (i === 0 && WIDE.has(p.path)) c = c.replace(/(<\/h1>\n?)<p>/, '$1<p class="lead">');
    outParts.push(i === 0 ? prose(c) : `<section class="prose">\n${c}\n</section>`);
  }
  return outParts.join('\n');
}

// site/ is cleared first, so page hooks may also write their own files under ctx.out.
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'assets'), { recursive: true });

// Pages from content/*.md.
const pages = [];
for (const f of readdirSync(join(root, 'content')).filter((f) => f.endsWith('.md')).sort()) {
  const src = readFileSync(join(root, 'content', f), 'utf8');
  const { meta, body } = frontMatter(src);
  const path = f === 'index.md' ? '/' : `/${f.replace(/\.md$/, '')}/`;
  pages.push({ path, title: meta.title, description: meta.description, nav: meta.nav, html: markdown(body), body, source: `content/${f}` });
}

// Page hooks: build/pages/*.mjs, each `export default async function (ctx)` returning
// [{ path, title, description, html, nav? }]. `path` is a site path such as "/console/";
// `html` is the inside of <main>. Each page gets the same template, nav and footer.
// ctx.out is site/, already cleared; a hook may also return extra files through ctx.files.
// (Helpers in build/pages/helpers/ are not hooks; folders named lib/ or parts/ would be ignored by .gitignore.)
const hookDir = join(root, 'build', 'pages');
const ctx = { root, out, version, contact, esc, inline, markdown, frontMatter, pages: pages.map(({ path, title }) => ({ path, title })), files: [] };
if (existsSync(hookDir)) {
  for (const f of readdirSync(hookDir).filter((f) => f.endsWith('.mjs')).sort()) {
    const mod = await import(pathToFileURL(join(hookDir, f)).href);
    if (typeof mod.default !== 'function') throw new Error(`build/pages/${f}: no default export function`);
    const got = await mod.default(ctx);
    if (!Array.isArray(got)) throw new Error(`build/pages/${f}: must return an array of pages`);
    for (const p of got) {
      for (const k of ['path', 'title', 'description', 'html']) {
        if (typeof p?.[k] !== 'string') throw new Error(`build/pages/${f}: page ${p?.path ?? '?'} has no ${k}`);
      }
      pages.push({ ...p, source: `build/pages/${f}` });
    }
  }
}

const seen = new Map();
for (const p of pages) {
  p.file = fileFor(p.path);
  if (seen.has(p.file)) throw new Error(`${p.source} and ${seen.get(p.file)} both write ${p.path}`);
  seen.set(p.file, p.source);
}
const nav = pages
  .filter((p) => p.nav !== undefined && p.nav !== '' && Number.isFinite(Number(p.nav)))
  .sort((a, b) => Number(a.nav) - Number(b.nav) || String(a.title).localeCompare(String(b.title)))
  .map((p) => ({ url: urlFor(p.file), title: p.title }));
nav.push(...EXTERNAL_NAV);

for (const p of pages) if (p.source.startsWith('content/')) p.html = layout(p);

// 404 page (GitHub Pages serves site/404.html for unknown paths). Not indexed, not in the nav.
if (!seen.has('404.html')) pages.push({
  path: '/404.html', file: '404.html', title: 'Page not found', noindex: true, source: 'build/build.mjs (404)',
  description: 'This page does not exist. Use the menu or go back to the home page.',
  html: '<h1>Page not found</h1>\n<p>There is nothing at this address. Try the menu above, or go to the <a href="/">home page</a>.</p>',
});

// A placeholder left unreplaced fails the build (contract with the writer).
for (const p of pages) {
  const left = p.html.match(/\{\{[^}]*\}\}|<!--ph:[a-z]+-->/);
  if (left) fail(`${p.source}: placeholder ${left[0]} left unreplaced`);
}

for (const p of pages) {
  mkdirSync(dirname(join(out, p.file)), { recursive: true });
  writeFileSync(join(out, p.file), page(p, p.html, nav, urlFor(p.file)));
}
// assets/ is copied whole, folders included (assets/sites/ holds the card screenshots).
function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const f of readdirSync(from)) {
    const s = join(from, f);
    if (statSync(s).isDirectory()) copyDir(s, join(to, f)); else copyFileSync(s, join(to, f));
  }
}
copyDir(join(root, 'assets'), join(out, 'assets'));
if (existsSync(join(root, 'CNAME'))) copyFileSync(join(root, 'CNAME'), join(out, 'CNAME'));
// Extra files from page hooks (ctx.files: [{ path, content }], path under site/), written after site/ is cleared.
for (const { path, content } of ctx.files) {
  const file = normalize(String(path).replace(/^\/+/, ''));
  if (file.split(/[\\/]/).some((part) => part === '..' || part === '.')) throw new Error(`hook file leaves site/: ${path}`);
  mkdirSync(dirname(join(out, file)), { recursive: true });
  writeFileSync(join(out, file), content);
}

// ---- For AI tools (brief item: llms.txt and index.md) ----
// /index.md: the home page as Markdown, with {{sites}} written out as a list.
const site0 = origin || 'https://agenticcells.site';
const sitesMd = cardSites.map((s) => `- [${s.name}](${s.live}): ${s.what} Version ${s.version}, checked ${britishDate(s.checked)}. On the hub: ${HUB}/cells/${s.id}/`).join('\n');
function mdPage(p, fills) {
  const md = p.body.replace(/^[ \t]*\{\{[ \t]*([a-z]+)[ \t]*\}\}[ \t]*$/gm, (m, k) => (k in fills ? fills[k] : fail(`${p.source}: {{${k}}} has no Markdown form`)));
  return md.replace(/\]\(\//g, `](${site0}/`);
}
const home = pages.find((p) => p.path === '/');
writeFileSync(join(out, 'index.md'), `${mdPage(home, { sites: sitesMd }).trim()}\n`);
// /llms.txt (llmstxt.org shape): what the site is, its pages, the sites selection, links.
const lead = (home.body.split('\n').find((l) => l.trim() && !/^[#{]/.test(l)) || '').trim();
const contentPages = pages.filter((p) => p.source.startsWith('content/')).sort((a, b) => Number(a.nav) - Number(b.nav));
writeFileSync(join(out, 'llms.txt'), `# agenticcells.site

> ${home.description}

${lead.replace(/`/g, '')}

## Pages

${contentPages.map((p) => `- [${navLabel({ url: p.path, title: p.title })}](${site0}${p.path}): ${p.description}`).join('\n')}
- [The home page as Markdown](${site0}/index.md)

## Some of the sites

A selection, with the version each site reported when last checked (from data/sites.json).

${sitesMd}

The hub lists more: ${HUB} (${hubCount.cells} cells on ${britishDate(hubCount.checked)}).

## Links

- [The hub](${HUB}): the cells AgentiCCells has made and agreed to show
- [agenticcells.ai](https://agenticcells.ai): the company and what it offers
- [The site factory](https://github.com/AgentiCCells/AgentiCCells__Site__Factory): how a site gets here
- [This site's repository](${REPO}) and [REALITY.md](${REPO}/blob/dev/REALITY.md), which says what is true today
- Contact: ${contact}
`);

// robots.txt and sitemap.xml (every indexable page; no dates, since the build holds none that are true).
const indexable = pages.filter((p) => !p.noindex).map((p) => urlFor(p.file)).sort();
if (origin) {
  writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((u) => `<url><loc>${esc(origin + u)}</loc></url>`).join('\n')}\n</urlset>\n`);
  writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
}
writeFileSync(join(out, 'version.json'), JSON.stringify({ version }) + '\n');
console.log(`built site/ (${version}, ${pages.length} pages)`);
