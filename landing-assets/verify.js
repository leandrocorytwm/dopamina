// Script de verificacao rapida da landing CARAMELO v2
// Rode: node C:/dopamina/landing-assets/verify.js
const fs=require('fs');const http=require('http');
let p=0,f=0;const c=(n,ok)=>{if(ok)p++;else{f++;console.log('FAIL:',n)}};
const html=fs.readFileSync('C:/dopamina/landing.html','utf8');
c('html>20k',html.length>20000);
c('nome CARAMELO',/CARAMELO/.test(html)&&!/DOPAMINA/.test(html));
c('hero-produtos (sem fotos pessoas)',html.includes('hero-produtos.png')&&!html.includes('hero-familia.png'));
c('3 tamanhos Pequeno/Med/Grande',/Pequeno/.test(html)&&/Médio/.test(html)&&/Grande/.test(html));
c('10 sabores',(html.match(/onclick="addSabor/g)||[]).length===10);
c('6 salgados',(html.match(/onclick="addSalgado/g)||[]).length===6);
c('6 bebidas',(html.match(/onclick="addBebida/g)||[]).length===6);
c('4 paginas nav',['page-sabores','page-salgados','page-bebidas','page-pedido-resumo'].every(x=>html.includes(x)));
c('modal gallery',html.includes('function openModal')&&html.includes('modal-bg'));
c('whatsapp + finalizar',html.includes('wa.me/5521965112878')&&html.includes('function finalizarPedido'));
http.get('http://localhost:8765/landing.html',r=>{c('HTTP 200',r.statusCode===200);console.log('\nAD-HOC RESULT: '+p+' passed, '+f+' failed');process.exit(f?1:0);}).on('error',()=>{c('HTTP 200',false);console.log('\nAD-HOC RESULT: '+p+' passed, '+f+' failed');process.exit(1);});
