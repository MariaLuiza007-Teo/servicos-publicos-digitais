// Conversa com a API do assistente (backend/src/routes/chat.js).
// A resposta chega aos pedaços via Server-Sent Events: meta -> token... -> done | error.

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

export async function getHealth({ signal } = {}) {
  const response = await fetch(`${API_URL}/api/health`, { signal });
  if (!response.ok) throw new Error(`Erro ${response.status}`);
  return response.json();
}

function parseEvent(raw) {
  let event = 'message';
  const data = [];
  for (const line of raw.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) data.push(line.slice(5).trimStart());
  }
  if (!data.length) return null;
  try {
    return { event, data: JSON.parse(data.join('\n')) };
  } catch {
    return null;
  }
}

/**
 * @param {{
 *   messages: {role: 'user'|'assistant', content: string}[],
 *   signal?: AbortSignal,
 *   onMeta?: (meta: object) => void,
 *   onToken?: (text: string) => void,
 * }} params
 */
export async function streamChat({ messages, signal, onMeta, onToken }) {
  let response;
  try {
    response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Não consegui falar com o assistente. Confira sua internet ou se a API está ligada.');
  }

  if (!response.ok) {
    let message = '';
    try {
      message = (await response.json()).error;
    } catch {
      // resposta sem JSON
    }
    throw new Error(message || `O assistente respondeu com erro ${response.status}.`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');

    let separator;
    while ((separator = buffer.indexOf('\n\n')) >= 0) {
      const parsed = parseEvent(buffer.slice(0, separator));
      buffer = buffer.slice(separator + 2);
      if (!parsed) continue;
      if (parsed.event === 'meta') onMeta?.(parsed.data);
      else if (parsed.event === 'token') onToken?.(parsed.data.text ?? '');
      else if (parsed.event === 'error') throw new Error(parsed.data.message);
      else if (parsed.event === 'done') return;
    }
  }
}
