# Guia do projeto — Guia do Cidadão Digital

Contexto para qualquer pessoa da equipe. Leia antes de mexer no projeto.
Detalhes de cada área ficam em `docs/` — os links estão no fim deste arquivo.

## O que é

Site do projeto de extensão universitária **"Inclusão Digital: Acesso aos Serviços Públicos Digitais"**
(curso de Sistemas de Informação, 5º período, 2026.2), feito para alunos do **Ensino Médio e da EJA**
participantes do projeto. O público usa principalmente **celular**, muitas
vezes simples e com internet limitada, e tem pouca familiaridade com serviços digitais.

O site tem três abas:

1. **Guia do Cidadão** (aba principal, `/`, `/guia/:temaId`, `/servicos`) — conteúdo em linguagem simples
   sobre os 5 eixos do roteiro teórico do projeto + catálogo de serviços públicos com links oficiais.
2. **Qual serviço eu preciso?** (`/assistente`) — chat com IA open source (Llama) + RAG que indica o
   serviço público certo e onde acessá-lo.
3. **Esse link é oficial?** (`/verificador`) — analisa um link ou SMS colado e explica se o endereço é do
   governo e quais sinais de golpe ele tem. Roda 100% no navegador.

## Stack

- **Frontend:** React 19 + Vite 8, JavaScript (sem TypeScript), React Router 7, `lucide-react` (ícones),
  `react-markdown` (respostas do chat). CSS puro em um arquivo (`frontend/src/styles/index.css`).
- **Backend:** Node.js + Express 5 (ESM). Só existe por causa do assistente de IA.
- **IA:** qualquer provedor compatível com a API da OpenAI. Padrões: **Ollama** com `llama3.1:8b` (local)
  ou **Groq** com `llama-3.3-70b-versatile` (nuvem). Provedor `mock` para trabalhar sem IA.
- **RAG:** documentos Markdown em `backend/rag/documentos/` → `npm run rag:ingest` → índice JSON.
  Busca por palavras-chave (BM25, padrão) ou embeddings (`bge-m3` via Ollama).
- **Monorepo** com npm workspaces (`frontend/`, `backend/`). Node >= 20.19 (testado no 24).

## Comandos (sempre na raiz `guia-cidadao-digital/`)

```bash
npm install            # instala tudo (frontend + backend)
npm run dev            # site em http://localhost:5173 + API em http://localhost:3001
npm test               # testes do frontend e do backend (node:test)
npm run build          # build de produção do frontend (frontend/dist)
npm run rag:ingest     # (re)gera o índice do RAG a partir de backend/rag/documentos
npm run rag:ingest -- --sem-embeddings   # força busca por palavras-chave
```

Sem `backend/.env`, a API sobe em modo `mock` (respostas de demonstração). Para IA de verdade, copie
`backend/.env.example` para `backend/.env` — veja `docs/ASSISTENTE-IA.md`.

## Estrutura

```
guia-cidadao-digital/
├── GUIA-DO-PROJETO.md, README.md
├── docs/                        # contexto detalhado (ler conforme a tarefa)
├── frontend/
│   └── src/
│       ├── main.jsx, App.jsx    # entrada e rotas
│       ├── components/          # Layout (cabeçalho, abas, rodapé), Callout, ExternalLink, icons
│       ├── pages/               # GuiaHome, TemaPage, ServicosPage, AssistentePage, VerificadorPage
│       ├── data/                # temas.js e servicos.js = TODO o conteúdo do Guia
│       ├── lib/                 # linkChecker.js, privacy.js, chatApi.js (+ *.test.js)
│       └── styles/index.css
└── backend/
    ├── .env.example
    ├── src/
    │   ├── server.js, config.js
    │   ├── routes/chat.js       # POST /api/chat (streaming SSE)
    │   ├── llm/                 # client.js (chat), embeddings.js
    │   ├── rag/                 # chunker, frontmatter, keyword (BM25), store, retriever
    │   ├── prompts/system.js    # instruções do assistente
    │   └── utils/privacy.js     # mascara CPF/cartão/e-mail
    ├── scripts/ingest.js
    └── rag/
        ├── documentos/          # base de conhecimento (VAZIA de propósito; ver README.md da pasta)
        └── indice/indice.json   # gerado pelo ingest (commitar junto com os documentos)
```

