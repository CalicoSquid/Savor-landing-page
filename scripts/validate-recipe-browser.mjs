// Run after npm run build. Uses local Chrome and the public read-only recipe API.
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import {setTimeout as delay} from 'node:timers/promises';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir=path.join(root,'.recipe-browser-review');
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


 await cmd('Page.navigate',{url:base+'/r/6a2ee3f6a60f749e8436af75'});await delay(1000);for(let i=0;i<50;i++){if(await evaluate(`Boolean(document.querySelector('.rp-title'))`))break;await delay(200)};
 for(let i=0;i<60;i++){if(await evaluate(`Boolean(document.querySelector('.rp-hero-img')?.naturalWidth)`))break;await delay(200)}
 if(!await evaluate(`{const header=document.querySelector('.rp-header');const hero=document.querySelector('.rp-hero-wrap');const stats=document.querySelector('.rp-stats');Boolean(header.compareDocumentPosition(hero)&Node.DOCUMENT_POSITION_FOLLOWING)&&(!stats||Boolean(stats.compareDocumentPosition(hero)&Node.DOCUMENT_POSITION_FOLLOWING))}`))throw Error('Recipe title and timing must precede the photograph');
 const before=await evaluate(`document.querySelector('#recipe-jsonld').textContent`);
 await evaluate(`document.querySelector('.rp-ingredient-label input').focus()`);
 await cmd('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
 await cmd('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
 if(!await evaluate(`document.querySelector('.rp-ingredient-label input').checked`))throw Error('Keyboard checklist');
 if(!await evaluate(`document.querySelector('.rp-checklist-tools').textContent.includes('1 of')`))throw Error('Progress');
 await evaluate(`document.querySelector('.rp-checklist-tools button').click()`);
 if(await evaluate(`document.querySelector('.rp-ingredient-label input').checked`))throw Error('Reset');
 if(before!==await evaluate(`document.querySelector('#recipe-jsonld').textContent`))throw Error('Checklist altered schema');
 await evaluate(`document.querySelector('a[href="#method"]').click()`);await delay(300);
 if(!await evaluate(`document.querySelector('#method').getBoundingClientRect().top >= document.querySelector('.rp-download-bar').getBoundingClientRect().bottom`))throw Error('Sticky banner covers target');
 const report=[];
 for(const width of [390,320,1440]){
 await cmd('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
 await evaluate('scrollTo(0,0)');await delay(250);
 const shot=await cmd('Page.captureScreenshot',{format:'png'});await fs.writeFile(dir+`/ui-after-${width}.png`,Buffer.from(shot.data,'base64'));
 report.push(await evaluate(`({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,titleY:document.querySelector('.rp-title').getBoundingClientRect().top,ingredientsY:document.querySelector('.rp-section').getBoundingClientRect().top,ingredientSize:getComputedStyle(document.querySelector('.rp-ingredient')).fontSize,methodSize:getComputedStyle(document.querySelector('.rp-step')).fontSize,buttons:[...document.querySelectorAll('.rp-root button,.rp-root a')].map(x=>({text:x.innerText,height:x.getBoundingClientRect().height})),text:document.querySelector('.rp-sections-wrap').innerText})`));
 }
 if(report.some(x=>x.overflow))throw Error('Horizontal overflow');
 await cmd('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:true});
 await evaluate(`document.querySelector('.rp-section').scrollIntoView()`);await delay(200);
 let shot=await cmd('Page.captureScreenshot',{format:'png'});await fs.writeFile(dir+'/ui-after-ingredients.png',Buffer.from(shot.data,'base64'));
 await evaluate(`document.querySelector('.rp-ingredient-label input').click()`);
 await cmd('Emulation.setEmulatedMedia',{media:'print'});
 if(!await evaluate(`getComputedStyle(document.querySelector('.rp-ingredient-label input')).display==='none' && getComputedStyle(document.querySelector('.rp-ingredient-label.is-checked > span:last-child')).textDecorationLine==='none'`))throw Error('Print checklist cleanup');
 report.push(await evaluate(`({print:true,sourceVisible:document.querySelector('.rp-source')?getComputedStyle(document.querySelector('.rp-source')).display:null,bodyOverflow:document.documentElement.scrollWidth>innerWidth,sectionWidths:[...document.querySelectorAll('.rp-section')].map(x=>x.getBoundingClientRect().width)})`));
 const pdf=await cmd('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});await fs.writeFile(dir+'/recipe-print-after.pdf',Buffer.from(pdf.data,'base64'));
 await fs.writeFile(dir+'/ui-after-review.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report.map(({text,buttons,...x})=>x)));
 await cmd('Emulation.setEmulatedMedia',{media:'screen'});
 await cmd('Network.setBlockedURLs',{urls:['*images.unsplash.com*']});
 await cmd('Page.navigate',{url:base+'/r/6a2ee3f6a60f749e8436af75'});
 for(let i=0;i<50;i++){if(await evaluate(`Boolean(document.querySelector('.rp-hero-placeholder'))`))break;await delay(200)}
 if(!await evaluate(`Boolean(document.querySelector('.rp-hero-placeholder')) && Boolean(document.querySelector('#method'))`))throw Error('Image failure must preserve cookable content');
 if(!await evaluate(`document.querySelector('.rp-ingredient-label input').checked===false`))throw Error('New visit must reset checklist');
 console.log('PASS: keyboard checklist, progress/reset, metadata stability, jump targets, mobile widths, print, image failure and checklist reset');
 await cmd('Browser.close');
} finally {socket?.close();child.kill();server.close()}
