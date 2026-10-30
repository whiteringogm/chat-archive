const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('service worker caches only public static files, bypasses API/images/auth and preserves unrelated caches', async () => {
  const handlers = {}, added = [], deleted = [];
  const scope = 'https://archive.example.invalid/chat-archive/';
  vm.runInNewContext(fs.readFileSync('sw.js', 'utf8'), {
    URL, Set, Promise,
    self: { registration: { scope }, addEventListener: (event, handler) => handlers[event] = handler, skipWaiting() {}, clients: { claim() {} } },
    caches: { open: async () => ({ addAll: files => added.push(...files), match: async () => 'static' }), keys: async () => ['seishi-old', 'unrelated-cache'], delete: async key => deleted.push(key) },
    fetch: () => { throw new Error('Unexpected network request'); },
  });
  let pending;
  handlers.install({ waitUntil: value => pending = value }); await pending;
  assert.ok(added.includes('./notion-images.html'));
  assert.ok(added.includes('./notion-images-core.mjs?v=3'));
  assert.ok(added.every(file => file.startsWith('./')));
  handlers.activate({ waitUntil: value => pending = value }); await pending;
  assert.deepEqual(deleted, ['seishi-old']);
  for (const [url, method, auth] of [
    ['https://api.notion.com/v1/search', 'POST', true], ['https://images.example.invalid/a.png?signed=fixture', 'GET', false],
    [scope + 'notion-images.html', 'GET', true], [scope + 'private.json', 'GET', false],
  ]) {
    handlers.fetch({ request: { url, method, headers: { has: () => auth } }, respondWith: () => assert.fail('Private request intercepted') });
  }
  handlers.fetch({ request: { url: scope + 'notion-images.html', method: 'GET', headers: { has: () => false } }, respondWith: value => pending = value });
  assert.equal(await pending, 'static');
});
