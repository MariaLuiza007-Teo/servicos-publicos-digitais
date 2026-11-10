# Guia do projeto — Guia do Cidadão Digital

Contexto para qualquer pessoa da equipe. Leia antes de mexer no projeto.
Detalhes de cada área ficam em `docs/` — os links estão no fim deste arquivo.

## O que é

Site do projeto de extensão universitária **"Inclusão Digital: Acesso aos Serviços Públicos Digitais"**
(curso de Sistemas de Informação, 5º período, 2026.2), feito para alunos do **Ensino Médio**
participantes do projeto. O público usa principalmente **celular**, muitas
vezes simples e com internet limitada, e tem pouca familiaridade com serviços digitais.

O site tem três abas:

1. **Guia do Cidadão** (aba principal, `/`, `/guia/:temaId`, `/servicos`) — conteúdo em linguagem simples
   sobre os 5 eixos do roteiro teórico do projeto + catálogo de serviços públicos com links oficiais.
2. **Qual serviço eu preciso?** (`/assistente`) — chat com IA open source (`gpt-oss-20b`, na Groq) + RAG
   que indica o serviço público certo e onde acessá-lo. A API dele fica em **outro repositório** (veja
   "Stack").
3. **Esse link é oficial?** (`/verificador`) — analisa um link ou SMS colado e explica se o endereço é do
   governo e quais sinais de golpe ele tem. Roda 100% no navegador.

## Stack

- **Frontend:** React 19 + Vite 8, JavaScript (sem TypeScript), React Router 7, `lucide-react` (ícones),
  `react-markdown` (respostas do chat). CSS puro em um arquivo (`frontend/src/styles/index.css`).
- **Backend oficial (API do assistente):** repositório separado **`servicos-publicos-digitais-backend`**,
  em Python + FastAPI: https://github.com/Alexandrediasss/servicos-publicos-digitais-backend. Lá ficam a
  IA, o prompt, o mascaramento no servidor e a base do RAG (documentos + índice). Ele segue o "Contrato
  da API" de `docs/ARQUITETURA.md` (cópia em `docs/CONTRATO-API.md` do backend).
- **IA:** Groq (plano gratuito) com `openai/gpt-oss-20b`, configurada no backend. Os modelos Llama não
  estão no plano gratuito da Groq ("model not found"), por isso a troca (2026-11-09).
- **Pasta `backend/` deste repositório:** é a **API antiga em Node** (Express). Não é mais a oficial: fica
  só para o `npm run dev` ter um assistente em modo demonstração e como referência. Não evolua o
  assistente aqui.
- **Monorepo** com npm workspaces (`frontend/`, `backend/`). Node >= 20.19 (testado no 24).

## Comandos (sempre na raiz `servicos-publicos-digitais/`)

```bash
npm install            # instala tudo (frontend + a API antiga em Node)
npm run dev            # site em http://localhost:5173 + API antiga (demonstração) em http://localhost:3001
npm run dev:web        # só o site em http://localhost:5173 (use com a API em Python, abaixo)
npm test               # testes do frontend e da API antiga (node:test)
npm run build          # build de produção do frontend (frontend/dist)
```

**Testar o site com a API oficial (Python):** em desenvolvimento, o site encaminha `/api` para
`http://localhost:3001`. Então rode a API do repositório do backend (`python -m app`, que já usa a porta
3001) e aqui rode **só** `npm run dev:web` (o `npm run dev` subiria a API antiga na mesma porta).

## Estrutura

```
servicos-publicos-digitais/
├── GUIA-DO-PROJETO.md, README.md
├── docs/                        # contexto detalhado (ler conforme a tarefa)
├── frontend/
│   └── src/
│       ├── main.jsx, App.jsx    # entrada e rotas
│       ├── components/          # Layout (cabeçalho, abas, rodapé), Callout, ExternalLink, icons
│       ├── pages/               # GuiaHome, TemaPage, ServicosPage, AssistentePage, VerificadorPage
│       ├── data/                # temas.js e servicos.js = TODO o conteúdo do Guia
│       ├── lib/                 # linkChecker.js, privacy.js, chatApi.js, linkify.js, usePageTitle.js (+ *.test.js)
│       └── styles/index.css
└── backend/                     # API ANTIGA em Node (só demonstração local; a oficial é o repo em Python)
    ├── .env.example
    ├── src/
    │   ├── server.js, config.js
    │   ├── routes/chat.js       # POST /api/chat (streaming SSE)
    │   ├── llm/                 # client.js (chat), embeddings.js
    │   ├── rag/                 # chunker, frontmatter, keyword (BM25), store, retriever
    │   ├── prompts/system.js    # instruções do assistente
    │   └── utils/privacy.js     # mascara CPF/cartão/e-mail
    ├── scripts/ingest.js
    └── rag/                     # vazio aqui: a base do RAG de verdade está no repo do backend
```

## Regras do projeto (não negociáveis)

1. **Linguagem simples** em todo texto visível: frases curtas, sem jargão, português do Brasil.
   O público são alunos do Ensino Médio. Termo técnico só se for explicado na mesma frase.
2. **Nenhum dado pessoal é coletado.** Sem cadastro, login, analytics ou cookies de rastreamento.
   CPF, cartão e e-mail são mascarados no frontend (`lib/privacy.js`) **e** no backend
   (`app/utils/privacy.py`, no repo do backend) antes de ir para a IA. As regras precisam ser iguais.
3. **Toda informação sobre serviço, lei ou prazo tem fonte oficial** (`.gov.br`, `.jus.br`, `.mil.br`,
   etc.). Antes de adicionar ou trocar um link, abra-o e confira. Registre a data em `conferidoEm`.
