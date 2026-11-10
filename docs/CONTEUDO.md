# Conteúdo do Guia

Todo o texto do Guia fica em dois arquivos. Os componentes só exibem o que está neles.

| Arquivo | O que tem | Aparece em |
| --- | --- | --- |
| `frontend/src/data/temas.js` | Os 5 temas (eixos do roteiro teórico) | `/` e `/guia/:id` |
| `frontend/src/data/servicos.js` | Categorias e os serviços públicos | `/servicos` e "Serviços mais procurados" na página inicial |

## Como escrever

- **Para quem:** um aluno do Ensino Médio, de 16 ou 17 anos, que usa pouco a internet para resolver serviços.
- **Frases curtas** (até 25 palavras), voz ativa, "você".
- **Sem jargão.** Se precisar de um termo técnico, explique na mesma frase:
  "engenharia social, que é enganar a pessoa em vez de invadir o celular".
- **Concreto:** exemplos reais ("Seu CPF será cancelado") em vez de abstrações.
- **Sem alarmismo:** o objetivo é dar confiança, não medo.
- **Sem passo a passo detalhado de telas** do gov.br e de aplicativos: as telas mudam com frequência.
  Explique o que o serviço faz e mande para o link oficial.

## Estrutura de um tema (`temas.js`)

```js
{
  id: 'seguranca-e-golpes',        // vira a URL /guia/seguranca-e-golpes (não mude depois de publicado)
  numero: 4,
  icone: 'ShieldAlert',            // nome do mapa em src/components/icons.jsx
  titulo: 'Segurança e golpes',
  subtitulo: 'Golpes enganam pessoas, não máquinas',
  resumo: '...',
  secoes: [
    {
      titulo: 'Os 4 sinais de golpe',
      paragrafos: ['...'],         // opcional
      itens: ['...', '...'],       // opcional: lista
      ordenada: true,              // opcional: lista numerada
      nota: '...',                 // opcional: observação em itálico
    },
  ],
  importante: 'Frase para lembrar (caixa verde)',
  acoes: [{ rotulo: 'Verificar um link suspeito', para: '/verificador' }],  // opcional
  fontes: [{ nome: 'Cartilha CERT.br', url: 'https://cartilha.cert.br' }],
}
```

## Estrutura de um serviço (`servicos.js`)

```js
{
  id: 'enem',                       // âncora: /servicos#enem
  nome: 'ENEM',
  categoria: 'educacao',            // educacao | trabalho | saude | cidadania | financas
  descricao: 'Uma frase sobre o que resolve.',
  paraQuem: 'Quem pode usar.',
  onde: { rotulo: 'ENEM no site do Inep', url: 'https://www.gov.br/inep/...' },
  app: 'Nome do aplicativo oficial',  // opcional
  cuidado: 'O golpe ou erro mais comum.',
  conferidoEm: '2026-11-07',        // data em que alguém abriu o link e conferiu (null = conferir)
  destaque: true,                   // opcional: aparece na página inicial
}
```

## Conferência de links

Antes de adicionar ou trocar um link:

1. Abra o endereço no navegador e confirme que a página existe e é oficial.
2. Prefira páginas estáveis do `gov.br` (página do serviço) a links profundos que mudam todo ano.
3. Atualize `conferidoEm`.

Situação em 2026-11-08: todos os links conferidos. O do e-Título estava quebrado (o TSE mudou a página)
e foi trocado pela página oficial do aplicativo. O site do TSE bloqueia conferência automática (responde
403 a scripts), então os links `.jus.br` precisam ser abertos à mão num navegador.

Para conferir todos de uma vez (na raiz do projeto):

```bash
grep -ohE "https://[^'\" )]+" frontend/src/data/*.js | sort -u | while read u; do echo "$(curl -s -o /dev/null -L --max-time 20 -A 'Mozilla/5.0' -w '%{http_code}' "$u") $u"; done
```

Qualquer código diferente de `200` merece uma olhada no navegador.

## Identidade visual

- Cores próprias (verde-azulado `#0b5d52`). **Não usar** as cores, a fonte, os logos ou o layout do gov.br.
  Todas as regras visuais estão em `docs/DESIGN.md`.
- O rodapé sempre diz que o site não é do governo.
- Ícones da biblioteca Lucide (https://lucide.dev/icons). Ícone novo citado no conteúdo → adicionar em
  `src/components/icons.jsx`.

## Reaproveitar no RAG

O texto dos temas e serviços já está em linguagem simples e com fonte. Ele pode virar documentos do RAG
(pasta `rag/documentos/` do **repositório do backend**). Se uma informação mudar (um link, uma regra),
atualize os dois lugares: `servicos.js` aqui e o documento correspondente lá.
