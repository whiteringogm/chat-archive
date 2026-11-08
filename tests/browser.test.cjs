// All Notion/media responses below are synthetic. Never use a real token here.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { gunzipSync } = require('node:zlib');
const root = path.resolve(__dirname, '..');
const uid = n => n.toString(16).padStart(32, '0');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aH0kAAAAASUVORK5CYII=', 'base64');
const list = (results, next_cursor = null) => ({ results, has_more: Boolean(next_cursor), next_cursor });
const pageObject = (n, title) => ({ object: 'page', id: uid(n), properties: { title: { type: 'title', title: [{ plain_text: title }] } }, created_time: `2026-01-0${n}T00:00:00Z` });
const block = (n, external = false, expired = false) => ({ id: uid(n), type: 'image', created_time: `2026-01-0${n - 10}T00:00:00Z`, image: { type: external ? 'external' : 'file', [external ? 'external' : 'file']: { url: `https://images.example.invalid/${n}.png`, expiry_time: expired ? '2020-01-01T00:00:00Z' : '2099-01-01T00:00:00Z' } } });
let server, base, browser;
before(async () => {
  await fs.mkdir(path.join(root, 'test-results'), { recursive: true });
  server = http.createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname.replace(/^\/chat-archive\//, '') || 'index.html';
    const filename = path.resolve(root, relative);
    if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    try {
      const body = await fs.readFile(filename);
      const type = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' }[path.extname(filename)] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/chat-archive/`;
  browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_BINARY ? { executablePath: process.env.PLAYWRIGHT_BINARY } : process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
});
after(async () => { await browser?.close(); if (server) await new Promise(resolve => server.close(resolve)); });

async function fixture(options = {}) {
  // Playwright routing cannot intercept requests owned by a Service Worker.
  // Worker caching is exercised separately below and in service-worker.test.cjs.
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: options.viewport || { width: 1280, height: 900 } });
  const page = await context.newPage(), requests = [], errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await context.route('https://**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    requests.push({ url: url.href, headers: request.headers(), method: request.method() });
    if (url.hostname === 'images.example.invalid') {
      await route.fulfill({ status: 200, headers: { 'Content-Type': 'image/png', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' }, body: png }); return;
    }
    assert.equal(url.hostname, 'api.notion.com', 'Unexpected outbound destination');
    assert.equal(request.headers()['authorization'], 'Bearer fixture-token');
    let data, status = options.status || 200;
    const p = url.pathname.slice(4), body = request.postDataJSON() || {};
    if (options.hold && p === 'search') await options.hold;
    if (status !== 200) data = { message: 'DO-NOT-DISPLAY-RAW-API-TEXT' };
    else if (p === 'search' && options.grouped) data = list([
      { ...pageObject(1, '空の記録 <img src=x onerror=alert(1)>'), parent: { type: 'page_id', page_id: uid(91) } },
      { ...pageObject(2, '庭の記録'), parent: { type: 'page_id', page_id: uid(92) } },
      { ...pageObject(91, 'ペルソナA'), parent: { type: 'page_id', page_id: uid(90) } },
      { ...pageObject(92, 'ペルソナB'), parent: { type: 'page_id', page_id: uid(90) } },
      { ...pageObject(90, '画像置き場'), parent: { type: 'workspace', workspace: true } },
    ]);
    else if (p === 'search' && options.classified) {
      const a = pageObject(1, '空の記録'), b = pageObject(2, '庭の記録');
      a.properties['ペルソナ'] = { type: 'select', select: { name: 'Persona A' } };
      b.properties['ペルソナ'] = { type: 'select', select: { name: 'Persona B' } };
      a.properties['タグ'] = { type: 'multi_select', multi_select: [{ name: '共通' }, { name: '<img src=x onerror=alert(1)>' }] };
      b.properties['タグ'] = { type: 'multi_select', multi_select: [] };
      data = list([a, b]);
    }
    else if (p === 'search') data = body.start_cursor ? list([pageObject(2, '庭の記録')]) : list([pageObject(1, '空の記録 <img src=x onerror=alert(1)>')], 'next-page');
    else if (options.grouped && [90,91,92].some(n => p === `blocks/${uid(n)}/children`)) data = list([]);
    else if (p === `blocks/${uid(1)}/children`) data = list([block(11, false, true), { id: uid(20), type: 'toggle', has_children: true }]);
    else if (p === `blocks/${uid(20)}/children`) data = list([block(12)]);
    else if (p === `blocks/${uid(2)}/children`) data = list([block(13, true)]);
    else if (p === `blocks/${uid(11)}`) data = block(11, Boolean(options.refreshToExternal));
    else if (p === `blocks/${uid(12)}`) data = block(12);
    else if (p === `blocks/${uid(13)}`) data = block(13, true);
    else throw new Error(`Unexpected fixture API route: ${p}`);
    await route.fulfill({ status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(data) });
  });
  await page.goto(base + 'notion-images.html');
  return { context, page, requests, errors };
}
async function connect(page) {
  await page.locator('#ni-token').fill('fixture-token');
  await page.locator('#ni-connect').click();
}
async function completed(page) {
  await page.waitForFunction(() => document.querySelector('#ni-stop').disabled);
  assert.match(await page.locator('#ni-status').textContent(), /収集が完了/);
}
async function noSensitiveStorage(page) {
  const saved = await page.evaluate(async () => ({
    local: { ...localStorage }, session: { ...sessionStorage }, db: await indexedDB.databases(),
    caches: (await Promise.all((await caches.keys()).map(async key => (await (await caches.open(key)).keys()).map(req => req.url)))).flat(),
  }));
  assert.deepEqual(saved.local, {}); assert.deepEqual(saved.session, {}); assert.equal(saved.db.length, 0);
  assert.ok(saved.caches.every(url => url.startsWith(base) && !url.includes('fixture-token')));
}

test('Pages subpath: empty state, mocked collection, XSS safety, filtering, modal, refresh, external images and disconnect', async t => {
  const { context, page, requests, errors } = await fixture(); t.after(() => context.close());
  assert.equal(await page.locator('#ni-token').getAttribute('type'), 'password');
  await page.locator('#ni-connect').click();
  assert.match(await page.locator('#ni-status').textContent(), /トークン/);
  assert.equal(requests.length, 0);
  await connect(page); await completed(page);
  assert.equal(await page.locator('#ni-token').inputValue(), '');
  assert.equal(await page.locator('.ni-card').count(), 3);
  assert.equal(await page.locator('.ni-card h3 img').count(), 0);
  assert.match(await page.locator('#ni-grid').textContent(), /<img src=x onerror=alert\(1\)>/);
  await page.locator('#ni-grid').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelectorAll('.ni-card img[src^="blob:"]').length === 2);
  assert.ok(requests.some(r => r.url.includes(`/blocks/${uid(11)}`) && !r.url.includes('children')));
  assert.ok(!requests.some(r => r.url === 'https://images.example.invalid/13.png'));
  await page.locator('#ni-filter').fill('空の記録');
  await page.waitForFunction(() => document.querySelectorAll('.ni-card').length === 2);
  await page.locator('#ni-sort').selectOption('oldest');
  await page.waitForFunction(() => document.querySelector('.ni-thumbnail')?.getAttribute('aria-label').includes('11.png'));
  await page.locator('.ni-thumbnail').first().click();
  await page.waitForFunction(() => !document.querySelector('#ni-full-image').hidden);
  assert.equal(await page.locator('#ni-dialog-title').textContent(), '11.png');
  assert.equal(await page.locator('#ni-open-page').getAttribute('target'), '_blank');
  assert.match(await page.locator('#ni-open-page').getAttribute('rel'), /noreferrer/);
  assert.equal(await page.locator('#ni-download').getAttribute('download'), '11.png');
  await page.locator('#ni-refresh-image').click();
  await page.waitForFunction(() => document.querySelector('#ni-dialog-status').textContent === '');
  await page.keyboard.press('Escape');
  await page.locator('#ni-filter').fill('');
  await page.locator('#ni-external').check();
  await page.locator('#ni-grid').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelectorAll('.ni-card img[src^="blob:"]').length === 3);
  assert.ok(requests.filter(r => r.url.startsWith('https://images.example.invalid/')).every(r => !r.headers.authorization && !r.headers.cookie && !r.headers.referer));
  await noSensitiveStorage(page);
  await fs.mkdir(path.join(root, 'test-results'), { recursive: true });
  await page.screenshot({ path: path.join(root, 'test-results', 'notion-desktop.png'), fullPage: true });
  await page.locator('#ni-disconnect').click();
  assert.equal(await page.locator('.ni-card').count(), 0);
  assert.equal(await page.locator('[src^="blob:"]').count(), 0);
  assert.equal(await page.locator('#ni-full-image').getAttribute('alt'), '');
  assert.equal(await page.locator('#ni-connect').isEnabled(), true);
  assert.ok(!(await page.locator('body').textContent()).includes('庭の記録'));
  await noSensitiveStorage(page);
  await page.reload(); assert.equal(await page.locator('.ni-card').count(), 0);
  assert.deepEqual(errors, []);
});

