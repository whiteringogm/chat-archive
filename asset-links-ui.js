/* Import verified Notion page links without importing image/file bytes. */
(() => {
  const api = SeishiAssetLinks;
  const section = document.createElement("section");
  section.className = "manager attachment-link-manager";
  section.innerHTML = '<strong>Notionの添付リンク</strong><p class="muted">画像・ファイルを保存したNotionページへのリンクを、元の発言に追加します。</p><label class="backup-import">添付リンクの対応表を読み込む<input id="assetMapFile" type="file" accept=".json,application/json" hidden></label><details><summary>JSONを貼り付けて追加</summary><label>添付リンクの対応表<textarea id="assetMapText" rows="5" placeholder="対応表のJSONを貼り付け"></textarea></label><button id="assetMapPaste" type="button">貼り付けた対応表を読み込む</button></details><p id="assetMapSummary" class="muted" role="status"></p>';
  const form = document.querySelector("#settings form");
  const dataSection = form.querySelector(".settings-data-section");
  if (dataSection) dataSection.append(section);
  else form.querySelector(".dialog-actions").before(section);
  const style = document.createElement("style");
  style.textContent = '.external-asset-links{display:grid;gap:8px;margin:12px 0}.external-asset-link{display:block;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:var(--card);color:var(--ink);text-decoration:none;overflow-wrap:anywhere}.external-asset-link:hover{border-color:var(--accent)}.external-asset-link small{display:block;margin-top:3px;color:var(--muted)}.external-asset-supplement{margin-top:20px;padding-top:14px;border-top:1px solid var(--line)}';
  document.head.append(style);
  const baseNormalize = normalize;
  normalize = function (raw) {
    const conversations = Array.isArray(raw) ? raw : raw.conversations || [];
    const ids = new Map(conversations.map((c, i) => [c.id || String(i), api.canonicalIds(c)]));
    return baseNormalize(raw).map((s) => ({ ...s, canonicalMessageIds: ids.get(s.id) || [] }));
  };
  const baseMerge = merge;
  merge = function (incoming) {
    const attachments = new Map(all.filter((s) => s.externalAssets?.length)
      .map((s) => [s.id, s.externalAssets]));
    baseMerge(incoming);
    for (const session of all) {
      if (attachments.has(session.id)) session.externalAssets = attachments.get(session.id);
      if (session.messages.length) delete session.assetOnly;
    }
  };
  function cards(assets) {
    const container = document.createElement("div");
    container.className = "external-asset-links";
    for (const asset of assets) {
      const link = document.createElement("a");
      link.className = "external-asset-link";
      link.href = api.notionPageUrl(asset.notionUrl);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const name = document.createElement("strong");
      name.textContent = `${asset.kind === "image" ? "画像" : "ファイル"} · ${asset.fileName}`;
      const action = document.createElement("small");
      action.textContent = "Notionで開く ↗";
      link.append(name, action);
      container.append(link);
    }
    return container;
  }
  function summary() {
    const total = all.reduce((n, s) => n + (s.externalAssets?.length || 0), 0);
    const visible = all.reduce((n, s) => n + api.visibleAssets(s).length, 0);
    $("assetMapSummary").textContent = `保存先リンク ${total}件${visible < total ? `（現在の正史から外れた${total - visible}件は非表示）` : ""}`;
  }
  const baseViewer = renderViewer;
  renderViewer = function (options) {
    const result = baseViewer(options);
    summary();
    const session = all.find((s) => s.id === selected);
    const conversation = document.querySelector("#viewer .conversation");
    if (!session || !conversation) return result;
    const assets = api.visibleAssets(session), used = new Set();
    if (session.assetOnly && !session.messages.length) {
      const empty = [...conversation.querySelectorAll("p.muted")].find((p) => p.textContent === "該当する発言がありません。");
      if (empty) empty.textContent = "この会話の本文はまだ読み込まれていません。保存した添付は以下から開けます。";
    }
    for (const message of session.messages) {
      const matches = assets.filter((a) => a.messageId === message.id);
      if (!matches.length) continue;
      const node = document.getElementById(`msg-${message.id}`);
      if (!node || message.hidden) { matches.forEach((a) => used.add(api.keyOf(a))); continue; }
      if (!sessionMessageQuery.trim()) {
        const body = node.querySelector(".body");
        if (body) body.innerHTML = renderMarkdown(api.replaceReferences(message.text, matches));
      }
      node.append(cards(matches));
      matches.forEach((a) => used.add(api.keyOf(a)));
    }
    if (!sessionMessageQuery.trim() && !sessionModelFilter) {
      const anchored = new Map();
      for (const asset of assets) {
        if (used.has(api.keyOf(asset)) || !asset.anchorAfterMessageId) continue;
        const anchor = session.messages.find((m) => m.id === asset.anchorAfterMessageId && m.role === "user" && !m.hidden);
        const node = anchor && document.getElementById(`msg-${anchor.id}`);
        if (!node) continue;
        if (!anchored.has(node)) anchored.set(node, []);
        anchored.get(node).push(asset); used.add(api.keyOf(asset));
      }
      for (const [node, items] of anchored) node.after(cards(items));
    }
    const supplemental = assets.filter((a) => !used.has(api.keyOf(a)) &&
      !used.has(api.keyOf(a)) && !session.messages.some((m) => m.id === a.messageId));
    if (supplemental.length && !sessionMessageQuery.trim() && !sessionModelFilter) {
      const block = document.createElement("section");
      block.className = "external-asset-supplement";
      const heading = document.createElement("h3");
      heading.textContent = "元チャットから保存した添付";
      block.append(heading, cards(supplemental));
      conversation.append(block);
    }
    return result;
  };
  async function importText(text) {
    const assets = api.readManifest(JSON.parse(text));
    const plan = api.prepareImport(all, assets);
    // Persist first: an invalid file or storage failure must not overwrite edits.
    await dbSet(STORE, plan.sessions);
    all = plan.sessions;
    rebuildFilters(); renderList(); renderViewer();
    $("assetMapSummary").textContent = `${plan.imported}件のリンクを追加しました${plan.created ? `。添付用の会話を${plan.created}件追加しました` : ""}。`;
  }
  function importError(err) {
    alert(`添付リンクを読み込めませんでした。${err.message || "ファイルをご確認ください。"}`);
  }
  $("assetMapFile").onchange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      await importText(await file.text());
    } catch (err) {
      importError(err);
    }
  };
  $("assetMapPaste").onclick = async () => {
    const button = $("assetMapPaste");
    button.disabled = true;
    try {
      await importText($("assetMapText").value);
      $("assetMapText").value = "";
    } catch (err) { importError(err); }
    finally { button.disabled = false; }
  };
  const attachmentDialog = document.createElement("dialog");
  attachmentDialog.className = "attachment-browser";
  attachmentDialog.innerHTML = '<h2>添付一覧</h2><p class="muted">画像・ファイルはNotionで開きます。</p><label>会話名・ファイル名で検索<input type="search" class="attachment-search"></label><label>種類<select class="attachment-kind"><option value="">すべて</option><option value="image">画像</option><option value="file">ファイル</option></select></label><p class="attachment-count" role="status"></p><div class="attachment-results"></div><button type="button" class="attachment-close">閉じる</button>';
  document.body.append(attachmentDialog);
  const browserStyle = document.createElement("style");
  browserStyle.textContent = '.attachment-browser{width:min(680px,calc(100vw - 24px));max-height:85dvh;overflow:auto;background:var(--paper);color:var(--ink);border:1px solid var(--line);border-radius:16px;padding:18px}.attachment-browser label{display:grid;gap:6px;margin:12px 0}.attachment-browser input,.attachment-browser select{width:100%;min-height:44px}.attachment-results{display:grid;gap:12px}.attachment-result{padding:12px;border:1px solid var(--line);border-radius:12px;overflow-wrap:anywhere}.attachment-result p{margin:0 0 8px}.attachment-result button,.attachment-close,.attachment-list-open{min-height:44px}.attachment-list-open{margin:8px 0;padding:10px 14px;border:1px solid var(--accent);border-radius:12px;background:var(--paper);color:var(--ink);font-weight:800}.attachment-close{position:sticky;bottom:0;width:100%;background:var(--paper);color:var(--ink)}';
  document.head.append(browserStyle);
  function attachmentRows() {
    const query = attachmentDialog.querySelector("input").value.trim().toLocaleLowerCase();
    const kind = attachmentDialog.querySelector("select").value;
    const rows = all.filter((s) => !s.trashedAt).flatMap((session) => api.visibleAssets(session)
      .filter((asset) => !session.messages.some((m) => m.id === asset.messageId && m.hidden))
      .filter((asset) => !asset.anchorAfterMessageId || !session.messages.some((m) => m.id === asset.anchorAfterMessageId && m.hidden))
      .map((asset) => ({ session, asset })))
      .filter(({ session, asset }) => (!kind || asset.kind === kind) &&
        (!query || `${session.title} ${asset.fileName}`.toLocaleLowerCase().includes(query)));
    const results = attachmentDialog.querySelector(".attachment-results");
    results.replaceChildren();
    attachmentDialog.querySelector(".attachment-count").textContent = `${rows.length}件`;
    for (const { session, asset } of rows) {
      const item = document.createElement("article"); item.className = "attachment-result";
      const title = document.createElement("p"); title.textContent = session.title;
      const open = cards([asset]);
      const jump = document.createElement("button"); jump.type = "button"; jump.textContent = "会話の位置へ";
      jump.onclick = () => {
        attachmentDialog.close(); sessionMessageQuery = ""; sessionModelFilter = "";
        openSession(session.id);
        requestAnimationFrame(() => {
          const id = session.messages.some((m) => m.id === asset.messageId) ? asset.messageId : asset.anchorAfterMessageId;
          const node = id && document.getElementById(`msg-${id}`);
          (node || document.querySelector(".external-asset-supplement") || $("viewer"))?.scrollIntoView({ block: "center" });
        });
      };
      item.append(title, open, jump); results.append(item);
    }
    if (!rows.length) { const empty = document.createElement("p"); empty.textContent = "該当する添付はありません。"; results.append(empty); }
  }
  attachmentDialog.querySelector("input").oninput = attachmentRows;
  attachmentDialog.querySelector("select").onchange = attachmentRows;
  attachmentDialog.querySelector(".attachment-close").onclick = () => attachmentDialog.close();
  function attachmentEntry() {
    const button = document.createElement("button"); button.type = "button";
    button.className = "attachment-list-open"; button.textContent = "画像・ファイルの添付一覧";
    button.onclick = () => { attachmentRows(); attachmentDialog.showModal(); };
    return button;
  }
  section.prepend(attachmentEntry());
  const homeButton = document.querySelector(".home-button");
  if (homeButton) homeButton.after(attachmentEntry());
  const viewerWithAttachments = renderViewer;
  renderViewer = function (options) {
    const result = viewerWithAttachments(options);
    const conversation = document.querySelector("#viewer .conversation");
    if (conversation) conversation.prepend(attachmentEntry());
    return result;
  };
  summary();
})();
