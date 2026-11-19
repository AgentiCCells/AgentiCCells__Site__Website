// Renderers for the {{...}} placeholders in content/*.md (round 1, changes 4 and 8 to 10).
// Helpers only: build/build.mjs imports this file; it is not a page hook (hooks are the .mjs files
// directly in build/pages/). Node built-ins only. developer.agenticcells-site@AgentiCCells.dinis, 2026-11-19.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

export const REPO = 'https://github.com/AgentiCCells/AgentiCCells__Site__Website';
export const HUB = 'https://hub.agenticcells.site';

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The small "leaves this site" arrow (change 2). Decorative: hidden from screen readers.
export const EXT = '<span class="ext" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M3 9L9 3M4.5 3H9v4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// "2026-11-19T01:34:13Z" or "2026-11-19" -> "19 November 2026" (UTC; British order, as the copy writes dates).
export function britishDate(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) throw new Error(`not an ISO date: ${JSON.stringify(iso)}`);
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

// Change 4: the site cards. Data from data/sites.json (no fetch at build time: review F2);
// screenshot dates from assets/sites/shots.json, written by scripts/shots.mjs.
export function siteCards({ sites, ui, root, fill }) {
  const shotsFile = join(root, 'assets', 'sites', 'shots.json');
  const shots = existsSync(shotsFile) ? JSON.parse(readFileSync(shotsFile, 'utf8')) : {};
  const items = sites.map((s) => {
    for (const k of ['id', 'name', 'what', 'live', 'version', 'checked']) {
      if (typeof s[k] !== 'string' || !s[k].trim()) throw new Error(`data/sites.json: site ${s.id ?? '?'} has no "${k}"`);
    }
    if (!/^[a-z0-9-]+$/.test(s.id)) throw new Error(`data/sites.json: site id "${s.id}" must be lowercase letters, digits and hyphens`);
    const img = join(root, 'assets', 'sites', `${s.id}.jpg`);
    if (!existsSync(img)) throw new Error(`assets/sites/${s.id}.jpg missing: run node scripts/shots.mjs`);
    const taken = shots[s.id]?.taken;
    if (!taken) throw new Error(`assets/sites/shots.json has no "taken" date for ${s.id}: run node scripts/shots.mjs`);
    const alt = fill(ui.screenshot_alt, { name: s.name, date: britishDate(taken) }, 'screenshot_alt');
    const host = s.live.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const hubUrl = `${HUB}/cells/${encodeURIComponent(s.id)}/`;
    // The hub link's accessible name carries the site name (review 4.5).
    const hubLabel = ui.card_hub_label.includes('{name}')
      ? esc(fill(ui.card_hub_label, { name: s.name }, 'card_hub_label'))
      : `${esc(ui.card_hub_label)}<span class="vh">: ${esc(s.name)}</span>`;
    return `<li><article class="site-card">
<img class="shot" src="/assets/sites/${esc(s.id)}.jpg" width="1366" height="800" loading="lazy" alt="${esc(alt)}">
<div class="body">
<h3><a href="${esc(s.live)}">${esc(s.name)}</a></h3>
<p class="what">${esc(s.what)}</p>
<p class="where">${esc(host)}</p>
<p class="ver"><span class="v">${esc(s.version)}</span><span>checked <time datetime="${esc(s.checked)}">${britishDate(s.checked)}</time></span><a class="hub" href="${esc(hubUrl)}">${hubLabel}</a></p>
</div></article></li>`;
  });
  return `<ul class="site-grid">\n${items.join('\n')}\n</ul>`;
}

