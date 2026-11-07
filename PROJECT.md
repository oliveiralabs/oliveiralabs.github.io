# Site da Oliveira Labs

Site institucional e portfólio da Oliveira Labs para publicação em `https://oliveiralabs.github.io`.

## Desenvolvimento

Requer Node.js 22 ou mais recente.

```bash
npm ci
npm run check
npm start
```

O site é gerado em `dist/`. A geração também copia e verifica byte a byte todos os caminhos públicos registrados em `static-contract.json`, incluindo políticas, páginas de suporte, arquivos de validação e loops utilizados pelos aplicativos.

## Adicionar um aplicativo

Edite `site/data/apps.mjs`, forneça o ícone e execute `npm run check`. A página individual, o índice do portfólio e o sitemap serão atualizados automaticamente.

## Idiomas

O inglês é publicado na raiz e o português em `/pt/`. Textos compartilhados ficam em `site/data/i18n.mjs`; o conteúdo localizado de cada produto fica em `site/data/apps.mjs`. Novos idiomas devem ser acrescentados ao mesmo modelo e gerar suas próprias rotas e metadados `hreflang`.

## Publicação

O workflow `deploy-pages.yml` publica o conteúdo de `dist/` no GitHub Pages após a integração na branch `master`. A troca do domínio customizado só deve ocorrer durante a etapa coordenada de migração do Mega Drum.
