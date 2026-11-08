import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeUrl, extractUrls, registrableDomain } from './linkChecker.js';

const verdictOf = (url) => analyzeUrl(url).verdict;

test('endereços do governo são oficiais', () => {
  assert.equal(verdictOf('https://www.gov.br/pt-br'), 'oficial');
  assert.equal(verdictOf('https://meususdigital.saude.gov.br'), 'oficial');
  assert.equal(verdictOf('www.tse.jus.br/servicos-eleitorais'), 'oficial');
  assert.equal(verdictOf('https://alistamento.eb.mil.br'), 'oficial');
  assert.equal(verdictOf('gov.br'), 'oficial');
});

test('"gov.br" no meio do endereço é perigo', () => {
  const result = analyzeUrl('https://www.gov.br.atualizacao-cadastral.site/login');
  assert.equal(result.verdict, 'perigo');
  assert.equal(result.anatomy.owner, 'atualizacao-cadastral.site');
});

test('imitação de órgão público é perigo', () => {
  assert.equal(verdictOf('http://gov-br.regularize-cpf.com/login'), 'perigo');
  assert.equal(verdictOf('https://receitafederal-cpf.online'), 'perigo');
  assert.equal(verdictOf('https://govbr.com.br'), 'perigo');
});

test('truques técnicos são perigo', () => {
  assert.equal(verdictOf('https://www.gov.br@golpe.com/entrar'), 'perigo');
  assert.equal(verdictOf('http://192.168.0.10/pix'), 'perigo');
  assert.equal(verdictOf('https://bit.ly/3abcde'), 'perigo');
  assert.equal(verdictOf('https://xn--gv-pmc.br'), 'perigo');
});

test('site comum sem sinais é só "não oficial"', () => {
  assert.equal(verdictOf('https://g1.globo.com/fato-ou-fake/'), 'nao-oficial');
  assert.equal(verdictOf('https://www.aosfatos.org'), 'nao-oficial');
  // nomes curtos dentro de outras palavras não contam como imitação
  assert.equal(verdictOf('https://www.mecanicadojoao.com.br'), 'nao-oficial');
  assert.equal(verdictOf('https://lojadepisos.com.br'), 'nao-oficial');
  assert.equal(verdictOf('https://cinepolis.com.br'), 'nao-oficial');
});

test('nome curto como palavra inteira conta como imitação', () => {
  assert.equal(verdictOf('https://sus-agendamento.com'), 'perigo');
  assert.equal(verdictOf('https://consulta.inss-beneficio.net'), 'perigo');
});

test('site comum com palavras de golpe pede atenção', () => {
  assert.equal(verdictOf('https://loja-promocao-premio.shop/resgate'), 'atencao');
});

test('entradas inválidas explicam o problema', () => {
  assert.equal(analyzeUrl('').ok, false);
  assert.equal(analyzeUrl('olá tudo bem').ok, false);
  assert.equal(analyzeUrl('ftp://arquivo.gov.br').ok, false);
});

test('extrai links de uma mensagem inteira', () => {
  const sms = 'URGENTE: seu CPF sera cancelado. Regularize em gov-br.regulariza.site/cpf ou https://bit.ly/x1. Obrigado!';
  assert.deepEqual(extractUrls(sms), ['gov-br.regulariza.site/cpf', 'https://bit.ly/x1']);
  assert.deepEqual(extractUrls('mande para ana@exemplo.com'), []);
});

test('domínio registrável considera .com.br e .gov.br', () => {
  assert.equal(registrableDomain('www.loja.com.br'), 'loja.com.br');
  assert.equal(registrableDomain('a.b.exemplo.com'), 'exemplo.com');
  assert.equal(registrableDomain('meususdigital.saude.gov.br'), 'saude.gov.br');
});
