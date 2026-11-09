import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maskSensitive as maskBackend } from '../../../backend/src/utils/privacy.js';
import { MASK_NAMES, maskSensitive } from './privacy.js';

test('mascara CPF com e sem pontuação', () => {
  const a = maskSensitive('meu cpf é 123.456.789-09');
  assert.equal(a.text, 'meu cpf é [CPF ocultado]');
  assert.deepEqual(a.found, ['cpf']);

  const b = maskSensitive('cpf 12345678909 ok');
  assert.equal(b.text, 'cpf [CPF ocultado] ok');
});

test('mascara cartão e e-mail', () => {
  const r = maskSensitive('cartão 4111 1111 1111 1111 e email ana@exemplo.com.br');
  assert.match(r.text, /\[número de cartão ocultado\]/);
  assert.match(r.text, /\[e-mail ocultado\]/);
  assert.deepEqual(r.found.sort(), ['cartao', 'email']);
});

test('não altera texto comum, anos e telefones curtos', () => {
  const texto = 'Vou fazer o ENEM em 2026 e tenho 17 anos. Liguei para 3333-4444.';
  const r = maskSensitive(texto);
  assert.equal(r.text, texto);
  assert.deepEqual(r.found, []);
});

test('todo tipo mascarado tem um nome para mostrar na conversa', () => {
  const r = maskSensitive('123.456.789-09, 4111 1111 1111 1111, ana@exemplo.com');
  for (const type of r.found) assert.ok(MASK_NAMES[type], `falta MASK_NAMES.${type}`);
});

// Regra do projeto: o frontend e o backend mascaram exatamente do mesmo jeito.
test('frontend e backend mascaram igual', () => {
  const exemplos = [
    'meu cpf é 123.456.789-09',
    'cpf 12345678909 ok',
    'cartão 4111 1111 1111 1111 e email ana@exemplo.com.br',
    'Vou fazer o ENEM em 2026 e tenho 17 anos. Liguei para 3333-4444.',
    '',
  ];
  for (const exemplo of exemplos) {
    assert.deepEqual(maskSensitive(exemplo), maskBackend(exemplo), exemplo);
  }
});
