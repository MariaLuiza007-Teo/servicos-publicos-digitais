# Leia-me — backend

Complementa o `GUIA-DO-PROJETO.md` da raiz. Vale para tudo dentro de `backend/`.

- Node.js + Express 5, ESM (`"type": "module"`). Sem TypeScript, sem ORM, sem banco de dados.
- Toda configuração vem de `src/config.js`, que lê `backend/.env` com `process.loadEnvFile`. Nunca leia
  `process.env` fora de `config.js`. Variável nova → adicione em `config.js` **e** em `.env.example`.
- `npm run dev` força a porta 3001 (`--port=3001`) porque o Vite encaminha `/api` para ela. `npm start`
  (produção) usa `PORT` do ambiente.
- Rotas:
  - `GET /api/health` → provedor/modelo de IA e situação do RAG.
  - `POST /api/chat` `{ messages: [{role, content}] }` → **Server-Sent Events**: `meta`, `token`...,
    `done` ou `error`. O formato é consumido por `frontend/src/lib/chatApi.js`; mudou um, mude o outro.
- Fluxo do chat (`src/routes/chat.js`): valida → mascara dados pessoais → `retrieve()` (RAG) →
  `buildMessages()` (prompt + contexto) → `streamChat()` (LLM) → repassa os pedaços.
- LLM: `src/llm/client.js` fala o formato OpenAI `/chat/completions` com `stream: true`. Provedores
  (`mock`, `ollama`, `groq`, `custom`) só mudam URL/modelo/chave no `.env`.
- RAG: documentos em `rag/documentos/*.md` com frontmatter (`titulo`, `fonte`, `categoria`,
  `atualizado_em`). `scripts/ingest.js` gera `rag/indice/indice.json`; `src/rag/store.js` recarrega o
  índice sozinho quando o arquivo muda.
- Mensagens de erro para o usuário em português e sem detalhes técnicos; detalhes vão para o `console`.
- Nunca registre no log o conteúdo das perguntas dos usuários.
- Testes: `npm test` (`node --test "src/**/*.test.js"`).
