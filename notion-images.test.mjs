import test from 'node:test';
import assert from 'node:assert/strict';
import { ImageGroups, NotionClient, NOTION_VERSION, collectImages, delay, errorMessage, fetchImageBlob, needsRefresh, parseRoots, refreshImage, safeImageUrl } from './notion-images-core.mjs';

const uid = n => n.toString(16).padStart(32, '0');
const page = (n, title = `Page ${n}`) => ({ object: 'page', id: uid(n), properties: { title: { type: 'title', title: [{ plain_text: title }] } }, created_time: '2026-01-01T00:00:00Z' });
const file = (name = 'image.png', external = false) => ({ name, type: external ? 'external' : 'file', [external ? 'external' : 'file']: { url: `https://images.example.invalid/${encodeURIComponent(name)}?signed=fixture`, expiry_time: '2026-01-01T01:00:00Z' } });
const image = n => ({ id: uid(n), type: 'image', image: file(), created_time: '2026-01-01T00:00:00Z' });
const list = (results, next_cursor = null) => ({ results, next_cursor, has_more: Boolean(next_cursor) });
const response = (body, status = 200, headers = {}) => ({ ok: status < 400, status, headers: new Headers(headers), json: async () => body });

test('persona grouping follows actual ancestors despite child-first discovery and clears all page names', async () => {
  const ownedPage = (n, title, parentId, type = 'page_id') => ({ ...page(n, title), parent: parentId ? { type, [type]: uid(parentId) } : { type: 'workspace', workspace: true } });
  const records = [ownedPage(84, 'Image A', 83, 'data_source_id'), { object: 'data_source', id: uid(83), parent: { type: 'database_id', database_id: uid(82) } }, ownedPage(86, 'Image B', 85), ownedPage(80, 'Library', null)];
  const a = ownedPage(81, 'Persona A', 80), b = ownedPage(85, 'Persona B', 80);
  const { client } = fake(({ path }) => {
    if (path === 'search') return response(list(records));
    if (path === `databases/${uid(82)}`) return response({ title: [{ plain_text: 'Image database' }], parent: { type: 'page_id', page_id: uid(81) }, data_sources: [{ id: uid(83) }] });
    if (path === `data_sources/${uid(83)}/query`) return response(list([records[0]]));
    if (path === `pages/${uid(81)}`) return response(a);
    if (path === `pages/${uid(85)}`) return response(b);
    if (path === `blocks/${uid(80)}/children`) return response(list([{ id: uid(81), type: 'child_page', child_page: { title: 'Persona A' } }, { id: uid(85), type: 'child_page', child_page: { title: 'Persona B' } }]));
    if (path === `blocks/${uid(81)}/children`) return response(list([{ id: uid(82), type: 'child_database' }]));
    if (path === `blocks/${uid(85)}/children`) return response(list([{ id: uid(86), type: 'child_page' }]));
    if (path === `blocks/${uid(84)}/children`) return response(list([image(100)]));
    if (path === `blocks/${uid(86)}/children`) return response(list([image(101)]));
    throw new Error(`Unexpected fixture ${path}`);
  });
  const graph = new ImageGroups(), images = [];
  await collectImages(client, { onNode: node => graph.add(node), onImage: image => images.push(image) });
  const summary = graph.summary(images);
  assert.equal(summary.defaultScope, uid(80));
  assert.deepEqual(new Set(summary.children.get(uid(80))), new Set([uid(81), uid(85)]));
  assert.equal(summary.counts.get(uid(81)), 1);
  assert.equal(images.filter(image => graph.contains(image.pageId, uid(81))).length, 1);
  assert.equal(images.filter(image => graph.contains(image.pageId, uid(85))).length, 1);
  assert.ok(!graph.ancestors(uid(84)).includes(uid(83)), 'data source is transparent');
  graph.clear(); assert.equal(graph.nodes.size, 0);
});

