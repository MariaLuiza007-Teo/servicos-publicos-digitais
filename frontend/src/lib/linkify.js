// Transforma endereços soltos nas respostas da IA ("acesse https://www.gov.br/...") em links
// clicáveis. O react-markdown, sem plugins, só cria link para [texto](url) ou <url>.
// O que já é link em Markdown e o que está dentro de código ficam como estão.

// Endereço http(s) que não vem logo depois de "(", "[", "<", "/", "`" ou letra (ou seja, que ainda
// não faz parte de um link em Markdown). O último caractere não pode ser pontuação: em
// "acesse https://www.gov.br." o ponto final fica fora do link.
const URL_IN_TEXT = /(^|[^\w/[(<`])(https?:\/\/[^\s<>()[\]`*"'“”‘’]*[^\s<>()[\]`*"'“”‘’.,;:!?])/g;

// Trechos de código (```bloco``` ou `inline`): não mexemos neles.
const CODE = /(```[\s\S]*?```|`[^`\n]*`)/;

/**
 * @param {string} markdown texto da resposta, em Markdown
 * @returns {string} o mesmo texto, com endereços soltos no formato <https://...>
 */
export function linkifyUrls(markdown) {
  return String(markdown ?? '')
    .split(CODE)
    .map((part, index) =>
      // Com o grupo de captura no split, os trechos de código ficam nas posições ímpares.
      index % 2 === 1 ? part : part.replace(URL_IN_TEXT, (_match, before, url) => `${before}<${url}>`),
    )
    .join('');
}
