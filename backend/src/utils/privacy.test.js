import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maskSensitive } from './privacy.js';

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
