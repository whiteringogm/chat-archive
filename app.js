const navStyle = document.createElement("style");
navStyle.textContent = `main{transition:grid-template-columns .2s ease}body.sidebar-collapsed main{grid-template-columns:0 1fr}aside{background:var(--paper);transition:transform .2s ease,opacity .2s ease}body.sidebar-collapsed aside{transform:translateX(-100%);opacity:0;pointer-events:none}.sidebar-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.sidebar-head .icon-btn{display:none}.home-button{width:100%;margin:0 0 14px;padding:11px 13px;border:1px solid var(--accent);border-radius:12px;background:#fff;color:var(--accent);font-weight:800;text-align:left}.session{text-align:initial}.session-meta{font-size:12px;color:var(--muted);margin-top:3px}.match-preview{margin:10px 0 0;padding:9px 10px;border-radius:10px;background:#f5f0f5;color:#554d59;font-size:12px;line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.open-session{width:100%;margin-top:10px;padding:9px 12px;border:1px solid var(--accent);border-radius:10px;background:var(--accent);color:#fff;font-weight:800}.sidebar-backdrop{display:none}.floating-menu{position:fixed;right:18px;bottom:18px;z-index:20;padding:11px 15px;border:1px solid #a58cab;border-radius:999px;background:#261f2d;color:#fff;font-weight:800;box-shadow:0 8px 28px #0004}@media(max-width:760px){main,body.sidebar-collapsed main{height:auto;display:block}.sidebar-head .icon-btn{display:block}aside,body.sidebar-collapsed aside{position:fixed;inset:0 auto 0 0;z-index:31;width:min(88vw,380px);max-height:none;border-right:1px solid var(--line);border-bottom:0;box-shadow:12px 0 36px #0003;transform:translateX(-105%);opacity:1;pointer-events:none}body.sidebar-open aside{transform:translateX(0);pointer-events:auto}.sidebar-backdrop{position:fixed;inset:0;z-index:30;border:0;background:#1f182688}body.sidebar-open .sidebar-backdrop{display:block}.viewer{min-height:70dvh}}`;
document.head.append(navStyle);
const bulkStyle = document.createElement("style");
bulkStyle.textContent = `.browser-session-row{display:grid;grid-template-columns:auto 1fr;align-items:stretch;border:1px solid var(--line);border-radius:15px;background:#fff;overflow:hidden}.browser-session-row.selected{border-color:var(--accent);background:#f7f0f8;box-shadow:0 4px 18px #4d385118}.browser-session-row .browser-session{border:0;border-radius:0;background:transparent}.session-check{display:grid;place-items:center;width:50px;border-right:1px solid var(--line);cursor:pointer}.session-check input{position:absolute;opacity:0;pointer-events:none}.session-check span{width:22px;height:22px;border:2px solid #b6a9b8;border-radius:7px;background:#fff}.session-check input:checked+span{border-color:var(--accent);background:var(--accent);box-shadow:inset 0 0 0 4px #fff}.select-all{padding:9px 13px;border:1px solid var(--line);border-radius:11px;background:#fff;color:var(--accent);font-weight:800}.has-bulk-bar{padding-bottom:100px}.bulk-move-bar{position:sticky;bottom:14px;z-index:10;margin:22px auto 0;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid #a58cab;border-radius:16px;background:#261f2df2;color:#fff;box-shadow:0 12px 36px #0004;backdrop-filter:blur(10px)}.bulk-move-controls{display:flex;align-items:center;gap:8px}.bulk-move-controls select{min-width:170px;border:0}.bulk-move-controls button{padding:10px 13px;border:0;border-radius:10px;background:#fff;color:#35283a;font-weight:800}.bulk-move-controls .bulk-delete{background:#b9475e;color:#fff}.bulk-move-controls .bulk-cancel{background:transparent;color:#fff;border:1px solid #a58cab}.bulk-move-controls button:disabled{opacity:.45;cursor:not-allowed}@media(max-width:760px){.bulk-move-bar{align-items:stretch;flex-direction:column;bottom:76px}.bulk-move-controls{display:grid;grid-template-columns:1fr auto auto}.bulk-move-controls .bulk-cancel{grid-column:1/-1}.session-check{width:46px}}`;
document.head.append(bulkStyle);
const titleSearchStyle = document.createElement("style");
titleSearchStyle.textContent = `.search-label{display:block;margin-bottom:9px;color:var(--muted);font-size:12px;font-weight:800}.search-label input{margin-top:4px}.search-select-all{width:100%;margin-bottom:9px;padding:9px 12px;border:1px solid var(--accent);border-radius:11px;background:#fff;color:var(--accent);font-weight:800}.search-session{display:grid;grid-template-columns:auto 1fr;padding:0;overflow:hidden}.search-session>div{padding:13px;min-width:0}.search-session .session-check{width:42px}.search-bulk-bar{position:sticky;bottom:0;z-index:12;margin-top:10px;padding:11px;border-radius:14px;background:#261f2df2;color:#fff;box-shadow:0 8px 24px #0004}.search-bulk-bar strong{display:block;margin-bottom:8px}.search-bulk-controls{display:grid;grid-template-columns:1fr auto;gap:7px}.search-bulk-controls select{min-width:0;border:0}.search-bulk-controls button{padding:9px;border:0;border-radius:10px;background:#fff;color:#35283a;font-weight:800}.search-bulk-controls .bulk-cancel{grid-column:1/-1;background:transparent;color:#fff;border:1px solid #a58cab}`;
document.head.append(titleSearchStyle);
const themeStyle = document.createElement("style");
themeStyle.textContent = `
body.dark{color-scheme:dark;--ink:#eee8f0;--muted:#afa4b4;--paper:#17131b;--card:#221c27;--line:#403646;--accent:#c39ace;--user:#34273a}
body.dark header{background:#110e14}body.dark aside,body.dark dialog,body.dark dialog form{background:var(--paper);color:var(--ink)}
body.dark input,body.dark select,body.dark textarea,body.dark button:not(.floating-menu):not(.open-session):not(.bulk-delete),body.dark .message,body.dark .memory-card,body.dark .memory-entry>button,body.dark .browser-session-row,body.dark .folder-card,body.dark .count-badge{background:var(--card);color:var(--ink)}
body.dark .message.user{background:var(--user)}body.dark .match-preview,body.dark .saved-selection-nav{background:#2a222f;color:var(--ink)}
body.dark .message.saved-selection{background:#3c321c}body.dark .message.user.saved-selection{background:#493b20}
.markdown-body{white-space:normal}.markdown-body>*:first-child{margin-top:0}.markdown-body>*:last-child{margin-bottom:0}.markdown-body p{margin:.65em 0;white-space:pre-wrap}.markdown-body h1,.markdown-body h2,.markdown-body h3{margin:1em 0 .45em;font-family:inherit;line-height:1.35}.markdown-body h1{font-size:1.45em}.markdown-body h2{font-size:1.28em}.markdown-body h3{font-size:1.12em}.markdown-body ul,.markdown-body ol{margin:.6em 0;padding-left:1.7em}.markdown-body blockquote{margin:.7em 0;padding:.2em .9em;border-left:4px solid var(--accent);color:var(--muted)}.markdown-body pre{overflow:auto;padding:12px;border-radius:10px;background:#1d1921;color:#f5eef7;white-space:pre}.markdown-body code{padding:.1em .35em;border-radius:5px;background:#00000014;font-family:ui-monospace,SFMono-Regular,monospace}.markdown-body pre code{padding:0;background:transparent}.markdown-body a{color:var(--accent);text-decoration:underline}.trash-card{margin-top:10px}.trash-actions{display:flex;gap:8px;flex-wrap:wrap}.trash-actions button{padding:8px 11px;border:1px solid var(--line);border-radius:9px}.trash-actions .permanent-delete{color:#b9475e;border-color:#b9475e}.sync-manager{padding-top:14px;border-top:1px solid var(--line)}
`;
document.head.append(themeStyle);
const messageCopyStyle = document.createElement("style");
messageCopyStyle.textContent = `.message-select{display:inline-flex;align-items:center;gap:6px;margin-right:7px;color:var(--muted);font-size:11px;font-weight:800;cursor:pointer}.message-select input{width:18px;min-height:18px;margin:0;accent-color:var(--accent)}.range-select{margin-right:7px;padding:5px 8px;border:1px solid #cabdcd;border-radius:8px;background:#fff;color:var(--accent);font-size:11px;font-weight:800}.message.copy-selected{border-color:var(--accent);box-shadow:0 4px 18px #4d38511f}.message.selection-anchor{box-shadow:inset 4px 0 var(--accent),0 4px 18px #4d38511f}.message.saved-selection{background:#fff7dc;border-color:#d9bd67;box-shadow:inset 5px 0 #d9bd67}.message.user.saved-selection{background:#f4e8c8}.message-copy-bar{position:sticky;bottom:14px;z-index:15;margin:24px auto 0;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid #a58cab;border-radius:16px;background:#261f2df2;color:#fff;box-shadow:0 12px 36px #0004;backdrop-filter:blur(10px)}.message-copy-actions{display:flex;gap:8px;flex-wrap:wrap}.message-copy-actions button{padding:10px 13px;border:1px solid #a58cab;border-radius:10px;background:#fff;color:#35283a;font-weight:800}.message-copy-actions .copy-cancel{background:transparent;color:#fff}.saved-selection-nav{margin:14px 0 20px;padding:12px;border:1px solid var(--line);border-radius:14px;background:#f8f3f8}.saved-selection-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:9px}.saved-selection-head strong{font-size:13px}.saved-selection-head span{font-size:11px;color:var(--muted)}.saved-selection-list{display:flex;gap:7px;flex-wrap:wrap}.saved-selection-list button{border:1px solid #cabdcd;border-radius:999px;background:#fff;color:var(--accent);padding:8px 11px;font-weight:800}.saved-selection-list button.active{border-color:#d0ad42;background:#fff2bc;color:#674f0e}.saved-selection-actions{display:flex;justify-content:flex-end;margin-top:9px}.saved-selection-actions button{border:1px solid #e2b8c1;border-radius:10px;background:#fff;color:#a13b50;padding:7px 10px}.message-label-wrap{display:flex;align-items:baseline;gap:8px;min-width:0}.message-time{color:var(--muted);font-size:10px;letter-spacing:0;white-space:nowrap}.memory-card{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:15px 17px;border:1px solid var(--line);border-radius:15px;background:#fff;text-align:left}.memory-card:hover{border-color:#d0ad42;box-shadow:0 5px 18px #8a6b1820}.memory-card strong{display:block;margin-bottom:4px;color:var(--ink)}.memory-card small{display:block;color:var(--muted);line-height:1.45}.memory-card .memory-mark{font-size:24px;color:#b88e19}.memory-list{display:grid;gap:9px}.memory-entry{display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center}.memory-entry>button:first-child{width:100%;padding:15px;border:1px solid var(--line);border-radius:14px;background:#fff;text-align:left}.memory-entry>button:first-child:hover{border-color:#d0ad42}.memory-entry strong,.memory-entry small{display:block}.memory-entry small{margin-top:4px;color:var(--muted)}.memory-entry .memory-copy,.memory-entry .memory-delete{padding:10px;border:1px solid var(--line);border-radius:10px;background:#fff;font-weight:800}.memory-entry .memory-copy{color:var(--accent)}.memory-entry .memory-delete{border-color:#e2b8c1;color:#a13b50}.folder-persona-setting{display:flex;align-items:center;gap:10px;margin-top:8px}.folder-persona-setting label{font-size:12px;font-weight:800;color:var(--muted)}.folder-persona-setting select{width:auto;min-width:180px}@media(max-width:760px){.message-copy-bar{bottom:76px;align-items:stretch;flex-direction:column}.message-copy-actions{display:grid;grid-template-columns:1fr 1fr}.message-copy-actions .copy-cancel{grid-column:1/-1}.folder-persona-setting{align-items:stretch;flex-direction:column}.folder-persona-setting select{width:100%}.message-head>span:last-child{display:flex;align-items:center;flex-wrap:wrap;justify-content:flex-end;gap:3px}.message-head{align-items:flex-start}.message-label-wrap{align-items:flex-start;flex-direction:column;gap:1px}.memory-entry{grid-template-columns:1fr 1fr}.memory-entry>button:first-child{grid-column:1/-1}.memory-entry .memory-copy,.memory-entry .memory-delete{width:100%}}`;
document.head.append(messageCopyStyle);
const $ = (id) => document.getElementById(id),
  esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
