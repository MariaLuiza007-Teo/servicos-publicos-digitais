import { BookOpen, Link2, MessageCircleQuestion } from 'lucide-react';
import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FontSizeControl } from './FontSizeControl.jsx';

// As três abas do site. O Guia é a aba principal e inclui /guia/* e /servicos.
const TABS = [
  { to: '/', label: 'Guia do Cidadão', Icon: BookOpen },
  { to: '/assistente', label: 'Qual serviço eu preciso?', Icon: MessageCircleQuestion },
  { to: '/verificador', label: 'Esse link é oficial?', Icon: Link2 },
];

function isGuideActive(pathname) {
  return pathname === '/' || pathname.startsWith('/guia') || pathname.startsWith('/servicos');
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function Layout() {
  const { pathname } = useLocation();

  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="site-header">
        <div className="container site-header__top">
          <Link to="/" className="brand">
            <svg className="brand__mark" viewBox="0 0 64 64" aria-hidden="true">
              <rect width="64" height="64" rx="14" />
              <path d="M32 12 48 18v12c0 11-7 19-16 22-9-3-16-11-16-22V18z" className="brand__shield" />
              <path d="m25 32 5 5 10-11" className="brand__check" />
            </svg>
            <span className="brand__text">
              <span className="brand__name">Guia do Cidadão Digital</span>
              <span className="brand__tagline">Serviços públicos na palma da mão</span>
            </span>
          </Link>
          <FontSizeControl />
        </div>

        <nav className="tabs" aria-label="Seções do site">
          <div className="container tabs__list">
            {TABS.map(({ to, label, Icon }) => {
              const active = to === '/' ? isGuideActive(pathname) : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`tabs__item${active ? ' is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main id="conteudo" tabIndex={-1} className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>
            <strong>Este não é um site do governo.</strong> É um projeto de extensão de estudantes de
            Sistemas de Informação.
          </p>
          <p>
            Os serviços citados aqui são oficiais e gratuitos. Sempre confira as informações nos sites que terminam
            em <strong>.gov.br</strong>.
          </p>
          <p className="site-footer__small">Este site não coleta dados pessoais e não usa cookies de rastreamento.</p>
        </div>
      </footer>
    </>
  );
}
