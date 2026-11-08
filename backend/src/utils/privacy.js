// Mascara dados pessoais antes de qualquer texto sair do servidor para o provedor de IA.
// O frontend faz a mesma coisa (frontend/src/lib/privacy.js) — mantenha os dois iguais.

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

/**
 * Troca CPF, número de cartão e e-mail por marcadores.
 * @param {string} text
 * @returns {{ text: string, found: string[] }} texto mascarado e tipos encontrados
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
