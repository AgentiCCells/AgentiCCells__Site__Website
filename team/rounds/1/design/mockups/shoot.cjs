const { chromium } = require('playwright');
const path = require('path');
const dir = __dirname; // run: node team/rounds/1/design/mockups/shoot.cjs
(async () => {
  const b = await chromium.launch();
  const report = [];
  for (const name of ['home', 'how-it-works', 'behind-the-scenes']) {
    for (const w of [390, 1366]) {
      for (const scheme of (name === 'home' && w === 390) ? ['light', 'dark'] : ['light']) {
        const p = await b.newPage({ viewport: { width: w, height: w === 390 ? 844 : 800 }, deviceScaleFactor: 1, colorScheme: scheme });
        await p.goto('file://' + path.join(dir, name + '.html'));
        const info = await p.evaluate(() => {
          const sw = document.documentElement.scrollWidth;
          const small = [];
          for (const a of document.querySelectorAll('main a, header a, summary')) {
            const r = a.getBoundingClientRect();
            if (r.width && r.height < 44 && getComputedStyle(a).display !== 'none' && a.offsetParent) small.push(a.textContent.trim().slice(0, 40) + ' ' + Math.round(r.height));
          }
          return { sw, small };
        });
        report.push(`${name} ${w} ${scheme}: scrollWidth ${info.sw}; under 44px: ${info.small.join(' | ') || 'none'}`);
        const out = path.join(dir, `${name}-${w}${scheme === 'dark' ? '-dark' : ''}.jpg`);
        await p.screenshot({ path: out, fullPage: true, type: 'jpeg', quality: 70 });
        await p.close();
      }
    }
  }
  const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.join(dir, 'share-card.html'));
  await p.screenshot({ path: path.join(dir, 'share-card.png'), type: 'png' });
  await b.close();
  console.log(report.join('\n'));
})().catch((e) => { console.error(e); process.exit(1); });
