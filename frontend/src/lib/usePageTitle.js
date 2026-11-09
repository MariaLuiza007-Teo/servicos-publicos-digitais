import { useEffect } from 'react';

const SITE_NAME = 'Guia do Cidadão Digital';

/**
 * Muda o título da aba do navegador (e o que o leitor de tela anuncia ao trocar de página).
 * Sem título, mostra só o nome do site.
 * @param {string} [title]
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}