## Regras do projeto (não negociáveis)

1. **Linguagem simples** em todo texto visível: frases curtas, sem jargão, português do Brasil.
   O público é Ensino Médio e EJA. Termo técnico só se for explicado na mesma frase.
2. **Nenhum dado pessoal é coletado.** Sem cadastro, login, analytics ou cookies de rastreamento.
   CPF, cartão e e-mail são mascarados no frontend (`lib/privacy.js`) **e** no backend
   (`utils/privacy.js`) antes de ir para a IA. Mantenha os dois arquivos iguais.
3. **Toda informação sobre serviço, lei ou prazo tem fonte oficial** (`.gov.br`, `.jus.br`, `.mil.br`,
   etc.). Antes de adicionar ou trocar um link, abra-o e confira. Registre a data em `conferidoEm`.
4. **Não imitar o gov.br.** Nada de logos, cores ou visual do governo. O rodapé deixa claro que o site
   não é oficial. (Ensinamos a desconfiar de sites que imitam o governo — não podemos ser um.)
5. **Chaves de API nunca no frontend nem no Git.** Ficam só em `backend/.env` (ignorado pelo Git).
6. **Mobile first e acessível:** alvo de toque ≥ 44px, foco visível, `aria-*` corretos, contraste AA,
   funciona com letra ampliada (controle A / A+ / A++). Teste em 375px de largura.
7. **O verificador de links nunca abre nem envia o link** para lugar nenhum. A análise é local.
8. **O assistente orienta, não executa serviços.** As regras de segurança do prompt
   (`backend/src/prompts/system.js`, itens 3 a 7) não podem ser removidas.

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
- **Alimentar o assistente (RAG):** `backend/rag/documentos/README.md` → `docs/ASSISTENTE-IA.md`.
- **Mudar o comportamento da IA:** `backend/src/prompts/system.js`.
- **Trocar modelo/provedor de IA:** só `backend/.env` (nenhum código muda).
- **Melhorar o verificador:** listas no topo de `frontend/src/lib/linkChecker.js` + testes →
  `docs/VERIFICADOR-LINKS.md`.
- **Nova página:** criar em `pages/`, registrar rota em `App.jsx`; se for aba, em `TABS` no `Layout.jsx`.

Depois de qualquer mudança: `npm test` e `npm run build` precisam passar. Para mudanças visuais, abra o
site em largura de celular (375px) e no modo escuro.

## Situação atual (atualize ao terminar uma etapa)

- [x] Estrutura do site, 3 abas, conteúdo dos 5 temas e 15 serviços (links conferidos em 2026-11-07,
      exceto e-Título — o site do TSE bloqueia verificação automática; conferir à mão).
- [x] Backend com streaming, RAG (BM25 + embeddings opcionais), modo mock, mascaramento de dados.
- [ ] **Próximo passo:** escrever os documentos do RAG (`backend/rag/documentos/`) e rodar o ingest.
- [ ] Instalar Ollama + Llama nos computadores da equipe (ou criar chave na Groq) e testar respostas reais.
- [ ] Publicar o site (ver `docs/DEPLOY.md`).

## Documentação

| Arquivo | Quando ler |
| --- | --- |
| `docs/CONTEXTO.md` | Entender o projeto de extensão, o público e as decisões tomadas |
| `docs/ARQUITETURA.md` | Como as partes conversam; por que existe backend |
| `docs/ASSISTENTE-IA.md` | Configurar Llama (Ollama/Groq), RAG, prompt, problemas comuns |
| `docs/VERIFICADOR-LINKS.md` | Regras do verificador e como ampliá-las |
| `docs/CONTEUDO.md` | Como escrever e editar o conteúdo do Guia |
| `docs/COLABORACAO.md` | Setup em cada computador, Git e divisão de tarefas |
| `docs/DEPLOY.md` | Como publicar o site e a API |
