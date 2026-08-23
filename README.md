# Katlen Ariane — Site + Admin Universal

## Estrutura
```
├── index.html, css/, js/     → site estático (GitHub + Cloudflare Pages)
└── worker/
    ├── worker.js              → Cloudflare Worker (admin universal)
    ├── admin.html              → painel de administração
    └── wrangler.toml           → configuração de deploy do Worker
```

## 1. Deploy do site estático
1. Suba esta pasta (exceto `worker/`) para um repositório no GitHub.
2. No painel da Cloudflare → **Pages** → conecte o repositório.
3. Build command: nenhum (site estático puro). Diretório de saída: raiz (`/`).
4. Adicione fotos reais em `/img/` (favicon.png, katlen-foto.jpg, og-cover.jpg, whatsapp-icon.svg) — hoje o site funciona sem elas (mostra "Foto em breve" e esconde o botão do WhatsApp).

## 2. Deploy do Worker (admin universal)
Pré-requisito: `npm install -g wrangler` e `wrangler login`.

```bash
cd worker
wrangler kv:namespace create SITE_KV
# copie o "id" retornado para dentro de wrangler.toml (COLOQUE_AQUI_O_ID_DO_NAMESPACE)

wrangler secret put SESSION_SECRET
# cole uma string aleatória longa (ex: gerada com `openssl rand -hex 32`)

wrangler secret put SETUP_TOKEN
# cole outra string aleatória — só será usada uma vez, para criar o admin

wrangler deploy
```

Isso te dará uma URL do tipo `https://katlen-admin.SEU-USUARIO.workers.dev`.

## 3. Criar o usuário admin (uma única vez)
Use o `SETUP_TOKEN` que você definiu acima:

```bash
curl -X POST https://katlen-admin.SEU-USUARIO.workers.dev/api/setup \
  -H "Content-Type: application/json" \
  -H "X-Setup-Token: SEU_SETUP_TOKEN" \
  -d '{"username":"katlen","password":"SUA_SENHA_AQUI"}'
```

**Sugestão de senha inicial forte, gerada agora (troque assim que possível):**
`xEnF3KM6AMxQxDRG`

Depois desse passo, o endpoint `/api/setup` se bloqueia sozinho (só funciona se ainda não existir admin).

## 4. Acessar o painel
Abra `https://katlen-admin.SEU-USUARIO.workers.dev/admin` (você vai precisar servir o `admin.html` — mais simples: publique-o também no Cloudflare Pages, num subdomínio como `admin.katlenariane.com.br`, apontando as chamadas de API para a URL do Worker).

## 5. Conectar o site ao Worker
Em `js/main.js`, troque:
```js
const CONFIG_API_URL = "https://katlen-admin.example.workers.dev/api/config";
```
pela URL real do seu Worker.

## Campos do admin
- WhatsApp, Formspree ID
- Redes sociais (Instagram, Facebook, TikTok, LinkedIn)
- Registro profissional (CRP) — hoje com placeholder `0000000`, edite pelo painel quando tiver o número real
- Formação, especializações, experiência
- Meta Pixel, Google Analytics, Google Tag Manager (com liga/desliga individual)

## Segurança implementada
- Senha do admin nunca fica em texto puro — é derivada com **PBKDF2 (100.000 iterações, SHA-256)** e salva como hash + salt no KV.
- Sessão via **cookie assinado (HMAC-SHA256)**, `HttpOnly`, `Secure`, `SameSite=Strict`, expira em 8 horas.
- Rota `/api/setup` só funciona uma vez e exige um token secreto que não fica no código.
- Leads do formulário de contato continuam indo direto para o **Formspree** — o Worker/KV não armazena dados de clientes/pacientes.

## Pendências que ainda dependem de você
- Fotos reais (`/img/`)
- Domínio definitivo (usei `katlenariane.com.br` como placeholder no `index.html` — troque nas tags `canonical`/`og:url`)
- IDs reais do Formspree, WhatsApp, Pixel/GA/GTM (preencher pelo painel admin depois do deploy)
- Registro profissional (CRP) real
