import { test } from 'node:test';
import assert from 'node:assert/strict';
import { linkifyUrls } from './linkify.js';

test('endereço solto vira link, sem levar a pontuação do fim da frase', () => {
  assert.equal(
    linkifyUrls('Acesse https://www.gov.br/receitafederal/pt-br/assuntos/meu-cpf.'),
    'Acesse <https://www.gov.br/receitafederal/pt-br/assuntos/meu-cpf>.',
  );
  assert.equal(linkifyUrls('Veja: https://meususdigital.saude.gov.br, é grátis'), 'Veja: <https://meususdigital.saude.gov.br>, é grátis');
});

test('endereço em negrito continua em negrito e vira link', () => {
  assert.equal(linkifyUrls('**https://www.gov.br/mec/pt-br/pe-de-meia**'), '**<https://www.gov.br/mec/pt-br/pe-de-meia>**');
});

test('endereço no começo da linha, entre parênteses e vários no mesmo texto', () => {
  assert.equal(linkifyUrls('https://cartilha.cert.br é útil'), '<https://cartilha.cert.br> é útil');
  assert.equal(linkifyUrls('(site: https://www.gov.br)'), '(site: <https://www.gov.br>)');
  assert.equal(
    linkifyUrls('- https://a.gov.br/x\n- https://b.jus.br/y?z=1'),
    '- <https://a.gov.br/x>\n- <https://b.jus.br/y?z=1>',
  );
});

test('links que já estão em Markdown não mudam', () => {
  const textos = ['[ENEM](https://www.gov.br/inep)', '[https://www.gov.br](https://www.gov.br)', '<https://www.gov.br>'];
  for (const texto of textos) assert.equal(linkifyUrls(texto), texto);
});

test('código não muda', () => {
  assert.equal(linkifyUrls('use `https://www.gov.br` aqui'), 'use `https://www.gov.br` aqui');
  assert.equal(linkifyUrls('```\nhttps://www.gov.br\n```'), '```\nhttps://www.gov.br\n```');
});

test('texto sem endereço e valores vazios', () => {
  assert.equal(linkifyUrls('Procure o CRAS mais perto de você.'), 'Procure o CRAS mais perto de você.');
  assert.equal(linkifyUrls('gov.br sozinho não vira link'), 'gov.br sozinho não vira link');
  assert.equal(linkifyUrls(''), '');
  assert.equal(linkifyUrls(undefined), '');
});