// Change 8: the site factory as a vertical diagram. Order from the factory's requests/README.md and
// every status.json (review 5.2 and 8.1): repository, seed, settings (Pages), DNS, domain, deploy, HTTPS.
// The "its own domain later" pill is left out: no source (review 8.2).
export function flowSvg() {
  const chips = ['Repository', 'Seed from the template', 'Pages settings', 'DNS record', 'Domain on Pages', 'Deploy', 'HTTPS'];
  const box = (y, h, n, meta, title, lines) => `<circle class="dg-dot" cx="20" cy="${y + 28}" r="13"/><text class="dg-num" x="20" y="${y + 33}" text-anchor="middle">${n}</text>
<rect class="dg-box" x="44" y="${y}" width="290" height="${h}" rx="6"/>
<text class="dg-m" x="58" y="${y + 22}">${esc(meta)}</text>
<text class="dg-t" x="58" y="${y + 44}">${esc(title)}</text>
${lines.map((l, i) => `<text class="dg-s" x="58" y="${y + 64 + i * 17}">${esc(l)}</text>`).join('\n')}`;
  const c0 = 344, step = 42;
  const chipSvg = chips.map((c, i) => {
    const y = c0 + i * step;
    const arrow = i < chips.length - 1 ? `\n<path class="dg-line" d="M90 ${y + 30}v10" marker-end="url(#fx-a)"/>` : '';
    return `<rect class="dg-chip" x="58" y="${y}" width="262" height="30" rx="15"/><text class="dg-c" x="72" y="${y + 20}">${String.fromCharCode(97 + i)}</text><text class="dg-c" x="90" y="${y + 20}">${esc(c)}</text>${arrow}`;
  }).join('\n');
  const applyEnd = c0 + (chips.length - 1) * step + 30; // 626
  const y4 = applyEnd + 52;
  const live = y4 + 124;
  const desc = '1, request: a folder with site.json and brief.md is committed in a pull request to the site factory. '
    + '2, plan: the factory is built to post on the pull request what it would create. The pull request is merged. '
    + '3, apply: on merge the factory works through, in order, the repository, the seed from the site template, the GitHub Pages settings, the DNS record, the domain on Pages, the deploy and HTTPS, and writes status.json back to the request. '
    + '4, a conductor and a team of agents build the site in rounds. The site is then live on its subdomain of agenticcells.site.';
  return `<figure class="fig"><svg viewBox="0 0 340 ${live + 70}" role="img" aria-labelledby="fx-t fx-d">
<title id="fx-t">How a site gets here</title>
<desc id="fx-d">${esc(desc)}</desc>
<defs><marker id="fx-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0 0L10 5L0 10z"/></marker></defs>
<line class="dg-spine" x1="20" y1="40" x2="20" y2="${live + 22}"/>
${box(12, 88, 1, 'in a pull request', 'Request', ['site.json and brief.md, in a', 'folder under requests/'])}
${box(122, 88, 2, 'on the pull request', 'Plan', ['built to post what the factory', 'would create; creates nothing'])}
<rect class="dg-key" x="9" y="239" width="22" height="22" rx="3" transform="rotate(45 20 250)"/>
<text class="dg-t" x="44" y="256">Merge</text>
<text class="dg-m" x="110" y="256">the request is accepted</text>
${box(284, applyEnd - 284 + 34, 3, 'on merge, in this order', 'Apply', [])}
${chipSvg}
<text class="dg-m" x="58" y="${applyEnd + 22}">status.json is written back to the request</text>
${box(y4, 104, 4, 'then, for each site', 'Conductor and team', ['a conductor runs a designer, a', 'developer, a writer and a reviewer'])}
<g aria-hidden="true">${[0, 1, 2, 3, 4].map((i) => `<circle class="dg-dot" cx="${240 + i * 18}" cy="${y4 + 40}" r="6" opacity="${i ? 0.55 : 1}"/>`).join('')}</g>
<rect class="dg-fill" x="44" y="${live}" width="290" height="44" rx="22"/>
<circle cx="20" cy="${live + 22}" r="7" class="dg-dot"/>
<text class="dg-on" x="189" y="${live + 27}" text-anchor="middle">site-name.agenticcells.site</text>
<text class="dg-m" x="189" y="${live + 64}" text-anchor="middle">live on its subdomain</text>
</svg><figcaption>The site factory, from request to live site.</figcaption></figure>`;
}

