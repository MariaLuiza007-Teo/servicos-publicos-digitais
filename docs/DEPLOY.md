# Publicação

O site tem duas partes que podem ficar em lugares diferentes:

| Parte | O que é | Onde hospedar (planos gratuitos) |
| --- | --- | --- |
| Frontend | Arquivos estáticos (`frontend/dist`) | Vercel ou Netlify |
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
   | `CORS_ORIGIN` | endereço do site publicado, ex.: `https://guia-cidadao.vercel.app` |
   | `TRUST_PROXY` | `1` |
   | `EMBEDDINGS_PROVIDER` | `none` |

   O Ollama não roda nos planos gratuitos. Por isso, em produção use a Groq. Se o índice foi gerado com
   embeddings no computador de vocês, a API publicada usa a busca por palavras-chave automaticamente.
4. Teste: `https://SUA-API/api/health` deve responder `"ok": true`.

No plano gratuito do Render, a API "dorme" depois de um tempo parada e a primeira pergunta pode
demorar cerca de 1 minuto. **No dia da apresentação, abra o assistente alguns minutos antes.**

## Frontend (exemplo: Vercel)

1. Novo projeto apontando para o repositório.
2. Configuração:
   - Build command: `npm run build`
   - Output directory: `frontend/dist`
3. Variável de ambiente: `VITE_API_URL` = endereço da API (sem `/` no final).
4. O site usa rotas como `/servicos`. O host precisa devolver o `index.html` para qualquer caminho:
   - **Netlify:** já resolvido pelo arquivo `frontend/public/_redirects`.
   - **Vercel:** crie um `vercel.json` na raiz com
     `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.
   - **GitHub Pages** não suporta isso direito. Prefira Vercel ou Netlify.

Depois de publicar, atualize o `CORS_ORIGIN` da API com o endereço final do site.

## Checklist antes de divulgar (QR Code na cartilha)

- [ ] `npm test` e `npm run build` passam.
- [ ] Todos os links de `servicos.js` foram conferidos (inclusive o e-Título).
- [ ] O assistente responde com base nos documentos do RAG.
- [ ] Testado em um celular de verdade, com letra A++ e no modo escuro.
- [ ] A chave da Groq não aparece em nenhum arquivo do repositório.
