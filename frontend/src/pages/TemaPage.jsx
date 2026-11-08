import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Callout } from '../components/Callout.jsx';
import { ExternalLink } from '../components/ExternalLink.jsx';
import { Icon } from '../components/icons.jsx';
import { temas } from '../data/temas.js';
import { NotFound } from './NotFound.jsx';

function Secao({ secao }) {
  const List = secao.ordenada ? 'ol' : 'ul';
  return (
    <section className="tema-secao">
      <h2>{secao.titulo}</h2>
      {secao.paragrafos?.map((paragrafo) => (
        <p key={paragrafo}>{paragrafo}</p>
      ))}
      {secao.itens && (
        <List className="tema-lista">
          {secao.itens.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </List>
      )}
      {secao.nota && <p className="tema-nota">{secao.nota}</p>}
    </section>
  );
}

export function TemaPage() {
  const { temaId } = useParams();
  const index = temas.findIndex((tema) => tema.id === temaId);
  if (index < 0) return <NotFound />;

  const tema = temas[index];
  const anterior = temas[index - 1];
  const proximo = temas[index + 1];

  return (
    <article className="container page page--narrow">
      <nav aria-label="Você está em" className="breadcrumb">
        <Link to="/">Guia</Link>
        <span aria-hidden="true"> › </span>
        <span>Tema {tema.numero}</span>
      </nav>

      <header className="tema-header">
        <Icon name={tema.icone} size={40} className="tema-header__icon" />
        <div>
          <p className="tema-header__kicker">Tema {tema.numero} de {temas.length}</p>
          <h1>{tema.titulo}</h1>
          <p className="tema-header__subtitle">{tema.subtitulo}</p>
        </div>
      </header>

      {tema.secoes.map((secao) => (
        <Secao key={secao.titulo} secao={secao} />
      ))}

      <Callout variant="ok" title="Para lembrar">
        <p>{tema.importante}</p>
      </Callout>

      {tema.acoes?.length > 0 && (
        <div className="tema-acoes">
          {tema.acoes.map((acao) => (
            <Link key={acao.para} to={acao.para} className="button button--primary">
              {acao.rotulo} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}

      <section className="fontes" aria-labelledby="titulo-fontes">
        <h2 id="titulo-fontes">Fontes oficiais</h2>
        <ul>
          {tema.fontes.map((fonte) => (
            <li key={fonte.url}>
              <ExternalLink href={fonte.url}>{fonte.nome}</ExternalLink>
            </li>
          ))}
        </ul>
      </section>

      <nav className="pager" aria-label="Outros temas">
        {anterior ? (
          <Link to={`/guia/${anterior.id}`} className="pager__link">
            <ArrowLeft size={18} aria-hidden="true" />
            <span>
              <small>Tema anterior</small>
              {anterior.titulo}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {proximo ? (
          <Link to={`/guia/${proximo.id}`} className="pager__link pager__link--next">
            <span>
              <small>Próximo tema</small>
              {proximo.titulo}
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        ) : (
          <Link to="/servicos" className="pager__link pager__link--next">
            <span>
              <small>Agora, na prática</small>
              Catálogo de serviços
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        )}
      </nav>
    </article>
  );
}
