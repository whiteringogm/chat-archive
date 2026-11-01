import {imageReference} from './notion-image-link.mjs';
const UUID=/^[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}$/i;
function chronologicalIds(session) {
  const ids=session.canonicalMessageIds||[],positions=new Map((session.messages||[]).map((m,i)=>[m.id,i]));
  const retained=ids.filter(id=>positions.has(id));
  let ascending=false,descending=false;
  for(let i=1;i<retained.length;i++){const delta=positions.get(retained[i])-positions.get(retained[i-1]);if(delta>0)ascending=true;if(delta<0)descending=true;}
  if(ascending&&descending)return null;
  // canonicalIds() writes legacy arrays newest-first; use that contract when fewer than two retained messages remain.
  if(!ascending&&!descending)return ids.slice().reverse();
  return descending?ids.slice().reverse():ids;
}
export function restoredImageLinks(session) {
  const links=[],held=[],messages=new Map((session.messages||[]).map(m=>[m.id,m])),membership=session.canonicalMessageIds||[],order=chronologicalIds(session),seen=new Set();
  for(const asset of session.externalAssets||[]) {
    if(asset.kind!=='image')continue;
    const hold=reason=>held.push({fileName:asset.fileName||'画像',reason});
    if(asset.sourceRole!=='assistant'||asset.canonical!==true){hold('確認情報なし');continue;}
    if(asset.sessionId&&asset.sessionId!==session.id){hold('会話ID不一致');continue;}
    if(!UUID.test(asset.messageId||'')){hold('発言ID不明');continue;}
    if(Array.isArray(session.canonicalMessageIds)&&!membership.includes(asset.messageId)&&Number(session.updateTime)*1000>=Date.parse(asset.verifiedAt)){hold('現在の正史から除外');continue;}
    let pageId;
    try{const url=new URL(asset.notionUrl);if(url.protocol!=='https:'||!['app.notion.com','www.notion.so','notion.so'].includes(url.hostname)||url.username||url.password||url.port)throw Error();pageId=url.pathname.replaceAll('-','').match(/[a-f0-9]{32}/i)?.[0];if(!pageId)throw Error();}catch{hold('Notion参照先不明');continue;}
    if(!/^[a-f0-9]{64}$/i.test(asset.sha256||'')){hold('原本の照合情報なし');continue;}
    const id='auto-'+pageId+'-'+asset.messageId;
    if(seen.has(id)||(session.notionImageDismissals||[]).includes(id))continue;seen.add(id);
    let position;
    const original=messages.get(asset.messageId);
    if(original){if(original.role!=='assistant'||original.hidden){hold('元の発言が非表示またはAI出力ではない');continue;}position={kind:'message',id:original.id};}
    else if(order?.includes(asset.messageId)){
      const index=order.indexOf(asset.messageId),previous=order.slice(0,index).reverse().find(id=>messages.has(id)),next=order.slice(index+1).find(id=>messages.has(id));
      if((previous&&messages.get(previous).hidden)||(next&&messages.get(next).hidden)){hold('前後の発言が非表示');continue;}
      if(previous)position={kind:'after',id:previous,index};else if(next)position={kind:'before',id:next,index};
    }else{
      const anchor=messages.get(asset.anchorAfterMessageId);
      if(anchor?.role==='user'&&!anchor.hidden)position={kind:'after',id:anchor.id};
    }
    if(!position){hold('位置を特定できない');continue;}
    const image=imageReference({pageId,pageTitle:asset.title||asset.fileName,fileName:asset.fileName,source:{kind:'page',id:pageId,sha256:asset.sha256.toLowerCase()}});
    links.push({id,messageId:asset.messageId,image,position,automatic:true});
  }
  return {links,held};
}
