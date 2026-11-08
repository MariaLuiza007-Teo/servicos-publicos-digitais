import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { config, validateLlmConfig } from './config.js';
import { indexSummary } from './rag/store.js';
import { chatRouter } from './routes/chat.js';

const app = express();
app.disable('x-powered-by');
if (config.trustProxy) app.set('trust proxy', config.trustProxy);

app.use(cors({ origin: config.corsOrigins }));
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', async (_req, res) => {
  res.json({
    ok: true,
    llm: { provider: config.llm.provider, model: config.llm.model },
    rag: await indexSummary(),
  });
});

app.use(
  '/api/chat',
  rateLimit({
    windowMs: 60_000,
    limit: config.limits.rateLimitPerMinute,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Muitas perguntas em pouco tempo. Espere um minuto e tente de novo.' },
  }),
);
app.use('/api', chatRouter);

app.use('/api', (_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[api]', err);
  if (res.headersSent) {
    res.end();
    return;
  }
  const status = err.type === 'entity.too.large' ? 413 : err.status ?? 500;
  res.status(status).json({ error: status === 500 ? 'Erro interno do servidor.' : err.message });
});

const problems = validateLlmConfig();
if (problems.length) {
  console.error(`\nConfiguração do LLM incompleta:\n- ${problems.join('\n- ')}\nVeja backend/.env.example.\n`);
  process.exit(1);
}

app.listen(config.port, async () => {
  const rag = await indexSummary();
  console.log(`API do Guia do Cidadão Digital em http://localhost:${config.port}`);
  console.log(`  LLM: ${config.llm.provider} (${config.llm.model})`);
  console.log(
    rag.ready
      ? `  RAG: ${rag.documents} documento(s), ${rag.chunks} trecho(s), busca por ${rag.retriever}`
      : '  RAG: base vazia. Adicione documentos em backend/rag/documentos e rode "npm run rag:ingest".',
  );
  if (config.llm.provider === 'mock') {
    console.log('  Modo de demonstração: as respostas não usam IA. Veja docs/ASSISTENTE-IA.md.');
  }
});
