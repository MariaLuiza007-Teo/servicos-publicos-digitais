// Mascara dados pessoais ANTES de a mensagem sair do aparelho da pessoa.
// O backend repete a mesma proteção (backend/src/utils/privacy.js) — mantenha os dois iguais.

const RULES = [
  {
    type: 'cpf',
    label: '[CPF ocultado]',
    pattern: /\b\d{3}[.\s]?\d{3}[.\s]?\d{3}[-.\s]?\d{2}\b/g,
  },
  {
    type: 'cartao',
    label: '[número de cartão ocultado]',
    pattern: /\b(?:\d[ -]?){13,19}\b/g,
  },
  {
    type: 'email',
    label: '[e-mail ocultado]',
    pattern: /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g,
  },
];

export const MASK_NAMES = {
  cpf: 'um CPF',
  cartao: 'um número de cartão',
  email: 'um e-mail',
};

/**
 * @param {string} text
 * @returns {{ text: string, found: string[] }}
 */
export function maskSensitive(text) {
  const found = new Set();
  let result = String(text ?? '');
  for (const rule of RULES) {
    result = result.replace(rule.pattern, () => {
      found.add(rule.type);
      return rule.label;
    });
  }
  return { text: result, found: [...found] };
}
