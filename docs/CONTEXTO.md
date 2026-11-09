# Contexto do projeto

## O projeto de extensão

- **Título:** Inclusão Digital: Acesso aos Serviços Públicos Digitais
- **Curso:** Sistemas de Informação (com a área de Análise de Risco em TI), 5º período, 2º semestre de 2026
- **Orientadores:** Jean Da Silva Holguim e Luiz Wanderley Nagata Balduino
- **Comunidade atendida:** alunos do Ensino Médio (16 a 17 anos, em sua maioria) participantes do
  projeto de extensão, em Manaus (AM)
- **Objetivo geral:** promover a inclusão digital por meio da capacitação para o uso seguro e eficiente
  dos serviços públicos digitais, fortalecendo a cidadania e o acesso a direitos.
- **Entregas do semestre:** palestra com a dinâmica "Golpe ou Real?", materiais educativos
  e o resumo expandido apresentado na socialização de novembro. Este site é um dos materiais educativos.

## Quem usa o site

O diagnóstico feito no formulário do projeto mostrou que:

- os alunos usam bem o celular, mas para **redes sociais, jogos e conversa**, não para serviços públicos;
- muitos dependem **só do celular** para acessar a internet;
- há **medo de golpes** e de errar, o que gera insegurança e ansiedade;
- faltam **materiais simples, passo a passo**, sobre contas governamentais e navegação segura;
- os serviços mais úteis são os de **saúde** (Meu SUS Digital, vacinação), **educação** (ENEM, Pé-de-Meia),
  **trabalho** (Carteira de Trabalho Digital) e **documentos** (CPF, título de eleitor).

Por isso o site é **mobile first**, leve, com letra ampliável, linguagem simples e nenhum cadastro.

## Base teórica (os 5 eixos)

O conteúdo do Guia segue o roteiro teórico da apresentação, reescrito para os alunos:

| Eixo | Tema no site | Ideia central | Autores e leis de apoio |
| --- | --- | --- | --- |
| 1 | Inclusão digital | Ter acesso não basta; é preciso saber usar | Warschauer (2006), Hargittai (2002), Van Deursen e Helsper (2015), Soares (2002) |
| 2 | Serviços públicos digitais | O Estado foi para o digital; acesso virou condição de cidadania | Decreto 8.936/2016, Lei 14.129/2021, OCDE (2014) |
| 3 | Seus direitos e seus dados | O cidadão tem direitos também na internet | Marco Civil (Lei 12.965/2014), LGPD (Lei 13.709/2018), Ribble (2015), UNESCO (2024) |
| 4 | Segurança e golpes | Golpes exploram pessoas, não máquinas | ISO/IEC 27002, Mitnick e Simon (2003), Cialdini (2012), Cartilha CERT.br |
| 5 | Notícias falsas e bem-estar | Checar antes de compartilhar; usar a tecnologia com equilíbrio | Wardle e Derakhshan (2017), Vosoughi, Roy e Aral (2018), Wineburg e McGrew (2019) |

As referências completas estão no documento "Conteúdo Teórico" da equipe.

## Decisões tomadas (e por quê)

| Decisão | Motivo |
| --- | --- |
| Guia como aba principal; assistente e verificador como abas | Definido pela equipe: o Guia é a temática central |
| React + Vite em JavaScript | Escolha da equipe; JavaScript facilita para quem está aprendendo |
| Backend próprio (Express) para o assistente | Esconder a chave da API, rodar o RAG no servidor e não exigir que o celular do aluno baixe um modelo de vários GB (ver `ARQUITETURA.md`) |
| Llama via API compatível com OpenAI | Trocar entre Ollama (local), Groq (nuvem) ou outro provedor só mudando o `.env` |
| RAG com busca por palavras-chave por padrão | Funciona sem modelo extra; embeddings (`bge-m3`) são opcionais |
| Verificador de links 100% no navegador | Privacidade: o link suspeito nunca é aberto nem enviado a ninguém |
| Mascarar CPF, cartão e e-mail no front e no back | LGPD e ensino pelo exemplo: o próprio site protege os dados |
| Sem login, analytics ou cookies | Nada a proteger = nada a vazar; público menor de idade |
| Identidade visual própria (verde-azulado), sem logos do governo | Não imitar o gov.br, que é justamente o que ensinamos a desconfiar |
| Visual calmo e simples, com layout próprio para computador (2026-11-08) | O primeiro visual parecia "celular esticado" no computador; o público tem medo de errar, então nada pode gritar (ver `DESIGN.md`) |
| Site na Netlify e API no Render (sem Vercel) | Planos gratuitos; a equipe não consegue acessar a conta da Vercel (ver `DEPLOY.md`) |
| Links dos serviços conferidos com data (`conferidoEm`) | Endereços do governo mudam; a data mostra quando revisar |

## Situação e próximos passos

Atualizado em 2026-11-08. O novo design do frontend está pronto (ver `DESIGN.md`).

1. **Finalizar o frontend:** conferir à mão o link do e-Título (o site do TSE bloqueia conferência
   automática), fazer o título da aba do navegador mudar em cada página e testar num celular de verdade.
2. **Alimentar o RAG:** escrever os documentos em `backend/rag/documentos/` seguindo o `_MODELO.md` e
   rodar `npm run rag:ingest`.
3. Instalar o Ollama e o modelo Llama nos computadores da dupla, ou criar uma chave na Groq.
4. Testar o assistente com perguntas reais dos alunos (as dúvidas anotadas na palestra são ótimas).
5. Publicar o site na Netlify e a API no Render, e gerar um QR Code para a cartilha (ver `DEPLOY.md`).
