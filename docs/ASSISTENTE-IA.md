# Assistente "Qual serviço eu preciso?" — IA e RAG

O assistente usa um modelo **Llama** (open source, da Meta) e uma base de conhecimento própria (RAG).
Toda a configuração fica em `backend/.env`. Nenhum código muda para trocar de modelo ou provedor.

```bash
cp backend/.env.example backend/.env
```

(No Windows sem Git Bash, copie o arquivo pelo Explorer e renomeie para `.env`.)

## 1. Escolha onde o Llama vai rodar

| Opção | `LLM_PROVIDER` | Modelo padrão | Bom para | Cuidados |
| --- | --- | --- | --- | --- |
| Demonstração | `mock` | — | Mexer no visual sem IA | Não responde de verdade |
| No seu computador | `ollama` | `llama3.1:8b` | Desenvolver e testar de graça, sem internet | Precisa de ~8 GB de RAM livres; sem placa de vídeo é lento (10 a 60 s por resposta) |
| Na nuvem | `groq` | `llama-3.3-70b-versatile` | Respostas mais inteligentes e rápidas; site publicado | Precisa de chave; plano gratuito tem limite de uso; as perguntas vão para um serviço de terceiros |
| Outro provedor | `custom` | você define | OpenRouter, Together etc. | Preencha `LLM_BASE_URL`, `LLM_MODEL` e `LLM_API_KEY` |

**Qual Llama é o "mais inteligente"?** O Llama 3.3 70B (via Groq) é bem melhor em português e em
seguir regras do que o 8B. Ele não roda em notebook comum (precisa de dezenas de GB de memória), por isso
usamos o 8B localmente e o 70B na nuvem. Os nomes de modelos mudam com o tempo: confira a lista do
provedor e ajuste `LLM_MODEL` se precisar.

### Opção A: Ollama (local)

1. Instale o Ollama: https://ollama.com/download
2. Baixe o modelo (cerca de 5 GB, só na primeira vez):

   ```bash
   ollama pull llama3.1:8b
   ```

   Computador mais fraco? Use `llama3.2:3b` (cerca de 2 GB) e coloque `LLM_MODEL=llama3.2:3b` no `.env`.
3. No `backend/.env`: `LLM_PROVIDER=ollama`.
4. Rode `npm run dev`. O terminal da API deve mostrar `LLM: ollama (llama3.1:8b)`.

O Ollama precisa estar aberto (ícone perto do relógio no Windows). Ele atende em `http://localhost:11434`.

### Opção B: Groq (nuvem)

1. Crie uma conta e uma chave em https://console.groq.com/keys
2. No `backend/.env`:

   ```
   LLM_PROVIDER=groq
   LLM_API_KEY=cole_a_chave_aqui
   ```

3. Rode `npm run dev`.

**Nunca** coloque a chave no frontend, em print ou no Git. Se ela vazar, apague-a no painel da Groq e
crie outra.

## 2. RAG: a base de conhecimento

RAG (Retrieval-Augmented Generation) = antes de responder, o sistema **busca trechos** nos nossos
documentos e manda para o modelo junto com a pergunta. Assim a IA responde com base em informação
conferida, e não só no que "lembra".

```
backend/rag/documentos/*.md  ──(npm run rag:ingest)──▶  backend/rag/indice/indice.json  ──▶  API
```

### Situação atual

A pasta `backend/rag/documentos/` está **vazia de propósito** (só tem `README.md` e `_MODELO.md`).
O pipeline está pronto e testado; falta escrever os documentos. Enquanto isso, o assistente responde
só com orientações gerais e mostra "base de conhecimento em construção".

### Como alimentar (passo a passo)

1. Leia `backend/rag/documentos/README.md`. Lá estão as regras e a **lista de documentos sugeridos**,
   com a fonte oficial de cada um.
