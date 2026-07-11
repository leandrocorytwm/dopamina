# DOPAMINA — jogo + ranking global (100% gratuito)

Jogo de estourar alvos com combos, PIX, anúncios opcionais, bombas e ranking.
Funciona em celular e PC. Sem build, sem dependências externas.

## Novidades
- 💣 **Bombas** entre os alvos (aumentam com o tempo). Estourar = -40 pts e perde o combo.
- ➡️ **Botão Sair (✕)** no canto superior esquerdo durante o jogo → volta ao menu.
- 🏷️ **Nome do jogador** capturado no fim do jogo (tela de game over), com replay "JOGAR DE NOVO".
- 🏆 Ranking local + global (agora / recordes) no botão RANKING.

## Arquivos
- `index.html` · `landing.html` · `qrcode.min.js` · `server.js` · `scores.json`
- `package.json` · `render.yaml` · `Dockerfile` · `docker-compose.yml`

## Opção A — RODAR NO SEU PC (local)
```
cd C:/dopamina
node server.js
```
Abra http://localhost:8765/index.html (celular: use o IP da máquina na mesma Wi-Fi).

## Opção A2 — DOCKER no seu PC (recomendado pra "ficar online")
```
cd C:/dopamina
docker compose up -d --build
```
Abra http://localhost:8765/index.html. O container reinicia sozinho.

Para expor na internet pelo seu PC (sem pagar):
1. Libere a porta 8765 no roteador (redirecionamento de porta) OU use um túnel:
   - **Cloudflared** (grátis): `cloudflared tunnel --url http://localhost:8765`
   - ou **ngrok** (grátis, temporário): `ngrok http 8765`
2. Compartilhe a URL gerada. O ranking global funciona porque o server.js é o backend.

Observação: seu PC precisa estar ligado pra o jogo ficar online. Se quiser 24/7 sem
deixar o PC ligado, use a Opção B (Render) abaixo.

## Opção B — DEIXAR ONLINE 24/7 GRÁTIS (Render)
1. https://render.com → conta (GitHub/Google).
2. New → Web Service → conecte o repositório (ou upload da pasta).
3. Runtime: Node · Build Command: (vazio) · Start Command: `node server.js` · Plan: Free.
4. Deploy → URL tipo https://dopamina.onrender.com (ranking global funciona).

Free "dorme" após 15 min parado. Manter acordado de graça: monitor no uptimerobot.com.

## Como apontar o jogo para a API do ranking
Por padrão usa a MESMA origem (funciona com server.js / Docker / Render acima).
Se jogo e API ficarem separados, abra com `?api=URL_DA_API`:
  https://meujogo.com/index.html?api=https://minha-api.onrender.com
Ou defina no console: `localStorage.setItem('dopamina_api','https://...')`.

## PIX
Chave: baa38b04-48dc-426c-a3a9-0fbb1693d87b (R$1–R$5, escolhe o jogador).
QR gerado em tempo real com CRC16 EMVCo válido. Troque em `PIX_KEY` no index.html.

## Sem servidor? (só o jogo, ranking só local)
Abra o `index.html` direto (duplo-clique). O ranking global fica vazio; o resto funciona.
