# Bunker

PWA pessoal de metas e projetos. HTML/JS puro + Cloudflare Pages + D1 + Workers.

## Mapa do projeto

```
bunker/
├── public/                  ← O SITE (o que o iPhone baixa)
│   ├── index.html           casca: topo, abas, área da tela, botão +
│   ├── css/bunker.css       todo o visual; tokens de cor/fonte no topo
│   ├── js/app.js            roteador + todas as telas
│   ├── js/ui.js             peças reaproveitadas: h(), status, dinheiro, folha
│   ├── js/api.js            única porta para o servidor (com a senha)
│   ├── js/push.js           pede permissão e cadastra o iPhone para push
│   ├── sw.js                service worker: cache offline + recebe push
│   ├── manifest.webmanifest nome/ícone do app instalado
│   └── _headers             regras de cache para a Cloudflare
├── functions/api/[[path]].js ← A API: toda URL /api/* cai aqui e fala com o D1
├── migrations/0001_inicial.sql ← o formato do banco (tabelas)
├── worker-push/             ← worker separado que acorda a cada 5 min e manda push
├── scripts/                 gerar chaves VAPID, projeto de exemplo
└── wrangler.toml            liga o site ao banco
```

## Como as peças conversam

```
iPhone (app.js) ──fetch──▶ /api/... (functions) ──SQL──▶ D1
                                                          ▲
worker-push (cron 5 min) ── lê lembretes vencidos ────────┘
      └──push──▶ servidor da Apple ──▶ iPhone (sw.js) ──▶ notificação
```

## Decisões que valem entender

| Decisão | Por quê |
| --- | --- |
| Dinheiro em centavos (inteiro) | `0.1 + 0.2` dá `0.30000000000000004` no computador. Inteiro nunca erra. |
| Categoria não tem DELETE | A API não tem a rota **e** um gatilho no banco recusa. Duas travas. |
| `h()` em vez de montar HTML com texto | Texto digitado nunca vira código. Segurança de graça. |
| Status com símbolo + palavra | Nunca só cor (▶ ‖ ✕ ✓). |
| Rust/Mauve como fundo, texto preto em cima | Como letra no creme eles não passam contraste (3.5 e 2.6). Como letra, use `--rust-texto` / `--mauve-texto`. |
| Navegação por `#` | O voltar do iPhone funciona sem nenhum código extra. |
| Senha `APP_TOKEN` | O site é público na internet; sem senha qualquer um leria seus dados. |
| Push sem conteúdo | Evita a parte longa de criptografia. O sw.js busca o texto na API. |

## Publicar (uma vez)

1. Instale as ferramentas e entre na Cloudflare:
   ```bash
   npm install
   ```
   ```bash
   npx wrangler login
   ```
2. Crie o banco e cole o `database_id` que aparecer nos **dois** `wrangler.toml`:
   ```bash
   npx wrangler d1 create bunker
   ```
3. Crie as tabelas no banco real:
   ```bash
   npm run db:remoto
   ```
4. Suba para o GitHub. No painel da Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, escolha o repositório. Build command: vazio. Output directory: `public`.
5. No projeto Pages: **Settings → Variables and Secrets** → adicione `APP_TOKEN` (tipo *Secret*) com uma senha longa. Em **Settings → Bindings**, confira que o D1 `bunker` aparece como `DB`. Refaça o deploy.
6. No iPhone, abra o site no Safari → Compartilhar → **Adicionar à Tela de Início**. Abra pelo ícone e digite a senha.

## Ligar as notificações (depois)

1. Gere as chaves:
   ```bash
   npm run vapid
   ```
2. Cole a **pública** em `VAPID_PUBLIC_KEY` nos dois `wrangler.toml` e troque o e-mail em `VAPID_SUBJECT`.
3. Guarde os segredos do worker:
   ```bash
   cd worker-push && npx wrangler secret put VAPID_PRIVATE_JWK
   ```
   ```bash
   cd worker-push && npx wrangler secret put APP_TOKEN
   ```
4. Publique o worker:
   ```bash
   npm run deploy:push
   ```
5. No app instalado: **⋯ → Ativar notificações**. Num step: **Lembrar**.

> Push sem conteúdo ainda não foi testado num iPhone real. Se a Apple recusar, o próximo passo é criptografar o conteúdo (RFC 8291) no worker.

## Rodar no computador

```bash
cp .dev.vars.exemplo .dev.vars
```
```bash
npm run db:local && npm run exemplo:local
```
```bash
npm run dev
```
Abra http://localhost:8788 e entre com a senha do `.dev.vars`.

## Ajustes pequenos para você fazer

- **Mudar uma cor**: `public/css/bunker.css`, bloco `:root` no topo.
- **Texto maior ou menor**: `--t-base` (hoje 19px) e `--lh` (entrelinha 1.7).
- **Renomear um status** ("Em andamento" → "Fazendo"): `STATUS` em `public/js/ui.js`.
- **Quantos próximos passos o card mostra**: `.slice(0, 3)` em `fillCardBody`, `app.js`.
- **Dicas embaixo dos campos do step**: `stepFields` em `app.js`.
- **Depois de mudar qualquer arquivo de `public/`**: aumente `VERSAO` em `sw.js` (`bunker-v1` → `bunker-v2`), senão o iPhone continua com a versão antiga.
