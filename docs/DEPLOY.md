# Publicação

O site tem duas partes que podem ficar em lugares diferentes:

| Parte | O que é | Onde hospedar (planos gratuitos) |
| --- | --- | --- |
| Frontend | Arquivos estáticos (`frontend/dist`) | Netlify (ou Render, como site estático) |
| API | Servidor Node.js | Render ou Railway |

Guia, Serviços e Verificador funcionam **só com o frontend**. A API é necessária apenas para o assistente.

## API (exemplo: Render)

1. Novo **Web Service** apontando para o repositório.
2. Configuração:
   - Build command: `npm install`
   - Start command: `npm run start:api`
3. Variáveis de ambiente:

   | Variável | Valor |
   | --- | --- |
   | `LLM_PROVIDER` | `groq` |
   | `LLM_API_KEY` | sua chave da Groq |
   | `CORS_ORIGIN` | endereço do site publicado, ex.: `https://guia-cidadao.netlify.app` |
   | `TRUST_PROXY` | `1` |
   | `EMBEDDINGS_PROVIDER` | `none` |

   O Ollama não roda nos planos gratuitos. Por isso, em produção use a Groq. Se o índice foi gerado com
   embeddings no computador de vocês, a API publicada usa a busca por palavras-chave automaticamente.
4. Teste: `https://SUA-API/api/health` deve responder `"ok": true`.

No plano gratuito do Render, a API "dorme" depois de um tempo parada e a primeira pergunta pode
demorar cerca de 1 minuto. **No dia da apresentação, abra o assistente alguns minutos antes.**

## Frontend (Netlify)

1. Em https://app.netlify.com, **Add new site → Import an existing project** e escolha o repositório
   do GitHub.
2. Não precisa preencher a configuração: o arquivo `netlify.toml` na raiz já diz o comando de build
   (`npm run build`) e a pasta publicada (`frontend/dist`).
3. Em **Site configuration → Environment variables**: `VITE_API_URL` = endereço da API (sem `/` no
   final). Depois de criar a variável, faça um novo deploy para ela valer.
4. O site usa rotas como `/servicos`. O arquivo `frontend/public/_redirects` faz a Netlify devolver o
   `index.html` para qualquer caminho, então recarregar a página não dá erro 404.

### Alternativa: Render (mesma conta da API)

Se preferirem ter tudo num lugar só, o Render também publica sites estáticos:

1. **New → Static Site** apontando para o repositório.
2. Build command: `npm install && npm run build`. Publish directory: `frontend/dist`.
3. Variável de ambiente `VITE_API_URL`, como na Netlify.
4. Em **Redirects/Rewrites**, adicione uma regra: Source `/*`, Destination `/index.html`, Action
   **Rewrite**. (O Render não lê o arquivo `_redirects`.)

**GitHub Pages** não devolve o `index.html` para outras rotas. Prefira Netlify ou Render.

Depois de publicar, atualize o `CORS_ORIGIN` da API com o endereço final do site.

## Checklist antes de divulgar (QR Code na cartilha)

- [ ] `npm test` e `npm run build` passam.
- [ ] Todos os links de `servicos.js` foram conferidos (inclusive o e-Título).
- [ ] O assistente responde com base nos documentos do RAG.
- [ ] Testado em um celular de verdade, com letra A++ e no modo escuro.
- [ ] A chave da Groq não aparece em nenhum arquivo do repositório.