test('identically named persona pages stay separate, and malformed parent cycles terminate', () => {
  const graph = new ImageGroups();
  graph.add({ id: 'root', title: 'Library', type: 'page' });
  graph.add({ id: 'a', title: 'Same name', type: 'page', parentId: 'root' });
  graph.add({ id: 'b', title: 'Same name', type: 'page', parentId: 'root' });
  const images = [{ pageId: 'a' }, { pageId: 'b' }];
  assert.equal(graph.summary(images).children.get('root').length, 2);
  assert.ok(!graph.contains('a', 'b'));
  graph.add({ id: 'root', parentId: 'a' });
  assert.deepEqual(graph.ancestors('a'), ['a', 'root']);
  assert.doesNotThrow(() => graph.summary(images));
});

test('Notion select, multi-select and named text classifications split images in the same database', async () => {
  const pages = [page(1), page(2), page(3)];
  pages[0].properties['ペルソナ'] = { type: 'select', select: { name: 'Persona A' } };
  pages[1].properties['ペルソナ'] = { type: 'select', select: { name: 'Persona B' } };
  pages[2].properties['ペルソナ'] = { type: 'select', select: null };
  pages[0].properties['タグ'] = { type: 'multi_select', multi_select: [{ name: 'A' }, { name: 'B' }, { name: 'A' }] };
  pages[1].properties['分類メモ'] = { type: 'rich_text', rich_text: [{ plain_text: '<img src=x onerror=alert(1)>' }] };
  pages[0].properties['本文'] = { type: 'rich_text', rich_text: [{ plain_text: 'Do not retain unrelated body text' }] };
  const { client } = fake(({ path }) => response(path === 'search' ? list(pages) : list([image(100 + Number.parseInt(path.split('/')[1], 16))])));
  const graph = new ImageGroups(), images = [];
  await collectImages(client, { onNode: node => graph.add(node), onImage: image => images.push(image) });
  const fields = graph.fields(images), persona = fields.find(field => field.name === 'ペルソナ');
  assert.deepEqual([...persona.counts], [['Persona A', 1], ['Persona B', 1]]);
  assert.equal(persona.unset, 1);
  assert.equal(fields.find(field => field.name === 'タグ').counts.get('A'), 1);
  assert.equal(fields.find(field => field.name === '分類メモ').counts.get('<img src=x onerror=alert(1)>'), 1);
  assert.ok(!fields.some(field => field.name === '本文'));
  graph.clear(); assert.deepEqual(graph.fields(images), []);
});

test('nested pages inherit classification, but an explicitly unset value overrides the parent', () => {
  const graph = new ImageGroups(), key = JSON.stringify(['分類', 'select']);
  graph.add({ id: 'parent', type: 'page', classifications: [{ key, name: '分類', type: 'select', values: ['A'] }] });
  graph.add({ id: 'child', type: 'page', parentId: 'parent' });
  graph.add({ id: 'unset', type: 'page', parentId: 'parent', classifications: [{ key, name: '分類', type: 'select', values: [] }] });
  assert.deepEqual(graph.fieldValues('child', key), ['A']);
  assert.deepEqual(graph.fieldValues('unset', key), []);
});
function fake(handler, options = {}) {
  const requests = [], waits = [];
  let now = 0;
  const client = new NotionClient('fixture-token', {
    now: () => now, wait: async (ms, signal) => { if (signal?.aborted) throw new DOMException('Aborted', 'AbortError'); waits.push(ms); now += ms; },
    fetchImpl: async (url, init) => {
      const request = { path: new URL(url).pathname.slice(4), query: Object.fromEntries(new URL(url).searchParams), body: init.body && JSON.parse(init.body), init, url };
      requests.push(request);
      return handler(request, requests.length);
    }, ...options,
  });
  return { client, requests, waits };
}

