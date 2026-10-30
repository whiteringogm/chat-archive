// Read-only Notion access. No storage, logging, SDK, proxy, or archive dependency.
export const NOTION_VERSION = '2026-03-11';
const API = 'https://api.notion.com/v1/';
const UUID = /^[\da-f]{8}-?[\da-f]{4}-?[\da-f]{4}-?[\da-f]{4}-?[\da-f]{12}$/i;
const IMAGE_EXTENSION = /\.(png|jpe?g|gif|webp|avif|bmp|svg|ico|tiff?|heic|heif)$/i;

export class NotionError extends Error {
  constructor(code, status = 0) { super(code); this.name = 'NotionError'; this.code = code; this.status = status; }
}
export function errorMessage(error) {
  if (error?.name === 'AbortError') return '収集を停止した。取得済みの画像は引き続き閲覧できる。';
  const messages = {
    token: 'Notionの読み取り専用トークンを入力してから接続してほしい。',
    network: 'Notionに接続できない。通信状態を確認して再試行してほしい。ブラウザのCORS制限でも起こる。外部プロキシへの転送は行わない。',
    timeout: 'Notionの応答が時間内に届かなかった。少し待って再収集してほしい。',
    pagination: 'ページの続き情報が繰り返されたため、安全のため収集を停止した。再収集してほしい。',
    incomplete: 'Notionの検索・クエリ上限に達し、一部を取得できなかった。対象を分けて再収集してほしい。',
    invalid_id: 'ページまたはデータベースのURL・IDを確認してほしい。',
    removed: '画像が削除・移動されたか、参照できなくなった。再収集してほしい。',
    media: '画像を読み込めない。配信元のCORS設定、画像形式、アクセス権限を確認してほしい。元のNotionページでも確認できる。',
    blocked: 'Notion側でAPIアクセスが制限されている。Notionの管理者またはサポートに確認してほしい。',
  };
  if (error?.status === 401) return 'トークンが無効、または失効している。Notionの接続設定で確認して入力し直してほしい。';
  if (error?.status === 403) return '読み取り権限が足りない。「コンテンツの読み取り」と対象ページの接続設定を確認してほしい。';
  if (error?.status === 404) return 'ページが見つからない、または接続に共有されていない。対象ページの「コネクト」を確認してほしい。';
  if (messages[error?.code]) return messages[error.code];
  if ([429, 529].includes(error?.status)) return 'Notionが混雑しているため再試行の上限に達した。しばらく待って再収集してほしい。';
  return '収集を完了できなかった。しばらく待って再収集してほしい。取得済みの画像は表示している。';
}
function checkAbort(signal) { if (signal?.aborted) throw new DOMException('Aborted', 'AbortError'); }
export function delay(ms, signal) {
  checkAbort(signal);
  return new Promise((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); };
    const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve(); }, ms);
    signal?.addEventListener('abort', abort, { once: true });
  });
}
export function safeImageUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}
function id(value) {
  if (!UUID.test(value || '')) throw new NotionError('invalid_id');
  return value.replace(/-/g, '').toLowerCase();
}
export function parseRoots(text) {
  return [...new Set(text.split(/[\s,、]+/).filter(Boolean).map(value => {
    if (UUID.test(value)) return id(value);
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || !['notion.so', 'www.notion.so', 'app.notion.com'].includes(url.hostname)) throw 0;
      return id(url.pathname.match(/([\da-f]{32}|[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})\/?$/i)?.[1]);
    } catch { throw new NotionError('invalid_id'); }
  }))];
}
function readOnlyRoute(path, method) {
  const resource = '[a-f0-9-]{32,36}';
  return (method === 'POST' && (path === 'search' || new RegExp(`^data_sources/${resource}/query$`).test(path))) ||
    (method === 'GET' && new RegExp(`^(pages|databases|data_sources|blocks)/${resource}(/children)?$`).test(path));
}

