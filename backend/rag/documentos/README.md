# Documentos da base de conhecimento (RAG)

Esta pasta guarda os textos que o assistente "Qual serviço eu preciso?" usa para responder.
Ela está **vazia de propósito**: a alimentação da base é a próxima etapa do projeto.

## Como adicionar um documento

1. Copie `_MODELO.md` e renomeie sem o `_` (ex.: `enem.md`, `pe-de-meia.md`).
2. Preencha o cabeçalho (`titulo`, `fonte`, `categoria`, `atualizado_em`).
3. Escreva o texto em linguagem simples, dividido em seções `##`.
4. Na raiz do projeto, rode:

   ```bash
   npm run rag:ingest
   ```

5. A API recarrega o índice sozinha. Teste na aba "Qual serviço eu preciso?".

## Regras

- **Toda informação precisa de fonte oficial** no campo `fonte`. Sem fonte, não entra.
- **Um arquivo por serviço ou tema.** Arquivos menores dão respostas mais precisas.
- **Nada de dados pessoais**, prints com CPF ou informações de alunos.
- **Confira a data.** Prazos e regras mudam todo ano; atualize `atualizado_em`.
- Formatos aceitos: `.md` e `.txt`. Arquivos que começam com `_` e este README são ignorados.

## Documentos sugeridos para a primeira carga

| Arquivo | Assunto | Fonte oficial para consultar |
| --- | --- | --- |
| `conta-gov-br.md` | O que é a conta gov.br e os níveis bronze, prata e ouro | https://www.gov.br/governodigital/pt-br/identidade/conta-gov-br |
| `enem.md` | Inscrição, isenção e resultados | https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem |
| `sisu-prouni-fies.md` | Como usar a nota do ENEM | https://acessounico.mec.gov.br/sisu |
| `pe-de-meia.md` | Quem recebe e onde consultar | https://www.gov.br/mec/pt-br/pe-de-meia |
| `carteira-de-trabalho-digital.md` | Contratos, vagas e primeiro emprego | https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/carteira-de-trabalho |
| `meu-sus-digital.md` | Vacinação e histórico de saúde | https://meususdigital.saude.gov.br |
| `e-titulo.md` | Título de eleitor digital e voto aos 16 anos | https://www.tse.jus.br/servicos-eleitorais/servicos/aplicativo-e-titulo |
| `cpf.md` | Consultar e regularizar o CPF | https://www.gov.br/receitafederal/pt-br/assuntos/meu-cpf |
| `alistamento-militar.md` | Quem precisa e quando | https://alistamento.eb.mil.br |
| `cadunico.md` | Cadastro Único e programas sociais | https://www.gov.br/mds/pt-br/acoes-e-programas/cadastro-unico |
| `registrato-e-valores-a-receber.md` | Contas no seu nome e dinheiro esquecido | https://www.bcb.gov.br/meubc/registrato |
| `golpes-digitais.md` | Golpes comuns e o que fazer se cair | https://cartilha.cert.br |
| `atendimento-presencial-manaus.md` | PAC, CRAS e UBS em Manaus | Sites do Governo do Amazonas e da Prefeitura de Manaus |

O conteúdo das páginas do Guia (`frontend/src/data/temas.js` e `servicos.js`) também pode
ser adaptado para cá, já que já está em linguagem simples e com fontes.
