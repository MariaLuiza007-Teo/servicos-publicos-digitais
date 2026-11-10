# Guia do Cidadão Digital

Site do projeto de extensão **Inclusão Digital: Acesso aos Serviços Públicos Digitais** (Sistemas de
Informação, 2026.2).

| Aba | O que faz |
| --- | --- |
| **Guia do Cidadão** | Conteúdo em linguagem simples sobre inclusão digital, serviços públicos, direitos e dados, golpes e notícias falsas, mais um catálogo de serviços com links oficiais |
| **Qual serviço eu preciso?** | Assistente com IA open source (`gpt-oss-20b`, na Groq) que indica o serviço público certo e onde acessá-lo. A API fica em outro repositório: [servicos-publicos-digitais-backend](https://github.com/Alexandrediasss/servicos-publicos-digitais-backend) |
| **Esse link é oficial?** | Analisa um link ou SMS e mostra se o endereço é do governo e quais sinais de golpe ele tem |

## Como rodar no seu computador

Pré-requisitos: [Node.js](https://nodejs.org) 22 ou mais novo e [Git](https://git-scm.com).

```bash
npm install
```

```bash
npm run dev
```

Abra http://localhost:5173. Sem configurar nada, o assistente funciona em **modo de demonstração**
(sem IA), usando a API antiga em Node da pasta `backend/`.

Para testar com a IA de verdade, rode a API do repositório do backend (Python, porta 3001) e aqui rode
só o site:

```bash
npm run dev:web
```

Outros comandos:

```bash
npm test
```

```bash
npm run build
```

## Documentação

- [GUIA-DO-PROJETO.md](GUIA-DO-PROJETO.md): resumo do projeto, regras e estrutura (comece por aqui)
- [docs/CONTEXTO.md](docs/CONTEXTO.md): o projeto de extensão, o público e as decisões
- [docs/ARQUITETURA.md](docs/ARQUITETURA.md): como as partes se conectam
- [docs/ASSISTENTE-IA.md](docs/ASSISTENTE-IA.md): a API antiga em Node (só demonstração; a IA de verdade está no repo do backend)
- [docs/VERIFICADOR-LINKS.md](docs/VERIFICADOR-LINKS.md): regras do verificador de links
- [docs/CONTEUDO.md](docs/CONTEUDO.md): como escrever e editar o conteúdo
- [docs/COLABORACAO.md](docs/COLABORACAO.md): como trabalhar em dupla, cada um no seu computador
- [docs/DESIGN.md](docs/DESIGN.md): cores, letra, tamanhos de tela e peças visuais
- [docs/DEPLOY.md](docs/DEPLOY.md): como publicar (site na Netlify, API no Render)

> Este não é um site do governo. Os serviços citados são oficiais e gratuitos; confira sempre nos
> endereços que terminam em `.gov.br`.
