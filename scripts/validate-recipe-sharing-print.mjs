// Run after npm run build. Uses local Chrome and the public read-only recipe API.
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import {setTimeout as delay} from 'node:timers/promises';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir=path.join(root,'.recipe-browser-review','sharing-print');
await fs.mkdir(dir,{recursive:true});
const dist=path.join(root,'dist');
const server=http.createServer(async(req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname;const file=pathname.startsWith('/r/')?'app.html':pathname==='/'?'index.html':pathname.slice(1);const data=await fs.readFile(path.join(dist,file));res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.woff2':'font/woff2','.webp':'image/webp','.jpg':'image/jpeg'})[path.extname(file)]||'application/octet-stream');res.end(data)}catch{res.statusCode=404;res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const profile=await fs.mkdtemp(dir+'/chrome-');
const child=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{windowsHide:true,stdio:'ignore'});
let socket;
try {
 let port;for(let i=0;i<100;i++){try{port=Number((await fs.readFile(profile+'/DevToolsActivePort','utf8')).split('\n')[0]);break}catch{await delay(100)}}
 const target=(await(await fetch(`http://127.0.0.1:${port}/json`)).json()).find(x=>x.type==='page');
 socket=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>socket.addEventListener('open',r,{once:true}));
 let id=0;const pending=new Map();let events=[];
 socket.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(Error(JSON.stringify(m.error))):p.resolve(m.result)}else if(m.method.startsWith('Network.'))events.push(m)});
 const cmd=(method,params={})=>new Promise((resolve,reject)=>{pending.set(++id,{resolve,reject});socket.send(JSON.stringify({id,method,params}))});
 const evaluate=async expression=>{const result=await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw Error(result.exceptionDetails.text);return result.result.value};
 await cmd('Page.enable');await cmd('Network.enable');await cmd('Network.setCacheDisabled',{cacheDisabled:true});
 await cmd('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await cmd('Page.addScriptToEvaluateOnNewDocument',{source:`window.audit={lcp:[],long:[]};new PerformanceObserver(l=>l.getEntries().forEach(e=>audit.lcp.push({time:e.startTime,loadTime:e.loadTime,renderTime:e.renderTime,url:e.url,element:e.element?.className,size:e.size}))).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>audit.long.push({start:e.startTime,duration:e.duration}))).observe({type:'longtask',buffered:true});`});



 const fixtureBase={name:'Test Soup & Beans',description:'A straightforward soup for a family supper.',image:'/blog/smoky-tomato-rice-rustic.jpg',ingredients:['400 g beans','2 onions','1 litre stock'],instructions:['Chop the onions.','Simmer with the beans and stock.'],times:{total:{minutes:30}},recipeYield:'4 servings',user:{name:'Test Cook'},imageCredit:{photographer:'Test Photographer',photographerUrl:'https://example.org/photographer'}};
 socket.addEventListener('message',async event=>{
  const m=JSON.parse(event.data);if(m.method!=='Fetch.requestPaused')return;
  const {requestId,request}=m.params;
  const recipeId=JSON.parse(request.postData||'{}').variables?.id;
  if(!recipeId?.startsWith('check-')){await cmd('Fetch.continueRequest',{requestId});return}
  let recipe={...fixtureBase,id:recipeId,sourceUrl:recipeId==='check-imported'?'https://publisher.example/original-soup':null};
  if(recipeId==='check-no-image')recipe.image=null;
  if(recipeId==='check-long'){recipe.ingredients=Array.from({length:60},(_,i)=>`Ingredient ${i+1}: 200 g vegetables, washed and finely chopped`);recipe.instructions=Array.from({length:12},(_,i)=>`Method ${i+1}: Cook the vegetables gently, stirring occasionally, until softened and fragrant. Add the stock and simmer before continuing to the next stage.`)}
  await cmd('Fetch.fulfillRequest',{requestId,responseCode:200,responseHeaders:[{name:'content-type',value:'application/json'},{name:'access-control-allow-origin',value:'*'}],body:Buffer.from(JSON.stringify({data:{publicRecipe:recipe}})).toString('base64')});
 });
 await cmd('Fetch.enable',{patterns:[{urlPattern:'*graphql*',requestStage:'Request'}]});
 let opened=[];socket.addEventListener('message',event=>{const m=JSON.parse(event.data);if(m.method==='Page.windowOpen')opened.push(m.params.url)});
 const report=[];
 for(const recipeId of ['6a2ee3f6a60f749e8436af75','check-imported','check-no-image','check-long']){
 await cmd('Emulation.setEmulatedMedia',{media:'screen'});
 await cmd('Page.navigate',{url:base+'/r/'+recipeId});
 for(let i=0;i<80;i++){if(await evaluate(`Boolean(document.querySelector('.rp-title'))`))break;await delay(150)}
 if(!await evaluate(`Boolean(document.querySelector('.rp-title'))`))throw Error('Recipe did not load: '+recipeId);
 await evaluate(`document.fonts.ready.then(()=>true)`);
 for(let i=0;i<40;i++){if(await evaluate(`!document.querySelector('.rp-hero-img')||document.querySelector('.rp-hero-img').complete`))break;await delay(150)}
 const share=await evaluate(`({href:document.querySelector('.rp-pinterest-btn').href,target:document.querySelector('.rp-pinterest-btn').target,rel:document.querySelector('.rp-pinterest-btn').rel,title:document.querySelector('.rp-title').textContent,ingredients:[...document.querySelectorAll('.rp-ingredient-label > span:last-child')].map(x=>x.textContent),steps:[...document.querySelectorAll('.rp-step > span:last-child')].map(x=>x.textContent)})`);
 const pin=new URL(share.href);if(pin.searchParams.get('url')!=='https://getsavor.recipes/r/'+recipeId)throw Error('Wrong destination');
 if(share.target!=='_blank'||!share.rel.includes('noopener'))throw Error('Unsafe popup');
 if(Boolean(pin.searchParams.get('media'))!==(recipeId!=='check-no-image'))throw Error('Wrong media handling');
 if(recipeId==='check-imported'&&!pin.searchParams.get('description').includes('publisher.example'))throw Error('Missing publisher credit');
 if(recipeId==='6a2ee3f6a60f749e8436af75'){
 if(new URL(pin.searchParams.get('media')).searchParams.get('w')!=='1200')throw Error('Pinterest image must be high resolution');
 if(!await evaluate(`new URL(document.querySelector('.rp-hero-img').src).searchParams.get('w')==='400'`))throw Error('Page image must keep its original size');
 }

 opened=[];await evaluate(`document.querySelector('.rp-pinterest-btn').click()`);await delay(300);
 if(opened[0]!==share.href)throw Error('Pinterest click did not open expected composer');
 const tabs=await(await fetch(`http://127.0.0.1:${port}/json`)).json();for(const tab of tabs)if(tab.type==='page'&&tab.id!==target.id)await cmd('Target.closeTarget',{targetId:tab.id});
 await evaluate(`window.__printCalls=0;window.print=()=>{window.__printCalls++};document.querySelector('.rp-print-btn').click()`);
 if(await evaluate('window.__printCalls')!==1)throw Error('Print button did not invoke browser printing once');
 await evaluate(`document.querySelector('.rp-ingredient-label input')?.click()`);

 await cmd('Emulation.setEmulatedMedia',{media:'print'});
 const print=await evaluate(`({sourceVisible:document.querySelector('.rp-source')?getComputedStyle(document.querySelector('.rp-source')).display:null,checklistVisible:getComputedStyle(document.querySelector('.rp-checklist-tools')).display,buttonsVisible:getComputedStyle(document.querySelector('.rp-recipe-actions')).display,checkedDecoration:getComputedStyle(document.querySelector('.rp-ingredient-label.is-checked > span:last-child')).textDecorationLine})`);
 const provenance=await evaluate(`document.querySelector('.rp-print-provenance').innerText`);
 if(!provenance.includes('https://getsavor.recipes/r/'+recipeId))throw Error('Printed return URL missing');
 if(recipeId==='check-imported'&&!provenance.includes('https://publisher.example/original-soup'))throw Error('Printed source missing');
 if(print.checklistVisible!=='none'||print.buttonsVisible!=='none'||print.checkedDecoration!=='none')throw Error('Print includes controls or crossed-out ingredients');
 for(const [paper,width,height] of [['a4',8.2677,11.6929],['letter',8.5,11]]){
 const pdf=await cmd('Page.printToPDF',{printBackground:true,paperWidth:width,paperHeight:height,preferCSSPageSize:false});await fs.writeFile(path.join(dir,recipeId+'-'+paper+'.pdf'),Buffer.from(pdf.data,'base64'));
 }
 report.push({recipeId,...share,pinterest:Object.fromEntries(pin.searchParams),print});
 }
 await fs.writeFile(path.join(dir,'report.json'),JSON.stringify(report,null,2));
 console.log('PASS: actual Pinterest popup URL, safe new tab, correct recipe/media/credits, missing image, actual print handler, checkbox cleanup; eight PDF proofs generated.');
 await cmd('Browser.close');
}finally{socket?.close();child.kill();server.close()}
