/* Explicit diary handoff. No tokens, automatic upload, or background synchronization. */
(() => {
  const cloud = 'https://seishi-mcp-auth.koyamadakun.workers.dev';
  function send(entries) {
    if (!entries.length) return alert('保存する日記を選んでほしい。');
    const nonce = crypto.randomUUID();
    const target = new URL(cloud + '/library/archive.html');
    target.search = new URLSearchParams({ from: location.origin, handoff: nonce });
    const popup = window.open(target.href, '_blank');
    if (!popup) return alert('保存画面を開けなかった。このサイトのポップアップを許可して、もう一度押してほしい。');
    let sent = false;
    const cleanup = () => { clearTimeout(timer); window.removeEventListener('message', receive); };
    const receive = event => {
      if (event.origin !== cloud || event.source !== popup || event.data?.nonce !== nonce) return;
      if (event.data.type === 'seishi-diary-received') { cleanup(); return; }
      if (event.data.type !== 'seishi-diary-ready' || sent) return;
      sent = true;
      popup.postMessage({ type: 'seishi-diary-transfer', nonce, entries: entries.map(entry => ({ id: entry.id, date: entry.date, body: entry.body, kind: entry.kind, persona: entry.persona, personaId: entry.personaId, model: entry.model || '', sessionId: entry.sessionId || null, messageId: entry.messageId || null, sourceTime: entry.sourceTime || null })) }, cloud);
    };
    window.addEventListener('message', receive);
    const timer = setTimeout(() => { cleanup(); if (!sent) alert('保存画面と接続できなかった。開いた画面でログインを済ませてから、編纂室へ戻ってもう一度押してほしい。日記はまだ保存されていない。'); }, 60000);
  }
  function picker() {
    const entries = dlList().slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
    if (!entries.length) return alert('登録済みの日記がまだない。');
    const dialog = document.createElement('dialog'); dialog.className = 'dl-dialog';
    const title = document.createElement('h2'); title.textContent = '非公開ログへ保存する日記';
    const note = document.createElement('p'); note.textContent = '日記を選ぶと、別画面に本文・日付・ペルソナを引き継ぐ。保存は次の確認画面で確定する。';
    const filter = document.createElement('select');
    for (const name of ['', ...new Set(entries.map(entry => dlEntryPersona(entry)))]) { const option = document.createElement('option'); option.value = name; option.textContent = name || 'すべてのペルソナ'; filter.append(option); }
    const list = document.createElement('div'); list.style.cssText = 'max-height:50vh;overflow:auto;margin:12px 0';
    const checks = entries.map(entry => {
      const label = document.createElement('label'); label.style.cssText = 'display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--line)';
      const check = document.createElement('input'); check.type = 'checkbox'; check.style.cssText = 'width:20px;min-height:20px;flex:none';
      const text = document.createElement('span'); text.textContent = `${entry.date} / ${dlEntryPersona(entry)} / ${diaryKindLabel(entry.kind, entry.personaId || entry.persona)}`;
      label.append(check, text); list.append(label); return { check, label, entry };
    });
    filter.onchange = () => checks.forEach(row => { row.label.hidden = Boolean(filter.value && dlEntryPersona(row.entry) !== filter.value); row.label.style.display = row.label.hidden ? 'none' : 'flex'; });
    const recent = document.createElement('button'); recent.type = 'button'; recent.textContent = '表示中の新しい10件を選ぶ'; recent.onclick = () => { let count = 0; checks.forEach(row => { row.check.checked = !row.label.hidden && count++ < 10; }); };
    const actions = document.createElement('div'); actions.className = 'dialog-actions';
    const close = document.createElement('button'); close.textContent = '戻る'; close.onclick = () => dialog.close();
    const next = document.createElement('button'); next.textContent = '選んだ日記を確認画面へ'; next.onclick = () => { const rows = checks.filter(row => row.check.checked).map(row => row.entry); if (!rows.length) return alert('日記を選んでほしい。'); send(rows); dialog.close(); };
    actions.append(close, next); dialog.append(title, note, filter, recent, list, actions); document.body.append(dialog); dialog.addEventListener('close', () => dialog.remove(), { once: true }); dialog.showModal();
  }
  const original = dlRender;
  dlRender = function (...args) {
    const result = original.apply(this, args);
    const tools = document.querySelector('#viewer .dl-tools');
    if (tools && !document.getElementById('dlCloudSave') && !dlCandidateMode) { const button = document.createElement('button'); button.id = 'dlCloudSave'; button.textContent = '非公開ログへまとめて保存'; button.onclick = picker; tools.append(button); }
    document.querySelectorAll('#viewer [data-dle]').forEach(edit => { const button = document.createElement('button'); button.textContent = '非公開ログへ保存'; button.onclick = () => { const entry = dlList().find(row => row.id === edit.dataset.dle); if (entry) send([entry]); }; edit.parentElement.append(button); });
    return result;
  };
})();
