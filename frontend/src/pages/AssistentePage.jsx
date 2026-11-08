import { Bot, LoaderCircle, RotateCcw, Send, Square, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { Callout } from '../components/Callout.jsx';
import { ExternalLink } from '../components/ExternalLink.jsx';
import { getHealth, streamChat } from '../lib/chatApi.js';
import { analyzeUrl } from '../lib/linkChecker.js';
import { MASK_NAMES, maskSensitive } from '../lib/privacy.js';

const MAX_CHARS = 1000;

const SUGESTOES = [
  'Vou fazer o ENEM. O que eu preciso?',
  'Estou procurando meu primeiro emprego.',
  'Onde vejo minha carteira de vacinação?',
  'Vou fazer 18 anos. O que muda para mim?',
  'Recebi uma mensagem dizendo que meu CPF vai ser cancelado.',
];

let nextId = 0;
const newId = () => `m${(nextId += 1)}`;

/** Links nas respostas da IA abrem em nova aba e ganham aviso se não forem oficiais. */
function MarkdownLink({ href = '', children }) {
  const analysis = /^https?:\/\//i.test(href) ? analyzeUrl(href) : null;
  const oficial = analysis?.ok && analysis.verdict === 'oficial';
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow">
      {children}
      {analysis && !oficial && <span className="badge badge--alerta">não é .gov.br</span>}
    </a>
  );
}

function StatusBar({ health }) {
  if (health.status === 'checking') return <p className="status">Conectando ao assistente...</p>;
  if (health.status === 'offline') {
    return (
      <p className="status status--offline">
        <span className="status__dot" aria-hidden="true" /> Assistente fora do ar no momento.
      </p>
    );
  }
  const demo = health.llm?.provider === 'mock';
  return (
    <p className={`status ${demo ? 'status--demo' : 'status--online'}`}>
      <span className="status__dot" aria-hidden="true" />
      {demo ? 'Modo de demonstração (sem IA conectada)' : `Assistente conectado · ${health.llm?.model}`}
      {!health.rag?.ready && <span className="status__note"> · base de conhecimento em construção</span>}
    </p>
  );
}