function openSidebar() {
  if (matchMedia("(max-width:760px)").matches)
    document.body.classList.add("sidebar-open");
  else document.body.classList.remove("sidebar-collapsed");
  $("menuBtn").setAttribute("aria-expanded", "true");
}
function closeSidebar() {
  if (matchMedia("(max-width:760px)").matches)
    document.body.classList.remove("sidebar-open");
  else document.body.classList.add("sidebar-collapsed");
  $("menuBtn").setAttribute("aria-expanded", "false");
}
["search", "model", "persona", "folder", "speaker"].forEach((id) =>
  $(id).addEventListener(
    id === "search" ? "input" : "change",
    (e) => {
      e.stopImmediatePropagation();
      renderList();
    },
    true,
  ),
);
$("menuBtn").onclick = () => {
  const open = matchMedia("(max-width:760px)").matches
    ? document.body.classList.contains("sidebar-open")
    : !document.body.classList.contains("sidebar-collapsed");
  open ? closeSidebar() : openSidebar();
};
$("closeSidebar").onclick = closeSidebar;
$("sidebarBackdrop").onclick = closeSidebar;
$("homeBtn").onclick = () => {
  showFolders();
  if (matchMedia("(max-width:760px)").matches) closeSidebar();
};
const STORE = "seishi-archive-v2",
  SETTINGS = "seishi-settings-v2",
  DB_NAME = "seishi-archive",
  DB_STORE = "archive",
  BACKUP_FORMAT = "seishi-archive-backup",
  BACKUP_VERSION = 1,
  BUILTIN_PERSONAS = [
    "🕯️ かげちゃん",
    "🌕 まんちゃん",
    "🔦 ひかちゃん",
    "未分類",
  ];
let all = [],
  selected = "",
  currentFolder = "",
  viewMode = "folders",
  bulkSelected = new Set(),
  messageSelected = new Set(),
  messageSelectionAnchor = "",
  activeNamedSelection = "",
  settings = {
    userName: "あなた",
    assistantName: "ChatGPT",
    replacements: "",
    theme: "light",
    customFolders: [],
    customPersonas: [],
    folderPersonas: {},
    defaultsVersion: 4,
  };