2. Para cada serviço ou tema, copie `_MODELO.md` para um arquivo novo (ex.: `enem.md`) e preencha.
3. Gere o índice:

   ```bash
   npm run rag:ingest
   ```

4. Com a API rodando, o índice recarrega sozinho. Teste no site.
5. Faça commit dos documentos **e** do `indice.json`.

### Busca por palavras-chave ou por significado?

| `EMBEDDINGS_PROVIDER` | Como busca | Precisa de |
| --- | --- | --- |
| `none` (padrão) | Palavras-chave (BM25), ignorando acentos e plural | Nada |
| `ollama` | Significado (embeddings `bge-m3`, que entende português) | `ollama pull bge-m3` (cerca de 1,2 GB) |

Com embeddings, "quero ver se tomei a vacina" encontra o documento do Meu SUS Digital mesmo sem a
palavra "vacinação". Para usar, coloque `EMBEDDINGS_PROVIDER=ollama` no `.env` e rode o ingest de novo.
Se o servidor de embeddings não responder na hora da pergunta, a API volta sozinha para palavras-chave.

Importante: o índice guarda qual modelo de embeddings foi usado. Trocou o modelo → rode o ingest de novo.

### Dicas para documentos que funcionam bem

- **Um assunto por arquivo** e seções `##` curtas. O ingest corta o texto em trechos de ~900 caracteres
  por seção.
- Escreva as **palavras que os alunos usariam** ("vacina", "trabalho", "título de eleitor"), não só os
  nomes oficiais.
- Coloque o **endereço oficial** no texto e no campo `fonte`.
- Nada de informação sem fonte. A IA vai repetir o que estiver no documento.

## 3. O prompt (instruções da IA)

Fica em `backend/src/prompts/system.js`. Resumo das regras:

1. Português simples, respostas curtas.
2. Usar o CONTEXTO (RAG) como fonte; se não souber, dizer que não sabe e indicar o gov.br ou o atendimento
   presencial. **Nunca inventar** sites, valores, prazos ou regras.
3. Só indicar endereços do contexto ou terminados em `.gov.br`, `.jus.br`, `.leg.br`, `.mp.br`, `.mil.br`, `.def.br`.
4. Nunca pedir CPF, senha, código ou cartão.
5. Alertar sobre golpes e indicar a aba "Esse link é oficial?".
6. Deixar claro que é um orientador, não um órgão do governo.

Pode ajustar o tom e o formato, mas **mantenha as regras de segurança**.

## 4. Privacidade

- CPF, número de cartão e e-mail são trocados por marcadores **no navegador** e de novo **na API**.
- A API não grava conversas nem registra o conteúdo das perguntas nos logs.
- Com Groq ou outro provedor na nuvem, a pergunta (já mascarada) é processada por esse serviço. Com
  Ollama, nada sai do computador.

## 5. Problemas comuns

| Sintoma | Causa provável | O que fazer |
| --- | --- | --- |
| "Assistente fora do ar no momento" | A API não está rodando | Rode `npm run dev` na raiz e veja se o terminal mostra `[api]` |
| "O assistente está indisponível agora" | O provedor de IA não respondeu | Ollama: abra o app e confira `ollama list`. Groq: confira a chave e o limite de uso |
| Resposta demora muito | Modelo local em CPU | Use `llama3.2:3b` ou a Groq |
| "Muitas perguntas em pouco tempo" | Limite de 20 por minuto | Espere um minuto ou ajuste `RATE_LIMIT_PER_MINUTE` |
| A IA não usa os documentos | Índice vazio ou desatualizado | Rode `npm run rag:ingest` e confira `http://localhost:3001/api/health` |
| Erro no ingest com embeddings | Ollama fechado ou `bge-m3` não baixado | `ollama pull bge-m3` ou `npm run rag:ingest -- --sem-embeddings` |
| A API cai ao iniciar com "Configuração do LLM incompleta" | Faltou variável no `.env` | Leia a mensagem: ela diz qual variável falta |