test('mobile widths, dark theme and list rebuild stay operable', async t => {
  const { context, page, errors } = await fixture({ viewport: { width: 375, height: 812 } }); t.after(() => context.close());
  await connect(page); await completed(page);
  await page.locator('#ni-theme').selectOption('dark');
  await page.locator('#ni-size').selectOption('small');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.locator('.ni-thumbnail').first().click();
  assert.equal(await page.locator('#ni-dialog').isVisible(), true);
  await page.locator('#ni-close').click();
  await page.setViewportSize({ width: 320, height: 700 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: path.join(root, 'test-results', 'notion-mobile.png'), fullPage: true });
  await page.locator('#ni-clear').click();
  assert.equal(await page.locator('.ni-card').count(), 0);
  assert.equal(await page.locator('#ni-rescan').isEnabled(), true);
  await page.locator('#ni-rescan').click(); await completed(page);
  assert.equal(await page.locator('.ni-card').count(), 3);
  assert.deepEqual(errors, []);
});

test('persona buttons filter descendants without collecting again and are erased on disconnect', async t => {
  const { context, page, requests, errors } = await fixture({ grouped: true, viewport: { width: 375, height: 812 } }); t.after(() => context.close());
  await connect(page); await completed(page);
  assert.equal(await page.locator('#ni-group-parent').inputValue(), uid(90));
  assert.equal(await page.locator('#ni-groups button').count(), 3);
  const searches = () => requests.filter(request => request.url.endsWith('/search')).length;
  const before = searches();
  await page.getByRole('button', { name: 'ペルソナA（2枚）', exact: true }).click();
  assert.equal(await page.locator('.ni-card').count(), 2);
  assert.ok(!(await page.locator('#ni-grid').textContent()).includes('庭の記録'));
  await page.getByRole('button', { name: 'ペルソナB（1枚）', exact: true }).click();
  assert.equal(await page.locator('.ni-card').count(), 1);
  assert.equal(await page.locator('#ni-groups button[aria-pressed="true"]').textContent(), 'ペルソナB（1枚）');
  await page.locator('#ni-filter').fill('空');
  await page.waitForFunction(() => document.querySelectorAll('.ni-card').length === 0);
  await page.locator('#ni-filter').fill('');
  await page.getByRole('button', { name: 'すべて（3枚）', exact: true }).click();
  assert.equal(await page.locator('.ni-card').count(), 3);
  assert.equal(searches(), before);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.locator('#ni-group-parent').selectOption(uid(91));
  assert.equal(await page.locator('.ni-card').count(), 2);
  await page.screenshot({ path: path.join(root, 'test-results', 'notion-personas-mobile.png'), fullPage: true });
  await page.locator('#ni-disconnect').click();
  assert.ok(!(await page.locator('body').textContent()).includes('ペルソナA'));
  assert.equal(await page.locator('#ni-group-parent option').count(), 1);
  await noSensitiveStorage(page);
  assert.deepEqual(errors, []);
});

