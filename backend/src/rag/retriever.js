// Encontra os trechos da base de conhecimento mais parecidos com a pergunta.
// Usa embeddings quando o índice foi gerado com eles; senão, palavras-chave.
import { config } from '../config.js';
import { cosineSimilarity, embed, embeddingsEnabled } from '../llm/embeddings.js';
import { searchKeyword } from './keyword.js';
import { loadIndex } from './store.js';

/**
 * @param {string} query
 * @returns {Promise<{ mode: string, results: { chunk: object, score: number }[] }>}
 */
export async function retrieve(query) {
  const index = await loadIndex();
  const topK = config.rag.topK;
  if (!index.chunks.length) return { mode: 'sem-base', results: [] };

  const canUseEmbeddings =
    index.hasEmbeddings && embeddingsEnabled() && index.embeddingModel === config.embeddings.model;

  if (canUseEmbeddings) {
    try {
      const [vector] = await embed([query]);
      const results = index.chunks
        .map((chunk) => ({ chunk, score: cosineSimilarity(vector, chunk.embedding) }))
        .filter((item) => item.score >= config.rag.minScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
      return { mode: 'embeddings', results };
    } catch (error) {
      console.warn(`[rag] Embeddings indisponíveis, usando palavras-chave: ${error.message}`);
    }
  }

  const results = searchKeyword(index.keyword, query, topK).map(({ index: position, score }) => ({
    chunk: index.chunks[position],
    score,
  }));
  return { mode: 'palavras-chave', results };
}
