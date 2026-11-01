import {restoredImageLinks} from './notion-image-restore.mjs';
import {imageReference} from './notion-image-link.mjs';
const LIBRARY = 'https://seishi-mcp-auth.koyamadakun.workers.dev';
const images = new Map(), failures = new Map(), requests = new Set();
const node = (tag,text) => {const out=document.createElement(tag);if(text!==undefined)out.textContent=text;return out;};
const keyOf = (session,link) => session.id+':'+link.id+':'+(link.image?.key||'');
const validBlob = blob => blob instanceof Blob && blob.type.startsWith('image/') && blob.size <= 25*1024*1024;
const style = node('style');
style.textContent='.inline-notion-images{display:grid;gap:10px;margin-top:14px}.inline-notion-image{margin:0;padding:10px;border:1px solid var(--line);border-radius:12px;overflow:hidden}.inline-notion-image img{display:block;width:auto;max-width:100%;max-height:560px;object-fit:contain;margin:auto;cursor:zoom-in}.inline-notion-image figcaption{font-size:12px;overflow-wrap:anywhere;color:var(--muted);margin-top:8px}.inline-notion-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.inline-notion-actions button,.inline-image-add,.inline-image-load{font:inherit;font-size:12px;padding:7px 10px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink)}.inline-image-notice{font-size:13px;color:var(--muted);overflow-wrap:anywhere}.inline-image-full{max-width:96vw;max-height:94vh}.inline-image-full img{display:block;max-width:88vw;max-height:78vh;object-fit:contain}.inline-image-full button{margin-bottom:8px}';
document.head.append(style);
function notice(text) {
  let out=document.querySelector('#inline-image-notice');
  if(!out){out=node('p');out.id='inline-image-notice';out.className='inline-image-notice';out.setAttribute('role','status');document.querySelector('#viewer .conversation .title-row')?.after(out);}
  out.textContent=text;
}
function release(key) {const old=images.get(key);if(old)URL.revokeObjectURL(old);images.delete(key);}
function setImage(key,blob) {release(key);images.set(key,URL.createObjectURL(blob));failures.delete(key);}
function openFull(url,name) {
  const dialog=node('dialog');dialog.className='inline-image-full';const close=node('button','閉じる');close.onclick=()=>dialog.close();const image=node('img');image.src=url;image.alt=name;dialog.append(close,image);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();
}
function sessionImageLinks(session) {
  const manual=Array.isArray(session.notionImages)?session.notionImages:[], pages=new Set(manual.map(link=>link.image?.pageId?.replaceAll('-','')));
  const plan=restoredImageLinks(session);
  return {links:[...manual.map(link=>({...link,position:{kind:'message',id:link.messageId}})),...plan.links.filter(link=>!pages.has(link.image.pageId.replaceAll('-','')))],held:plan.held};
}
function launch(session, messageId, mode, entries = []) {
  const nonce=crypto.randomUUID(), target=new URL(LIBRARY+'/library/');
  target.search=new URLSearchParams({imageBridge:mode,from:location.origin,handoff:nonce,persona:effectivePersona(session)});
  const popup=window.open(target.href,'seishi-inline-'+nonce,'popup,width=1080,height=820');
  if(!popup){notice('画像選択画面を開けなかった。ブラウザのポップアップを許可して、もう一度押してほしい。');return;}
  const request={popup,nonce,session,entries,mode};requests.add(request);
  const current = () => all.includes(session) && !session.trashedAt && session.messages.some(m=>m.id===messageId&&!m.hidden);
  let closed=false, queue=Promise.resolve();
  const cleanup=()=>{if(closed)return;closed=true;window.removeEventListener('message',receive);clearInterval(watch);requests.delete(request);};
  const receive=event=>{
    if(closed||event.origin!==LIBRARY||event.source!==popup||event.data?.nonce!==nonce)return;
    const data=event.data;
    if(data.type==='seishi-image-ready'){
      if(mode==='resolve')popup.postMessage({type:'seishi-image-request',nonce,entries:entries.map(({id,image})=>({id,image}))},LIBRARY);
      return;
    }
    if(data.type==='seishi-image-selected'&&mode==='pick'){
      queue=queue.then(async()=>{
        if(!current())return;
        let image;try{image=imageReference(data.image);}catch{return;}
        if(!validBlob(data.blob))return;
        const previous=session.notionImages;
        const list=Array.isArray(previous)?previous.slice():[];
        let link=list.find(link=>link.messageId===messageId&&link.image?.key===image.key);
        if(!link){link={id:crypto.randomUUID(),messageId,image,updatedAt:Date.now()};list.push(link);}else{link={...link,image,updatedAt:Date.now()};list[list.findIndex(row=>row.id===link.id)]=link;}
        session.notionImages=list;
        try{await dbSet(STORE,all);}catch{session.notionImages=previous;notice('画像の紐付けを保存できなかった。もう一度選んでほしい。');return;}
        if(!current())return;
        setImage(keyOf(session,link),data.blob);
        if(selected===session.id){renderViewer();notice('画像を発言の下に保存した。別端末へ引き継ぐにはクラウド同期してほしい。');}
      }).catch(()=>notice('画像を追加できなかった。もう一度選んでほしい。'));
    }
    if(data.type==='seishi-image-loaded'&&mode==='resolve'){
      const link=entries.find(link=>link.id===data.id);
      if(!link||!all.includes(session)||session.trashedAt||!sessionImageLinks(session).links.some(row=>row.id===link.id&&row.image.key===link.image.key)||!validBlob(data.blob))return;
      setImage(keyOf(session,link),data.blob);if(selected===session.id)renderViewer();
    }
    if(data.type==='seishi-image-error'&&mode==='resolve'){
      const link=entries.find(link=>link.id===data.id);if(link){failures.set(keyOf(session,link),'取得できないか、保存時の原本と一致しないため保留。Notionで確認してほしい。');if(selected===session.id)renderViewer();}
    }
    if(data.type==='seishi-image-done'&&mode==='resolve'){cleanup();popup.close();if(selected===session.id){const failed=entries.filter(link=>failures.has(keyOf(session,link))).length;notice(failed ? '画像の読み込みが終わった。'+failed+'件は取得・原本照合に失敗したため保留。各画像の「再試行」かNotionで確認できる。' : '画像の読み込みが終わった。');}}
  };
  window.addEventListener('message',receive);
  const watch=setInterval(()=>{if(popup.closed)cleanup();},1000);
  setTimeout(cleanup,30*60*1000);
  notice(mode==='pick'?'開いた画像一覧で「この画像を会話に追加」を押してほしい。':'保存済みのNotion画像を読み込み中…');
}
const baseMerge=merge;
merge=function(incoming){const saved=new Map(all.map(s=>[s.id,{images:s.notionImages,dismissals:s.notionImageDismissals}]));baseMerge(incoming);for(const session of all)if(saved.has(session.id)){const old=saved.get(session.id);if(old.images)session.notionImages=old.images;if(old.dismissals)session.notionImageDismissals=old.dismissals;}};
const baseViewer=renderViewer;
renderViewer=function(options){
  const result=baseViewer(options),session=all.find(s=>s.id===selected),conversation=document.querySelector('#viewer .conversation');
  if(!session||!conversation){for(const key of images.keys())release(key);return result;}
  const plan=sessionImageLinks(session),filtered=Boolean(sessionMessageQuery.trim()||sessionModelFilter||activeNamedSelection);
  const visible=plan.links.filter(link=>{
    const target=session.messages.find(m=>m.id===link.position?.id);
    return target&&!target.hidden&&document.getElementById('msg-'+target.id)&&(!filtered||link.position.kind==='message');
  }).sort((a,b)=>a.position.kind===b.position.kind&&a.position.id===b.position.id?(a.position.index??Infinity)-(b.position.index??Infinity):0);
  const active=new Set(visible.map(link=>keyOf(session,link)));for(const key of images.keys())if(!active.has(key))release(key);
  const unloaded=visible.filter(link=>!images.has(keyOf(session,link))&&!failures.has(keyOf(session,link)));
  if(unloaded.length){const load=node('button','この会話の画像をまとめて表示（'+unloaded.length+'枚）');load.type='button';load.className='inline-image-load';load.onclick=()=>launch(session,unloaded[0].position.id,'resolve',unloaded.slice(0,100));conversation.querySelector('.title-row').after(load);}
  if(session.notionImageDismissals?.length){const undo=node('button','非表示にした復元画像を戻す（'+session.notionImageDismissals.length+'件）');undo.type='button';undo.className='inline-image-load';undo.onclick=async()=>{const previous=session.notionImageDismissals;session.notionImageDismissals=[];try{await dbSet(STORE,all);renderViewer();}catch{session.notionImageDismissals=previous;notice('表示設定を保存できなかった。');}};conversation.querySelector('.title-row').after(undo);}
  if(plan.held.length){const held=node('details');held.className='inline-image-notice';held.append(node('summary','自動復元を保留：'+plan.held.length+'件'));for(const item of plan.held)held.append(node('p',item.fileName+'：'+item.reason));conversation.querySelector('.title-row').after(held);}
  for(const message of session.messages){
    const element=document.getElementById('msg-'+message.id);if(!element||message.hidden)continue;
    const add=node('button','＋ Notion画像');add.type='button';add.className='inline-image-add';add.onclick=()=>launch(session,message.id,'pick');element.querySelector('.message-head > span:last-child')?.append(add);
  }
  const containers=new Map(), orderedGroups=new Map();
  for(const link of visible){const slot=link.position.kind+':'+link.position.id;if(!orderedGroups.has(slot))orderedGroups.set(slot,[]);orderedGroups.get(slot).push(link);}
  const orderedVisible=[...orderedGroups.values()].flatMap(group=>group.sort((a,b)=>(a.position.index??Infinity)-(b.position.index??Infinity)));
  for(const link of orderedVisible){
    let image;try{image=imageReference(link.image);}catch{continue;}
    const key=keyOf(session,link),figure=node('figure');figure.className='inline-notion-image';figure.dataset.binding=link.id;
    const url=images.get(key);
    if(url){const img=node('img');img.src=url;img.alt=image.fileName;img.decoding='async';img.onclick=()=>openFull(url,image.fileName);figure.append(img);}
    else figure.append(node('p',failures.get(key)||'「この会話の画像をまとめて表示」で読み込める。'));
    const caption=node('figcaption',image.pageTitle+' ／ '+image.fileName),actions=node('div');actions.className='inline-notion-actions';
    const original=node('a','Notionで開く ↗');original.href=image.pageUrl;original.target='_blank';original.rel='noopener noreferrer';actions.append(original);
    if(failures.has(key)){const retry=node('button','再試行');retry.type='button';retry.onclick=()=>{failures.delete(key);launch(session,link.position.id,'resolve',[link]);};actions.append(retry);}
    const remove=node('button',link.automatic?'この画像を非表示':'紐付けを解除');remove.type='button';remove.onclick=async()=>{
      const before=session.notionImages,excluded=session.notionImageDismissals;
      if(link.automatic)session.notionImageDismissals=[...new Set([...(excluded||[]),link.id])];else session.notionImages=before.filter(row=>row.id!==link.id);
      try{await dbSet(STORE,all);release(key);renderViewer();notice('画像の表示を解除した。Notionの画像と元の対応表はそのまま残っている。');}catch{session.notionImages=before;session.notionImageDismissals=excluded;notice('解除を保存できなかった。');}
    };actions.append(remove);figure.append(caption,actions);
    const slot=link.position.kind+':'+link.position.id;
    if(!containers.has(slot)){
      const container=node('div');container.className='inline-notion-images';container.dataset.position=slot;
      const anchor=document.getElementById('msg-'+link.position.id);
      if(link.position.kind==='message')anchor.append(container);
      else {container.append(node('small','元ログから復元した画像'));if(link.position.kind==='before')anchor.before(container);else anchor.after(container);}
      containers.set(slot,container);
    }
    if(!url){const loadHere=node('button',failures.has(key)?'ここの画像を再試行':'ここの画像を表示');loadHere.type='button';loadHere.className='inline-image-load';loadHere.onclick=()=>{failures.delete(key);launch(session,link.position.id,'resolve',[link]);};figure.prepend(loadHere);}
    containers.get(slot).append(figure);
    // Replace the older page-link-only card, while retaining file links and metadata.
    for(const old of conversation.querySelectorAll('.external-asset-link')){
      try{if(new URL(old.href).pathname.replaceAll('-','').includes(image.pageId.replaceAll('-',''))){const parent=old.parentElement;old.remove();if(!parent.children.length)parent.remove();}}catch{}
    }
  }
  return result;
};
window.addEventListener('pagehide',()=>{for(const key of images.keys())release(key);});
if(typeof navigationReady!=='undefined'&&navigationReady&&selected)renderViewer();
