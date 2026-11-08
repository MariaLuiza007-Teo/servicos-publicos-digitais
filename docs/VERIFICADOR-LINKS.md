# Verificador "Esse link é oficial?"

Código: `frontend/src/lib/linkChecker.js` (lógica) e `frontend/src/pages/VerificadorPage.jsx` (tela).
Testes: `frontend/src/lib/linkChecker.test.js`.

## Princípios

- **Educativo:** além do veredito, explica cada parte do endereço ("anatomia") e cada sinal encontrado,
  para o aluno aprender a conferir sozinho.
- **Local:** o link nunca é aberto, baixado ou enviado. Só o texto do endereço é analisado.
- **Honesto:** um site que não é `.gov.br` não é automaticamente golpe (pode ser uma loja ou um jornal).
  O verificador diferencia "não é do governo" de "tem sinais de golpe".

## Como funciona

1. `extractUrls(texto)` acha os links dentro de uma mensagem colada inteira (até 5 por análise).
2. `analyzeUrl(link)` usa a API `URL` do navegador para separar as partes do endereço. Ela converte letras
   de outros alfabetos em `xn--`, o que ajuda a detectar imitações.
3. Cada regra adiciona um "check" com nível `danger`, `warn`, `ok` ou `info`.
4. O veredito sai dos checks:

| Veredito | Quando | Cor |
| --- | --- | --- |
| `perigo` | Qualquer check `danger` | vermelho |
| `oficial` | Termina em final oficial e nenhum `danger` | verde |
| `atencao` | Não é oficial e tem algum `warn` | amarelo |
| `nao-oficial` | Não é oficial e não tem sinais de risco | azul |

## Regras atuais

| Regra | Nível | Exemplo |
| --- | --- | --- |
| Termina em `.gov.br`, `.jus.br`, `.leg.br`, `.mp.br`, `.mil.br` ou `.def.br` | ok | `meususdigital.saude.gov.br` |
| `@` no endereço (o que vem antes é ignorado) | danger | `www.gov.br@golpe.com` |
| Endereço é um número (IP) | danger | `http://192.168.0.10/pix` |
| Letras de outro alfabeto (`xn--`) | danger | `gоv.br` com "o" cirílico |
| Link encurtado | danger | `bit.ly/...` |
| "gov.br" no meio, não no final | danger | `www.gov.br.atualizacao.site` |
| Imita nome de órgão (gov, receita, inss, cpf, enem, caixa...) | danger | `gov-br.regulariza-cpf.site` |
| Final barato e comum em golpes (`.xyz`, `.site`, `.online`...) | warn | `algo.online` |
| Palavras de isca (login, regulariza, bloqueio, prêmio, taxa...) | warn | `.../resgate-premio` |
| Muitos hífens no nome | warn | `atualiza-cadastro-cpf.com` |
| Endereço muito comprido (5 partes ou mais) | warn | `a.b.c.d.com` |
| Porta no endereço | warn | `site.com:8080` |
| `http` sem cadeado | warn (info se oficial) | `http://...` |

Nomes curtos (até 4 letras, como `sus`, `mec`, `pis`) só contam como imitação quando são uma **palavra
inteira** do endereço. Assim `mecanicadojoao.com.br` não é acusado, mas `sus-agendamento.com` é.

## Como ampliar

As listas ficam no topo de `linkChecker.js`:

- `OFFICIAL_SUFFIXES`: finais reservados a órgãos públicos.
- `SHORTENERS`: encurtadores de link.
- `SUSPICIOUS_TLDS`: finais suspeitos.
- `IMPERSONATED_NAMES`: nomes que golpistas imitam (sem acento, minúsculo).
- `BAIT_WORDS`: palavras de isca (pode ser só o começo da palavra, ex.: `regulariz`).

Sempre que mudar uma regra:

1. Adicione um caso em `linkChecker.test.js` (um que deve pegar e um que **não** deve pegar).
2. Rode `npm test`.
3. Teste os exemplos da tela (`EXEMPLOS` em `VerificadorPage.jsx`).

Fonte boa para novos casos: golpes reais relatados na palestra (sem dados pessoais) e a
[Cartilha de Segurança do CERT.br](https://cartilha.cert.br).

## Limitações (dizer isso na apresentação também)

- Não sabe se um site **não oficial** é confiável. Só aponta sinais.
- Não detecta golpes que não usam link (ligação, áudio, pedido de Pix por mensagem).
- Um link oficial verdadeiro pode vir numa mensagem falsa que pede para você ligar ou responder.
  Por isso a dica continua: **digite o endereço você mesmo**.
