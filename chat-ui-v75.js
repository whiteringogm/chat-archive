/* chatUiV75: monochrome ChatGPT-like conversation layout and AI speaker toggle. */
(() => {
  const style = document.createElement("style");
  style.textContent = `
  :root{
    --ink:#202020;
    --muted:#747474;
    --paper:#f7f7f7;
    --card:#ffffff;
    --line:#dddddd;
    --accent:#444444;
    --user:#e9e9e9;
  }
  body.dark{
    color-scheme:dark;
    --ink:#f2f2f2;
    --muted:#a1a1a1;
    --paper:#000000;
    --card:#171717;
    --line:#343434;
    --accent:#b9b9b9;
    --user:#333333;
  }
  header{background:#202020!important}
  body.dark header{background:#000!important}
  header p{color:#bdbdbd!important}
  .app-version{color:#bdbdbd!important}
  dialog::backdrop,.sidebar-backdrop,.session-panel-backdrop{background:#0009!important}
  .floating-menu,.floating-session-menu,.message-copy-bar,.bulk-move-bar,.search-bulk-bar{background:#222!important;border-color:#555!important;color:#fff!important}
  body.dark .floating-menu,body.dark .floating-session-menu,body.dark .message-copy-bar,body.dark .bulk-move-bar,body.dark .search-bulk-bar{background:#181818!important;border-color:#3f3f3f!important}
  .match-preview,.search-trail,.saved-selection-nav{background:#eeeeee!important;color:#4d4d4d!important}
  body.dark .match-preview,body.dark .search-trail,body.dark .saved-selection-nav{background:#1e1e1e!important;color:var(--ink)!important}
  .chip{background:#f0f0f0!important}
  body.dark .chip{background:#242424!important}
  .hit{background:#d8d8d8!important;color:#111!important}
  body.dark .hit{background:#555!important;color:#fff!important}

  .conversation{max-width:780px;margin-inline:auto}
  .message{font-size:16px;line-height:1.72}
  .message.assistant{
    width:100%;
    margin:24px 0 30px;
    padding:0;
    border:0;
    border-radius:0;
    background:transparent!important;
    box-shadow:none;
  }
  .message.assistant .message-head{margin:0 0 11px;padding:0}
  .message.assistant .body{padding:0}
  .message.assistant .label{color:var(--ink);font-size:13px;font-weight:760}
  .message.assistant .speaker-icon{width:1.9em;height:1.9em;box-shadow:0 0 0 1px var(--line)}
  .message.assistant .speaker-name{letter-spacing:0;font-weight:800}
  .message.assistant .speaker-emoji{font-size:1em}
  .message.assistant .message-model{color:var(--muted);font-size:.92em;font-weight:650}
  .message.assistant.copy-selected,.message.assistant.selection-anchor{outline:1px solid #8b8b8b;outline-offset:10px;border:0!important;box-shadow:none!important}
  .message.assistant.saved-selection{padding-left:14px!important;border:0!important;background:transparent!important;box-shadow:inset 3px 0 #8a8a8a!important}

  .message.user{
    width:fit-content;
    max-width:min(82%,680px);
    margin:20px 0 22px auto;
    padding:12px 16px;
    border:0;
    border-radius:22px;
    background:var(--user)!important;
    box-shadow:none;
  }
  .message.user .message-label-wrap{display:none!important}
  .message.user .message-head{justify-content:flex-end;margin:0 0 4px}
  .message.user .body{padding:0}
  .message.user.copy-selected,.message.user.selection-anchor{outline:1px solid #8b8b8b;outline-offset:3px;border:0!important;box-shadow:none!important}
  .message.user.saved-selection{background:#dddddd!important;box-shadow:inset 3px 0 #888!important}
  body.dark .message.user.saved-selection{background:#414141!important}
  .focus-mode .message.user .message-head{display:none!important}

  body.hide-ai-speaker-names .message.assistant .speaker-icon,
  body.hide-ai-speaker-names .message.assistant .speaker-name,
  body.hide-ai-speaker-names .message.assistant .speaker-emoji{display:none!important}
  .focus-mode.hide-ai-speaker-names.hide-model-names .message.assistant .message-head{display:none!important}

  .memo-card{background:#e5e5e5!important;color:#2c2c2c!important;box-shadow:none!important}
  .memo-card a{color:#444!important}
  .memo-actions{border-color:#c9c9c9!important;background:#f3f3f3!important}
  .memo-actions button,.add-memo-after{border-color:#c7c7c7!important;background:#fff!important;color:#555!important}
  body.dark .memo-card{background:#252525!important;color:#ededed!important}
  body.dark .memo-card a{color:#cfcfcf!important}
  body.dark .memo-actions{border-color:#444!important;background:#1a1a1a!important}
  body.dark .memo-actions button,body.dark .add-memo-after{border-color:#444!important;background:#252525!important;color:#ddd!important}
  .note-entry{border-color:#cfcfcf!important;border-left-color:#888!important;background:#f1f1f1!important}
  .note-entry-head button{border-color:#ccc!important;background:#fff!important;color:#555!important}
  body.dark .note-entry{border-color:#3d3d3d!important;border-left-color:#777!important;background:#1d1d1d!important}
  body.dark .note-entry-head button{border-color:#444!important;background:#252525!important;color:#ddd!important}
  .memory-card:hover,.memory-entry>button:first-child:hover{border-color:#888!important;box-shadow:none!important}
  .saved-selection-list button.active{border-color:#888!important;background:#e1e1e1!important;color:#333!important}
  body.dark .saved-selection-list button.active{background:#333!important;color:#fff!important}
  .dl-warning,.dl-calendar-day.is-multiple{border-color:#777!important;background:#e5e5e5!important;color:#333!important}
  body.dark .dl-warning,body.dark .dl-calendar-day.is-multiple{border-color:#666!important;background:#2b2b2b!important;color:#eee!important}

  .display-setting-check.v75-ai-speaker-setting{margin-top:2px}

  @media(max-width:760px){
    .viewer{padding-left:16px;padding-right:16px}
    .conversation{max-width:none}
    .message{font-size:16px;line-height:1.72}
    .message.assistant{margin:22px 0 28px}
    .message.user{max-width:84%;margin:18px 0 20px auto;padding:11px 15px;border-radius:21px}
    .message.assistant .message-head{margin-bottom:9px}
  }
  `;
  document.head.append(style);

  if (typeof settings.showAiSpeakerNames !== "boolean") {
    settings.showAiSpeakerNames = true;
  }

  const control = document.createElement("label");
  control.className = "display-setting-check v75-ai-speaker-setting";
  control.innerHTML = '<input id="showAiSpeakerNames" type="checkbox" checked> AI側の話者名・アイコンを表示';
  const modelControl = document.querySelector("#showModelNames")?.closest("label");
  if (modelControl) modelControl.after(control);
  else document.querySelector("#settings form")?.prepend(control);

  function syncV75PreferenceUi() {
    const input = document.querySelector("#showAiSpeakerNames");
    if (input) input.checked = settings.showAiSpeakerNames !== false;
    document.body.classList.toggle("hide-ai-speaker-names", settings.showAiSpeakerNames === false);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = settings.theme === "dark" ? "#000000" : "#f7f7f7";
  }

  const baseApplyTheme = applyTheme;
  applyTheme = function() {
    const result = baseApplyTheme();
    syncV75PreferenceUi();
    return result;
  };

  document.querySelector("#settingsBtn")?.addEventListener("click", syncV75PreferenceUi, true);
  document.querySelector("#saveSettings")?.addEventListener("click", () => {
    const input = document.querySelector("#showAiSpeakerNames");
    settings.showAiSpeakerNames = input ? input.checked : true;
  }, true);

  syncV75PreferenceUi();
  document.querySelector(".app-version").textContent = "v75";
})();
