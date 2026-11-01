// Browser smoke test: serve the repo, open the app, and click through every quest in admin mode.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer(async (req, res) => {
  try {
    let path = normalize(new URL(req.url, 'http://x').pathname).replace(/^(\.\.[/\\])+/, '');
    if (path === '/') path = '/index.html';
    const body = await readFile(join(ROOT, path));
    res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end('not found'); }
});
await new Promise((r) => server.listen(0, r));
const url = `http://localhost:${server.address().port}/`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
page.on('requestfailed', (r) => errors.push(`request failed: ${r.url()}`));

let failed = false;
const check = (ok, msg) => { if (!ok) { failed = true; console.error('FAIL', msg); } };

try {
  await page.goto(url);
  await page.click('#noMicBtn'); // no-mic mode: every step can be self-checked
  await page.click('nav button[data-tab="settings"]');
  await page.check('#adminOn'); // admin mode: all levels unlocked, ⏭ skips a step, nothing is saved
  await page.click('nav button[data-tab="learn"]');

  const ids = await page.$$eval('.quest[data-q]', (els) => els.map((e) => e.dataset.q));
  check(ids.length >= 70, `expected 70+ quests on the map, got ${ids.length}`);
  for (const id of ['0.1', '3b.1', 'B3b', '4.10', '6.8', 'B6']) check(ids.includes(id), `quest ${id} missing from the map`);
  check((await page.$$eval('.card.world h3', (h) => h.map((x) => x.textContent))).some((t) => t.includes('World 3b')), 'World 3b card missing');

  for (const id of ids) {
    await page.click(`.quest[data-q="${id}"]`);
    let skips = 0;
    while (await page.isVisible('#adminSkip') && skips++ < 40) await page.click('#adminSkip');
    check(await page.isVisible('#lessonDone'), `quest ${id} did not reach its finish screen`);
    await page.click('#doneMap');
  }
  check(errors.length === 0, `browser errors:\n${errors.join('\n')}`);
  console.log(failed ? 'smoke test FAILED' : `smoke test passed (${ids.length} quests clicked through)`);
} finally {
  await browser.close();
  server.close();
}
process.exit(failed ? 1 : 0);
