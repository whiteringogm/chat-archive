const UUID = /^[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}$/i;
const text = (value, max) => typeof value === 'string' && value.length <= max ? value : '';
export function imageReference(value) {
  if (!value || !UUID.test(value.pageId || '')) throw new Error('画像のページIDを確認できない。');
  const raw = value.source;
  let source;
  if (raw?.kind === 'block' && UUID.test(raw.id || '')) source = {kind:'block', id:raw.id};
  else if (raw?.kind === 'property' && raw.pageId === value.pageId && text(raw.propertyId,200) && typeof raw.name === 'string' && raw.name.length <= 1000 && Number.isInteger(raw.occurrence) && raw.occurrence >= 0 && raw.occurrence < 10000)
    source = {kind:'property',pageId:raw.pageId,propertyId:raw.propertyId,name:raw.name,occurrence:raw.occurrence};
  else throw new Error('画像の参照先を確認できない。');
  return {key:source.kind === 'block' ? 'block:'+source.id : 'property:'+JSON.stringify(source),pageId:value.pageId,pageUrl:'https://app.notion.com/p/'+value.pageId.replaceAll('-',''),pageTitle:text(value.pageTitle,1000)||'Notion画像',fileName:text(value.fileName,1000)||'画像',source};
}
export function bridgeContext(value) {
  const url = new URL(value), from = url.searchParams.get('from'), nonce = url.searchParams.get('handoff'), mode = url.searchParams.get('imageBridge');
  let source;
  try { source = new URL(from); } catch { return null; }
  if (source.origin !== from || !(from === 'https://whiteringogm.github.io' || source.protocol === 'http:' && ['127.0.0.1','localhost'].includes(source.hostname)) || !/^[\w-]{36}$/.test(nonce || '') || !['pick','resolve'].includes(mode)) return null;
  return {from,nonce,mode};
}
