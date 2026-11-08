// Gera o índice do RAG a partir dos documentos em backend/rag/documentos.
//
// Uso (na raiz do projeto):
//   npm run rag:ingest                      -> usa o EMBEDDINGS_PROVIDER do backend/.env
//   npm run rag:ingest -- --sem-embeddings  -> força a busca por palavras-chave
//
// Resultado: backend/rag/indice/indice.json (a API recarrega sozinha).
import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../src/config.js';
import { embed, embeddingsEnabled } from '../src/llm/embeddings.js';
import { chunkMarkdown } from '../src/rag/chunker.js';
import { parseFrontmatter } from '../src/rag/frontmatter.js';
import { INDEX_VERSION } from '../src/rag/store.js';

const BATCH_SIZE = 16;
const forceKeyword = process.argv.includes('--sem-embeddings');
const { documentsDir, indexFile, chunkSize, chunkOverlap } = config.rag;

const isDocument = (file) =>
  /\.(md|txt)$/i.test(file) && !file.startsWith('_') && file.toLowerCase() !== 'readme.md';

async function main() {
  const files = (await fs.readdir(documentsDir)).filter(isDocument).sort();
  const documents = [];
  const chunks = [];
  const warnings = [];

  for (const file of files) {
    const raw = await fs.readFile(path.join(documentsDir, file), 'utf8');
    const { meta, body: rawBody } = parseFrontmatter(raw);
    const body = rawBody.replace(/<!--[\s\S]*?-->/g, '').trim(); // comentários não vão para o índice
    const docId = file.replace(/\.(md|txt)$/i, '');
    const title = meta.titulo || docId;

    if (!meta.titulo) warnings.push(`${file}: sem "titulo" no cabeçalho (usei o nome do arquivo).`);
    if (!meta.fonte) warnings.push(`${file}: sem "fonte". Todo documento deve apontar para uma fonte oficial.`);
    if (!body) {
      warnings.push(`${file}: arquivo vazio, ignorado.`);
      continue;
    }

    const pieces = chunkMarkdown(body, { size: chunkSize, overlap: chunkOverlap });
    documents.push({
      id: docId,
      file,
      title,
      source: meta.fonte || '',
      category: meta.categoria || '',
      updatedAt: meta.atualizado_em || '',
      chunks: pieces.length,
    });
    pieces.forEach((piece, i) => {
      chunks.push({
        id: `${docId}#${i + 1}`,
        docId,
        title,
        heading: piece.heading,
        source: meta.fonte || '',
        category: meta.categoria || '',
        text: piece.text,
      });
    });
  }

  let embeddingModel = null;
  if (chunks.length && embeddingsEnabled() && !forceKeyword) {
    console.log(`Gerando embeddings com ${config.embeddings.model} em ${config.embeddings.baseUrl}...`);
    try {
      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);
        const vectors = await embed(batch.map((c) => `${c.title}${c.heading ? ` — ${c.heading}` : ''}\n${c.text}`));
        batch.forEach((chunk, j) => {
          chunk.embedding = vectors[j];
        });
        process.stdout.write(`  ${Math.min(i + BATCH_SIZE, chunks.length)}/${chunks.length}\r`);
      }
      process.stdout.write('\n');
      embeddingModel = config.embeddings.model;
    } catch (error) {
      console.error(`\nFalha ao gerar embeddings: ${error.message}`);
      console.error('Confira se o Ollama está aberto e se o modelo foi baixado (ollama pull bge-m3),');
      console.error('ou rode de novo com: npm run rag:ingest -- --sem-embeddings');
      process.exit(1);
    }
  }

  const index = {
    version: INDEX_VERSION,
    createdAt: new Date().toISOString(),
    embeddingModel,
    documents,
    chunks,
  };
  await fs.mkdir(path.dirname(indexFile), { recursive: true });
  await fs.writeFile(indexFile, `${JSON.stringify(index)}\n`, 'utf8');

  for (const warning of warnings) console.warn(`Aviso: ${warning}`);
  if (!documents.length) {
    console.log('Nenhum documento encontrado em backend/rag/documentos. O índice foi salvo vazio.');
    console.log('Veja backend/rag/documentos/README.md para saber como escrever os documentos.');
    return;
  }
  console.log(
    `Índice salvo: ${documents.length} documento(s), ${chunks.length} trecho(s), busca por ${
      embeddingModel ? `embeddings (${embeddingModel})` : 'palavras-chave'
    }.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
