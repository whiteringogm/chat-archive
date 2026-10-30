import { ImageGroups, NotionClient, NotionError, collectImages, errorMessage, fetchImageBlob, needsRefresh, parseRoots, refreshImage } from './notion-images-core.mjs?v=3';

const $ = id => document.getElementById(`ni-${id}`);
let client = null, scan = null, media = new AbortController(), generation = 0;
let items = [], cards = new Map(), limit = 120, selected = null, frame = 0, running = false;
let loading = 0, pending = [];
const groups = new ImageGroups();
let scopeId = null, branchId = '';
let fieldChoice = null, fieldValue = '';
const initialMessage = 'トークンを入力すると、アクセスを許可したページの画像を収集できる。';

function status(text) { $('status').textContent = text; }
function controls() {
  $('connect').disabled = Boolean(client);
  $('token').disabled = Boolean(client);
  $('rescan').disabled = !client || running;
  $('stop').disabled = !running;
  $('clear').disabled = !items.length && !running;
  $('disconnect').disabled = !client;
}
function release(card) {
  if (card === selected) return;
  if (card.blobUrl) URL.revokeObjectURL(card.blobUrl);
  card.blobUrl = '';
  card.image.removeAttribute('src'); card.image.hidden = true;
  card.placeholder.hidden = false;
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const card = entry.target._card;
    card.visible = entry.isIntersecting;
    if (card.visible) queueImage(card);
    else release(card);
  });
}, { rootMargin: '200px' });

