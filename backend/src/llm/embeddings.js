// Embeddings (vetores de significado) para a busca semântica do RAG.
// Usa o endpoint /embeddings no formato OpenAI (Ollama e outros suportam).
import { config } from '../config.js';

export const embeddingsEnabled = () => config.embeddings.provider !== 'none';

/**
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
export async function embed(texts) {
  const { baseUrl, model, apiKey } = config.embeddings;
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const response = await fetch(`${baseUrl}/embeddings`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model, input: texts }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Embeddings: erro ${response.status} em ${baseUrl} (${detail.slice(0, 200)})`);
  }

  const json = await response.json();
  const vectors = (json.data ?? [])
    .slice()
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((item) => item.embedding);

  if (vectors.length !== texts.length) {
    throw new Error('Embeddings: o provedor devolveu uma quantidade diferente de vetores.');
  }
  return vectors;
}

export function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
}
