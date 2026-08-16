// editor.js — lógica da ferramenta de admin (KISS/zero-deps via fetch + localStorage).
function editStore(v){data.store=v;updateWhatsAppMsg();}
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const api = '/api/data';

let data = {};
const sections = ['sabores', 'salgados', 'bebidas', 'sizes', 'estilos', 'gallery', 'hero'];
function updateWhatsAppMsg() {
  const w = document.getElementById('whatsapp-edit'); if (!w) return;
  data.store = document.getElementById('store-edit').value || data.store;
  const el = document.getElementById('hero-h1'); if (el) el.textContent = data.store || '';
  const lnks = document.querySelectorAll('a[href*="wa.me"]');
  const msg = encodeURIComponent('Olá, gostaria de fazer um pedido na ' + data.store + '!');
  lnks.forEach(a => { const u = new URL(a.href); u.search = '?text=' + msg; a.href = u.toString(); });
}

// carrega dados do servidor (fonte de verdade) — fallback pra localStorage se offline
async function load() {
  try {
    const r = await fetch(api, { cache: 'no-store' });
    data = await r.json();
    localStorage.setItem('editor-cache', JSON.stringify(data));
  } catch (e) {
    const cached = localStorage.getItem('editor-cache');
    if (cached) { data = JSON.parse(cached); $('#offline-badge').style.display = 'block'; }
    else { alert('Sem conexão e sem cache offline.'); return; }
  }
  renderAll();
}

// salva no servidor (POST) + localStorage (backup)
async function save() {
  try {
    const r = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (r.ok) { localStorage.setItem('editor-cache', JSON.stringify(data)); $('#saved').style.opacity = '1'; setTimeout(() => $('#saved').style.opacity = '0', 1500); }
    else { alert('Erro ao salvar (servidor). Tente recarregar.'); }
  } catch (e) { localStorage.setItem('editor-cache', JSON.stringify(data)); $('#offline-badge').style.display = 'block'; }
  renderAll();
}

// EXPORTAR JSON (download pro notebook)
function exportJson() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'editor-data.json';
  a.click(); URL.revokeObjectURL(url);
}

// IMPORTAR JSON (arquivo editado noutro PC)
function importJson(e) {
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try { data = JSON.parse(ev.target.result); save(); } catch { alert('JSON inválido.'); }
  };
  reader.readAsText(f);
}

// render dinâmico (sem depender de landing.html)
function renderAll() {
  // hero
  if ($('#hero-h1')) $('#hero-h1').textContent = data.hero?.h1 || '';
  if ($('#hero-p')) $('#hero-p').textContent = data.hero?.p || '';
  if ($('#whatsapp-link')) {
    const w = data.whatsapp || '';
    $('#whatsapp-link').href = 'https://wa.me/' + w;
    ['#hero-whatsapp', '#footer-whatsapp', '#fixo-whatsapp'].forEach(sel => {
      const el = $(sel); if (el) el.href = 'https://wa.me/' + w;
    });
  }

  // store (sync inputs after render)
  if ($('#store-name')) $('#store-name').textContent = data.store || '';
  if ($('#store-title')) $('#store-title').textContent = data.store || '';
  const se = $('#store-edit');
  if (se) { se.value = data.store || '';
    if (!se.__bound) { se.__bound = true;
      se.addEventListener('input', () => { data.store = se.value; updateWhatsAppMsg(); renderAll(); });
    }
  }
  const we = $('#whatsapp-edit');
  if (we) { we.value = data.whatsapp || '';
    if (!we.__bound) { we.__bound = true;
      we.addEventListener('input', () => { data.whatsapp = we.value; updateWhatsAppMsg(); save(); });
    }
  }

  // gallery
  const g = $('#gallery-list');
  if (g) {
    g.innerHTML = (data.gallery || []).map((it, i) => `
      <div class="item" style="background:url('${it.img}') center/cover; background-size:cover;">
        <span class="alt">${it.alt}</span>
        <button onclick="move('gallery',${i},-1)" title="↑">↑</button>
        <button onclick="move('gallery',${i},1)" title="↓">↓</button>
        <button onclick="remove('gallery',${i})" title="Remove">✕</button>
      </div>`).join('');
  }

  // lists dinâmicas
  sections.filter(s => !['gallery', 'hero'].includes(s)).forEach(sec => {
    const wrap = $('#list-' + sec);
    if (!wrap) return;
    const arr = data[sec] || [];
    wrap.innerHTML = arr.map((it, i) => cardHtml(sec, it, i)).join('');
    // botões add
    let add = $('#add-' + sec);
    if (!add) {
      add = document.createElement('button');
      add.id = 'add-' + sec;
      add.textContent = '＋ Adicionar';
      add.className = 'btn-add';
      add.onclick = () => addItem(sec);
      wrap.parentNode.insertBefore(add, wrap.nextSibling);
    }
  });
}

function cardHtml(sec, it, i) {
  if (sec === 'sabores' || sec === 'salgados' || sec === 'bebidas') {
    return `<div class="card">
      <span class="drag">↕</span>
      <input placeholder="Nome" value="${it.name || ''}" onchange="edit(${JSON.stringify(sec)},${i},'name',this.value);save()">
      <input placeholder="R$" value="${it.price || ''}" onchange="edit(${JSON.stringify(sec)},${i},'price',this.value);save()">
      <input placeholder="Imagem (URL)" value="${it.img || ''}" onchange="edit(${JSON.stringify(sec)},${i},'img',this.value);save()">
      ${sec === 'sabores' ? '' : `<input placeholder="Icone/tag" value="${it.icon || it.tag || ''}" onchange="edit(${JSON.stringify(sec)},${i},'tag',this.value);save()">`}
      <button onclick="move('${sec}',${i},-1)" title="↑">↑</button>
      <button onclick="move('${sec}',${i},1)" title="↓">↓</button>
      <button onclick="remove('${sec}',${i})" class="rm" title="Remover">✕</button>
    </div>`;
  }
  if (sec === 'sizes') return `<div class="card"><input placeholder="Nome" value="${it.name||''}" onchange="editS(${i},'name',this.value);save()"><input placeholder="R$" value="${it.price||''}" onchange="editS(${i},'price',this.value);save()"><input placeholder="ml" value="${it.ml||''}" onchange="editS(${i},'ml',this.value);save()"><button onclick="remove('sizes',${i})" title="Remover">✕</button></div>`;
  if (sec === 'estilos') return `<div class="card"><span>✦</span><input placeholder="Nome" value="${it.name||''}" onchange="edit(${JSON.stringify(sec)},${i},'name',this.value);save()"><button onclick="move('${sec}',${i},-1)">↑</button><button onclick="move('${sec}',${i},1)">↓</button><button onclick="remove('${sec}',${i})" class="rm" title="Remover">✕</button></div>`;
}

function edit(sec, i, k, v) { data[sec][i][k] = v; }
function editS(i, k, v) { data.sizes[i][k] = v; }
function addItem(sec, nm) {
  if (!data[sec]) data[sec] = [];
  const def = sec === 'sabores' || sec === 'salgados' || sec === 'bebidas' ? { name: '', price: '', img: '' } : sec === 'sizes' ? { name: '', price: '', ml: '' } : sec === 'estilos' ? { name: '' } : { img: '', alt: '' };
  data[sec].push(def);
  renderAll();
}
function remove(sec, i) { data[sec].splice(i, 1); renderAll(); }
function move(sec, i, d) { const a = data[sec]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; renderAll(); }

load();