test('authenticated requests use only fixed Notion origin, version and no-store; mutations/foreign routes are rejected', async () => {
  const { client, requests } = fake(() => response(list([])));
  await client.request('search', { method: 'POST', body: { page_size: 100 } });
  const { init, url } = requests[0];
  assert.equal(init.headers.Authorization, 'Bearer fixture-token');
  assert.equal(init.headers['Notion-Version'], NOTION_VERSION);
  assert.equal(init.cache, 'no-store'); assert.equal(init.credentials, 'omit'); assert.equal(init.redirect, 'error');
  assert.equal(init.referrerPolicy, 'no-referrer'); assert.equal(init.mode, 'cors');
  assert.equal(url, 'https://api.notion.com/v1/search');
  assert.ok(!JSON.stringify(init.body).includes('fixture-token'));
  for (const [path, method] of [['pages', 'POST'], [`blocks/${uid(1)}`, 'DELETE'], ['https://example.invalid', 'GET'], ['../oauth/token', 'POST']]) {
    await assert.rejects(client.request(path, { method }));
  }
  assert.equal(requests.length, 1);
});

test('search, block and database pagination, nested blocks, properties, child pages, synced cycles and duplicates', async () => {
  const root = page(1, '<img src=x onerror=alert(1)>');
  root.properties.files = { id: 'files', type: 'files', files: [file('one.png'), file('report.pdf')] };
  const { client, requests } = fake(({ path, body, query }) => {
    if (path === 'search') return response(body.start_cursor ? list([page(2), { object: 'data_source', id: uid(7) }]) : list([root], 'search-next'));
    if (path === `blocks/${uid(1)}/children`) return response(query.start_cursor ? list([image(12)]) : list([
      image(10), { id: uid(11), type: 'toggle', has_children: true },
      { id: uid(2), type: 'child_page' }, { id: uid(6), type: 'child_database' },
      { id: uid(19), type: 'file', file: file('attached.webp') },
      { id: uid(18), type: 'video', video: file('movie.mp4') },
    ], 'blocks-next'));
    if (path === `blocks/${uid(11)}/children`) return response(list([image(13), { id: uid(14), type: 'synced_block', synced_block: { synced_from: { block_id: uid(11) } } }]));
    if (path === `pages/${uid(2)}`) return response(page(2));
    if (path === `blocks/${uid(2)}/children`) return response(list([{ ...image(15), image: file('external.jpg', true) }, { id: uid(1), type: 'child_page' }]));
    if (path === `databases/${uid(6)}`) return response({ data_sources: [{ id: uid(7) }, { id: uid(8) }] });
    if (path === `data_sources/${uid(7)}/query`) return response(body.start_cursor ? list([page(4)]) : list([page(3)], 'rows-next'));
    if (path === `data_sources/${uid(8)}/query`) return response(list([page(4)]));
    if ([3,4].some(n => path === `blocks/${uid(n)}/children`)) return response(list([image(path.includes(uid(3)) ? 16 : 17)]));
    throw new Error(`Unexpected fixture route ${path}`);
  });
  const images = [], snapshots = [];
  const result = await collectImages(client, { onImage: i => images.push(i), onProgress: p => snapshots.push(p) });
  assert.equal(result.pages, 4); assert.equal(images.length, 8); assert.equal(new Set(images.map(i => i.key)).size, 8);
  assert.equal(images.find(i => i.key === `block:${uid(13)}`).pageTitle, root.properties.title.title[0].plain_text);
  assert.equal(images.filter(i => i.external).length, 1);
  assert.ok(snapshots.some(p => p.images > 0 && p.pages < result.pages));
  assert.equal(requests.filter(r => r.path === `blocks/${uid(11)}/children`).length, 1);
  assert.equal(requests.filter(r => r.path === `blocks/${uid(2)}/children`).length, 1);
  assert.ok(requests.some(r => r.query.start_cursor === 'blocks-next'));
  assert.ok(requests.some(r => r.body?.start_cursor === 'rows-next'));
});

