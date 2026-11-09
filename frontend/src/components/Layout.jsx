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

function isActive(to, pathname) {
  return to === '/' ? isGuideActive(pathname) : pathname.startsWith(to);
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function BrandMark() {
  return (
    <svg className="brand__mark" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" />
      <path d="M32 12 48 18v12c0 11-7 19-16 22-9-3-16-11-16-22V18z" className="brand__shield" />
      <path d="m25 32 5 5 10-11" className="brand__check" />
    </svg>
  );
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
        <div className="container site-header__inner">
          <Link to="/" className="brand">
            <BrandMark />
            <span className="brand__name">Guia do Cidadão Digital</span>
          </Link>

          <nav className="site-nav" aria-label="Seções do site">
            {TABS.map(({ to, label, Icon }) => {
              const active = isActive(to, pathname);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`site-nav__link${active ? ' is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <FontSizeControl />
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div className="site-footer__about">
            <p className="site-footer__brand">
              <BrandMark />
              Guia do Cidadão Digital
            </p>
            <p>
              <strong>Este não é um site do governo.</strong> É um projeto de extensão de estudantes de Sistemas de
              Informação.
            </p>
            <p>
              Os serviços citados aqui são oficiais e gratuitos. Sempre confira as informações nos sites que terminam
              em <strong>.gov.br</strong>.
            </p>
          </div>

          <nav className="site-footer__nav" aria-label="Rodapé">
            <p className="site-footer__title">No site</p>
            <ul>
              <li>
                <Link to="/">Guia do Cidadão</Link>
              </li>
              <li>
                <Link to="/servicos">Serviços públicos</Link>
              </li>
              <li>
                <Link to="/assistente">Qual serviço eu preciso?</Link>
              </li>
              <li>
                <Link to="/verificador">Esse link é oficial?</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="container">
          <p className="site-footer__small">Este site não coleta dados pessoais e não usa cookies de rastreamento.</p>
        </div>
      </footer>
    </>
  );
}
