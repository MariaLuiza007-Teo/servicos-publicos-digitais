// POST /api/chat — recebe a conversa e devolve a resposta aos pedaços (Server-Sent Events).
//
// Eventos enviados ao frontend, nesta ordem:
//   meta  -> { sources, retrieval, ragReady, masked }   (antes do texto)
//   token -> { text }                                    (vários, conforme o modelo escreve)
//   done  -> {}                                          (fim normal)
//   error -> { message }                                 (fim com erro)
import { Router } from 'express';
import { config } from '../config.js';
import { LlmError, streamChat } from '../llm/client.js';
import { buildMessages } from '../prompts/system.js';
import { retrieve } from '../rag/retriever.js';
import { maskSensitive } from '../utils/privacy.js';

export const chatRouter = Router();

function validate(body) {
  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { error: 'Envie a conversa no campo "messages".' };
  }
  if (messages.length > 40) return { error: 'Conversa longa demais. Comece uma nova.' };

  const clean = [];
  for (const message of messages) {
    if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string') {
      return { error: 'Formato de mensagem inválido.' };
    }
    const content = message.content.trim().slice(0, config.limits.maxMessageChars);
    if (content) clean.push({ role: message.role, content });
  }
  if (clean.at(-1)?.role !== 'user') return { error: 'A última mensagem precisa ser da pessoa usuária.' };
  return { messages: clean.slice(-config.limits.maxHistoryMessages) };
}

chatRouter.post('/chat', async (req, res) => {
  const { error, messages } = validate(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const masked = new Set();
  const history = messages.map((message) => {
    const result = maskSensitive(message.content);
    result.found.forEach((type) => masked.add(type));
    return { role: message.role, content: result.text };
  });

  const question = history.at(-1).content;
  const { mode, results } = await retrieve(question);

  const sources = [];
  const seen = new Set();
  for (const { chunk } of results) {
    if (seen.has(chunk.docId)) continue;
    seen.add(chunk.docId);
    sources.push({ title: chunk.title, url: chunk.source || null, category: chunk.category || null });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  const send = (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  const controller = new AbortController();
  res.on('close', () => {
    if (!res.writableEnded) controller.abort();
  });

  send('meta', { sources, retrieval: mode, ragReady: mode !== 'sem-base', masked: [...masked] });

  try {
    for await (const text of streamChat({ messages: buildMessages({ history, results }), signal: controller.signal })) {
      send('token', { text });
    }
    send('done', {});
  } catch (err) {
    if (controller.signal.aborted) return; // a pessoa fechou a página ou cancelou
    console.error('[chat]', err.message, err.detail ?? '');
    const message =
      err instanceof LlmError
        ? 'O assistente está indisponível agora. Tente de novo em alguns minutos.'
        : 'Algo deu errado ao gerar a resposta.';
    send('error', { message });
  } finally {
    res.end();
  }
});