export class NotionClient {
  #token; #queue = Promise.resolve(); #controller = new AbortController(); #nextAt = 0;
  constructor(token, { fetchImpl = (...args) => globalThis.fetch(...args), wait = delay, now = Date.now, interval = 350, timeout = 25000, retries = 4, onWait = () => {} } = {}) {
    if (!token?.trim() || /[\s\x00-\x1f]/.test(token.trim())) throw new NotionError('token');
    this.#token = token.trim();
    Object.assign(this, { fetchImpl, wait, now, interval, timeout, retries, onWait });
  }
  disconnect() { this.#token = ''; this.#controller.abort(); }
  request(path, { method = 'GET', body, query, signal } = {}) {
    if (!readOnlyRoute(path, method)) return Promise.reject(new NotionError('route'));
    const task = () => this.#request(path, { method, body, query, signal });
    const pending = this.#queue.then(task);
    this.#queue = pending.catch(() => {});
    return pending;
  }
  async #request(path, { method, body, query, signal }) {
    const combined = new AbortController();
    const abort = () => combined.abort();
    const signals = [signal, this.#controller.signal].filter(Boolean);
    signals.forEach(s => { s.addEventListener('abort', abort, { once: true }); if (s.aborted) abort(); });
    try {
      for (let attempt = 0; ; attempt++) {
        checkAbort(combined.signal);
        await this.wait(Math.max(0, this.#nextAt - this.now()), combined.signal);
        checkAbort(combined.signal);
        this.#nextAt = this.now() + this.interval;
        const url = new URL(path, API);
        if (query) Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));
        const controller = new AbortController();
        const stop = () => controller.abort();
        combined.signal.addEventListener('abort', stop, { once: true });
        let timedOut = false;
        const timer = setTimeout(() => { timedOut = true; controller.abort(); }, this.timeout);
        let response, data;
        try {
          response = await this.fetchImpl(url.href, {
            method, headers: { Authorization: `Bearer ${this.#token}`, 'Notion-Version': NOTION_VERSION, 'Content-Type': 'application/json', Accept: 'application/json' },
            body: body ? JSON.stringify(body) : undefined, signal: controller.signal,
            mode: 'cors', credentials: 'omit', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer',
          });
          try { data = await response.json(); }
          catch (error) { if (response.ok) throw error; data = {}; }
        } catch {
          checkAbort(combined.signal);
          throw new NotionError(timedOut ? 'timeout' : 'network');
        } finally { clearTimeout(timer); combined.signal.removeEventListener('abort', stop); }
        checkAbort(combined.signal);
        if (response.ok) return data;
        if (data?.additional_data?.rate_limit_reason === 'public_api_request_blocked') throw new NotionError('blocked');
        const retryable = [429, 529, 500, 502, 503, 504].includes(response.status);
        if (retryable) {
          const header = response.headers.get('Retry-After') ?? data?.additional_data?.retry_after;
          const seconds = header == null ? NaN : Number(header);
          const retryMs = Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : Math.max(0, Date.parse(header) - this.now()) || 0;
          const pause = Math.max(retryMs, Math.min(30000, 1000 * 2 ** attempt)) + Math.random() * 250;
          this.#nextAt = Math.max(this.#nextAt, this.now() + pause);
          if (attempt < this.retries) { this.onWait(Math.ceil(pause / 1000)); continue; }
        }
        throw new NotionError('api', response.status);
      }
    } finally { signals.forEach(s => s.removeEventListener('abort', abort)); }
  }
  async *paginate(path, { method = 'GET', body = {}, signal } = {}) {
    let cursor, incomplete = false;
    const seen = new Set();
    do {
      checkAbort(signal);
      const params = { page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) };
      const result = await this.request(path, { method, signal, ...(method === 'POST' ? { body: { ...body, ...params } } : { query: params }) });
      incomplete ||= result.request_status?.type === 'incomplete';
      yield result.results || [];
      if (!result.has_more) {
        if (incomplete) throw new NotionError('incomplete');
        break;
      }
      cursor = result.next_cursor;
      if (!cursor || seen.has(cursor)) throw new NotionError('pagination');
      seen.add(cursor);
    } while (true);
  }
}

