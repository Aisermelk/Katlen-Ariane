# Katlen Ariane — Site + Admin Universal (v3)

## O que mudou nesta versão
- Novo estilo inspirado em fernandapsicologa.com.br: logo em fonte assinatura ("Parisienne"), barra de contato no topo, menu ampliado (Início, Sobre, Atendimento, Neurodesenvolvimento, Primeira Consulta, Textos, Contato).
- Nova paleta: **azul-céu** como cor primária (em vez do azul royal), com tom profundo `--ink` para textos/títulos, e acentos discretos (âmbar, verde-água, lilás) usados nos cards de público-alvo.
- Tipografia com personalidade: **Fraunces** (display/títulos), **Parisienne** (assinatura da logo), **Inter** (corpo/menu).
- Hero por enquanto só com título/texto — reservei o espaço `#hero-banner-slot` (com aviso visual "Banner em breve") pronto para você plugar o carrossel de banners depois.
- Registro profissional real preenchido: **CBPC 2022-6172** (era placeholder `0000000` antes).
- Novo campo de **endereço** no admin/config (usado na barra de contato do topo).

## Estrutura
```
├── index.html, css/, js/, img/   → site estático (GitHub + Cloudflare Pages)
└── worker/
    ├── worker.js                  → Cloudflare Worker (admin universal)
    ├── admin.html                  → painel de administração
    └── wrangler.toml               → configuração de deploy do Worker
```

## 1. Deploy do site estático
1. Suba esta pasta (exceto `worker/`) para o repositório no GitHub.
2. Cloudflare Pages → conecte o repositório. Build command: nenhum. Diretório de saída: raiz.
3. Adicione fotos reais em `/img/` quando tiver (favicon.png, og-cover.jpg). O hero e a foto "Sobre" continuam como placeholders visuais até você decidir trocar.

## 2. Deploy do Worker (admin universal)
```bash
cd worker
wrangler kv:namespace create SITE_KV
# copie o "id" retornado para dentro de wrangler.toml

wrangler secret put SESSION_SECRET
wrangler secret put SETUP_TOKEN

wrangler deploy
```

## 3. Criar o usuário admin (uma única vez)
```bash
curl -X POST https://katlen-admin.SEU-USUARIO.workers.dev/api/setup \
  -H "Content-Type: application/json" \
  -H "X-Setup-Token: SEU_SETUP_TOKEN" \
  -d '{"username":"katlen","password":"SUA_SENHA_AQUI"}'
```

**Senha inicial sugerida (troque depois do primeiro acesso):** `xEnF3KM6AMxQxDRG`

## 4. Conectar o site ao Worker
Em `js/main.js`, troque `CONFIG_API_URL` pela URL real do seu Worker.

## 5. Publicar o admin.html
Publique `worker/admin.html` também via Cloudflare Pages (ex: `admin.katlenariane.com.br`), apontando as chamadas de API (já feitas com `credentials: "include"`) para a URL do Worker.

## Campos do admin
WhatsApp, endereço, Formspree ID, redes sociais, registro profissional (CRP — já vem com CBPC 2022-6172 como padrão), formação/especializações/experiência, Meta Pixel/GA/GTM com liga-desliga individual.

## Pendências que ainda dependem de você
- Banner em carrossel no hero (o espaço já está reservado em `#hero-banner-slot`)
- Fotos reais (hero e seção "Sobre" estão com placeholders visuais em degradê azul-céu)
- Domínio definitivo (troque nas tags `canonical`/`og:url` do `index.html`)
- IDs reais do Formspree, WhatsApp, Pixel/GA/GTM (preencher pelo painel admin depois do deploy)
