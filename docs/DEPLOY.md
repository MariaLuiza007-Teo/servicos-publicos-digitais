# Publicação

O site tem duas partes, que ficam em lugares diferentes e podem ser publicadas em momentos diferentes:

| Parte | O que é | Onde hospedar (plano gratuito) | Quem publica |
| --- | --- | --- | --- |
| Frontend | O site (Guia, Serviços, Verificador e a tela do assistente) | **Netlify** | A dona do repositório no GitHub |
| API | O servidor do assistente de IA | **Render** (ou outro que rode Node ou Python) | Quem cuidar do backend |

Guia, Serviços e Verificador funcionam **só com o frontend**. A API só é necessária para o assistente.
Por isso dá para publicar o site **agora** e ligar o assistente depois.

> **Vercel não será usada** (a equipe não consegue acessar a conta).

## 1. Publicar o site na Netlify (primeiro)

Precisa ser feito pela **dona do repositório** (`MariaLuiza007-Teo/servicos-publicos-digitais`), porque
a Netlify pede permissão para ler o repositório no GitHub.

1. Entre em https://app.netlify.com com a conta do GitHub (botão **Sign up / Log in with GitHub**).
2. Clique em **Add new site → Import an existing project → GitHub** e autorize a Netlify.
3. Escolha o repositório `servicos-publicos-digitais`.
4. Em **Branch to deploy**, escolha `main`. A Netlify publica de novo sozinha **toda vez que algo entra
   na `main`**. Mudanças que ainda estão em outros branches não aparecem no site.
5. Não precisa preencher mais nada: o arquivo `netlify.toml` na raiz já diz o comando de build
   (`npm run build`), a pasta publicada (`frontend/dist`) e a versão do Node (22).
6. Clique em **Deploy**. Em 1 a 2 minutos o site fica no ar num endereço como
   `https://nome-aleatorio.netlify.app`.
7. Para trocar o nome: **Site configuration → Change site name** (ex.: `guia-cidadao-digital`, que vira
   `https://guia-cidadao-digital.netlify.app`).

### E o assistente, enquanto não existe API?

Deixe a variável `VITE_API_URL` **sem configurar**. A aba "Qual serviço eu preciso?" mostra "Assistente
fora do ar no momento", um botão "Tentar conectar de novo" e links para o catálogo e os temas. O resto
do site funciona normalmente.

Quando a API estiver publicada:

1. Na Netlify: **Site configuration → Environment variables → Add a variable**:
   `VITE_API_URL` = endereço da API, **sem `/` no final** (ex.: `https://guia-api.onrender.com`).
2. **Deploys → Trigger deploy → Deploy site**. A variável só vale depois de um novo deploy.
3. Na API, coloque o endereço do site em `CORS_ORIGIN` (senão o navegador bloqueia as chamadas).

### Conferir depois de publicar

- [ ] Abrir o site no celular e no computador.
- [ ] Abrir direto `https://SEU-SITE.netlify.app/servicos` e recarregar a página: não pode dar 404 (quem
      resolve isso é o arquivo `frontend/public/_redirects`).
- [ ] Clicar em "Acessar" de alguns serviços: abre o site oficial em outra aba.
- [ ] Verificador: testar o exemplo "SMS de golpe".

## 2. Publicar a API (depois)

A API oficial é o repositório em Python
**https://github.com/Alexandrediasss/servicos-publicos-digitais-backend**. O passo a passo de publicação
dela no Render está no `docs/DEPLOY.md` **de lá**. Daqui, só precisa de duas coisas:

1. Depois que a API estiver no ar, colocar o endereço dela em `VITE_API_URL` na Netlify e fazer um novo
   deploy (seção 1, "E o assistente, enquanto não existe API?").
2. No Render, a variável `CORS_ORIGIN` da API precisa ter o endereço do site na Netlify.

Teste: `https://SUA-API/api/health` deve responder `"ok": true`, e a aba do assistente deve mostrar
"Assistente conectado · openai/gpt-oss-20b".

**No dia da apresentação:**

- No plano gratuito do Render, a API "dorme" depois de um tempo parada e a primeira pergunta pode
  demorar cerca de 1 minuto. Abra o assistente alguns minutos antes.
- O plano gratuito da Groq aguenta poucas perguntas por minuto **no site todo** (o backend mediu cerca
  de 6 por minuto). Se a turma inteira perguntar ao mesmo tempo, parte vai ver "O assistente está
  indisponível agora". Combine de testar em grupos ou com poucas pessoas por vez.

(A pasta `backend/` deste repositório é a API antiga em Node. Ela também segue o contrato e pode ser
publicada no Render com Build `npm install` e Start `npm run start:api`, mas não é a oficial.)

## Alternativa: site no Render (mesma conta da API)

1. **New → Static Site** apontando para o repositório.
2. Build command: `npm install && npm run build`. Publish directory: `frontend/dist`.
3. Variável de ambiente `VITE_API_URL`, como na Netlify.
4. Em **Redirects/Rewrites**, adicione: Source `/*`, Destination `/index.html`, Action **Rewrite**.
   (O Render não lê o arquivo `_redirects`.)

**GitHub Pages** não devolve o `index.html` para outras rotas. Prefira Netlify ou Render.

## Problemas comuns

| Sintoma | O que fazer |
| --- | --- |
| Build falha na Netlify falando de versão do Node | Confira se o `netlify.toml` está na raiz da `main` (ele fixa o Node 22) |
| `/servicos` dá 404 ao recarregar | O arquivo `frontend/public/_redirects` precisa estar na `main` |
| Mudei o código e o site não mudou | A Netlify publica a `main`. A mudança já entrou na `main`? Veja em **Deploys** se o último deu certo |
| Assistente sempre "fora do ar" com a API publicada | `VITE_API_URL` certo e sem `/` no final? Fez um novo deploy depois de criar a variável? `CORS_ORIGIN` da API tem o endereço do site? |

## Checklist antes de divulgar (QR Code na cartilha)

- [ ] `npm test` e `npm run build` passam.
- [ ] Links de `servicos.js` conferidos (situação em `docs/CONTEUDO.md`).
- [ ] Testado em um celular de verdade, com letra A++ e no modo escuro.
- [ ] Assistente: responde com base nos documentos do RAG, **ou** a aba mostra "fora do ar" de forma clara.
- [ ] Nenhuma chave de API aparece em arquivo do repositório.
