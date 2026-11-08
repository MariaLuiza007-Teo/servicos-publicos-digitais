// Divide um documento Markdown em trechos ("chunks") de tamanho parecido.
// Cada trecho guarda o título da seção em que está, para dar contexto ao modelo.

function splitLongBlock(block, size) {
  if (block.length <= size) return [block];
  const sentences = block.split(/(?<=[.!?])\s+/);
  const parts = [];
  let current = '';
  for (const sentence of sentences) {
    if (sentence.length > size) {
      if (current) parts.push(current);
      current = '';
      for (let i = 0; i < sentence.length; i += size) parts.push(sentence.slice(i, i + size));
      continue;
    }
    if (current && current.length + sentence.length + 1 > size) {
      parts.push(current);
      current = '';
    }
    current = current ? `${current} ${sentence}` : sentence;
  }
  if (current) parts.push(current);
  return parts;
}

/**
 * @param {string} markdown
 * @param {{ size?: number, overlap?: number }} options
 *   size: tamanho máximo aproximado de cada trecho (em caracteres)
 *   overlap: o último parágrafo de um trecho é repetido no próximo se tiver até esse tamanho
 * @returns {{ heading: string, text: string }[]}
 */
export function chunkMarkdown(markdown, { size = 900, overlap = 200 } = {}) {
  const blocks = String(markdown)
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  const chunks = [];
  let heading = '';
  let parts = [];
  let length = 0;

  const flush = (keepOverlap) => {
    if (parts.length) chunks.push({ heading, text: parts.join('\n\n') });
    const last = parts.at(-1);
    parts = keepOverlap && last && last.length <= overlap ? [last] : [];
    length = parts.reduce((total, part) => total + part.length + 2, 0);
  };

  for (let block of blocks) {
    const lines = block.split('\n');
    const headingMatch = /^#{1,6}\s+(.+)$/.exec(lines[0]);
    if (headingMatch) {
      flush(false);
      heading = headingMatch[1].trim();
      block = lines.slice(1).join('\n').trim();
      if (!block) continue;
    }
    for (const piece of splitLongBlock(block, size)) {
      if (length && length + piece.length > size) flush(true);
      parts.push(piece);
      length += piece.length + 2;
    }
  }
  flush(false);
  return chunks;
}
