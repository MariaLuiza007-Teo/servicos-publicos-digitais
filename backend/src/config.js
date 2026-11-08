// Configuração central da API. Tudo que muda entre computadores fica no backend/.env
// (veja backend/.env.example). Nada aqui deve ser importado pelo frontend.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const BACKEND_ROOT = path.resolve(here, '..');

try {
  process.loadEnvFile(path.join(BACKEND_ROOT, '.env'));
} catch {
  // Sem backend/.env: seguimos com os valores padrão (provedor "mock").
}

const env = process.env;

const text = (name, fallback = '') => {
  const value = env[name];
  return value === undefined || value.trim() === '' ? fallback : value.trim();
};

const number = (name, fallback) => {
  const value = Number(text(name, ''));
  return Number.isFinite(value) && text(name, '') !== '' ? value : fallback;
};

// Valores padrão de cada provedor de LLM. Todos falam o formato da API da OpenAI
// (/chat/completions), então trocar de provedor é só mudar o .env.
const LLM_DEFAULTS = {
  mock: { baseUrl: '', model: 'demonstracao' },
  ollama: { baseUrl: 'http://localhost:11434/v1', model: 'llama3.1:8b' },
  groq: { baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
  custom: { baseUrl: '', model: '' },
};

const EMBEDDING_DEFAULTS = {
  none: { baseUrl: '', model: '' },
  ollama: { baseUrl: 'http://localhost:11434/v1', model: 'bge-m3' },
  custom: { baseUrl: '', model: '' },
};

const llmProvider = text('LLM_PROVIDER', 'mock').toLowerCase();
if (!LLM_DEFAULTS[llmProvider]) {
  throw new Error(
    `LLM_PROVIDER inválido: "${llmProvider}". Use: ${Object.keys(LLM_DEFAULTS).join(', ')}.`,
  );
}

const embeddingsProvider = text('EMBEDDINGS_PROVIDER', 'none').toLowerCase();
if (!EMBEDDING_DEFAULTS[embeddingsProvider]) {
  throw new Error(
    `EMBEDDINGS_PROVIDER inválido: "${embeddingsProvider}". Use: ${Object.keys(EMBEDDING_DEFAULTS).join(', ')}.`,
  );
}

const ragDir = path.join(BACKEND_ROOT, 'rag');

// Porta: "--port=3001" na linha de comando (usado por "npm run dev") vence o PORT do ambiente.
// Serviços de hospedagem (Render, Railway...) definem PORT sozinhos; por isso o "start" não passa --port.
const portArg = process.argv.find((arg) => arg.startsWith('--port='));
const cliPort = portArg ? Number(portArg.split('=')[1]) : NaN;

export const config = {
  port: Number.isFinite(cliPort) && cliPort > 0 ? cliPort : number('PORT', 3001),
  corsOrigins: text('CORS_ORIGIN', 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  trustProxy: number('TRUST_PROXY', 0),

  llm: {
    provider: llmProvider,
    baseUrl: text('LLM_BASE_URL', LLM_DEFAULTS[llmProvider].baseUrl).replace(/\/+$/, ''),
    model: text('LLM_MODEL', LLM_DEFAULTS[llmProvider].model),
    apiKey: text('LLM_API_KEY'),
    temperature: number('LLM_TEMPERATURE', 0.2),
    maxTokens: number('LLM_MAX_TOKENS', 700),
    timeoutMs: number('LLM_TIMEOUT_MS', 120_000),
  },

  embeddings: {
    provider: embeddingsProvider,
    baseUrl: text('EMBEDDINGS_BASE_URL', EMBEDDING_DEFAULTS[embeddingsProvider].baseUrl).replace(/\/+$/, ''),
    model: text('EMBEDDINGS_MODEL', EMBEDDING_DEFAULTS[embeddingsProvider].model),
    apiKey: text('EMBEDDINGS_API_KEY'),
  },

  rag: {
    documentsDir: path.join(ragDir, 'documentos'),
    indexFile: path.join(ragDir, 'indice', 'indice.json'),
    topK: number('RAG_TOP_K', 4),
    minScore: number('RAG_MIN_SCORE', 0.35),
    chunkSize: 900,
    chunkOverlap: 200,
  },

  limits: {
    maxMessageChars: number('MAX_MESSAGE_CHARS', 1000),
    maxHistoryMessages: number('MAX_HISTORY_MESSAGES', 8),
    rateLimitPerMinute: number('RATE_LIMIT_PER_MINUTE', 20),
  },
};

export function validateLlmConfig() {
  const { provider, baseUrl, model, apiKey } = config.llm;
  const problems = [];
  if (provider !== 'mock') {
    if (!baseUrl) problems.push('LLM_BASE_URL está vazio.');
    if (!model) problems.push('LLM_MODEL está vazio.');
  }
  if (provider === 'groq' && !apiKey) {
    problems.push('LLM_API_KEY é obrigatório para o provedor groq.');
  }
  return problems;
}