function clearDialog() {
  const previous = selected;
  selected = null;
  $('full-image').removeAttribute('src'); $('full-image').alt = ''; $('full-image').hidden = true;
  $('download').removeAttribute('href'); $('download').removeAttribute('download'); $('download').hidden = true;
  $('open-page').removeAttribute('href');
  $('dialog-title').textContent = '画像'; $('dialog-page').textContent = ''; $('dialog-status').textContent = '';
  if (previous && !previous.visible) release(previous);
}
function resetList() {
  generation++; scan?.abort(); scan = null; running = false;
  media.abort(); media = new AbortController(); pending = [];
  observer.disconnect(); cancelAnimationFrame(frame); frame = 0;
  $('dialog').close(); clearDialog();
  cards.forEach(release); cards.clear(); items = []; limit = 120;
  groups.clear(); scopeId = null; branchId = '';
  fieldChoice = null; fieldValue = '';
  $('grid').replaceChildren(); $('filter').value = '';
  $('progress').textContent = ''; $('warning').textContent = ''; $('warning').hidden = true;
  render(); controls();
}
function disconnect(message = '接続を解除した。トークン・画像・ページ名・一時URLをこの画面のメモリから消去した。') {
  client?.disconnect(); client = null; resetList();
  $('token').value = ''; $('roots').value = ''; $('external').checked = false;
  status(message); controls();
}
function failure(error) {
  if (error.status === 401) disconnect(errorMessage(error));
  else status(errorMessage(error));
}
function refreshCardCopy(card) {
  card.title.textContent = card.item.pageTitle;
  card.file.textContent = card.item.fileName;
  card.link.href = card.item.pageUrl;
  card.button.setAttribute('aria-label', `${card.item.pageTitle}：${card.item.fileName}を拡大`);
  card.image.alt = card.item.fileName;
}
function queueImage(card, force = false) {
  if (card.epoch !== generation) return;
  if (card.item.external && !$('external').checked) {
    card.placeholder.textContent = '外部画像は未読み込み。表示スイッチで有効にできる。';
    return;
  }
  if (!client || card.loading || (!force && (card.blobUrl || card.failed))) return;
  card.loading = true; card.failed = false;
  const requestId = Symbol(); card.requestId = requestId;
  const request = { card, force, epoch: generation, signal: media.signal, connection: client, requestId };
  pending.push(request); pump();
}
function pump() {
  while (loading < 3 && pending.length) {
    const request = pending.shift();
    if (request.epoch !== generation || (!request.card.visible && request.card !== selected)) { request.card.loading = false; continue; }
    loading++;
    loadImage(request).finally(() => { loading--; pump(); });
  }
}
async function loadImage({ card, force, epoch, signal, connection, requestId }) {
  const current = () => epoch === generation && !signal.aborted;
  const progress = text => { if (current()) { card.placeholder.textContent = text; if (selected === card) $('dialog-status').textContent = text; } };
  try {
    progress('画像を読み込み中…');
    let refreshed = false;
    if (force || needsRefresh(card.item)) { card.item = await refreshImage(connection, card.item, signal); refreshed = true; }
    if (card.item.external && !$('external').checked) throw new NotionError('media');
    let blob;
    try { blob = await fetchImageBlob(card.item, { signal }); }
    catch (error) {
      if (signal.aborted || refreshed || card.item.external) throw error;
      card.item = await refreshImage(connection, card.item, signal);
      if (card.item.external && !$('external').checked) throw new NotionError('media');
      blob = await fetchImageBlob(card.item, { signal });
    }
    if (!current() || (!card.visible && card !== selected)) return;
    // An edit may have replaced a Notion-hosted image with an external URL.
    if (card.item.external && !$('external').checked) throw new NotionError('media');
    refreshCardCopy(card);
    const oldUrl = card.blobUrl;
    card.blobUrl = URL.createObjectURL(blob);
    card.image.src = card.blobUrl;
    card.image.hidden = false; card.placeholder.hidden = true;
    card.failed = false;
    if (selected === card) showDialogImage(card);
    if (oldUrl) URL.revokeObjectURL(oldUrl);
  } catch (error) {
    if (!current()) return;
    card.failed = true;
    progress(errorMessage(error));
    if (error.status === 401) failure(error);
  } finally { if (card.requestId === requestId) card.loading = false; }
}
function showDialogImage(card) {
  if (selected !== card) return;
  $('dialog-title').textContent = card.item.fileName;
  $('dialog-page').textContent = card.item.pageTitle;
  $('open-page').href = card.item.pageUrl;
  if (!card.blobUrl) return;
  $('full-image').src = card.blobUrl; $('full-image').alt = card.item.fileName; $('full-image').hidden = false;
  $('download').href = card.blobUrl;
  $('download').download = card.item.fileName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
  $('download').hidden = false; $('dialog-status').textContent = '';
}
function openImage(card) {
  clearDialog(); selected = card;
  showDialogImage(card); $('dialog').showModal();
  if (needsRefresh(card.item)) {
    $('full-image').hidden = true; $('download').hidden = true;
    queueImage(card, true);
  } else if (!card.blobUrl) {
    $('dialog-status').textContent = card.item.external && !$('external').checked ? '外部画像の表示スイッチを有効にしてほしい。' : '画像を読み込み中…';
    queueImage(card, true);
  }
}
function makeCard(item) {
  const element = document.createElement('article'); element.className = 'ni-card';
  const button = document.createElement('button'); button.type = 'button'; button.className = 'ni-thumbnail';
  const image = document.createElement('img'); image.hidden = true; image.decoding = 'async';
  const placeholder = document.createElement('span'); placeholder.textContent = '表示する位置まで移動すると読み込む。';
  button.append(image, placeholder);
  const copy = document.createElement('div'); copy.className = 'ni-card-copy';
  const title = document.createElement('h3'), file = document.createElement('p'), link = document.createElement('a');
  link.textContent = '元のNotionページ ↗'; link.target = '_blank'; link.rel = 'noopener noreferrer';
  copy.append(title, file, link); element.append(button, copy);
  const card = { item, element, button, image, placeholder, title, file, link, epoch: generation, visible: false, loading: false, failed: false, blobUrl: '' };
  element._card = card;
  button.addEventListener('click', () => openImage(card));
  image.addEventListener('error', () => {
    card.failed = true; image.hidden = true; placeholder.hidden = false;
    placeholder.textContent = 'ブラウザがこの画像形式を表示できない。元のNotionページで確認してほしい。';
  });
  refreshCardCopy(card);
  return card;
}
function renderGroups() {
  const fields = groups.fields(items);
  const preferred = fields.find(field => /ペルソナ|persona|分類|キャラクター|character/i.test(field.name) && field.counts.size);
  const choice = fieldChoice ?? preferred?.key ?? '';
  $('group-by').replaceChildren(new Option('親ページの階層', ''), ...fields.map(field => new Option(`${field.name}（Notionの項目）`, field.key)));
  $('group-by').value = choice;
  const field = fields.find(field => field.key === choice);
  $('parent-label').hidden = Boolean(field);
  if (field) {
    const choices = [
      { key: '', label: 'すべて', count: items.length },
      ...[...field.counts].sort(([a], [b]) => a.localeCompare(b, 'ja')).map(([value, count]) => ({ key: JSON.stringify(value), label: value, count })),
      ...(field.unset ? [{ key: 'unset', label: '未設定', count: field.unset }] : []),
    ];
    if (!choices.some(option => option.key === fieldValue)) fieldValue = '';
    $('groups').replaceChildren(...choices.map(option => {
      const button = document.createElement('button'); button.type = 'button';
      button.textContent = `${option.label}（${option.count}枚）`;
      button.setAttribute('aria-pressed', String(option.key === fieldValue));
      button.addEventListener('click', () => { fieldChoice = choice; fieldValue = option.key; limit = 120; render(); });
      return button;
    }));
    return pageId => {
      const values = groups.fieldValues(pageId, choice);
      return !fieldValue || (fieldValue === 'unset' ? !values.length : values.includes(JSON.parse(fieldValue)));
    };
  }
  const summary = groups.summary(items);
  const scope = scopeId ?? summary.defaultScope;
  const options = [new Option('アクセス範囲の先頭', '')];
  summary.scopes.forEach(key => {
    const depth = Math.max(0, groups.ancestors(key).length - 1);
    options.push(new Option(`${'　'.repeat(Math.min(depth, 5))}${groups.nodes.get(key)?.title || '親ページ'}（${summary.counts.get(key)}枚）`, key));
  });
  $('group-parent').replaceChildren(...options); $('group-parent').value = scope;
  const children = summary.children.get(scope) || [];
  if (branchId && !children.includes(branchId)) branchId = '';
  const buttons = ['', ...children].map(key => {
    const button = document.createElement('button'); button.type = 'button';
    const count = key ? summary.counts.get(key) : scope ? summary.counts.get(scope) : items.length;
    button.textContent = `${key ? groups.nodes.get(key)?.title || '親ページ未取得' : 'すべて'}（${count || 0}枚）`;
    button.setAttribute('aria-pressed', String(key === branchId));
    button.addEventListener('click', () => { scopeId = scope; branchId = key; limit = 120; render(); });
    return button;
  });
  $('groups').replaceChildren(...buttons);
  return pageId => groups.contains(pageId, branchId || scope);
}
function render() {
  frame = 0;
  const matchesGroup = renderGroups();
  const query = $('filter').value.trim().toLocaleLowerCase();
  const rows = items.filter(item => matchesGroup(item.pageId) && item.pageTitle.toLocaleLowerCase().includes(query));
  const direction = $('sort').value === 'oldest' ? 1 : -1;
  rows.sort((a,b) => direction * ((Date.parse(a.createdTime) || 0) - (Date.parse(b.createdTime) || 0)) || a.key.localeCompare(b.key));
  const displayed = rows.slice(0, limit), keep = new Set(displayed.map(item => item.key));
  cards.forEach((card, key) => {
    if (!keep.has(key)) { observer.unobserve(card.element); card.visible = false; release(card); cards.delete(key); }
  });
  const elements = displayed.map(item => {
    if (!cards.has(item.key)) cards.set(item.key, makeCard(item));
    return cards.get(item.key).element;
  });
  $('grid').replaceChildren(...elements);
  elements.forEach(element => observer.observe(element));
  $('count').textContent = `${rows.length}枚 / 収集済み ${items.length}枚`;
  $('empty').hidden = rows.length > 0;
  $('empty').textContent = query ? '一致するページの画像はない。' : running ? '画像を収集中。見つかった画像から順に表示する。' : items.length ? '表示できる画像はない。' : 'まだ画像を収集していない。';
  $('more').hidden = rows.length <= limit;
  $('more').textContent = `続きを表示（${displayed.length} / ${rows.length}枚）`;
  controls();
}
function scheduleRender() { if (!frame) frame = requestAnimationFrame(render); }
async function startScan(roots) {
  resetList(); running = true; scan = new AbortController();
  const epoch = generation, connection = client;
  controls(); status('Notionのページを収集中…'); scheduleRender();
  try {
    const result = await collectImages(connection, {
      roots, signal: scan.signal,
      onNode: node => { if (epoch === generation) { groups.add(node); scheduleRender(); } },
      onImage: item => { if (epoch === generation) { items.push(item); scheduleRender(); } },
      onProgress: p => { if (epoch === generation) $('progress').textContent = `${p.pages}ページ・${p.blocks}ブロック確認 / ${p.images}枚 / 取得できなかった対象 ${p.warnings}件`; },
      onWarning: message => { if (epoch === generation) { $('warning').hidden = false; $('warning').textContent = message; } },
    });
    if (epoch === generation) status(result.warnings ? '収集が終わった。一部に取得できなかった対象がある。下の案内を確認してほしい。' : result.images ? '収集が完了した。画像を選ぶと拡大できる。' : '画像が見つからなかった。対象ページの接続権限、検索への反映、画像形式を確認してほしい。');
  } catch (error) { if (epoch === generation) failure(error); }
  finally { if (epoch === generation) { running = false; scan = null; render(); controls(); } }
}
$('connect-form').addEventListener('submit', event => {
  event.preventDefault();
  if (client) return;
  try {
    const roots = parseRoots($('roots').value);
    client = new NotionClient($('token').value, { onWait: seconds => { if (client) status(`Notionの通信制限・混雑のため約${seconds}秒待って再試行する。`); } });
    $('token').value = '';
    startScan(roots);
  } catch (error) { $('token').value = ''; failure(error); }
});
$('rescan').addEventListener('click', () => { try { startScan(parseRoots($('roots').value)); } catch (error) { failure(error); } });
$('stop').addEventListener('click', () => scan?.abort());
$('clear').addEventListener('click', () => { resetList(); status('画像一覧を消去した。再収集すると作り直せる。トークンは接続解除までこのタブに保持する。'); });
$('disconnect').addEventListener('click', () => disconnect());
$('filter').addEventListener('input', () => { limit = 120; scheduleRender(); });
$('group-parent').addEventListener('change', () => { scopeId = $('group-parent').value; branchId = ''; limit = 120; render(); });
$('group-by').addEventListener('change', () => { fieldChoice = $('group-by').value; fieldValue = ''; branchId = ''; limit = 120; render(); });
$('sort').addEventListener('change', scheduleRender);
$('more').addEventListener('click', () => { limit += 120; render(); });
$('size').addEventListener('change', () => { $('grid').className = `ni-grid ni-size-${$('size').value}`; });
$('external').addEventListener('change', () => {
  // Cancel all in-flight image requests so a disabled external image cannot reappear.
  media.abort(); media = new AbortController(); pending = [];
  $('dialog').close(); clearDialog();
  cards.forEach(card => { card.loading = false; card.failed = false; if (card.item.external) release(card); });
  cards.forEach(card => { if (card.visible) queueImage(card); });
});
$('close').addEventListener('click', () => $('dialog').close());
$('dialog').addEventListener('close', clearDialog);
$('full-image').addEventListener('error', () => {
  if (selected) { $('full-image').hidden = true; $('dialog-status').textContent = 'ブラウザがこの画像形式を表示できない。元のNotionページで確認してほしい。'; }
});
$('refresh-image').addEventListener('click', () => { if (selected) queueImage(selected, true); });
$('theme').addEventListener('change', () => document.body.classList.toggle('dark', $('theme').value === 'dark'));
try { $('theme').value = JSON.parse(localStorage.getItem('seishi-settings-v2') || '{}').theme === 'dark' ? 'dark' : 'light'; } catch { /* no archive access required */ }
document.body.classList.toggle('dark', $('theme').value === 'dark');
window.addEventListener('pagehide', () => disconnect(initialMessage));
window.addEventListener('pageshow', event => { if (event.persisted) disconnect(initialMessage); });
// Only public static app files are installed by the worker. API/media are bypassed.
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
controls();
renderGroups();
