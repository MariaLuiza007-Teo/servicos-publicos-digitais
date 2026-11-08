// Lê o cabeçalho simples (frontmatter) dos documentos do RAG:
//
// ---
// titulo: ENEM — como se inscrever
// fonte: https://www.gov.br/inep/...
// categoria: educacao
// atualizado_em: 2026-11-08
// ---
// texto do documento...

/**
 * @param {string} raw conteúdo do arquivo
 * @returns {{ meta: Record<string, string>, body: string }}
 */
export function parseFrontmatter(raw) {
  const text = String(raw).replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { meta: {}, body: text.trim() };

  const meta = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    if (key) meta[key] = value;
  }
  return { meta, body: text.slice(match[0].length).trim() };
}
