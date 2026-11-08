import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chunkMarkdown } from './chunker.js';
import { parseFrontmatter } from './frontmatter.js';
import { buildKeywordIndex, searchKeyword, tokenize } from './keyword.js';

test('lê o frontmatter e separa o corpo', () => {
  const { meta, body } = parseFrontmatter(
    '---\ntitulo: ENEM\nfonte: "https://www.gov.br/inep"\ncategoria: educacao\n---\n# ENEM\n\nTexto.',
  );
  assert.equal(meta.titulo, 'ENEM');
  assert.equal(meta.fonte, 'https://www.gov.br/inep');
  assert.equal(body, '# ENEM\n\nTexto.');
});

test('documento sem frontmatter vira só corpo', () => {
  const { meta, body } = parseFrontmatter('Só texto.');
  assert.deepEqual(meta, {});
  assert.equal(body, 'Só texto.');
});

test('divide por seção e respeita o tamanho máximo', () => {
  const paragrafo = 'Frase de teste sobre serviços públicos digitais. '.repeat(8).trim();
  const md = `# Título\n\n## Seção A\n\n${paragrafo}\n\n${paragrafo}\n\n## Seção B\nTexto curto da seção B.`;
  const chunks = chunkMarkdown(md, { size: 500, overlap: 100 });
  assert.ok(chunks.length >= 3);
  assert.equal(chunks[0].heading, 'Seção A');
  assert.equal(chunks.at(-1).heading, 'Seção B');
  assert.equal(chunks.at(-1).text, 'Texto curto da seção B.');
  for (const chunk of chunks) assert.ok(chunk.text.length <= 500 + 100);
});

test('tokenize ignora acentos, maiúsculas e palavras vazias', () => {
  assert.deepEqual(tokenize('Quero fazer a INSCRIÇÃO no ENEM'), ['inscricao', 'enem']);
});

test('BM25 encontra o trecho certo', () => {
  const chunks = [
    { title: 'ENEM', text: 'Inscrição no Exame Nacional do Ensino Médio pela Página do Participante.' },
    { title: 'Carteira de Trabalho Digital', text: 'Contratos, salários e vagas de emprego.' },
    { title: 'Meu SUS Digital', text: 'Carteira de vacinação e histórico de saúde.' },
  ];
  const index = buildKeywordIndex(chunks);
  const [first] = searchKeyword(index, 'onde vejo minha vacinação?', 2);
  assert.equal(first.index, 2);
  assert.deepEqual(searchKeyword(index, 'xyzabc', 2), []);
});
