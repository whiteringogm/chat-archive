import {splitBackup,joinBackup,summary,entityInfo,encode,digest,zip,unpack} from './sync-core.mjs';
const CLOUD='https://seishi-mcp-auth.koyamadakun.workers.dev',BASE='seishi-device-sync-base-v1',ROLLBACK='seishi-sync-rollback-v1';
async function prepare(){const entities=splitBackup(backupPayload()),entries=[];for(const [key,value]of entities){const raw=encode(value);entries.push({key,hash:await digest(raw),rawBytes:raw.length,info:entityInfo(key,value)});}return {entities,entries};}
async function sameSnapshot(entries){const current=await prepare(),map=new Map(current.entries.map(row=>[row.key,row.hash]));return entries.length===map.size&&entries.every(row=>map.get(row.key)===row.hash);}
function openSync(){
 const nonce=crypto.randomUUID(),url=new URL(CLOUD+'/library/sync.html');url.search=new URLSearchParams({from:location.origin,handoff:nonce});
 const popup=window.open(url.href,'_blank');if(!popup)return alert('同期画面を開けなかった。ポップアップを許可して再度押してほしい。');
 let snapshot,base,staged=new Map(),connected=false;
 const reply=(id,value,error)=>popup.postMessage({type:'seishi-sync-response',nonce,id,value,error},CLOUD);
 const receive=async event=>{
  if(event.origin!==CLOUD||event.source!==popup||event.data?.nonce!==nonce||event.data.type!=='seishi-sync-request')return;
  connected=true;const {id,method,value}=event.data;
  try{
   if(method==='manifest'){snapshot=await prepare();try{base=JSON.parse(localStorage.getItem(BASE)||'null');}catch{base=null;}return reply(id,{entries:snapshot.entries,base,summary:summary(backupPayload())});}
   if(!snapshot)throw new Error('同期の比較をやり直してほしい。');
   if(method==='entity'){
    if(!snapshot.entities.has(value.key))throw new Error('端末側のデータが見つからない。');
    const raw=encode(snapshot.entities.get(value.key)),row=snapshot.entries.find(row=>row.key===value.key);
    if(await digest(raw)!==row.hash)throw new Error('同期中に端末のデータが変わった。比較をやり直してほしい。');
    const bytes=await zip(raw);return reply(id,{hash:row.hash,rawBytes:raw.length,bytes});
   }
   if(method==='check'){if(!await sameSnapshot(snapshot.entries))throw new Error('同期中に端末のデータが変わった。比較をやり直してほしい。');return reply(id,{unchanged:true});}
   if(method==='stage'){staged.set(value.key,await unpack(value.bytes,value.hash));return reply(id,{staged:true});}
   if(method==='apply'){
    if(!await sameSnapshot(snapshot.entries))throw new Error('端末の内容が比較後に変わった。クラウドには保存済みなので、もう一度同期してほしい。');
    if(value.manifest.entries.length===snapshot.entries.length&&value.manifest.entries.every(row=>snapshot.entries.some(entry=>entry.key===row.key&&entry.hash===row.hash))){localStorage.setItem(BASE,JSON.stringify({revision:value.manifest.revision,entries:value.manifest.entries.map(({key,hash,info})=>({key,hash,info}))}));return reply(id,{applied:true,summary:summary(backupPayload())});}
    const wanted=new Map();for(const row of value.manifest.entries){const local=snapshot.entries.find(entry=>entry.key===row.key);if(staged.has(row.key))wanted.set(row.key,staged.get(row.key));else if(local?.hash===row.hash)wanted.set(row.key,snapshot.entities.get(row.key));else throw new Error('同期データの一部が不足している。端末内データは変更していない。');}
    const next=joinBackup(wanted),before=await backupBlob();await dbSet(ROLLBACK,{blob:before.blob,extension:before.extension,savedAt:new Date().toISOString()});
    const oldAll=all;await dbSet(STORE,next.sessions);
    try{localStorage.setItem(SETTINGS,JSON.stringify(next.settings));}catch(error){await dbSet(STORE,oldAll);throw error;}
    all=next.sessions;settings=next.settings;ensurePersonaProfiles();rebuildFilters();renderList();showFolders();
    try{localStorage.setItem(BASE,JSON.stringify({revision:value.manifest.revision,entries:value.manifest.entries.map(({key,hash,info})=>({key,hash,info}))}));}catch{alert('内容の同期は完了したが、比較用の情報を保存できなかった。次回は初回同期として確認する。');}
    snapshot=await prepare();staged.clear();reply(id,{applied:true,summary:summary(backupPayload())});return;
   }
   throw new Error('未対応の同期操作。');
  }catch(error){reply(id,null,error.message||'端末の処理に失敗した。');}
 };
 window.addEventListener('message',receive);
 const timer=setInterval(()=>{if(popup.closed){clearInterval(timer);window.removeEventListener('message',receive);snapshot=null;staged.clear();}},3000);
 setTimeout(()=>{if(!connected&&!popup.closed)alert('開いた画面でログインを済ませ、編纂室へ戻って「端末間同期」をもう一度押してほしい。');},60000);
}
function install(){
 const home=document.getElementById('homeBtn');if(home&&!document.getElementById('deviceSync')){const button=document.createElement('button');button.id='deviceSync';button.className='home-button';button.textContent='☁ 端末間同期';button.onclick=openSync;home.after(button);}
 const manager=document.querySelector('.backup-manager');if(manager&&!document.getElementById('syncRollbackExport')){const button=document.createElement('button');button.id='syncRollbackExport';button.type='button';button.textContent='同期前のバックアップを書き出す';button.onclick=async()=>{const before=await dbGet(ROLLBACK);if(!before)return alert('同期前のバックアップはまだない。');download('正史編纂室_同期前バックアップ.'+before.extension,before.blob,before.blob.type);};manager.append(button);}
}
install();new MutationObserver(install).observe(document.body,{childList:true,subtree:true});