function Message({ message, onRetry }) {
  if (message.role === 'user') {
    return (
      <li className="msg msg--user">
        <div className="msg__bubble">
          <p className="msg__text">{message.content}</p>
          {message.masked?.length > 0 && (
            <p className="msg__masked">
              Ocultamos {message.masked.map((type) => MASK_NAMES[type]).join(' e ')} para proteger você.
            </p>
          )}
        </div>
        <User className="msg__avatar" size={22} aria-hidden="true" />
      </li>
    );
  }

  return (
    <li className="msg msg--assistant">
      <Bot className="msg__avatar" size={22} aria-hidden="true" />
      <div className="msg__bubble">
        <span className="sr-only">Assistente:</span>
        {message.content ? (
          <div className="msg__markdown">
            <ReactMarkdown components={{ a: MarkdownLink }} disallowedElements={['img']} unwrapDisallowed>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          message.pending && (
            <p className="msg__thinking">
              <LoaderCircle className="spin" size={18} aria-hidden="true" /> Pensando...
            </p>
          )
        )}

        {message.stopped && <p className="msg__note">Resposta interrompida.</p>}

        {message.error && (
          <Callout variant="perigo">
            <p>{message.error}</p>
            <button type="button" className="button button--small" onClick={onRetry}>
              <RotateCcw size={16} aria-hidden="true" /> Tentar de novo
            </button>
          </Callout>
        )}

        {message.sources?.length > 0 && !message.pending && (
          <div className="msg__sources">
            <p>Fontes consultadas:</p>
            <ul>
              {message.sources.map((source) =>
                source.url ? (
                  <li key={source.title}>
                    <ExternalLink href={source.url}>{source.title}</ExternalLink>
                  </li>
                ) : (
                  <li key={source.title}>{source.title}</li>
                ),
              )}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
}

export function AssistentePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [health, setHealth] = useState({ status: 'checking' });
  const [announcement, setAnnouncement] = useState('');
  const controllerRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    getHealth({ signal: controller.signal })
      .then((data) => setHealth({ status: 'online', ...data }))
      .catch((error) => {
        if (error.name !== 'AbortError') setHealth({ status: 'offline' });
      });
    return () => controller.abort();
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  const update = (id, change) =>
    setMessages((current) => current.map((message) => (message.id === id ? { ...message, ...change(message) } : message)));

  async function send(rawText, baseMessages = messages) {
    const { text, found } = maskSensitive(rawText.trim().slice(0, MAX_CHARS));
    if (!text || streaming) return;

    const userMessage = { id: newId(), role: 'user', content: text, masked: found };
    const assistantId = newId();
    const history = [
      ...baseMessages
        .filter((message) => message.content && !message.error)
        .map(({ role, content }) => ({ role, content })),
      { role: 'user', content: text },
    ];

    setMessages([...baseMessages, userMessage, { id: assistantId, role: 'assistant', content: '', pending: true }]);
    setInput('');
    setStreaming(true);
    setAnnouncement('');

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      await streamChat({
        messages: history,
        signal: controller.signal,
        onMeta: (meta) => update(assistantId, () => ({ sources: meta.sources ?? [] })),
        onToken: (token) => update(assistantId, (message) => ({ content: message.content + token })),
      });
      setAnnouncement('Resposta pronta.');
    } catch (error) {
      if (error.name === 'AbortError') {
        update(assistantId, () => ({ stopped: true }));
      } else {
        update(assistantId, () => ({ error: error.message, retryText: text }));
        setAnnouncement('Erro ao gerar a resposta.');
      }
    } finally {
      update(assistantId, () => ({ pending: false }));
      setStreaming(false);
      controllerRef.current = null;
    }
  }

  function retry(message) {
    const index = messages.findIndex((item) => item.id === message.id);
    // Remove a pergunta e a resposta com erro e pergunta de novo.
    send(message.retryText, messages.slice(0, Math.max(0, index - 1)));
  }

  function reset() {
    controllerRef.current?.abort();
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  }

  function onSubmit(event) {
    event.preventDefault();
    send(input);
  }

  function onKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send(input);
    }
  }

  return (
    <div className="container page page--narrow">
      <header className="page-header">
        <h1>Qual serviço eu preciso?</h1>
        <p className="page-header__lead">
          Conte o que você quer resolver. O assistente indica o serviço público e onde acessá-lo com segurança.
        </p>
      </header>

      <Callout variant="alerta" title="Proteja seus dados">
        <p>
          Não escreva CPF, senhas, códigos ou número de cartão. Se escrever, o site oculta essas informações antes de
          enviar.
        </p>
      </Callout>

      <section className="chat card" aria-label="Conversa com o assistente">
        <div className="chat__top">
          <StatusBar health={health} />
          {messages.length > 0 && (
            <button type="button" className="button button--small button--ghost" onClick={reset}>
              <RotateCcw size={16} aria-hidden="true" /> Nova conversa
            </button>
          )}
        </div>

        <ul className="chat__messages" ref={listRef}>
          <li className="msg msg--assistant">
            <Bot className="msg__avatar" size={22} aria-hidden="true" />
            <div className="msg__bubble">
              <p>
                Olá! Eu ajudo você a descobrir qual serviço público resolve o que você precisa. Escreva sua dúvida
                ou escolha um exemplo.
              </p>
            </div>
          </li>
          {messages.map((message) => (
            <Message key={message.id} message={message} onRetry={() => retry(message)} />
          ))}
        </ul>

        {messages.length === 0 && (
          <div className="suggestions">
            <p className="suggestions__title">Exemplos de perguntas:</p>
            <ul>
              {SUGESTOES.map((sugestao) => (
                <li key={sugestao}>
                  <button
                    type="button"
                    className="suggestion"
                    onClick={() => send(sugestao)}
                    disabled={streaming || health.status === 'offline'}
                  >
                    {sugestao}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form className="composer" onSubmit={onSubmit}>
          <label htmlFor="pergunta" className="sr-only">
            Sua pergunta
          </label>
          <textarea
            id="pergunta"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value.slice(0, MAX_CHARS))}
            onKeyDown={onKeyDown}
            placeholder="Ex.: quero tirar meu título de eleitor"
            rows={2}
            maxLength={MAX_CHARS}
            disabled={health.status === 'offline'}
          />
          <div className="composer__actions">
            <span className="composer__count" aria-hidden="true">
              {input.length}/{MAX_CHARS}
            </span>
            {streaming ? (
              <button type="button" className="button button--ghost" onClick={() => controllerRef.current?.abort()}>
                <Square size={16} aria-hidden="true" /> Parar
              </button>
            ) : (
              <button type="submit" className="button button--primary" disabled={!input.trim() || health.status === 'offline'}>
                <Send size={18} aria-hidden="true" /> Enviar
              </button>
            )}
          </div>
        </form>

        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </section>

      <p className="disclaimer">
        As respostas são geradas por inteligência artificial e podem conter erros. Confirme sempre no site oficial. Para
        conferir um endereço, use a aba <Link to="/verificador">Esse link é oficial?</Link>
      </p>
    </div>
  );
}
