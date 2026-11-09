import { Search, TriangleAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExternalLink, hostOf } from '../components/ExternalLink.jsx';
import { Icon } from '../components/icons.jsx';
import { categorias, getCategoria, servicos } from '../data/servicos.js';
import { usePageTitle } from '../lib/usePageTitle.js';

const normalize = (text) =>
  String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export function ServicosPage() {
  usePageTitle('Serviços públicos digitais');
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const { hash } = useLocation();

  // Ao chegar por /servicos#enem, rola até o cartão do serviço.
  useEffect(() => {
    if (!hash) return;
    const element = document.getElementById(hash.slice(1));
    element?.scrollIntoView({ block: 'start' });
    element?.focus({ preventScroll: true });
  }, [hash]);

  const filtrados = useMemo(() => {
    const termo = normalize(busca.trim());
    return servicos.filter((servico) => {
      if (categoria !== 'todas' && servico.categoria !== categoria) return false;
      if (!termo) return true;
      return normalize(`${servico.nome} ${servico.descricao} ${servico.paraQuem} ${servico.app ?? ''}`).includes(termo);
    });
  }, [busca, categoria]);

  return (
    <div className="container page">
      <nav aria-label="Você está em" className="breadcrumb">
        <Link to="/">Guia</Link>
        <span aria-hidden="true"> › </span>
        <span>Serviços</span>
      </nav>

      <header className="page-header">
        <h1>Serviços públicos digitais</h1>
        <p className="page-header__lead">
          Os principais serviços para quem está no Ensino Médio. Todos são gratuitos e os links levam aos
          sites oficiais.
        </p>
      </header>

      <div className="servicos-layout">
        <div className="filters">
          <label className="search">
            <Search size={20} aria-hidden="true" />
            <span className="sr-only">Buscar serviço</span>
            <input
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Ex.: vacina, ENEM"
            />
          </label>
          <p className="filters__title" id="titulo-categorias">
            Categorias
          </p>
          <div className="filter-chips" role="group" aria-labelledby="titulo-categorias">
            {[{ id: 'todas', nome: 'Todas' }, ...categorias].map((item) => (
              <button
                key={item.id}
                type="button"
                className="filter-chip"
                aria-pressed={categoria === item.id}
                onClick={() => setCategoria(item.id)}
              >
                {item.icone && <Icon name={item.icone} size={16} />}
                {item.nome}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="sr-only" aria-live="polite">
            {filtrados.length} serviço(s) encontrado(s).
          </p>

          {filtrados.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum serviço encontrado.</p>
              <p>
                Tente outra palavra ou pergunte ao assistente <Link to="/assistente">Qual serviço eu preciso?</Link>
              </p>
            </div>
          ) : (
            <ul className="service-grid">
              {filtrados.map((servico) => {
                const cat = getCategoria(servico.categoria);
                return (
                  <li key={servico.id} id={servico.id} tabIndex={-1} className="card service-card">
                    <span className={`tag tag--${servico.categoria}`}>
                      <Icon name={cat?.icone} size={14} />
                      {cat?.nome}
                    </span>
                    <h2 className="service-card__title">{servico.nome}</h2>
                    <p>{servico.descricao}</p>
                    <dl className="service-card__facts">
                      <dt>Para quem</dt>
                      <dd>{servico.paraQuem}</dd>
                      {servico.app && (
                        <>
                          <dt>Aplicativo</dt>
                          <dd>{servico.app}</dd>
                        </>
                      )}
                    </dl>
                    <p className="service-card__warning">
                      <TriangleAlert size={16} aria-hidden="true" />
                      <span>{servico.cuidado}</span>
                    </p>
                    <ExternalLink href={servico.onde.url} className="button button--ghost service-card__cta">
                      Acessar {hostOf(servico.onde.url)}
                    </ExternalLink>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
