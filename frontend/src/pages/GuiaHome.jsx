import { ArrowRight, Link2, MessageCircleQuestion, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/icons.jsx';
import { categorias, servicos } from '../data/servicos.js';
import { temas } from '../data/temas.js';

export function GuiaHome() {
  const destaques = servicos.filter((servico) => servico.destaque);

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="kicker">Projeto de extensão · Inclusão digital</p>
            <h1 className="hero__title">Resolva sua vida pelo celular, com segurança</h1>
            <p className="hero__lead">
              Aprenda a usar os serviços públicos digitais com autonomia: tirar documentos, acompanhar o ENEM, cuidar
              da saúde e fugir de golpes, sem depender de ninguém.
            </p>
            <div className="hero__actions">
              <a href="#temas" className="button button--primary">
                Começar pelo guia <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Link to="/servicos" className="button button--ghost">
                Ver serviços
              </Link>
            </div>
          </div>

          <aside className="golden-rule" aria-labelledby="titulo-regra">
            <ShieldCheck className="golden-rule__icon" size={28} aria-hidden="true" />
            <h2 id="titulo-regra" className="golden-rule__title">
              Regra de ouro
            </h2>
            <p>
              Site oficial do governo termina em <strong>.gov.br</strong>.
            </p>
            <p className="golden-rule__example" aria-hidden="true">
              https://www.<mark>gov.br</mark>/inep
            </p>
            <p>Na dúvida, não clique em links de mensagens: digite o endereço você mesmo ou abra o aplicativo oficial.</p>
          </aside>
        </div>
      </section>

      <div className="container page">
        <section id="temas" className="section section--split" aria-labelledby="titulo-temas">
          <div className="section__intro">
            <h2 id="titulo-temas" className="section__title">
              Temas do guia
            </h2>
            <p className="section__lead">Cinco assuntos para você usar a internet a seu favor. Leia na ordem ou escolha um.</p>
          </div>
          <ol className="tema-list">
            {temas.map((tema) => (
              <li key={tema.id}>
                <Link to={`/guia/${tema.id}`} className="tema-list__link">
                  <span className="tema-list__number" aria-hidden="true">
                    {tema.numero}
                  </span>
                  <span className="tema-list__text">
                    <span className="tema-list__title">{tema.titulo}</span>
                    <span className="tema-list__subtitle">{tema.subtitulo}</span>
                  </span>
                  <ArrowRight className="tema-list__arrow" size={20} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="section section--split" aria-labelledby="titulo-ferramentas">
          <div className="section__intro">
            <h2 id="titulo-ferramentas" className="section__title">
              Ferramentas
            </h2>
            <p className="section__lead">Para quando você tiver uma dúvida agora.</p>
          </div>
          <div className="tool-grid">
            <Link to="/assistente" className="card card--link tool-card">
              <MessageCircleQuestion size={24} aria-hidden="true" className="tool-card__icon" />
              <span className="tool-card__title">Qual serviço eu preciso?</span>
              <span className="tool-card__text">
                Conte o que você quer resolver e o assistente indica o serviço público e onde acessá-lo.
              </span>
            </Link>
            <Link to="/verificador" className="card card--link tool-card">
              <Link2 size={24} aria-hidden="true" className="tool-card__icon" />
              <span className="tool-card__title">Esse link é oficial?</span>
              <span className="tool-card__text">
                Cole um link ou uma mensagem suspeita e descubra se o endereço é mesmo do governo.
              </span>
            </Link>
          </div>
        </section>

        <section className="section section--split" aria-labelledby="titulo-servicos">
          <div className="section__intro">
            <h2 id="titulo-servicos" className="section__title">
              Serviços mais procurados
            </h2>
            <p className="section__lead">Todos gratuitos, com o link oficial.</p>
          </div>
          <div>
            <ul className="chip-list">
              {destaques.map((servico) => {
                const categoria = categorias.find((c) => c.id === servico.categoria);
                return (
                  <li key={servico.id}>
                    <Link to={`/servicos#${servico.id}`} className="service-chip">
                      <Icon name={categoria?.icone} size={18} />
                      {servico.nome}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link to="/servicos" className="text-link">
              Ver todos os {servicos.length} serviços <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
