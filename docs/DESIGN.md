# Design do site

Como o site deve parecer e por quê. Leia antes de mexer em `frontend/src/styles/index.css` ou no
layout de uma página.

## A ideia

**Simples, calmo e confiável.** O público tem medo de errar e de cair em golpe. O visual não pode
gritar: fundo claro, bastante espaço, uma cor de destaque só e nada piscando.

- Funciona bem **no celular e no computador**. O celular é a base; o computador aproveita a largura
  com colunas, em vez de só esticar a versão de celular.
- Identidade própria. **Nada de cores, fontes, logos ou layout do gov.br**: ensinamos a desconfiar de
  sites que imitam o governo, então não podemos ser um.

## Cores

Todas ficam em variáveis no topo do `index.css`. **Nunca use uma cor solta** no CSS: use a variável.
O modo escuro troca os valores das mesmas variáveis (`@media (prefers-color-scheme: dark)`).

| Variável | Claro | Para quê |
| --- | --- | --- |
| `--bg` | `#f7f7f4` | Fundo da página (branco quente) |
| `--surface` | `#ffffff` | Cartões, cabeçalho, campos |
| `--surface-2` | `#f0f2ef` | Fundos discretos (código, etiquetas, hover) |
| `--text` / `--text-muted` | `#1c2321` / `#57625e` | Texto principal / texto de apoio |
| `--border` / `--border-strong` | `#e2e5e1` / `#c9cfca` | Linhas finas / bordas de botões e campos |
| `--primary` | `#0b5d52` | A cor do site (verde-azulado): botões, links, item ativo |
| `--primary-soft` | `#e5f0ec` | Fundo suave do destaque (aba ativa, "Regra de ouro") |
| `--accent` | `#b45309` | Só o contorno de foco do teclado |
| `--ok`, `--info`, `--alerta`, `--perigo` (+ `-bg`) | | Avisos e resultado do verificador |

Regras:

- Verde-azulado é a **única** cor de destaque. As cores de aviso (`ok`, `alerta`, `perigo`) só aparecem
  quando têm significado (golpe, cuidado, deu certo).
- Contraste mínimo AA. Mudou uma cor? Confira nos dois modos.

## Letra

- Fonte do sistema (`system-ui`): não baixa nada e carrega rápido em celular simples.
- Corpo com 17px (`1.0625rem`) e entrelinha 1.65. Títulos com peso 700.
- Use sempre `rem` (nunca `px`) para tamanhos de letra: assim o controle **A / A+ / A++** funciona.
- Linhas de texto longas ficam com no máximo ~70 caracteres (`max-width: 70ch`).

## Formas e espaço

- Cantos: `--radius` (14px) em cartões e caixas; `--radius-sm` (10px) em botões, campos e chips.
  Nada de botões em formato de pílula.
- Sem sombra parada. Sombra leve (`--shadow-hover`) só ao passar o mouse em cartões clicáveis.
- Separe seções com espaço e uma linha fina (`--border`), não com caixas coloridas.

## Tamanhos de tela

| Largura | O que muda |
| --- | --- |
| Até 719px (celular) | Uma coluna. Cabeçalho em duas linhas: marca + letra em cima, as 3 abas embaixo |
| 720px ou mais | Cabeçalho fixo no topo; cartões de serviço em 2 colunas |
| 1024px ou mais | Página inicial com título à esquerda e conteúdo à direita; tema com a lista de temas ao lado; serviços com filtros numa coluna à esquerda |
| 1100px ou mais | Cabeçalho numa linha só, **apenas com letra normal**. Com A+ ou A++ ele fica em duas linhas para não espremer |

Largura máxima do conteúdo: `--container` (1120px).

## Peças prontas (use antes de criar outra)

| Classe | Uso |
| --- | --- |
| `.button--primary` | A ação principal da tela (uma por bloco) |
| `.button--ghost` | Ações secundárias e links externos ("Acessar www.gov.br") |
| `.card`, `.card--link` | Caixa branca com borda; `--link` quando o cartão inteiro é clicável |
| `<Callout variant="...">` | Avisos: `info`, `ok`, `alerta`, `perigo` |
| `.kicker` | Texto pequeno em maiúsculas acima de um título ("TEMA 4 DE 5") |
| `.section--split` | Seção com título à esquerda e conteúdo à direita (no computador) |
| `.filter-chip`, `.service-chip` | Botões pequenos de filtro e atalhos para serviços |
| `.tema-list`, `.tema-nav` | Lista numerada de temas (início) e coluna de temas (página do tema) |

## Acessibilidade (não negociável)

- Área de toque de **pelo menos 44px** em tudo que é clicável.
- Foco do teclado sempre visível (contorno laranja `--accent`).
- Animações respeitam `prefers-reduced-motion`.
- Ícones decorativos com `aria-hidden="true"`; botões só com ícone precisam de `aria-label`.

## Antes de terminar uma mudança visual

Abra o site e confira:

1. Celular (375px): nada corta e não aparece rolagem para o lado.
2. Computador (1280px ou mais): o layout usa a largura e não parece "celular esticado".
3. Modo escuro.
4. Letra A++ no celular e no computador.
5. Navegação só com o teclado (Tab), vendo o foco.
