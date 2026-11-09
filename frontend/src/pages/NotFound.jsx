import { Link } from 'react-router-dom';
import { usePageTitle } from '../lib/usePageTitle.js';

export function NotFound() {
  usePageTitle('Página não encontrada');
  return (
    <div className="container page page--narrow empty-state">
      <h1>Página não encontrada</h1>
      <p>O endereço que você abriu não existe neste site.</p>
      <Link to="/" className="button button--primary">
        Voltar para o Guia
      </Link>
    </div>
  );
}
