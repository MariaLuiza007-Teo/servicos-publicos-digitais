# Trabalhando em dupla (cada um no seu computador)

## 1. Primeira vez em cada computador

Instale:

- **Node.js 22 ou mais novo:** https://nodejs.org (versão LTS)
- **Git:** https://git-scm.com
- **Ollama** (opcional, para o Llama local): https://ollama.com/download

Depois, baixe o projeto do GitHub (repositório: https://github.com/MariaLuiza007-Teo/servicos-publicos-digitais):

```bash
git clone https://github.com/MariaLuiza007-Teo/servicos-publicos-digitais.git
```

```bash
cd servicos-publicos-digitais
```

```bash
npm install
```

```bash
npm run dev
```

Abra http://localhost:5173. Para ligar a IA, crie o `backend/.env` (veja `docs/ASSISTENTE-IA.md`).
**Cada pessoa tem o seu `.env`.** Ele não vai para o Git.

## 2. Repositório no GitHub

O repositório já existe: https://github.com/MariaLuiza007-Teo/servicos-publicos-digitais (público).
A dona do repositório convida a outra pessoa em **Settings → Collaborators → Add people**. Sem esse
convite aceito, a outra pessoa consegue baixar o código, mas não consegue enviar mudanças (push).

Como o repositório é público, qualquer pessoa pode ler o código. Por isso a regra de nunca commitar o
`backend/.env` (com a chave da IA) é ainda mais importante.

## 3. Rotina de trabalho

Antes de começar qualquer coisa:

```bash
git pull
```

Para cada tarefa, crie um branch:

```bash
git switch -c rag/documentos-educacao
```

Ao terminar: `npm test`, `npm run build`, commit e push do branch. Abra um Pull Request e peça para a
outra pessoa olhar antes de juntar na `main`.

Nomes de branch sugeridos: `conteudo/...`, `rag/...`, `assistente/...`, `verificador/...`, `visual/...`.
Mensagens de commit em português, curtas e no imperativo: "Adiciona documento do ENEM ao RAG".

## 4. Como dividir para não dar conflito

Conflito acontece quando os dois mexem nas mesmas linhas do mesmo arquivo. Combinem quem cuida de quê:

| Frente | Arquivos principais |
| --- | --- |
| Base de conhecimento (RAG) | `backend/rag/documentos/*.md`, `backend/rag/indice/indice.json` |
| Assistente (IA, prompt, chat) | `backend/src/**`, `frontend/src/pages/AssistentePage.jsx`, `frontend/src/lib/chatApi.js` |
| Conteúdo do Guia | `frontend/src/data/temas.js`, `frontend/src/data/servicos.js` |
| Verificador de links | `frontend/src/lib/linkChecker.js` (+ teste), `frontend/src/pages/VerificadorPage.jsx` |
| Visual e acessibilidade | `frontend/src/styles/index.css`, `frontend/src/components/**` |

Dicas:

- **RAG:** cada pessoa escreve arquivos `.md` diferentes. O `indice.json` é gerado: se der conflito nele,
  aceite qualquer versão e rode `npm run rag:ingest` de novo antes de commitar.
- **`temas.js` / `servicos.js`:** só uma pessoa edita cada arquivo por vez.
- O `package-lock.json` muda quando alguém instala uma dependência. Avise a outra pessoa para rodar
  `npm install` depois do `git pull`.

## 5. Arquivos de contexto

- O `GUIA-DO-PROJETO.md` (raiz) e os `LEIA-ME.md` de `frontend/` e `backend/` resumem as regras, a
  estrutura e a situação do projeto. Leia antes de começar.
- Se uma regra ou decisão mudar, atualize esses arquivos no mesmo commit da mudança.
- Ao terminar uma etapa, atualize a seção "Situação atual" do `GUIA-DO-PROJETO.md` e os "Próximos
  passos" de `docs/CONTEXTO.md`. Assim a outra pessoa sabe onde o projeto parou.
- Configurações pessoais do seu editor e das suas ferramentas ficam fora do repositório.

## 6. Padrões que valem para os dois

- 2 espaços, aspas simples, ponto e vírgula. O `.editorconfig` ajuda o editor a seguir isso.
- O `.gitattributes` mantém as quebras de linha iguais no Windows e em outros sistemas.
- Não commitar: `.env`, `node_modules/`, `dist/`, prints com dados pessoais.
