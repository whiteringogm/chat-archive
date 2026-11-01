const test = require('node:test');
const assert = require('node:assert/strict');
const api = require('./asset-links.js');
const url = 'https://app.notion.com/p/11111111111111111111111111111111';
const asset = { sessionId:'s', messageId:'a', fileName:'image.png', notionUrl:url,
  sourceRef:'sandbox:/mnt/data/image.png', sourceRole:'assistant', canonical:true,
  kind:'image', verifiedAt:'2026-10-03T12:00:00Z' };
const manifest = (assets) => ({format:api.FORMAT,version:1,assets});

test('missing generated messages can retain a verified position across import and backup', () => {
  const session={id:'s',messages:[{id:'u',role:'user',text:'generate'}, {id:'u2',role:'user',text:'nice'}],notes:[{id:'n',afterMessageId:'u',text:'keep memo'}]};
  const positioned=api.readManifest(manifest([{...asset,anchorAfterMessageId:'u'}]));
  const plan=api.prepareImport([session],positioned);
  assert.equal(plan.created,0);
  assert.equal(plan.sessions[0].externalAssets[0].anchorAfterMessageId,'u');
  assert.deepEqual(plan.sessions[0].messages,session.messages);
  assert.deepEqual(plan.sessions[0].notes,session.notes);
  assert.equal(JSON.parse(JSON.stringify(plan.sessions))[0].externalAssets[0].anchorAfterMessageId,'u');
  assert.equal(api.visibleAssets(plan.sessions[0]).length,1);
});

test('unknown or assistant anchors cannot silently attach an image to the wrong position', () => {
  const session={id:'s',messages:[{id:'a2',role:'assistant',text:'hello'}]};
  for(const anchorAfterMessageId of ['missing','a2']) {
    const positioned=api.readManifest(manifest([{...asset,anchorAfterMessageId}]));
    assert.throws(()=>api.prepareImport([session],positioned));
    assert.equal(session.externalAssets,undefined);
  }
});
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

test('inline image references strip temporary URLs and reject foreign bridge origins', async () => {
  const {imageReference,bridgeContext}=await import('./notion-image-link.mjs');
  const value={pageId:'11111111111111111111111111111111',pageTitle:'<script>test</script>',fileName:'a.png',source:{kind:'block',id:'22222222222222222222222222222222'},url:'https://secret.example/signed',token:'secret'};
  const result=imageReference(value);assert.equal(result.url,undefined);assert.equal(result.token,undefined);
  assert.equal(result.pageUrl,'https://app.notion.com/p/'+value.pageId);
  assert.throws(()=>imageReference({...value,source:{kind:'block',id:'../../users/me'}}));
  const query=new URLSearchParams({imageBridge:'pick',from:'https://whiteringogm.github.io',handoff:'12345678-1234-1234-1234-123456789012'});
  assert.equal(bridgeContext('https://worker.test/library/?'+query).mode,'pick');
  query.set('from','https://evil.test');assert.equal(bridgeContext('https://worker.test/library/?'+query),null);
});

test('automatic image placement uses verified messages, anchors and canonical order, holding uncertain or revoked records',async()=>{
 const {restoredImageLinks}=await import('./notion-image-restore.mjs');
 const aid='aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',bid='bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',cid='cccccccc-cccc-cccc-cccc-cccccccccccc';
 const asset=(messageId,page)=>({sessionId:'s',messageId,kind:'image',fileName:'test.png',notionUrl:'https://app.notion.com/p/'+page.repeat(32),sha256:'a'.repeat(64),canonical:true,sourceRole:'assistant',verifiedAt:'2026-01-01T00:00:00Z'});
 const session={id:'s',messages:[{id:'u',role:'user'},{id:aid,role:'assistant'},{id:'last',role:'user'}],canonicalMessageIds:['u',aid,cid,'last'],externalAssets:[asset(aid,'1'),{...asset(bid,'2'),anchorAfterMessageId:'u'},asset(cid,'3'),{...asset(cid,'4'),canonical:undefined}]};
 const result=restoredImageLinks(session);assert.equal(result.links.length,3);assert.equal(result.held.length,1);
 assert.deepEqual(result.links.map(link=>link.position.kind),['message','after','after']);assert.equal(result.links[2].position.id,aid);
 assert.equal(result.links[0].image.source.kind,'page');assert.equal(result.links[0].image.source.sha256,'a'.repeat(64));
 assert.equal(restoredImageLinks({...session,updateTime:Date.parse('2026-02-01')/1000}).links.length,2);
 assert.equal(restoredImageLinks({...session,messages:session.messages.map(m=>({...m,hidden:true}))}).links.length,0);
 assert.equal(restoredImageLinks({...session,notionImageDismissals:[result.links[0].id]}).links.length,2);
 assert.equal(restoredImageLinks({...session,externalAssets:[{...asset(aid,'1'),sha256:'invalid'}]}).links.length,0);
 assert.equal(restoredImageLinks({...session,externalAssets:[asset(aid,'1'),asset(aid,'1')]}).links.length,1);
 assert.equal(restoredImageLinks({...session,externalAssets:[{...asset(aid,'1'),notionUrl:'https://evil.test/'+ '1'.repeat(32)}]}).links.length,0);
});
