// Busca por palavras-chave (BM25). É o modo padrão do RAG: não precisa de
// nenhum modelo extra e funciona bem para uma base pequena de documentos.

const STOPWORDS = new Set(
  `a o e de da do das dos em no na nos nas um uma uns umas para pra pro por com sem que se ao aos as os
   e ou como mais mas eu meu minha meus minhas voce seu sua seus suas ele ela eles elas isso isto este esta
   esse essa ter tem tenho qual quais quando onde ja nao sim me te lhe nos vos foi ser sou esta estou
   muito pouco bem so sobre ate entre depois antes tambem quero queria preciso fazer faco posso pode`
    .split(/\s+/)
    .filter(Boolean),
);

export function normalize(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

// "Stemming" bem simples para português: tira plural e algumas terminações comuns.
function stem(token) {
  if (token.length > 5 && token.endsWith('oes')) return `${token.slice(0, -3)}ao`;
  if (token.length > 4 && /(res|zes|les)$/.test(token)) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith('s')) return token.slice(0, -1);
  return token;
}

export function tokenize(text) {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map(stem);
}

/**
 * @param {{ text: string, title?: string, heading?: string }[]} chunks
 */
export function buildKeywordIndex(chunks) {
  const docs = chunks.map((chunk) => {
    // O título conta duas vezes: ajuda a achar o documento certo.
    const tokens = tokenize(`${chunk.title ?? ''} ${chunk.title ?? ''} ${chunk.heading ?? ''} ${chunk.text}`);
    const tf = new Map();
    for (const token of tokens) tf.set(token, (tf.get(token) ?? 0) + 1);
    return { tf, length: tokens.length };
  });

  const df = new Map();
  for (const doc of docs) for (const token of doc.tf.keys()) df.set(token, (df.get(token) ?? 0) + 1);

  const avgLength = docs.reduce((sum, doc) => sum + doc.length, 0) / (docs.length || 1);
  return { docs, df, avgLength, size: docs.length };
}

/**
 * @returns {{ index: number, score: number }[]} posições dos chunks, do mais relevante ao menos
 */
export function searchKeyword(keywordIndex, query, topK = 4, { k1 = 1.4, b = 0.75 } = {}) {
  const terms = [...new Set(tokenize(query))];
  if (!terms.length || !keywordIndex.size) return [];

  const results = [];
  keywordIndex.docs.forEach((doc, index) => {
    let score = 0;
    for (const term of terms) {
      const frequency = doc.tf.get(term);
      if (!frequency) continue;
      const df = keywordIndex.df.get(term) ?? 0;
      const idf = Math.log(1 + (keywordIndex.size - df + 0.5) / (df + 0.5));
      score +=
        (idf * frequency * (k1 + 1)) /
        (frequency + k1 * (1 - b + (b * doc.length) / (keywordIndex.avgLength || 1)));
    }
    if (score > 0) results.push({ index, score });
  });

  return results.sort((x, y) => y.score - x.score).slice(0, topK);
}