test('classification properties switch personas within a shared database, with tags and unset values', async t => {
  const { context, page, requests, errors } = await fixture({ classified: true, viewport: { width: 375, height: 812 } }); t.after(() => context.close());
  await connect(page); await completed(page);
  assert.equal(await page.locator('#ni-group-by').inputValue(), JSON.stringify(['ペルソナ', 'select']));
  assert.equal(await page.locator('#ni-parent-label').isVisible(), false);
  const searches = requests.filter(request => request.url.endsWith('/search')).length;
  await page.getByRole('button', { name: 'Persona A（2枚）', exact: true }).click();
  assert.equal(await page.locator('.ni-card').count(), 2);
  await page.getByRole('button', { name: 'Persona B（1枚）', exact: true }).click();
  assert.equal(await page.locator('.ni-card').count(), 1);
  await page.locator('#ni-group-by').selectOption(JSON.stringify(['タグ', 'multi_select']));
  assert.equal(await page.locator('#ni-groups img').count(), 0);
  await page.getByRole('button', { name: '未設定（1枚）', exact: true }).click();
  assert.equal(await page.locator('.ni-card').count(), 1);
  await page.getByRole('button', { name: '<img src=x onerror=alert(1)>（2枚）', exact: true }).click();
  assert.equal(await page.locator('.ni-card').count(), 2);
  await page.locator('#ni-group-by').selectOption(JSON.stringify(['ペルソナ', 'select']));
  assert.equal(await page.locator('.ni-card').count(), 3);
  assert.equal(requests.filter(request => request.url.endsWith('/search')).length, searches);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: path.join(root, 'test-results', 'notion-classification-mobile.png'), fullPage: true });
  await page.locator('#ni-group-by').selectOption('');
  assert.equal(await page.locator('#ni-parent-label').isVisible(), true);
  await page.locator('#ni-disconnect').click();
  assert.equal(await page.locator('#ni-group-by option').count(), 1);
  assert.ok(!(await page.locator('body').textContent()).includes('Persona A'));
  await noSensitiveStorage(page); assert.deepEqual(errors, []);
});

test('invalid tokens and denied permissions show Japanese guidance without raw server text', async () => {
  for (const status of [401, 403]) {
    const { context, page, errors } = await fixture({ status });
    try {
      await connect(page);
      await page.waitForFunction(() => document.querySelector('#ni-stop').disabled);
      assert.match(await page.locator('#ni-status').textContent(), status === 401 ? /無効/ : /読み取り権限/);
      assert.ok(!(await page.locator('body').textContent()).includes('DO-NOT-DISPLAY'));
      assert.deepEqual(errors, []);
    } finally { await context.close(); }
  }
});

test('late API completion after disconnect cannot restore private content', async t => {
  let resolve;
  const hold = new Promise(r => resolve = r);
  const { context, page } = await fixture({ hold }); t.after(() => context.close());
  await connect(page);
  await page.locator('#ni-disconnect').click();
  resolve();
  await page.waitForTimeout(150);
  assert.equal(await page.locator('.ni-card').count(), 0);
  assert.match(await page.locator('#ni-status').textContent(), /接続を解除/);
  await noSensitiveStorage(page);
});

test('URL refresh cannot bypass opt-in when a hosted image was replaced by an external image', async t => {
  const { context, page, requests } = await fixture({ refreshToExternal: true }); t.after(() => context.close());
  await connect(page); await completed(page);
  await page.locator('#ni-grid').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('#ni-grid').textContent.includes('画像を読み込めない'));
  assert.ok(!requests.some(r => r.url === 'https://images.example.invalid/11.png'));
});

