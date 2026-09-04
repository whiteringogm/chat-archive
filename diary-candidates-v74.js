/* diaryCandidatesV74: persona tabs, multi-select bulk save, and direct save. */
(() => {
  const style = document.createElement("style");
  style.textContent = `
  .dl-candidate-tabs{display:flex;gap:7px;overflow-x:auto;margin:0 0 12px;padding:2px 0 4px;scrollbar-width:thin}
  .dl-candidate-tab{flex:0 0 auto;min-height:38px;padding:7px 11px;border:1px solid var(--line);border-radius:999px;background:var(--card);color:var(--muted);font-weight:800;white-space:nowrap}
  .dl-candidate-tab.is-active{border-color:var(--accent);background:var(--accent);color:#fff}
  .dl-candidate-bulk{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:10px 0 12px;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:var(--card)}
  .dl-candidate-bulk-left{display:flex;align-items:center;gap:8px;min-width:0}
  .dl-candidate-bulk strong{font-size:13px;white-space:nowrap}
  .dl-candidate-bulk button{min-height:38px;padding:8px 11px;border:1px solid var(--accent);border-radius:9px;background:var(--paper);color:var(--accent);font-weight:800}
  .dl-candidate-bulk button.primary{background:var(--accent);color:#fff}
  .dl-candidate-bulk button:disabled{opacity:.42;cursor:not-allowed}
  .dl-candidate-select{display:flex;align-items:center;gap:8px;margin:0 0 7px;color:var(--muted);font-size:12px;font-weight:800;cursor:pointer}
  .dl-candidate-select input{width:18px;height:18px;margin:0;accent-color:var(--accent)}
  .dl-candidate.is-selected{border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 18%,transparent)}
  .dl-actions .dl-save-direct{background:var(--accent);color:#fff}
  @media(max-width:600px){.dl-candidate-bulk{align-items:stretch;flex-direction:column}.dl-candidate-bulk-left{justify-content:space-between}.dl-candidate-bulk>button{width:100%}.dl-actions{flex-wrap:wrap}.dl-actions .dl-save-direct{order:2}}
  `;
  document.head.append(style);

  let candidatePersonaFilter = "all";
  const selectedCandidateIds = new Set();

  function candidatePersonaKey(candidate) {
    if (!candidate) return "unknown";
    if (candidate.personaId) return "id:" + candidate.personaId;
    const display = personaDisplay(candidate.persona || "");
    return "name:" + (display || "ペルソナ未設定");
  }

  function candidatePersonaLabel(candidate) {
    return personaDisplay(candidate?.personaId || candidate?.persona || "ペルソナ未設定");
  }

  function candidateGroups() {
    const groups = new Map();
    dlCandidates.forEach(candidate => {
      const key = candidatePersonaKey(candidate);
      if (!groups.has(key)) groups.set(key, { key, label: candidatePersonaLabel(candidate), count: 0 });
      groups.get(key).count += 1;
    });
    return Array.from(groups.values());
  }

  function visibleCandidates() {
    if (candidatePersonaFilter === "all") return dlCandidates.slice();
    return dlCandidates.filter(candidate => candidatePersonaKey(candidate) === candidatePersonaFilter);
  }

  function pruneSelection() {
    const existing = new Set(dlCandidates.map(candidate => candidate.id));
    [...selectedCandidateIds].forEach(id => {
      if (!existing.has(id)) selectedCandidateIds.delete(id);
    });
  }

  function candidateToEntry(candidate, index = 0) {
    const persona = candidatePersonaLabel(candidate);
    const personaId = candidate.personaId || personaIdFor(persona);
    return {
      id: `diary-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      kind: candidate.kind,
      date: candidate.date,
      body: String(candidate.body || "").trim(),
      persona,
      personaId,
      model: candidate.model || "",
      sessionId: candidate.sessionId || null,
      messageId: candidate.messageId || null,
      messageIds: Array.isArray(candidate.messageIds) ? [...candidate.messageIds] : [],
      sourceTime: candidate.sourceTime || null,
      sourceText: candidate.sourceText || "",
      extraction: candidate.extraction || "manual",
      updatedAt: Date.now() + index,
    };
  }

  async function saveCandidatesDirect(candidates) {
    const targets = candidates.filter(Boolean);
    if (!targets.length) return false;

    const invalid = targets.filter(candidate => !candidate.date || !String(candidate.body || "").trim());
    if (invalid.length) {
      alert("記録日か本文が空の候補があります。先に「確認」から内容を整えてください。");
      return false;
    }

    const duplicateCount = targets.reduce((sum, candidate) => sum + dlMatchingEntries(candidate).length, 0);
    if (duplicateCount && !confirm(
      `選択した候補には、同じ日付・種別・ペルソナの日記が登録済みのものがあります。\n\n既存の重複 ${duplicateCount}件を確認しました。\nそれでも保存しますか？`,
    )) return false;

    const list = dlList();
    targets.forEach((candidate, index) => list.push(candidateToEntry(candidate, index)));
    const savedIds = new Set(targets.map(candidate => candidate.id));
    dlCandidates = dlCandidates.filter(candidate => !savedIds.has(candidate.id));
    savedIds.forEach(id => selectedCandidateIds.delete(id));
    await save();
    dlRefreshCandidateWarnings();
    dlRender();
    return true;
  }

  function makePersonaTabs(groups) {
    const wrap = document.createElement("div");
    wrap.className = "dl-candidate-tabs";

    const allButton = document.createElement("button");
    allButton.type = "button";
    allButton.className = "dl-candidate-tab" + (candidatePersonaFilter === "all" ? " is-active" : "");
    allButton.textContent = `すべて ${dlCandidates.length}`;
    allButton.onclick = () => {
      candidatePersonaFilter = "all";
      selectedCandidateIds.clear();
      dlRender();
    };
    wrap.append(allButton);

    groups.forEach(group => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "dl-candidate-tab" + (candidatePersonaFilter === group.key ? " is-active" : "");
      button.textContent = `${group.label} ${group.count}`;
      button.onclick = () => {
        candidatePersonaFilter = group.key;
        selectedCandidateIds.clear();
        dlRender();
      };
      wrap.append(button);
    });
    return wrap;
  }

  function refreshBulkBar(bar, visible) {
    if (!bar) return;
    const visibleIds = visible.map(candidate => candidate.id);
    const selectedVisible = visibleIds.filter(id => selectedCandidateIds.has(id));
    const allVisibleSelected = visibleIds.length > 0 && selectedVisible.length === visibleIds.length;
    const count = bar.querySelector("[data-dl-selected-count]");
    const toggle = bar.querySelector("[data-dl-select-visible]");
    const saveButton = bar.querySelector("[data-dl-save-selected]");
    if (count) count.textContent = `${selectedCandidateIds.size}件選択`;
    if (toggle) toggle.textContent = allVisibleSelected ? "表示中の選択を解除" : "表示中をすべて選択";
    if (saveButton) {
      saveButton.disabled = selectedCandidateIds.size === 0;
      saveButton.textContent = selectedCandidateIds.size ? `選択した${selectedCandidateIds.size}件を保存` : "選択した候補を保存";
    }
  }

  function enhanceCandidateUi() {
    if (!dlCandidateMode) return;
    pruneSelection();

    const groups = candidateGroups();
    if (candidatePersonaFilter !== "all" && !groups.some(group => group.key === candidatePersonaFilter)) {
      candidatePersonaFilter = "all";
    }
    const visible = visibleCandidates();
    const visibleIds = new Set(visible.map(candidate => candidate.id));

    const candidateSection = document.querySelector(".dl-candidates");
    if (!candidateSection) return;

    const heading = document.querySelector(".browser-heading .count-badge");
    if (heading) heading.textContent = candidatePersonaFilter === "all"
      ? `${dlCandidates.length} 件`
      : `${visible.length} / ${dlCandidates.length} 件`;

    const sectionTitle = candidateSection.querySelector(":scope > h3");
    if (sectionTitle) sectionTitle.textContent = candidatePersonaFilter === "all"
      ? `抽出候補 ${visible.length}件`
      : `${groups.find(group => group.key === candidatePersonaFilter)?.label || "選択中"}の候補 ${visible.length}件`;

    const tabs = makePersonaTabs(groups);
    candidateSection.before(tabs);

    const bulkBar = document.createElement("div");
    bulkBar.className = "dl-candidate-bulk";
    bulkBar.innerHTML = '<div class="dl-candidate-bulk-left"><strong data-dl-selected-count>0件選択</strong><button type="button" data-dl-select-visible>表示中をすべて選択</button></div><button type="button" class="primary" data-dl-save-selected disabled>選択した候補を保存</button>';
    if (sectionTitle) sectionTitle.after(bulkBar); else candidateSection.prepend(bulkBar);

    const cards = Array.from(candidateSection.querySelectorAll(".dl-candidate"));
    cards.forEach(card => {
      const confirmButton = card.querySelector("[data-dlc]");
      if (!confirmButton) return;
      const candidate = dlCandidates.find(item => item.id === confirmButton.dataset.dlc);
      if (!candidate) return;
      card.hidden = !visibleIds.has(candidate.id);
      if (card.hidden) return;

      confirmButton.textContent = "確認";
      const actions = confirmButton.closest(".dl-actions");
      if (actions) {
        const directSave = document.createElement("button");
        directSave.type = "button";
        directSave.className = "dl-save-direct";
        directSave.textContent = "保存";
        directSave.onclick = () => saveCandidatesDirect([candidate]);
        confirmButton.after(directSave);
      }

      const selector = document.createElement("label");
      selector.className = "dl-candidate-select";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = selectedCandidateIds.has(candidate.id);
      const text = document.createElement("span");
      text.textContent = "一括保存に選択";
      selector.append(checkbox, text);
      card.prepend(selector);
      card.classList.toggle("is-selected", checkbox.checked);
      checkbox.onchange = () => {
        if (checkbox.checked) selectedCandidateIds.add(candidate.id);
        else selectedCandidateIds.delete(candidate.id);
        card.classList.toggle("is-selected", checkbox.checked);
        refreshBulkBar(bulkBar, visible);
      };
    });

    bulkBar.querySelector("[data-dl-select-visible]").onclick = () => {
      const ids = visible.map(candidate => candidate.id);
      const allSelected = ids.length > 0 && ids.every(id => selectedCandidateIds.has(id));
      ids.forEach(id => allSelected ? selectedCandidateIds.delete(id) : selectedCandidateIds.add(id));
      dlRender();
    };
    bulkBar.querySelector("[data-dl-save-selected]").onclick = () => {
      const targets = dlCandidates.filter(candidate => selectedCandidateIds.has(candidate.id));
      saveCandidatesDirect(targets);
    };
    refreshBulkBar(bulkBar, visible);
  }

  const baseRender = dlRender;
  dlRender = function() {
    const result = baseRender();
    enhanceCandidateUi();
    return result;
  };

  const baseScan = dlScan;
  dlScan = function() {
    candidatePersonaFilter = "all";
    selectedCandidateIds.clear();
    return baseScan();
  };

  document.querySelector(".app-version").textContent = "v74";
})();