function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(DB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function dbGet(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(DB_STORE).objectStore(DB_STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function dbSet(key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).put(value, key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}
async function dbDelete(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    tx.objectStore(DB_STORE).delete(key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}
function textOf(parts) {
  if (typeof parts === "string") return parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((p) => (typeof p === "string" ? p : p?.text || ""))
    .join("\n");
}
function modelOf(m) {
  return (
    m?.metadata?.model_slug ||
    m?.metadata?.default_model_slug ||
    m?.metadata?.model ||
    "不明"
  );
}
function canonical(c) {
  const map = c.mapping || {},
    out = [];
  let id = c.current_node;
  const seen = new Set();
  while (id && map[id] && !seen.has(id)) {
    seen.add(id);
    const n = map[id],
      m = n.message;
    if (m && ["user", "assistant"].includes(m.author?.role)) {
      const text = textOf(m.content?.parts).trim();
      if (text)
        out.push({
          id: m.id || id,
          role: m.author.role,
          text,
          time: m.create_time || null,
          model: modelOf(m),
          hidden: false,
        });
    }
    id = n.parent;
  }
  return out.reverse();
}
function guessPersona(c, msgs) {
  const hay = (
    (c.title || "") +
    "\n" +
    msgs
      .slice(0, 8)
      .map((x) => x.text)
      .join("\n")
  ).toLowerCase();
  if (/まんちゃん|温間満月/.test(hay)) return "🌕 まんちゃん";
  if (/かげちゃん|影山誠実/.test(hay)) return "🕯️ かげちゃん";
  if (/ひかちゃん|光谷虚実/.test(hay)) return "🔦 ひかちゃん";
  return "未分類";
}
function normalize(raw) {
  return (Array.isArray(raw) ? raw : raw.conversations || [])
    .map((c, i) => {
      const messages = canonical(c);
      return {
        id: c.id || String(i),
        title: c.title || "無題の会話",
        time: c.create_time || 0,
        updateTime: c.update_time || c.create_time || 0,
        messages,
        models: [
          ...new Set(
            messages.filter((x) => x.role === "assistant").map((x) => x.model),
          ),
        ],
        persona: guessPersona(c, messages),
        folder: "未分類",
      };
    })
    .filter((x) => x.messages.length);
}
function merge(incoming) {
  const byId = new Map(all.map((x) => [x.id, x]));
  for (const fresh of incoming) {
    const old = byId.get(fresh.id);
    if (!old) {
      byId.set(fresh.id, fresh);
      continue;
    }
    const edits = new Map(old.messages.map((m) => [m.id, m]));
    fresh.messages = fresh.messages.map((m) => {
      const e = edits.get(m.id);
      return e ? { ...m, text: e.text, hidden: e.hidden } : m;
    });
    fresh.folder = old.folder || "未分類";
    fresh.persona = old.persona || fresh.persona;
    fresh.namedSelections = Array.isArray(old.namedSelections)
      ? old.namedSelections
      : [];
    delete fresh.trashedAt;
    delete fresh.originalFolder;
    byId.set(fresh.id, fresh);
  }
  all = [...byId.values()].sort((a, b) => b.time - a.time);
}
async function save() {
  localStorage.setItem(SETTINGS, JSON.stringify(settings));
  try {
    await dbSet(STORE, all);
  } catch (err) {
    console.error(err);
    alert("端末内への保存に失敗しました。空き容量をご確認ください。");
  }
}
async function load() {
  try {
    const stored = await dbGet(STORE);
    if (stored) all = stored;
    else {
      const legacy = localStorage.getItem(STORE);
      if (legacy) {
        all = JSON.parse(legacy) || [];
        await dbSet(STORE, all);
        localStorage.removeItem(STORE);
      }
    }
    settings = {
      ...settings,
      ...JSON.parse(localStorage.getItem(SETTINGS) || "{}"),
      defaultsVersion: 4,
    };
    settings.customFolders = Array.isArray(settings.customFolders)
      ? settings.customFolders
      : [];
    settings.customPersonas = Array.isArray(settings.customPersonas)
      ? settings.customPersonas
      : [];
    settings.folderPersonas =
      settings.folderPersonas && typeof settings.folderPersonas === "object"
        ? settings.folderPersonas
        : {};
    settings.theme = settings.theme === "dark" ? "dark" : "light";
    all.forEach((s) => {
      s.namedSelections = Array.isArray(s.namedSelections)
        ? s.namedSelections
        : [];
    });
  } catch (err) {
    console.error(err);
  }
  $("userName").value = settings.userName;
  $("assistantName").value = settings.assistantName;
  $("replacements").value = settings.replacements;
  if ($("theme")) $("theme").value = settings.theme;
  applyTheme();
}
function applyTheme() {
  document.body.classList.toggle("dark", settings.theme === "dark");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = settings.theme === "dark" ? "#110e14" : "#261f2d";
}
function effectivePersona(s) {
  return settings.folderPersonas[s.folder || "未分類"] || s.persona || "未分類";
}
function replaceText(text) {
  let out = String(text ?? "");
  for (const line of settings.replacements.split("\n")) {
    const [from, ...rest] = line.split("=>"),
      to = rest.join("=>");
    if (from?.trim() && rest.length)
      out = out.split(from.trim()).join(to.trim());
  }
  return out;
}
function nameOf(m, s) {
  if (m.role === "user") return settings.userName || "ユーザー";
  const persona = effectivePersona(s);
  return persona !== "未分類"
    ? persona.replace(/^\S+\s*/, "")
    : settings.assistantName || "ChatGPT";
}
function date(t) {
  return t
    ? new Intl.DateTimeFormat("ja-JP", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(t * 1000))
    : "日時不明";
}
function messageDate(t) {
  return t
    ? new Intl.DateTimeFormat("ja-JP", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(t * 1000))
    : "時刻不明";
}
function visibleMessages(s) {
  return s.messages.filter((m) => !m.hidden);
}
function messageMatchesFilters(x, model, speaker) {
  return (
    !x.hidden &&
    (!model || (x.role === "assistant" && x.model === model)) &&
    (!speaker || x.role === speaker)
  );
}
function filtered() {
  const tq = $("titleSearch").value.trim().toLowerCase(),
    q = $("search").value.trim().toLowerCase(),
    m = $("model").value,
    p = $("persona").value,
    f = $("folder").value,
    speaker = $("speaker").value;
  return all.filter(
    (s) =>
      !s.trashedAt &&
      (!tq || replaceText(s.title).toLowerCase().includes(tq)) &&
      (!m || s.models.includes(m)) &&
      (!p || effectivePersona(s) === p) &&
      (!f || s.folder === f) &&
      (!speaker ||
        s.messages.some((x) => messageMatchesFilters(x, m, speaker))) &&
      (!q ||
        (!m && !speaker && replaceText(s.title).toLowerCase().includes(q)) ||
        s.messages.some(
          (x) =>
            messageMatchesFilters(x, m, speaker) &&
            replaceText(x.text).toLowerCase().includes(q),
        )),
  );
}
function activeSessions() {
  return all.filter((s) => !s.trashedAt);
}
function matchInfo(s, q) {
  if (!q) return { count: 0, preview: "" };
  const needle = q.toLowerCase(),
    model = $("model").value,
    speaker = $("speaker").value,
    hits = s.messages.filter(
      (x) =>
        messageMatchesFilters(x, model, speaker) &&
        replaceText(x.text).toLowerCase().includes(needle),
    ),
    first = hits[0];
  if (!first)
    return {
      count:
        !model &&
        !speaker &&
        replaceText(s.title).toLowerCase().includes(needle)
          ? 1
          : 0,
      preview: "タイトルに一致",
    };
  const text = replaceText(first.text),
    at = text.toLowerCase().indexOf(needle),
    start = Math.max(0, at - 55),
    end = Math.min(text.length, at + q.length + 90);
  return {
    count: hits.length,
    preview:
      (start ? "…" : "") +
      text.slice(start, end) +
      (end < text.length ? "…" : ""),
  };
}
function renderSearchBulk() {
  const box = $("searchBulk"),
    chosen = activeSessions().filter((s) => bulkSelected.has(s.id));
  if (!chosen.length) {
    box.innerHTML = "";
    return;
  }
  const destinations = folderOptions();
  box.innerHTML = `<div class="search-bulk-bar"><strong>${chosen.length}件を選択中</strong><div class="search-bulk-controls"><select id="searchBulkFolder" aria-label="移動先フォルダ">${destinations.map((x) => `<option value="${esc(x)}">${esc(x)}</option>`).join("")}</select><button id="searchMoveSessions">移動</button><button id="searchCancelBulk" class="bulk-cancel">選択解除</button></div></div>`;
  $("searchCancelBulk").onclick = () => {
    bulkSelected.clear();
    renderList();
  };
  $("searchMoveSessions").onclick = async () => {
    const destination = $("searchBulkFolder").value;
    if (!destination) return;
    all.forEach((s) => {
      if (bulkSelected.has(s.id)) s.folder = destination;
    });
    const moved = bulkSelected.size;
    bulkSelected.clear();
    await save();
    rebuildFilters();
    renderList();
    if (viewMode === "folders") renderViewer();
    alert(`${moved}件のセッションを「${destination}」へ移動しました。`);
  };
}
function renderList() {
  const rows = filtered(),
    q = $("search").value.trim(),
    tq = $("titleSearch").value.trim(),
    selectable = Boolean(tq),
    allVisibleSelected =
      selectable &&
      rows.length > 0 &&
      rows.every((s) => bulkSelected.has(s.id));
  $("summary").textContent =
    `${rows.length} / ${activeSessions().length} セッション · ${activeSessions().reduce((n, s) => n + s.messages.filter((m) => !m.hidden).length, 0)} 発言`;
  $("sessions").innerHTML =
    (selectable && rows.length
      ? `<button id="toggleAllSearchResults" class="search-select-all">${allVisibleSelected ? `検索結果 ${rows.length}件の選択を解除` : `検索結果 ${rows.length}件をすべて選択`}</button>`
      : "") +
    (rows
      .map((s) => {
        const hit = matchInfo(s, q),
          content = `<strong>${tq ? mark(s.title, tq) : esc(replaceText(s.title))}</strong><div class="session-meta">${esc(date(s.time))} · ${esc(effectivePersona(s))} · ${s.messages.filter((m) => !m.hidden).length}件${q ? ` · ${hit.count}件一致` : ""}</div>${q ? `<div class="match-preview">${mark(hit.preview, q)}</div>` : ""}<button class="open-session" data-id="${esc(s.id)}">このセッションを開く</button>`;
        return selectable
          ? `<article class="session search-session ${bulkSelected.has(s.id) ? "active" : ""}"><label class="session-check" aria-label="${esc(replaceText(s.title))}を選択"><input type="checkbox" data-search-select-id="${esc(s.id)}" ${bulkSelected.has(s.id) ? "checked" : ""}><span></span></label><div>${content}</div></article>`
          : `<article class="session ${s.id === selected ? "active" : ""}">${content}</article>`;
      })
      .join("") || '<p class="muted">該当する会話がありません。</p>');
  if ($("toggleAllSearchResults"))
    $("toggleAllSearchResults").onclick = () => {
      if (allVisibleSelected)
        rows.forEach((s) => bulkSelected.delete(s.id));
      else rows.forEach((s) => bulkSelected.add(s.id));
      renderList();
    };
  document
    .querySelectorAll(".open-session")
    .forEach((b) => (b.onclick = () => openSession(b.dataset.id)));
  document.querySelectorAll("[data-search-select-id]").forEach(
    (c) =>
      (c.onchange = () => {
        c.checked
          ? bulkSelected.add(c.dataset.searchSelectId)
          : bulkSelected.delete(c.dataset.searchSelectId);
        renderList();
      }),
  );
  renderSearchBulk();
}
function mark(text, q) {
  let h = esc(replaceText(text));
  if (!q) return h;
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return h.replace(
    new RegExp(safe, "gi"),
    (x) => `<mark class="hit">${x}</mark>`,
  );
}
function inlineMarkdown(text) {
  return esc(text)
    .replace(/`([^`\n]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_\n]+)__/g, "<strong>$1</strong>")
    .replace(/~~([^~\n]+)~~/g, "<del>$1</del>")
    .replace(/(^|[^\w])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function renderMarkdown(text) {
  const lines = replaceText(text).replace(/\r\n?/g, "\n").split("\n");
  let html = "", paragraph = [], list = "", code = false, codeLines = [];
  const flushParagraph = () => {
    if (!paragraph.length) return;
    html += `<p>${inlineMarkdown(paragraph.join("\n"))}</p>`;
    paragraph = [];
  };
  const closeList = () => {
    if (list) html += `</${list}>`;
    list = "";
  };
  for (const line of lines) {
    if (/^```/.test(line)) {
      flushParagraph(); closeList();
      if (code) {
        html += `<pre><code>${esc(codeLines.join("\n"))}</code></pre>`;
        codeLines = [];
      }
      code = !code;
      continue;
    }
    if (code) { codeLines.push(line); continue; }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    const bullet = line.match(/^\s*[-*+]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    const quote = line.match(/^>\s?(.*)$/);
    if (heading) {
      flushParagraph(); closeList();
      const level = heading[1].length;
      html += `<h${level}>${inlineMarkdown(heading[2])}</h${level}>`;
    } else if (bullet || ordered) {
      flushParagraph();
      const kind = bullet ? "ul" : "ol";
      if (list !== kind) { closeList(); html += `<${kind}>`; list = kind; }
      html += `<li>${inlineMarkdown((bullet || ordered)[1])}</li>`;
    } else if (quote) {
      flushParagraph(); closeList();
      html += `<blockquote>${inlineMarkdown(quote[1])}</blockquote>`;
    } else if (!line.trim()) {
      flushParagraph(); closeList();
    } else {
      closeList(); paragraph.push(line);
    }
  }
  flushParagraph(); closeList();
  if (codeLines.length) html += `<pre><code>${esc(codeLines.join("\n"))}</code></pre>`;
  return html;
}
function renderViewer() {
  const s = all.find((x) => x.id === selected);
  if (!s) return;
  s.namedSelections = Array.isArray(s.namedSelections) ? s.namedSelections : [];
  const q = $("search").value.trim(),
    model = $("model").value,
    speaker = $("speaker").value,
    shown = visibleMessages(s),
    chosen = shown.filter((m) => messageSelected.has(m.id)),
    active = s.namedSelections.find((x) => x.id === activeNamedSelection),
    activeIds = new Set(active?.messageIds || []),
    folderFixed = settings.folderPersonas[s.folder || "未分類"] || "";
  $("viewer").innerHTML =
    `<article class="conversation"><div class="title-row"><div><h2>${esc(replaceText(s.title))}</h2><div class="meta">${esc(date(s.time))} · ${esc(s.models.join(", ") || "モデル不明")}</div></div><div class="tools"><button id="exportMd">Markdown</button><button id="exportJson">JSON</button></div></div><div class="saved-selection-nav"><div class="saved-selection-head"><strong>保存した思い出</strong><span>${s.namedSelections.length}件</span></div>${s.namedSelections.length ? `<div class="saved-selection-list">${s.namedSelections.map((x) => `<button data-memory-id="${esc(x.id)}" class="${x.id === activeNamedSelection ? "active" : ""}">${esc(x.title)}（${x.messageIds.length}件）</button>`).join("")}</div>${active ? '<div class="saved-selection-actions"><button id="deleteNamedSelection">この思い出を削除</button></div>' : ""}` : '<p class="muted">発言を選択して「タイトルをつけて保存」すると、ここや思い出一覧から開けます。</p>'}</div><div class="session-fields"><label>ペルソナ<select id="sessionPersona" ${folderFixed ? "disabled" : ""}>${personaOptions()
      .map(
        (x) =>
          `<option ${x === s.persona ? "selected" : ""}>${esc(x)}</option>`,
      )
      .join(
        "",
      )}</select>${folderFixed ? `<span class="field-note">フォルダ設定「${esc(folderFixed)}」を適用中</span>` : ""}</label><label>フォルダ<select id="sessionFolder">${folderOptions()
      .map(
        (x) => `<option ${x === s.folder ? "selected" : ""}>${esc(x)}</option>`,
      )
      .join(
        "",
      )}</select><span class="field-note">新規追加は「表示設定」からできます。</span></label></div>${shown.map((m) => `<div class="message ${m.role} ${messageSelected.has(m.id) ? "copy-selected" : ""} ${m.id === messageSelectionAnchor ? "selection-anchor" : ""} ${activeIds.has(m.id) ? "saved-selection" : ""}" id="msg-${esc(m.id)}"><div class="message-head"><span class="message-label-wrap"><span class="label">${esc(nameOf(m, s))}${m.role === "assistant" ? " · " + esc(m.model || "モデル不明") : ""}</span><time class="message-time">${esc(messageDate(m.time))}</time></span><span>${messageSelected.size && m.id !== messageSelectionAnchor ? `<button class="range-select" data-range-mid="${esc(m.id)}">ここまで選択</button>` : ""}<label class="message-select"><input type="checkbox" data-copy-mid="${esc(m.id)}" ${messageSelected.has(m.id) ? "checked" : ""}>選択</label><button class="edit icon-btn" data-mid="${esc(m.id)}">編集</button><button class="hide icon-btn" data-mid="${esc(m.id)}">非表示</button></span></div><div class="body markdown-body">${q && messageMatchesFilters(m, model, speaker) ? mark(m.text, q) : renderMarkdown(m.text)}</div></div>`).join("") || '<p class="muted">表示できる発言がありません。</p>'}${chosen.length ? `<div class="message-copy-bar"><strong>${chosen.length}件の発言を選択中</strong><div class="message-copy-actions"><button id="saveNamedSelection">タイトルをつけて保存</button><button id="copyMessages">テキストをコピー</button><button id="cancelMessageCopy" class="copy-cancel">選択解除</button></div></div>` : ""}<details class="hidden-box"><summary>非表示の発言（${s.messages.filter((m) => m.hidden).length}）</summary>${s.messages
      .filter((m) => m.hidden)
      .map(
        (m) =>
          `<button class="restore" data-mid="${esc(m.id)}">${esc(nameOf(m, s))}の発言を戻す</button>`,
      )
      .join("")}</details></article>`;
  const rerenderKeepingPosition = () => {
    const viewerTop = $("viewer").scrollTop,
      pageTop = window.scrollY;
    renderViewer();
    const restorePosition = () => {
      $("viewer").scrollTop = viewerTop;
      window.scrollTo(0, pageTop);
    };
    restorePosition();
    requestAnimationFrame(restorePosition);
  };
  $("sessionPersona").onchange = (e) => {
    s.persona = e.target.value;
    save();
    rebuildFilters();
    renderList();
    renderViewer();
  };
  $("sessionFolder").onchange = (e) => {
    s.folder = e.target.value;
    activeNamedSelection = "";
    save();
    rebuildFilters();
    renderList();
    renderViewer();
  };
  document.querySelectorAll("[data-copy-mid]").forEach(
    (c) =>
      (c.onchange = () => {
        if (c.checked) {
          messageSelected.add(c.dataset.copyMid);
          messageSelectionAnchor = c.dataset.copyMid;
        } else {
          messageSelected.delete(c.dataset.copyMid);
          if (messageSelectionAnchor === c.dataset.copyMid)
            messageSelectionAnchor =
              shown.findLast?.((m) => messageSelected.has(m.id))?.id ||
              shown.filter((m) => messageSelected.has(m.id)).at(-1)?.id ||
              "";
        }
        rerenderKeepingPosition();
      }),
  );
  document.querySelectorAll("[data-range-mid]").forEach(
    (b) =>
      (b.onclick = () => {
        const anchorIndex = shown.findIndex(
            (m) => m.id === messageSelectionAnchor,
          ),
          targetIndex = shown.findIndex((m) => m.id === b.dataset.rangeMid);
        if (anchorIndex < 0 || targetIndex < 0) return;
        const [start, end] =
          anchorIndex < targetIndex
            ? [anchorIndex, targetIndex]
            : [targetIndex, anchorIndex];
        shown.slice(start, end + 1).forEach((m) => messageSelected.add(m.id));
        messageSelectionAnchor = b.dataset.rangeMid;
        rerenderKeepingPosition();
      }),
  );
  document.querySelectorAll("[data-memory-id]").forEach(
    (b) =>
      (b.onclick = () => {
        activeNamedSelection = b.dataset.memoryId;
        renderViewer();
        const range = s.namedSelections.find(
            (x) => x.id === activeNamedSelection,
          ),
          first = range?.messageIds.find((id) =>
            shown.some((m) => m.id === id),
          );
        if (first)
          setTimeout(
            () =>
              $(`msg-${first}`)?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              }),
            0,
          );
      }),
  );
  if ($("deleteNamedSelection"))
    $("deleteNamedSelection").onclick = async () => {
      if (!active) return;
      s.namedSelections = s.namedSelections.filter((x) => x.id !== active.id);
      activeNamedSelection = "";
      await save();
      renderViewer();
    };
  if ($("saveNamedSelection"))
    $("saveNamedSelection").onclick = async () => {
      const title = prompt("この選択範囲のタイトル");
      if (!title?.trim()) return;
      const item = {
        id: `range-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: title.trim(),
        messageIds: shown
          .filter((m) => messageSelected.has(m.id))
          .map((m) => m.id),
      };
      s.namedSelections.push(item);
      activeNamedSelection = item.id;
      messageSelected.clear();
      messageSelectionAnchor = "";
      await save();
      renderViewer();
      setTimeout(
        () =>
          $(`msg-${item.messageIds[0]}`)?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          }),
        0,
      );
    };
  if ($("cancelMessageCopy"))
    $("cancelMessageCopy").onclick = () => {
      messageSelected.clear();
      messageSelectionAnchor = "";
      renderViewer();
    };
  if ($("copyMessages"))
    $("copyMessages").onclick = async () => {
      const text = copyTextOf(s);
      try {
        await navigator.clipboard.writeText(text);
        alert(`${chosen.length}件の発言をコピーしました。`);
      } catch {
        const area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.append(area);
        area.select();
        document.execCommand("copy");
        area.remove();
        alert(`${chosen.length}件の発言をコピーしました。`);
      }
    };
  document.querySelectorAll(".hide").forEach(
    (b) =>
      (b.onclick = () => {
        s.messages.find((m) => m.id === b.dataset.mid).hidden = true;
        messageSelected.delete(b.dataset.mid);
        if (messageSelectionAnchor === b.dataset.mid)
          messageSelectionAnchor = "";
        save();
        renderViewer();
        renderList();
      }),
  );
  document.querySelectorAll(".restore").forEach(
    (b) =>
      (b.onclick = () => {
        s.messages.find((m) => m.id === b.dataset.mid).hidden = false;
        save();
        renderViewer();
        renderList();
      }),
  );
  document.querySelectorAll(".edit").forEach(
    (b) =>
      (b.onclick = () => {
        const m = s.messages.find((x) => x.id === b.dataset.mid),
          next = prompt("発言を編集", m.text);
        if (next !== null) {
          m.text = next;
          save();
          renderViewer();
          renderList();
        }
      }),
  );
  $("exportMd").onclick = () =>
    download(`${safeName(s.title)}.md`, toMarkdown(s), "text/markdown");
  $("exportJson").onclick = () =>
    download(
      `${safeName(s.title)}.json`,
      JSON.stringify(exportSession(s), null, 2),
      "application/json",
    );
  if (q) $("viewer").querySelector(".hit")?.scrollIntoView({ block: "center" });
}
function personaOptions() {
  return [
    ...new Set([
      ...BUILTIN_PERSONAS,
      ...settings.customPersonas,
      ...activeSessions().map((x) => x.persona).filter(Boolean),
    ]),
  ];
}
function folderOptions() {
  return [
    ...new Set([
      "未分類",
      ...settings.customFolders,
      ...activeSessions().map((x) => x.folder || "未分類"),
    ]),
  ];
}
function rebuildFilters() {
  const m = $("model").value,
    f = $("folder").value,
    p = $("persona").value;
  $("model").innerHTML =
    '<option value="">すべてのモデル</option>' +
    [...new Set(activeSessions().flatMap((x) => x.models))]
      .sort()
      .map((x) => `<option>${esc(x)}</option>`)
      .join("");
  $("model").value = m;
  $("folder").innerHTML =
    '<option value="">すべてのフォルダ</option>' +
    folderOptions()
      .sort()
      .map((x) => `<option>${esc(x)}</option>`)
      .join("");
  $("folder").value = f;
  $("persona").innerHTML =
    '<option value="">すべてのペルソナ</option>' +
    personaOptions()
      .map((x) => `<option>${esc(x)}</option>`)
      .join("");
  $("persona").value = p;
}
function renderManagers() {
  $("folderChips").innerHTML =
    settings.customFolders
      .map(
        (x) =>
          `<span class="chip">${esc(x)} <button type="button" data-folder="${esc(x)}">×</button></span>`,
      )
      .join("") || '<span class="muted">追加したフォルダはありません。</span>';
  $("personaChips").innerHTML =
    settings.customPersonas
      .map(
        (x) =>
          `<span class="chip">${esc(x)} <button type="button" data-persona="${esc(x)}">×</button></span>`,
      )
      .join("") || '<span class="muted">追加したペルソナはありません。</span>';
  document.querySelectorAll("[data-folder]").forEach(
    (b) =>
      (b.onclick = () => {
        settings.customFolders = settings.customFolders.filter(
          (x) => x !== b.dataset.folder,
        );
        save();
        renderManagers();
        rebuildFilters();
        renderViewer();
      }),
  );
  document.querySelectorAll("[data-persona]").forEach(
    (b) =>
      (b.onclick = () => {
        settings.customPersonas = settings.customPersonas.filter(
          (x) => x !== b.dataset.persona,
        );
        save();
        renderManagers();
        rebuildFilters();
        renderViewer();
      }),
  );
}
function addCustom(kind) {
  const input = $(kind === "folder" ? "newFolder" : "newPersona"),
    value = input.value.trim();
  if (!value) return;
  const key = kind === "folder" ? "customFolders" : "customPersonas";
  if (!settings[key].includes(value)) settings[key].push(value);
  input.value = "";
  save();
  renderManagers();
  rebuildFilters();
  renderViewer();
}
function exportSession(s) {
  return {
    id: s.id,
    title: replaceText(s.title),
    created_at: s.time ? new Date(s.time * 1000).toISOString() : null,
    persona: effectivePersona(s),
    folder: s.folder,
    named_selections: s.namedSelections || [],
    messages: s.messages
      .filter((m) => !m.hidden)
      .map((m) => ({
        id: m.id,
        speaker: nameOf(m, s),
        role: m.role,
        model: m.role === "assistant" ? m.model : null,
        created_at: m.time ? new Date(m.time * 1000).toISOString() : null,
        text: replaceText(m.text),
      })),
  };
}
function copyTextOf(s) {
  return copyTextForIds(s, messageSelected);
}
function copyTextForIds(s, messageIds) {
  const ids = new Set(messageIds);
  return s.messages
    .filter((m) => !m.hidden && ids.has(m.id))
    .map(
      (m) =>
        `${nameOf(m, s)}${m.role === "assistant" ? `・${m.model || "モデル不明"}` : ""}：\n${replaceText(m.text)}`,
    )
    .join("\n\n");
}
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
}
function toMarkdown(s) {
  const x = exportSession(s);
  return (
    `# ${x.title}\n\n- 日時: ${x.created_at || "不明"}\n- ペルソナ: ${x.persona}\n- フォルダ: ${x.folder}\n\n` +
    x.messages
      .map(
        (m) => `## ${m.speaker}${m.model ? `（${m.model}）` : ""}\n\n${m.text}`,
      )
      .join("\n\n") +
    "\n"
  );
}
function safeName(x) {
  return (
    replaceText(x)
      .replace(/[\\/:*?"<>|]/g, "_")
      .slice(0, 80) || "conversation"
  );
}
function download(name, data, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([data], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function backupPayload() {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    settings,
    sessions: all,
  };
}
function byteLabel(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
function updateBackupSummary() {
  const el = $("backupSummary");
  if (!el) return;
  const sessions = all.length;
  const messages = all.reduce((n, s) => n + (s.messages?.length || 0), 0);
  el.textContent = `${sessions.toLocaleString()}セッション・${messages.toLocaleString()}発言を、会話本文と整理情報ごと保存します。`;
}
async function backupBlob() {
  const json = JSON.stringify(backupPayload());
  const source = new Blob([json], { type: "application/json" });
  if (typeof CompressionStream === "undefined")
    return { blob: source, extension: "json" };
  const compressed = await new Response(
    source.stream().pipeThrough(new CompressionStream("gzip")),
  ).blob();
  return { blob: compressed, extension: "json.gz" };
}
async function readBackupFile(file) {
  let text;
  if (file.name.toLowerCase().endsWith(".gz")) {
    if (typeof DecompressionStream === "undefined")
      throw new Error("このブラウザは圧縮バックアップの復元に対応していません。");
    text = await new Response(
      file.stream().pipeThrough(new DecompressionStream("gzip")),
    ).text();
  } else text = await file.text();
  const data = JSON.parse(text);
  if (
    data?.format !== BACKUP_FORMAT ||
    !Number.isInteger(data.version) ||
    data.version > BACKUP_VERSION ||
    !Array.isArray(data.sessions) ||
    !data.settings ||
    typeof data.settings !== "object"
  )
    throw new Error("正史編纂室の完全バックアップではありません。");
  return data;
}
const renderConversation = renderViewer;
function openSession(id) {
  selected = id;
  messageSelected.clear();
  messageSelectionAnchor = "";
  activeNamedSelection = "";
  viewMode = "session";
  renderList();
  renderViewer();
  if (matchMedia("(max-width:760px)").matches) closeSidebar();
}
function showFolders() {
  selected = "";
  currentFolder = "";
  bulkSelected.clear();
  viewMode = "folders";
  renderList();
  renderViewer();
}
function showFolder(folder) {
  selected = "";
  currentFolder = folder;
  bulkSelected.clear();
  viewMode = "folder";
  renderList();
  renderViewer();
}
function memoryItems() {
  return activeSessions()
    .flatMap((session) =>
      (session.namedSelections || []).map((memory) => ({ session, memory })),
    )
    .sort((a, b) => b.session.time - a.session.time);
}
function showMemories() {
  selected = "";
  currentFolder = "";
  bulkSelected.clear();
  viewMode = "memories";
  renderList();
  renderViewer();
}
function showTrash() {
  selected = "";
  currentFolder = "";
  bulkSelected.clear();
  viewMode = "trash";
  renderList();
  renderViewer();
}
function renderTrash() {
  const items = all.filter((s) => s.trashedAt).sort((a, b) => b.trashedAt - a.trashedAt);
  $("viewer").scrollTop = 0;
  $("viewer").innerHTML = `<section class="archive-browser"><nav class="breadcrumbs"><button id="backToFolders">フォルダ一覧</button><span>›</span><strong>ゴミ箱</strong></nav><div class="browser-heading"><div><p class="browser-kicker">TRASH</p><h2>ゴミ箱</h2><p class="muted">最新エクスポートに見つからなかったセッションです。内容は完全削除するまで保持されます。</p></div><span class="count-badge">${items.length} 件</span></div><div class="browser-sessions">${items.map((s) => `<article class="session trash-card"><strong>${esc(replaceText(s.title))}</strong><div class="session-meta">${esc(date(s.time))} · 元のフォルダ：${esc(s.originalFolder || s.folder || "未分類")} · ${s.messages.length}件</div><div class="trash-actions"><button data-open-trash="${esc(s.id)}">内容を見る</button><button data-restore-trash="${esc(s.id)}">元に戻す</button><button class="permanent-delete" data-delete-trash="${esc(s.id)}">完全削除</button></div></article>`).join("") || '<div class="empty browser-empty"><div class="moon">♲</div><h2>ゴミ箱は空です</h2><p>差異確認で不在だったセッションがここへ移動します。</p></div>'}</div></section>`;
  $("backToFolders").onclick = showFolders;
  document.querySelectorAll("[data-open-trash]").forEach((b) => b.onclick = () => openSession(b.dataset.openTrash));
  document.querySelectorAll("[data-restore-trash]").forEach((b) => b.onclick = async () => {
    const s = all.find((x) => x.id === b.dataset.restoreTrash);
    if (!s) return;
    s.folder = s.originalFolder || s.folder || "未分類";
    delete s.originalFolder; delete s.trashedAt;
    await save(); rebuildFilters(); renderList(); renderTrash();
  });
  document.querySelectorAll("[data-delete-trash]").forEach((b) => b.onclick = async () => {
    const s = all.find((x) => x.id === b.dataset.deleteTrash);
    if (!s || !confirm(`「${replaceText(s.title)}」を端末内から完全削除しますか？\n\nこの操作は元に戻せません。`)) return;
    all = all.filter((x) => x.id !== s.id);
    await save(); rebuildFilters(); renderList(); renderTrash();
  });
}
function openMemory(sessionId, memoryId) {
  selected = sessionId;
  messageSelected.clear();
  messageSelectionAnchor = "";
  activeNamedSelection = memoryId;
  viewMode = "session";
  renderList();
  renderViewer();
  const session = all.find((x) => x.id === sessionId);
  const memory = session?.namedSelections?.find((x) => x.id === memoryId);
  const first = memory?.messageIds.find((id) =>
    session.messages.some((message) => message.id === id && !message.hidden),
  );
  if (first)
    setTimeout(
      () =>
        $(`msg-${first}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      0,
    );
  if (matchMedia("(max-width:760px)").matches) closeSidebar();
}
function renderMemories() {
  const items = memoryItems();
  $("viewer").scrollTop = 0;
  $("viewer").innerHTML =
    `<section class="archive-browser"><nav class="breadcrumbs"><button id="backToFolders">フォルダ一覧</button><span>›</span><strong>思い出一覧</strong></nav><div class="browser-heading"><div><p class="browser-kicker">MEMORIES</p><h2>思い出一覧</h2><p class="muted">保存したタイトルを選ぶと元の会話へ移動し、「まるごとコピー」で範囲全文を持ち出せます。</p></div><span class="count-badge">${items.length} 件</span></div><div class="memory-list">${items.map(({ session, memory }) => `<div class="memory-entry"><button data-open-memory="${esc(memory.id)}" data-session-id="${esc(session.id)}"><strong>${esc(memory.title)}</strong><small>${esc(replaceText(session.title))} · ${esc(session.folder || "未分類")} · ${memory.messageIds.length}件</small></button><button class="memory-copy" data-copy-memory="${esc(memory.id)}" data-session-id="${esc(session.id)}">まるごとコピー</button><button class="memory-delete" data-delete-memory="${esc(memory.id)}" data-session-id="${esc(session.id)}">削除</button></div>`).join("") || '<div class="empty browser-empty"><div class="moon">✦</div><h2>保存した思い出はまだありません</h2><p>セッション内で発言を選択し、「タイトルをつけて保存」するとここへ並びます。</p></div>'}</div></section>`;
  $("backToFolders").onclick = showFolders;
  document
    .querySelectorAll("[data-open-memory]")
    .forEach(
      (button) =>
        (button.onclick = () =>
          openMemory(button.dataset.sessionId, button.dataset.openMemory)),
    );
  document.querySelectorAll("[data-copy-memory]").forEach(
    (button) =>
      (button.onclick = async () => {
        const session = all.find((x) => x.id === button.dataset.sessionId);
        const memory = session?.namedSelections?.find(
          (x) => x.id === button.dataset.copyMemory,
        );
        if (!memory) return;
        const text = copyTextForIds(session, memory.messageIds);
        await copyToClipboard(text);
        const count = session.messages.filter(
          (message) =>
            !message.hidden && memory.messageIds.includes(message.id),
        ).length;
        alert(`思い出「${memory.title}」の${count}件をコピーしました。`);
      }),
  );
  document.querySelectorAll("[data-delete-memory]").forEach(
    (button) =>
      (button.onclick = async () => {
        const session = all.find((x) => x.id === button.dataset.sessionId);
        const memory = session?.namedSelections?.find(
          (x) => x.id === button.dataset.deleteMemory,
        );
        if (!memory || !confirm(`思い出「${memory.title}」を削除しますか？`))
          return;
        session.namedSelections = session.namedSelections.filter(
          (x) => x.id !== memory.id,
        );
        await save();
        renderMemories();
      }),
  );
}
function renderFolderBrowser() {
  const folders = folderOptions()
    .map((name) => ({
      name,
      sessions: activeSessions().filter((s) => (s.folder || "未分類") === name),
    }))
    .filter(
      (x) => x.sessions.length || settings.customFolders.includes(x.name),
    );
  $("viewer").scrollTop = 0;
  const memories = memoryItems();
  $("viewer").innerHTML =
    `<section class="archive-browser"><div class="browser-heading"><div><p class="browser-kicker">ARCHIVE</p><h2>フォルダ一覧</h2><p class="muted">フォルダを選ぶと、中のセッションを一覧できます。</p></div><span class="count-badge">${activeSessions().length} セッション</span></div><button id="openMemories" class="memory-card"><span><strong>✦ 思い出一覧</strong><small>タイトルをつけて保存した会話の範囲をまとめて見る</small></span><span class="memory-mark">${memories.length}件 ›</span></button><button id="openTrash" class="memory-card trash-card"><span><strong>♲ ゴミ箱</strong><small>最新エクスポートとの差異で退避したセッションを確認する</small></span><span class="memory-mark">${all.filter((s) => s.trashedAt).length}件 ›</span></button><div class="folder-grid">${folders.map((f) => `<button class="folder-card" data-folder="${esc(f.name)}"><span class="folder-icon">▰</span><strong>${esc(f.name)}</strong><span>${f.sessions.length} セッション</span></button>`).join("") || '<div class="empty browser-empty"><div class="moon">◐</div><h2>会話は外へ送信されません</h2><p>「ログを追加」からJSONを読み込むと、ここにフォルダが並びます。</p></div>'}</div></section>`;
  $("openMemories").onclick = showMemories;
  $("openTrash").onclick = showTrash;
  document
    .querySelectorAll(".folder-card")
    .forEach((b) => (b.onclick = () => showFolder(b.dataset.folder)));
}
function renderFolderSessions(folder) {
  const rows = all
      .filter((s) => !s.trashedAt && (s.folder || "未分類") === folder)
      .sort((a, b) => b.time - a.time),
    chosen = rows.filter((s) => bulkSelected.has(s.id)),
    destinations = folderOptions().filter((x) => x !== folder);
  $("viewer").scrollTop = 0;
  $("viewer").innerHTML =
    `<section class="archive-browser has-bulk-bar"><nav class="breadcrumbs"><button id="backToFolders">フォルダ一覧</button><span>›</span><strong>${esc(folder)}</strong></nav><div class="browser-heading"><div><h2>${esc(folder)}</h2><p class="muted">${rows.length} セッション</p></div>${rows.length ? `<button id="toggleAllSessions" class="select-all">${chosen.length === rows.length ? "選択を解除" : "すべて選択"}</button>` : ""}</div><div class="browser-sessions">${rows.map((s) => `<div class="browser-session-row ${bulkSelected.has(s.id) ? "selected" : ""}"><label class="session-check" aria-label="${esc(replaceText(s.title))}を選択"><input type="checkbox" data-select-id="${esc(s.id)}" ${bulkSelected.has(s.id) ? "checked" : ""}><span></span></label><button class="browser-session" data-id="${esc(s.id)}"><span><strong>${esc(replaceText(s.title))}</strong><small>${esc(date(s.time))} · ${esc(s.persona)}</small></span><span class="chevron">›</span></button></div>`).join("") || '<p class="muted">このフォルダは空です。</p>'}</div>${chosen.length ? `<div class="bulk-move-bar"><strong>${chosen.length}件を選択中</strong><div class="bulk-move-controls"><select id="bulkFolder" aria-label="移動先フォルダ">${destinations.map((x) => `<option value="${esc(x)}">${esc(x)}</option>`).join("")}</select><button id="moveSessions" ${destinations.length ? "" : "disabled"}>まとめて移動</button><button id="deleteSessions" class="bulk-delete">削除</button><button id="cancelBulk" class="bulk-cancel">解除</button></div></div>` : ""}</section>`;
  $("backToFolders").onclick = showFolders;
  document
    .querySelectorAll(".browser-session")
    .forEach((b) => (b.onclick = () => openSession(b.dataset.id)));
  document.querySelectorAll("[data-select-id]").forEach(
    (c) =>
      (c.onchange = () => {
        c.checked
          ? bulkSelected.add(c.dataset.selectId)
          : bulkSelected.delete(c.dataset.selectId);
        renderFolderSessions(folder);
      }),
  );
  if ($("toggleAllSessions"))
    $("toggleAllSessions").onclick = () => {
      if (chosen.length === rows.length) bulkSelected.clear();
      else rows.forEach((s) => bulkSelected.add(s.id));
      renderFolderSessions(folder);
    };
  if ($("cancelBulk"))
    $("cancelBulk").onclick = () => {
      bulkSelected.clear();
      renderFolderSessions(folder);
    };
  if ($("moveSessions"))
    $("moveSessions").onclick = async () => {
      const destination = $("bulkFolder").value;
      if (!destination) return;
      all.forEach((s) => {
        if (bulkSelected.has(s.id)) s.folder = destination;
      });
      const moved = bulkSelected.size;
      bulkSelected.clear();
      await save();
      rebuildFilters();
      renderList();
      renderFolderSessions(folder);
      alert(`${moved}件のセッションを「${destination}」へ移動しました。`);
    };
  if ($("deleteSessions"))
    $("deleteSessions").onclick = async () => {
      const targets = rows.filter((s) => bulkSelected.has(s.id)),
        sample = targets
          .slice(0, 3)
          .map((s) => `・${replaceText(s.title)}`)
          .join("\n"),
        more = targets.length > 3 ? `\nほか${targets.length - 3}件` : "";
      if (
        !confirm(
          `${targets.length}件のセッションを端末内アーカイブから削除します。\n\n${sample}${more}\n\nこの操作は元に戻せません。`,
        )
      )
        return;
      const ids = new Set(targets.map((s) => s.id));
      all = all.filter((s) => !ids.has(s.id));
      bulkSelected.clear();
      await save();
      rebuildFilters();
      renderList();
      renderFolderSessions(folder);
    };
}
const renderFolderSessionsBase = renderFolderSessions;
renderFolderSessions = function (folder) {
  renderFolderSessionsBase(folder);
  const heading = $("viewer").querySelector(".browser-heading>div");
  if (!heading) return;
  const current = settings.folderPersonas[folder] || "";
  heading.insertAdjacentHTML(
    "beforeend",
    `<div class="folder-persona-setting"><label for="folderPersonaSetting">このフォルダの話者</label><select id="folderPersonaSetting"><option value="">セッションごとの設定</option>${personaOptions()
      .filter((x) => x !== "未分類")
      .map(
        (x) =>
          `<option value="${esc(x)}" ${x === current ? "selected" : ""}>${esc(x)}</option>`,
      )
      .join("")}</select></div>`,
  );
  $("folderPersonaSetting").onchange = async (e) => {
    if (e.target.value) settings.folderPersonas[folder] = e.target.value;
    else delete settings.folderPersonas[folder];
    await save();
    rebuildFilters();
    renderList();
    renderFolderSessions(folder);
  };
  document.querySelectorAll(".browser-session small").forEach((node, i) => {
    const s = all
      .filter((x) => (x.folder || "未分類") === folder)
      .sort((a, b) => b.time - a.time)[i];
    if (s) node.textContent = `${date(s.time)} · ${effectivePersona(s)}`;
  });
};
renderViewer = function () {
  if (viewMode === "folders") return renderFolderBrowser();
  if (viewMode === "folder") return renderFolderSessions(currentFolder);
  if (viewMode === "memories") return renderMemories();
  if (viewMode === "trash") return renderTrash();
  const s = all.find((x) => x.id === selected);
  if (!s) {
    viewMode = "folders";
    return renderFolderBrowser();
  }
  renderConversation();
  const conversation = $("viewer").querySelector(".conversation");
  conversation?.insertAdjacentHTML(
    "afterbegin",
    `<nav class="breadcrumbs"><button id="backToFolders">フォルダ一覧</button><span>›</span><button id="backToFolder">${esc(s.folder || "未分類")}</button><span>›</span><strong>セッション</strong></nav>`,
  );
  $("backToFolders").onclick = showFolders;
  $("backToFolder").onclick = () => showFolder(s.folder || "未分類");
};
$("file").onchange = async (e) => {
  const files = [...e.target.files],
    failed = [];
  let count = 0;
  for (const f of files) {
    try {
      const n = normalize(JSON.parse(await f.text()));
      count += n.length;
      merge(n);
    } catch {
      failed.push(f.name);
    }
  }
  await save();
  showFolders();
  rebuildFilters();
  renderList();
  e.target.value = "";
  alert(
    `${files.length}ファイル・${count}セッションを統合し、端末内に保存しました。${failed.length ? ` 読めなかったファイル: ${failed.join(", ")}` : ""}`,
  );
};
$("titleSearch").addEventListener("input", () => {
  if (!$("titleSearch").value.trim()) bulkSelected.clear();
  renderList();
});
["search", "model", "persona", "folder", "speaker"].forEach((id) =>
  $(id).addEventListener(id === "search" ? "input" : "change", () => {
    renderList();
    renderViewer();
  }),
);
$("settingsBtn").onclick = () => {
  renderManagers();
  updateBackupSummary();
  $("settings").showModal();
};
$("addFolder").onclick = () => addCustom("folder");
$("addPersona").onclick = () => addCustom("persona");
$("newFolder").onkeydown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addCustom("folder");
  }
};
$("newPersona").onkeydown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addCustom("persona");
  }
};
$("saveSettings").onclick = () => {
  settings = {
    ...settings,
    theme: $("theme").value === "dark" ? "dark" : "light",
    userName: $("userName").value.trim() || "ユーザー",
    assistantName: $("assistantName").value.trim() || "ChatGPT",
    replacements: $("replacements").value,
  };
  applyTheme();
  save();
  rebuildFilters();
  renderList();
  renderViewer();
};
$("theme").onchange = () => {
  settings.theme = $("theme").value === "dark" ? "dark" : "light";
  applyTheme();
};
$("syncFile").onchange = async (e) => {
  const files = [...e.target.files];
  e.target.value = "";
  if (!files.length) return;
  const incoming = [], failed = [];
  for (const file of files) {
    try { incoming.push(...normalize(JSON.parse(await file.text()))); }
    catch { failed.push(file.name); }
  }
  if (failed.length) {
    alert(`読み込めないファイルがありました：${failed.join(", ")}\n差異確認は実行していません。`);
    return;
  }
  const incomingIds = new Set(incoming.map((s) => s.id));
  const active = activeSessions();
  const missing = active.filter((s) => !incomingIds.has(s.id));
  const existingIds = new Set(all.map((s) => s.id));
  const newCount = incoming.filter((s) => !existingIds.has(s.id)).length;
  const updateCount = incoming.length - newCount;
  const sample = missing.slice(0, 8).map((s) => `・${replaceText(s.title)}`).join("\n");
  const more = missing.length > 8 ? `\nほか${missing.length - 8}件` : "";
  const message = `差異を確認しました。\n\n新規 ${newCount}件\n追加・更新 ${updateCount}件\nゴミ箱候補 ${missing.length}件${missing.length ? `\n\n${sample}${more}` : ""}\n\n実行すると、候補は完全削除せずゴミ箱へ移動します。`;
  if (!confirm(message)) return;
  merge(incoming);
  const now = Date.now();
  all.forEach((s) => {
    if (!s.trashedAt && !incomingIds.has(s.id)) {
      s.originalFolder = s.folder || "未分類";
      s.trashedAt = now;
    }
  });
  await save();
  $("settings").close();
  rebuildFilters(); renderList(); showTrash();
  alert(`${missing.length}件をゴミ箱へ移動しました。新しいエクスポートに再登場したセッションは自動で元へ戻しています。`);
};
$("exportBackup").onclick = async () => {
  const button = $("exportBackup");
  button.disabled = true;
  button.textContent = "バックアップ作成中…";
  try {
    const { blob, extension } = await backupBlob();
    const day = new Date().toLocaleDateString("sv-SE", {
      timeZone: "Asia/Tokyo",
    });
    download(`正史編纂室バックアップ_${day}.${extension}`, blob, blob.type);
    alert(`完全バックアップ（${byteLabel(blob.size)}）を書き出しました。`);
  } catch (err) {
    console.error(err);
    alert(`バックアップの作成に失敗しました。${err.message || ""}`);
  } finally {
    button.disabled = false;
    button.textContent = "バックアップを書き出す";
  }
};
$("backupFile").onchange = async (e) => {
  const file = e.target.files?.[0];
  e.target.value = "";
  if (!file) return;
  try {
    const data = await readBackupFile(file);
    const messages = data.sessions.reduce(
      (n, s) => n + (s.messages?.length || 0),
      0,
    );
    if (
      !confirm(
        `${data.sessions.length.toLocaleString()}セッション・${messages.toLocaleString()}発言のバックアップです。\n現在の端末内データを置き換えて復元しますか？`,
      )
    )
      return;
    all = data.sessions;
    settings = {
      ...settings,
      ...data.settings,
      defaultsVersion: 4,
