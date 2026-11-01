import {imageReference} from './notion-image-link.mjs';
const LIBRARY = 'https://seishi-mcp-auth.koyamadakun.workers.dev';
const images = new Map(), failures = new Map(), requests = new Set();
const node = (tag,text) => {const out=document.createElement(tag);if(text!==undefined)out.textContent=text;return out;};
const keyOf = (session,link) => session.id+':'+link.id;
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
      if(!link||!all.includes(session)||session.trashedAt||!session.notionImages?.some(row=>row.id===link.id)||!validBlob(data.blob))return;
      setImage(keyOf(session,link),data.blob);if(selected===session.id)renderViewer();
    }
    if(data.type==='seishi-image-error'&&mode==='resolve'){
      const link=entries.find(link=>link.id===data.id);if(link){failures.set(keyOf(session,link),'画像を取得できなかった。削除・移動や接続状態をNotionで確認してほしい。');if(selected===session.id)renderViewer();}
    }
    if(data.type==='seishi-image-done'&&mode==='resolve'){cleanup();popup.close();if(selected===session.id)notice('画像の読み込みが終わった。');}
  };
  window.addEventListener('message',receive);
  const watch=setInterval(()=>{if(popup.closed)cleanup();},1000);
  setTimeout(cleanup,30*60*1000);
  notice(mode==='pick'?'開いた画像一覧で「この画像を会話に追加」を押してほしい。':'保存済みのNotion画像を読み込み中…');
}
const baseMerge=merge;
merge=function(incoming){const saved=new Map(all.filter(s=>s.notionImages?.length).map(s=>[s.id,s.notionImages]));baseMerge(incoming);for(const session of all)if(saved.has(session.id))session.notionImages=saved.get(session.id);};
const baseViewer=renderViewer;
renderViewer=function(options){
  const result=baseViewer(options),session=all.find(s=>s.id===selected),conversation=document.querySelector('#viewer .conversation');
  if(!session||!conversation){for(const key of images.keys())release(key);return result;}
  const links=Array.isArray(session.notionImages)?session.notionImages:[];
  const visible=links.filter(link=>session.messages.some(m=>m.id===link.messageId&&!m.hidden)&&document.getElementById('msg-'+link.messageId));
  const active=new Set(visible.map(link=>keyOf(session,link)));for(const key of images.keys())if(!active.has(key))release(key);
  const unloaded=visible.filter(link=>!images.has(keyOf(session,link)));
  if(unloaded.length){const load=node('button','Notion画像を表示（'+unloaded.length+'枚）');load.type='button';load.className='inline-image-load';load.onclick=()=>launch(session,unloaded[0].messageId,'resolve',unloaded.slice(0,100));conversation.querySelector('.title-row').after(load);}
  for(const message of session.messages){
    const element=document.getElementById('msg-'+message.id);if(!element||message.hidden)continue;
    const add=node('button','＋ Notion画像');add.type='button';add.className='inline-image-add';add.onclick=()=>launch(session,message.id,'pick');element.querySelector('.message-head > span:last-child')?.append(add);
    const own=visible.filter(link=>link.messageId===message.id);if(!own.length)continue;
    const container=node('div');container.className='inline-notion-images';
    for(const link of own){
      let image;try{image=imageReference(link.image);}catch{continue;}
      const key=keyOf(session,link),figure=node('figure');figure.className='inline-notion-image';
      const url=images.get(key);
      if(url){const img=node('img');img.src=url;img.alt=image.fileName;img.decoding='async';img.onclick=()=>openFull(url,image.fileName);figure.append(img);}
      else figure.append(node('p',failures.get(key)||'「Notion画像を表示」で読み込める。'));
      const caption=node('figcaption',image.pageTitle+' ／ '+image.fileName),actions=node('div');actions.className='inline-notion-actions';
      const original=node('a','Notionで開く ↗');original.href=image.pageUrl;original.target='_blank';original.rel='noopener noreferrer';
      const remove=node('button','紐付けを解除');remove.type='button';remove.onclick=async()=>{
        const before=session.notionImages;session.notionImages=before.filter(row=>row.id!==link.id);
        try{await dbSet(STORE,all);release(key);renderViewer();notice('画像の紐付けを解除した。Notionの画像はそのまま残っている。');}catch{session.notionImages=before;notice('解除を保存できなかった。');}
      };actions.append(original,remove);figure.append(caption,actions);container.append(figure);
    }
    element.append(container);
  }
  return result;
};
window.addEventListener('pagehide',()=>{for(const key of images.keys())release(key);});
// Existing saved navigation may have rendered before this module finished loading.
if(typeof navigationReady!=='undefined'&&navigationReady&&selected)renderViewer();
