---
description: Melhora o visual do frontend do DMS migrando os estilos atuais para Tailwind CSS 3.
agent: tailwind-ui
---

# Melhorar visual com Tailwind CSS 3

Melhore o visual da aplicação frontend do DMS migrando os estilos atuais em
`frontend/src/App.css` para Tailwind CSS 3.

## Passos

1. Instale e configure o Tailwind CSS 3 no projeto Vite em `frontend/`
   (`tailwindcss@3`, `postcss`, `autoprefixer`), gerando `tailwind.config.js`
   e `postcss.config.js`, e habilitando as diretivas `@tailwind` no CSS
   principal.
2. Migre os componentes em `frontend/src/App.jsx` e
   `frontend/src/components/` (`DocumentList.jsx`, `UploadComponent.jsx`,
   `DownloadButton.jsx`) para usar classes utilitárias do Tailwind no lugar
   das classes CSS manuais definidas em `App.css`.
3. Preserve a identidade visual atual (tons terrosos, tipografia com
   'DM Sans' e 'Space Grotesk', destaque em terracota) refinando-a para ficar
   mais consistente, legível e responsiva.
4. Remova de `App.css` o que se tornar redundante após a migração, mantendo
   apenas o necessário (ex. import de fontes e diretivas do Tailwind).
5. Garanta responsividade mobile-first e bons estados visuais de hover,
   foco, desabilitado, carregamento e erro.

## Restrições

- Não altere a lógica de negócio nem as chamadas a `frontend/src/services/api.js`.
- Não quebre as funcionalidades existentes de upload, listagem e download.
- Mensagens ao usuário permanecem em português.
- Ao final, rode o build/dev do frontend para validar que não há erros.
