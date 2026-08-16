// Verificador online da landing "LOJA DE SORVETE E AÇAI" (vitrine).
// Rode: node C:/dopamina/landing-assets/verify-vitrine.js
const fs=require('fs'),http=require('http');let p=0,f=0;const c=(n,ok)=>{if(ok)p++;else{f++;console.log('FAIL: '+n)}};
const html=fs.readFileSync('C:/dopamina/landing.html','utf8');
c('title LOJA DE SORVETE E AÇAI',html.includes('<title>LOJA DE SORVETE E AÇAI | Faça seu pedido por WhatsApp</title>'));
c('sem CARAMELO',!/CARAMELO/.test(html));
c('hero-produtos (sem hero-familia)',html.includes('hero-produtos.png')&&!html.includes('hero-familia'));
c('10 sabores',['Chocolate 50%','Pistache','Creme de Leite','Napolitano','Morango','Maracaju','Menta','Doce de Leite','Limão','Abacaxi'].every(t=>html.includes(t)));
c('6 salgados',['Coxinha','Pastel','Esfiha Carne','Esfiha Queijo','Pizza Calabresa','Risoto'].every(t=>html.includes(t)));
c('6 bebidas',['Coca-Cola','Guaraná','Sprite','Fanta Laranja','Água Mineral','Suco Natural'].every(t=>html.includes(t)));
c('3 tamanhos P/M/G',['Pequeno','Médio','Grande'].every(t=>html.includes(t)));
c('ml destaque verde',['💧 400ml','💧 600ml','💧 800ml'].every(t=>html.includes(t)));
c('sem checkout',(html.match(/addSavor|orderList|addBebida|totalItens/g)||[]).length===0);
c('3 via WhatsApp (hero/footer/fixo)',html.includes('wa.me/5521965112878')&&html.includes('wa-fixo')&&/Fazer pedido pelo WhatsApp/i.test(html));
c('modal gallery',html.includes('function openImg')&&html.includes('closeModal'));
c('5 categorias nav',['cat-sabores','cat-tamanhos','cat-estilos','cat-salgados','cat-bebidas'].every(x=>html.includes(x)));
let ok=true,err='';try{new Function(html.match(/<script>([\s\S]*?)<\/script>/)[1]);}catch(e){ok=false;err=e.message;}
c('JS sintaxe valida',ok);if(!ok)console.log('  err: '+err);
http.get('http://localhost:8765/landing.html',r=>{c('HTTP localhost 200 (('+r.headers['content-length']||'streamed'+'))',r.statusCode===200);console.log('\nAD-HOC RESULT: '+p+' passed, '+f+' failed');process.exit(f>0?1:0);}).on('error',()=>{c('HTTP localhost 200',false);console.log('\nAD-HOC RESULT: '+p+' passed, '+f+' failed');process.exit(1);});