test('manual roots bypass search and resolve databases with multiple data sources', async () => {
  const { client, requests } = fake(({ path }) => {
    if (path === `pages/${uid(1)}`) return response({}, 404);
    if (path === `databases/${uid(1)}`) return response({ data_sources: [{ id: uid(2) }, { id: uid(3) }] });
    if (path.includes('/query')) return response(list([]));
    throw new Error('unexpected route');
  });
  await collectImages(client, { roots: [uid(1)] });
  assert.equal(requests.filter(r => r.path.includes('/query')).length, 2);
  assert.ok(!requests.some(r => r.path === 'search'));
  assert.deepEqual(parseRoots(`https://app.notion.com/p/${uid(1)}\nhttps://www.notion.so/title-${uid(1)}?pvs=4`), [uid(1)]);
  assert.throws(() => parseRoots('https://example.invalid/invalid'));
});

test('403/404 are reported as partial results while 401 stops collection; server text never reaches UI errors', async () => {
  for (const status of [401, 403, 404]) {
    const warnings = [];
    const { client } = fake(({ path }) => response(path === 'search' ? list([page(1), page(2)]) : { message: 'private-server-message' }, path === 'search' ? 200 : status));
    if (status === 401) await assert.rejects(collectImages(client), e => e.status === 401 && !errorMessage(e).includes('private-server-message'));
    else {
      const result = await collectImages(client, { onWarning: w => warnings.push(w) });
      assert.equal(result.warnings, 2); assert.equal(warnings.length, 2);
      assert.ok(warnings.every(w => !w.includes('private-server-message')));
    }
  }
});

test('repeated cursors are stopped and Notion result caps are surfaced', async () => {
  for (const kind of ['cycle', 'cap']) {
    const { client, requests } = fake(() => response(kind === 'cycle' ? list([], 'same') : { ...list([]), request_status: { type: 'incomplete' } }));
    await assert.rejects(async () => { for await (const batch of client.paginate('search', { method: 'POST' })) void batch; }, e => e.code === (kind === 'cycle' ? 'pagination' : 'incomplete'));
    assert.ok(requests.length <= 2);
  }
});

test('requests are serialized, throttled and retry 429/529/503 with Retry-After (including body fallback)', async () => {
  const { client, requests, waits } = fake((request, number) => {
    if (number === 1) return response({}, 429, { 'Retry-After': '2' });
    if (number === 2) return response({ additional_data: { retry_after: '65' } }, 529);
    if (number === 3) return response({}, 503);
    return response(list([]));
  });
  await Promise.all([client.request('search', { method: 'POST' }), client.request('search', { method: 'POST' })]);
  assert.equal(requests.length, 5);
  assert.ok(waits[1] >= 2000); assert.ok(waits[2] >= 65000); assert.ok(waits[3] >= 4000); assert.ok(waits[4] >= 350);
});

test('capped queries still read every available result page before reporting the cap', async () => {
  const { client } = fake((request, number) => response({ ...list([number], number === 1 ? 'next' : null), request_status: { type: 'incomplete' } }));
  const found = [];
  await assert.rejects(async () => { for await (const batch of client.paginate(`data_sources/${uid(1)}/query`, { method: 'POST' })) found.push(...batch); }, e => e.code === 'incomplete');
  assert.deepEqual(found, [1, 2]);
});

test('retry limits and permanent API blocks are respected', async () => {
  const limited = fake(() => response({}, 429), { retries: 2 });
  await assert.rejects(limited.client.request('search', { method: 'POST' }), e => e.status === 429);
  assert.equal(limited.requests.length, 3);
  const blocked = fake(() => response({ additional_data: { rate_limit_reason: 'public_api_request_blocked' } }, 429));
  await assert.rejects(blocked.client.request('search', { method: 'POST' }), e => e.code === 'blocked');
  assert.equal(blocked.requests.length, 1);
});