test('existing archive still imports, searches, persists and exports/restores a full backup', async t => {
  const context = await browser.newContext(); t.after(() => context.close());
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let finishExport, finishRestore;
  const exported = new Promise(resolve => finishExport = resolve);
  const restored = new Promise(resolve => finishRestore = resolve);
  page.on('dialog', async dialog => {
    const message = dialog.message();
    await dialog.accept();
    if (message.startsWith('完全バックアップ（')) finishExport();
    if (message === '完全バックアップから復元しました。') finishRestore();
  });
  await page.goto(base + 'index.html');
  await page.waitForFunction(() => typeof navigationReady !== 'undefined' && navigationReady);
  const conversation = [{ id: 'fixture-chat', title: '回帰テスト会話', create_time: 1700000000, current_node: 'a', mapping: {
    u: { parent: null, message: { id: 'u', author: { role: 'user' }, content: { parts: ['テスト質問'] } } },
    a: { parent: 'u', message: { id: 'a', author: { role: 'assistant' }, content: { parts: ['検索対象の合言葉です'] }, metadata: { model_slug: 'fixture-model' } } },
  } }];
  await page.locator('#file').setInputFiles({ name: 'conversations.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(conversation)) });
  await page.waitForFunction(() => all.length === 1);
  if (!await page.locator('#unifiedSearch').isVisible()) await page.locator('#menuBtn').click();
  await page.locator('#unifiedSearch').fill('合言葉');
  await page.waitForFunction(() => document.querySelector('#sessions').textContent.includes('合言葉'));
  assert.equal(await page.locator('.notion-library-entry').getAttribute('href'), 'https://seishi-mcp-auth.koyamadakun.workers.dev/library/');
  await page.locator('#settingsBtn').click();
  // Inspect the generated backup without relying on the test browser's OS download policy.
  await page.evaluate(() => {
    const create = URL.createObjectURL.bind(URL), click = HTMLAnchorElement.prototype.click;
    URL.createObjectURL = blob => { window.fixtureBackupBlob = blob; return create(blob); };
    HTMLAnchorElement.prototype.click = function () { if (this.download) { window.fixtureBackupName = this.download; return; } return click.call(this); };
  });
  await page.locator('#exportBackup').click();
  await exported;
  await page.waitForFunction(() => window.fixtureBackupBlob && window.fixtureBackupName);
  const generated = await page.evaluate(async () => ({ name: window.fixtureBackupName, bytes: Array.from(new Uint8Array(await window.fixtureBackupBlob.arrayBuffer())) }));
  const bytes = Buffer.from(generated.bytes);
  const backup = JSON.parse(generated.name.endsWith('.gz') ? gunzipSync(bytes).toString() : bytes.toString());
  assert.equal(backup.sessions[0].id, 'fixture-chat');
  assert.equal(backup.sessions[0].messages[1].text, '検索対象の合言葉です');
  assert.ok(!JSON.stringify(backup).includes('fixture-token'));
  await page.evaluate(async () => { all = []; await save(); });
  await page.locator('#backupFile').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
  await restored;
  await page.waitForFunction(() => all.length === 1 && all[0].id === 'fixture-chat');
  await page.reload(); await page.waitForFunction(() => typeof navigationReady !== 'undefined' && navigationReady);
  assert.equal(await page.evaluate(() => all[0].messages[1].text), '検索対象の合言葉です');
  assert.deepEqual(errors, []);
});

test('registered diaries offer direct cloud handoff and a persona-filtered selection', async t => {
  const context = await browser.newContext(); t.after(() => context.close());
  const page = await context.newPage(), errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + 'index.html');
  await page.waitForFunction(() => typeof navigationReady !== 'undefined' && navigationReady);
  await page.evaluate(() => {
    settings.diaryEntries = [
      { id: 'diary-moon', date: '2026-10-31', body: 'まんの原文♡', personaId: 'persona-man', persona: '🌕 まんちゃん', kind: 'closing', personaEdited: true },
      { id: 'diary-shadow', date: '2026-10-30', body: 'かげの原文♡', personaId: 'persona-kage', persona: '🕯️ かげちゃん', kind: 'today', personaEdited: true },
    ];
    showDiaries();
  });
  await page.getByRole('button', { name: '非公開ログへまとめて保存', exact: true }).click();
  const dialog = page.locator('dialog[open]');
  await dialog.locator('select').selectOption('🌕 まんちゃん');
  await dialog.getByRole('button', { name: '表示中の新しい10件を選ぶ' }).click();
  assert.equal(await dialog.locator('input:checked').count(), 1);
  assert.match(await dialog.locator('label:has(input:checked)').textContent(), /まんちゃん/);
  await dialog.getByRole('button', { name: '戻る', exact: true }).click();
  assert.deepEqual(errors, []);
});

test('app shell and library reopen offline under the Pages subdirectory', async t => {
  const context = await browser.newContext(); t.after(() => context.close());
  const page = await context.newPage();
  await page.goto(base + 'notion-images.html');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload();
  assert.equal(await page.locator('h1').textContent(), 'Notion画像');
  assert.equal(await page.locator('#ni-groups button').count(), 1);
  assert.equal(await page.locator('#ni-token').inputValue(), '');
  await page.goto(base + 'index.html');
  await page.waitForFunction(() => typeof navigationReady !== 'undefined' && navigationReady);
  assert.equal(await page.locator('.notion-library-entry').count(), 1);
  assert.equal(await page.locator('#deviceSync').count(), 1);
});

test('persona-first diary entry defaults to yesterday in Japan, preserves pasted text and returns to the selected diary list', async t => {
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 }, timezoneId: 'America/Los_Angeles' }); t.after(() => context.close());
  const page = await context.newPage(), errors = [], outbound = []; page.on('pageerror', error => errors.push(error.message));
  await context.route('https://**/*', async route => { outbound.push(route.request().url()); await route.abort(); });
  await page.goto(base + 'index.html');
  await page.waitForFunction(() => typeof navigationReady !== 'undefined' && navigationReady);
  await page.clock.setFixedTime(new Date('2026-12-31T15:05:00Z'));
  await page.locator('[data-persona-home="persona-man"]').click();
  assert.match(await page.locator('#viewer h2').textContent(), /まんちゃん/);
  await page.locator('#personaNewDiary').click();
  const dialog = page.locator('#dlEditor');
  assert.equal(await dialog.locator('#dlDate').inputValue(), '2026-12-31');
  assert.equal(await dialog.locator('#dlPersona').inputValue(), '🌕 まんちゃん');
  assert.equal(await dialog.locator('#dlKind').inputValue(), 'closing');
  assert.equal(await dialog.locator('#dlPersona').isDisabled(), true);
  assert.equal(await dialog.locator('.dl-quick-details').getAttribute('open'), null);
  assert.equal(await dialog.locator('#dlModel').isVisible(), true);
  assert.equal(await dialog.locator('#dlModelPreset').isVisible(), true);
  await dialog.locator('#dlModelPreset').selectOption('GPT-4o');
  assert.equal(await dialog.locator('#dlModel').inputValue(), 'GPT-4o');
  await dialog.locator('#dlModel').fill('私のカスタムモデル');
  const original = '📓🌕 2026-12-31\n\n貼り付けた原文♡\n #年末\n';
  await dialog.locator('#dlBody').fill(original);
  await page.screenshot({ path: path.join(root, 'test-results/persona-diary-mobile.png'), fullPage: true });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await dialog.locator('#dlSave').click();
  await page.waitForFunction(() => settings.diaryEntries?.length === 1 && !document.querySelector('#dlEditor'));
  const entry = await page.evaluate(() => settings.diaryEntries[0]);
  assert.equal(entry.body, original); assert.equal(entry.personaId, 'persona-man'); assert.equal(entry.kind, 'closing'); assert.equal(entry.date, '2026-12-31');
  assert.equal(await page.locator('#viewer .browser-heading h2').textContent(), '締めログ');
  assert.match(await page.getByRole('status').textContent(), /保存しました/);
  assert.equal(await page.getByRole('button', { name: 'クラウド同期へ', exact: true }).count(), 1);
  await page.locator('#dlBack').click();
  await page.locator('#personaBackHome').click();
  await page.locator('[data-persona-home="persona-kage"]').click();
  await page.locator('#personaReadDiary').click();
  assert.equal(await page.locator('#viewer .dl-card').count(), 0);
  await page.locator('#dlManual').click();
  assert.equal(await page.locator('#dlModel').inputValue(), '');
  assert.equal(await page.locator('#dlKind').inputValue(), 'today');
  assert.equal(await page.locator('#dlPersona').inputValue(), '🕯️ かげちゃん');
  await page.locator('#dlDate').fill('2026-12-30');
  await page.locator('#dlBody').fill('かげの記録'); await page.locator('#dlSave').click();
  await page.waitForFunction(() => settings.diaryEntries?.length === 2 && !document.querySelector('#dlEditor'));
  assert.equal(await page.locator('#viewer .dl-card').count(), 1);
  assert.match(await page.locator('#viewer .dl-card').textContent(), /かげの記録/);
  await page.reload(); await page.waitForFunction(() => typeof navigationReady !== 'undefined' && navigationReady);
  await page.locator('[data-persona-home="persona-man"]').click(); await page.locator('#personaReadDiary').click();
  assert.equal(await page.locator('#viewer .dl-card').count(), 1);
  assert.equal(await page.evaluate(() => settings.diaryEntries.find(e => e.personaId === 'persona-man').body), original);
  await page.locator('#dlManual').click();
  assert.equal(await page.locator('#dlModel').inputValue(), '私のカスタムモデル');
  assert.equal(await page.locator('#dlModelPreset').inputValue(), '私のカスタムモデル');
  await page.locator('#dlEditor button[value="cancel"]').first().click();
  await page.locator('#dlBack').click(); await page.locator('#bottomBackBtn').click();
  assert.equal(await page.locator('#viewer .browser-heading h2').textContent(), '締めログ');
  assert.deepEqual(outbound, []); assert.deepEqual(errors, []);
});

