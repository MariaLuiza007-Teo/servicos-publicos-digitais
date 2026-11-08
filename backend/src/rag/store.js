// Carrega o índice gerado por "npm run rag:ingest" (backend/rag/indice/indice.json).
// O arquivo é relido sozinho quando muda, sem precisar reiniciar a API.
import fs from 'node:fs/promises';
import { config } from '../config.js';
import { buildKeywordIndex } from './keyword.js';

export const INDEX_VERSION = 1;

const EMPTY = Object.freeze({
  version: INDEX_VERSION,
  createdAt: null,
  embeddingModel: null,
  documents: [],
  chunks: [],
});

let cache = { mtimeMs: -1, index: null };

function prepare(raw) {
  const chunks = Array.isArray(raw.chunks) ? raw.chunks : [];
  return {
    ...EMPTY,
    ...raw,
    chunks,
    documents: Array.isArray(raw.documents) ? raw.documents : [],
    hasEmbeddings: chunks.length > 0 && chunks.every((chunk) => Array.isArray(chunk.embedding)),
    keyword: buildKeywordIndex(chunks),
  };
}

export async function loadIndex() {
  let stat;
  try {
    stat = await fs.stat(config.rag.indexFile);
  } catch {
    if (cache.mtimeMs !== 0) cache = { mtimeMs: 0, index: prepare(EMPTY) };
    return cache.index;
  }

  if (stat.mtimeMs !== cache.mtimeMs) {
    try {
      const raw = JSON.parse(await fs.readFile(config.rag.indexFile, 'utf8'));
      cache = { mtimeMs: stat.mtimeMs, index: prepare(raw) };
    } catch (error) {
      console.error(`[rag] Não consegui ler ${config.rag.indexFile}: ${error.message}`);
      cache = { mtimeMs: stat.mtimeMs, index: prepare(EMPTY) };
    }
  }
  return cache.index;
}

export async function indexSummary() {
  const index = await loadIndex();
  return {
    ready: index.chunks.length > 0,
    documents: index.documents.length,
    chunks: index.chunks.length,
    createdAt: index.createdAt,
    retriever: index.hasEmbeddings ? `embeddings (${index.embeddingModel})` : 'palavras-chave',
  };
}
