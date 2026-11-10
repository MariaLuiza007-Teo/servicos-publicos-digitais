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
| Backend próprio para o assistente | Esconder a chave da API, rodar o RAG no servidor e não exigir que o celular do aluno baixe um modelo de vários GB (ver `ARQUITETURA.md`) |
| Backend em Python (FastAPI) num repositório separado (2026-11-09) | Escolha da equipe. Fica em https://github.com/Alexandrediasss/servicos-publicos-digitais-backend e segue o "Contrato da API" de `ARQUITETURA.md`, então o site não precisou mudar. A pasta `backend/` (Node) daqui ficou só para demonstração |
| IA `openai/gpt-oss-20b` na Groq, em vez de Llama (2026-11-09) | Os modelos Llama dão "model not found" no plano gratuito da Groq. O gpt-oss também é open source (Apache 2.0) e responde bem em português. API compatível com OpenAI: trocar de provedor é só mudar o `.env` do backend |
| RAG com busca por palavras-chave por padrão | Funciona sem modelo extra; embeddings (`bge-m3`) são opcionais |
| Verificador de links 100% no navegador | Privacidade: o link suspeito nunca é aberto nem enviado a ninguém |
| Mascarar CPF, cartão e e-mail no front e no back | LGPD e ensino pelo exemplo: o próprio site protege os dados |
| Sem login, analytics ou cookies | Nada a proteger = nada a vazar; público menor de idade |
| Identidade visual própria (verde-azulado), sem logos do governo | Não imitar o gov.br, que é justamente o que ensinamos a desconfiar |
| Visual calmo e simples, com layout próprio para computador (2026-11-08) | O primeiro visual parecia "celular esticado" no computador; o público tem medo de errar, então nada pode gritar (ver `DESIGN.md`) |
| Site na Netlify e API no Render (sem Vercel) | Planos gratuitos; a equipe não consegue acessar a conta da Vercel (ver `DEPLOY.md`) |
| Links dos serviços conferidos com data (`conferidoEm`) | Endereços do governo mudam; a data mostra quando revisar |

## Situação e próximos passos

Atualizado em 2026-11-09. **O frontend está finalizado** e o **backend em Python está pronto** no
repositório dele (13 documentos no RAG, IA na Groq). Os dois foram testados juntos no computador.

1. **Publicar o site na Netlify.** Feito pela dona do repositório no GitHub, seguindo `DEPLOY.md`
   (seção 1). O site pode ir ao ar antes do assistente: a aba dele mostra "fora do ar" de forma clara.
2. **Publicar a API no Render** (passo a passo no repositório do backend) e ligar os dois:
   `VITE_API_URL` na Netlify e `CORS_ORIGIN` no Render (`DEPLOY.md`, seção 2).
3. Testar o site publicado num celular de verdade, com perguntas reais dos alunos, e gerar o QR Code
   para a cartilha.
4. Decidir se a pasta `backend/` (API antiga em Node) sai deste repositório.
