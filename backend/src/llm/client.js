// Cliente de chat no formato da API da OpenAI (/chat/completions com stream).
// Funciona com Ollama, Groq e qualquer provedor compatível. O provedor "mock"
// devolve uma resposta de demonstração para quem só quer mexer no visual.
import { config } from '../config.js';

export class LlmError extends Error {
  constructor(message, { status, detail } = {}) {
    super(message);
    this.name = 'LlmError';
    this.status = status;
    this.detail = detail;
  }
}

function headers(apiKey) {
  const result = { 'Content-Type': 'application/json' };
  if (apiKey) result.Authorization = `Bearer ${apiKey}`;
  return result;
}

/**
 * Envia as mensagens ao modelo e devolve o texto aos pedaços (streaming).
 * @param {{ messages: {role: string, content: string}[], signal?: AbortSignal }} params
 * @returns {AsyncGenerator<string>}
 */
export async function* streamChat({ messages, signal }) {
  if (config.llm.provider === 'mock') {
    yield* mockStream(messages, signal);
    return;
  }

  const { baseUrl, model, apiKey, temperature, maxTokens, timeoutMs } = config.llm;
  const timeout = AbortSignal.timeout(timeoutMs);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let response;
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: combined,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    if (timeout.aborted) throw new LlmError('O modelo demorou demais para responder.', { status: 504 });
    throw new LlmError(`Não foi possível conectar ao provedor de IA em ${baseUrl}.`, {
      status: 502,
      detail: error.cause?.code ?? error.message,
    });
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new LlmError(`O provedor de IA respondeu com erro ${response.status}.`, {
      status: response.status,
      detail: detail.slice(0, 500),
    });
  }

  const decoder = new TextDecoder();
  let buffer = '';
  for await (const bytes of response.body) {
    buffer += decoder.decode(bytes, { stream: true });
    let newline;
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;
      let json;
      try {
        json = JSON.parse(data);
      } catch {
        continue; // linha incompleta ou comentário do provedor
      }
      if (json.error) {
        throw new LlmError('O provedor de IA interrompeu a resposta.', {
          detail: JSON.stringify(json.error).slice(0, 500),
        });
      }
      const delta = json.choices?.[0]?.delta?.content;
      if (delta) yield delta;
    }
  }
}

const sleep = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });

async function* mockStream(messages, signal) {
  const question = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const system = messages.find((m) => m.role === 'system')?.content ?? '';
  const titles = [...system.matchAll(/^\[\d+\] (.+?) — fonte:/gm)].map((m) => m[1]);

  const lines = [
    '**Modo de demonstração:** nenhum modelo de IA está conectado agora.',
    '',
    `Você perguntou: "${question.slice(0, 160)}"`,
    '',
    titles.length
      ? `Trechos encontrados na base de conhecimento: ${[...new Set(titles)].join('; ')}.`
      : 'A base de conhecimento ainda não tem documentos sobre isso.',
    '',
    'Para respostas de verdade, configure `LLM_PROVIDER=ollama` ou `LLM_PROVIDER=groq` no arquivo `backend/.env` (veja `docs/ASSISTENTE-IA.md`).',
  ];

  for (const word of lines.join('\n').split(/(\s+)/)) {
    await sleep(15, signal);
    yield word;
  }
}