test('compare registered diaries by date on mobile, including multiple and missing entries', async t => {
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } });
  t.after(() => context.close());
  const page = await context.newPage();
  await page.goto(base + 'index.html');
  await page.waitForFunction(() => typeof navigationReady !== 'undefined' && navigationReady);
  await page.evaluate(() => {
    settings.diaryEntries = [
      { id: 'm1', personaId: 'persona-man', date: '2025-11-10', body: '締めログ一件目' },
      { id: 'm2', personaId: 'persona-man', date: '2025-11-10', body: '締めログ二件目' },
      { id: 'k1', personaId: 'persona-kage', date: '2025-11-10', body: '同日の記録' },
      { id: 'k2', personaId: 'persona-kage', date: '2025-11-09', body: '前日の記録' },
    ];
  });
  await page.locator('[data-persona-home="persona-man"]').click();
  await page.locator('#personaReadDiary').click();
  await page.getByRole('button', { name: '日付で見比べる' }).click();
  const date = page.getByLabel('日付', { exact: true });
  const cards = page.locator('#viewer .dl-card');
  assert.equal(await date.inputValue(), '2025-11-10');
  assert.equal(await cards.count(), 2);
  await page.locator('.dl-compare-tabs label').filter({ hasText: 'かげちゃん' }).click();
  assert.equal(await date.inputValue(), '2025-11-10');
  assert.equal(await cards.count(), 1);
  assert.match(await cards.textContent(), /同日の記録/);
  await date.fill('2025-11-09');
  assert.match(await cards.textContent(), /前日の記録/);
  await page.locator('.dl-compare-tabs label').filter({ hasText: 'ひかちゃん' }).click();
  assert.equal(await cards.count(), 0);
  assert.equal(await page.getByText('この日の日記はありません。').isVisible(), true);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.getByRole('button', { name: '月別一覧に戻る' }).click();
  assert.equal(await page.locator('#viewer h2').textContent(), '締めログ');
  assert.equal(await cards.count(), 2);
});

