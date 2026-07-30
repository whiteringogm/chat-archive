const navStyle = document.createElement("style");
navStyle.textContent = `main{transition:grid-template-columns .2s ease}body.sidebar-collapsed main{grid-template-columns:0 1fr}aside{background:var(--paper);transition:transform .2s ease,opacity .2s ease}body.sidebar-collapsed aside{transform:translateX(-100%);opacity:0;pointer-events:none}.sidebar-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}.sidebar-head .icon-btn{display:none}.home-button{width:100%;margin:0 0 14px;padding:11px 13px;border:1px solid var(--accent);border-radius:12px;background:#fff;color:var(--accent);font-weight:800;text-align:left}.session{text-align:initial}.session-meta{font-size:12px;color:var(--muted);margin-top:3px}.match-preview{margin:10px 0 0;padding:9px 10px;border-radius:10px;background:#f5f0f5;color:#554d59;font-size:12px;line-height:1.55;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.open-session{width:100%;margin-top:10px;padding:9px 12px;border:1px solid var(--accent);border-radius:10px;background:var(--accent);color:#fff;font-weight:800}.sidebar-backdrop{display:none}.floating-menu{position:fixed;right:18px;bottom:18px;z-index:20;padding:11px 15px;border:1px solid #a58cab;border-radius:999px;background:#261f2d;color:#fff;font-weight:800;box-shadow:0 8px 28px #0004}@media(max-width:760px){main,body.sidebar-collapsed main{height:auto;display:block}.sidebar-head .icon-btn{display:block}aside,body.sidebar-collapsed aside{position:fixed;inset:0 auto 0 0;z-index:31;width:min(88vw,380px);max-height:none;border-right:1px solid var(--line);border-bottom:0;box-shadow:12px 0 36px #0003;transform:translateX(-105%);opacity:1;pointer-events:none}body.sidebar-open aside{transform:translateX(0);pointer-events:auto}.sidebar-backdrop{position:fixed;inset:0;z-index:30;border:0;background:#1f182688}body.sidebar-open .sidebar-backdrop{display:block}.viewer{min-height:70dvh}}`;
document.head.append(navStyle);
const sessionPanelStyle=document.createElement("style");
sessionPanelStyle.textContent=`.floating-session-menu{position:fixed;right:18px;bottom:68px;z-index:20;padding:11px 15px;border:1px solid #a58cab;border-radius:999px;background:var(--accent);color:#fff;font-weight:800;box-shadow:0 5px 22px #0003}.session-panel{position:fixed;right:18px;bottom:120px;z-index:31;width:min(360px,calc(100vw - 36px));max-height:min(72dvh,680px);overflow:auto;padding:16px;border:1px solid var(--line);border-radius:18px;background:var(--paper);box-shadow:0 20px 60px #0005;transform:translateY(12px);opacity:0;pointer-events:none;transition:.18s}.session-panel-open .session-panel{transform:none;opacity:1;pointer-events:auto}.session-panel-backdrop{display:none}.session-panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.session-panel-head button{border:0;background:transparent;color:var(--muted);font-size:22px}.session-panel-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.session-panel-grid .wide{grid-column:1/-1}.session-panel button,.session-panel input,.session-panel select{min-height:42px}.session-panel-action{border:1px solid var(--line);border-radius:11px;background:var(--card);color:var(--ink);font-weight:750}.session-panel-action.primary{background:var(--accent);color:#fff}.session-panel-action:disabled{opacity:.45}.session-panel-section{display:grid;gap:8px;margin-top:14px;padding-top:14px;border-top:1px solid var(--line)}.session-panel-section label{font-size:13px;font-weight:750}.session-panel-check{display:flex;align-items:center;gap:8px}.session-panel-check input{width:auto;min-height:auto}.session-panel-memories{display:grid;gap:6px}.session-panel-memory{text-align:left;padding:9px 10px;border:1px solid var(--line);border-radius:10px;background:var(--card);color:var(--ink)}.session-panel-count{font-size:12px;color:var(--muted)}.session-panel-result{width:100%;border:1px solid var(--accent);border-radius:10px;background:var(--accent);color:#fff;font-weight:800}.jump-original{margin:8px 0 0;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--muted);padding:5px 8px;font-size:11px}.exit-focus-mode{display:none;position:fixed;right:10px;top:10px;z-index:100;padding:7px 10px;border:1px solid #aaa;border-radius:999px;background:#241d29;color:#fff;opacity:.78}.focus-mode header,.focus-mode aside,.focus-mode .sidebar-backdrop,.focus-mode .floating-menu,.focus-mode .floating-session-menu,.focus-mode .session-panel,.focus-mode .session-panel-backdrop,.focus-mode .tools,.focus-mode .session-fields,.focus-mode .saved-selection-nav,.focus-mode .session-message-filter,.focus-mode .message-select,.focus-mode .edit,.focus-mode .hide,.focus-mode .range-select,.focus-mode .message-copy-bar,.focus-mode .add-memo-after,.focus-mode .memo-actions{display:none!important}.focus-mode .exit-focus-mode{display:block}.focus-mode main{display:block;height:auto}.focus-mode .viewer{overflow:visible;padding:12px}.conversation>.saved-selection-nav,.conversation>.session-message-filter{display:none}@media(max-width:760px){.session-panel{inset:auto 10px 112px 10px;width:auto;max-height:72dvh}.session-panel-open .session-panel-backdrop{display:block;position:fixed;inset:0;z-index:30;border:0;background:#17101d88}.floating-menu{right:12px;bottom:14px}.floating-session-menu{right:12px;bottom:64px}}`;
document.head.append(sessionPanelStyle);
const bulkStyle = document.createElement("style");
bulkStyle.textContent = `.browser-session-row{display:grid;grid-template-columns:auto 1fr;align-items:stretch;border:1px solid var(--line);border-radius:15px;background:#fff;overflow:hidden}.browser-session-row.selected{border-color:var(--accent);background:#f7f0f8;box-shadow:0 4px 18px #4d385118}.browser-session-row .browser-session{border:0;border-radius:0;background:transparent}.session-check{display:grid;place-items:center;width:50px;border-right:1px solid var(--line);cursor:pointer}.session-check input{position:absolute;opacity:0;pointer-events:none}.session-check span{width:22px;height:22px;border:2px solid #b6a9b8;border-radius:7px;background:#fff}.session-check input:checked+span{border-color:var(--accent);background:var(--accent);box-shadow:inset 0 0 0 4px #fff}.select-all{padding:9px 13px;border:1px solid var(--line);border-radius:11px;background:#fff;color:var(--accent);font-weight:800}.has-bulk-bar{padding-bottom:100px}.bulk-move-bar{position:sticky;bottom:14px;z-index:10;margin:22px auto 0;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid #a58cab;border-radius:16px;background:#261f2df2;color:#fff;box-shadow:0 12px 36px #0004;backdrop-filter:blur(10px)}.bulk-move-controls{display:flex;align-items:center;gap:8px}.bulk-move-controls select{min-width:170px;border:0}.bulk-move-controls button{padding:10px 13px;border:0;border-radius:10px;background:#fff;color:#35283a;font-weight:800}.bulk-move-controls .bulk-delete{background:#b9475e;color:#fff}.bulk-move-controls .bulk-cancel{background:transparent;color:#fff;border:1px solid #a58cab}.bulk-move-controls button:disabled{opacity:.45;cursor:not-allowed}@media(max-width:760px){.bulk-move-bar{align-items:stretch;flex-direction:column;bottom:76px}.bulk-move-controls{display:grid;grid-template-columns:1fr auto auto}.bulk-move-controls .bulk-cancel{grid-column:1/-1}.session-check{width:46px}}`;
document.head.append(bulkStyle);
const titleSearchStyle = document.createElement("style");
titleSearchStyle.textContent = `.unified-search{margin-bottom:9px}.search-mode{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-bottom:7px}.search-mode button{min-width:0;padding:7px 5px;border:1px solid var(--line);border-radius:9px;background:var(--card);color:var(--muted);font-size:10px;font-weight:800}.search-mode button.active{border-color:var(--accent);background:var(--accent);color:#fff}.search-mode button:disabled{opacity:.38}.search-label{display:block;margin-bottom:9px;color:var(--muted);font-size:12px;font-weight:800}.search-label input{margin-top:4px}.filter-help{margin:2px 0 5px;color:var(--muted);font-size:10px}.filters select[multiple]{height:82px;padding:5px;font-size:11px}.exclude-filters{margin:10px 0;padding:9px;border:1px solid var(--line);border-radius:11px;background:var(--card)}.exclude-filters summary{cursor:pointer;color:var(--accent);font-size:12px;font-weight:800}.exclude-filters label{display:block;margin:9px 0 6px;color:var(--muted);font-size:11px;font-weight:800}.exclude-filters .filters{margin-top:6px}.clear-filters{width:100%;margin-bottom:8px;padding:8px;border:1px solid var(--line);border-radius:9px;background:var(--card);color:var(--muted);font-size:11px}.search-trail{display:flex;align-items:center;gap:7px;margin:8px 0;padding:8px 10px;border-radius:10px;background:#f5f0f5;font-size:11px}.search-trail button{border:0;background:transparent;color:var(--accent);font-weight:800}.search-message{padding:12px;border:1px solid var(--line);border-radius:12px;background:var(--card)}.search-message+.search-message{margin-top:7px}.search-message small{display:block;margin-bottom:5px;color:var(--muted)}.search-message .open-message{width:100%;margin-top:8px;padding:8px;border:1px solid var(--accent);border-radius:9px;background:var(--accent);color:#fff;font-weight:800}.search-select-all{width:100%;margin-bottom:9px;padding:9px 12px;border:1px solid var(--accent);border-radius:11px;background:#fff;color:var(--accent);font-weight:800}.search-session{display:grid;grid-template-columns:auto 1fr;padding:0;overflow:hidden}.search-session>div{padding:13px;min-width:0}.search-session .session-check{width:42px}.search-bulk-bar{position:sticky;bottom:0;z-index:12;margin-top:10px;padding:11px;border-radius:14px;background:#261f2df2;color:#fff;box-shadow:0 8px 24px #0004}.search-bulk-bar strong{display:block;margin-bottom:8px}.search-bulk-controls{display:grid;grid-template-columns:1fr auto;gap:7px}.search-bulk-controls select{min-width:0;border:0}.search-bulk-controls button{padding:9px;border:0;border-radius:10px;background:#fff;color:#35283a;font-weight:800}.search-bulk-controls .bulk-cancel{grid-column:1/-1;background:transparent;color:#fff;border:1px solid #a58cab}.sessions,.session,.search-session>div{min-width:0;max-width:100%}.session{overflow:hidden}.session strong{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@media(max-width:380px){.filters select{font-size:10px}}`;
document.head.append(titleSearchStyle);
const searchDateStyle = document.createElement("style");
searchDateStyle.textContent = `.search-period{margin:0 0 10px;padding:10px;border:1px solid var(--line);border-radius:11px;background:var(--card)}.search-period>span{display:block;margin-bottom:7px;color:var(--muted);font-size:12px;font-weight:800}.search-period-fields{display:grid;grid-template-columns:1fr 1fr;gap:7px}.search-period label{min-width:0;color:var(--muted);font-size:10px;font-weight:750}.search-period input{min-width:0;margin-top:3px;padding:8px 7px;font-size:12px}@media(max-width:380px){.search-period-fields{grid-template-columns:1fr}.search-period input{font-size:11px}}`;
document.head.append(searchDateStyle);
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
const memoStyle = document.createElement("style");
memoStyle.textContent = `.memo-card{position:relative;margin:-4px 4% 10px;padding:7px 34px 7px 10px;border:0;border-radius:7px;background:#d9f4c9;color:#253326;box-shadow:0 2px 8px #58844918;line-height:1.35;overflow-wrap:anywhere}.memo-card .markdown-body{font-size:14px}.memo-card .markdown-body p{margin:0;white-space:pre-wrap}.memo-card .markdown-body>*+*{margin-top:.2em}.memo-card a{color:#385b7d;text-decoration:underline;text-underline-offset:2px;overflow-wrap:anywhere}.memo-menu{position:absolute;top:4px;right:5px}.memo-menu summary{display:grid;place-items:center;width:25px;height:25px;border-radius:999px;color:#5e7957;font-size:15px;font-weight:900;line-height:1;list-style:none;cursor:pointer;opacity:.55}.memo-menu summary::-webkit-details-marker{display:none}.memo-menu summary:hover,.memo-menu[open] summary{background:#fff9;opacity:1}.memo-actions{position:absolute;z-index:4;top:30px;right:0;display:flex;gap:4px;padding:5px;border:1px solid #b8d6a9;border-radius:9px;background:#f8fff3;box-shadow:0 7px 20px #2533262b}.memo-actions button,.add-memo-after{min-height:auto;padding:5px 8px;border:1px solid #c7dcbf;border-radius:8px;background:#fff;color:#506d49;font-size:11px;font-weight:800}.add-memo-after{display:block;margin:-5px auto 14px;opacity:.72}.add-memo-after:hover{opacity:1}body.dark .memo-card{background:#31452e;color:#edf6e9;box-shadow:none}body.dark .memo-card a{color:#b9d8ff}body.dark .memo-menu summary{color:#c5dcbf}body.dark .memo-menu summary:hover,body.dark .memo-menu[open] summary{background:#ffffff18}body.dark .memo-actions{border-color:#51684c;background:#222d20}body.dark .memo-actions button,body.dark .add-memo-after{border-color:#53684e;background:#2a3627;color:#d4e6cf}#memoEditor textarea{min-height:180px;resize:vertical}#memoEditor .memo-help{margin:0;color:var(--muted);font-size:12px}`;
document.head.append(memoStyle);
const messageCopyStyle = document.createElement("style");
messageCopyStyle.textContent = `.session-message-filter{display:grid;grid-template-columns:minmax(0,1fr) minmax(150px,.55fr);gap:9px;margin:0 0 18px;padding:12px;border:1px solid var(--line);border-radius:14px;background:var(--card)}.session-message-filter input,.session-message-filter select{min-width:0}.session-filter-count{grid-column:1/-1;color:var(--muted);font-size:12px}.message-select{display:inline-flex;align-items:center;gap:6px;margin-right:7px;color:var(--muted);font-size:11px;font-weight:800;cursor:pointer}.message-select input{width:18px;min-height:18px;margin:0;accent-color:var(--accent)}.range-select{margin-right:7px;padding:5px 8px;border:1px solid #cabdcd;border-radius:8px;background:#fff;color:var(--accent);font-size:11px;font-weight:800}.message.copy-selected{border-color:var(--accent);box-shadow:0 4px 18px #4d38511f}.message.selection-anchor{box-shadow:inset 4px 0 var(--accent),0 4px 18px #4d38511f}.message.saved-selection{background:#fff7dc;border-color:#d9bd67;box-shadow:inset 5px 0 #d9bd67}.message.user.saved-selection{background:#f4e8c8}.message-copy-bar{position:sticky;bottom:14px;z-index:15;margin:24px auto 0;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid #a58cab;border-radius:16px;background:#261f2df2;color:#fff;box-shadow:0 12px 36px #0004;backdrop-filter:blur(10px)}.message-copy-actions{display:flex;gap:8px;flex-wrap:wrap}.message-copy-actions button{padding:10px 13px;border:1px solid #a58cab;border-radius:10px;background:#fff;color:#35283a;font-weight:800}.message-copy-actions .copy-cancel{background:transparent;color:#fff}.saved-selection-nav{margin:14px 0 20px;padding:12px;border:1px solid var(--line);border-radius:14px;background:#f8f3f8}.saved-selection-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:9px}.saved-selection-head strong{font-size:13px}.saved-selection-head span{font-size:11px;color:var(--muted)}.saved-selection-list{display:flex;gap:7px;flex-wrap:wrap}.saved-selection-list button{border:1px solid #cabdcd;border-radius:999px;background:#fff;color:var(--accent);padding:8px 11px;font-weight:800}.saved-selection-list button.active{border-color:#d0ad42;background:#fff2bc;color:#674f0e}.saved-selection-actions{display:flex;justify-content:flex-end;gap:7px;margin-top:9px}.saved-selection-actions button{border:1px solid #cabdcd;border-radius:10px;background:#fff;color:var(--accent);padding:7px 10px}.saved-selection-actions .memory-remove{border-color:#e2b8c1;color:#a13b50}.message-label-wrap{display:flex;align-items:baseline;gap:8px;min-width:0}.message-time{color:var(--muted);font-size:10px;letter-spacing:0;white-space:nowrap}.memory-card{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:15px 17px;border:1px solid var(--line);border-radius:15px;background:#fff;text-align:left}.memory-card:hover{border-color:#d0ad42;box-shadow:0 5px 18px #8a6b1820}.memory-card strong{display:block;margin-bottom:4px;color:var(--ink)}.memory-card small{display:block;color:var(--muted);line-height:1.45}.memory-card .memory-mark{font-size:24px;color:#b88e19}.memory-list{display:grid;gap:9px}.memory-entry{display:grid;grid-template-columns:1fr auto auto auto auto;gap:10px;align-items:center}.memory-entry>button:first-child{width:100%;padding:15px;border:1px solid var(--line);border-radius:14px;background:#fff;text-align:left}.memory-entry>button:first-child:hover{border-color:#d0ad42}.memory-entry strong,.memory-entry small{display:block}.memory-entry small{margin-top:4px;color:var(--muted)}.memory-entry .memory-copy,.memory-entry .memory-edit,.memory-entry .memory-rename,.memory-entry .memory-delete{padding:10px;border:1px solid var(--line);border-radius:10px;background:#fff;font-weight:800}.memory-entry .memory-copy,.memory-entry .memory-edit,.memory-entry .memory-rename{color:var(--accent)}.memory-entry .memory-delete{border-color:#e2b8c1;color:#a13b50}.note-list{display:grid;gap:10px}.note-entry{padding:14px 16px;border:1px solid #cbb99d;border-left:5px solid #b99762;border-radius:13px;background:#fff9e9}.note-entry-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:7px}.note-entry-head button{padding:7px 10px;border:1px solid #d7c8ae;border-radius:9px;background:#fffdf7;color:#765a32;font-weight:800}.note-entry small{display:block;color:var(--muted)}body.dark .note-entry{border-color:#6d5b43;border-left-color:#c8a66d;background:#2d281d}body.dark .note-entry-head button{border-color:#695b43;background:#2a241b;color:#e4c890}.folder-persona-setting{display:flex;align-items:center;gap:10px;margin-top:8px}.folder-persona-setting label{font-size:12px;font-weight:800;color:var(--muted)}.folder-persona-setting select{width:auto;min-width:180px}@media(max-width:760px){.session-message-filter{grid-template-columns:1fr}.session-filter-count{grid-column:1}.message-copy-bar{bottom:76px;align-items:stretch;flex-direction:column}.message-copy-actions{display:grid;grid-template-columns:1fr 1fr}.message-copy-actions .copy-cancel{grid-column:1/-1}.folder-persona-setting{align-items:stretch;flex-direction:column}.folder-persona-setting select{width:100%}.message-head>span:last-child{display:flex;align-items:center;flex-wrap:wrap;justify-content:flex-end;gap:3px}.message-head{align-items:flex-start}.message-label-wrap{align-items:flex-start;flex-direction:column;gap:1px}.memory-entry{grid-template-columns:1fr 1fr}.memory-entry>button:first-child{grid-column:1/-1}.memory-entry .memory-copy,.memory-entry .memory-edit,.memory-entry .memory-rename,.memory-entry .memory-delete{width:100%}}`;
document.head.append(messageCopyStyle);
const memoryPickerStyle = document.createElement("style");
memoryPickerStyle.textContent = `.memory-picker-list{display:grid;gap:8px;max-height:min(58dvh,520px);overflow:auto}.memory-picker-item{width:100%;padding:13px 14px;border:1px solid var(--line);border-radius:12px;background:var(--card);color:var(--ink);text-align:left}.memory-picker-item strong,.memory-picker-item small{display:block}.memory-picker-item small{margin-top:4px;color:var(--muted)}#memoryPicker{width:min(520px,calc(100vw - 28px))}`;
document.head.append(memoryPickerStyle);
const memoryExportStyle = document.createElement("style");
memoryExportStyle.textContent = `.memory-list{gap:14px}.memory-entry{display:block;padding:16px;border:1px solid var(--line);border-radius:18px;background:color-mix(in srgb,var(--card) 78%,var(--paper));box-shadow:0 5px 18px #0000000b}.memory-entry-main{width:100%;padding:0 0 14px!important;border:0!important;border-bottom:1px solid var(--line)!important;border-radius:0!important;background:transparent!important;text-align:left}.memory-entry-main:hover strong{color:var(--accent)}.memory-entry-title{display:block;color:var(--ink);font-size:18px;line-height:1.4}.memory-entry-meta{display:block;margin-top:6px;color:var(--muted);font-size:13px;line-height:1.45}.memory-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding-top:12px}.memory-actions button{min-height:40px;padding:8px 7px;border:1px solid var(--line);border-radius:10px;background:var(--paper);color:var(--muted);font-size:12px;font-weight:800}.memory-actions .memory-preview{border-color:var(--accent);color:var(--accent)}.memory-actions .memory-delete{border-color:#9b5866;color:#d994a3}.memory-folder-export{display:flex;justify-content:flex-end;margin:0 0 14px}.memory-folder-export button{padding:10px 14px;border:1px solid var(--accent);border-radius:11px;background:var(--accent);color:#fff;font-weight:800}.preview-kicker{margin:0 0 3px;color:var(--muted);font-size:10px;font-weight:900;letter-spacing:.12em}.memory-preview-text{max-height:min(62dvh,620px);overflow:auto;margin:0;padding:16px;border:1px solid var(--line);border-radius:12px;background:var(--card);color:var(--ink);font:13px/1.7 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap;overflow-wrap:anywhere}#memoryPreview{width:min(680px,calc(100vw - 24px))}@media(max-width:760px){.memory-entry{padding:14px}.memory-entry-title{font-size:17px}.memory-actions{grid-template-columns:1fr 1fr}.memory-actions .memory-delete{grid-column:2}.memory-actions button{width:100%}}`;
document.head.append(memoryExportStyle);
const $ = (id) => document.getElementById(id);
let searchMode = "body", searchSessionId = "";
function setSearchMode(mode) {
  const current = $("unifiedSearch").value;
  if (mode === "session" && !selected && !searchSessionId) return;
  searchMode = mode;
  $("titleSearch").value = mode === "title" ? current : "";
  $("search").value = mode === "body" || mode === "session" ? current : "";
  $("searchModeTitle").classList.toggle("active", mode === "title");
  $("searchModeBody").classList.toggle("active", mode === "body");
  $("searchModeSession").classList.toggle("active", mode === "session");
  $("searchModeTitle").setAttribute("aria-pressed", String(mode === "title"));
  $("searchModeBody").setAttribute("aria-pressed", String(mode === "body"));
  $("searchModeSession").setAttribute("aria-pressed", String(mode === "session"));
  $("searchLabelText").textContent = mode === "title" ? "セッションタイトル検索" : mode === "session" ? "現在のセッション内検索" : "全体の発言検索";
  $("unifiedSearch").placeholder = mode === "title" ? "例：🌕まんちゃん" : "発言本文を検索";
  if (mode !== "title") bulkSelected.clear();
  renderList();
}
$("unifiedSearch").addEventListener("input", () => {
  $("titleSearch").value = searchMode === "title" ? $("unifiedSearch").value : "";
  $("search").value = searchMode === "body" || searchMode === "session" ? $("unifiedSearch").value : "";
  if (searchMode === "title" && !$("unifiedSearch").value.trim()) bulkSelected.clear();
  renderList();
  renderViewer();
});
$("searchModeTitle").onclick = () => setSearchMode("title");
$("searchModeBody").onclick = () => setSearchMode("body");
$("searchModeSession").onclick = () => setSearchMode("session");
const esc = (s) =>
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
function closeSessionPanel(){document.body.classList.remove("session-panel-open");$("sessionPanel")?.setAttribute("aria-hidden","true");$("sessionMenuBtn")?.setAttribute("aria-expanded","false")}
function openSessionPanel(){if(!selected)return alert("先にセッションを開いてください。");closeSidebar();renderSessionPanel();document.body.classList.add("session-panel-open");$("sessionPanel")?.setAttribute("aria-hidden","false");$("sessionMenuBtn")?.setAttribute("aria-expanded","true")}
function scrollSessionEdge(bottom){closeSessionPanel();const v=$("viewer");if(matchMedia("(max-width:760px)").matches)window.scrollTo({top:bottom?document.documentElement.scrollHeight:0,behavior:"smooth"});else v?.scrollTo({top:bottom?v.scrollHeight:0,behavior:"smooth"})}
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
["search", "model", "persona", "folder", "speaker", "dateFrom", "dateTo", "excludeKeyword", "excludeModel", "excludePersona", "excludeFolder", "excludeSpeaker"].forEach((id) =>
  $(id).addEventListener(
    id === "search" || id === "excludeKeyword" ? "input" : "change",
    (e) => {
      e.stopImmediatePropagation();
      renderList();
    },
    true,
  ),
);
$("clearFilters").onclick = () => {
  ["model", "persona", "folder", "speaker", "excludeModel", "excludePersona", "excludeFolder", "excludeSpeaker"].forEach((id) =>
    [...$(id).options].forEach((option) => { option.selected = false; }),
  );
  ["dateFrom", "dateTo", "excludeKeyword"].forEach((id) => { $(id).value = ""; });
  renderList();
};
$("menuBtn").onclick = () => {
  const open = matchMedia("(max-width:760px)").matches
    ? document.body.classList.contains("sidebar-open")
    : !document.body.classList.contains("sidebar-collapsed");
  open ? closeSidebar() : openSidebar();
};
$("closeSidebar").onclick = closeSidebar;
$("sidebarBackdrop").onclick=closeSidebar;$("sessionMenuBtn").onclick=()=>document.body.classList.contains("session-panel-open")?closeSessionPanel():openSessionPanel();$("sessionPanelBackdrop").onclick=closeSessionPanel;$("exitFocusMode").onclick=()=>document.body.classList.remove("focus-mode");
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
  currentMemoryFolder = "",
  viewMode = "folders",
  sessionMessageQuery = "",
  sessionModelFilter = "",
  sessionIncludePrevious = false,
  bulkSelected = new Set(),
  messageSelected = new Set(),
  messageSelectionAnchor = "",
  editingMemoryId = "",
  viewportRestoreToken = 0,
  navigationBackStack = [],
  activeNamedSelection = "",
  memoDraft = null,
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
    fresh.notes = Array.isArray(old.notes) ? old.notes : [];
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
      s.namedSelections.forEach((memory) => {
        if (!memory.folder) memory.folder = s.folder || "未分類";
      });
      s.notes = Array.isArray(s.notes) ? s.notes : [];
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
function memoryDate(s, memory) {
  const ids = new Set(memory?.messageIds || []);
  const first = s?.messages?.find((message) => ids.has(message.id));
  if (!first?.time) return "";
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(first.time * 1000));
}
function openMemoryPicker(session) {
  const memories = session.namedSelections || [];
  if (!memories.length) return;
  const pickedIds = [...messageSelected];
  $("memoryPickerSummary").textContent =
    `選択中の${pickedIds.length}件を、どの思い出へ追加しますか？`;
  $("memoryPickerList").innerHTML = memories
    .map((memory) => {
      const day = memoryDate(session, memory);
      return `<button type="button" class="memory-picker-item" data-pick-memory="${esc(memory.id)}"><strong>${esc(memory.title)}</strong><small>${day ? `${esc(day)} · ` : ""}${memory.messageIds.length}件</small></button>`;
    })
    .join("");
  document.querySelectorAll("[data-pick-memory]").forEach((button) => {
    button.onclick = async () => {
      const target = memories.find((memory) => memory.id === button.dataset.pickMemory);
      if (!target) return;
      const ids = new Set(target.messageIds);
      pickedIds.forEach((id) => ids.add(id));
      target.messageIds = session.messages
        .filter((message) => !message.hidden && ids.has(message.id))
        .map((message) => message.id);
      activeNamedSelection = target.id;
      messageSelected.clear();
      messageSelectionAnchor = "";
      $("memoryPicker").close();
      await save();
      renderViewer();
      alert(`思い出「${target.title}」へ追加しました。`);
    };
  });
  $("memoryPicker").showModal();
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
const selectedValues = (id) => [...$(id).selectedOptions].map((o) => o.value).filter(Boolean);
const hasAny = (values, value) => !values.length || values.includes(value);
function messageMatchesFilters(x, models, speakers) {
  return (
    !x.hidden &&
    (!models.length || (x.role === "assistant" && models.includes(x.model))) &&
    hasAny(speakers, x.role)
  );
}
function searchTerms(q) {
  return q.trim().toLowerCase().split(/\s+/).filter(Boolean);
}
function includesAllTerms(text, q) {
  const hay = replaceText(text).toLowerCase();
  return searchTerms(q).every((term) => hay.includes(term));
}
function sessionInDateRange(s) {
  const from = $("dateFrom").value,
    to = $("dateTo").value;
  if (!from && !to) return true;
  if (!s.time) return false;
  const timestamp = s.time * 1000,
    fromTime = from ? new Date(`${from}T00:00:00`).getTime() : -Infinity,
    toTime = to ? new Date(`${to}T23:59:59.999`).getTime() : Infinity;
  return timestamp >= fromTime && timestamp <= toTime;
}
function filtered() {
  const tq = $("titleSearch").value.trim(),
    q = $("search").value.trim(),
    models = selectedValues("model"),
    personas = selectedValues("persona"),
    folders = selectedValues("folder"),
    speakers = selectedValues("speaker"),
    excludedModels = selectedValues("excludeModel"),
    excludedPersonas = selectedValues("excludePersona"),
    excludedFolders = selectedValues("excludeFolder"),
    excludedSpeakers = selectedValues("excludeSpeaker"),
    excludedTerms = searchTerms($("excludeKeyword").value);
  return all.filter(
    (s) =>
      !s.trashedAt &&
      sessionInDateRange(s) &&
      (searchMode !== "session" || s.id === (searchSessionId || selected)) &&
      (!tq || includesAllTerms(s.title, tq)) &&
      (!models.length || s.models.some((m) => models.includes(m))) &&
      hasAny(personas, effectivePersona(s)) &&
      hasAny(folders, s.folder || "未分類") &&
      !excludedPersonas.includes(effectivePersona(s)) &&
      !excludedFolders.includes(s.folder || "未分類") &&
      (!speakers.length || s.messages.some((x) => messageMatchesFilters(x, models, speakers))) &&
      ((!q && !excludedTerms.length && !excludedModels.length && !excludedSpeakers.length) ||
        s.messages.some(
          (x) =>
            messageMatchesFilters(x, models, speakers) &&
            !excludedSpeakers.includes(x.role) &&
            !(x.role === "assistant" && excludedModels.includes(x.model)) &&
            !excludedTerms.some((term) => replaceText(x.text).toLowerCase().includes(term)) &&
            (!q || includesAllTerms(x.text, q)),
        )),
  );
}
function activeSessions() {
  return all.filter((s) => !s.trashedAt);
}
function matchInfo(s, q) {
  if (!q) return { count: 0, preview: "" };
  const terms = searchTerms(q),
    models = selectedValues("model"),
    speakers = selectedValues("speaker"),
    excludedModels = selectedValues("excludeModel"),
    excludedSpeakers = selectedValues("excludeSpeaker"),
    excludedTerms = searchTerms($("excludeKeyword").value),
    hits = s.messages.filter(
      (x) =>
        messageMatchesFilters(x, models, speakers) &&
        !excludedSpeakers.includes(x.role) &&
        !(x.role === "assistant" && excludedModels.includes(x.model)) &&
        !excludedTerms.some((term) => replaceText(x.text).toLowerCase().includes(term)) &&
        includesAllTerms(x.text, q),
    ),
    first = hits[0];
  if (!first)
    return {
      count: 0,
      preview: "タイトルに一致",
    };
  const text = replaceText(first.text),
    lower = text.toLowerCase(),
    positions = terms.map((term) => lower.indexOf(term)).filter((at) => at >= 0),
    at = positions.length ? Math.min(...positions) : 0,
    endAt = positions.length
      ? Math.max(...terms.map((term) => lower.indexOf(term) + term.length))
      : at + q.length,
    start = Math.max(0, at - 55),
    end = Math.min(text.length, endAt + 90);
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
  $("searchTrail").innerHTML = searchMode === "session" && rows[0]
    ? `<div class="search-trail"><button id="backToGlobalResults">‹ 全体の結果</button><span>${esc(replaceText(rows[0].title))}</span></div>`
    : "";
  if (searchMode === "session") {
    const s = rows[0], hit = s ? matchInfo(s, q) : { hits: [] };
    const models = selectedValues("model"), speakers = selectedValues("speaker"),
      excludedModels = selectedValues("excludeModel"), excludedSpeakers = selectedValues("excludeSpeaker"),
      excludedTerms = searchTerms($("excludeKeyword").value);
    const messages = s ? s.messages.filter((m) =>
      messageMatchesFilters(m, models, speakers) &&
      !excludedSpeakers.includes(m.role) &&
      !(m.role === "assistant" && excludedModels.includes(m.model)) &&
      !excludedTerms.some((term) => replaceText(m.text).toLowerCase().includes(term)) &&
      (!q || includesAllTerms(m.text, q))) : [];
    $("summary").textContent = s ? `${messages.length} / ${visibleMessages(s).length} 発言` : "セッションを開いてください。";
    $("sessions").innerHTML = messages.map((m) =>
      `<article class="search-message"><small>${esc(nameOf(m, s))} · ${esc(messageDate(m.time))}</small><div>${q ? mark(replaceText(m.text).slice(0,240), q) : esc(replaceText(m.text).slice(0,240))}</div><button class="open-message" data-session-id="${esc(s.id)}" data-message-id="${esc(m.id)}">元の位置へ</button></article>`
    ).join("") || '<p class="muted">該当する発言がありません。</p>';
    $("backToGlobalResults")?.addEventListener("click", () => setSearchMode("body"));
    document.querySelectorAll(".open-message").forEach((b) => b.onclick = () => {
      openSession(b.dataset.sessionId);
      sessionMessageQuery = "";
      renderViewer();
      setTimeout(() => $("msg-" + b.dataset.messageId)?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
      closeSidebar();
    });
    renderSearchBulk();
    return;
  }
  $("sessions").innerHTML =
    (selectable && rows.length
      ? `<button id="toggleAllSearchResults" class="search-select-all">${allVisibleSelected ? `検索結果 ${rows.length}件の選択を解除` : `検索結果 ${rows.length}件をすべて選択`}</button>`
      : "") +
    (rows
      .map((s) => {
        const hit = matchInfo(s, q),
          content = `<strong>${tq ? mark(s.title, tq) : esc(replaceText(s.title))}</strong><div class="session-meta">${esc(date(s.time))} · ${esc(effectivePersona(s))} · ${s.messages.filter((m) => !m.hidden).length}件${q ? ` · ${hit.count}件一致` : ""}</div>${q ? `<div class="match-preview">${mark(hit.preview, q)}</div>` : ""}<button class="open-session" data-id="${esc(s.id)}">${searchMode === "body" ? "このセッション内の結果" : "このセッションを開く"}</button>`;
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
    .forEach((b) => (b.onclick = () => {
      if (searchMode === "body") {
        searchSessionId = b.dataset.id;
        openSession(b.dataset.id);
        setSearchMode("session");
        openSidebar();
      } else openSession(b.dataset.id);
    }));
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
  const terms = searchTerms(q).sort((a, b) => b.length - a.length);
  if (!terms.length) return h;
  const safe = terms
    .map((term) => esc(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
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
function renderMemoText(text) {
  const linked = String(text ?? "").replace(
    /(^|\s)(https?:\/\/[^\s<]+)/g,
    (whole, prefix, url) => `${prefix}[${url}](${url})`,
  );
  return renderMarkdown(linked);
}
function memoDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
function renderNotesAfter(s, anchorId) {
  s.notes = Array.isArray(s.notes) ? s.notes : [];
  return s.notes
    .filter((note) => (note.anchorId || null) === (anchorId || null))
    .map((note) => `<div class="memo-card" id="note-${esc(note.id)}"><div class="markdown-body">${renderMemoText(note.text)}</div><details class="memo-menu"><summary aria-label="メモの操作">•••</summary><span class="memo-actions"><button data-memo-move="up" data-note-id="${esc(note.id)}" title="一つ前の位置へ">↑</button><button data-memo-move="down" data-note-id="${esc(note.id)}" title="一つ後の位置へ">↓</button><button data-note-edit="${esc(note.id)}">編集</button><button data-note-delete="${esc(note.id)}">削除</button></span></details></div>`)
    .join("");
}
function openMemoEditor(s, anchorId = null, note = null) {
  memoDraft = { sessionId: s.id, anchorId: anchorId || null, noteId: note?.id || null };
  $("memoEditorTitle").textContent = note ? "メモを編集" : "メモを挿入";
  $("memoText").value = note?.text || "";
  $("memoEditor").showModal();
  setTimeout(() => $("memoText").focus(), 0);
}
function renderSessionPanel(){const p=$("sessionPanel"),s=all.find(x=>x.id===selected);if(!p)return;if(!s){p.innerHTML='<p class="muted">セッションを開くと使えます。</p>';return}s.namedSelections=Array.isArray(s.namedSelections)?s.namedSelections:[];s.notes=Array.isArray(s.notes)?s.notes:[];const n=messageSelected.size,shown=visibleMessages(s),q=sessionMessageQuery.trim().toLowerCase(),hitCount=shown.filter(m=>(!sessionModelFilter||(m.role==="assistant"&&m.model===sessionModelFilter))&&(!q||includesAllTerms(m.text, q))).length,filtering=Boolean(q||sessionModelFilter);p.innerHTML=`<div class="session-panel-head"><strong>このセッション</strong><button id="closeSessionPanel" aria-label="閉じる">×</button></div><div class="session-panel-grid"><button id="sessionTop" class="session-panel-action">↑ 最上部</button><button id="sessionBottom" class="session-panel-action">↓ 最下部</button><button id="panelCopy" class="session-panel-action primary" ${n?"":"disabled"}>コピー（${n}）</button><button id="panelSaveMemory" class="session-panel-action primary" ${n?"":"disabled"}>新しい思い出に保存</button><button id="panelAppendMemory" class="session-panel-action wide" ${n&&s.namedSelections.length?"":"disabled"}>選択中の${n}件を既存の思い出に追加</button></div><div class="session-panel-section"><label>セッション内発言検索<input id="panelSessionSearch" type="search" value="${esc(sessionMessageQuery)}" placeholder="発言本文を検索"></label><label>モデル絞り込み<select id="panelModelFilter"><option value="">すべてのモデル</option>${s.models.map(x=>`<option value="${esc(x)}" ${x===sessionModelFilter?"selected":""}>${esc(x)}</option>`).join("")}</select></label><label class="session-panel-check"><input id="panelIncludePrevious" type="checkbox" ${sessionIncludePrevious?"checked":""} ${sessionModelFilter?"":"disabled"}>直前の入力も表示</label><span id="panelFilterCount" class="session-panel-count">${filtering?`${hitCount} / ${shown.length} 発言が該当`:"検索語かモデルを指定すると、該当件数を表示します。"}</span><button id="panelShowResults" class="session-panel-result" ${filtering?"":"disabled"}>検索結果を見る</button></div><div class="session-panel-section"><strong>このセッション内の思い出（${s.namedSelections.length}）</strong><div class="session-panel-memories">${s.namedSelections.length?s.namedSelections.map(x=>`<button class="session-panel-memory" data-panel-memory="${esc(x.id)}">${esc(x.title)}（${x.messageIds.length}件）</button>`).join(""):'<span class="session-panel-count">まだ保存されていません。</span>'}</div></div><div class="session-panel-section"><strong>このセッションのメモ（${s.notes.length}）</strong><div class="session-panel-memories">${s.notes.length?s.notes.map(x=>`<button class="session-panel-memory" data-panel-note="${esc(x.id)}">${esc(String(x.text || "").replace(/\s+/g," ").slice(0,60))}${String(x.text || "").length>60?"…":""}</button>`).join(""):'<span class="session-panel-count">まだ保存されていません。</span>'}</div></div><div class="session-panel-section"><button id="focusModeBtn" class="session-panel-action">UI非表示で全画面表示</button></div>`;
$("closeSessionPanel").onclick=closeSessionPanel;$("sessionTop").onclick=()=>scrollSessionEdge(false);$("sessionBottom").onclick=()=>scrollSessionEdge(true);$("panelCopy").onclick=()=>{closeSessionPanel();$("copyMessages")?.click()};$("panelSaveMemory").onclick=()=>{closeSessionPanel();$("saveNamedSelection")?.click()};$("panelAppendMemory").onclick=()=>{closeSessionPanel();$("appendNamedSelection")?.click()};$("panelShowResults").onclick=()=>{closeSessionPanel();requestAnimationFrame(()=>document.querySelector(".conversation .message")?.scrollIntoView({behavior:"smooth",block:"start"}))};const panelSearch=$("panelSessionSearch");let panelSearchComposing=false;const applyPanelSearch=()=>{const value=panelSearch.value;if(value===sessionMessageQuery)return;sessionMessageQuery=value;renderViewer({updatePanel:false});const current=all.find(x=>x.id===selected),messages=current?visibleMessages(current):[],needle=sessionMessageQuery.trim().toLowerCase(),count=messages.filter(m=>(!sessionModelFilter||(m.role==="assistant"&&m.model===sessionModelFilter))&&(!needle||includesAllTerms(m.text, needle))).length,filteringNow=Boolean(needle||sessionModelFilter),status=$("panelFilterCount"),show=$("panelShowResults");if(status)status.textContent=filteringNow?`${count} / ${messages.length} 発言が該当`:"検索語かモデルを指定すると、該当件数を表示します。";if(show)show.disabled=!filteringNow};panelSearch.oncompositionstart=()=>{panelSearchComposing=true};panelSearch.oncompositionend=()=>{panelSearchComposing=false;queueMicrotask(applyPanelSearch)};panelSearch.oninput=e=>{if(panelSearchComposing||e.isComposing)return;applyPanelSearch()};$("panelModelFilter").onchange=e=>{sessionModelFilter=e.target.value;if(!sessionModelFilter)sessionIncludePrevious=false;renderViewer();};$("panelIncludePrevious").onchange=e=>{sessionIncludePrevious=e.target.checked;renderViewer();};document.querySelectorAll("[data-panel-memory]").forEach(b=>b.onclick=()=>{const m=s.namedSelections.find(x=>x.id===b.dataset.panelMemory);activeNamedSelection=m?.id||"";sessionMessageQuery="";sessionModelFilter="";sessionIncludePrevious=false;renderViewer();closeSessionPanel();const first=m?.messageIds.find(id=>visibleMessages(s).some(x=>x.id===id));if(first)setTimeout(()=>$("msg-"+first)?.scrollIntoView({behavior:"smooth",block:"center"}),0)});document.querySelectorAll("[data-panel-note]").forEach(b=>b.onclick=()=>{const noteId=b.dataset.panelNote;sessionMessageQuery="";sessionModelFilter="";sessionIncludePrevious=false;renderViewer();closeSessionPanel();setTimeout(()=>$("note-"+noteId)?.scrollIntoView({behavior:"smooth",block:"center"}),0)});$("focusModeBtn").onclick=()=>{closeSessionPanel();closeSidebar();document.body.classList.add("focus-mode")}}
function renderViewer({updatePanel=true}={}) {
  const s = all.find((x) => x.id === selected);
  if (!s) return;
  s.namedSelections = Array.isArray(s.namedSelections) ? s.namedSelections : [];
  s.notes = Array.isArray(s.notes) ? s.notes : [];
  const q=sessionMessageQuery.trim(),model=sessionModelFilter,allShown=visibleMessages(s),directMatches=allShown.filter(m=>(!model||(m.role==="assistant"&&m.model===model))&&(!q||includesAllTerms(m.text, q))),contextIds=new Set(directMatches.map(m=>m.id)),shown=(()=>{if(model&&sessionIncludePrevious)directMatches.forEach(m=>{const i=allShown.findIndex(x=>x.id===m.id);for(let j=i-1;j>=0;j--)if(allShown[j].role==="user"){contextIds.add(allShown[j].id);break}});return allShown.filter(m=>contextIds.has(m.id))})(),
    chosen = shown.filter((m) => messageSelected.has(m.id)),
    active = s.namedSelections.find((x) => x.id === activeNamedSelection),
    activeIds = new Set(active?.messageIds || []),
    folderFixed = settings.folderPersonas[s.folder || "未分類"] || "";
  $("viewer").innerHTML =
    `<article class="conversation"><div class="title-row"><div><h2>${esc(replaceText(s.title))}</h2><div class="meta">${esc(date(s.time))} · ${esc(s.models.join(", ") || "モデル不明")}</div></div><div class="tools"><button id="addTopMemo">＋ 冒頭にメモ</button><button id="exportMd">Markdown</button><button id="exportJson">JSON</button></div></div><div class="saved-selection-nav"><div class="saved-selection-head"><strong>保存した思い出</strong><span>${s.namedSelections.length}件</span></div>${s.namedSelections.length ? `<div class="saved-selection-list">${s.namedSelections.map((x) => `<button data-memory-id="${esc(x.id)}" class="${x.id === activeNamedSelection ? "active" : ""}">${esc(x.title)}（${x.messageIds.length}件）</button>`).join("")}</div>${active ? '<div class="saved-selection-actions"><button id="editNamedSelection">会話を追加・除去</button><button id="renameNamedSelection">名前を変更</button><button id="deleteNamedSelection" class="memory-remove">この思い出を削除</button></div>' : ""}` : '<p class="muted">発言を選択して「タイトルをつけて保存」すると、ここや思い出一覧から開けます。</p>'}</div><div class="session-fields"><label>ペルソナ<select id="sessionPersona" ${folderFixed ? "disabled" : ""}>${personaOptions()
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
      )}</select><span class="field-note">新規追加は「表示設定」からできます。</span></label></div>${!q&&!model?renderNotesAfter(s,null):""}${shown.map((m) => `<div class="message ${m.role} ${messageSelected.has(m.id) ? "copy-selected" : ""} ${m.id === messageSelectionAnchor ? "selection-anchor" : ""} ${activeIds.has(m.id) ? "saved-selection" : ""}" id="msg-${esc(m.id)}"><div class="message-head"><span class="message-label-wrap"><span class="label">${esc(nameOf(m, s))}${m.role === "assistant" ? " · " + esc(m.model || "モデル不明") : ""}</span><time class="message-time">${esc(messageDate(m.time))}</time></span><span>${messageSelected.size && m.id !== messageSelectionAnchor ? `<button class="range-select" data-range-mid="${esc(m.id)}">ここまで選択</button>` : ""}<label class="message-select"><input type="checkbox" data-copy-mid="${esc(m.id)}" ${messageSelected.has(m.id) ? "checked" : ""}>選択</label><button class="edit icon-btn" data-mid="${esc(m.id)}">編集</button><button class="hide icon-btn" data-mid="${esc(m.id)}">非表示</button></span></div><div class="body markdown-body">${q ? mark(m.text, q) : renderMarkdown(m.text)}</div>${(q||model)?`<button class="jump-original" data-jump-mid="${esc(m.id)}">元の位置へ</button>`:""}</div>${!q&&!model?`<button class="add-memo-after" data-add-memo-after="${esc(m.id)}">＋ この位置にメモ</button>${renderNotesAfter(s,m.id)}`:""}`).join("") || '<p class="muted">該当する発言がありません。</p>'}${chosen.length ? `<div class="message-copy-bar"><strong>${editingMemoryId ? "思い出を編集中 · " : ""}${chosen.length}件の発言を選択中</strong><div class="message-copy-actions"><button id="saveNamedSelection">${editingMemoryId ? "思い出の内容を更新" : "タイトルをつけて保存"}</button>${!editingMemoryId && s.namedSelections.length ? '<button id="appendNamedSelection">既存の思い出に追加</button>' : ""}<button id="copyMessages">テキストをコピー</button><button id="cancelMessageCopy" class="copy-cancel">選択解除</button></div></div>` : ""}<details class="hidden-box"><summary>非表示の発言（${s.messages.filter((m) => m.hidden).length}）</summary>${s.messages
      .filter((m) => m.hidden)
      .map(
        (m) =>
          `<button class="restore" data-mid="${esc(m.id)}">${esc(nameOf(m, s))}の発言を戻す</button>`,
      )
      .join("")}</details></article>`;
  if(updatePanel)renderSessionPanel();
  const addTopMemo = $("addTopMemo");
  if (addTopMemo) addTopMemo.onclick = () => openMemoEditor(s, null);
  document.querySelectorAll("[data-add-memo-after]").forEach(
    (button) => (button.onclick = () => openMemoEditor(s, button.dataset.addMemoAfter)),
  );
  document.querySelectorAll("[data-note-edit]").forEach(
    (button) => (button.onclick = () => {
      const note = s.notes.find((item) => item.id === button.dataset.noteEdit);
      if (note) openMemoEditor(s, note.anchorId, note);
    }),
  );
  document.querySelectorAll("[data-note-delete]").forEach(
    (button) => (button.onclick = async () => {
      const note = s.notes.find((item) => item.id === button.dataset.noteDelete);
      if (!note || !confirm("このメモを削除しますか？")) return;
      s.notes = s.notes.filter((item) => item.id !== note.id);
      await save();
      renderViewer();
    }),
  );
  document.querySelectorAll("[data-memo-move]").forEach(
    (button) => (button.onclick = async () => {
      const note = s.notes.find((item) => item.id === button.dataset.noteId);
      if (!note) return;
      const anchors = [null, ...visibleMessages(s).map((message) => message.id)];
      const current = Math.max(0, anchors.indexOf(note.anchorId || null));
      const delta = button.dataset.memoMove === "up" ? -1 : 1;
      note.anchorId = anchors[Math.max(0, Math.min(anchors.length - 1, current + delta))];
      await save();
      renderViewer();
      setTimeout(() => $("note-" + note.id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
    }),
  );
  const rerenderKeepingPosition = (anchorId) => {
    const restoreToken = ++viewportRestoreToken;
    const anchorTop = anchorId
        ? $("msg-" + anchorId)?.getBoundingClientRect().top
        : null,
      viewerTop = $("viewer").scrollTop,
      pageTop = window.scrollY;
    document.activeElement?.blur?.();
    document.documentElement.style.overflowAnchor = "none";
    document.body.style.overflowAnchor = "none";
    renderViewer();
    let stableFrames = 0;
    const restorePosition = () => {
      if (restoreToken !== viewportRestoreToken) return true;
      const nextAnchor = anchorId ? $("msg-" + anchorId) : null;
      if (Number.isFinite(anchorTop) && nextAnchor) {
        const delta = nextAnchor.getBoundingClientRect().top - anchorTop;
        if (Math.abs(delta) < 0.5) stableFrames += 1;
        else stableFrames = 0;
        if (matchMedia("(max-width:760px)").matches) window.scrollBy(0, delta);
        else $("viewer").scrollTop += delta;
      } else {
        $("viewer").scrollTop = viewerTop;
        window.scrollTo(0, pageTop);
      }
      return stableFrames >= 3;
    };
    let frames = 0;
    const followLayout = () => {
      const stable = restorePosition();
      frames += 1;
      if (!stable && frames < 18) requestAnimationFrame(followLayout);
      else if (restoreToken === viewportRestoreToken) {
        document.documentElement.style.overflowAnchor = "";
        document.body.style.overflowAnchor = "";
      }
    };
    requestAnimationFrame(followLayout);
    [100, 250, 500].forEach((delay) =>
      setTimeout(() => {
        if (restoreToken !== viewportRestoreToken) return;
        restorePosition();
        if (delay === 500) {
          document.documentElement.style.overflowAnchor = "";
          document.body.style.overflowAnchor = "";
        }
      }, delay),
    );
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
        rerenderKeepingPosition(c.dataset.copyMid);
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
        rerenderKeepingPosition(b.dataset.rangeMid);
      }),
  );
  document.querySelectorAll("[data-jump-mid]").forEach(b=>b.onclick=()=>{
    const id=b.dataset.jumpMid;
    navigationBackStack.push({
      selected,
      viewMode,
      sessionMessageQuery,
      sessionModelFilter,
      sessionIncludePrevious,
      activeNamedSelection,
      viewerScroll: $("viewer").scrollTop,
      pageScroll: window.scrollY,
    });
    sessionMessageQuery="";
    sessionModelFilter="";
    sessionIncludePrevious=false;
    renderViewer();
    setTimeout(()=>$("msg-"+id)?.scrollIntoView({behavior:"smooth",block:"center"}),0)
  });
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
  if ($("editNamedSelection"))
    $("editNamedSelection").onclick = () => {
      if (!active) return;
      editingMemoryId = active.id;
      messageSelected = new Set(active.messageIds);
      messageSelectionAnchor = active.messageIds.at(-1) || "";
      renderViewer();
      const first = active.messageIds.find((id) => $("msg-" + id));
      if (first) setTimeout(() => $("msg-" + first)?.scrollIntoView({ block: "center" }), 0);
    };
  if ($("renameNamedSelection"))
    $("renameNamedSelection").onclick = async () => {
      if (!active) return;
      const title = prompt("思い出の名前を変更", active.title);
      if (!title?.trim() || title.trim() === active.title) return;
      active.title = title.trim();
      await save();
      renderViewer();
    };
  if ($("appendNamedSelection"))
    $("appendNamedSelection").onclick = () => openMemoryPicker(s);
  if ($("saveNamedSelection"))
    $("saveNamedSelection").onclick = async () => {
      if (editingMemoryId) {
        const memory = s.namedSelections.find((x) => x.id === editingMemoryId);
        if (!memory) return;
        memory.messageIds = s.messages
          .filter((m) => !m.hidden && messageSelected.has(m.id))
          .map((m) => m.id);
        editingMemoryId = "";
        activeNamedSelection = memory.id;
        messageSelected.clear();
        messageSelectionAnchor = "";
        await save();
        renderViewer();
        alert(`思い出「${memory.title}」の内容を更新しました。`);
        return;
      }
      const title = prompt("この選択範囲のタイトル");
      if (!title?.trim()) return;
      const item = {
        id: `range-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: title.trim(),
        folder: s.folder || "未分類",
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
      editingMemoryId = "";
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
  const fill = (ids, values) => {
    ids.forEach((id) => {
      const previous = new Set(selectedValues(id));
      $(id).innerHTML = values.map((x) => `<option ${previous.has(x) ? "selected" : ""}>${esc(x)}</option>`).join("");
    });
  };
  fill(["model", "excludeModel"], [...new Set(activeSessions().flatMap((x) => x.models))].sort());
  fill(["folder", "excludeFolder"], folderOptions().sort());
  fill(["persona", "excludePersona"], personaOptions());
  $("searchModeSession").disabled = !selected && !searchSessionId;
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
    notes: s.notes || [],
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
function messageDay(t) {
  return t
    ? new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(t * 1000))
    : "";
}
function copyTextForIds(s, messageIds) {
  const ids = new Set(messageIds);
  const parts = [];
  const messages = s.messages.filter((m) => !m.hidden);
  let previousIndex = -1;
  let previousDay = "";
  (s.notes || []).filter((note) => !note.anchorId).forEach((note) => {
    if (ids.size === messages.length) parts.push(`【編纂メモ】\n${replaceText(note.text)}`);
  });
  messages.forEach((m, index) => {
    if (!ids.has(m.id)) return;
    const day = messageDay(m.time);
    const hasGap = previousIndex >= 0 && index > previousIndex + 1;
    const dayChanged = previousIndex >= 0 && day && day !== previousDay;
    if (hasGap || dayChanged) {
      parts.push(dayChanged ? `---\n${day}` : "---");
    }
    parts.push(`${nameOf(m, s)}${m.role === "assistant" ? `・${m.model || "モデル不明"}` : ""}：\n${replaceText(m.text)}`);
    (s.notes || []).filter((note) => note.anchorId === m.id).forEach((note) => parts.push(`【編纂メモ】\n${replaceText(note.text)}`));
    previousIndex = index;
    previousDay = day;
  });
  return parts.join("\n\n");
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
    (() => {
      const parts = [];
      x.notes.filter((note) => !note.anchorId).forEach((note) => parts.push(`> **編纂メモ**\n>\n> ${replaceText(note.text).replace(/\n/g, "\n> ")}`));
      x.messages.forEach((m) => {
        parts.push(`## ${m.speaker}${m.model ? `（${m.model}）` : ""}\n\n${m.text}`);
        x.notes.filter((note) => note.anchorId === m.id).forEach((note) => parts.push(`> **編纂メモ**\n>\n> ${replaceText(note.text).replace(/\n/g, "\n> ")}`));
      });
      return parts.join("\n\n");
    })() +
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
function openSession(id, { inheritSearch = false } = {}) {
  const inheritedQuery =
    inheritSearch && searchMode === "body" ? $("unifiedSearch").value.trim() : "";
  selected = id;
  searchSessionId = id;
  $("searchModeSession").disabled = false;
  sessionMessageQuery = inheritedQuery;
  sessionModelFilter = "";
  sessionIncludePrevious = false;
  messageSelected.clear();
  messageSelectionAnchor = "";
  editingMemoryId = "";
  activeNamedSelection = "";
  viewMode = "session";
  renderList();
  renderViewer();
  if (inheritedQuery) {
    const s = all.find((x) => x.id === id);
    const first = visibleMessages(s).find((m) =>
      includesAllTerms(m.text, inheritedQuery),
    );
    if (first)
      setTimeout(
        () =>
          $("msg-" + first.id)?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          }),
        0,
      );
  }
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
    .sort((a, b) => memoryTimestamp(b.session, b.memory) - memoryTimestamp(a.session, a.memory));
}
function memoryTimestamp(session, memory) {
  const ids = new Set(memory.messageIds || []);
  const first = session.messages.find((message) => ids.has(message.id));
  return Number(first?.time || session.time || 0);
}
function memoryFolder(session, memory) {
  return session.folder || "未分類";
}
function memoryCopyText(session, memory) {
  const heading = [memory.title, memoryDate(session, memory)]
    .filter(Boolean)
    .join(" ");
  return `${heading}\n\n${copyTextForIds(session, memory.messageIds)}`;
}
function memoryExportPayload(session, memory) {
  const ids = new Set(memory.messageIds || []);
  return {
    format: "seishi-memory",
    version: 1,
    exportedAt: new Date().toISOString(),
    memory: {
      id: memory.id,
      title: memory.title,
      date: memoryDate(session, memory) || null,
      folder: memoryFolder(session, memory),
      messageIds: [...ids],
    },
    sourceSession: {
      id: session.id,
      title: session.title,
      createdAt: session.time || null,
      folder: memoryFolder(session, memory),
      persona: session.persona || "未分類",
    },
    messages: session.messages
      .filter((message) => ids.has(message.id) && !message.hidden)
      .map((message) => ({
        id: message.id,
        role: message.role,
        speaker: nameOf(message, session),
        model: message.model || null,
        createdAt: message.time || null,
        text: message.text,
      })),
  };
}
function exportMemoryJson(session, memory) {
  const day = memoryDate(session, memory);
  download(
    `${safeName(memory.title)}${day ? `_${day}` : ""}.json`,
    JSON.stringify(memoryExportPayload(session, memory), null, 2),
    "application/json",
  );
}
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++)
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function zipNumber(view, offset, value, bytes) {
  if (bytes === 2) view.setUint16(offset, value, true);
  else view.setUint32(offset, value, true);
}
function makeZip(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;
  const now = new Date();
  const dosTime =
    (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate =
    ((now.getFullYear() - 1980) << 9) |
    ((now.getMonth() + 1) << 5) |
    now.getDate();
  files.forEach(({ name, text }) => {
    const fileName = encoder.encode(name);
    const data = encoder.encode(text);
    const checksum = crc32(data);
    const local = new Uint8Array(30 + fileName.length + data.length);
    const localView = new DataView(local.buffer);
    zipNumber(localView, 0, 0x04034b50, 4);
    zipNumber(localView, 4, 20, 2);
    zipNumber(localView, 6, 0x0800, 2);
    zipNumber(localView, 10, dosTime, 2);
    zipNumber(localView, 12, dosDate, 2);
    zipNumber(localView, 14, checksum, 4);
    zipNumber(localView, 18, data.length, 4);
    zipNumber(localView, 22, data.length, 4);
    zipNumber(localView, 26, fileName.length, 2);
    local.set(fileName, 30);
    local.set(data, 30 + fileName.length);
    localParts.push(local);

    const central = new Uint8Array(46 + fileName.length);
    const centralView = new DataView(central.buffer);
    zipNumber(centralView, 0, 0x02014b50, 4);
    zipNumber(centralView, 4, 20, 2);
    zipNumber(centralView, 6, 20, 2);
    zipNumber(centralView, 8, 0x0800, 2);
    zipNumber(centralView, 12, dosTime, 2);
    zipNumber(centralView, 14, dosDate, 2);
    zipNumber(centralView, 16, checksum, 4);
    zipNumber(centralView, 20, data.length, 4);
    zipNumber(centralView, 24, data.length, 4);
    zipNumber(centralView, 28, fileName.length, 2);
    zipNumber(centralView, 42, localOffset, 4);
    central.set(fileName, 46);
    centralParts.push(central);
    localOffset += local.length;
  });
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  zipNumber(endView, 0, 0x06054b50, 4);
  zipNumber(endView, 8, files.length, 2);
  zipNumber(endView, 10, files.length, 2);
  zipNumber(endView, 12, centralSize, 4);
  zipNumber(endView, 16, localOffset, 4);
  return new Blob([...localParts, ...centralParts, end], {
    type: "application/zip",
  });
}
function exportMemoryFolderZip(folder, items) {
  const usedNames = new Map();
  const files = items.map(({ session, memory }) => {
    const day = memoryDate(session, memory);
    const base = `${safeName(memory.title)}${day ? `_${day}` : ""}`;
    const count = (usedNames.get(base) || 0) + 1;
    usedNames.set(base, count);
    return {
      name: `${base}${count > 1 ? `_${count}` : ""}.json`,
      text: JSON.stringify(memoryExportPayload(session, memory), null, 2),
    };
  });
  download(
    `${safeName(folder)}_思い出_${new Date().toISOString().slice(0, 10)}.zip`,
    makeZip(files),
    "application/zip",
  );
}
function showMemoryPreview(session, memory) {
  const text = memoryCopyText(session, memory);
  $("memoryPreviewTitle").textContent = memory.title;
  $("memoryPreviewText").textContent = text;
  $("copyMemoryPreview").onclick = async () => {
    await copyToClipboard(text);
    $("copyMemoryPreview").textContent = "コピーしました";
    setTimeout(() => {
      if ($("copyMemoryPreview"))
        $("copyMemoryPreview").textContent = "テキストをコピー";
    }, 1400);
  };
  $("memoryPreview").showModal();
}
function noteItems() {
  return activeSessions()
    .flatMap((session) =>
      (session.notes || []).map((note) => ({ session, note })),
    )
    .sort((a, b) => (b.note.updatedAt || b.note.createdAt || 0) - (a.note.updatedAt || a.note.createdAt || 0));
}
function showNotes() {
  selected = "";
  currentFolder = "";
  bulkSelected.clear();
  viewMode = "notes";
  renderList();
  renderViewer();
}
function openNote(sessionId, noteId) {
  selected = sessionId;
  sessionMessageQuery = "";
  sessionModelFilter = "";
  sessionIncludePrevious = false;
  messageSelected.clear();
  messageSelectionAnchor = "";
  activeNamedSelection = "";
  viewMode = "session";
  renderList();
  renderViewer();
  setTimeout(() => $("note-" + noteId)?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  if (matchMedia("(max-width:760px)").matches) closeSidebar();
}
function renderNotes() {
  const items = noteItems();
  $("viewer").scrollTop = 0;
  $("viewer").innerHTML = `<section class="archive-browser"><nav class="breadcrumbs"><button id="backToFolders">フォルダ一覧</button><span>›</span><strong>メモ一覧</strong></nav><div class="browser-heading"><div><p class="browser-kicker">NOTES</p><h2>メモ一覧</h2><p class="muted">編纂室で挿入したメモをまとめて確認できます。</p></div><span class="count-badge">${items.length} 件</span></div><div class="note-list">${items.map(({ session, note }) => `<article class="note-entry"><div class="note-entry-head"><span><strong>${esc(replaceText(session.title))}</strong><small>${esc(session.folder || "未分類")} · ${esc(memoDate(note.updatedAt || note.createdAt))}</small></span><button data-open-note="${esc(note.id)}" data-session-id="${esc(session.id)}">元の位置へ</button></div><div class="markdown-body">${renderMemoText(note.text)}</div></article>`).join("") || '<div class="empty browser-empty"><div class="moon">✎</div><h2>メモはまだありません</h2><p>セッションの行間へ挿入したメモがここへ並びます。</p></div>'}</div></section>`;
  $("backToFolders").onclick = showFolders;
  document.querySelectorAll("[data-open-note]").forEach((button) => {
    button.onclick = () => openNote(button.dataset.sessionId, button.dataset.openNote);
  });
}
function showMemories() {
  selected = "";
  currentFolder = "";
  currentMemoryFolder = "";
  bulkSelected.clear();
  viewMode = "memories";
  renderList();
  renderViewer();
}
function showMemoryFolder(folder) {
  selected = "";
  currentFolder = "";
  currentMemoryFolder = folder;
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
  sessionMessageQuery = "";
  sessionModelFilter = "";
  sessionIncludePrevious = false;
  messageSelected.clear();
  messageSelectionAnchor = "";
  editingMemoryId = "";
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
  if (!currentMemoryFolder) {
    const folders = [...new Set(items.map(({ session, memory }) => memoryFolder(session, memory)))]
      .sort((a, b) => a.localeCompare(b, "ja"));
    $("viewer").innerHTML =
      `<section class="archive-browser"><nav class="breadcrumbs"><button id="backToFolders">フォルダ一覧</button><span>›</span><strong>思い出一覧</strong></nav><div class="browser-heading"><div><p class="browser-kicker">MEMORIES</p><h2>思い出一覧</h2><p class="muted">元セッションの現在のフォルダごとに並びます。</p></div><span class="count-badge">${items.length} 件</span></div><div class="folder-grid">${folders.map((folder) => {
        const count = items.filter(({ session, memory }) => memoryFolder(session, memory) === folder).length;
        return `<button class="folder-card" data-memory-folder="${esc(folder)}"><span class="folder-icon">✦</span><strong>${esc(folder)}</strong><span>${count} 件の思い出</span></button>`;
      }).join("") || '<div class="empty browser-empty"><div class="moon">✦</div><h2>保存した思い出はまだありません</h2><p>セッション内で発言を選択し、「タイトルをつけて保存」するとここへ並びます。</p></div>'}</div></section>`;
    $("backToFolders").onclick = showFolders;
    document.querySelectorAll("[data-memory-folder]").forEach(
      (button) => (button.onclick = () => showMemoryFolder(button.dataset.memoryFolder)),
    );
    return;
  }
  const folderItems = items.filter(
    ({ session, memory }) => memoryFolder(session, memory) === currentMemoryFolder,
  );
  $("viewer").innerHTML =
    `<section class="archive-browser"><nav class="breadcrumbs"><button id="backToFolders">フォルダ一覧</button><span>›</span><button id="backToMemories">思い出一覧</button><span>›</span><strong>${esc(currentMemoryFolder)}</strong></nav><div class="browser-heading"><div><p class="browser-kicker">MEMORIES</p><h2>${esc(currentMemoryFolder)}の思い出</h2><p class="muted">思い出に含まれる最初の発言日時が新しい順に並びます。</p></div><span class="count-badge">${folderItems.length} 件</span></div>${folderItems.length ? '<div class="memory-folder-export"><button id="exportMemoryFolderZip">フォルダをZIP出力</button></div>' : ""}<div class="memory-list">${folderItems.map(({ session, memory }) => `<article class="memory-entry"><button class="memory-entry-main" data-open-memory="${esc(memory.id)}" data-session-id="${esc(session.id)}"><strong class="memory-entry-title">${esc(memory.title)}${memoryDate(session, memory) ? ` <span>${esc(memoryDate(session, memory))}</span>` : ""}</strong><small class="memory-entry-meta">${esc(replaceText(session.title))} · ${memory.messageIds.length}件</small></button><div class="memory-actions"><button class="memory-preview" data-preview-memory="${esc(memory.id)}" data-session-id="${esc(session.id)}">プレビュー</button><button class="memory-json" data-json-memory="${esc(memory.id)}" data-session-id="${esc(session.id)}">JSON出力</button><button class="memory-edit" data-edit-memory="${esc(memory.id)}" data-session-id="${esc(session.id)}">内容編集</button><button class="memory-rename" data-rename-memory="${esc(memory.id)}" data-session-id="${esc(session.id)}">名前変更</button><button class="memory-delete" data-delete-memory="${esc(memory.id)}" data-session-id="${esc(session.id)}">削除</button></div></article>`).join("") || '<p class="muted">このフォルダに思い出はありません。</p>'}</div></section>`;
  $("backToFolders").onclick = showFolders;
  $("backToMemories").onclick = showMemories;
  document
    .querySelectorAll("[data-open-memory]")
    .forEach(
      (button) =>
        (button.onclick = () =>
          openMemory(button.dataset.sessionId, button.dataset.openMemory)),
    );
  $("exportMemoryFolderZip")?.addEventListener("click", () =>
    exportMemoryFolderZip(currentMemoryFolder, folderItems),
  );
  document.querySelectorAll("[data-preview-memory]").forEach(
    (button) =>
      (button.onclick = () => {
        const session = all.find((x) => x.id === button.dataset.sessionId);
        const memory = session?.namedSelections?.find(
          (x) => x.id === button.dataset.previewMemory,
        );
        if (!memory) return;
        showMemoryPreview(session, memory);
      }),
  );
  document.querySelectorAll("[data-json-memory]").forEach(
    (button) =>
      (button.onclick = () => {
        const session = all.find((x) => x.id === button.dataset.sessionId);
        const memory = session?.namedSelections?.find(
          (x) => x.id === button.dataset.jsonMemory,
        );
        if (memory) exportMemoryJson(session, memory);
      }),
  );
  document.querySelectorAll("[data-edit-memory]").forEach(
    (button) =>
      (button.onclick = () => {
        openMemory(button.dataset.sessionId, button.dataset.editMemory);
        const session = all.find((x) => x.id === button.dataset.sessionId);
        const memory = session?.namedSelections?.find(
          (x) => x.id === button.dataset.editMemory,
        );
        if (!memory) return;
        editingMemoryId = memory.id;
        messageSelected = new Set(memory.messageIds);
        messageSelectionAnchor = memory.messageIds.at(-1) || "";
        renderViewer();
      }),
  );
  document.querySelectorAll("[data-rename-memory]").forEach(
    (button) =>
      (button.onclick = async () => {
        const session = all.find((x) => x.id === button.dataset.sessionId);
        const memory = session?.namedSelections?.find(
          (x) => x.id === button.dataset.renameMemory,
        );
        if (!memory) return;
        const title = prompt("思い出の名前を変更", memory.title);
        if (!title?.trim() || title.trim() === memory.title) return;
        memory.title = title.trim();
        await save();
        renderMemories();
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
  const memories = memoryItems(), notes = noteItems();
  $("viewer").innerHTML =
    `<section class="archive-browser"><div class="browser-heading"><div><p class="browser-kicker">ARCHIVE</p><h2>フォルダ一覧</h2><p class="muted">フォルダを選ぶと、中のセッションを一覧できます。</p></div><span class="count-badge">${activeSessions().length} セッション</span></div><button id="openMemories" class="memory-card"><span><strong>✦ 思い出一覧</strong><small>タイトルをつけて保存した会話の範囲をまとめて見る</small></span><span class="memory-mark">${memories.length}件 ›</span></button><button id="openNotes" class="memory-card"><span><strong>✎ メモ一覧</strong><small>会話の行間へ挿入した編纂メモをまとめて見る</small></span><span class="memory-mark">${notes.length}件 ›</span></button><button id="openTrash" class="memory-card trash-card"><span><strong>♲ ゴミ箱</strong><small>最新エクスポートとの差異で退避したセッションを確認する</small></span><span class="memory-mark">${all.filter((s) => s.trashedAt).length}件 ›</span></button><div class="folder-grid">${folders.map((f) => `<button class="folder-card" data-folder="${esc(f.name)}"><span class="folder-icon">▰</span><strong>${esc(f.name)}</strong><span>${f.sessions.length} セッション</span></button>`).join("") || '<div class="empty browser-empty"><div class="moon">◐</div><h2>会話は外へ送信されません</h2><p>「ログを追加」からJSONを読み込むと、ここにフォルダが並びます。</p></div>'}</div></section>`;
  $("openMemories").onclick = showMemories;
  $("openNotes").onclick = showNotes;
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
        const rowTop = c.closest(".browser-session-row")?.getBoundingClientRect().top;
        c.checked
          ? bulkSelected.add(c.dataset.selectId)
          : bulkSelected.delete(c.dataset.selectId);
        renderFolderSessions(folder);
        const restoreRow = () => {
          const next = document.querySelector('[data-select-id="' + CSS.escape(c.dataset.selectId) + '"]')?.closest(".browser-session-row");
          if (!next || !Number.isFinite(rowTop)) return;
          const delta = next.getBoundingClientRect().top - rowTop;
          if (matchMedia("(max-width:760px)").matches) window.scrollBy(0, delta);
          else $("viewer").scrollTop += delta;
        };
        restoreRow();
        requestAnimationFrame(restoreRow);
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
renderViewer = function (options) {
  if (viewMode === "folders") return renderFolderBrowser();
  if (viewMode === "folder") return renderFolderSessions(currentFolder);
  if (viewMode === "memories") return renderMemories();
  if (viewMode === "notes") return renderNotes();
  if (viewMode === "trash") return renderTrash();
  const s = all.find((x) => x.id === selected);
  if (!s) {
    viewMode = "folders";
    return renderFolderBrowser();
  }
  renderConversation(options);
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
["search", "model", "persona", "folder", "speaker", "dateFrom", "dateTo", "excludeKeyword", "excludeModel", "excludePersona", "excludeFolder", "excludeSpeaker"].forEach((id) =>
  $(id).addEventListener(id === "search" || id === "excludeKeyword" ? "input" : "change", () => {
    renderList();
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
$("saveMemo").onclick = async (event) => {
  event.preventDefault();
  const text = $("memoText").value.trim();
  const draft = memoDraft;
  if (!text || !draft) return;
  const session = all.find((item) => item.id === draft.sessionId);
  if (!session) return;
  session.notes = Array.isArray(session.notes) ? session.notes : [];
  const existing = session.notes.find((item) => item.id === draft.noteId);
  if (existing) {
    existing.text = text;
    existing.updatedAt = Date.now();
  } else {
    session.notes.push({
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      anchorId: draft.anchorId || null,
      text,
      createdAt: Date.now(),
    });
  }
  const savedNoteId = existing?.id || session.notes.at(-1)?.id;
  memoDraft = null;
  $("memoEditor").close();
  await save();
  renderViewer();
  if (savedNoteId) setTimeout(() => $("note-" + savedNoteId)?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
};
$("memoEditor").addEventListener("close", () => { memoDraft = null; });
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
    };
    await save();
    await load();
    selected = "";
    viewMode = "folders";
    bulkSelected.clear();
    messageSelected.clear();
    $("settings").close();
    rebuildFilters();
    renderList();
    renderViewer();
    alert("完全バックアップから復元しました。");
  } catch (err) {
    console.error(err);
    alert(`復元できませんでした。${err.message || "ファイルをご確認ください。"}`);
  }
};
$("clearArchive").onclick = async () => {
  if (confirm("端末内に保存した会話と編集内容をすべて消しますか？")) {
    await dbDelete(STORE);
    localStorage.removeItem(STORE);
    all = [];
    selected = "";
    $("settings").close();
    rebuildFilters();
    renderList();
    showFolders();
  }
};
let lastViewerScrollTop = 0,
  headerLayoutSettlingUntil = 0;
$("viewer").addEventListener("scroll", () => {
  if (matchMedia("(max-width:760px)").matches) {
    document.body.classList.remove("desktop-header-hidden");
    lastViewerScrollTop = 0;
    return;
  }
  const viewer = $("viewer"),
    top = viewer.scrollTop,
    now = performance.now();
  if (now < headerLayoutSettlingUntil) {
    lastViewerScrollTop = Math.max(0, top);
    return;
  }
  const delta = top - lastViewerScrollTop;
  if (top < 24) {
    document.body.classList.remove("desktop-header-hidden");
  } else if (
    document.body.classList.contains("desktop-header-hidden") &&
    delta < -8
  ) {
    document.body.classList.remove("desktop-header-hidden");
    headerLayoutSettlingUntil = now + 280;
  } else if (
    !document.body.classList.contains("desktop-header-hidden") &&
    top > 72 &&
    delta > 8 &&
    viewer.scrollHeight - viewer.clientHeight - top > 120
  ) {
    document.body.classList.add("desktop-header-hidden");
    headerLayoutSettlingUntil = now + 280;
  }
  lastViewerScrollTop = Math.max(0, top);
}, { passive: true });
addEventListener("resize", () => {
  if (matchMedia("(max-width:760px)").matches)
    document.body.classList.remove("desktop-header-hidden");
});

function restorePreviousScreen() {
  const previous = navigationBackStack.pop();
  if (!previous) return false;
  selected = previous.selected;
  viewMode = previous.viewMode;
  sessionMessageQuery = previous.sessionMessageQuery;
  sessionModelFilter = previous.sessionModelFilter;
  sessionIncludePrevious = previous.sessionIncludePrevious;
  activeNamedSelection = previous.activeNamedSelection;
  renderList();
  renderViewer();
  requestAnimationFrame(() => {
    $("viewer").scrollTop = previous.viewerScroll;
    window.scrollTo(0, previous.pageScroll);
  });
  return true;
}
let swipeStartX = -1, swipeStartY = 0;
document.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  if (!touch || touch.clientX > 42) return;
  swipeStartX = touch.clientX;
  swipeStartY = touch.clientY;
}, { passive: true });
document.addEventListener("touchend", (event) => {
  if (swipeStartX < 0) return;
  const touch = event.changedTouches[0],
    dx = touch.clientX - swipeStartX,
    dy = Math.abs(touch.clientY - swipeStartY);
  swipeStartX = -1;
  if (dx > 90 && dy < 70 && dx > dy * 1.4) {
    if (viewMode === "session" && selected) {
      closeSessionPanel();
      openSidebar();
    } else {
      restorePreviousScreen();
    }
  }
}, { passive: true });

(async () => {
  await load();
  selected = "";
  viewMode = "folders";
  rebuildFilters();
  renderList();
  renderViewer();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
})();

/* memoryAnnotationsV48 */
const maS=document.createElement("style");maS.textContent=".memory-entry{display:block!important;padding:0!important;overflow:hidden}.ma-s{display:flex;justify-content:space-between;padding:15px;cursor:pointer;list-style:none}.ma-s::-webkit-details-marker{display:none}.ma-s strong,.ma-s small{display:block}.ma-s small{margin-top:4px;color:var(--muted)}.ma-a{transition:.18s}.memory-entry[open] .ma-a{transform:rotate(180deg)}.ma-d{padding:0 15px 15px;border-top:1px solid var(--line)}.ma-c{margin-top:12px;padding:11px;background:var(--paper);border-radius:10px;white-space:pre-wrap}.ma-t,.ma-r{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:9px}.ma-tag{padding:4px 8px;border:1px solid var(--accent);border-radius:999px;color:var(--accent);font-size:11px}.memory-actions{grid-template-columns:repeat(3,1fr)}.ma-open{background:var(--accent)!important;color:#fff!important}.ma-edit{border-color:var(--accent)!important;color:var(--accent)!important}.ma-dialog{width:min(620px,calc(100vw - 24px))}.ma-dialog textarea{min-height:110px}.ma-p{display:grid;gap:6px;max-height:32dvh;overflow:auto;padding:8px;border:1px solid var(--line);border-radius:10px}.ma-o{display:grid!important;grid-template-columns:auto 1fr;gap:8px;padding:7px;background:var(--card);border-radius:8px}.ma-o input{width:18px;min-height:18px}.ma-o small{display:block;color:var(--muted)}@media(max-width:760px){.memory-actions{grid-template-columns:1fr 1fr}.ma-open{grid-column:1/-1}}";document.head.append(maS);
const maI=()=>memoryItems(),maT=m=>Array.isArray(m.tags)?m.tags:[],maR=m=>Array.isArray(m.relatedMemoryIds)?m.relatedMemoryIds:[],maF=id=>maI().find(x=>x.memory.id===id);
function maE(m){document.querySelector("#maDialog")?.remove();const c=new Set(maR(m)),d=document.createElement("dialog");d.id="maDialog";d.className="ma-dialog";d.innerHTML=`<form method="dialog"><div class="dialog-head"><h2>コメント・タグ・関連</h2><button value="cancel" class="icon-btn">×</button></div><label>メモ<textarea id="maC">${esc(m.comment||"")}</textarea></label><label>タグ<input id="maT" value="${esc(maT(m).join(", "))}" placeholder="カンマ・読点・改行で区切る"></label><label>関連する思い出</label><div class="ma-p">${maI().filter(x=>x.memory.id!==m.id).map(x=>`<label class="ma-o"><input type="checkbox" value="${esc(x.memory.id)}" ${c.has(x.memory.id)?"checked":""}><span><strong>${esc(x.memory.title)}</strong><small>${esc(memoryDate(x.session,x.memory)||"日付なし")} · ${esc(memoryFolder(x.session,x.memory))}</small></span></label>`).join("")||"ほかの思い出はありません。"}</div><div class="dialog-actions"><button value="cancel" class="secondary-action">キャンセル</button><button id="maSave" type="button">保存</button></div></form>`;document.body.append(d);d.addEventListener("close",()=>d.remove(),{once:true});d.querySelector("#maSave").onclick=async()=>{m.comment=d.querySelector("#maC").value.trim();m.tags=[...new Set(d.querySelector("#maT").value.split(/[、,，\n]/).map(x=>x.trim()).filter(Boolean))];m.relatedMemoryIds=[...d.querySelectorAll(".ma-o input:checked")].map(x=>x.value);await save();d.close();renderMemories()};d.showModal()}
function maCard(s,m){const r=maR(m).map(maF).filter(Boolean);return `<details class="memory-entry"><summary class="ma-s"><span><strong>${esc(m.title)}${memoryDate(s,m)?` <small>${esc(memoryDate(s,m))}</small>`:""}</strong><small>${esc(replaceText(s.title))} · ${m.messageIds.length}件</small></span><span class="ma-a">⌄</span></summary><div class="ma-d">${m.comment?`<div class="ma-c">${esc(m.comment)}</div>`:""}${maT(m).length?`<div class="ma-t">${maT(m).map(x=>`<span class="ma-tag">#${esc(x)}</span>`).join("")}</div>`:""}${r.length?`<div class="ma-r"><small>関連：</small>${r.map(x=>`<button data-mar="${esc(x.memory.id)}">${esc(x.memory.title)}</button>`).join("")}</div>`:""}<div class="memory-actions"><button class="ma-open" data-mao="${esc(m.id)}">元の位置で見る</button><button data-map="${esc(m.id)}">プレビュー</button><button class="ma-edit" data-mae="${esc(m.id)}">コメント・タグ</button><button data-maj="${esc(m.id)}">JSON出力</button><button data-mac="${esc(m.id)}">内容編集</button><button data-man="${esc(m.id)}">名前変更</button><button class="memory-delete" data-mad="${esc(m.id)}">削除</button></div></div></details>`}
const rm47=renderMemories;renderMemories=function(){rm47();if(!currentMemoryFolder)return;const a=maI().filter(x=>memoryFolder(x.session,x.memory)===currentMemoryFolder),l=document.querySelector(".memory-list");if(!l||!a.length)return;l.innerHTML=a.map(x=>maCard(x.session,x.memory)).join("");document.querySelector(".browser-heading .muted").textContent="タイトルをタップすると、コメントと操作を開きます。";
 document.querySelectorAll("[data-mao]").forEach(b=>b.onclick=()=>{const x=maF(b.dataset.mao);openMemory(x.session.id,x.memory.id)});document.querySelectorAll("[data-mar]").forEach(b=>b.onclick=()=>{const x=maF(b.dataset.mar);openMemory(x.session.id,x.memory.id)});document.querySelectorAll("[data-mae]").forEach(b=>b.onclick=()=>maE(maF(b.dataset.mae).memory));document.querySelectorAll("[data-map]").forEach(b=>b.onclick=()=>{const x=maF(b.dataset.map);showMemoryPreview(x.session,x.memory)});document.querySelectorAll("[data-maj]").forEach(b=>b.onclick=()=>{const x=maF(b.dataset.maj);exportMemoryJson(x.session,x.memory)});document.querySelectorAll("[data-mac]").forEach(b=>b.onclick=()=>{const x=maF(b.dataset.mac);openMemory(x.session.id,x.memory.id);editingMemoryId=x.memory.id;messageSelected=new Set(x.memory.messageIds);messageSelectionAnchor=x.memory.messageIds.at(-1)||"";renderViewer()});document.querySelectorAll("[data-man]").forEach(b=>b.onclick=async()=>{const x=maF(b.dataset.man),t=prompt("思い出の名前を変更",x.memory.title);if(!t?.trim()||t.trim()===x.memory.title)return;x.memory.title=t.trim();await save();renderMemories()});document.querySelectorAll("[data-mad]").forEach(b=>b.onclick=async()=>{const x=maF(b.dataset.mad);if(!confirm(`思い出「${x.memory.title}」を削除しますか？`))return;x.session.namedSelections=x.session.namedSelections.filter(m=>m.id!==x.memory.id);all.forEach(s=>(s.namedSelections||[]).forEach(m=>{if(Array.isArray(m.relatedMemoryIds))m.relatedMemoryIds=m.relatedMemoryIds.filter(id=>id!==x.memory.id)}));await save();renderMemories()})};
const me47=memoryExportPayload;memoryExportPayload=function(s,m){const x=me47(s,m);x.memory.comment=m.comment||"";x.memory.tags=maT(m);x.memory.relatedMemoryIds=maR(m);return x};

/* diaryLogsV50 */
const dlCss = document.createElement("style");
dlCss.textContent = ".dl-tools,.dl-actions,.dl-export-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.dl-list{display:grid;gap:10px}.dl-card,.dl-candidates{padding:14px;border:1px solid var(--line);border-radius:15px;background:var(--card)}.dl-card h3{margin:3px 0}.dl-card small{color:var(--muted)}.dl-kind{color:var(--accent);font-size:11px;font-weight:850}.dl-body{margin:11px 0;padding:13px;border-radius:10px;background:var(--paper);white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.75}.dl-actions button,.dl-tools button,.dl-export-actions button{padding:8px 11px;border:1px solid var(--line);border-radius:9px;background:var(--paper);color:var(--ink);font-weight:800}.dl-actions .dl-jump,.dl-export-actions .dl-export-primary{background:var(--accent);color:#fff}.dl-candidate{padding:10px 0;border-top:1px solid var(--line)}.dl-warning{padding:7px;background:#fff1bf;color:#6d5500;border-radius:8px}.dl-dialog{width:min(680px,calc(100vw - 24px))}.dl-dialog textarea{min-height:40dvh}.dl-fields{display:grid;grid-template-columns:1fr 1fr;gap:8px}.dl-source{padding:11px 12px;border:1px solid var(--line);border-radius:12px;background:var(--paper)}.dl-source-meta{margin:0;color:var(--muted);font-size:12px}.dl-source-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:9px}.dl-source-actions button{padding:8px 10px;border:1px solid var(--accent);border-radius:9px;background:var(--card);color:var(--accent);font-weight:800}.dl-source-full{max-height:34dvh;overflow:auto;margin:10px 0 0;padding:11px;border:1px solid var(--line);border-radius:9px;background:var(--card);white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.65 ui-monospace,SFMono-Regular,Menlo,monospace}.dl-source-restore{width:100%;margin-top:8px!important;background:var(--accent)!important;color:#fff!important}.dl-month-export{padding:0 10px 4px}.dl-month-export .dl-export-actions{margin:6px 0}.dl-persona-export{padding:0 15px 3px}.dl-copy-done{border-color:var(--accent)!important;color:var(--accent)!important}@media(max-width:600px){.dl-fields{grid-template-columns:1fr}.dl-source-actions{display:grid;grid-template-columns:1fr 1fr}.dl-source-actions button{width:100%}.dl-export-actions{display:grid;grid-template-columns:1fr 1fr}.dl-export-actions button{min-width:0}}";
document.head.append(dlCss);
const dlGroupCss = document.createElement("style");
dlGroupCss.textContent = ".dl-personas,.dl-months{display:grid;gap:10px}.dl-persona,.dl-month{overflow:hidden;border:1px solid var(--line);border-radius:16px;background:var(--card)}.dl-persona-summary,.dl-month-summary{display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;list-style:none}.dl-persona-summary::-webkit-details-marker,.dl-month-summary::-webkit-details-marker{display:none}.dl-persona-summary{padding:15px 17px;background:color-mix(in srgb,var(--accent) 10%,var(--card))}.dl-persona-summary strong{font-size:17px}.dl-month-summary{padding:12px 15px;border-top:1px solid var(--line);background:var(--paper)}.dl-month-summary strong{font-size:14px}.dl-group-count{color:var(--muted);font-size:12px;font-weight:800;white-space:nowrap}.dl-month-list{display:grid;gap:10px;padding:10px}.dl-month-list .dl-card{background:var(--paper)}.dl-month-list .dl-body{background:var(--card)}@media(max-width:600px){.dl-persona-summary{padding:13px 14px}.dl-month-list{padding:8px}}";
document.head.append(dlGroupCss);
let dlCandidates = [];
function dlList() {
  if (!Array.isArray(settings.diaryEntries)) settings.diaryEntries = [];
  return settings.diaryEntries;
}
function dlDate(time, minus) {
  if (!time) return "";
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(time * 1000 - (minus ? 86400000 : 0)));
}
function dlExplicit(text) {
  const m = String(text || "").match(/(20\d{2})[-\/年](\d{1,2})[-\/月](\d{1,2})日?/);
  return m ? m[1] + "-" + m[2].padStart(2, "0") + "-" + m[3].padStart(2, "0") : "";
}
function dlBody(text, kind) {
  const raw = String(text || "").trim();
  const blocks = Array.from(raw.matchAll(/```(?:text)?\s*([\s\S]*?)```/gi)).map(x => x[1].trim());
  const block = blocks.find(x => /20\d{2}[-\/年]\d{1,2}[-\/月]\d{1,2}|#今日の記録|締めログ/.test(x));
  if (block) return block;
  const start = kind === "closing" ? raw.search(/[〈【]締めログ|締めログ[:：]/) : raw.search(/20\d{2}[-\/年]\d{1,2}[-\/月]\d{1,2}日?/);
  return start >= 0 ? raw.slice(start).trim() : raw;
}
function dlSource(base) {
  if (!base || !base.sessionId) return null;
  const session = all.find(x => x.id === base.sessionId);
  if (!session) return null;
  const ids = Array.isArray(base.messageIds) && base.messageIds.length
    ? base.messageIds
    : base.messageId ? [base.messageId] : [];
  const messages = ids.map(id => session.messages.find(m => m.id === id)).filter(Boolean);
  const source = messages.find(m => m.id === base.messageId && m.role === "assistant") ||
    messages.find(m => m.role === "assistant") ||
    messages.find(m => m.id === base.messageId) ||
    session.messages.find(m => m.id === base.messageId);
  if (!source && !base.sourceText) return null;
  return {
    session,
    message: source,
    time: (source && source.time) || base.sourceTime || 0,
    text: base.sourceText || (source && source.text) || "",
  };
}
function dlSourceTime(time) {
  if (!time) return "投稿時刻不明";
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(time * 1000));
}
function dlScan() {
  const saved = new Set(dlList().map(x => x.sessionId + "::" + x.messageId));
  const found = [];
  activeSessions().forEach(s => (s.messages || []).forEach((m, i) => {
    if (m.hidden || m.role !== "assistant" || saved.has(s.id + "::" + m.id)) return;
    const prev = s.messages[i - 1], ask = prev && prev.role === "user" ? prev.text : "", hay = (m.text || "") + " " + ask;
    const kind = /締めログ/.test(hay) ? "closing" : /#今日の記録|今日の記録/.test(hay) ? "today" : "";
    if (!kind) return;
    const stated = dlExplicit(m.text), dateValue = stated || dlDate(m.time, /昨日(?:ぶん|分|の)?/.test(hay)), persona = effectivePersona(s);
    const duplicate = dlList().some(x => x.kind === kind && x.date === dateValue && x.persona === persona);
    found.push({ id: "cand-" + s.id + "-" + m.id, kind, date: dateValue, body: dlBody(m.text, kind), persona, model: m.model || "", sessionId: s.id, messageId: m.id, messageIds: [m.id], sourceTime: m.time || 0, sourceText: m.text || "", warning: duplicate ? "同じ日付・種別・ペルソナの日記が登録済みです。" : "" });
  }));
  dlCandidates = found.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  dlRender();
}
function dlJump(entry) {
  if (!entry.sessionId || !entry.messageId) return alert("手動登録の日記には元発言がありません。");
  openSession(entry.sessionId);
  renderViewer();
  setTimeout(() => $("msg-" + entry.messageId)?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
}
function dlEditor(item, candidate) {
  document.querySelector("#dlEditor")?.remove();
  const base = item || candidate || { kind: "today", date: dlDate(Date.now() / 1000), body: "", persona: "", model: "" };
  const source = dlSource(base);
  const sourcePanel = source
    ? '<section class="dl-source"><p class="dl-source-meta">元回答の投稿日時：<strong>' + esc(dlSourceTime(source.time)) + '</strong></p><div class="dl-source-actions"><button id="dlJumpSource" type="button">元の位置で確認</button><button id="dlShowSource" type="button">回答全文を表示</button></div><div id="dlSourceFull" hidden><pre class="dl-source-full">' + esc(source.text) + '</pre><button id="dlRestoreSource" class="dl-source-restore" type="button">この全文を本文へ復元</button></div></section>'
    : '<p class="dl-source-meta">元回答：手動登録のため参照元なし</p>';
  const d = document.createElement("dialog");
  d.id = "dlEditor";
  d.className = "dl-dialog";
  d.innerHTML = '<form method="dialog"><div class="dialog-head"><h2>' + (item ? "日記を修正" : candidate ? "日記を登録" : "日記を手動登録") + '</h2><button value="cancel" class="icon-btn">×</button></div>' + sourcePanel + '<div class="dl-fields"><label>種別<select id="dlKind"><option value="today">今日の記録</option><option value="closing">締めログ</option></select></label><label>記録日<input id="dlDate" type="date" value="' + esc(base.date || "") + '"></label><label>ペルソナ<input id="dlPersona" value="' + esc(base.persona || "") + '"></label><label>モデル<input id="dlModel" value="' + esc(base.model || "") + '"></label></div><label>本文<textarea id="dlBody">' + esc(base.body || "") + '</textarea></label><div class="dialog-actions"><button value="cancel" class="secondary-action">キャンセル</button><button id="dlSave" type="button">保存</button></div></form>';
  document.body.append(d);
  d.querySelector("#dlKind").value = base.kind;
  d.addEventListener("close", () => d.remove(), { once: true });
  if (source) {
    d.querySelector("#dlJumpSource").onclick = () => {
      d.close();
      dlJump(base);
    };
    d.querySelector("#dlShowSource").onclick = () => {
      const full = d.querySelector("#dlSourceFull");
      full.hidden = !full.hidden;
      d.querySelector("#dlShowSource").textContent = full.hidden ? "回答全文を表示" : "回答全文を閉じる";
    };
    d.querySelector("#dlRestoreSource").onclick = () => {
      d.querySelector("#dlBody").value = source.text;
      d.querySelector("#dlBody").focus();
    };
  }
  d.querySelector("#dlSave").onclick = async () => {
    const body = d.querySelector("#dlBody").value.trim(), dateValue = d.querySelector("#dlDate").value;
    if (!body || !dateValue) return alert("記録日と本文を入力してください。");
    const entry = { id: item?.id || "diary-" + Date.now(), kind: d.querySelector("#dlKind").value, date: dateValue, body, persona: d.querySelector("#dlPersona").value.trim(), model: d.querySelector("#dlModel").value.trim(), sessionId: base.sessionId || null, messageId: base.messageId || null, messageIds: base.messageIds || [], sourceTime: base.sourceTime || null, sourceText: base.sourceText || (source && source.text) || "", updatedAt: Date.now() };
    const list = dlList(), index = list.findIndex(x => x.id === entry.id);
    if (index >= 0) list[index] = entry; else list.push(entry);
    if (candidate) dlCandidates = dlCandidates.filter(x => x.id !== candidate.id);
    await save();
    d.close();
    viewMode = "diaries";
    selected = "";
    renderList();
    dlRender();
  };
  d.showModal();
}
function dlSelected() {
  const session = all.find(x => x.id === selected);
  if (!session || !messageSelected.size) return null;
  const messages = session.messages.filter(m => messageSelected.has(m.id) && !m.hidden);
  const assistant = messages.find(m => m.role === "assistant") || messages[0];
  const text = messages.map(m => (messages.length > 1 ? nameOf(m, session) + "：\n" : "") + m.text).join("\n\n");
  const kind = /締めログ/.test(text) ? "closing" : "today";
  return { kind, date: dlExplicit(text) || dlDate(assistant.time), body: dlBody(text, kind), persona: effectivePersona(session), model: assistant.model || "", sessionId: session.id, messageId: assistant.id, messageIds: messages.map(m => m.id), sourceTime: assistant.time || 0, sourceText: assistant.text || "" };
}
function dlCard(entry) {
  return '<article class="dl-card"><span class="dl-kind">' + (entry.kind === "closing" ? "締めログ" : "今日の記録") + '</span><h3>' + esc(entry.date) + '</h3><small>' + esc(entry.model || "モデル未設定") + '</small><div class="dl-body">' + esc(entry.body) + '</div><div class="dl-actions">' + (entry.sessionId ? '<button class="dl-jump" data-dlj="' + esc(entry.id) + '">元の位置で見る</button>' : "") + '<button data-dle="' + esc(entry.id) + '">内容修正</button><button data-dld="' + esc(entry.id) + '">削除</button></div></article>';
}
function dlPayload(entries, persona, month) {
  return {
    exportedAt: new Date().toISOString(),
    persona,
    month,
    count: entries.length,
    entries: entries.map(entry => ({
      date: entry.date,
      kind: entry.kind === "closing" ? "締めログ" : "今日の記録",
      model: entry.model || null,
      body: entry.body,
      sourceTime: entry.sourceTime || null,
      sessionId: entry.sessionId || null,
      messageId: entry.messageId || null,
    })),
  };
}
function dlMarkdown(entries, persona, month) {
  const label = month === "日付不明" ? month : month.slice(0, 4) + "年" + Number(month.slice(5, 7)) + "月";
  return "# " + persona + " " + label + "\n\n" + entries.map(entry =>
    "## " + entry.date + "｜" + (entry.kind === "closing" ? "締めログ" : "今日の記録") +
    (entry.model ? "\n\nモデル：" + entry.model : "") + "\n\n" + entry.body
  ).join("\n\n---\n\n") + "\n";
}
function dlPlainText(entries, persona, month) {
  const label = month === "日付不明" ? month : month.slice(0, 4) + "年" + Number(month.slice(5, 7)) + "月";
  return persona + " " + label + "\n\n" + entries.map(entry =>
    entry.date + "｜" + (entry.kind === "closing" ? "締めログ" : "今日の記録") + "\n" + entry.body
  ).join("\n\n---\n\n");
}
function dlMonthBase(persona, month) {
  return safeName(persona) + "_" + safeName(month);
}
function dlExportMonth(persona, month, entries, format) {
  const base = dlMonthBase(persona, month);
  if (format === "json") download(base + ".json", JSON.stringify(dlPayload(entries, persona, month), null, 2), "application/json");
  else download(base + ".md", dlMarkdown(entries, persona, month), "text/markdown");
}
function dlExportPersonaZip(persona, months) {
  const files = [];
  Array.from(months.entries()).forEach(([month, entries]) => {
    const base = dlMonthBase(persona, month);
    files.push({ name: base + ".json", text: JSON.stringify(dlPayload(entries, persona, month), null, 2) });
    files.push({ name: base + ".md", text: dlMarkdown(entries, persona, month) });
    files.push({ name: base + ".txt", text: dlPlainText(entries, persona, month) });
  });
  download(safeName(persona) + "_日記.zip", makeZip(files), "application/zip");
}
function dlGroupedRows(rows) {
  const personas = new Map();
  rows.forEach(entry => {
    const persona = entry.persona || "ペルソナ未設定";
    const month = /^\d{4}-\d{2}/.test(entry.date || "") ? entry.date.slice(0, 7) : "日付不明";
    if (!personas.has(persona)) personas.set(persona, new Map());
    const months = personas.get(persona);
    if (!months.has(month)) months.set(month, []);
    months.get(month).push(entry);
  });
  return Array.from(personas.entries()).map(([persona, months]) => {
    const count = Array.from(months.values()).reduce((sum, entries) => sum + entries.length, 0);
    const monthHtml = Array.from(months.entries()).map(([month, entries], monthIndex) => {
      const label = month === "日付不明" ? month : month.slice(0, 4) + "年" + Number(month.slice(5, 7)) + "月";
      const key = persona + "::" + month;
      return '<details class="dl-month" ' + (monthIndex === 0 ? "open" : "") + '><summary class="dl-month-summary"><strong>' + esc(label) + '</strong><span class="dl-group-count">' + entries.length + '件　⌄</span></summary><div class="dl-month-export"><div class="dl-export-actions"><button data-dlx-json="' + esc(key) + '">JSON</button><button data-dlx-md="' + esc(key) + '">Markdown</button><button class="dl-export-primary" data-dlx-copy="' + esc(key) + '">テキストコピー</button></div></div><div class="dl-month-list">' + entries.map(dlCard).join("") + '</div></details>';
    }).join("");
    return '<details class="dl-persona" open><summary class="dl-persona-summary"><strong>🎭 ' + esc(persona) + '</strong><span class="dl-group-count">' + count + '件　⌄</span></summary><div class="dl-persona-export"><div class="dl-export-actions"><button class="dl-export-primary" data-dlx-zip="' + esc(persona) + '">このペルソナをZIP出力</button></div></div><div class="dl-months">' + monthHtml + '</div></details>';
  }).join("");
}
function dlRender() {
  const rows = dlList().slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const candidates = dlCandidates.length ? '<section class="dl-candidates"><h3>抽出候補 ' + dlCandidates.length + '件</h3>' + dlCandidates.map(c => '<div class="dl-candidate"><strong>' + esc(c.date || "日付不明") + ' · ' + (c.kind === "closing" ? "締めログ" : "今日の記録") + '</strong>' + (c.warning ? '<p class="dl-warning">⚠ ' + esc(c.warning) + '</p>' : '') + '<p>' + esc(c.body.slice(0, 160)) + '</p><button data-dlc="' + esc(c.id) + '">確認・登録</button></div>').join("") + "</section>" : "";
  $("viewer").innerHTML = '<section class="archive-browser"><nav class="breadcrumbs"><button id="dlBack">フォルダ一覧</button><span>›</span><strong>登録済みの日記</strong></nav><div class="browser-heading"><div><p class="browser-kicker">DIARY LOGS</p><h2>登録済みの日記</h2><p class="muted">ペルソナごと・月ごとに分けて表示します。</p></div><span class="count-badge">' + rows.length + ' 件</span></div><div class="dl-tools"><button id="dlScan">ログから候補を抽出</button><button id="dlManual">手動登録</button></div>' + candidates + '<div class="dl-personas">' + (rows.length ? dlGroupedRows(rows) : "<p>まだ登録されていません。</p>") + "</div></section>";
  $("dlBack").onclick = showFolders;
  $("dlScan").onclick = dlScan;
  $("dlManual").onclick = () => dlEditor();
  document.querySelectorAll("[data-dlc]").forEach(b => b.onclick = () => dlEditor(null, dlCandidates.find(x => x.id === b.dataset.dlc)));
  document.querySelectorAll("[data-dlj]").forEach(b => b.onclick = () => dlJump(dlList().find(x => x.id === b.dataset.dlj)));
  document.querySelectorAll("[data-dle]").forEach(b => b.onclick = () => dlEditor(dlList().find(x => x.id === b.dataset.dle)));
  const grouped = new Map();
  rows.forEach(entry => {
    const persona = entry.persona || "ペルソナ未設定";
    const month = /^\d{4}-\d{2}/.test(entry.date || "") ? entry.date.slice(0, 7) : "日付不明";
    if (!grouped.has(persona)) grouped.set(persona, new Map());
    if (!grouped.get(persona).has(month)) grouped.get(persona).set(month, []);
    grouped.get(persona).get(month).push(entry);
  });
  const monthRows = key => {
    const split = key.lastIndexOf("::");
    const persona = key.slice(0, split), month = key.slice(split + 2);
    return { persona, month, entries: grouped.get(persona).get(month) };
  };
  document.querySelectorAll("[data-dlx-json]").forEach(b => b.onclick = () => { const x = monthRows(b.dataset.dlxJson); dlExportMonth(x.persona, x.month, x.entries, "json"); });
  document.querySelectorAll("[data-dlx-md]").forEach(b => b.onclick = () => { const x = monthRows(b.dataset.dlxMd); dlExportMonth(x.persona, x.month, x.entries, "md"); });
  document.querySelectorAll("[data-dlx-copy]").forEach(b => b.onclick = async () => {
    const x = monthRows(b.dataset.dlxCopy);
    await copyToClipboard(dlPlainText(x.entries, x.persona, x.month));
    const old = b.textContent;
    b.textContent = "コピーしました";
    b.classList.add("dl-copy-done");
    setTimeout(() => { if (b.isConnected) { b.textContent = old; b.classList.remove("dl-copy-done"); } }, 1400);
  });
  document.querySelectorAll("[data-dlx-zip]").forEach(b => b.onclick = () => dlExportPersonaZip(b.dataset.dlxZip, grouped.get(b.dataset.dlxZip)));
  document.querySelectorAll("[data-dld]").forEach(b => b.onclick = async () => {
    const entry = dlList().find(x => x.id === b.dataset.dld);
    if (!entry || !confirm(entry.date + " の日記を削除しますか？")) return;
    settings.diaryEntries = dlList().filter(x => x.id !== entry.id);
    await save();
    dlRender();
  });
}
function showDiaries() { viewMode = "diaries"; selected = ""; renderList(); renderViewer(); }
const dlHeaderButton = document.createElement("button");
dlHeaderButton.id = "headerDiaries";
dlHeaderButton.type = "button";
dlHeaderButton.textContent = "☾ 日記";
document.querySelector(".header-actions")?.prepend(dlHeaderButton);
dlHeaderButton.onclick = showDiaries;
document.querySelector(".app-version").textContent = "v52";
const dlBaseViewer = renderViewer;
renderViewer = function(options) { return viewMode === "diaries" ? dlRender() : dlBaseViewer(options); };
const dlBaseFolders = renderFolderBrowser;
renderFolderBrowser = function() {
  dlBaseFolders();
  const anchor = document.querySelector("#openNotes");
  if (!anchor) return;
  anchor.insertAdjacentHTML("afterend", '<button id="openDiaries" class="memory-card"><span><strong>☾ 登録済みの日記</strong><small>ペルソナ別・月別に日記を読む、抽出する、修正する</small></span><span class="memory-mark">' + dlList().length + '件 ›</span></button>');
  $("openDiaries").onclick = showDiaries;
};
const dlBasePanel = renderSessionPanel;
renderSessionPanel = function() {
  dlBasePanel();
  const anchor = $("panelAppendMemory");
  if (!anchor) return;
  anchor.insertAdjacentHTML("afterend", '<button id="panelSaveDiary" class="session-panel-action wide" ' + (messageSelected.size ? "" : "disabled") + '>選択中の' + messageSelected.size + '件を日記として登録</button>');
  $("panelSaveDiary").onclick = () => { const candidate = dlSelected(); if (candidate) { closeSessionPanel(); dlEditor(null, candidate); } };
};