4. **Não imitar o gov.br.** Nada de logos, cores ou visual do governo. O rodapé deixa claro que o site
   não é oficial. (Ensinamos a desconfiar de sites que imitam o governo — não podemos ser um.)
5. **Chaves de API nunca no frontend nem no Git.** Ficam só no `.env` do backend (ignorado pelo Git) e no
   painel do Render.
6. **Bom no celular e no computador, e acessível:** alvo de toque ≥ 44px, foco visível, `aria-*`
   corretos, contraste AA, funciona com letra ampliada (controle A / A+ / A++). Teste em 375px e em
   1280px. Visual calmo e simples, com as regras de `docs/DESIGN.md`.
7. **O verificador de links nunca abre nem envia o link** para lugar nenhum. A análise é local.
8. **O assistente orienta, não executa serviços.** As regras de segurança do prompt
   (`app/prompts/system.py` no repo do backend, itens 3 a 7) não podem ser removidas.

## Convenções de código

- Código (variáveis, funções, arquivos de código) em **inglês**; conteúdo, comentários, mensagens de
  erro e textos de interface em **português**. Pastas de conteúdo em português (`documentos/`, `indice/`).
- Componentes React em `.jsx` (JSX só em `.jsx`); funções puras em `.js`. ESM em tudo (`import`/`export`).
- Exports nomeados (`export function X`), sem `export default` (exceto onde uma lib exige).
- Sem dependências novas sem necessidade — o site precisa carregar rápido em celular simples.
- Lógica pura (ex.: `linkChecker.js`, `chunker.js`) sempre com teste `*.test.js` ao lado (`node:test`).
- Formatação: 2 espaços, aspas simples, ponto e vírgula, vírgula final em listas multilinha.

## Tarefas comuns

- **Editar conteúdo do Guia:** `frontend/src/data/temas.js` / `servicos.js` → `docs/CONTEUDO.md`.
- **Alimentar o assistente (RAG), mudar o comportamento da IA, trocar modelo/provedor:** tudo no
  **repositório do backend** (`rag/documentos/`, `app/prompts/system.py`, `.env`). Nada muda aqui.
- **Mudar o que o site mostra no chat** (mensagens, fontes, links): `frontend/src/pages/AssistentePage.jsx`
  e `frontend/src/lib/chatApi.js`. Se mudar o formato da API, mude o contrato nos dois repositórios.
- **Melhorar o verificador:** listas no topo de `frontend/src/lib/linkChecker.js` + testes →
  `docs/VERIFICADOR-LINKS.md`.
- **Nova página:** criar em `pages/`, registrar rota em `App.jsx`; se for aba, em `TABS` no `Layout.jsx`.
- **Mudar o visual:** `frontend/src/styles/index.css` → `docs/DESIGN.md` (cores, tamanhos de tela, peças prontas).

Depois de qualquer mudança: `npm test` e `npm run build` precisam passar. Para mudanças visuais, siga a
lista "Antes de terminar uma mudança visual" do `docs/DESIGN.md` (celular, computador, modo escuro, A++).

## Situação atual (atualize ao terminar uma etapa)

- [x] Estrutura do site, 3 abas, conteúdo dos 5 temas e 15 serviços.
- [x] Backend em Node com streaming, RAG (BM25 + embeddings opcionais), modo mock, mascaramento de dados.
- [x] Novo design (2026-11-08): visual mais calmo e layout próprio para computador. Regras em `docs/DESIGN.md`.
- [x] **Frontend finalizado (2026-11-08):** todos os links oficiais conferidos (o do e-Título foi
      corrigido), título da aba muda em cada página, assistente com "Tentar conectar de novo" quando a API
      está fora do ar, teste do `privacy.js` do frontend (inclui conferir que front e back mascaram igual).
- [x] **Backend em Python (2026-11-09)**, em repositório separado, com os 13 documentos do RAG e a Groq.
      Testado junto com este site no computador: status "Assistente conectado", resposta aos poucos,
      "Fontes consultadas" e CORS funcionando.
- [x] Endereços soltos nas respostas da IA (`https://...`) viram links clicáveis (`lib/linkify.js`).
- [ ] **Próximo passo: publicar o site na Netlify.** Quem faz é a dona do repositório no GitHub; o passo
      a passo está em `docs/DEPLOY.md` (seção 1). Pode publicar antes da API.
- [ ] Testar o site publicado num celular de verdade (A++ e modo escuro).
- [ ] Publicar a API no Render (repo do backend, `docs/DEPLOY.md` de lá) e colocar o endereço dela em
      `VITE_API_URL` na Netlify (ver `docs/DEPLOY.md` daqui, seção 2).
- [ ] Decidir se a pasta `backend/` (API antiga em Node) sai deste repositório.

Hospedagem: site na **Netlify**, API no **Render**. A Vercel não será usada.

## Documentação

| Arquivo | Quando ler |
| --- | --- |
| `docs/CONTEXTO.md` | Entender o projeto de extensão, o público e as decisões tomadas |
| `docs/ARQUITETURA.md` | Como as partes conversam; por que existe backend; **contrato da API** |
| `docs/ASSISTENTE-IA.md` | A API antiga em Node (só demonstração). A IA de verdade está documentada no repo do backend |
| `docs/VERIFICADOR-LINKS.md` | Regras do verificador e como ampliá-las |
| `docs/CONTEUDO.md` | Como escrever e editar o conteúdo do Guia |
| `docs/DESIGN.md` | Cores, letra, tamanhos de tela e peças visuais; o que conferir após mudar o visual |
| `docs/COLABORACAO.md` | Setup em cada computador, Git e divisão de tarefas |
| `docs/DEPLOY.md` | Como publicar o site e a API |