function plainText(parts) { return (parts || []).map(p => p.plain_text ?? p.text?.content ?? '').join(''); }
function pageInfo(page) {
  const pageId = id(page.id);
  return {
    pageId, pageTitle: plainText(Object.values(page.properties || {}).find(p => p.type === 'title')?.title) || '無題のページ',
    pageUrl: `https://app.notion.com/p/${pageId}`, createdTime: page.created_time || '',
  };
}
function fileInfo(file, imageBlock = false) {
  const url = safeImageUrl(file?.[file?.type]?.url);
  if (!url) return null;
  let pathName = '';
  try { pathName = decodeURIComponent(new URL(url).pathname.split('/').pop()); } catch { /* leave empty */ }
  const fileName = file.name || pathName || '名前のない画像';
  if (!imageBlock && !IMAGE_EXTENSION.test(fileName) && !IMAGE_EXTENSION.test(pathName)) return null;
  return { url, fileName, external: file.type === 'external', expiryTime: file.file?.expiry_time || '' };
}
function blockImage(block, page) {
  if (block.in_trash || !['image', 'file'].includes(block.type)) return null;
  const file = fileInfo(block[block.type], block.type === 'image');
  if (!file) return null;
  return { ...page, ...file, key: `block:${id(block.id)}`, createdTime: block.created_time || page.createdTime, source: { kind: 'block', id: id(block.id) } };
}
function propertyImages(page) {
  const info = pageInfo(page), images = [];
  Object.values(page.properties || {}).filter(p => p.type === 'files').forEach(property => {
    const occurrences = new Map();
    (property.files || []).forEach((file, index) => {
      const occurrence = occurrences.get(file.name || '') || 0;
      occurrences.set(file.name || '', occurrence + 1);
      const meta = fileInfo(file);
      if (meta) images.push({ ...info, ...meta, key: `property:${info.pageId}:${property.id}:${index}`, source: { kind: 'property', pageId: info.pageId, propertyId: property.id, name: file.name || '', occurrence } });
    });
  });
  return images;
}

// In-memory page tree. Data sources are transparent in the grouping controls.
const CLASSIFICATION_NAME = /ペルソナ|persona|分類|キャラクター|character/i;
function pageClassifications(page) {
  return Object.entries(page.properties || {}).flatMap(([name, property]) => {
    let values;
    if (['select', 'status'].includes(property.type)) values = [property[property.type]?.name].filter(Boolean);
    else if (property.type === 'multi_select') values = (property.multi_select || []).map(option => option.name);
    else if (property.type === 'rich_text' && CLASSIFICATION_NAME.test(name)) values = [plainText(property.rich_text).trim()].filter(Boolean);
    else if (property.type === 'formula' && property.formula?.type === 'string' && CLASSIFICATION_NAME.test(name)) values = [property.formula.string?.trim()].filter(Boolean);
    else return [];
    return [{ key: JSON.stringify([name, property.type]), name, type: property.type, values: [...new Set(values.filter(value => typeof value === 'string'))] }];
  });
}

