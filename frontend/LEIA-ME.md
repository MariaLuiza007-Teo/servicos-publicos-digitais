# Leia-me — frontend

Complementa o `GUIA-DO-PROJETO.md` da raiz. Vale para tudo dentro de `frontend/`.

- React 19 + Vite 8, **JavaScript**. JSX só em arquivos `.jsx`.
- Rotas em `src/App.jsx`. Abas do topo em `TABS` (`src/components/Layout.jsx`). A aba "Guia" fica ativa
  em `/`, `/guia/*` e `/servicos`.
- `AssistentePage` é carregada sob demanda (`React.lazy`) porque `react-markdown` é pesado. Mantenha
  dependências pesadas fora do pacote inicial.
- **Conteúdo não fica nos componentes.** Textos do Guia: `src/data/temas.js`; serviços:
  `src/data/servicos.js`. Os componentes só exibem.
- Ícones: importe de `lucide-react`. Ícones referenciados por nome no conteúdo precisam estar no mapa
  `src/components/icons.jsx`.
- Estilos: um arquivo só (`src/styles/index.css`), com variáveis em `:root` e tema escuro em
  `@media (prefers-color-scheme: dark)`. Use as variáveis (`--primary`, `--perigo`...) — nunca cores
  soltas. Classes no estilo BEM simples (`bloco__parte--variacao`). Cores, tamanhos de tela
  (720px, 1024px, 1100px) e peças prontas estão em `docs/DESIGN.md`; leia antes de mudar o visual.
- Links externos: sempre `<ExternalLink>` (abre em nova aba com `rel="noopener noreferrer"` e aviso para
  leitor de tela).
- Chamadas à API só por `src/lib/chatApi.js`. Em dev, `/api` vai para `localhost:3001` (proxy do Vite);
  em produção, defina `VITE_API_URL`.
- Antes de enviar texto do usuário à API, passe por `maskSensitive` (`src/lib/privacy.js`).
- `localStorage` só para preferências (tamanho da letra), sempre dentro de `try/catch`.
- Testes: `npm test` roda `src/**/*.test.js` com `node --test` (só funções puras, sem DOM).