test('a transient gateway HTML response is retried as a read-only request', async () => {
  const { client, requests } = fake((request, number) => number === 1
    ? { ...response({}, 502), json: async () => { throw new SyntaxError('HTML gateway response'); } }
    : response(list([])));
  await client.request('search', { method: 'POST' });
  assert.equal(requests.length, 2);
});

test('disconnect aborts active and queued requests without making later calls', async () => {
  let count = 0;
  const client = new NotionClient('fixture-token', { interval: 0, fetchImpl: async (url, { signal }) => { count++; await delay(10000, signal); } });
  const first = client.request('search', { method: 'POST' });
  const second = client.request('search', { method: 'POST' });
  const outcomes = Promise.allSettled([first, second]);
  await delay(10); client.disconnect();
  assert.ok((await outcomes).every(r => r.status === 'rejected' && r.reason.name === 'AbortError'));
  assert.equal(count, 1);
  await assert.rejects(client.request('search', { method: 'POST' }), e => e.name === 'AbortError');
});

test('timeouts and network/CORS failures have safe Japanese errors', async () => {
  const timeout = new NotionClient('fixture-token', { timeout: 1, fetchImpl: async (url, { signal }) => { await delay(1000, signal); } });
  await assert.rejects(timeout.request('search', { method: 'POST' }), e => e.code === 'timeout');
  const network = fake(() => { throw new Error('private-url'); });
  await assert.rejects(network.client.request('search', { method: 'POST' }), e => errorMessage(e).includes('CORS') && !errorMessage(e).includes('private-url'));
});

test('expired block and property URLs refresh; reordered files do not silently select another name', async () => {
  const owner = page(1); owner.properties.files = { id: 'media', type: 'files', files: [file('a.png'), file('b.png')] };
  const images = [];
  const initial = fake(({ path }) => response(path === 'search' ? list([owner]) : list([image(2)])));
  await collectImages(initial.client, { onImage: i => images.push(i) });
  const block = images.find(i => i.source.kind === 'block');
  assert.ok(needsRefresh(block, Date.parse('2026-01-01T00:59:30Z')));
  assert.ok(!needsRefresh(block, Date.parse('2026-01-01T00:01:00Z')));
  const freshBlock = image(2); freshBlock.image.file.url = 'https://images.example.invalid/fresh.png';
  owner.properties.files.files.reverse();
  owner.properties.files.files[1].file.url = 'https://images.example.invalid/fresh-property.png';
  const fresh = fake(({ path }) => response(path.startsWith('blocks') ? freshBlock : owner));
  assert.equal((await refreshImage(fresh.client, block)).url, freshBlock.image.file.url);
  const property = images.find(i => i.fileName === 'a.png');
  assert.equal((await refreshImage(fresh.client, property)).url, owner.properties.files.files[1].file.url);
  owner.properties.files.files = [];
  await assert.rejects(refreshImage(fresh.client, property), e => e.code === 'removed');
});

test('media requests cannot receive a token, cookies or referrer and reject unsafe URLs/non-images', async () => {
  let observed;
  await fetchImageBlob({ url: 'https://images.example.invalid/a.png' }, { fetchImpl: async (url, init) => { observed = init; return { ok: true, blob: async () => new Blob(['fixture'], { type: 'image/png' }) }; } });
  assert.equal(observed.credentials, 'omit'); assert.equal(observed.cache, 'no-store'); assert.equal(observed.headers, undefined);
  assert.equal(observed.referrerPolicy, 'no-referrer'); assert.equal(observed.redirect, 'error');
  for (const url of ['javascript:alert(1)', 'http://example.invalid/a.png', 'https://name:password@example.invalid/a.png', 'data:image/svg+xml,test']) assert.equal(safeImageUrl(url), '');
  await assert.rejects(fetchImageBlob({ url: 'https://images.example.invalid/a.png' }, { fetchImpl: async () => ({ ok: true, blob: async () => new Blob(['html'], { type: 'text/html' }) }) }), e => e.code === 'media');
});