export class ImageGroups {
  nodes = new Map();
  clear() { this.nodes.clear(); }
  add(node) {
    const previous = this.nodes.get(node.id) || {};
    this.nodes.set(node.id, { ...previous, ...node, title: node.title || previous.title || '無題のページ', parentId: node.parentId === undefined ? previous.parentId : node.parentId });
  }
  ancestors(pageId) {
    const result = [], seen = new Set();
    for (let current = pageId; current && !seen.has(current); current = this.nodes.get(current)?.parentId) {
      seen.add(current);
      if (this.nodes.get(current)?.type !== 'data_source') result.push(current);
    }
    return result;
  }
  contains(pageId, branchId) { return !branchId || this.ancestors(pageId).includes(branchId); }
  fieldValues(pageId, key) {
    for (const ancestor of this.ancestors(pageId)) {
      const field = this.nodes.get(ancestor)?.classifications?.find(field => field.key === key);
      if (field) return field.values;
    }
    return [];
  }
  fields(images) {
    const fields = new Map();
    for (const image of images) for (const ancestor of this.ancestors(image.pageId)) {
      for (const field of this.nodes.get(ancestor)?.classifications || []) {
        if (!fields.has(field.key)) fields.set(field.key, { ...field, counts: new Map(), unset: 0 });
      }
    }
    for (const field of fields.values()) for (const image of images) {
      const values = this.fieldValues(image.pageId, field.key);
      if (!values.length) field.unset++;
      values.forEach(value => field.counts.set(value, (field.counts.get(value) || 0) + 1));
    }
    return [...fields.values()].sort((a, b) => Number(CLASSIFICATION_NAME.test(b.name)) - Number(CLASSIFICATION_NAME.test(a.name)) || a.name.localeCompare(b.name, 'ja'));
  }
  summary(images) {
    const counts = new Map(), parents = new Map();
    for (const image of images) {
      const chain = this.ancestors(image.pageId);
      chain.forEach((key, index) => {
        counts.set(key, (counts.get(key) || 0) + 1);
        if (!parents.has(key)) parents.set(key, chain[index + 1] || '');
      });
    }
    const children = new Map();
    counts.forEach((count, key) => {
      const parent = parents.get(key) || '';
      if (!children.has(parent)) children.set(parent, []);
      children.get(parent).push(key);
    });
    children.forEach(keys => keys.sort((a, b) => (this.nodes.get(a)?.title || '').localeCompare(this.nodes.get(b)?.title || '', 'ja') || a.localeCompare(b)));
    const roots = children.get('') || [];
    const scopes = [...counts.keys()].filter(key => children.has(key));
    scopes.sort((a, b) => this.ancestors(a).length - this.ancestors(b).length || (this.nodes.get(a)?.title || '').localeCompare(this.nodes.get(b)?.title || '', 'ja'));
    return { counts, children, scopes, defaultScope: roots.length === 1 && children.has(roots[0]) ? roots[0] : '' };
  }
}

