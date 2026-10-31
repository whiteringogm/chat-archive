export const GROUP=128;
export const digest=async bytes=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(byte=>byte.toString(16).padStart(2,'0')).join('');
export const encode=object=>new TextEncoder().encode(JSON.stringify(object,(_key,value)=>value&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.keys(value).sort().map(key=>[key,value[key]])):value));
export const zip=async bytes=>new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
export async function unpack(bytes,hash){const raw=new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());if(await digest(raw)!==hash)throw new Error('同期データの検証に失敗した。端末内データは変更していない。');return JSON.parse(new TextDecoder().decode(raw));}
export function splitBackup(data){
 if(data?.format!=='seishi-archive-backup'||data.version!==1||!Array.isArray(data.sessions)||!data.settings)throw new Error('編纂室のバックアップ形式を確認できない。');
 const result=new Map(),{sessions,settings,createdAt,...header}=data;result.set('header',{metadata:header,sessionOrder:sessions.map(session=>session.id)});result.set('settings',settings);
 for(const session of sessions){const {messages=[],...metadata}=session,id=encodeURIComponent(session.id);result.set('s:'+id,{session:metadata,parts:Math.ceil(messages.length/GROUP),messageCount:messages.length});for(let i=0;i<messages.length;i+=GROUP)result.set('m:'+id+':'+String(i/GROUP).padStart(6,'0'),messages.slice(i,i+GROUP));}
 return result;
}
export function joinBackup(entities){
 const header=entities.get('header'),settings=entities.get('settings');if(!header||!settings)throw new Error('同期データに設定がない。');
 const sessions=[];
 for(const [key,value]of entities){if(!key.startsWith('s:'))continue;const id=key.slice(2),messages=[];for(let part=0;part<value.parts;part++){const rows=entities.get('m:'+id+':'+String(part).padStart(6,'0'));if(!Array.isArray(rows))throw new Error('会話の一部が不足している。同期をやり直してほしい。');messages.push(...rows);}if(messages.length!==value.messageCount)throw new Error('会話の件数を確認できない。同期をやり直してほしい。');sessions.push({...value.session,messages});}
 if(header.sessionOrder){const order=new Map(header.sessionOrder.map((id,index)=>[id,index]));sessions.sort((a,b)=>(order.get(a.id)??Infinity)-(order.get(b.id)??Infinity));}
 return {...(header.metadata||header),settings,sessions,createdAt:new Date().toISOString()};
}
export const summary=data=>({sessions:data.sessions.length,messages:data.sessions.reduce((n,s)=>n+s.messages.length,0),diaries:data.settings.diaryEntries?.length||0,memories:data.sessions.reduce((n,s)=>n+(s.namedSelections?.length||0),0),notes:data.sessions.reduce((n,s)=>n+(s.notes?.length||0),0),links:data.sessions.reduce((n,s)=>n+(s.externalAssets?.length||0),0)});
export function entityInfo(key,value){if(key==='settings')return {diaries:value.diaryEntries?.length||0};if(key.startsWith('s:'))return {sessions:1,messages:value.messageCount,memories:value.session.namedSelections?.length||0,notes:value.session.notes?.length||0,links:value.session.externalAssets?.length||0};return {};}
export function manifestSummary(entries){const out={sessions:0,messages:0,diaries:0,memories:0,notes:0,links:0};for(const row of entries)for(const [key,value]of Object.entries(row.info||{}))if(Object.hasOwn(out,key))out[key]+=value;return out;}
export function equal(a,b){if(a===b)return true;if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;const keys=Object.keys(a);return keys.length===Object.keys(b).length&&keys.every(key=>Object.hasOwn(b,key)&&equal(a[key],b[key]));}
const ABSENT=Symbol('absent');
function itemKey(item){if(item&&typeof item==='object'){if(typeof item.id==='string')return 'id:'+item.id;if(item.messageId&&(item.sourceRef||item.fileName))return 'asset:'+JSON.stringify([item.messageId,item.sourceRef||item.fileName]);}if(['string','number','boolean'].includes(typeof item))return typeof item+':'+item;return null;}
export function mergeThree(base,local,remote,choose={},prefix=''){
 const conflicts=[];
 function merge(b,l,r,path){
  if(equal(l,r))return l;if(equal(l,b))return r;if(equal(r,b))return l;
  if(l!==ABSENT&&r!==ABSENT&&l&&r&&typeof l==='object'&&typeof r==='object'&&Array.isArray(l)===Array.isArray(r)){
   if(Array.isArray(l)){
    const arrays=[b===ABSENT?[]:b,l,r];
    if(arrays.every(Array.isArray)&&arrays.every(array=>array.every(item=>itemKey(item)!==null)&&new Set(array.map(itemKey)).size===array.length)){
     const orders=arrays.map(array=>array.map(itemKey)),sameMembers=orders.every(order=>order.length===orders[0].length&&order.every(key=>orders[0].includes(key)));
     if(b!==ABSENT&&sameMembers&&!equal(orders[1],orders[0])&&!equal(orders[2],orders[0])&&!equal(orders[1],orders[2])){const selection=choose[path];if(selection==='local')return l;if(selection==='remote')return r;conflicts.push({path,local:l,remote:r});return l;}
     const maps=arrays.map(array=>new Map(array.map(item=>[itemKey(item),item]))),out=[];
     for(const key of new Set([...maps[1].keys(),...maps[2].keys(),...maps[0].keys()])){const value=merge(...maps.map(map=>map.has(key)?map.get(key):ABSENT),path+'/'+key);if(value!==ABSENT)out.push(value);}return out;
    }
   }else if(b===ABSENT||b&&typeof b==='object'&&!Array.isArray(b)){
    const out={},bb=b===ABSENT?{}:b;
    for(const key of new Set([...Object.keys(l),...Object.keys(r),...Object.keys(bb)])){const value=merge(...[bb,l,r].map(object=>Object.hasOwn(object,key)?object[key]:ABSENT),path+'/'+key);if(value!==ABSENT)Object.defineProperty(out,key,{value,enumerable:true,writable:true,configurable:true});}return out;
   }
  }
  const selection=choose[path];if(selection==='local')return l;if(selection==='remote')return r;
  conflicts.push({path,local:l===ABSENT?undefined:l,remote:r===ABSENT?undefined:r});return l;
 }
 const value=merge(base===undefined?ABSENT:base,local===undefined?ABSENT:local,remote===undefined?ABSENT:remote,prefix);
 return {value:value===ABSENT?undefined:value,conflicts};
}
