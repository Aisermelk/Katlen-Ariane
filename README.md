# Katlen Ariane — Site

Landing page da psicanalista Katlen Ariane, integrada ao painel
**V8 ADMIN — Universal** (compartilhado entre todos os projetos, não é
um admin próprio deste site).

**Projeto no painel:** `be844101-c846-491b-bcf8-87626d91cffe`
**API:** `https://v8adminuniversal.aisermelk.workers.dev`
**Painel:** `https://v8adminuniversal.pages.dev`

## Estrutura

```
index.html, css/, js/, assets/   → site estático (GitHub + Cloudflare Pages)
```

Não há mais um Worker/admin próprio deste site — toda a configuração
(WhatsApp, endereço, redes sociais, Formspree, Pixel/GA/GTM, registro
profissional CBPC 2022-6172, SEO, scripts customizados) é gerenciada
pelo painel V8 ADMIN — Universal, projeto "Katlen Ariane".

## Como funciona a integração

O `js/v8-loader.js` (mesmo arquivo usado em todos os outros projetos,
sem edição) busca a config pública do projeto e preenche automaticamente
todo elemento com atributo `data-v8="..."` no `index.html`, além de
aplicar SEO, scripts customizados, mídia e localização definidos no
painel.

O `js/main.js` cuida só da interface do site (menu mobile, navegação
suave, ano do rodapé) — não tem mais nenhuma lógica de configuração
duplicada.

## Deploy

1. Suba esta pasta para o repositório no GitHub.
2. Cloudflare Pages → conecte o repositório. Build command: nenhum.
   Diretório de saída: raiz.
3. No painel `v8adminuniversal.pages.dev`, edite o projeto "Katlen
   Ariane" pra preencher/atualizar WhatsApp, endereço, redes sociais,
   Formspree, Pixel/GA/GTM, conteúdo, SEO etc.

## Pendências que ainda dependem de você

- Banner em carrossel no hero (o espaço reservado `#hero-banner-slot`
  continua no HTML)
- Fotos reais definitivas (hero e seção "Sobre")
- Domínio definitivo (ajustar `canonical`/`og:url` no `index.html`)
