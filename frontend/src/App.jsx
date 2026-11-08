import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { GuiaHome } from './pages/GuiaHome.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { ServicosPage } from './pages/ServicosPage.jsx';
import { TemaPage } from './pages/TemaPage.jsx';
import { VerificadorPage } from './pages/VerificadorPage.jsx';

// O assistente usa a biblioteca de Markdown (pesada): só baixamos quando a pessoa abre a aba.
const AssistentePage = lazy(() =>
  import('./pages/AssistentePage.jsx').then((module) => ({ default: module.AssistentePage })),
);

function Carregando() {
  return (
    <div className="container page">
      <p>Carregando...</p>
    </div>
  );
}

// Mapa de páginas do site. Aba principal: Guia (/, /guia/:temaId, /servicos).
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<GuiaHome />} />
        <Route path="guia/:temaId" element={<TemaPage />} />
        <Route path="servicos" element={<ServicosPage />} />
        <Route
          path="assistente"
          element={
            <Suspense fallback={<Carregando />}>
              <AssistentePage />
            </Suspense>
          }
        />
        <Route path="verificador" element={<VerificadorPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