export async function collectImages(client, { roots = [], signal, onImage = () => {}, onNode = () => {}, onProgress = () => {}, onWarning = () => {} } = {}) {
  const visited = new Set(), blocks = new Set(), imageKeys = new Set(), queue = [];
  const progress = { pages: 0, blocks: 0, images: 0, warnings: 0 };
  const emit = () => { checkAbort(signal); onProgress({ ...progress }); };
  const warn = error => { progress.warnings++; onWarning(errorMessage(error)); emit(); };
  const add = image => {
    checkAbort(signal);
    if (image && !imageKeys.has(image.key)) { imageKeys.add(image.key); progress.images++; onImage(image); }
  };
  const announce = (kind, resourceId, object, parentId) => {
    checkAbort(signal);
    const parent = object?.parent;
    const actualParent = parent && ['page_id', 'database_id', 'data_source_id', 'block_id'].includes(parent.type) ? id(parent[parent.type]) : parent?.type === 'workspace' ? null : parentId;
    const title = kind === 'page' && object?.properties ? pageInfo(object).pageTitle : plainText(object?.title) || object?.child_page?.title || object?.child_database?.title;
    onNode({ id: id(resourceId), type: kind, ...(title ? { title } : {}), ...(actualParent !== undefined ? { parentId: actualParent } : {}), ...(kind === 'page' && object?.properties ? { classifications: pageClassifications(object) } : {}) });
  };
  const enqueue = (kind, resourceId, object, parentId) => {
    const normalized = id(resourceId), key = `${kind}:${normalized}`;
    announce(kind, normalized, object, parentId);
    if (!visited.has(key)) { visited.add(key); queue.push({ kind, id: normalized, object }); }
  };
  const guard = async action => {
    try { await action(); }
    catch (error) {
      checkAbort(signal);
      if ([403, 404].includes(error.status) || error.code === 'incomplete') warn(error);
      else throw error;
    }
  };
  async function walk(page) {
    const pending = [page.pageId];
    for (let index = 0; index < pending.length; index++) {
      const parent = pending[index];
      if (blocks.has(parent)) continue;
      blocks.add(parent);
      await guard(async () => {
        for await (const batch of client.paginate(`blocks/${parent}/children`, { signal })) {
          for (const block of batch) {
            checkAbort(signal);
            if (block.in_trash) continue;
            progress.blocks++;
            add(blockImage(block, page));
            if (block.type === 'child_page') { announce('page', block.id, block, page.pageId); enqueue('page', block.id, undefined, page.pageId); }
            else if (block.type === 'child_database') { announce('database', block.id, block, page.pageId); enqueue('database', block.id, undefined, page.pageId); }
            else if (block.type === 'synced_block' && block.synced_block?.synced_from?.block_id) {
              pending.push(id(block.synced_block.synced_from.block_id));
            } else if (block.has_children) pending.push(id(block.id));
          }
          emit();
        }
      });
    }
  }
  async function drain() {
    while (queue.length) {
      checkAbort(signal);
      const resource = queue.shift();
      await guard(async () => {
        if (resource.kind === 'page') {
          const page = resource.object || await client.request(`pages/${resource.id}`, { signal });
          if (page.in_trash) return;
          announce('page', page.id, page);
          propertyImages(page).forEach(add);
          progress.pages++; emit();
          await walk(pageInfo(page));
        } else if (resource.kind === 'database') {
          const database = await client.request(`databases/${resource.id}`, { signal });
          announce('database', resource.id, database);
          if (!database.in_trash) (database.data_sources || []).forEach(source => enqueue('data_source', source.id, undefined, resource.id));
        } else if (resource.kind === 'data_source') {
          // Search returns data sources, not their database containers. Resolve
          // the container once so grouping can reach the actual persona page.
          if (resource.object?.parent?.database_id) enqueue('database', resource.object.parent.database_id);
          for await (const batch of client.paginate(`data_sources/${resource.id}/query`, { method: 'POST', signal })) {
            batch.forEach(page => { if (page.object === 'page') enqueue('page', page.id, page, resource.id); });
          }
        }
      });
    }
  }
  emit();
  if (roots.length) {
    for (const root of roots) await guard(async () => {
      try { const page = await client.request(`pages/${id(root)}`, { signal }); enqueue('page', page.id, page); }
      catch (error) { if (error.status === 404) enqueue('database', root); else throw error; }
    });
    await drain();
  } else {
    for await (const batch of client.paginate('search', { method: 'POST', signal })) {
      batch.forEach(object => { if (['page', 'data_source'].includes(object.object)) enqueue(object.object, object.id, object); });
      await drain();
    }
  }
  return { ...progress };
}

export function needsRefresh(image, now = Date.now()) {
  return Boolean(image.expiryTime) && Date.parse(image.expiryTime) <= now + 60000;
}
export async function refreshImage(client, image, signal) {
  const source = image.source;
  let fresh;
  if (source.kind === 'block') {
    fresh = blockImage(await client.request(`blocks/${source.id}`, { signal }), image);
  } else {
    const page = await client.request(`pages/${source.pageId}`, { signal });
    if (!page.in_trash) fresh = propertyImages(page).find(candidate => candidate.source.propertyId === source.propertyId && candidate.source.name === source.name && candidate.source.occurrence === source.occurrence);
  }
  checkAbort(signal);
  if (!fresh) throw new NotionError('removed');
  return { ...fresh, key: image.key };
}

// Image bytes have a separate path: never attach the API token or send cookies.
// CORS is required so cache:no-store can be enforced; no opaque <img> fallback.
export async function fetchImageBlob(image, { signal, fetchImpl = globalThis.fetch } = {}) {
  const url = safeImageUrl(image.url);
  if (!url) throw new NotionError('media');
  const controller = new AbortController(), abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(abort, 25000);
  try {
    checkAbort(signal);
    const response = await fetchImpl(url, { signal: controller.signal, mode: 'cors', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', redirect: 'error' });
    if (!response.ok) throw new NotionError('media');
    const blob = await response.blob();
    if (!blob.type.startsWith('image/')) throw new NotionError('media');
    checkAbort(signal);
    return blob;
  } catch (error) {
    checkAbort(signal);
    throw new NotionError('media');
  } finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
}
