import { CircleAlert, CircleCheck, Info, Lock, ScanSearch, ShieldAlert, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { Callout } from '../components/Callout.jsx';
import { analyzeUrl, extractUrls, VERDICTS } from '../lib/linkChecker.js';
import { usePageTitle } from '../lib/usePageTitle.js';

const EXEMPLOS = [
  { rotulo: 'Site do governo', valor: 'https://meususdigital.saude.gov.br' },
  { rotulo: 'SMS de golpe', valor: 'URGENTE: seu CPF sera cancelado hoje. Regularize em http://gov-br.regulariza-cpf.site/login' },
  { rotulo: 'gov.br no meio', valor: 'https://www.gov.br.atualizacao-cadastral.online/beneficio' },
  { rotulo: 'Link encurtado', valor: 'Você tem valores a receber! Acesse https://bit.ly/3vAlor' },
  { rotulo: 'Site de notícias', valor: 'https://g1.globo.com/fato-ou-fake/' },
];

const VERDICT_ICONS = {
  oficial: ShieldCheck,
  'nao-oficial': Info,
  atencao: TriangleAlert,
  perigo: ShieldAlert,
};

const CHECK_ICONS = {
  ok: CircleCheck,
  info: Info,
  warn: TriangleAlert,
  danger: CircleAlert,
};

const CHECK_LABELS = { ok: 'Ponto positivo', info: 'Informação', warn: 'Atenção', danger: 'Perigo' };

function Anatomy({ anatomy }) {
  const parts = [
    anatomy.protocol && { key: 'protocol', text: `${anatomy.protocol}://`, label: 'Começo', help: 'https tem cadeado; http não.' },
    anatomy.userinfo && {
      key: 'userinfo',
      text: `${anatomy.userinfo}@`,
      label: 'Enfeite antes do @',
      help: 'É ignorado pelo navegador. Serve só para enganar.',
    },
    anatomy.subdomain && {
      key: 'subdomain',
      text: `${anatomy.subdomain}.`,
      label: 'Subdomínio',
      help: 'O dono do endereço escolhe livremente. Pode ser qualquer coisa.',
    },
    { key: 'owner', text: anatomy.owner, label: 'Dono do endereço', help: 'É esta parte que diz quem controla o site.' },
    anatomy.port && { key: 'port', text: `:${anatomy.port}`, label: 'Porta', help: 'Raramente aparece em sites comuns.' },
    anatomy.path && { key: 'path', text: anatomy.path, label: 'Caminho', help: 'A página dentro do site. Não muda quem é o dono.' },
    anatomy.query && { key: 'query', text: anatomy.query, label: 'Detalhes', help: 'Informações extras do link.' },
  ].filter(Boolean);

  return (
    <div className="anatomy">
      <p className="anatomy__url" aria-label="Endereço dividido em partes">
        {parts.map((part) => (
          <span key={part.key} className={`anatomy__part anatomy__part--${part.key}`}>
            {part.text}
          </span>
        ))}
      </p>
      <dl className="anatomy__legend">
        {parts.map((part) => (
          <div key={part.key} className="anatomy__item">
            <dt>
              <span className={`anatomy__swatch anatomy__part--${part.key}`} aria-hidden="true" />
              {part.label}
            </dt>
            <dd>
              <code>{part.text}</code> {part.help}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Result({ result }) {
  if (!result.ok) {
    return (
      <Callout variant="info" title={result.original ? `"${result.original.slice(0, 80)}"` : undefined}>
        <p>{result.error}</p>
      </Callout>
    );
  }

  const verdict = VERDICTS[result.verdict];
  const VerdictIcon = VERDICT_ICONS[result.verdict];

  return (
    <article className={`result result--${result.verdict}`}>
      <header className="result__header">
        <VerdictIcon size={36} aria-hidden="true" />
        <div>
          <h2 className="result__title">{verdict.title}</h2>
          <p className="result__summary">{verdict.summary}</p>
        </div>
      </header>

      <div className="result__body">
        <h3>Como ler este endereço</h3>
        <Anatomy anatomy={result.anatomy} />

        <h3>O que encontramos</h3>
        <ul className="checks">
          {result.checks.map((check) => {
            const CheckIcon = CHECK_ICONS[check.level];
            return (
              <li key={check.title} className={`check check--${check.level}`}>
                <CheckIcon size={20} aria-hidden="true" />
                <div>
                  <p className="check__title">
                    <span className="sr-only">{CHECK_LABELS[check.level]}: </span>
                    {check.title}
                  </p>
                  <p className="check__detail">{check.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="result__advice">
          <strong>O que fazer agora:</strong> {verdict.advice}
        </p>
      </div>
    </article>
  );
}

export function VerificadorPage() {
  usePageTitle('Esse link é oficial?');
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);

  function analyze(value = input) {
    const urls = extractUrls(value);
    const analyses = urls.length ? urls.slice(0, 5).map(analyzeUrl) : [analyzeUrl(value)];
    setResults(analyses);
  }

  function onSubmit(event) {
    event.preventDefault();
    analyze();
  }

  function tryExample(value) {
    setInput(value);
    analyze(value);
  }

  return (
    <div className="container page page--narrow">
      <header className="page-header">
        <h1>Esse link é oficial?</h1>
        <p className="page-header__lead">
          Cole um link ou a mensagem inteira que você recebeu. O site mostra se o endereço é do governo e quais sinais de
          golpe ele tem.
        </p>
      </header>

      <form className="card checker-form" onSubmit={onSubmit}>
        <label htmlFor="link" className="checker-form__label">
          Link ou mensagem
        </label>
        <textarea
          id="link"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ex.: https://www.gov.br ou cole aqui o SMS que você recebeu"
          rows={3}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
        <button type="submit" className="button button--primary" disabled={!input.trim()}>
          <ScanSearch size={18} aria-hidden="true" /> Analisar
        </button>
        <p className="checker-form__privacy">
          <Lock size={14} aria-hidden="true" /> A análise acontece no seu aparelho. O link não é aberto nem enviado para
          ninguém.
        </p>
      </form>

      <div className="examples">
        <p className="examples__title">Experimente um exemplo:</p>
        <ul>
          {EXEMPLOS.map((exemplo) => (
            <li key={exemplo.rotulo}>
              <button type="button" className="filter-chip" onClick={() => tryExample(exemplo.valor)}>
                {exemplo.rotulo}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div aria-live="polite">
        {results && (
          <section className="results" aria-label="Resultado da análise">
            {results.length > 1 && <p className="results__count">Encontramos {results.length} links na mensagem.</p>}
            {results.map((result, index) => (
              <Result key={`${result.original}-${index}`} result={result} />
            ))}
          </section>
        )}
      </div>

      <section className="section learn" aria-labelledby="titulo-aprenda">
        <h2 id="titulo-aprenda">Aprenda a conferir sozinho</h2>
        <ol className="tema-lista">
          <li>Olhe o trecho entre o <code>//</code> e a primeira barra <code>/</code>. Esse é o nome do site.</li>
          <li>
            O que vale é o <strong>final</strong> desse nome. Sites do governo terminam em <code>.gov.br</code>; da
            Justiça, em <code>.jus.br</code>.
          </li>
          <li>
            Palavras como "gov", "receita" ou "cpf" no começo ou no meio não provam nada. Golpistas usam esses nomes de
            propósito.
          </li>
          <li>Desconfie de links encurtados, de um "@" no meio do endereço e de mensagens com pressa ou ameaça.</li>
        </ol>
        <Callout variant="info">
          <p>
            Esta ferramenta é educativa e não substitui o seu cuidado. Mesmo quando o site é oficial, prefira digitar o
            endereço ou abrir o aplicativo oficial em vez de clicar em links recebidos por mensagem.
          </p>
        </Callout>
      </section>
    </div>
  );
}
