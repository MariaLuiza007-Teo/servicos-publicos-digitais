# Arquitetura

## Visão geral

```
 Celular / computador do aluno                       Servidor (API)                      Provedor de IA
┌─────────────────────────────────┐   /api/chat    ┌──────────────────────────────┐    ┌──────────────────┐
│ React (frontend/)               │ ─────────────▶ │ Express (backend/)           │ ─▶ │ Ollama (local) ou │
│                                 │  pergunta já   │ 1. valida e mascara dados    │    │ Groq (nuvem)      │
│ • Guia + Serviços (conteúdo     │  mascarada     │ 2. RAG: busca trechos em     │ ◀─ │ modelo Llama      │
│   estático em data/*.js)        │                │    rag/indice/indice.json    │    └──────────────────┘
│ • Verificador de links          │ ◀───────────── │ 3. monta o prompt            │
│   (roda só aqui, sem rede)      │  resposta aos  │ 4. repassa a resposta aos    │
│ • Chat do assistente            │  pedaços (SSE) │    pedaços                   │
└─────────────────────────────────┘                └──────────────────────────────┘
```

- **Guia, Serviços e Verificador** não precisam de servidor: são só React + dados em arquivos `.js`.
  Se a API cair, essas partes continuam funcionando.
- **Só o assistente** usa o backend.

## Por que o assistente precisa de backend (e não roda só no front)

Dá para rodar um Llama pequeno direto no navegador (ex.: WebLLM com WebGPU), mas para este público
**não é viável**:

1. **Peso:** até o menor Llama útil tem cerca de 1 a 2 GB. O aluno teria que baixar isso no celular,
   muitas vezes com plano de dados limitado.
2. **Aparelho:** precisa de WebGPU e bastante memória. Celulares simples não aguentam ou ficam muito lentos.
3. **Segredo:** com um provedor na nuvem (Groq), a chave da API ficaria exposta no código do site.
4. **RAG:** o índice e as regras ficam num lugar só, e atualizar a base não exige republicar o site.
5. **Controle:** o servidor limita abusos (20 perguntas por minuto por pessoa) e mascara dados pessoais
   mais uma vez antes de qualquer envio.

## Fluxo de uma pergunta

1. O aluno escreve. `maskSensitive` (front) troca CPF, cartão e e-mail por marcadores.
2. `POST /api/chat` com as últimas mensagens.
3. `routes/chat.js` valida, limita o tamanho e mascara de novo (`utils/privacy.js`).
4. `rag/retriever.js` busca os 4 trechos mais relevantes no índice:
   - **embeddings** (similaridade de cosseno), se o índice foi gerado com eles e o provedor responde;
   - senão, **BM25** (palavras-chave), em `rag/keyword.js`.
5. `prompts/system.js` junta regras + trechos (CONTEXTO) + conversa.
6. `llm/client.js` chama `/chat/completions` com `stream: true`.
7. A API manda para o front os eventos `meta` (fontes), `token` (texto), `done` ou `error`.
8. O front mostra o texto conforme chega e lista as fontes. Links que não terminam em `.gov.br` nas
   respostas ganham o selo "não é .gov.br", usando o mesmo código do verificador.

## Contrato da API (o que o frontend espera)

O frontend só conversa com a API por `frontend/src/lib/chatApi.js`, usando o endereço em `VITE_API_URL`.
**Qualquer backend** (o Node deste repositório ou um novo, em Python ou outra linguagem) funciona com o
site se seguir exatamente isto. Mudou o contrato? Mude o `chatApi.js` junto.

### `GET /api/health`

Diz se a API está no ar. Resposta `200` com JSON:

```json
{
  "ok": true,
  "llm": { "provider": "groq", "model": "llama-3.3-70b-versatile" },
  "rag": { "ready": true, "documents": 13, "chunks": 80, "createdAt": "2026-11-08T12:00:00Z", "retriever": "palavras-chave" }
}
```

O frontend usa `llm.provider` (se for `"mock"`, mostra "Modo de demonstração"), `llm.model` (aparece
na barra de status) e `rag.ready` (se `false`, mostra "base de conhecimento em construção"). Se a
chamada falhar ou não vier JSON, a aba mostra "Assistente fora do ar".

### `POST /api/chat`

Pedido (`Content-Type: application/json`), com as últimas mensagens da conversa (a última é sempre da
pessoa):

```json
{ "messages": [{ "role": "user", "content": "Vou fazer o ENEM. O que eu preciso?" }] }
```

- **Erro antes de responder** (pedido inválido, limite de uso etc.): status `4xx`/`5xx` com JSON
  `{ "error": "mensagem em português para mostrar à pessoa" }`. Limite de uso usa `429`.
- **Resposta normal:** status `200` com `Content-Type: text/event-stream` (Server-Sent Events). Cada
  evento é `event: NOME`, `data: JSON` e uma linha em branco, nesta ordem:

  | Evento | `data` | Quando |
  | --- | --- | --- |
  | `meta` | `{ "sources": [{ "title": "ENEM", "url": "https://www.gov.br/inep/...", "category": "educacao" }], "retrieval": "palavras-chave", "ragReady": true, "masked": [] }` | Uma vez, antes do texto. `sources` vira a lista "Fontes consultadas" |
  | `token` | `{ "text": "pedaço da resposta" }` | Várias vezes, conforme o modelo escreve (texto em Markdown) |
  | `done` | `{}` | Fim normal |
  | `error` | `{ "message": "mensagem em português" }` | Fim com erro no meio da resposta |

  Exemplo do que passa pela rede:

  ```
  event: meta
  data: {"sources":[],"retrieval":"sem-base","ragReady":false,"masked":[]}

  event: token
  data: {"text":"Para o ENEM, "}

  event: done
  data: {}
  ```

### Obrigações de qualquer backend

- **CORS:** aceitar chamadas do endereço do site publicado (ex.: `https://guia-cidadao-digital.netlify.app`)
  e de `http://localhost:5173` em desenvolvimento.
- **Mascarar de novo** CPF, cartão e e-mail antes de enviar à IA, com as mesmas regras de
  `backend/src/utils/privacy.js` (o frontend já mascara, mas o backend não pode confiar nisso).
- **Não gravar** o conteúdo das perguntas em log nem em banco.
- **Manter as regras de segurança do prompt** (`backend/src/prompts/system.js`, itens 3 a 7).
- **Chave da IA só no servidor**, em variável de ambiente.
- Limitar tamanho: até 1000 caracteres por mensagem e as 8 últimas mensagens.

## Por que essas escolhas técnicas

- **Formato OpenAI** (`/chat/completions`): Ollama, Groq, OpenRouter, Together e outros aceitam. Trocar de
  provedor é mudar três variáveis no `.env`.
- **Server-Sent Events:** respostas de modelos locais demoram; mostrar o texto aos poucos evita a
  impressão de que travou.
- **Índice em JSON:** a base é pequena (dezenas de documentos). Um banco vetorial seria exagero.
- **Sem banco de dados:** o site não guarda nada de ninguém.
