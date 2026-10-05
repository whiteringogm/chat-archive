/* Attachment metadata only. File contents and Notion credentials never enter the archive. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.SeishiAssetLinks = api;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";
  const FORMAT = "seishi-asset-links";
  function notionPageUrl(value) {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || url.username || url.password || url.port ||
        !["app.notion.com", "www.notion.so", "notion.so"].includes(host) ||
        !/[a-f0-9]{32}/i.test(url.pathname.replace(/-/g, "")))
      throw new Error("NotionのページURLを指定してください。ファイルの直接URLは使えません。");
    url.search = "";
    url.hash = "";
    return url.href;
  }
  function readManifest(data) {
    if (data?.format !== FORMAT || data.version !== 1 || !Array.isArray(data.assets))
      throw new Error("添付リンクの対応表ではありません。");
    return data.assets.map((raw) => {
      if (raw.sourceRole !== "assistant" || raw.canonical !== true)
        throw new Error("正史のAI出力と確認された添付だけを読み込めます。");
      for (const key of ["sessionId", "messageId", "fileName", "notionUrl"])
        if (typeof raw[key] !== "string" || !raw[key].trim())
          throw new Error(`対応表に${key}がありません。`);
      const verifiedAt = Date.parse(raw.verifiedAt);
      if (!Number.isFinite(verifiedAt)) throw new Error("正史を確認した日時がありません。");
      return {
        sessionId: raw.sessionId,
        messageId: raw.messageId,
        sessionTitle: String(raw.sessionTitle || "添付のある会話"),
        sessionTime: Number.isFinite(raw.sessionTime) ? raw.sessionTime : 0,
        fileName: raw.fileName,
        notionUrl: notionPageUrl(raw.notionUrl),
        anchorAfterMessageId: typeof raw.anchorAfterMessageId === "string" ? raw.anchorAfterMessageId : "",
        sourceRef: typeof raw.sourceRef === "string" ? raw.sourceRef : "",
        kind: raw.kind === "image" ? "image" : "file",
        sha256: typeof raw.sha256 === "string" ? raw.sha256 : "",
        sourceRole: "assistant",
        canonical: true,
        verifiedAt: new Date(verifiedAt).toISOString(),
      };
    });
  }
  function keyOf(asset) {
    return JSON.stringify([asset.messageId, asset.sourceRef || asset.fileName]);
  }
  function prepareImport(sessions, assets) {
    const byId = new Map(sessions.map((s) => [s.id, s]));
    let created = 0;
    for (const asset of assets) {
      let session = byId.get(asset.sessionId);
      if (!session) {
        session = { id: asset.sessionId, title: asset.sessionTitle, time: asset.sessionTime,
          updateTime: 0, messages: [], models: [], folder: "未分類", persona: "未分類",
          namedSelections: [], notes: [], assetOnly: true };
        created++;
      }
      if (session.messages.some((m) => m.id === asset.messageId && m.role !== "assistant"))
        throw new Error("ユーザーの発言にはAI生成の添付を追加できません。");
      if (asset.anchorAfterMessageId && !session.messages.some((m) => m.id === asset.anchorAfterMessageId && m.role === "user"))
        throw new Error("添付位置に対応するユーザー発言がありません。");
      const saved = new Map((session.externalAssets || []).map((a) => [keyOf(a), a]));
      saved.set(keyOf(asset), asset);
      byId.set(session.id, { ...session, externalAssets: [...saved.values()] });
    }
    return { sessions: [...byId.values()], created, imported: assets.length };
  }
  function visibleAssets(session) {
    return (session.externalAssets || []).filter((a) => {
      if (a.sourceRole !== "assistant" || a.canonical !== true) return false;
      try { notionPageUrl(a.notionUrl); } catch { return false; }
      const message = session.messages.find((m) => m.id === a.messageId);
      if (message && message.role !== "assistant") return false;
      // A newer complete export can select a different regenerated answer.
      if (Array.isArray(session.canonicalMessageIds) &&
          !session.canonicalMessageIds.includes(a.messageId) &&
          Number(session.updateTime) * 1000 >= Date.parse(a.verifiedAt)) return false;
      return true;
    });
  }
  function replaceReferences(text, assets) {
    const targets = new Map(assets.filter((a) => a.sourceRef.startsWith("sandbox:"))
      .map((a) => [a.sourceRef, notionPageUrl(a.notionUrl)]));
    // A page link must not become an <img> pointing to a Notion HTML page.
    return String(text).replace(/(!?)\[([^\]]*)\]\((sandbox:[^)]+)\)/g,
      (whole, image, label, ref) => targets.has(ref)
        ? `[${image ? "画像: " : ""}${label}](${targets.get(ref)})` : whole);
  }
  function canonicalIds(conversation) {
    const map = conversation.mapping || {}, seen = new Set(), ids = [];
    let id = conversation.current_node;
    while (id && map[id] && !seen.has(id)) {
      seen.add(id);
      const node = map[id], m = node.message;
      if (m && ["assistant", "user"].includes(m.author?.role)) ids.push(m.id || id);
      id = node.parent;
    }
    return ids;
  }
  return { FORMAT, notionPageUrl, readManifest, keyOf, prepareImport, visibleAssets,
    replaceReferences, canonicalIds };
});
