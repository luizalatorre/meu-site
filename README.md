# Exemplo de portfólio filtrável em Jekyll

Este é um esqueleto funcional mostrando a estrutura que discutimos: cada vídeo/projeto
é um arquivo Markdown com metadados (front matter), e o Jekyll gera automaticamente
a página individual + a grade filtrável na home.

## Estrutura

```
_config.yml          → configuração da collection "projects"
_layouts/default.html → layout base (nav, footer)
_layouts/project.html → layout de cada página de projeto (vídeo, texto, ficha técnica)
_projects/*.md         → um arquivo por projeto (ESSE é o arquivo que você edita
                          sempre que adicionar um trabalho novo)
index.html              → home com grade + botões de filtro
assets/css/style.css    → estilo (troque à vontade)
assets/js/filter.js      → lógica do filtro no front-end
```

## Como adicionar um novo trabalho

1. Copie um arquivo existente em `_projects/` (ex: `reflexos-e-sombras.md`)
2. Renomeie o arquivo (o nome vira parte da URL, ex: `meu-novo-video.md`)
3. Edite os campos no topo (front matter): título, ano, categoria, tags, ID do vídeo no Vimeo
4. Escreva a descrição abaixo do segundo `---`
5. Salve e dê `git push` — o site republica sozinho

## Como pegar o ID do vídeo no Vimeo

Na URL do vídeo, ex: `https://vimeo.com/123456789`, o ID é `123456789`.
Cole esse número no campo `vimeo_id` do arquivo do projeto.

## Como testar localmente antes de publicar (opcional)

Se quiser ver o site rodando na sua máquina antes do push:

```bash
gem install bundler jekyll
bundle init
bundle add jekyll
bundle exec jekyll serve
```

Depois abra `http://localhost:4000` no navegador.

## Como publicar no GitHub Pages

1. Suba esta pasta para um repositório no GitHub
2. Vá em Settings → Pages
3. Em "Source", selecione a branch (geralmente `main`) — o GitHub detecta o Jekyll
   automaticamente
4. Em "Custom domain", coloque `luizalatorre.com` e siga as instruções de DNS
   (isso é grátis, diferente do Webflow)

## Próximos passos sugeridos

- Trocar as imagens de exemplo em `assets/img/` pelas capas reais
- Ajustar `style.css` com sua tipografia e cores
- Adicionar as animações de ícone/interação que você mencionou, usando CSS
  (`transition`, `@keyframes`) ou uma pequena biblioteca como GSAP
