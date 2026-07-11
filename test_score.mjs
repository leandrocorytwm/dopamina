import fs from 'fs';
const html=fs.readFileSync('C:/dopamina/index.html','utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/)[1];
const qrcode=function(){return{addData(){},make(){},createDataURL(){return 'x';}};};
const listeners={};
function makeEl(e={}){return Object.assign({style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(t,fn){(listeners[t]=listeners[t]||[]).push(fn);},textContent:'',dataset:{},value:'',innerHTML:'',querySelectorAll(){return[];}},e);}
const ctxMock=new Proxy({},{get:(t,p)=>(['createRadialGradient','createLinearGradient'].includes(p))?(()=>({addColorStop(){}})):(['setTransform','clearRect','fillRect','beginPath','arc','fill','stroke','save','restore','translate','fillText'].includes(p)?(()=>undefined):undefined)});
const canvas=makeEl({getContext:()=>ctxMock,width:0,height:0});
const elements={}; const getEl=id=>elements[id]||(elements[id]=makeEl());
const store={}; const localStorageMock={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>store[k]=String(v)};
const documentMock={getElementById:id=>id==='c'?canvas:getEl(id),querySelectorAll:s=>s==='.mode'?[makeEl({dataset:{mode:'timed'}}),makeEl({dataset:{mode:'infinite'}}),makeEl({dataset:{mode:'two'}})]:s==='#vals .val'?[1,2,3,4,5].map(v=>makeEl({dataset:{v:String(v)}})):[],addEventListener(){}};
const windowMock={innerWidth:390,innerHeight:844,devicePixelRatio:2,addEventListener(){},AudioContext:function(){return{currentTime:0,destination:{},resume(){},createOscillator:()=>({frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},start(){},stop(){}}),createGain:()=>({gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}})};}};
let rafCbs=[],nowMs=0,timeouts=[];
const requestAnimationFrame=cb=>{rafCbs.push(cb);return rafCbs.length;};
const setTimeoutMock=(fn)=>{timeouts.push(fn);return 0;};
global.document=documentMock;global.window=windowMock;global.localStorage=localStorageMock;global.requestAnimationFrame=requestAnimationFrame;global.performance={now:()=>nowMs};global.setTimeout=setTimeoutMock;global.qrcode=qrcode;
new Function('document','window','navigator','localStorage','requestAnimationFrame','performance','setTimeout','qrcode',js)(documentMock,windowMock,{vibrate(){}},localStorageMock,requestAnimationFrame,global.performance,setTimeoutMock,qrcode);
// open donate via playBtn, then skip
(listeners['click']||[]).forEach(fn=>{try{fn({});}catch(e){console.error(e.message);}});
(listeners['click']||[]).forEach(fn=>{try{fn({});}catch(e){console.error(e.message);}});
// scan-tap a grid each frame
for(let f=0;f<300;f++){
  nowMs+=16; const cb=rafCbs.shift(); if(cb) cb(nowMs);
  for(let gx=40;gx<=350;gx+=26) for(let gy=120;gy<=820;gy+=26)
    (listeners['pointerdown']||[]).forEach(fn=>fn({clientX:gx,clientY:gy,preventDefault(){}}));
}
console.log('FINAL SCORE:',getEl('score').textContent);
console.log(parseInt(getEl('score').textContent,10)>0?'PASS scoring works':'FAIL');