// Change 9: the round loop, read from the eight numbered steps of team/WORKFLOW.md.
const ROLES = ['conductor', 'designer', 'writer', 'reviewer', 'developer'];
export function loopSteps(root) {
  const src = readFileSync(join(root, 'team', 'WORKFLOW.md'), 'utf8');
  const sec = src.split(/^## /m).find((s) => s.startsWith('The loop'));
  if (!sec) throw new Error('team/WORKFLOW.md: no "## The loop" section');
  const steps = [...sec.matchAll(/^(\d+)\.\s+\*\*([^*]+?)\.?\*\*\s*(.*)$/gm)].map((m) => {
    const who = ROLES.map((r) => [r, m[3].toLowerCase().indexOf(r)]).filter(([, i]) => i >= 0).sort((a, b) => a[1] - b[1])[0];
    if (!who) throw new Error(`team/WORKFLOW.md: step ${m[1]} names no role`);
    return { n: Number(m[1]), name: m[2].trim(), who: who[0] };
  });
  if (steps.length !== 8) throw new Error(`team/WORKFLOW.md: expected 8 loop steps, found ${steps.length}`);
  return steps;
}
export function loopSvg(root) {
  const steps = loopSteps(root);
  const y = (i) => 34 + i * 72;
  const desc = `Eight steps: ${steps.map((s) => `${s.n} ${s.name.toLowerCase()}, by the ${s.who}`).join('; ')}. A failure at step 7 goes back to step 5; after step 8 the next round starts at step 1.`;
  return `<figure class="fig"><svg viewBox="0 0 340 582" role="img" aria-labelledby="lp-t lp-d">
<title id="lp-t">One round</title>
<desc id="lp-d">${esc(desc)}</desc>
<defs><marker id="lp-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0 0L10 5L0 10z"/></marker></defs>
<line class="dg-spine" x1="30" y1="34" x2="30" y2="538"/>
${steps.map((s, i) => `<circle class="dg-dot" cx="30" cy="${y(i)}" r="13"/><text class="dg-num" x="30" y="${y(i) + 5}" text-anchor="middle">${s.n}</text><text class="dg-t" x="56" y="${y(i) - 2}">${esc(s.name)}</text><text class="dg-m" x="56" y="${y(i) + 16}">${esc(s.who)}</text>`).join('\n')}
<path class="dg-line" d="M250 466 C 292 466 292 322 254 322" marker-end="url(#lp-a)"/>
<text class="dg-m" x="276" y="398" text-anchor="end">fails: back to 5</text>
<path class="dg-line" d="M224 538 H 328 V 34 H 256" marker-end="url(#lp-a)"/>
<text class="dg-m" x="320" y="568" text-anchor="end">next round</text>
</svg><figcaption>One round, from brief to report (team/WORKFLOW.md).</figcaption></figure>`;
}

// Change 9: the five role cards, from team/<role>/ROLE.md (objective) and team/scopes.json (may change).
const BADGE = { conductor: 'C', designer: 'D', writer: 'W', reviewer: 'R', developer: 'Dv' };
function scopeWords(globs) {
  if (globs.includes('**')) return 'any file';
  return globs.map((g) => `<code>${esc(g.replace(/\/\*\*$/, '/').replace(/\/\*\//g, '/N/'))}</code>`).join(', ');
}
export function teamCards(root, inline) {
  const scopes = JSON.parse(readFileSync(join(root, 'team', 'scopes.json'), 'utf8'));
  const suffix = `${scopes.suffix}@${scopes.team}`; // ".agenticcells-site@AgentiCCells.dinis"
  return `<ul class="role-grid">\n${ROLES.map((r) => {
    const f = join(root, 'team', r, 'ROLE.md');
    if (!existsSync(f)) throw new Error(`team/${r}/ROLE.md missing`);
    const obj = readFileSync(f, 'utf8').match(/^\*\*Objective\.\*\*\s*(.+)$/m);
    if (!obj) throw new Error(`team/${r}/ROLE.md: no **Objective.** line`);
    const globs = scopes.roles?.[r];
    if (!Array.isArray(globs)) throw new Error(`team/scopes.json: no scope for ${r}`);
    const title = r[0].toUpperCase() + r.slice(1);
    return `<li><h3><span class="badge" aria-hidden="true">${BADGE[r]}</span>${title}</h3>
<p class="agent"><code>${esc(r + suffix)}</code></p>
<p>${inline(obj[1].trim())}</p>
<p class="may">May change: ${scopeWords(globs)}</p>
<a href="${REPO}/blob/dev/team/${r}/ROLE.md">Read the ${r}'s role</a></li>`;
  }).join('\n')}\n</ul>`;
}

// Change 10: the commit timeline from git log (latest 50, UTC days, newest first, subject line only).
// Short hashes only: the validator refuses any 40-character hex in site/ (review 10.1).
export function commits(root, limit = 50) {
  let out;
  try {
    out = execFileSync('git', ['log', `-n${limit}`, '--date=format-local:%Y-%m-%d', '--format=%h%x1f%ad%x1f%s%x1f%(trailers:key=Agent,valueonly,separator=%x2c)%x1e', '--abbrev=7'], { cwd: root, env: { ...process.env, TZ: 'UTC' } }).toString();
  } catch (e) {
    throw new Error(`git log failed (the timeline needs the repository's history): ${e.message.split('\n')[0]}`);
  }
  return out.split('\x1e').map((r) => r.replace(/^\n/, '')).filter(Boolean).map((r) => {
    const [hash, day, subject, agent] = r.split('\x1f');
    return { short: hash.slice(0, 7), day, subject, agent: (agent || '').trim() };
  });
}
export function timeline(root) {
  const list = commits(root);
  if (!list.length) throw new Error('git log returned no commits');
  const days = [];
  for (const c of list) {
    if (!days.length || days.at(-1).day !== c.day) days.push({ day: c.day, items: [] });
    days.at(-1).items.push(c);
  }
  const pill = (a) => {
    if (!a) return '<span class="who none">no Agent: trailer</span>';
    const m = a.match(/^([a-z]+)\.agenticcells-site@AgentiCCells\.dinis$/);
    return `<span class="who">${esc(m ? m[1] : a)}</span>`;
  };
  return `<ol class="timeline">\n${days.map((d) => `<li><h3><time datetime="${d.day}">${britishDate(d.day)}</time></h3><ul>${d.items.map((c) => `<li class="commit"><p class="msg">${esc(c.subject)}</p><p class="meta">${pill(c.agent)}<a class="sha" href="${REPO}/commit/${c.short}"><span class="vh">Commit </span>${c.short}</a></p></li>`).join('')}</ul></li>`).join('\n')}\n</ol>`;
}