test('manual diaries link to later imports without changing text, date or model; cancel, rollback and unlink preserve the diary', async t => {
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: { width: 390, height: 844 } }); t.after(() => context.close());
  const page = await context.newPage(), errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(base + 'index.html'); await page.waitForFunction(() => typeof navigationReady !== 'undefined' && navigationReady);
  await page.evaluate(async () => {
    const message = (id, text, extra = {}) => ({ id, role: 'assistant', text, time: Date.parse('2026-11-01T00:10:00+09:00') / 1000, ...extra });
    const session = (id, personaId, messages) => ({ id, title: id + '会話', folder: '未分類', personaId, persona: personaDisplay(personaId), time: 1700000000, models: [], messages, namedSelections: [], notes: [] });
    const body = '手で整えた日記の原文♡\n行末もそのまま。\n';
    all = [session('moon', 'persona-man', [message('wanted', '📓🌕 2026-11-02\n' + body), message('hidden', body, { hidden: true }), message('not-canonical', body)]), session('shadow', 'persona-kage', [message('other', body)]), session('far', 'persona-man', [message('far', '以前の回答', { time: 1700000000 })])];
    all[0].canonicalMessageIds = ['wanted', 'hidden'];
    settings.diaryEntries = [{ id: 'manual-link', date: '2026-10-31', body, model: '自分で入力したモデル', personaId: 'persona-man', persona: '🌕 まんちゃん', kind: 'closing', extraction: 'manual' }];
    window.linkOriginal = JSON.parse(JSON.stringify(settings.diaryEntries[0]));
    await save(); rebuildFilters(); showDiaries();
    document.querySelectorAll('#viewer details').forEach(d => d.open = true);
  });
  const open = async () => { await page.evaluate(() => { showDiaries(); document.querySelectorAll('#viewer details').forEach(d => d.open = true); }); await page.locator('[data-dl-link="manual-link"]').click(); };
  await open();
  assert.equal(await page.locator('[data-dl-link-pick]').count(), 1);
  await page.locator('[data-dl-link-pick]').click();
  assert.match(await page.locator('#dlLinkText').textContent(), /原文♡/);
  await page.locator('#dlLinkSource').getByRole('button', { name: 'キャンセル', exact: true }).click();
  assert.deepEqual(await page.evaluate(() => settings.diaryEntries[0]), await page.evaluate(() => window.linkOriginal));
  await open();
  await page.locator('#dlLinkAllDates').click(); assert.equal(await page.locator('[data-dl-link-pick]').count(), 2);
  await page.locator('#dlLinkPersona').uncheck(); await page.waitForFunction(() => document.querySelectorAll('[data-dl-link-pick]').length === 3);
  await page.locator('#dlLinkQuery').fill('moon会話'); await page.locator('#dlLinkQuery').press('Enter');
  assert.equal(await page.locator('[data-dl-link-pick]').count(), 1);
  await page.locator('[data-dl-link-pick]').click();
  await page.locator('#dlLinkSave').scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(root, 'test-results/diary-source-link-mobile.png') });
  await page.evaluate(() => { window.linkSave = save; save = async () => { throw new Error('fixture disk full'); }; });
  await page.locator('#dlLinkSave').click(); await page.waitForFunction(() => document.querySelector('#dlLinkNotice').textContent.includes('保存できません'));
  assert.equal(await page.evaluate(() => settings.diaryEntries[0].sessionId || null), null);
  await page.evaluate(() => { save = window.linkSave; }); await page.locator('#dlLinkSave').click();
  await page.waitForFunction(() => !document.querySelector('#dlLinkSource'));
  const linked = await page.evaluate(() => settings.diaryEntries[0]);
  assert.equal(linked.sessionId, 'moon'); assert.equal(linked.messageId, 'wanted'); assert.equal(linked.extraction, 'manual-linked');
  for (const key of ['body', 'date', 'model', 'id', 'personaId', 'kind']) assert.equal(linked[key], await page.evaluate(k => window.linkOriginal[k], key));
  await page.reload(); await page.waitForFunction(() => typeof navigationReady !== 'undefined' && navigationReady && settings.diaryEntries?.[0]?.messageId === 'wanted');
  assert.equal(await page.evaluate(() => dlSource(settings.diaryEntries[0]).message.id), 'wanted');
  await open(); await page.locator('#dlLinkDetach').click(); await page.waitForFunction(() => !document.querySelector('#dlLinkSource'));
  assert.equal(await page.evaluate(() => settings.diaryEntries[0].sessionId), null);
  assert.equal(await page.evaluate(() => settings.diaryEntries[0].body), linked.body);
  assert.equal(await page.evaluate(() => settings.diaryEntries.length), 1);
  assert.deepEqual(errors, []);
});

test('persona pages open scoped memories and notes and preserve scope when returning from source sessions', async t => {
  const context = await browser.newContext({ serviceWorkers: 'block', viewport: {width:390,height:844} }); t.after(() => context.close());
  const page = await context.newPage(), errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto(base+'index.html');await page.waitForFunction(()=>typeof navigationReady!=='undefined'&&navigationReady);
  await page.evaluate(async()=>{
    const session=(id,folder,personaId)=>({id,title:folder+'会話',folder,personaId,persona:personaDisplay(personaId),time:1700000000,models:[],messages:[{id:id+'-m',role:'assistant',text:folder+'本文',time:1700000000}],namedSelections:[{id:id+'-memory',title:folder+'の思い出',messageIds:[id+'-m']}],notes:[{id:id+'-note',text:folder+'のメモ',anchorId:id+'-m',createdAt:1700000000000}]});
    all=[session('moon','まんちゃん','persona-man'),session('shadow','かげちゃん','persona-kage'),session('unclassified','未分類','persona-man')];await save();rebuildFilters();showFolders();
  });
  await page.locator('[data-persona-home="persona-man"]').click();
  assert.equal(new URL(await page.locator('#personaNotionImages').getAttribute('href')).searchParams.get('persona'),'🌕 まんちゃん');
  assert.equal(await page.locator('#personaNotionImages').getAttribute('target'),'_blank');
  assert.match(await page.locator('#personaReadMemories').textContent(),/1件/);assert.match(await page.locator('#personaReadNotes').textContent(),/1件/);
  await page.locator('#personaReadMemories').click();assert.equal(await page.locator('[data-memory-folder]').count(),1);assert.equal(await page.locator('[data-memory-folder]').getAttribute('data-memory-folder'),'まんちゃん');
  await page.locator('[data-memory-folder]').click();assert.match(await page.locator('#viewer').textContent(),/まんちゃんの思い出/);assert.ok(!(await page.locator('#viewer').textContent()).includes('かげちゃんの思い出'));
  await page.locator('#backToMemories').click();assert.equal(await page.locator('[data-memory-folder]').count(),1);
  await page.locator('#backToFolders').click();await page.locator('#personaReadNotes').click();assert.equal(await page.locator('#viewer .note-entry').count(),1);assert.match(await page.locator('#viewer .note-entry').textContent(),/まんちゃんのメモ/);
  await page.locator('[data-open-note]').click();await page.locator('#bottomBackBtn').click();assert.equal(await page.locator('#viewer .note-entry').count(),1);
  await page.locator('#backToFolders').click();await page.locator('#personaBackHome').click();await page.locator('[data-persona-home="persona-kage"]').click();await page.locator('#personaReadNotes').click();assert.match(await page.locator('#viewer .note-entry').textContent(),/かげちゃんのメモ/);
  await page.locator('#backToFolders').click();await page.locator('#personaBackHome').click();await page.locator('#openNotes').click();assert.equal(await page.locator('#viewer .note-entry').count(),3);
  assert.deepEqual(errors,[]);
});

