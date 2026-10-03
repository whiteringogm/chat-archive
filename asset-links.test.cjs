const test = require('node:test');
const assert = require('node:assert/strict');
const api = require('./asset-links.js');
const url = 'https://app.notion.com/p/11111111111111111111111111111111';
const asset = { sessionId:'s', messageId:'a', fileName:'image.png', notionUrl:url,
  sourceRef:'sandbox:/mnt/data/image.png', sourceRole:'assistant', canonical:true,
  kind:'image', verifiedAt:'2026-10-03T12:00:00Z' };
const manifest = (assets) => ({format:api.FORMAT,version:1,assets});
test('rejects user attachments, alternative answers, and expiring download URLs', () => {
  for (const override of [{sourceRole:'user'},{canonical:false},
    {notionUrl:'https://prod-files-secure.s3.amazonaws.com/image.png'},
    {notionUrl:'javascript:alert(1)'},{notionUrl:'https://app.notion.com.attacker.test/p/'+url.split('/').pop()},
    {notionUrl:'https://secret@app.notion.com/p/'+url.split('/').pop()}])
    assert.throws(()=>api.readManifest(manifest([{...asset,...override}])));
});
test('import is idempotent and preserves edited text, folders, notes, and hidden flags', () => {
  const session={id:'s',title:'edited',folder:'important',messages:[{id:'a',role:'assistant',text:'edited text',hidden:true}],notes:[{id:'n',text:'memo'}]};
  const first=api.prepareImport([session],api.readManifest(manifest([asset])));
  const second=api.prepareImport(first.sessions,api.readManifest(manifest([asset])));
  assert.equal(second.sessions[0].externalAssets.length,1);
  assert.equal(second.sessions[0].messages[0].text,'edited text');
  assert.equal(second.sessions[0].messages[0].hidden,true);
  assert.deepEqual(second.sessions[0].notes,session.notes);
  assert.equal(second.sessions[0].folder,'important');
  assert.equal(session.externalAssets,undefined);
});
test('a mismatched user message fails without mutating the archive', () => {
  const session={id:'s',messages:[{id:'a',role:'user',text:'upload'}]};
  assert.throws(()=>api.prepareImport([session],api.readManifest(manifest([asset]))));
  assert.equal(session.externalAssets,undefined);
});
test('only the selected regenerated branch is eligible', () => {
  const c={current_node:'new',mapping:{user:{parent:null,message:{id:'u',author:{role:'user'}}},old:{parent:'user',message:{id:'old',author:{role:'assistant'}}},new:{parent:'user',message:{id:'new',author:{role:'assistant'}}}}};
  assert.deepEqual(api.canonicalIds(c),['new','u']);
  const s={messages:[],canonicalMessageIds:['new','u'],updateTime:Date.parse('2026-10-04T00:00:00Z')/1000,externalAssets:[asset,{...asset,messageId:'new'}]};
  assert.deepEqual(api.visibleAssets(s).map(a=>a.messageId),['new']);
});
test('rewrites exact file links for display without embedding the Notion page as an image', () => {
  const text='![preview](sandbox:/mnt/data/image.png) [other](sandbox:/mnt/data/image.png.old)';
  assert.equal(api.replaceReferences(text,[asset]),'[画像: preview]('+url+') [other](sandbox:/mnt/data/image.png.old)');
});
test('new attachment-only sessions survive backup JSON round trips', () => {
  const plan=api.prepareImport([],api.readManifest(manifest([asset])));
  assert.equal(plan.created,1);
  assert.equal(plan.sessions[0].assetOnly,true);
  assert.equal(api.visibleAssets(JSON.parse(JSON.stringify(plan.sessions[0])))[0].notionUrl,url);
});