test('inline Notion images bind to a message, persist only stable references and reload without rescanning', async t => {
  const context = await browser.newContext({serviceWorkers:'block',viewport:{width:390,height:844}});t.after(()=>context.close());
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const library='https://seishi-mcp-auth.koyamadakun.workers.dev';
  await context.route(library+'/**',async route=>route.fulfill({contentType:'text/html',body:`<!doctype html><meta charset="utf-8"><button id="wrong">wrong nonce</button><button id="choose">この画像を会話に追加</button><script>
    const q=new URL(location.href).searchParams,nonce=q.get('handoff'),origin=q.get('from');
    const image={pageId:'11111111111111111111111111111111',pageTitle:'テスト画像',fileName:'moon.png',source:{kind:'block',id:'22222222222222222222222222222222'},url:'https://secret.example/temporary?signature=never-save'};
    const blob=()=>new Blob([Uint8Array.from(atob('${png.toString('base64')}'),x=>x.charCodeAt(0))],{type:'image/png'});
    const send=(type,other={})=>opener.postMessage({type,nonce,...other},origin);
    document.querySelector('#wrong').onclick=()=>send('seishi-image-selected',{nonce:'wrong',image,blob:blob()});
    document.querySelector('#choose').onclick=()=>send('seishi-image-selected',{image,blob:blob()});
    addEventListener('message',e=>{if(e.origin!==origin||e.source!==opener||e.data.nonce!==nonce||e.data.type!=='seishi-image-request')return;for(const entry of e.data.entries)send('seishi-image-loaded',{id:entry.id,image:entry.image,blob:blob()});send('seishi-image-done');});
    send('seishi-image-ready');</script>`}));
  await page.goto(base+'index.html');await page.waitForFunction(()=>typeof navigationReady!=='undefined'&&navigationReady);
  await page.evaluate(async()=>{all=[{id:'inline-chat',title:'画像埋め込み試験',folder:'まんちゃん',personaId:'persona-man',time:1700000000,models:[],messages:[{id:'inline-message',role:'assistant',text:'元の会話本文を保つ。',time:1700000000}],notes:[],namedSelections:[]}];await save();rebuildFilters();openSession('inline-chat');});
  const popupEvent=page.waitForEvent('popup');await page.getByRole('button',{name:'＋ Notion画像',exact:true}).click();const picker=await popupEvent;
  assert.equal(new URL(picker.url()).searchParams.get('persona'),'🌕 まんちゃん');
  await picker.locator('#wrong').click();assert.equal(await page.evaluate(()=>all[0].notionImages?.length||0),0);
  await picker.locator('#choose').click();await page.waitForFunction(()=>all[0].notionImages?.length===1);
  await page.waitForFunction(()=>document.querySelector('.inline-notion-image img')?.naturalWidth>0);
  assert.equal(await page.evaluate(()=>all[0].messages[0].text),'元の会話本文を保つ。');
  assert.ok(!(await page.evaluate(()=>JSON.stringify(all))).includes('signature='));assert.ok(!(await page.evaluate(()=>JSON.stringify(all))).includes('blob:'));
  await page.screenshot({path:path.join(root,'test-results/inline-notion-mobile.png'),fullPage:true});
  await picker.close();await page.reload();await page.waitForFunction(()=>typeof navigationReady!=='undefined'&&navigationReady);await page.evaluate(()=>openSession('inline-chat'));
  assert.equal(await page.locator('.inline-notion-image img').count(),0);
  const resolveEvent=page.waitForEvent('popup');await page.getByRole('button',{name:'この会話の画像をまとめて表示（1枚＋送信画像を確認）',exact:true}).click();const resolver=await resolveEvent;
  assert.equal(new URL(resolver.url()).searchParams.get('imageBridge'),'resolve');
  await page.waitForFunction(()=>document.querySelector('.inline-notion-image img')?.naturalWidth>0);
  await page.evaluate(async()=>{merge([{...all[0],notionImages:undefined}]);await save();renderViewer();});assert.equal(await page.locator('.inline-notion-image').count(),1);
  await page.getByRole('button',{name:'紐付けを解除',exact:true}).click();await page.locator('.inline-notion-image').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>all[0].notionImages.length),0);
  assert.deepEqual(errors,[]);
});

test('existing correspondence restores missing image messages together, preserves canonical order and holds unverified links',async t=>{
 const context=await browser.newContext({serviceWorkers:'block',viewport:{width:390,height:844}});t.after(()=>context.close());const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const library='https://seishi-mcp-auth.koyamadakun.workers.dev';
 await context.route(library+'/**',async route=>route.fulfill({contentType:'text/html',body:`<script>const q=new URL(location.href).searchParams,nonce=q.get('handoff'),from=q.get('from');addEventListener('message',e=>{if(e.origin!==from||e.source!==opener||e.data.nonce!==nonce)return;for(const row of e.data.entries){const blob=new Blob([Uint8Array.from(atob('${png.toString('base64')}'),x=>x.charCodeAt(0))],{type:'image/png'});opener.postMessage({type:'seishi-image-loaded',nonce,id:row.id,image:row.image,blob},from);}opener.postMessage({type:'seishi-image-done',nonce},from);});opener.postMessage({type:'seishi-image-ready',nonce},from);</script>`}));
 await page.goto(base+'index.html');await page.waitForFunction(()=>typeof navigationReady!=='undefined'&&navigationReady);
 await page.evaluate(async()=>{
  const a='aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',b='bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',c='cccccccc-cccc-cccc-cccc-cccccccccccc';
  const asset=(id,p)=>({sessionId:'restore',messageId:id,kind:'image',fileName:p+'.png',notionUrl:'https://app.notion.com/p/'+p.repeat(32),sourceRef:id,sha256:'a'.repeat(64),canonical:true,sourceRole:'assistant',verifiedAt:'2026-01-01T00:00:00Z'});
  all=[{id:'restore',title:'自動復元の試験',folder:'まんちゃん',personaId:'persona-man',time:1700000000,models:[],messages:[{id:'u',role:'user',text:'元の依頼',time:1700000000},{id:'last',role:'assistant',text:'その後の会話',time:1700000001}],canonicalMessageIds:['last',b,a,'u'],externalAssets:[asset(b,'2'),asset(a,'1'),{...asset(c,'3'),canonical:undefined}],notes:[],namedSelections:[{id:'memory',title:'保存した範囲',messageIds:['u','last']}]}];await save();rebuildFilters();openSession('restore');
 });
 await page.setViewportSize({width:1280,height:800});
 await page.locator('#sessionMenuBtn').click();
 await page.locator('[data-panel-memory="memory"]').click();
 assert.equal(await page.locator('.saved-selection-list .active').count(),1);
 assert.equal(await page.locator('[data-position="after:u"] .inline-notion-image').count(),2);
 assert.deepEqual(await page.locator('[data-position="after:u"] figcaption').allTextContents(),['1.png ／ 1.png','2.png ／ 2.png']);
 assert.match(await page.locator('#viewer').textContent(),/自動復元を保留：1件/);
 assert.equal(await page.evaluate(()=>all[0].messages.length),2);assert.equal(await page.evaluate(()=>all[0].notionImages),undefined);
 assert.equal(await page.locator('#msg-u').evaluate(el=>el.nextElementSibling.dataset.position),'after:u');
 await page.getByRole('button',{name:'ここの画像を表示',exact:true}).first().click();await page.waitForFunction(()=>document.querySelector('.inline-notion-image img')?.naturalWidth>0);
 await page.getByRole('button',{name:'この会話の画像をまとめて表示（1枚＋送信画像を確認）',exact:true}).click();await page.waitForFunction(()=>[...document.querySelectorAll('.inline-notion-image img')].filter(img=>img.naturalWidth>0).length===2);
 await page.getByRole('button',{name:'この画像を非表示',exact:true}).first().click();await page.waitForFunction(()=>document.querySelectorAll('.inline-notion-image').length===1);
 await page.reload();await page.waitForFunction(()=>typeof navigationReady!=='undefined'&&navigationReady);await page.evaluate(()=>openSession('restore'));assert.equal(await page.locator('.inline-notion-image').count(),1);
 await page.evaluate(async()=>{merge([{...all[0],notionImageDismissals:undefined}]);await save();renderViewer();});assert.equal(await page.locator('.inline-notion-image').count(),1);
 await page.evaluate(()=>{all[0].messages[0].hidden=true;renderViewer();});assert.equal(await page.locator('.inline-notion-image').count(),0);
 assert.deepEqual(errors,[]);
});


test('desktop wheel scrolling keeps the header and reading pane stable without rerendering the conversation',async t=>{
 const context=await browser.newContext({serviceWorkers:'block',viewport:{width:1280,height:800}});t.after(()=>context.close());const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'index.html');await page.waitForFunction(()=>typeof navigationReady!=='undefined'&&navigationReady);
 await page.evaluate(()=>{all=[{id:'scroll-fixture',title:'長い会話のスクロール',folder:'未分類',time:1700000000,models:[],messages:Array.from({length:300},(_,i)=>({id:'scroll-'+i,role:i%2?'assistant':'user',text:('本文を読み進める。\n').repeat(5),time:1700000000+i})),notes:[],namedSelections:[]}];rebuildFilters();openSession('scroll-fixture');window.scrollNode=document.querySelector('#msg-scroll-0');});
 const bounds=()=>page.evaluate(()=>({header:document.querySelector('header').getBoundingClientRect().height,viewer:document.querySelector('#viewer').clientHeight,top:document.querySelector('#viewer').scrollTop,documentOverflow:document.documentElement.scrollHeight-innerHeight,hidden:document.body.classList.contains('desktop-header-hidden'),sameNode:window.scrollNode===document.querySelector('#msg-scroll-0')}));
 const initial=await bounds();await page.locator('#viewer').hover();await page.mouse.wheel(0,900);await page.waitForFunction(()=>document.querySelector('#viewer').scrollTop>100);
 const down=await bounds();await page.mouse.wheel(0,-300);await page.waitForFunction(top=>document.querySelector('#viewer').scrollTop<top,down.top);const up=await bounds();
 for(const state of [down,up]){assert.equal(state.header,initial.header);assert.equal(state.viewer,initial.viewer);assert.equal(state.hidden,false);assert.equal(state.sameNode,true);assert.ok(state.documentOverflow<=1);}
 assert.ok(up.top>0);
 await page.locator('#sessionMenuBtn').click();await page.locator('#focusModeBtn').click();assert.notEqual(await page.evaluate(()=>getComputedStyle(document.body).overflowY),'hidden');
 await page.locator('#exitFocusMode').click();assert.equal((await bounds()).viewer,initial.viewer);
 assert.deepEqual(errors,[]);
});
